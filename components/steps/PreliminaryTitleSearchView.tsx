import React, { useEffect, useState } from 'react';
import type { Property, SearchParty, SearchItem, PreliminarySearchResult, AuditorDetails, RecorderDetails, DeedRecord, MortgageRecord, LienRecord } from '../../types';
import { MOCK_PRELIMINARY_SEARCH_RESULT } from '../../constants';
import { RefreshIcon, CheckCircleIcon, ClockIcon, CircleIcon, WarningIcon, ChevronDownIcon, AddIcon, EditIcon, TrashIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, SwitchIcon } from '../icons';

interface PreliminaryTitleSearchViewProps {
    property: Property;
    onUpdateProperty: (property: Property) => void;
}

// Start View
const StartSearch: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Preliminary Title Search</h2>
        <p className="text-gray-500 mb-8 max-w-md">Begin the automated search for seller and property details from public records.</p>
        <button
            onClick={onStart}
            className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
        >
            Start Search
        </button>
    </div>
);

// Loading View
const SearchInProgress: React.FC = () => (
    <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col items-center justify-center">
        <RefreshIcon className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Search in Progress...</h2>
        <p className="text-gray-500 mt-2 max-w-md">The system is searching multiple databases. This may take a few moments.</p>
    </div>
);

// Completed View Section Components
const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; rightContent?: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, rightContent, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
            >
                <div className="flex items-center">
                    <h4 className="font-bold text-blue-700 text-sm uppercase tracking-wider">{title}</h4>
                </div>
                <div className="flex items-center space-x-4">
                    {rightContent}
                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && <div className="p-4 bg-white">{children}</div>}
        </div>
    );
};

const FormField: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className }) => (
    <div className={className}>
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
        <input
            type="text"
            value={value}
            readOnly
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
        />
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
        <textarea
            value={value}
            readOnly
            rows={3}
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
        />
    </div>
);

const LegalDescription: React.FC<{ data: AuditorDetails['legalDescription'] }> = ({ data }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Property Address" value={data.propertyAddress} />
            <FormField label="City/Twp" value={data.cityTwp} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Sub Division" value={data.subDivision} />
            <FormField label="Lot #" value={data.lotNumber} />
            <FormField label="PB/PG" value={data.pbpg} />
        </div>
        <TextAreaField label="Short Description" value={data.shortDescription} />
        <TextAreaField label="Long Description" value={data.longDescription} />
    </div>
);

const RealEstateTaxInfo: React.FC<{ data: AuditorDetails['taxInformation'] }> = ({ data }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Parcel Number" value={data.parcelNumber} />
            <FormField label="L" value={data.lValue} />
            <FormField label="B" value={data.bValue} />
            <FormField label="T" value={data.tValue} />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <h5 className="font-semibold text-gray-700">TAX INFORMATION 2024</h5>
                <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center space-x-1.5">
                        <EditIcon className="w-3.5 h-3.5" />
                        <span>Edit</span>
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center space-x-1.5">
                        <TrashIcon className="w-3.5 h-3.5" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="p-2 text-left font-semibold text-gray-600">Year</th>
                            <th className="p-2 text-left font-semibold text-gray-600">First Half</th>
                            <th className="p-2 text-left font-semibold text-gray-600">Assessment #1</th>
                            <th className="p-2 text-left font-semibold text-gray-600">Second Half</th>
                            <th className="p-2 text-left font-semibold text-gray-600">Assessment #1</th>
                            <th className="p-2 text-right font-semibold text-gray-600">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.taxYearData.map(item => (
                            <tr key={item.year}>
                                <td className="p-2">{item.year}</td>
                                <td className="p-2">{item.firstHalf.amount} {item.firstHalf.status === 'paid' && <span className="ml-2 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">paid</span>}</td>
                                <td className="p-2">{item.assessment1.amount} {item.assessment1.status === 'paid' && <span className="ml-2 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">paid</span>}</td>
                                <td className="p-2">{item.secondHalf.amount} {item.secondHalf.status === 'paid' && <span className="ml-2 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">paid</span>}</td>
                                <td className="p-2">{item.assessment2.amount} {item.assessment2.status === 'paid' && <span className="ml-2 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">paid</span>}</td>
                                <td className="p-2 text-right font-semibold">{item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-1">
                 <p>Total (First half + Second half): {data.totalFirstHalfSecondHalf}</p>
                 <p>Delinq. Taxes: {data.delinquentTaxes}</p>
                 <p>Pending/Future Assessments: {data.pendingAssessments}</p>
                 <p>Homestead: {data.homestead}</p>
                 <p className="pt-2"><strong>Notes:</strong> {data.notes}</p>
            </div>
        </div>
    </div>
);

const ChainOfTitle: React.FC<{ data: AuditorDetails['chainOfTitle'] }> = ({ data }) => {
    // Basic pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const totalPages = Math.ceil(data.records.length / rowsPerPage);
    const currentRecords = data.records.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p><strong>Property:</strong> {data.propertyAddress}</p>
                <p><strong>Parcel #:</strong> {data.parcelNumber}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Download (Inst No)</th>
                            <th scope="col" className="px-4 py-3">Date Recorded</th>
                            <th scope="col" className="px-4 py-3">Grantee</th>
                            <th scope="col" className="px-4 py-3">Inst Type</th>
                            <th scope="col" className="px-4 py-3">Sales Price</th>
                            <th scope="col" className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((record, index) => (
                            <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-blue-600 hover:underline cursor-pointer">{record.instNo}</td>
                                <td className="px-4 py-3">{record.dateRecorded}</td>
                                <td className="px-4 py-3">{record.grantee}</td>
                                <td className="px-4 py-3">{record.instType}</td>
                                <td className="px-4 py-3">{record.salesPrice}</td>
                                <td className="px-4 py-3 flex items-center justify-center space-x-2">
                                    <button className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4" /></button>
                                    <button className="text-blue-500 hover:text-blue-700"><EditIcon className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="flex justify-between items-center text-sm text-gray-600">
                <p>Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, data.records.length)} of {data.records.length} entries</p>
                <div className="flex items-center space-x-1">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">&lt;&lt;</button>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">&lt;</button>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">{currentPage}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">&gt;</button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">&gt;&gt;</button>
                </div>
            </div>
        </div>
    );
};


const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">{title}</h3>
        {children}
    </div>
);

const PlaceholderContent: React.FC<{ sectionName: string }> = ({ sectionName }) => (
    <div className="text-center text-gray-500 py-8">
        <p>Detailed UI for {sectionName} will be implemented here.</p>
    </div>
);

const DeedInfoTable: React.FC<{ records: DeedRecord[] }> = ({ records }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const totalPages = Math.ceil(records.length / rowsPerPage);
    const currentRecords = records.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    
    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Stakeholder Name</th>
                            <th scope="col" className="px-4 py-3">Inst No</th>
                            <th scope="col" className="px-4 py-3">Deed Type</th>
                            <th scope="col" className="px-4 py-3">Signed At</th>
                            <th scope="col" className="px-4 py-3">Filed At</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3">Notes</th>
                            <th scope="col" className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((record) => (
                            <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{record.stakeholderName}</td>
                                <td className="px-4 py-3 font-medium text-blue-600 hover:underline cursor-pointer">{record.instNo}</td>
                                <td className="px-4 py-3">{record.deedType}</td>
                                <td className="px-4 py-3">{record.signedAt}</td>
                                <td className="px-4 py-3">{record.filedAt}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">{record.status}</span>
                                </td>
                                <td className="px-4 py-3">{record.notes}</td>
                                <td className="px-4 py-3 flex items-center justify-center space-x-2">
                                    <button className="text-gray-500 hover:text-blue-700"><EyeIcon className="w-4 h-4" /></button>
                                    <button className="text-gray-500 hover:text-red-700"><TrashIcon className="w-4 h-4" /></button>
                                    <button className="text-gray-500 hover:text-blue-700"><EditIcon className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="flex justify-between items-center text-sm text-gray-600">
                <p>Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, records.length)} of {records.length} entries</p>
                <div className="flex items-center space-x-1">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">&lt;&lt;</button>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">&lt;</button>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">{currentPage}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">&gt;</button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">&gt;&gt;</button>
                </div>
            </div>
        </div>
    );
};

const MortgageRow: React.FC<{ record: MortgageRecord }> = ({ record }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const statusPill = (status: MortgageRecord['status']) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{status}</span>
    );
    
    const DetailItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-800 break-words">{value || 'N/A'}</p>
        </div>
    );

    return (
        <>
            <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{record.stakeholder}</td>
                <td className="px-4 py-3">{record.fileNumber}</td>
                <td className="px-4 py-3">
                    <span title={record.toBank} className="truncate block max-w-[200px]">{record.toBank}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">{record.amount}</td>
                <td className="px-4 py-3">{record.dated}</td>
                <td className="px-4 py-3">{statusPill(record.status)}</td>
                <td className="px-4 py-3 flex items-center justify-center space-x-2">
                    <button className="text-gray-500 hover:text-blue-700" title="Switch"><SwitchIcon className="w-4 h-4" /></button>
                    <button className="text-gray-500 hover:text-blue-700" title="Edit"><EditIcon className="w-4 h-4" /></button>
                    <button className="text-gray-500 hover:text-red-700" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                </td>
                <td className="px-4 py-3 text-center">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-full hover:bg-gray-200">
                        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-white border-b">
                    <td colSpan={8} className="p-0">
                        <div className="p-4 bg-blue-50/50">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                                <DetailItem label="Inst No 2" value={record.instNo2} />
                                <DetailItem label="Filed" value={record.filed1} />
                                <DetailItem label="Filed 2" value={record.filed2} />
                                <div className="col-span-2"><DetailItem label="Mortgage From" value={record.mortgageFrom} /></div>
                                <div className="col-span-full"><DetailItem label="Assigned To" value={record.assignedTo} /></div>
                                {record.notes && <div className="col-span-full"><DetailItem label="Notes" value={record.notes} /></div>}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

const MortgageInfoView: React.FC<{ records: MortgageRecord[] }> = ({ records }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const totalPages = Math.ceil(records.length / rowsPerPage);
    const currentRecords = records.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Stakeholder</th>
                            <th scope="col" className="px-4 py-3">File Number</th>
                            <th scope="col" className="px-4 py-3">To Bank</th>
                            <th scope="col" className="px-4 py-3">Amount</th>
                            <th scope="col" className="px-4 py-3">Dated</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3 text-center">Actions</th>
                            <th scope="col" className="px-4 py-3 text-center">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map(record => (
                            <MortgageRow key={record.id} record={record} />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
                <p>Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, records.length)} of {records.length} entries</p>
                <div className="flex items-center space-x-1">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">&lt;&lt;</button>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">&lt;</button>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">{currentPage}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">&gt;</button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">&gt;&gt;</button>
                </div>
            </div>
        </div>
    );
};


const LienInfoTable: React.FC<{ records: LienRecord[] }> = ({ records }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const totalPages = Math.ceil(records.length / rowsPerPage);
    const currentRecords = records.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Stakeholder</th>
                            <th scope="col" className="px-4 py-3">Document Category</th>
                            <th scope="col" className="px-4 py-3">Instrument Number</th>
                            <th scope="col" className="px-4 py-3">Filed Date</th>
                            <th scope="col" className="px-4 py-3">Notes</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                     <tbody>
                        {currentRecords.map((record) => (
                            <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{record.stakeholder}</td>
                                <td className="px-4 py-3">{record.documentCategory}</td>
                                <td className="px-4 py-3 font-medium text-blue-600 hover:underline cursor-pointer">{record.instrumentNumber}</td>
                                <td className="px-4 py-3">{record.filedDate}</td>
                                <td className="px-4 py-3 w-1/3">{record.notes}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">{record.status}</span>
                                </td>
                                <td className="px-4 py-3 flex items-center justify-center space-x-2">
                                    <button className="text-gray-500 hover:text-red-700"><TrashIcon className="w-4 h-4" /></button>
                                    <button className="text-gray-500 hover:text-blue-700"><EditIcon className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="flex justify-between items-center text-sm text-gray-600">
                <p>Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, records.length)} of {records.length} entries</p>
                <div className="flex items-center space-x-1">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">&lt;&lt;</button>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">&lt;</button>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">{currentPage}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">&gt;</button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">&gt;&gt;</button>
                </div>
            </div>
            <div className="pt-4 space-y-2">
                <FormField label="Restrictions:" value="" className="w-full" />
                <FormField label="Easements:" value="" className="w-full" />
                <div className="flex items-center space-x-4 text-sm">
                    <label className="flex items-center space-x-2"><input type="checkbox" className="rounded" /><span>Building Setback Line</span></label>
                    <label className="flex items-center space-x-2"><input type="checkbox" className="rounded" /><span>Planted Utility Easements</span></label>
                    <label className="flex items-center space-x-2"><input type="checkbox" className="rounded" /><span>Per Plat</span></label>
                </div>
            </div>
        </div>
    );
};

const RecorderSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [subTab, setSubTab] = useState('matched');
    
    return (
        <CollapsibleSection
            title={title}
            defaultOpen
            rightContent={
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search..." className="pl-8 pr-2 py-1.5 text-xs border border-gray-300 rounded-md" />
                    </div>
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <AddIcon className="w-3.5 h-3.5" />
                        <span>Add</span>
                    </button>
                </div>
            }
        >
            <div>
                <div className="border-b border-gray-200">
                     <nav className="-mb-px flex space-x-4 text-sm">
                        <button onClick={() => setSubTab('matched')} className={`py-2 px-1 border-b-2 ${subTab === 'matched' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Matched</button>
                        <button onClick={() => setSubTab('unmatched')} className={`py-2 px-1 border-b-2 ${subTab === 'unmatched' ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Unmatched</button>
                    </nav>
                </div>
                <div className="pt-4">
                    {children}
                </div>
            </div>
        </CollapsibleSection>
    )
};

const RecorderDetailsTabs: React.FC<{ data: RecorderDetails }> = ({ data }) => {
    const [activeTab, setActiveTab] = useState<'sellers' | 'buyers' | 'priorOwners'>('sellers');
    
    const tabData = data[activeTab];

    const renderTabContent = () => {
        if (!tabData) return <p className="p-4 text-gray-500">No data available for this category.</p>;
        return (
            <div className="space-y-4 mt-4">
                <RecorderSection title="CURRENT DEED INFORMATION">
                    <DeedInfoTable records={tabData.deeds} />
                </RecorderSection>
                <RecorderSection title="MORTGAGE INFORMATION">
                    <MortgageInfoView records={tabData.mortgages} />
                </RecorderSection>
                <RecorderSection title="JUDGMENTS LIENS">
                    <LienInfoTable records={tabData.liens} />
                </RecorderSection>
            </div>
        );
    };
    
    return (
        <div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {(['sellers', 'buyers', 'priorOwners'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                                activeTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab === 'priorOwners' ? 'Prior Owners' : tab}
                        </button>
                    ))}
                </nav>
            </div>
            {renderTabContent()}
        </div>
    );
};


const SearchCompleted: React.FC<{ result: PreliminarySearchResult }> = ({ result }) => {
    const { parties, disclaimer, auditorDetails, recorderDetails } = result;

    const getStatusIcon = (status: SearchItem['status']) => {
        switch (status) {
          case 'completed': return <CheckCircleIcon className="w-5 h-5 text-teal-500" />;
          case 'in-progress': return <ClockIcon className="w-5 h-5 text-blue-500 animate-spin" />;
          case 'warning': return <WarningIcon className="w-5 h-5 text-red-500" />;
          default: return <CircleIcon className="w-5 h-5 text-gray-400" strokeWidth="1" />;
        }
    };
    
    const roleColors: Record<SearchParty['role'], string> = {
        'Buyer': 'bg-red-100 text-red-800',
        'Seller': 'bg-orange-100 text-orange-800',
        'Prior Owner': 'bg-blue-100 text-blue-800',
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="divide-y divide-gray-200">
                    {parties.map((party, index) => (
                        <div key={index} className="py-3 flex items-start space-x-4">
                            <div className="w-1/4">
                                <p className="font-semibold text-gray-800">{party.name}</p>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColors[party.role]}`}>
                                    {party.role}
                                </span>
                            </div>
                            <div className="w-3/4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-2">
                                    {party.searchItems.map(item => (
                                        <div key={item.name} className="flex items-center space-x-2 text-sm">
                                            {getStatusIcon(item.status)}
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full">
                                    <div 
                                        className="h-1.5 bg-blue-600 rounded-full" 
                                        style={{ width: `${party.searchItems.filter(i => i.status === 'completed').length / party.searchItems.length * 100}%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {auditorDetails && (
                 <DetailSection title="AUDITOR DETAILS">
                    <div className="space-y-4">
                        <CollapsibleSection title="LEGAL DESCRIPTION" defaultOpen>
                            <LegalDescription data={auditorDetails.legalDescription} />
                        </CollapsibleSection>
                        <CollapsibleSection
                            title="REAL ESTATE TAX INFORMATION"
                            defaultOpen
                            rightContent={
                                <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                    <AddIcon className="w-3.5 h-3.5" />
                                    <span>Add</span>
                                </button>
                            }
                        >
                           <RealEstateTaxInfo data={auditorDetails.taxInformation} />
                        </CollapsibleSection>
                         <CollapsibleSection
                            title="CHAIN OF TITLE"
                            defaultOpen
                            rightContent={
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input type="text" placeholder="Search..." className="pl-8 pr-2 py-1.5 text-xs border border-gray-300 rounded-md" />
                                    </div>
                                    <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                        <AddIcon className="w-3.5 h-3.5" />
                                        <span>Add</span>
                                    </button>
                                </div>
                            }
                        >
                           <ChainOfTitle data={auditorDetails.chainOfTitle} />
                        </CollapsibleSection>
                    </div>
                 </DetailSection>
            )}

            {recorderDetails && (
                <DetailSection title="RECORDER DETAILS">
                    <RecorderDetailsTabs data={recorderDetails} />
                </DetailSection>
            )}

            <DetailSection title="Clerk of Court Details"><PlaceholderContent sectionName="Clerk of Court Details" /></DetailSection>
            <DetailSection title="Patriot Act details"><PlaceholderContent sectionName="Patriot Act details" /></DetailSection>
            <DetailSection title="Municipal Clerk"><PlaceholderContent sectionName="Municipal Clerk" /></DetailSection>
            <DetailSection title="Probate"><PlaceholderContent sectionName="Probate" /></DetailSection>
            <DetailSection title="Probate Marriage"><PlaceholderContent sectionName="Probate Marriage" /></DetailSection>
            <DetailSection title="Pacer"><PlaceholderContent sectionName="Pacer" /></DetailSection>
            <DetailSection title="Public Finance"><PlaceholderContent sectionName="Public Finance" /></DetailSection>
            <DetailSection title="Attorney General"><PlaceholderContent sectionName="Attorney General" /></DetailSection>
            
            <DetailSection title="Reference Documents">
                <PlaceholderContent sectionName="Reference Documents" />
            </DetailSection>
        </div>
    );
};


export const PreliminaryTitleSearchView: React.FC<PreliminaryTitleSearchViewProps> = ({ property, onUpdateProperty }) => {
    
    const status = property.preliminarySearchStatus || 'Not Started';

    useEffect(() => {
        if (status === 'In Progress') {
            const timer = setTimeout(() => {
                onUpdateProperty({
                    ...property,
                    preliminarySearchStatus: 'Completed',
                    preliminarySearchResult: MOCK_PRELIMINARY_SEARCH_RESULT,
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [status, property, onUpdateProperty]);

    const handleStartSearch = () => {
        onUpdateProperty({
            ...property,
            preliminarySearchStatus: 'In Progress',
        });
    };

    if (status === 'Completed' && property.preliminarySearchResult) {
        return <SearchCompleted result={property.preliminarySearchResult} />;
    }
    
    if (status === 'In Progress') {
        return <SearchInProgress />;
    }

    return <StartSearch onStart={handleStartSearch} />;
};