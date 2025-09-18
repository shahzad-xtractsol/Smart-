"use client";

import React, { useEffect, useRef, useState } from "react";
import CustomCKEditor from "../CustomCKEditor";

import titleSearchService from "../../lib/services/titleSearch.service";

import DialogModelTemplate from "../DialogModelTemplate";
import SuccessDialog from "../SuccessDialog";
import ErrorDialog from "../ErrorDialog";
import MainCard from "../MainCard";
import ShareAiSummaryDialog from "../ShareAiSummaryDialog";
import ShareTitleCommitmentDialog from "../ShareTitleCommitmentDialog";

type Params = { id?: string | string[] };

interface AIGeneratedSummaryProps {
  id?: string | string[];
  title?: string;
}

const AIGeneratedSummary: React.FC<AIGeneratedSummaryProps> = ({
  id,
  title = "AI Generated Summary",
}) => {
  const resolvedTitle = String(title || "AI Generated Summary");
  const isTitleCommitment =
    resolvedTitle.toLowerCase().includes("title commitment") ||
    resolvedTitle.toLowerCase().includes("titlecommitment");

  const previewRef = useRef<HTMLDivElement>(null);

  const [serverHtml, setServerHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [tryAgainOpen, setTryAgainOpen] = useState(false);
  const [tryAgainText, setTryAgainText] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successDialogMessage, setSuccessDialogMessage] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");
  // share dialog states (used by share dialogs)
  const [shareTitleCommitmentDialogOpen, setShareTitleCommitmentDialogOpen] =
    useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<
    string | undefined
  >(Array.isArray(id) ? (id as string[])[0] : (id as string | undefined));
  const [aiSummary, setAiSummary] = useState<string>("");
  const [currentId, setCurrentId] = useState<any>(id);
  const [titleCommitmentHtml, setTitleCommitmentHtml] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  async function loadSummary() {
    if (!id) return;
    try {
      setLoading(true);
      if (isTitleCommitment) {
        const url = await titleSearchService.downloadTitleCommitmentOutside(id);
        setPdfFile(url?.data?.url);

        const res = await titleSearchService.getTitleCommitment(id);
        const html = res?.data?.titleCommitmentText || "";
        setServerHtml(html);
      } else {
        const url = await titleSearchService.downloadTitleCommitmentOutside(id);
        setPdfFile(url?.data?.url);

        const res = await titleSearchService.getAiSummary(id, {});
        const html = res?.data?.summary || "";
        setServerHtml(html);
      }
    } catch (e) {
      console.error("Failed to load AI summary", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, title]);

  // keep share-related state in sync with loaded html and id
  useEffect(() => {
    setSelectedVersionId(
      Array.isArray(id) ? (id as string[])[0] : (id as string | undefined)
    );
    setCurrentId(id);
  }, [serverHtml, id]);

  async function saveSummary() {
    if (!id) return;
    try {
      setSaving(true);
      const html = isEditing
        ? previewRef.current?.innerHTML || serverHtml
        : serverHtml;
      if (isTitleCommitment) {
        await titleSearchService.updateTitleCommitment(id, {
          text: html,
        } as any);
        setSuccessDialogMessage("Title commitment saved successfully");
      } else {
        await titleSearchService.updateAiSummary(id, { text: html } as any);
        setSuccessDialogMessage("AI summary saved successfully");
      }
      setServerHtml(html);
      setIsEditing(false);
      setSuccessDialogOpen(true);
    } catch (e) {
      console.error("Failed to save AI summary", e);
    } finally {
      setSaving(false);
    }
  }

  async function downloadSummary() {
    if (!id) return;
    try {
      setDownloading(true);
      if (isTitleCommitment) {
        const res = await titleSearchService.downloadTitleCommitmentOutside(id);
        const url = res?.data?.url;
        if (url) {
          window.open(url, "_blank");
          setSuccessDialogMessage("Download started");
          setSuccessDialogOpen(true);
        } else {
          setErrorDialogMessage("No downloadable link available");
          setErrorDialogOpen(true);
        }
      } else {
        const res = await titleSearchService.getAiSummaryLink(id);
        const url = res?.data?.url;
        if (url) {
          window.open(url, "_blank");
          setSuccessDialogMessage("Download started");
          setSuccessDialogOpen(true);
        } else {
          setErrorDialogMessage("No downloadable link available");
          setErrorDialogOpen(true);
        }
      }
    } catch (e) {
      console.error("Failed to get download link", e);
    } finally {
      setDownloading(false);
    }
  }

  async function confirmTryAgain() {
    setTryAgainOpen(false);
    if (!id) return;
    try {
      setLoading(true);
      if (isTitleCommitment) {
        await titleSearchService.retryTitleCommitment(id, {
          additionalInformation: tryAgainText,
        });
      } else {
        await titleSearchService.retryAiSummary(id, {
          additionalInformation: tryAgainText,
        });
      }
      await loadSummary();
      setSuccessDialogMessage(
        isTitleCommitment
          ? "Title commitment refreshed"
          : "AI summary refreshed"
      );
      setSuccessDialogOpen(true);
    } catch (e) {
      console.error("Failed to retry AI summary", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainCard
      title={resolvedTitle}
      secondary={
        <div className="flex gap-3">
          <button
            onClick={downloadSummary}
            disabled={!id || downloading}
            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg  disabled:opacity-50 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {downloading ? "Downloading…" : "Download"}
          </button>
          <button
            onClick={() =>
              isTitleCommitment
                ? setShareTitleCommitmentDialogOpen(true)
                : setShareDialogOpen(true)
            }
            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
          >
            Share/Copy
          </button>
          <button
            onClick={() => setTryAgainOpen(true)}
            disabled={!id || loading}
            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800  disabled:opacity-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? "Please wait…" : "Try Again"}
          </button>
          <button
            onClick={() => setIsEditing((v) => !v)}
            disabled={!id || loading}
            className="px-3 py-2 text-xs font-medium text-center border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            {isEditing ? "Preview" : "Edit"}
          </button>

          <button
            onClick={saveSummary}
            disabled={!id || saving}
            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      }
    >
      <style>{`
            .ai-html { font-family: Calibri, Arial, sans-serif; color:#1e1e1e; line-height:1.5; }
            .ai-html h1{font-size:28pt;font-weight:700;margin:12px 0}
            .ai-html h2{font-size:16pt;font-weight:700;margin:8px 0}
            .ai-html h3{font-size:14pt;font-weight:700;margin:6px 0}
            .ai-html p{font-size:12pt;margin:6px 0}
            .ai-html ul{padding-left:20px;margin:6px 0;list-style:disc}
            .ai-html li{margin-bottom:4px}
            .ai-html hr{border:none;border-top:1px solid #ccc;margin:12px 0}
            .ai-html table{border-collapse:collapse;width:100%;margin:12px 0}
            .ai-html thead{display:table-header-group;font-weight:900}
            .ai-html th,.ai-html td{border:1px solid #ddd;padding:6px;font-size:10pt;text-align:left;vertical-align:top}
            .ai-html tbody tr:nth-child(even){}
            .ai-editable{min-height:320px; outline:none; border:1px solid #e0e0e0; border-radius:8px; padding:16px}
          `}</style>

      {isEditing ? (
        <div className="ai-html ai-editable">
          <CustomCKEditor
            value={serverHtml}
            onChange={(html) => setServerHtml(html)}
          />
        </div>
      ) : (
        <div
          ref={previewRef}
          className="ai-html"
          style={{ minHeight: 240 }}
          dangerouslySetInnerHTML={{ __html: serverHtml || "<p><br/></p>" }}
        />
      )}

      {!id && (
        <div className="text-sm text-gray-500 mt-3">
          Missing title search id; actions are disabled.
        </div>
      )}

      {/* Tailwind modal for Try Again */}
      <DialogModelTemplate
        title="Additional Information"
        isOpen={tryAgainOpen}
        onClose={() => setTryAgainOpen(false)}
        onSave={confirmTryAgain}
        primaryLabel="Save"
        secondaryLabel="Cancel"
      >
        <textarea
          value={tryAgainText}
          onChange={(e) => setTryAgainText(e.target.value)}
          className="w-full h-40 border rounded p-3 text-sm"
          placeholder="Type additional information here..."
        />
      </DialogModelTemplate>
      <SuccessDialog
        isOpen={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title="Success"
        message={successDialogMessage}
      />
      <ErrorDialog
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="Error"
        message={errorDialogMessage}
      />
      {/* Mount dialogs */}
      <ShareAiSummaryDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        titleSearchId={selectedVersionId}
        summaryHtml={serverHtml}
        pdfFile={pdfFile}
      />
      <ShareTitleCommitmentDialog
        open={shareTitleCommitmentDialogOpen}
        onClose={() => setShareTitleCommitmentDialogOpen(false)}
        titleSearchId={currentId}
        summaryHtml={serverHtml || ""}
        pdfFile={pdfFile}
      />
    </MainCard>
  );
};

export default AIGeneratedSummary;