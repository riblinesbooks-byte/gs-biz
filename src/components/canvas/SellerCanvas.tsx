import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerLead } from '../../types';
import {
  UserCheck,
  User,
  Home,
  Users,
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
  Printer,
  Copy,
  Check,
  Tag,
  Maximize2,
  FileCheck,
} from 'lucide-react';

interface SellerCanvasData {
  remarks: string;
  howContactedUs: string;
  priceNegotiationRange: string;
  areaOfPropertyRequired: string;
  anySpecialNeeds: string;
  addOnFeatures: string;
  comfortableCallTime: string;
  sellingScript: string;
}

const defaultSellerCanvasById: Record<string, SellerCanvasData> = {
  'buyer-1': {
    remarks: 'Sole owner with registered release deed. Looking to sell within 45 days due to son overseas relocation in Canada.',
    howContactedUs: 'Referral from Advocate Ramanathan & On-site "For Sale" contact board in Nanganallur',
    priceNegotiationRange: 'Expected ₹2.50 Cr, minimum acceptable bottom line ₹2.38 Cr in white banking check/RTGS',
    areaOfPropertyRequired: '1 Ground (2,400 Sq. Ft) Residential Plot, 40ft frontage × 60ft depth with 24ft road',
    anySpecialNeeds: 'Requires 20% advance token on agreement signing, 60 days time period for final balance settlement',
    addOnFeatures: 'Individual Patta No. 4412 in single name, boundary stones fixed, 4-side compound wall, no litigation',
    comfortableCallTime: '11:00 AM – 1:00 PM, or after 7:00 PM. Avoid calling between 2:00 PM – 5:00 PM.',
    sellingScript: 'Explain current market rate of ₹2.40 Cr in 20th Street. Assure fast turnaround with verified ready-token NRI buyers. Propose exclusive 30-day mandate to get best price without broker clutter.',
  },
  'buyer-2': {
    remarks: 'Family ancestral property with 3 legal heirs; all co-owners have signed general power of attorney.',
    howContactedUs: 'Walk-in at office after reading Sunday newspaper classified advertisement',
    priceNegotiationRange: 'Asking ₹85 Lakhs, negotiable down to ₹80 Lakhs for single-cheque payment',
    areaOfPropertyRequired: '1,800 Sq. Ft (30 × 60) residential plot with 20ft road frontage',
    anySpecialNeeds: 'Immediate registration preferred; all heirs will be present in sub-registrar office',
    addOnFeatures: 'Sweet potable drinking water at 35ft, EB line nearby, adjacent to newly built luxury villas',
    comfortableCallTime: 'Weekdays 10:00 AM – 12:00 PM, Saturday any time after 11:00 AM.',
    sellingScript: 'Assure seller of transparent deed verification and zero delay in token deposit. Highlight ready pipeline of local bank employee buyers.',
  },
  'buyer-3': {
    remarks: 'NRI seller living in Dallas, USA. Cousin holding power of attorney in Chennai with original documents.',
    howContactedUs: 'Inbound email enquiry via website NRI property liquidation page',
    priceNegotiationRange: '₹3.00 Cr – ₹3.20 Cr (100% white transaction through NRE/NRO banking channels)',
    areaOfPropertyRequired: '2 Grounds (4,800 Sq. Ft) commercial-cum-residential corner plot',
    anySpecialNeeds: 'Repatriation advice needed for sale proceeds; requires chartered accountant assistance',
    addOnFeatures: 'Dual corner road frontage, commercial conversion potential, metro station in 500m',
    comfortableCallTime: 'US Central Time 8:00 PM – 10:00 PM (Indian Time: 6:30 AM – 8:30 AM) or via WhatsApp.',
    sellingScript: 'Provide end-to-end NRI concierge assistance including CA repatriation certificates, online video negotiations, and direct buyer conference.',
  },
};

export const SellerCanvas: React.FC = () => {
  const { buyerLeads, properties, setCurrentPage, addToast } = useApp();

  const [selectedSellerId, setSelectedSellerId] = useState<string>(buyerLeads[0]?.id || 'buyer-1');
  const [canvasStorage, setCanvasStorage] = useState<Record<string, SellerCanvasData>>(() => defaultSellerCanvasById);
  const [copied, setCopied] = useState(false);

  const selectedSeller = useMemo(() => {
    return buyerLeads.find((b) => b.id === selectedSellerId) || buyerLeads[0];
  }, [buyerLeads, selectedSellerId]);

  const currentData: SellerCanvasData = useMemo(() => {
    if (canvasStorage[selectedSellerId]) {
      return canvasStorage[selectedSellerId];
    }
    return {
      remarks: selectedSeller?.requirement || 'Seller registered for property sale and mandate coordination.',
      howContactedUs: 'Office Referral / Direct Seller Walk-in',
      priceNegotiationRange: `${selectedSeller?.budget || 'Market Rate'} (Negotiable range to be agreed upon)`,
      areaOfPropertyRequired: selectedSeller?.propertyArea || selectedSeller?.areaOfLand || '1 to 2 Grounds (2,400 – 4,800 Sq. Ft)',
      anySpecialNeeds: 'Clear registration, advance token required, agreed settlement duration',
      addOnFeatures: 'Clear patta, surveyed boundaries, compound wall',
      comfortableCallTime: 'Weekdays 11:00 AM – 1:00 PM or 6:00 PM – 8:00 PM',
      sellingScript: `Explain realistic market valuations in ${selectedSeller?.preferredLocality || 'area'} and propose exclusive mandate.`,
    };
  }, [canvasStorage, selectedSellerId, selectedSeller]);

  const handleFieldChange = (field: keyof SellerCanvasData, value: any) => {
    setCanvasStorage((prev) => ({
      ...prev,
      [selectedSellerId]: {
        ...currentData,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    addToast(`Seller Canvas saved for "${selectedSeller?.name}"`, 'success');
  };

  const handleCopySummary = () => {
    const summary = `SELLER CANVAS: ${selectedSeller?.name}\nAsking: ${selectedSeller?.budget}\nNegotiation: ${currentData.priceNegotiationRange}\nArea: ${currentData.areaOfPropertyRequired}\nPitching: ${currentData.sellingScript}`;
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Seller Canvas summary copied to clipboard', 'info');
  };

  return (
    <div className="space-y-5 pb-16 max-w-[1600px] mx-auto">
      {/* Top Header & Page Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 shadow-2xs">
                <UserCheck className="w-5 h-5" />
              </span>
              <span>Seller Canvas</span>
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
              Executive Worksheet (Page 2 Bottom)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Landowner appraisal worksheet tracking bottom-line valuation, property area, legal settlement conditions, and mandate pitch.
          </p>
        </div>

        {/* Canvas Switcher Tabs matching Canvas Menu */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setCurrentPage('seller_canvas')}
            className="px-3.5 py-1.5 rounded-lg bg-white shadow-xs text-blue-800 font-bold flex items-center gap-1.5 border border-slate-200"
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
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-emerald-600" />
            <span>Property Canvas</span>
          </button>
        </div>
      </div>

      {/* Select potential seller Name Dropdown Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Select potential seller Name:</span>
          </label>
          <div className="relative flex-1 max-w-2xl">
            <select
              id="select-potential-seller-canvas"
              value={selectedSellerId}
              onChange={(e) => setSelectedSellerId(e.target.value)}
              className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden transition cursor-pointer shadow-2xs"
            >
              {buyerLeads.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.name} — {seller.contactNo} [{seller.preferredLocality || 'Chennai'}] ({seller.budget || 'Sale'})
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
            {copied ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
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
            id="btn-save-seller-canvas"
            onClick={handleSave}
            className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Canvas</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          EXACT CANVAS GRID AS SPECIFIED IN DOCUMENT PAGE 2 (BOTTOM PICTURE)
          ========================================================================= */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden text-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x border-slate-300">
          {/* LEFT COLUMN: Seller Canvas | Seller Name Details */}
          <div className="lg:col-span-3 bg-slate-50/60 p-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-200 pb-2.5 mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 block">
                    Seller Canvas
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-700" />
                    <span>Seller Name Details</span>
                  </h3>
                </div>
                {selectedSeller?.isLocked && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Seller / Landowner Name
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedSeller?.name}</div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Contact Phone
                  </span>
                  <a
                    href={`tel:${selectedSeller?.contactNo}`}
                    className="font-mono font-bold text-blue-900 flex items-center gap-1.5 mt-0.5 hover:underline"
                  >
                    <Phone className="w-3 h-3 text-blue-600" />
                    <span>{selectedSeller?.contactNo}</span>
                  </a>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Property Category / Enquiry
                  </span>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      {selectedSeller?.enquiryFor || 'Land / Plot Sale'}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Seller Locality
                  </span>
                  <div className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate">{selectedSeller?.preferredLocality || 'Chennai'}</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Expected / Asking Price
                  </span>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    {selectedSeller?.budget || '2.50 Cr'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Automatic Seller Details</span>
              <span className="text-blue-700 font-semibold">Verified</span>
            </div>
          </div>

          {/* MAIN MATRIX: Rows corresponding to Page 2 Bottom Diagram */}
          <div className="lg:col-span-9 flex flex-col divide-y border-slate-300">
            {/* ROW 1: Remarks | How contacted us */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-slate-300">
              {/* Remarks */}
              <div className="p-3.5 bg-white flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Remarks</span>
                  </label>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Editable</span>
                </div>
                <textarea
                  rows={3}
                  value={currentData.remarks}
                  onChange={(e) => handleFieldChange('remarks', e.target.value)}
                  placeholder="Seller motivation, timeline constraints, family agreement, urgency..."
                  className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                />
              </div>

              {/* How contacted us */}
              <div className="p-3.5 bg-white flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>How contacted us</span>
                  </label>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Source</span>
                </div>
                <textarea
                  rows={3}
                  value={currentData.howContactedUs}
                  onChange={(e) => handleFieldChange('howContactedUs', e.target.value)}
                  placeholder="e.g. Newspaper advertisement, Signboard on site, Advocate referral, Direct Walk-in..."
                  className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
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
                      placeholder="Seller expected price vs minimum acceptable bottom-line, white bank ratio..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
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
                      placeholder="Property size in Grounds, Sq. Ft, road frontage, boundary dimensions..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                    />
                  </div>
                </div>

                {/* 2x2 Row 2: any special needs | Add on features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-slate-300">
                  {/* any special needs */}
                  <div className="p-3.5 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>any special needs</span>
                      </label>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Conditions</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentData.anySpecialNeeds}
                      onChange={(e) => handleFieldChange('anySpecialNeeds', e.target.value)}
                      placeholder="Immediate token requirements, family legal clearances, settlement duration, tax counsel..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
                    />
                  </div>

                  {/* Add on features */}
                  <div className="p-3.5 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Add on features</span>
                      </label>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Assets</span>
                    </div>
                    <textarea
                      rows={4}
                      value={currentData.addOnFeatures}
                      onChange={(e) => handleFieldChange('addOnFeatures', e.target.value)}
                      placeholder="Clear single patta, boundary wall, corner location, DTCP/CMDA layout status..."
                      className="w-full flex-1 p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
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
                    placeholder="Preferred hours to speak with landowner (e.g. Morning 10 AM – 12 PM, After 7 PM, avoid calling during office hours)..."
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden resize-none bg-slate-50/40 hover:bg-white focus:bg-white transition leading-relaxed"
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
                  placeholder="Strategy script when negotiating with landowner: 'Sir, we have three verified pre-approved NRI buyers actively seeking ready plots in this locality. If you agree on the realistic market bottom-line of ₹2.40 Cr, we can schedule an immediate token meeting this Thursday with our Managing Director...'"
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
