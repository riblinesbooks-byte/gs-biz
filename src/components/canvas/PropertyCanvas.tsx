import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyItem, CustomerLead } from '../../types';
import {
  Home,
  User,
  Users,
  Search,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  FileText,
  Video,
  Image as ImageIcon,
  Layers,
  MapPin,
  Phone,
  Lock,
  Sparkles,
  ArrowRight,
  UserCheck,
  Printer,
  Copy,
  AlertCircle,
  Check,
  Building,
  Tag,
  Share2,
} from 'lucide-react';

interface PropertyCanvasData {
  priceNegotiationRange: string;
  positiveAspects: string;
  issuesToSorted: string;
  addOnFeatures: string;
  sellingScript: string;
  remarks: string;
  photoUrl: string;
  videoUrl: string;
  documentUrl: string;
  shortlistedCustomerIds: string[];
}

const defaultCanvasByPropId: Record<string, PropertyCanvasData> = {
  'prop-1': {
    priceNegotiationRange: '₹2.35 Cr – ₹2.50 Cr (Expected closing at ₹2.40 Cr, White/Bank transfer preferred)',
    positiveAspects: 'Corner Plot with dual 24ft & 20ft road frontage. 100% Clear Patta land with single owner. Walkable to Nanganallur Metro Station (800m). Vaastu compliant North-East orientation.',
    issuesToSorted: 'Family legal heir certificate verified; property tax updated up to 2026. Patta sub-division sketch copy to be handed over.',
    addOnFeatures: 'Compound wall already constructed on 4 sides, dedicated EB 3-phase pole outside, sweet potable water at 40ft depth.',
    sellingScript: 'Pitch this as the only available corner residential plot in 20th Street Nanganallur. Highlight the rare 24ft road width compared to inner 16ft streets. Emphasize immediate construction readiness and high resale value.',
    remarks: 'Owner Venkatesan MD Trust is ready for immediate agreement with 20% advance token. Final settlement within 60 days.',
    photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60',
    videoUrl: 'https://www.youtube.com/watch?v=walkthrough-prop1',
    documentUrl: 'https://landrecords.tn.gov.in/patta-extract/20th-street-prop-1.pdf',
    shortlistedCustomerIds: ['cust-1', 'cust-2', 'cust-4'],
  },
  'prop-2': {
    priceNegotiationRange: '₹44 Lakhs – ₹48 Lakhs (Direct builder fixed price, 5% festive discount possible on full upfront payment)',
    positiveAspects: 'DTCP & RERA approved township layout with wide 30ft blacktop roads. Just 1.2 km from Guduvanchery Railway Station. Gated community with 24/7 security booth.',
    issuesToSorted: 'Layout conversion approval papers ready. Bank loan pre-approved with SBI, HDFC & ICICI.',
    addOnFeatures: 'Park reservation area, avenue tree plantation, underground drainage provision, solar street lights installed.',
    sellingScript: 'Position for mid-range villa plot buyers seeking guaranteed capital growth near Kilambakkam Bus Terminus. Stress that Guduvanchery is Chennai southern growth corridor.',
    remarks: 'Guduvanchery Promoters representative available on-site daily 10 AM to 6 PM for client inspections.',
    photoUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?w=600&auto=format&fit=crop&q=60',
    videoUrl: 'https://www.youtube.com/watch?v=guduvanchery-drone',
    documentUrl: 'https://rera.tn.gov.in/registration/gdv-township.pdf',
    shortlistedCustomerIds: ['cust-3', 'cust-4'],
  },
  'prop-3': {
    priceNegotiationRange: '₹38 Lakhs – ₹42 Lakhs (Owner flexible for quick 30-day registration)',
    positiveAspects: 'Sweet potable ground water, ready to build individual villa, excellent connectivity to GST Road.',
    issuesToSorted: 'Joint patta transfer application filed at Taluk office; completion expected in 10 days.',
    addOnFeatures: 'Gated community layout, 30ft blacktop approach road, close to reputed CBSE schools.',
    sellingScript: 'Target young families and IT professionals working in Mahindra World City / Siruseri seeking peaceful suburban residential environment.',
    remarks: 'Owner willing to coordinate site visits on Saturday and Sunday mornings.',
    photoUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=60',
    videoUrl: 'https://www.youtube.com/watch?v=urapakkam-plots',
    documentUrl: 'https://landrecords.tn.gov.in/patta/urapakkam-sec4.pdf',
    shortlistedCustomerIds: ['cust-1', 'cust-5'],
  },
};

export const PropertyCanvas: React.FC = () => {
  const { properties, customerLeads, setCurrentPage, addToast } = useApp();

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || 'prop-1');
  const [canvasStorage, setCanvasStorage] = useState<Record<string, PropertyCanvasData>>(() => defaultCanvasByPropId);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [customerFilter, setCustomerFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedProperty = useMemo(() => {
    return properties.find((p) => p.id === selectedPropertyId) || properties[0];
  }, [properties, selectedPropertyId]);

  const currentData: PropertyCanvasData = useMemo(() => {
    if (canvasStorage[selectedPropertyId]) {
      return canvasStorage[selectedPropertyId];
    }
    return {
      priceNegotiationRange: `${selectedProperty?.price || '2.00 Cr'} (Negotiable range to be configured)`,
      positiveAspects: selectedProperty?.features?.join(', ') || 'Prime location, clear title, immediate registration',
      issuesToSorted: 'All title documents under verification',
      addOnFeatures: selectedProperty?.groundArea ? `Area: ${selectedProperty.groundArea}` : 'Standard amenities',
      sellingScript: `Highlight ${selectedProperty?.title || 'property'} located in ${selectedProperty?.locality || 'prime area'}.`,
      remarks: 'Active mandate. Site visits to be coordinated with owner.',
      photoUrl: selectedProperty?.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60',
      videoUrl: 'https://www.youtube.com/watch?v=walkthrough',
      documentUrl: 'https://landrecords.tn.gov.in/patta-extract.pdf',
      shortlistedCustomerIds: customerLeads.slice(0, 2).map((c) => c.id),
    };
  }, [canvasStorage, selectedPropertyId, selectedProperty, customerLeads]);

  const handleFieldChange = (field: keyof PropertyCanvasData, value: any) => {
    setCanvasStorage((prev) => ({
      ...prev,
      [selectedPropertyId]: {
        ...currentData,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    addToast(`Property Canvas saved for "${selectedProperty?.title}"`, 'success');
  };

  const handleCopySummary = () => {
    const summary = `PROPERTY CANVAS: ${selectedProperty?.title}\nPrice: ${selectedProperty?.price}\nRange: ${currentData.priceNegotiationRange}\nAspects: ${currentData.positiveAspects}\nScript: ${currentData.sellingScript}`;
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Canvas executive summary copied to clipboard', 'info');
  };

  const shortlistedCustomers = useMemo(() => {
    const ids = currentData.shortlistedCustomerIds || [];
    return customerLeads.filter((c) => ids.includes(c.id));
  }, [customerLeads, currentData.shortlistedCustomerIds]);

  const availableCustomers = useMemo(() => {
    const ids = currentData.shortlistedCustomerIds || [];
    return customerLeads.filter(
      (c) =>
        !ids.includes(c.id) &&
        (c.name.toLowerCase().includes(customerFilter.toLowerCase()) ||
          c.contactNo.includes(customerFilter) ||
          c.customerType.toLowerCase().includes(customerFilter.toLowerCase()))
    );
  }, [customerLeads, currentData.shortlistedCustomerIds, customerFilter]);

  const handleAddCustomerToShortlist = (customerId: string) => {
    const currentList = currentData.shortlistedCustomerIds || [];
    if (!currentList.includes(customerId)) {
      handleFieldChange('shortlistedCustomerIds', [...currentList, customerId]);
      addToast('Customer added to shortlisted buyer list', 'success');
    }
  };

  const handleRemoveCustomerFromShortlist = (customerId: string) => {
    const currentList = currentData.shortlistedCustomerIds || [];
    handleFieldChange(
      'shortlistedCustomerIds',
      currentList.filter((id) => id !== customerId)
    );
  };

  return (
    <div className="space-y-5 pb-16 max-w-[1600px] mx-auto">
      {/* Top Header & Page Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
                <Home className="w-5 h-5" />
              </span>
              <span>Property Canvas</span>
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              Executive Worksheet
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured appraisal worksheet for pricing range, positive aspects, legal clearance, pitching script, and buyer matching.
          </p>
        </div>

        {/* Canvas Switcher Tabs matching Canvas Menu */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setCurrentPage('seller_canvas')}
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Seller Canvas</span>
          </button>
          <button
            onClick={() => setCurrentPage('customer_canvas')}
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Customer Canvas</span>
          </button>
          <button
            onClick={() => setCurrentPage('property_canvas')}
            className="px-3.5 py-1.5 rounded-lg bg-white shadow-xs text-emerald-800 font-bold flex items-center gap-1.5 border border-slate-200"
          >
            <Home className="w-3.5 h-3.5 text-emerald-600" />
            <span>Property Canvas</span>
          </button>
        </div>
      </div>

      {/* Select Potential Property Bar (as shown on top of Page 1) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Select potential Property:</span>
          </label>
          <div className="relative flex-1 max-w-2xl">
            <select
              id="select-potential-property-canvas"
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden transition cursor-pointer shadow-2xs"
            >
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.title} — {prop.locality} ({prop.price}) [{prop.propertyCode}]
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 shadow-2xs transition flex items-center gap-1.5"
            title="Copy Executive Summary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 shadow-2xs transition flex items-center gap-1.5"
            title="Print Canvas Worksheet"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          <button
            id="btn-save-property-canvas"
            onClick={handleSave}
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Canvas</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          EXACT CANVAS WORKSHEET LAYOUT AS SPECIFIED IN DOCUMENT PAGE 1
          ========================================================================= */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden text-xs">
        {/* ROW 1: [Property Canvas / Seller Details] | [Property Name, Area] | [Photo / Video / Document URLs] */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-300 divide-y lg:divide-y-0 lg:divide-x border-slate-300">
          {/* Box 1: Property Canvas - Seller Details */}
          <div className="lg:col-span-3 bg-slate-50/60 p-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-200 pb-2.5 mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Property Canvas
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>Seller Details</span>
                  </h3>
                </div>
                {selectedProperty?.isLocked && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Seller / Landlord Name
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedProperty?.ownerName || 'Venkatesan MD Trust'}
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Contact Phone
                  </span>
                  <a
                    href={`tel:${selectedProperty?.ownerContact}`}
                    className="font-mono font-bold text-emerald-800 flex items-center gap-1.5 mt-0.5 hover:underline"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{selectedProperty?.ownerContact || '+91 94440 26113'}</span>
                  </a>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Seller Locality
                  </span>
                  <div className="font-medium text-slate-700 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedProperty?.locality || 'Nanganallur, Chennai'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Automatic Seller Details</span>
              <span className="text-emerald-700 font-semibold">Synced</span>
            </div>
          </div>

          {/* Box 2: Property Name, Area */}
          <div className="lg:col-span-6 p-4 bg-white flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-200 pb-2.5 mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-emerald-700" />
                    <span>Property Name, Area</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Automatic Property Details from the Potential property added
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
                  {selectedProperty?.propertyType || 'Plot'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/70">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Property Title
                  </span>
                  <div className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                    {selectedProperty?.title}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">
                    Code: {selectedProperty?.propertyCode}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/70">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Area & Dimensions
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedProperty?.groundArea || `${selectedProperty?.sizeSqFt} sq ft`}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Total: {selectedProperty?.sizeSqFt} Sq. Ft
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200/70">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold block">
                    Expected / Asking Price
                  </span>
                  <div className="text-base font-bold text-emerald-800 mt-0.5">
                    {selectedProperty?.price}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/70">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Full Property Address
                  </span>
                  <div className="text-xs font-medium text-slate-700 leading-tight mt-0.5 line-clamp-2">
                    {selectedProperty?.address || `${selectedProperty?.locality}, Chennai`}
                  </div>
                </div>
              </div>

              {/* Features Chips */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1">
                {selectedProperty?.features?.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/70"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-2 text-right">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Status: {selectedProperty?.status || 'Available'}
              </span>
            </div>
          </div>

          {/* Box 3: Media Links */}
          <div className="lg:col-span-3 bg-slate-50/40 p-4 space-y-3">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Media & Verification
              </h4>
              <span className="text-[10px] text-slate-400">Links</span>
            </div>

            {/* Photo Link URL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Photo: Link URL</span>
                </label>
                {currentData.photoUrl && (
                  <a
                    href={currentData.photoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-700 hover:underline flex items-center gap-0.5 font-semibold"
                  >
                    <span>Preview</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <input
                type="text"
                placeholder="https://images.example.com/photo.jpg"
                value={currentData.photoUrl}
                onChange={(e) => handleFieldChange('photoUrl', e.target.value)}
                className="w-full px-2.5 py-1.5 text-[11px] font-mono border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500 outline-hidden transition"
              />
            </div>

            {/* Video Link URL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-600" />
                  <span>Video: Link URL</span>
                </label>
                {currentData.videoUrl && (
                  <a
                    href={currentData.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-rose-700 hover:underline flex items-center gap-0.5 font-semibold"
                  >
                    <span>Play</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=drone-tour"
                value={currentData.videoUrl}
                onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                className="w-full px-2.5 py-1.5 text-[11px] font-mono border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500 outline-hidden transition"
              />
            </div>

            {/* Document Link URL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Document: Link URL</span>
                </label>
                {currentData.documentUrl && (
                  <a
                    href={currentData.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-700 hover:underline flex items-center gap-0.5 font-semibold"
                  >
                    <span>View PDF</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <input
                type="text"
                placeholder="https://landrecords.gov.in/patta.pdf"
                value={currentData.documentUrl}
                onChange={(e) => handleFieldChange('documentUrl', e.target.value)}
                className="w-full px-2.5 py-1.5 text-[11px] font-mono border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500 outline-hidden transition"
              />
            </div>
          </div>
        </div>

        {/* MIDDLE AND LOWER SECTIONS AS DRAWN IN PAGE 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x border-slate-300">
          {/* Main Matrix Left Column (Col 1 to 9): 4 Grid Cells + Remarks */}
          <div className="lg:col-span-9 flex flex-col divide-y border-slate-300">
            {/* 2x2 Grid + Tall Selling Script */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x border-slate-300">
              {/* Left 7 columns: 2x2 Grid */}
              <div className="md:col-span-7 flex flex-col divide-y border-slate-300">
                {/* Row 1: Price Negociation Range & Postive Aspects of Property */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-slate-300">
                  {/* Price Negociation Range */}
                  <div className="p-3.5 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Price Negociation Range</span>
                      </label>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Editable</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentData.priceNegotiationRange}
                      onChange={(e) => handleFieldChange('priceNegotiationRange', e.target.value)}
                      placeholder="Enter acceptable bottom price, payment terms, installment schedule..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                    />
                  </div>

                  {/* Postive Aspects of Property */}
                  <div className="p-3.5 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Postive Aspects of Property</span>
                      </label>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Editable</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentData.positiveAspects}
                      onChange={(e) => handleFieldChange('positiveAspects', e.target.value)}
                      placeholder="Prime location advantages, road frontage, Vaastu, metro connectivity, clear patta..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                    />
                  </div>
                </div>

                {/* Row 2: Issue to sorted if any & Add on features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-slate-300">
                  {/* Issue to sorted if any */}
                  <div className="p-3.5 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Issue to sorted if any</span>
                      </label>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Editable</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentData.issuesToSorted}
                      onChange={(e) => handleFieldChange('issuesToSorted', e.target.value)}
                      placeholder="Title clearance steps, patta name transfer, encumbrance verification, boundary fencing..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                    />
                  </div>

                  {/* Add on features */}
                  <div className="p-3.5 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-blue-600" />
                        <span>Add on features</span>
                      </label>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Editable</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentData.addOnFeatures}
                      onChange={(e) => handleFieldChange('addOnFeatures', e.target.value)}
                      placeholder="Fencing, sweet bore water, EB meter, avenue trees, drainage connection..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Selling Script (Tall vertical column) */}
              <div className="md:col-span-5 p-3.5 bg-amber-50/25 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-amber-950 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Selling Script</span>
                  </label>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-semibold">Pitching Guide</span>
                </div>
                <textarea
                  rows={10}
                  value={currentData.sellingScript}
                  onChange={(e) => handleFieldChange('sellingScript', e.target.value)}
                  placeholder="Script to pitch when calling buyers or scheduling site visits: 'Sir, this is the only 24ft road corner plot available in this sector...'"
                  className="w-full flex-1 p-3 text-xs border border-amber-300/80 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden resize-none bg-white font-medium text-slate-800 leading-relaxed shadow-2xs"
                />
              </div>
            </div>

            {/* Remarks (spanning across Column 1 & 2) */}
            <div className="p-3.5 bg-white">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Remarks
                </label>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Coordinator Notes</span>
              </div>
              <textarea
                rows={3}
                value={currentData.remarks}
                onChange={(e) => handleFieldChange('remarks', e.target.value)}
                placeholder="Overall coordinator notes, owner constraints, mediator commission agreement..."
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column: Customer/Buyer Shortlisted */}
          <div className="lg:col-span-3 bg-purple-50/30 p-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-purple-200/80 pb-2.5 mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-700" />
                    <span>Customer/Buyer Shortlisted</span>
                  </h3>
                  <span className="text-[10px] text-purple-700 font-semibold">
                    {shortlistedCustomers.length} Matched Buyers
                  </span>
                </div>
              </div>

              {/* Shortlist Items */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {shortlistedCustomers.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 border border-dashed border-purple-200 rounded-xl bg-white/70 p-4">
                    <Users className="w-6 h-6 mx-auto text-purple-300 mb-1" />
                    <p className="text-[11px] font-semibold text-slate-600">No buyers shortlisted yet</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Click the button below to choose from potential customer list.
                    </p>
                  </div>
                ) : (
                  shortlistedCustomers.map((cust) => (
                    <div
                      key={cust.id}
                      className="p-2.5 bg-white border border-purple-200/90 rounded-xl shadow-2xs hover:shadow-xs transition"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{cust.name}</div>
                          <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-purple-600" />
                            <span>{cust.contactNo}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveCustomerFromShortlist(cust.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                          title="Remove from shortlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-800 font-semibold">
                          {cust.customerType}
                        </span>
                        <span className="font-bold text-slate-700">
                          {cust.expectedPrice || 'Standard'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Document Page 1 Button: "add button (to choose form potential customer list)" */}
            <div className="pt-3 border-t border-purple-200/80 mt-4">
              <button
                id="btn-add-shortlisted-customer"
                onClick={() => setShowAddCustomerModal(true)}
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer / Buyer to Shortlist</span>
              </button>
              <p className="text-[10px] text-center text-purple-800 mt-1 font-medium">
                (Choose from potential customer list)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: CHOOSE FROM POTENTIAL CUSTOMER LIST */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-purple-50/70">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Choose from Potential Customer List</h3>
                  <p className="text-[11px] text-slate-500">
                    Select buyers to shortlist for &ldquo;{selectedProperty?.title}&rdquo;
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search customer name, contact, type..."
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-purple-500 outline-hidden"
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-1">
              {availableCustomers.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  All eligible potential customers are already shortlisted.
                </div>
              ) : (
                availableCustomers.map((c) => (
                  <div
                    key={c.id}
                    className="py-2.5 px-2 flex items-center justify-between hover:bg-purple-50/50 rounded-lg transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {c.contactNo} • {c.customerType} • {c.locality || 'Chennai'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddCustomerToShortlist(c.id)}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Shortlist</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
