import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerLead, PropertyItem } from '../../types';
import {
  Users,
  User,
  Home,
  Save,
  Phone,
  Lock,
  Sparkles,
  MapPin,
  Clock,
  MessageSquare,
  HelpCircle,
  CheckCircle,
  ExternalLink,
  Layers,
  UserCheck,
  Printer,
  Copy,
  Check,
  Tag,
  Maximize2,
  Compass,
} from 'lucide-react';

interface CustomerCanvasData {
  remarks: string;
  howContactedUs: string;
  priceNegotiationRange: string;
  areaOfPropertyRequired: string;
  anySpecialNeeds: string;
  addOnFeatures: string;
  comfortableCallTime: string;
  sellingScript: string;
  matchedPropertyIds: string[];
}

const defaultCustomerCanvasById: Record<string, CustomerCanvasData> = {
  'cust-1': {
    remarks: 'High net-worth investor seeking joint-development commercial or residential land. Father and son make joint decisions.',
    howContactedUs: 'Direct Referral through Advocate Ramanathan & 99acres Premium Lead',
    priceNegotiationRange: '₹2.80 Cr – ₹3.50 Cr (Comfortable with ₹3.20 Cr if corner property or main road frontage)',
    areaOfPropertyRequired: '1.5 to 2.5 Grounds (3,600 – 6,000 Sq. Ft) with minimum 30ft approach road width',
    anySpecialNeeds: '100% Vaastu compliant East or North facing. CMDA / DTCP approved only with clear mother deed title.',
    addOnFeatures: 'High groundwater sweet table, compound wall already built, independent electricity transformer nearby.',
    comfortableCallTime: 'Weekdays after 6:30 PM, or Saturday mornings between 10:00 AM – 1:00 PM.',
    sellingScript: 'Position the 20th Street Nanganallur corner plot or Guduvanchery frontage. Emphasize capital appreciation and high rental yields for upcoming metro connectivity.',
    matchedPropertyIds: ['prop-1', 'prop-2'],
  },
  'cust-2': {
    remarks: 'Individual plot buyer planning retirement bungalow construction within 12 months.',
    howContactedUs: 'Walk-in at branch office after seeing on-site signboard in Nanganallur',
    priceNegotiationRange: '₹75 Lakhs – ₹90 Lakhs (Can arrange 25% token immediately on title agreement)',
    areaOfPropertyRequired: '1 Ground (2,400 Sq. Ft) or 1,800 Sq. Ft residential plot',
    anySpecialNeeds: 'Peaceful residential neighborhood, walking distance to temple and medical store.',
    addOnFeatures: 'Avenue trees, clear boundaries, friendly neighbors, no high-tension electricity lines nearby.',
    comfortableCallTime: 'Morning 10:00 AM – 12:30 PM on any day.',
    sellingScript: 'Show ready-to-build villa plots with verified patta. Stress quiet residential ambiance and safety.',
    matchedPropertyIds: ['prop-1', 'prop-3'],
  },
  'cust-3': {
    remarks: 'NRI buyer based in Singapore; looking for rental yield apartment or ready DTCP villa layout.',
    howContactedUs: 'MagicBricks international investor query & WhatsApp direct message',
    priceNegotiationRange: '₹40 Lakhs – ₹55 Lakhs (Full white remittance / NRE account transfer)',
    areaOfPropertyRequired: '1,200 – 1,800 Sq. Ft (Plot or 2-3 BHK Flat)',
    anySpecialNeeds: 'Gated community with 24/7 security and property management maintenance support.',
    addOnFeatures: 'Clubhouse, swimming pool, underground drainage, prepaid power meter.',
    comfortableCallTime: 'Indian Time: 4:00 PM – 7:00 PM (Singapore Time: 6:30 PM – 9:30 PM).',
    sellingScript: 'Highlight developer reputation, RERA registration, and guaranteed rental assistance from property management team.',
    matchedPropertyIds: ['prop-2', 'prop-4'],
  },
};

export const CustomerCanvas: React.FC = () => {
  const { customerLeads, properties, setCurrentPage, addToast } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customerLeads[0]?.id || 'cust-1');
  const [canvasStorage, setCanvasStorage] = useState<Record<string, CustomerCanvasData>>(() => defaultCustomerCanvasById);
  const [copied, setCopied] = useState(false);

  const selectedCustomer = useMemo(() => {
    return customerLeads.find((c) => c.id === selectedCustomerId) || customerLeads[0];
  }, [customerLeads, selectedCustomerId]);

  const currentData: CustomerCanvasData = useMemo(() => {
    if (canvasStorage[selectedCustomerId]) {
      return canvasStorage[selectedCustomerId];
    }
    return {
      remarks: selectedCustomer?.notes || 'Customer seeking verified residential plot or investment asset.',
      howContactedUs: 'Website / Inbound Phone Enquiry',
      priceNegotiationRange: `${selectedCustomer?.expectedPrice || 'Standard Market Rate'} (Negotiable range to be finalized)`,
      areaOfPropertyRequired: selectedCustomer?.propertyOffered || '1 to 2 Grounds (2,400 – 4,800 Sq. Ft)',
      anySpecialNeeds: 'Vaastu compliant, clear title, immediate registration',
      addOnFeatures: 'Gated community, blacktop road, sweet water',
      comfortableCallTime: 'Weekdays 11:00 AM – 1:00 PM or 5:00 PM – 7:00 PM',
      sellingScript: `Highlight verified properties in ${selectedCustomer?.locality || 'preferred locality'} fitting budget of ${selectedCustomer?.expectedPrice || 'market'}.`,
      matchedPropertyIds: properties.slice(0, 2).map((p) => p.id),
    };
  }, [canvasStorage, selectedCustomerId, selectedCustomer, properties]);

  const handleFieldChange = (field: keyof CustomerCanvasData, value: any) => {
    setCanvasStorage((prev) => ({
      ...prev,
      [selectedCustomerId]: {
        ...currentData,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    addToast(`Customer Canvas saved for "${selectedCustomer?.name}"`, 'success');
  };

  const handleCopySummary = () => {
    const summary = `CUSTOMER CANVAS: ${selectedCustomer?.name}\nBudget: ${selectedCustomer?.expectedPrice}\nRange: ${currentData.priceNegotiationRange}\nArea: ${currentData.areaOfPropertyRequired}\nScript: ${currentData.sellingScript}`;
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Customer Canvas summary copied to clipboard', 'info');
  };

  return (
    <div className="space-y-5 pb-16 max-w-[1600px] mx-auto">
      {/* Top Header & Page Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/70 shadow-2xs">
                <Users className="w-5 h-5" />
              </span>
              <span>Customer / Buyer Canvas</span>
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-bold border border-purple-200">
              Executive Worksheet (Page 2 Top)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Buyer appraisal worksheet mapping budget flexibility, space requirements, special conditions, and personalized sales pitch.
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
            className="px-3.5 py-1.5 rounded-lg bg-white shadow-xs text-purple-800 font-bold flex items-center gap-1.5 border border-slate-200"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Customer Canvas</span>
          </button>
          <button
            onClick={() => setCurrentPage('property_canvas')}
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-emerald-600" />
            <span>Property Canvas</span>
          </button>
        </div>
      </div>

      {/* Select potential Customer Name Dropdown Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Select potential Customer Name:</span>
          </label>
          <div className="relative flex-1 max-w-2xl">
            <select
              id="select-potential-customer-canvas"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white outline-hidden transition cursor-pointer shadow-2xs"
            >
              {customerLeads.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.name} — {cust.customerType} ({cust.contactNo}) [{cust.expectedPrice || cust.locality}]
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
            {copied ? <Check className="w-3.5 h-3.5 text-purple-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
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
            id="btn-save-customer-canvas"
            onClick={handleSave}
            className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Canvas</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          EXACT CANVAS GRID AS SPECIFIED IN DOCUMENT PAGE 2 (TOP PICTURE)
          ========================================================================= */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden text-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x border-slate-300">
          {/* LEFT COLUMN: Customer/Buyer Canvas | Customer Name Details */}
          <div className="lg:col-span-3 bg-slate-50/60 p-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-200 pb-2.5 mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 block">
                    Customer/Buyer Canvas
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-purple-700" />
                    <span>Customer Name Details</span>
                  </h3>
                </div>
                {selectedCustomer?.isLocked && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Customer / Buyer Name
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedCustomer?.name}</div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Mobile Contact
                  </span>
                  <a
                    href={`tel:${selectedCustomer?.contactNo}`}
                    className="font-mono font-bold text-purple-900 flex items-center gap-1.5 mt-0.5 hover:underline"
                  >
                    <Phone className="w-3 h-3 text-purple-600" />
                    <span>{selectedCustomer?.contactNo}</span>
                  </a>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Customer Classification
                  </span>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      {selectedCustomer?.customerType}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Preferred Locality / Area
                  </span>
                  <div className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
                    <span className="truncate">{selectedCustomer?.locality || selectedCustomer?.propertyAddress || 'Chennai'}</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Budget / Expected Price
                  </span>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    {selectedCustomer?.expectedPrice || 'Standard Rate'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Automatic Customer Details</span>
              <span className="text-purple-700 font-semibold">Verified</span>
            </div>
          </div>

          {/* MAIN MATRIX: Rows corresponding to Page 2 Top Diagram */}
          <div className="lg:col-span-9 flex flex-col divide-y border-slate-300">
            {/* ROW 1: Remarks | How contacted us */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-slate-300">
              {/* Remarks */}
              <div className="p-3.5 bg-white flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                    <span>Remarks</span>
                  </label>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Editable</span>
                </div>
                <textarea
                  rows={3}
                  value={currentData.remarks}
                  onChange={(e) => handleFieldChange('remarks', e.target.value)}
                  placeholder="Key background notes, family profile, decision making timeline..."
                  className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                />
              </div>

              {/* How contacted us */}
              <div className="p-3.5 bg-white flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>How contacted us</span>
                  </label>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Lead Source</span>
                </div>
                <textarea
                  rows={3}
                  value={currentData.howContactedUs}
                  onChange={(e) => handleFieldChange('howContactedUs', e.target.value)}
                  placeholder="e.g. 99acres portal, MagicBricks, Walk-in, Direct Referral, Instagram ad..."
                  className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                />
              </div>
            </div>

            {/* ROW 2 & ROW 3: [Price / Area] + [Special Needs / Add-on] + [Selling Script on right] */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x border-slate-300">
              {/* Left 8 columns: 2x2 Grid + Comfortable Call Time */}
              <div className="md:col-span-8 flex flex-col divide-y border-slate-300">
                {/* 2x2 Row 1: Price Negociation Range | area of property required */}
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
                      placeholder="Buyer budget range, token capacity, bank loan eligibility..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                    />
                  </div>

                  {/* area of property required */}
                  <div className="p-3.5 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>area of property required</span>
                      </label>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Dimensions</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentData.areaOfPropertyRequired}
                      onChange={(e) => handleFieldChange('areaOfPropertyRequired', e.target.value)}
                      placeholder="Desired size in Grounds, Sq. Ft, front road width, frontage dimensions..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                    />
                  </div>
                </div>

                {/* 2x2 Row 2: any special needs | Add on features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-slate-300">
                  {/* any special needs */}
                  <div className="p-3.5 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-amber-600" />
                        <span>any special needs</span>
                      </label>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Criteria</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentData.anySpecialNeeds}
                      onChange={(e) => handleFieldChange('anySpecialNeeds', e.target.value)}
                      placeholder="Vaastu orientation, North/East facing, ground floor, CMDA approved only, immediate registration..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                    />
                  </div>

                  {/* Add on features */}
                  <div className="p-3.5 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Add on features</span>
                      </label>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Amenities</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentData.addOnFeatures}
                      onChange={(e) => handleFieldChange('addOnFeatures', e.target.value)}
                      placeholder="Gated community, sweet potable ground water, wide approach road, avenue trees..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                    />
                  </div>
                </div>

                {/* Comfortable call time */}
                <div className="p-3.5 bg-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Comfortable call time</span>
                    </label>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Availability</span>
                  </div>
                  <textarea
                    rows={2}
                    value={currentData.comfortableCallTime}
                    onChange={(e) => handleFieldChange('comfortableCallTime', e.target.value)}
                    placeholder="Preferred hours to call (e.g. Weekdays after 6 PM, Saturday morning 10 AM – 1 PM, avoid call during lunch)..."
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                  />
                </div>
              </div>

              {/* Selling Script (tall vertical column) */}
              <div className="md:col-span-4 p-3.5 bg-amber-50/25 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-amber-950 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Selling Script</span>
                  </label>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-semibold">Pitching Guide</span>
                </div>
                <textarea
                  rows={14}
                  value={currentData.sellingScript}
                  onChange={(e) => handleFieldChange('sellingScript', e.target.value)}
                  placeholder="Sales pitch script tailored to this customer: 'Sir, regarding your requirement for a verified residential plot in Nanganallur, we have an exclusive corner listing with 24ft road width and clear patta ready for registration...'"
                  className="w-full flex-1 p-3 text-xs border border-amber-300/80 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden resize-none bg-white font-medium text-slate-800 leading-relaxed shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
