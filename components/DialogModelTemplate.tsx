"use client";
import React from 'react'
import MainCard from './MainCard';

type ModalSize = 'sm' | 'md' | 'lg' | 'full'

interface ModalTemplateProps {
  id?: string;
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  children?: React.ReactNode;
  size?: ModalSize;
}

const sizeClassMap: Record<ModalSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  full: 'w-full sm:mx-0',
};

const DialogModelTemplate: React.FC<ModalTemplateProps> = ({
  id = 'modal-template',
  title = 'Modal title',
  isOpen = false,
  onClose,
  onSave,
  primaryLabel = 'Save changes',
  secondaryLabel = 'Close',
  children,
  size = 'md',
}) => {
  if (!isOpen) return null;

  return (
    <div
      id={id}
      role="dialog"
      aria-labelledby={`${id}-label`}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <MainCard
          title={title}
          modal
          className="p-0"
          secondary={<button
                  type="button"
                  onClick={onClose}
                  className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                  aria-label="Close"
                >
                  <span className="sr-only">Close</span>
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
          }
          footer={<div className="flex justify-end items-center gap-x-2 py-3 px-4 ">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              {secondaryLabel}
            </button>
            <button
              type="button"
              onClick={onSave}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              {primaryLabel}
            </button>
          </div>}
        >
          <div className="p-4 overflow-y-auto">
            {children }
          </div>
          
        </MainCard>
      </div>
    </div>
  )
}

export default DialogModelTemplate
