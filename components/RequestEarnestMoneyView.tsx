import React, { useEffect, useState } from 'react';
import type { Property, EarnestMoneyData } from '../types';
import { QuestionMarkCircleIcon, RefreshIcon, CheckCircleIcon, WarningIcon, ChevronDownIcon } from '../icons';
import titleSearchService from '../lib/services/titleSearch.service';
import transactionsService from '../lib/services/transactions.service';
import { paymentStatusTypes } from '../lib/payment-status-types';

interface RequestFormData {
    amount: string;
    buyerEmail: string;
    buyerName: string;
    agentName?: string;
    sellerName?: string;
}

interface RequestEarnestMoneyViewProps {
    property?: Property | null;
    onSubmit?: (data: RequestFormData | EarnestMoneyData) => void;
}

const ReadOnlyField: React.FC<{ label: string; value?: string | number | null; isRequired?: boolean }> = ({ label, value, isRequired }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
            {label}{isRequired && '*'}
        </label>
        <div className="mt-1 p-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-800 min-h-[36px] flex items-center">
            {value || ''}
        </div>
    </div>
);
const EditableField: React.FC<{
    label: string;
    name: string;
    value?: string | number | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isRequired?: boolean;
    hasError?: boolean;
}> = ({ label, name, value, isRequired, onChange, hasError }) => (
    <div>
        <label htmlFor={name} className="block text-xs font-medium text-gray-500 mb-1">
            {label}{isRequired && '*'}
        </label>
        <input
            type="text"
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`mt-1 p-2 w-full bg-white border rounded-md text-sm text-gray-800 focus:ring-blue-500 focus:border-blue-500 ${hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
        />
        {hasError && <p className="text-red-500 text-xs mt-1">This field is required.</p>}
    </div>
);


interface SuccessData {
    name: string;
    amount: number;
    address: string;
    status: string;
    date: string;
    receiptUrl?: string | null;
}

const SuccessView: React.FC<{ resultData: SuccessData; onDone: () => void; onResend: () => void; }> = ({ resultData, onDone, onResend }) => (
    <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm text-center">
        <CheckCircleIcon className="w-16 h-16 text-teal-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
        <p className="text-gray-600 mt-2 mb-4">The earnest money request was sent successfully.</p>
        
        <div className="mt-6 text-sm bg-gray-50 p-6 rounded-lg text-left divide-y divide-gray-200 border">
            <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500">Buyer:</span>
                <span className="font-semibold text-gray-800">{resultData.name}</span>
            </div>
            <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold text-gray-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(resultData.amount)}</span>
            </div>
            <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500">Property:</span>
                <span className="font-semibold text-gray-800 truncate max-w-[250px]" title={resultData.address}>{resultData.address}</span>
            </div>
            <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500">Status:</span>
                <span className="font-semibold text-orange-600 capitalize">{resultData.status}</span>
            </div>
            <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500">Date Sent:</span>
                <span className="font-semibold text-gray-800">{new Date(resultData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
            <button onClick={onResend} className="px-6 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                Resend
            </button>
            <button onClick={onDone} className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Close
            </button>
        </div>
    </div>
);


const FailureView: React.FC<{ onRetry: () => void; }> = ({ onRetry }) => (
    <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm text-center">
        <WarningIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Failure!</h2>
        <p className="text-gray-600 mt-2">Failed to send email to buyer.</p>
        <p className="text-gray-500 text-sm mt-1">An error occurred while processing your request. Please try again.</p>
        <div className="mt-6">
            <button onClick={onRetry} className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Try Again
            </button>
        </div>
    </div>
);


export default function RequestEarnestMoneyView({ property, onSubmit }: RequestEarnestMoneyViewProps) {
    const [stakeholders, setStakeholders] = useState({
        agentName: '',
        sellerName: '',
        buyerEmail: '',
        buyerName: '',
        earnestAmount: ''
    });
        

        const [tsProperty, setTsProperty] = useState<Property>(property);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
                console.log('RequestEarnestMoneyView property changed:', tsProperty);
                const load = async () => {
                        try {
                                if (!tsProperty?.id) return;
                                setLoading(true);
                                const res = await titleSearchService.getTitleSearchOrder(tsProperty.id);
                                // API shape: { status, statusCode, message, data: { ...property } }
                                const payload = res?.data?.data ?? res?.data ?? res;
                                console.log('Fetched title search data:', payload);
                                setTsProperty(payload ?? null);
                        } catch (e) {
                                console.error('Failed to load title search', e);
                        } finally {
                                setLoading(false);
                        }
                };
                load();
        }, [tsProperty?.id]);

    const [isEmailValid, setIsEmailValid] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'failure'>('idle');
    const [submissionResult, setSubmissionResult] = useState<SuccessData | null>(null);
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);
    const [editableProperty, setEditableProperty] = useState(() => ({
        owners: (tsProperty as any)?.owners ?? '',
        address: (tsProperty as any)?.address ?? '',
        city: (tsProperty as any)?.city ?? '',
        state: (tsProperty as any)?.state ?? '',
        zip: (tsProperty as any)?.postalCode ?? '',
        county: (tsProperty as any)?.county ?? '',
        latitude: (tsProperty as any)?.latitude ?? '',
        longitude: (tsProperty as any)?.longitude ?? '',
        lastSoldPrice: (tsProperty as any)?.lastSoldPrice ?? ((tsProperty as any)?.value ? String((tsProperty as any).value) : ''),
        propertyType: (tsProperty as any)?.type ?? '',
        lastModified: (tsProperty as any)?.lastModified ?? '',
        apn: (tsProperty as any)?.apn ?? '',
        billedYear: (tsProperty as any)?.taxInformation?.billedYear ?? '',
        currentTaxAmount: (tsProperty as any)?.taxInformation?.currentTaxAmount ?? '',
        sqft: (tsProperty as any)?.buildingDetails?.squareFeet ?? '',
        beds: (tsProperty as any)?.buildingDetails?.bedRooms ?? '',
        baths: (tsProperty as any)?.buildingDetails?.fullBaths ?? '',
        halfBaths: (tsProperty as any)?.buildingDetails?.halfBaths ?? '',
    }));

    const addressParts = ((tsProperty as any)?.address || '').split(',').map((s: string) => s.trim());
    const [city, state, zip] = [((tsProperty as any)?.city) ?? addressParts[1] ?? '', ((tsProperty as any)?.state) ?? addressParts[2] ?? '', ((tsProperty as any)?.postalCode) ?? addressParts[3] ?? ''];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'buyerEmail') {
            setIsEmailValid(emailRegex.test(value) || value === '');
        }
        setStakeholders(prev => ({ ...prev, [name]: value }));
    };
      const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableProperty(prev => ({...prev, [name]: value}));
    };

    const isFormValid = stakeholders.buyerEmail && stakeholders.buyerName && stakeholders.earnestAmount && emailRegex.test(stakeholders.buyerEmail);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAttemptedSubmit(true);
        if (isFormValid) {
            setShowConfirm(true);
        }
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
                const payload: any = {
                    buyerEmail: stakeholders.buyerEmail,
                    earnestAmount: Number(String(stakeholders.earnestAmount).replace(/[^0-9.-]+/g, '')) || 0,
// FIX: Property 'propertyId' does not exist on type 'Property'.
                    propertyId: Number(tsProperty?.id ?? 0) || 0,
                    buyerName: stakeholders.buyerName,
                    sellerName: stakeholders.sellerName,
                    agentName: stakeholders.agentName
                };

            const res = await titleSearchService.requestEarnestOutside(payload);
            const requestSuccess = !!(res?.success || res?.data?.success || res?.status === 200 || res?.statusCode === 200);

            // Fetch recent transactions and look for a matching charge for this property
            let matchedCharge: any = null;
            try {
                const tx = await transactionsService.getTransactions({ limit: 100, page: 1 });
                const charges = tx?.charges ?? [];
                // try to find a charge that matches the property address (loose match)
                matchedCharge = charges.find((c: any) => {
                    const cAddr = (c.address || '').toLowerCase();
                    const pAddr = (tsProperty?.address || '').toLowerCase();
                    return cAddr && pAddr && (cAddr === pAddr || pAddr.includes(cAddr) || cAddr.includes(pAddr));
                });
                console.log('Fetched transactions, matched charge:', matchedCharge);
            } catch (txErr) {
                console.warn('Failed to fetch transactions', txErr);
            }

            if (matchedCharge) {
                const resultData: SuccessData = {
                    name: matchedCharge.name,
                    amount: matchedCharge.amount,
                    address: matchedCharge.address,
                    status: matchedCharge.status,
                    date: matchedCharge.date,
                    receiptUrl: matchedCharge.receiptUrl,
                };
                setSubmissionResult(resultData);
                setSubmissionStatus('success');
            } else if (requestSuccess) {
                // fallback: treat as success and synthesize result from form
                const resultData: SuccessData = {
                    name: stakeholders.buyerName || 'Buyer',
                    amount: parseFloat(String(stakeholders.earnestAmount).replace(/[^0-9.-]+/g, '')) || 0,
                    address: tsProperty?.address || '',
                    status: 'unpaid',
                    date: new Date().toISOString()
                };
                setSubmissionResult(resultData);
                setSubmissionStatus('success');
            } else {
                setSubmissionStatus('failure');
            }
        } catch (err) {
            console.error('request earnest failed', err);
            setSubmissionStatus('failure');
        } finally {
            setIsLoading(false);
            setShowConfirm(false);
        }
    };
    
    const handleDone = () => {
        // If we have a submissionResult (from transactions or synthesized), send that full EarnestMoneyData upward.
        if (submissionResult) {
// FIX: Object literal may only specify known properties, and 'address' does not exist in type 'EarnestMoneyData'.
            const payload: EarnestMoneyData = {
                amount: submissionResult.amount,
                fee: 0,
                address: submissionResult.address,
                buyerEmail: stakeholders.buyerEmail || '',
                buyerName: submissionResult.name,
                agentName: stakeholders.agentName,
                sellerName: stakeholders.sellerName,
                status: paymentStatusTypes[ submissionResult.status]  || 'unpaid',
                date: submissionResult.date,
                receiptUrl: submissionResult.receiptUrl || null ,
            };
            if (onSubmit) onSubmit(payload);
            return;
        }

        // Fallback: send the simple form data
        if (onSubmit) onSubmit({
            amount: stakeholders.earnestAmount,
            buyerEmail: stakeholders.buyerEmail,
            buyerName: stakeholders.buyerName,
            agentName: stakeholders.agentName,
            address: tsProperty?.address || '',
            sellerName: stakeholders.sellerName,
// FIX: Type '"Un Paid"' is not assignable to type '"unpaid" | "Paid" | "Received"'. Did you mean '"unpaid"'?
            status: 'unpaid',
            date: new Date().toISOString()
        });
    }
    
    const handleResend = () => {
        // In a real application, this would trigger an API call to resend the notification.
        alert('A new request notification has been sent to the buyer.');
    }

    if (submissionStatus === 'success' && submissionResult) {
        return <SuccessView resultData={submissionResult} onDone={handleDone} onResend={handleResend} />;
    }
    
    if (submissionStatus === 'failure') {
        return <FailureView onRetry={() => setSubmissionStatus('idle')} />;
    }

    return (
        <>
            <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Review Property Details Section */}
                <button
                    type="button"
                    onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                    className="w-full flex justify-between items-center text-left"
                    aria-expanded={isDetailsExpanded}
                >
                    <h2 className="text-xl font-bold text-gray-900">Review Property Details</h2>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isDetailsExpanded && (
                    <div className="mt-4 mb-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-md font-semibold text-gray-800 mb-3">Property Details</h3>
                                <div className="space-y-3">
                                    <EditableField label="Owners" name="owners" value={editableProperty.owners} onChange={handlePropertyChange} />
                                    <EditableField label="Address"  name="address" value={editableProperty.address} isRequired onChange={handlePropertyChange} hasError={attemptedSubmit && !editableProperty.address} />
                                    <div className="grid grid-cols-3 gap-3">
                                        <EditableField label="City" name="city" value={editableProperty.city} isRequired onChange={handlePropertyChange} hasError={attemptedSubmit && !editableProperty.city} />
                                        <EditableField label="State" name="state" value={editableProperty.state} isRequired onChange={handlePropertyChange} hasError={attemptedSubmit && !editableProperty.state} />
                                        <EditableField label="Zip Code" name="zip" value={editableProperty.zip} isRequired onChange={handlePropertyChange} hasError={attemptedSubmit && !editableProperty.zip} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <EditableField label="County" name="county" value={editableProperty.county} isRequired onChange={handlePropertyChange} hasError={attemptedSubmit && !editableProperty.county} />
                                        <EditableField label="Latitude" name="latitude" value={editableProperty.latitude} onChange={handlePropertyChange} />
                                        <EditableField label="Longitude" name="longitude" value={editableProperty.longitude} onChange={handlePropertyChange} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-md font-semibold text-gray-800 mb-3">Additional Details</h3>
                                <div className="grid grid-cols-3 gap-3">
                                   <EditableField label="Last Sold Price" name="lastSoldPrice" value={editableProperty.lastSoldPrice} onChange={handlePropertyChange} />
                                   <EditableField label="Type" name="propertyType" value={editableProperty.propertyType} onChange={handlePropertyChange} />
                                   <EditableField label="Last Modified" name="lastModified" value={editableProperty.lastModified} onChange={handlePropertyChange} />
                                   <EditableField label="APN" name="apn" value={editableProperty.apn} onChange={handlePropertyChange} />
                                   <EditableField label="Billed Year" name="billedYear" value={editableProperty.billedYear} onChange={handlePropertyChange} />
                                   <EditableField label="Current Tax Amount" name="currentTaxAmount" value={editableProperty.currentTaxAmount} onChange={handlePropertyChange} />
                                   <EditableField label="Square Feet" name="sqft" value={editableProperty.sqft} onChange={handlePropertyChange} />
                                   <EditableField label="Bedrooms" name="beds" value={editableProperty.beds} onChange={handlePropertyChange} />
                                   <EditableField label="Full Baths" name="baths" value={editableProperty.baths} onChange={handlePropertyChange} />
                                   <EditableField label="Half Baths" name="halfBaths" value={editableProperty.halfBaths} onChange={handlePropertyChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Add Stakeholders</h2>
                    <p className="text-gray-500 mb-6">Enter stakeholder information to send a request for the earnest money deposit.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="agentName" className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                                <input id="agentName" name="agentName" value={stakeholders.agentName} onChange={handleChange} placeholder="Enter agent name" className="w-full p-3 border border-gray-300 rounded-md"/>
                            </div>
                             <div>
                                <label htmlFor="sellerName" className="block text-sm font-medium text-gray-700 mb-1">Seller Name</label>
                                <input id="sellerName" name="sellerName" value={stakeholders.sellerName} onChange={handleChange} placeholder="Enter seller name" className="w-full p-3 border border-gray-300 rounded-md"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="buyerEmail" className="block text-sm font-medium text-gray-700 mb-1">Buyer Email*</label>
                                <input 
                                    id="buyerEmail"
                                    name="buyerEmail" 
                                    value={stakeholders.buyerEmail} 
                                    onChange={handleChange} 
                                    placeholder="buyer@example.com" 
                                    required 
                                    className={`w-full p-3 border rounded-md ${isEmailValid ? 'border-gray-300' : 'border-red-500 focus:ring-red-500 focus:border-red-500'}`}
                                />
                                 {!isEmailValid && stakeholders.buyerEmail && <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>}
                            </div>
                            <div>
                                <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700 mb-1">Buyer Name*</label>
                                <input id="buyerName" name="buyerName" value={stakeholders.buyerName} onChange={handleChange} placeholder="Enter buyer name" required className="w-full p-3 border border-gray-300 rounded-md"/>
                            </div>
                            <div>
                                <label htmlFor="earnestAmount" className="block text-sm font-medium text-gray-700 mb-1">Earnest Amount*</label>
                                <input id="earnestAmount" name="earnestAmount" value={stakeholders.earnestAmount} onChange={handleChange} placeholder="$10,000.00" required className="w-full p-3 border border-gray-300 rounded-md"/>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={!isFormValid} className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300">
                                Send Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showConfirm && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
                        <QuestionMarkCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Are you sure?</h2>
                        <p className="text-gray-600 mb-6">You are sending an earnest money request to the buyer.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowConfirm(false)} className="px-8 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button>
                            <button onClick={handleConfirm} disabled={isLoading} className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                                {isLoading ? <RefreshIcon className="w-5 h-5 animate-spin"/> : 'Agree & Send'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};