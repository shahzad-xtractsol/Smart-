import React, { useEffect, useState } from 'react';
import type { User } from '../types';

// --- Helper Functions ---
const formatAmount = (v: any) => {
    if (v === null || v === undefined || v === '') return 'N/A';
    const n = Number(v);
    if (isNaN(n)) return String(v);
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (v: any) => {
    if (!v) return 'N/A';
    const d = new Date(v);
    if (isNaN(d.getTime())) return String(v);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const pascalCase = (s?: string) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// --- Stakeholder Table Component ---
const displayedColumnsOwners: { name: string, value: keyof User }[] = [
  { name: 'First Name', value: 'firstName' },
  { name: 'Middle Name', value: 'middleName' },
  { name: 'Last Name', value: 'lastName' },
  { name: 'Email', value: 'email' },
  { name: 'Phone No.', value: 'phone' },
  { name: 'Address', value: 'address' },
];
const displayedColumnsBuyers = displayedColumnsOwners;
const displayedColumnsAgents: { name: string, value: keyof User }[] = [...displayedColumnsOwners, { name: 'Side', value: 'side' }];

const StakeholderTable: React.FC<{ columns: any[]; data: any[]; title: string }> = ({ columns, data, title }) => {
    if (!data || data.length === 0) return null;
    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                        <tr>
                            {columns.map(col => <th key={col.name} className="px-4 py-3 font-semibold">{col.name}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                {columns.map(col => (
                                    <td key={col.name} className="px-4 py-3 whitespace-nowrap">
                                        {col.value === 'side' ? pascalCase(row[col.value]) : row[col.value] || 'N/A'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DetailCard: React.FC<{ title: string; details: { label: string, value: any }[] }> = ({ title, details }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-3">
            {details.map(detail => (
                <div key={detail.label} className="flex justify-between items-center border-b border-gray-100 pb-2 text-sm">
                    <span className="text-gray-600">{detail.label}</span>
                    <span className="font-semibold text-gray-800 text-right">{detail.value}</span>
                </div>
            ))}
        </div>
    </div>
);

type Props = {
    propertyData?: any;
}

const OrderDetailsView: React.FC<Props> = ({ propertyData }) => {
    
    console.log('OrderDetailsView propertyData:', propertyData);
    return (
        <div className="space-y-6 py-6">
            <StakeholderTable title="Existing Owners" data={(propertyData?.titleSearch?.borrower) ?? []} columns={displayedColumnsOwners} />
            <StakeholderTable title="Buyers" data={(propertyData?.stakeholders?.buyer) ?? []} columns={displayedColumnsBuyers} />
            <StakeholderTable title="Sellers" data={(propertyData?.stakeholders?.seller) ?? []} columns={displayedColumnsBuyers} />
            <StakeholderTable title="Agents" data={(propertyData?.stakeholders?.agent) ?? []} columns={displayedColumnsAgents} />
          
        </div>
    );
};

export { OrderDetailsView };
export default OrderDetailsView;