'use client';

import React, {useState} from 'react';
import './globals.css'; // Ensure you have your Tailwind CSS styles imported

// Dummy icon for replacement
const UnfoldMoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l-5 5h10l-5-5zm0 20l5-5h-10l5 5z"/>
  </svg>
);

// Dummy CircularLoader replacement
const CircularLoader = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
);

export type Order = 'asc' | 'desc';

export type Column<Row> = {
  id: string;
  label: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  sortable?: boolean;
  render?: (row: Row, rowIndex: number) => React.ReactNode;
  sortValue?: (row: Row) => any;
};

type Props<Row> = {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row, index: number) => React.Key;
  orderBy?: string | null;
  order?: Order;
  onRequestSort?: (columnId: string) => void;
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  notFoundMessage?: React.ReactNode;
  SearchBox?: React.ReactNode;
  rowsPerPageOptions?: number[];
  beforeTableContent?: React.ReactNode;
};

function DataTable<Row>(props: Props<Row>) {
  const {
    columns,
    rows: rowsProp,
    rowKey,
    order: orderProp,
    orderBy: orderByProp,
    onRequestSort: onRequestSortProp,
    page,
    rowsPerPage,
    count,
    onPageChange,
    onRowsPerPageChange,
    loading,
    emptyMessage = 'No records found',
    rowsPerPageOptions = [5, 10, 20, 50, 100],
    beforeTableContent,
    notFoundMessage = null,
    SearchBox = null
  } = props;

  const [internalOrder, setInternalOrder] = useState<Order>('asc');
  const [internalOrderBy, setInternalOrderBy] = useState<string | null>(null);

  const order = orderProp ?? internalOrder;
  const orderBy = orderByProp ?? internalOrderBy;

  const handleSortClick = (columnId: string) => {
    const isAsc = internalOrderBy === columnId && internalOrder === 'asc';
    setInternalOrder(isAsc ? 'desc' : 'asc');
    setInternalOrderBy(columnId);
    if (onRequestSortProp) onRequestSortProp(columnId);
  };

  const getNested = (obj: any, path: string) => {
    if (!obj || !path) return undefined;
    if (path.indexOf('.') === -1) return obj[path];
    return path.split('.').reduce((acc: any, p) => (acc ? acc[p] : undefined), obj);
  };

  const getCellSortValue = (row: any, colId: string | null) => {
    if (!colId) return '';
    const col = columns.find((c) => c.id === colId) as any;
    if (col && typeof col.sortValue === 'function') {
      return col.sortValue(row);
    }
    let v = row?.[colId];
    if (v === undefined) v = getNested(row, colId);
    if (v == null) return '';
    if (v instanceof Date) return v.getTime();
    if (typeof v === 'number') return v;
    if (typeof v === 'boolean') return v ? 1 : 0;
    const parsed = Date.parse(String(v));
    if (!Number.isNaN(parsed)) return parsed;
    return String(v).toLowerCase();
  };

  let rows = rowsProp;
  if (!onRequestSortProp && orderBy) {
    rows = [...rowsProp].sort((a: any, b: any) => {
      const av = getCellSortValue(a, orderBy as string);
      const bv = getCellSortValue(b, orderBy as string);
      if (typeof av === 'number' && typeof bv === 'number') return order === 'asc' ? av - bv : bv - av;
      if (av < bv) return order === 'asc' ? -1 : 1;
      if (av > bv) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const pageCount = Math.max(1, Math.ceil(Math.max(0, count) / Math.max(1, rowsPerPage)));
  const startIdx = count === 0 ? 1 : (page - 1) * rowsPerPage + 1;
  const endIdx = count === 0 ? page * rowsPerPage : Math.min(count, page * rowsPerPage);

  return (
    <>
      {/* Top section with rows-per-page and search box */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span className="text-sm text-gray-600">Row per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {rowsPerPageOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
        <div className="flex items-center justify-start sm:justify-end">
          {SearchBox}
        </div>
      </div>

      {beforeTableContent}

      {/* Table or messages */}
      {loading ? (
        <div className="flex justify-center py-6">
          <CircularLoader />
        </div>
      ) : rows.length ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.id)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}`}
                    style={{ width: col.width }}
                  >
                    {col.sortable !== false ? (
                      <button
                        className="group inline-flex items-center gap-1"
                        onClick={() => handleSortClick(col.id)}
                      >
                        {col.label}
                        <UnfoldMoreIcon />
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, rIndex) => (
                <tr key={rowKey(row, rIndex)} className="hover:bg-gray-100 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={String(col.id)}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}`}
                      style={{ width: col.width }}
                    >
                      {col.render ? (col.render(row, rIndex) as any) : (row as any)[col.id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-4 text-center text-sm text-gray-500">
          {notFoundMessage !== null ? notFoundMessage : emptyMessage}
        </div>
      )}

      {/* Footer section with pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
          {`Showing ${startIdx} to ${endIdx} of ${count} entries`}
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            {'<<'}
          </button>
          <button
            className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            {'<'}
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 text-sm rounded-md ${page === p ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              {p}
            </button>
          ))}
          <button
            className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pageCount}
          >
            {'>'}
          </button>
          <button
            className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => onPageChange(pageCount)}
            disabled={page === pageCount}
          >
            {'>>'}
          </button>
        </div>
      </div>
    </>
  );
}

export default DataTable;