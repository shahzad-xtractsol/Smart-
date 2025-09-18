import React, { useEffect, useState } from "react";
import type { Property, EarnestMoneyData } from "../../types";
import { RefreshIcon, DownloadIcon, SendIcon } from "../icons";
import RequestEarnestMoneyView from "../RequestEarnestMoneyView";
import titleSearchService from "../../lib/services/titleSearch.service";
import transactionsService from "../../lib/services/transactions.service";
import { paymentStatusTypes } from "../../lib/payment-status-types";
import CircularLoader from "../CircularLoader";

interface EarnestMoneyViewProps {
  // property: Property;
  // onUpdateProperty: (property: Property) => void;
}

const InfoCard: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="p-4 bg-gray-50 rounded-lg border">
    <p className="text-sm text-gray-500">{label}</p>
    <div className="text-lg font-semibold text-gray-800 mt-1">{value}</div>
  </div>
);

const StatusView: React.FC<{
  data: EarnestMoneyData;
  onResendClick: () => void;
}> = ({ data, onResendClick }) => {
  const handleRefresh = () => {
    // In a real app, this would trigger an API call to refresh the status.
    console.log("Refreshing earnest money status...");
  };

  const StatusPill: React.FC<{ status: EarnestMoneyData["status"] }> = ({
    status,
  }) => {
// FIX: Updated getStatusColor to align with EarnestMoneyData status types.
    function getStatusColor(status: string) {
    switch (status) {
      case 'Paid':
        return '#2CA87F';
      case 'unpaid':
        return '#E58A00';
      case 'Received':
          return '#004EA8';
    }
  }
  

    return (
      <span
        className={`px-3 py-1 inline-block rounded-full text-sm font-semibold capitalize 
bg-[${getStatusColor(status)}] text-white`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Earnest Money Deposit
        </h2>
        <div className="flex items-center space-x-4">
          
          <button
            onClick={onResendClick}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <SendIcon className="w-4 h-4" />
            <span>Resend</span>
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshIcon className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
{/* FIX: Property 'address' does not exist on type 'EarnestMoneyData'. */}
       <InfoCard label="Address" value={data.address} />   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      
          <InfoCard label="Buyer Name" value={data.buyerName} />
          <InfoCard label="Status" value={<StatusPill status={data.status} />} />
        <InfoCard
          label="Deposit Amount"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.amount)}
        />
        <InfoCard
          label="Fee"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.fee)}
        />
        <InfoCard
          label="Date"
          value={new Date(data.date).toLocaleDateString()}
        />
        <InfoCard
          label="Receipt"
          value={ data.receiptUrl ? <a
              href={data.receiptUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Download </span>
            </a>: 'N/A'}
        />
      </div>
      </div>
    </div>
  );
};

interface RequestFormData {
  address: string;
  amount: string;
  buyerEmail: string;
  buyerName: string;
  agentName?: string;
  sellerName?: string;
}

const ResendModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [resendEmail, setResendEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleResendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      alert(`Earnest money request resent to ${resendEmail}`);
      setIsSending(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resend Request</h2>
        <p className="text-gray-600 mb-6">
          Enter the buyer's email address to send another earnest money request
          notification.
        </p>
        <form onSubmit={handleResendSubmit}>
          <label
            htmlFor="resend-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Buyer Email
          </label>
          <input
            id="resend-email"
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="buyer@example.com"
            required
          />
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || !resendEmail}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSending ? (
                <RefreshIcon className="w-5 h-5 animate-spin" />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EarnestMoneyView: React.FC<EarnestMoneyViewProps> = ({
  
}) => {
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tsProperty, setTsProperty] = useState<Property | null>(null);
  const [earnestData, setEarnestData] = useState<EarnestMoneyData | null>(null);

  const titleSearchId = 852;

  useEffect(() => {
    const loadAndCheck = async () => {
      try {
        if (!titleSearchId) return;
        setLoading(true);
        const res = await titleSearchService.getTitleSearchOrder(titleSearchId);
        // API shape: { status, statusCode, message, data: { ...property } }
        const payload = res?.data?.data ?? res?.data ?? res;
        console.log("Fetched title search data:", payload);
        setTsProperty(payload ?? null);

        // Now check recent transactions for a matching address and set earnestData immediately if found
        try {
          const tx = await transactionsService.getTransactions({ limit: 100, page: 1 });
          const charges = tx?.charges ?? [];
          const pAddr = ( payload.address ).toLowerCase();
          const matched = charges.find((c: any) => {
            const cAddr = (c.address || "").toLowerCase();
            return cAddr && pAddr && (cAddr === pAddr || pAddr.includes(cAddr) || cAddr.includes(pAddr));
          });
          if (matched) {
// FIX: Conversion of type '{ amount: number; fee: any; buyerName: any; status: any; date: any; receiptUrl: any; address: any; }' to type 'EarnestMoneyData' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
// Property 'buyerEmail' is missing in type '{ amount: number; fee: any; buyerName: any; status: any; date: any; receiptUrl: any; address: any; }' but required in type 'EarnestMoneyData'.
            const resultData = {
              amount: Number(matched.amount) || parseFloat(String(matched.amount)) || 0,
              fee: matched.fee ?? 0,
              buyerEmail: payload?.stakeholders?.buyer?.[0]?.email ?? '',
              buyerName: matched.name ?? "",
              status: paymentStatusTypes[matched.status] ?? "unpaid",
              date: matched.date ?? new Date().toISOString(),
              receiptUrl: matched.receiptUrl ?? null,
              address: matched?.address || "",
            };
            setEarnestData(resultData as EarnestMoneyData);
            console.log("Found matching transaction - showing Earnest status", resultData);
          }
        } catch (txErr) {
          console.warn("Failed to fetch transactions", txErr);
        }
      } catch (e) {
        console.error("Failed to load title search", e);
      } finally {
        setLoading(false);
      }
    };
    loadAndCheck();
  }, [titleSearchId]);

  const handleRequestSubmit = (formData: RequestFormData | EarnestMoneyData) => {
    if ((formData as EarnestMoneyData).amount !== undefined) {
      // Received full EarnestMoneyData
      const data = formData as EarnestMoneyData;
      setEarnestData(data);
      return;
    }

    // Otherwise form data
    const form = formData as RequestFormData;
    const newEarnestData: EarnestMoneyData = {
      amount: parseFloat(form.amount.replace(/[^0-9.-]+/g, "")) || 0,
      fee: 0,
      buyerEmail: form.buyerEmail,
      buyerName: form.buyerName,
      agentName: form.agentName,
      sellerName: form.sellerName,
// FIX: Type '"Un Paid"' is not assignable to type '"unpaid" | "Paid" | "Received"'. Did you mean '"unpaid"'?
      status: "unpaid",
      date: new Date().toISOString(),
      receiptUrl: null,
      address: form.address
    };
    setEarnestData(newEarnestData);
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm text-center">
       <CircularLoader/>
      </div>
    );
  }

  if (!earnestData) {
    return (
      <RequestEarnestMoneyView property={tsProperty} onSubmit={handleRequestSubmit} />
    );
  }

  return (
    <>
      <StatusView data={earnestData} onResendClick={() => setIsResendModalOpen(true)} />
      {isResendModalOpen && <ResendModal onClose={() => setIsResendModalOpen(false)} />}
    </>
  );
};