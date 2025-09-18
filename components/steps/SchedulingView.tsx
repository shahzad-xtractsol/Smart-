import React from 'react';
import type { Property, Commission } from '../../types';
import { CalendarIcon, LockClosedIcon, BanknotesIcon } from '../icons';

interface SchedulingViewProps {
    property: Property;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        {children}
    </div>
);

const DetailRow: React.FC<{ label: string; value: string; isMono?: boolean }> = ({ label, value, isMono = false }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-sm font-semibold text-gray-800 ${isMono ? 'font-mono' : ''}`}>{value}</p>
    </div>
);

const CommissionTable: React.FC<{ commissions: Commission[] }> = ({ commissions }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-4 py-3">Recipient</th>
                    <th scope="col" className="px-4 py-3">Role</th>
                    <th scope="col" className="px-4 py-3 text-right">Amount</th>
                    <th scope="col" className="px-4 py-3 text-right">%</th>
                    <th scope="col" className="px-4 py-3 text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                {commissions.map((c, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{c.recipient}</td>
                        <td className="px-4 py-3 text-gray-600">{c.role}</td>
                        <td className="px-4 py-3 text-gray-800 font-semibold text-right">{c.amount}</td>
                        <td className="px-4 py-3 text-gray-600 text-right">{c.percentage}</td>
                        <td className="px-4 py-3 text-center">
                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                 c.status === 'Paid' ? 'bg-teal-100 text-teal-800' : 'bg-orange-100 text-orange-800'
                             }`}>
                                {c.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export const SchedulingView: React.FC<SchedulingViewProps> = ({ property }) => {
    const data = property.schedulingData;

    if (!data) {
        return (
            <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Scheduling Information Not Available</h2>
                <p className="text-gray-500 mt-2">Details for this step have not been populated yet.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <InfoCard title="Key Dates" icon={<CalendarIcon className="w-6 h-6 text-blue-600" />}>
                <DetailRow label="Scheduled Closing Date & Time" value={data.closingDate} />
                <DetailRow label="Scheduled Funding Date & Time" value={data.fundingDate} />
            </InfoCard>

            <InfoCard title="Wire & Payout Information" icon={<LockClosedIcon className="w-6 h-6 text-blue-600" />}>
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
                    <p className="font-bold text-sm">SECURITY WARNING</p>
                    <p className="text-xs mt-1">Never trust wiring instructions sent via email. Criminals are hacking email accounts and sending emails with fake wiring instructions. Always independently confirm instructions by phone using a trusted number before sending money.</p>
                </div>
                <h4 className="font-semibold text-gray-700 mb-2">Buyer Wire Instructions</h4>
                <div className="bg-gray-50 p-4 rounded-md border">
                    <DetailRow label="Bank Name" value={data.buyerWireInstructions.bankName} />
                    <DetailRow label="Routing Number" value={data.buyerWireInstructions.routingNumber} isMono />
                    <DetailRow label="Account Number" value={data.buyerWireInstructions.accountNumber} isMono />
                    <DetailRow label="Beneficiary Name" value={data.buyerWireInstructions.beneficiaryName} />
                </div>
                <h4 className="font-semibold text-gray-700 mt-6 mb-2">Seller Payout Details</h4>
                <div className="bg-gray-50 p-4 rounded-md border">
                    <DetailRow label="Payout Method" value={data.sellerPayoutDetails.method} />
                    <DetailRow label="Bank" value={data.sellerPayoutDetails.bankName} />
                    <DetailRow label="Account (Last 4)" value={data.sellerPayoutDetails.accountLastFour} isMono/>
                </div>
            </InfoCard>

             <InfoCard title="Commissions" icon={<BanknotesIcon className="w-6 h-6 text-blue-600" />}>
                <CommissionTable commissions={data.commissions} />
            </InfoCard>
        </div>
    );
};