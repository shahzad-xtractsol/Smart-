'use client';

import React, { forwardRef, CSSProperties, ReactNode, Ref, ReactElement } from 'react';
// types placeholder removed - project uses `types.ts` instead

export interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children: ReactElement | ReactNode;
  subheader?: ReactNode | string;
  style?: CSSProperties;
  content?: boolean;
  contentClassName?: string;
  darkTitle?: boolean;
  divider?: boolean;
  secondary?: ReactNode;
  shadow?: string;
  elevation?: number;
  title?: ReactNode | string;
  codeHighlight?: boolean;
  codeString?: string;
  modal?: boolean;
  footer?: ReactNode;
  className?: string;
}

const MainCard = (
  {
    border = true,
    boxShadow = true,
    children,
    subheader,
    content = true,
    contentClassName = '',
    darkTitle,
    divider = true,
    elevation,
    secondary,
    shadow,
    title,
    codeHighlight = false,
    codeString,
    footer,
    modal = false,
    className = '',
    ...others
  }: MainCardProps,
  ref: Ref<HTMLDivElement>
) => {
  const baseClasses = `relative rounded-xl ${border ? 'border' : ''} ${boxShadow ? 'shadow-sm' : ''} bg-white`;
  const modalClasses = modal ? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%-50px)] sm:w-auto max-h-[calc(100vh-200px)] overflow-auto' : '';

  return (
    <div ref={ref} className={`${baseClasses} ${modalClasses} ${className}`} {...(others as any)}>
      {/* Header */}
      {title && (
        <div className="px-6 py-3 border-b flex items-center justify-between">
          <div>
            {!darkTitle ? (
              <h3 className="text-lg font-semibold text-gray-800 ">{title}</h3>
            ) : (
              <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            )}
            {subheader && <div className="text-xs text-gray-500">{subheader}</div>}
          </div>
          {secondary && <div className="ml-4">{secondary}</div>}
        </div>
      )}

      {/* Divider */}
      {title && divider && <div className="border-b" />}

      {/* Content */}
      {content ? (
        <div className={`px-6 py-4 ${contentClassName}`}>{children}</div>
      ) : (
        <>{children}</>
      )}

      {/* Footer */}
      {footer && (
        <>
          <div className="border-t border-dashed" />
          <div className="px-6 py-3">{footer}</div>
        </>
      )}

      {/* Code block */}
      {codeString && (
        <>
          <div className="border-t" />
          <pre className={`p-3 text-xs font-mono overflow-auto ${codeHighlight ? 'bg-gray-50' : ''}`}>{codeString}</pre>
        </>
      )}
    </div>
  );
};

export default forwardRef(MainCard);
