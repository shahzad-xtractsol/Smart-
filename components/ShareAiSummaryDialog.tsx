'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as clipboard from 'clipboard-polyfill';
import titleSearchService from '../lib/services/titleSearch.service';
import CircularLoader from './CircularLoader';

interface ShareAiSummaryDialogProps {
  open: boolean;
  onClose: () => void;
  titleSearchId: any;
  summaryHtml: string;
  pdfFile: File | null;
}

const ShareAiSummaryDialog: React.FC<ShareAiSummaryDialogProps> = ({ open, onClose, titleSearchId, summaryHtml, pdfFile }) => {
  const [userList, setUserList] = useState<any[]>([]);
  const [showUserList, setShowUserList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  const internalUserForm = useFormik({
    initialValues: {
      userId: '',
      name: '',
      titleSearchId: titleSearchId
    },
    validationSchema: Yup.object({
      userId: Yup.string().required('User is required'),
      name: Yup.string().required('Name is required')
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('userId', values.userId);
      formData.append('name', values.name);
      formData.append('titleSearchId', values.titleSearchId);
      if (pdfFile) {
        formData.append('file', pdfFile);
      }
      try {
        await titleSearchService.shareAiSummary(formData);
        onClose();
      } catch (error) {
        console.error('Share error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const externalUserForm = useFormik({
    initialValues: {
      email: '',
      name: '',
      userType: '',
      titleSearchId: titleSearchId
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      name: Yup.string().required('Name is required'),
      userType: Yup.string().required('User role is required')
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('name', values.name);
      formData.append('userType', values.userType);
      formData.append('titleSearchId', values.titleSearchId);
      if (pdfFile) {
        formData.append('file', pdfFile);
      }
      try {
        await titleSearchService.shareAiSummaryOutside(formData);
        onClose();
      } catch (error) {
        console.error('Share error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    internalUserForm.setFieldValue('name', name);
    internalUserForm.setFieldValue('userId', ''); // Reset userId when name changes

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (name) {
      searchTimeoutRef.current = setTimeout(() => {
        titleSearchService
          .stakeholdersList({ id: titleSearchId, filters: { name } })
          .then((res) => {
            setUserList(res?.users || []);
            setShowUserList(true);
          })
          .catch(() => {
            setUserList([]);
          });
      }, 300);
    } else {
      setShowUserList(false);
    }
  };

  const handleSelectUser = (user: any) => {
    internalUserForm.setValues({
      userId: user.id,
      name: user.name,
      titleSearchId: titleSearchId
    });
    setShowUserList(false);
  };

  const handleCopyHtml = async () => {
    try {
      const cleanHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>AI Summary Report</title>
        </head>
        <body>
          ${summaryHtml}
        </body>
        </html>
      `;
      const plainText = new DOMParser().parseFromString(summaryHtml, 'text/html').body.textContent || '';

      const item = new clipboard.ClipboardItem({
        'text/html': new Blob([cleanHtml], { type: 'text/html' }),
        'text/plain': new Blob([plainText], { type: 'text/plain' })
      });

      await clipboard.write([item]);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleSubmit = () => {
    if (internalUserForm.values.userId) {
      internalUserForm.handleSubmit();
    } else {
      externalUserForm.handleSubmit();
    }
  };

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg z-10 overflow-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Share AI Summary</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm mb-3">Share your AI Summary via message or email</p>

          <div className="bg-[#B9D9EB] p-3 rounded mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Copy AI Summary to clipboard</div>
                <div className="text-sm text-gray-600">Copy the complete AI summary with formatting</div>
              </div>
              <div>
                <button onClick={handleCopyHtml} className="bg-blue-600 text-white px-3 py-1 rounded">Copy Summary</button>
              </div>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={internalUserForm.values.name}
              onChange={handleSearchChange}
              onFocus={() => setShowUserList(true)}
              placeholder="Enter contact name"
            />
            {showUserList && userList.length > 0 && (
              <ul className="absolute z-20 bg-white border w-full mt-1 rounded max-h-40 overflow-auto">
                {userList.map((user) => (
                  <li key={user.id} className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center" onClick={() => handleSelectUser(user)}>
                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">{user.name?.charAt(0)?.toUpperCase()}</div>
                    <div>{user.name}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="text-center my-3">Or share via email address</div>

          <form onSubmit={(e) => { e.preventDefault(); externalUserForm.handleSubmit(); }}>
            <div className="grid grid-cols-1 gap-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Name"
                name="name"
                value={externalUserForm.values.name}
                onChange={externalUserForm.handleChange}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
                name="email"
                type="email"
                value={externalUserForm.values.email}
                onChange={externalUserForm.handleChange}
              />
              <select
                className="w-full border rounded px-3 py-2"
                name="userType"
                value={externalUserForm.values.userType}
                onChange={externalUserForm.handleChange}
              >
                <option value="">Select role</option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
                <option value="Investor">Investor</option>
                <option value="Agent">Agent</option>
              </select>
            </div>
          </form>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting || (!internalUserForm.isValid && !externalUserForm.isValid)} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 flex items-center gap-2">
            {isSubmitting ? <CircularLoader /> : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareAiSummaryDialog;