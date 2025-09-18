import React, { useState, useEffect } from 'react';
import type { Property, MarketingData } from '../../types';
import { CameraIcon, UsersIcon, UploadCloudIcon, ChevronLeftIcon, ChevronRightIcon, FullScreenIcon, CloseIcon } from '../icons';

interface MarketingRequestViewProps {
    property: Property;
    onUpdateProperty: (property: Property) => void;
}

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 ${className}`}>
        <div className="flex items-center mb-4">
            {icon}
            <h3 className={`text-lg font-semibold text-gray-800 ${icon ? 'ml-3' : ''}`}>{title}</h3>
        </div>
        {children}
    </div>
);

const FormField: React.FC<{ id: string, label: string, type?: string, placeholder?: string, defaultValue?: string | number, required?: boolean, as?: 'textarea', rows?: number }> = (props) => {
    const commonProps = {
        id: props.id,
        name: props.id,
        className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
        placeholder: props.placeholder,
        required: props.required,
        defaultValue: props.defaultValue,
    };
    return (
        <div>
            <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
                {props.label}
            </label>
            {props.as === 'textarea' ? (
                <textarea {...commonProps} rows={props.rows}></textarea>
            ) : (
                <input type={props.type || 'text'} {...commonProps} />
            )}
        </div>
    );
};

const RadioGroup: React.FC<{ legend: string; name: string; options: string[] }> = ({ legend, name, options }) => (
    <div>
        <legend className="block text-sm font-medium text-gray-700 mb-2">{legend}</legend>
        <div className="flex items-center gap-x-6">
            {options.map(option => (
                <div key={option} className="flex items-center">
                    <input id={`${name}-${option}`} name={name} type="radio" value={option.toLowerCase()} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor={`${name}-${option}`} className="ml-2 block text-sm text-gray-900">{option}</label>
                </div>
            ))}
        </div>
    </div>
);


const MarketingForm: React.FC<{ onSubmit: () => void; property: Property }> = ({ onSubmit, property }) => (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">New Marketing Request</h2>
        <p className="text-gray-500 mb-6">Fill out the form below to initiate the marketing process for this property.</p>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-8">
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <legend className="text-lg font-semibold text-gray-900 col-span-full mb-2">Agent & Package Details</legend>
                <FormField id="agentName" label="Name" placeholder="Samantha Carter" required />
                <FormField id="agentEmail" label="Email" type="email" placeholder="s.carter@example.com" required />
                <div>
                    <label htmlFor="packageType" className="block text-sm font-medium text-gray-700 mb-1">Package Type</label>
                    <select id="packageType" name="packageType" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option>Standard</option>
                        <option>Premium</option>
                        <option>Luxury</option>
                    </select>
                </div>
                <RadioGroup legend="Invoice Paid?" name="invoicePaid" options={['Yes', 'No']} />
            </fieldset>

            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <legend className="text-lg font-semibold text-gray-900 col-span-full mb-2">Property Details</legend>
                <FormField id="address" label="Address" defaultValue={property.address} required />
                <FormField id="dueDate" label="Due Date" type="date" required />
                <FormField id="bedrooms" label="Bedrooms" type="number" defaultValue={property.beds} required />
                <FormField id="fullBathrooms" label="Full Bathrooms" type="number" defaultValue={property.baths} required />
                <FormField id="sqFeet" label="Sq' Feet" type="number" defaultValue={property.sqft} required />
                 <div className="col-span-full">
                    <FormField id="propertyDescription" label="Property Description" as="textarea" rows={4} placeholder="Stunning 3-bedroom..." />
                </div>
            </fieldset>

            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <legend className="text-lg font-semibold text-gray-900 col-span-full mb-2">Agent Brokerage & Contact</legend>
                <FormField id="brokerageName" label="Brokerage Name" placeholder="Prestige Real Estate" required />
                <FormField id="agentPhoneNumber" label="Phone Number" type="tel" placeholder="(555) 123-4567" required />
                <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brokerage Logo</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-blue-600 hover:text-blue-500">Upload a file</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, SVG up to 2MB</p>
                        </div>
                    </div>
                </div>
            </fieldset>
            
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <legend className="text-lg font-semibold text-gray-900 col-span-full mb-2">Marketing & Social Media</legend>
                 <FormField id="brochureDesigner" label="Brochure Designer" placeholder="Olivia Chen" />
                 <FormField id="instagramAccount" label="Instagram Account" placeholder="@handle" />
                 <RadioGroup legend="Facebook Page?" name="hasFacebookPage" options={['Yes', 'No']} />
                 <div className="col-span-full">
                    <FormField id="notes" label="Notes" as="textarea" rows={3} placeholder="Client wants to emphasize..." />
                 </div>
            </fieldset>

            <div className="text-right pt-4">
                <button type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Submit Marketing Request
                </button>
            </div>
        </form>
    </div>
);

const DetailItem: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
    </div>
);

const PhotoCarousel: React.FC<{ photos: string[] }> = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? photos.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === photos.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    
    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    const openFullScreen = (index: number) => {
        setCurrentIndex(index);
        setIsFullScreen(true);
    };

    const closeFullScreen = () => {
        setIsFullScreen(false);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isFullScreen) {
                if (event.key === 'Escape') closeFullScreen();
                if (event.key === 'ArrowLeft') goToPrevious();
                if (event.key === 'ArrowRight') goToNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullScreen, currentIndex]);


    if (!photos || photos.length === 0) {
        return <p>No photos available.</p>;
    }
    
    return (
        <>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden group bg-gray-200">
                <div 
                    style={{ backgroundImage: `url(${photos[currentIndex]})` }} 
                    className="w-full h-full bg-center bg-cover duration-500"
                ></div>
                {/* Left Arrow */}
                <div onClick={goToPrevious} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer hover:bg-black/60 transition-opacity">
                    {/* FIX: Moved onClick handler from ChevronLeftIcon to the parent div, as the icon component does not accept an onClick prop. */}
                    <ChevronLeftIcon className="w-6 h-6" />
                </div>
                {/* Right Arrow */}
                <div onClick={goToNext} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer hover:bg-black/60 transition-opacity">
                    {/* FIX: Moved onClick handler from ChevronRightIcon to the parent div, as the icon component does not accept an onClick prop. */}
                    <ChevronRightIcon className="w-6 h-6" />
                </div>
                {/* Fullscreen Button */}
                <button 
                    onClick={() => openFullScreen(currentIndex)}
                    className="hidden group-hover:block absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full cursor-pointer hover:bg-black/60 transition-opacity"
                    aria-label="View fullscreen"
                >
                    <FullScreenIcon className="w-5 h-5" />
                </button>
            </div>
            {/* Thumbnails */}
            <div className="flex justify-center space-x-2 mt-4 overflow-x-auto p-2">
                {photos.map((photo, index) => (
                    <img 
                        key={index}
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => goToSlide(index)}
                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all ${currentIndex === index ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                    />
                ))}
            </div>

            {isFullScreen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm" role="dialog" aria-modal="true">
                    <img 
                        src={photos[currentIndex]} 
                        alt={`Full screen view ${currentIndex + 1}`} 
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                    />
                    {/* Close Button */}
                    <button 
                        onClick={closeFullScreen} 
                        className="absolute top-5 right-5 p-2 bg-white/20 text-white rounded-full cursor-pointer hover:bg-white/40"
                        aria-label="Close fullscreen view"
                    >
                        <CloseIcon className="w-8 h-8" />
                    </button>
                    {/* Prev Button */}
                     <button 
                        onClick={goToPrevious} 
                        className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-white/20 text-white rounded-full cursor-pointer hover:bg-white/40"
                        aria-label="Previous image"
                    >
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    {/* Next Button */}
                     <button 
                        onClick={goToNext} 
                        className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-white/20 text-white rounded-full cursor-pointer hover:bg-white/40"
                        aria-label="Next image"
                    >
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>
                     {/* Counter */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                        {currentIndex + 1} / {photos.length}
                    </div>
                </div>
            )}
        </>
    );
};


const MarketingDetails: React.FC<{ data: MarketingData | null | undefined }> = ({ data }) => {
    if (!data) return <p>No marketing data available.</p>;

    return (
        <div className="space-y-6">
            <Section title="Photo Gallery" icon={<CameraIcon className="w-6 h-6 text-gray-500" />}>
                <PhotoCarousel photos={data.photos} />
            </Section>
            
            <Section title="Property & Marketing Details">
                <p className="text-gray-600 mb-6 prose prose-sm max-w-none">{data.propertyDescription}</p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                    <DetailItem label="Address" value={data.address} />
                    <DetailItem label="Bedrooms" value={data.bedrooms} />
                    <DetailItem label="Bathrooms" value={data.fullBathrooms} />
                    <DetailItem label="Sq' Feet" value={data.sqFeet} />
                    <DetailItem label="Package Type" value={data.packageType} />
                    <DetailItem label="Due Date" value={data.dueDate} />
                    <DetailItem label="Invoice Paid" value={data.invoicePaid ? 'Yes' : 'No'} />
                    <DetailItem label="Designer" value={data.brochureDesigner || 'N/A'} />
                 </div>
                 {data.notes && (
                    <div className="mt-4">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Notes</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md mt-1">{data.notes}</p>
                    </div>
                 )}
            </Section>

            <Section title="Agent & Social Media" icon={<UsersIcon className="w-6 h-6 text-gray-500" />}>
                 <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <DetailItem label="Agent Name" value={data.agentName} />
                    <DetailItem label="Brokerage" value={data.brokerageName} />
                    <DetailItem label="Email" value={<a href={`mailto:${data.agentEmail}`} className="text-blue-600 hover:underline">{data.agentEmail}</a>} />
                    <DetailItem label="Phone" value={data.agentPhoneNumber} />
                    <DetailItem label="Facebook Page" value={data.hasFacebookPage ? 'Yes' : 'No'} />
                    <DetailItem label="Instagram" value={data.instagramAccount ? <a href={`https://instagram.com/${data.instagramAccount.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.instagramAccount}</a> : 'N/A'} />
                 </div>
            </Section>
        </div>
    );
};


export const MarketingRequestView: React.FC<MarketingRequestViewProps> = ({ property, onUpdateProperty }) => {
    const handleSubmit = () => {
        // In a real app, you would gather form data here.
        // For this version, we create a placeholder data object on submission.
        const submittedData: MarketingData = {
            agentName: 'Samantha Carter',
            agentEmail: 's.carter@example.com',
            brokerageName: 'Prestige Real Estate',
            agentPhoneNumber: '(555) 987-6543',
            packageType: 'Premium',
            invoicePaid: true,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
            address: property.address,
            bedrooms: property.beds,
            fullBathrooms: property.baths,
            sqFeet: property.sqft,
            propertyDescription: 'A stunning, newly-listed property with modern amenities and a spacious layout. Perfect for families and entertaining guests. This is a placeholder description generated upon form submission.',
            photos: [property.imageUrl],
            notes: 'Client wants to emphasize the newly renovated kitchen.',
            brochureDesigner: 'Olivia Chen',
            hasFacebookPage: true,
            instagramAccount: '@PrestigeRE'
        };

        onUpdateProperty({
            ...property,
            marketingRequestStatus: 'Submitted',
            marketingRequestData: submittedData,
        });
    };

    return (
        <div>
            {property.marketingRequestStatus === 'Pending' ? (
                <MarketingForm onSubmit={handleSubmit} property={property} />
            ) : (
                <MarketingDetails data={property.marketingRequestData} />
            )}
        </div>
    );
};