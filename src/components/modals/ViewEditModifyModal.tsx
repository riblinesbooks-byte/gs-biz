import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Eye,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Building,
  User,
  Phone,
  Calendar,
  MapPin,
  Save,
  Send,
  Layers,
  FileText,
} from 'lucide-react';
import { BuyerLead, PropertyItem, CustomerLead } from '../../types';

interface ViewEditModifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'seller' | 'property' | 'customer';
  record: BuyerLead | PropertyItem | CustomerLead | null;
  onSaveEdit: (updates: any) => void;
  onSendModification: (reason: string) => void;
}

export const ViewEditModifyModal: React.FC<ViewEditModifyModalProps> = ({
  isOpen,
  onClose,
  entityType,
  record,
  onSaveEdit,
  onSendModification,
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'modify'>('view');
  const [formData, setFormData] = useState<any>({});
  const [modReason, setModReason] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({ ...record });
      setModReason(record.modificationReason || '');
      setActiveTab('view');
      setSavedSuccess(false);
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const entityTitle =
    entityType === 'seller' ? 'Seller' : entityType === 'property' ? 'Property' : 'Customer';

  const recordName =
    entityType === 'property'
      ? (record as PropertyItem).title
      : (record as BuyerLead | CustomerLead).name;

  const recordContact =
    entityType === 'property'
      ? (record as PropertyItem).ownerContact
      : (record as BuyerLead | CustomerLead).contactNo;

  const recordAddress =
    entityType === 'property'
      ? (record as PropertyItem).address
      : (record as BuyerLead | CustomerLead).propertyAddress || (record as BuyerLead).preferredLocality || '';

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEdit(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleSendMod = () => {
    if (!modReason.trim()) return;
    onSendModification(modReason.trim());
    onClose();
  };

  const presetReasons = [
    'Need updated title deed / patta document copy',
    'Incorrect property area/dimensions specified; please re-verify with seller',
    'Contact number unreachable or secondary contact required',
    'Property price or expected budget revised by client',
    'Boundary verification and road width confirmation needed',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  View, Edit & Modify {entityTitle}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Approved & Locked 🔒
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {recordName} • ID: {record.id} • Date: {record.date || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-5 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('view')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'view'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>1. View Details</span>
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>2. Edit Record</span>
          </button>
          <button
            onClick={() => setActiveTab('modify')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'modify'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>3. Send for Modification</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Record updated successfully!</span>
            </div>
          )}

          {/* TAB 1: VIEW */}
          {activeTab === 'view' && (
            <div className="space-y-4">
              {/* Core Locked Attributes Badge */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Core Protected Attributes (Approved by Admin)</div>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    Name, Mobile No, Date of Entry, Property Type, Property Area, and Address are
                    preserved in the approved master ledger.
                  </div>
                </div>
              </div>

              {/* 6 Core Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    1. Name / Title 🔒
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{recordName}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    2. Mobile / Contact 🔒
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{recordContact}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    3. Date of Entry 🔒
                  </span>
                  <span className="text-sm font-semibold text-slate-900 mt-0.5 block font-mono">
                    {record.date || 'N/A'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    4. Property Type 🔒
                  </span>
                  <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                    {(record as any).propertyType || 'N/A'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    5. Property Area / Size 🔒
                  </span>
                  <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                    {(record as any).propertyArea || (record as any).sizeSqFt ? `${(record as any).propertyArea || (record as any).sizeSqFt + ' sq ft'}` : 'Standard'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    6. Property Address 🔒
                  </span>
                  <span className="text-xs font-semibold text-slate-900 mt-0.5 block">
                    {recordAddress || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Additional Metadata */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Additional Verification Specs
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Ownership / Patta:</span>
                    <span className="font-semibold text-slate-800">
                      {(record as any).ownershipType || 'Freehold Patta'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Food Preference:</span>
                    <span className="font-semibold text-slate-800">
                      {(record as any).foodPreference || 'Any'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Religion:</span>
                    <span className="font-semibold text-slate-800">
                      {(record as any).religion || 'Any'}
                    </span>
                  </div>
                  {entityType === 'property' && (
                    <>
                      <div>
                        <span className="text-slate-400 block">Price:</span>
                        <span className="font-bold text-emerald-700">
                          {(record as PropertyItem).price || 'On Request'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Facing:</span>
                        <span className="font-semibold text-slate-800">
                          {(record as PropertyItem).facing || 'North / East'}
                        </span>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-slate-400 block">Approved By:</span>
                    <span className="font-semibold text-emerald-700">
                      {(record as any).lockedBy || 'Admin Management'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action Switcher buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Record</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('modify')}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Send for Modification</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Admin Editing Mode:</strong> You may modify and correct any fields. Saving will update the verified record in real time.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {entityType === 'property' ? 'Property Title' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || formData.title || ''}
                    onChange={(e) => {
                      if (entityType === 'property') {
                        handleInputChange('title', e.target.value);
                      } else {
                        handleInputChange('name', e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Mobile / Contact Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactNo || formData.ownerContact || ''}
                    onChange={(e) => {
                      if (entityType === 'property') {
                        handleInputChange('ownerContact', e.target.value);
                      } else {
                        handleInputChange('contactNo', e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Date of Entry *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Property Type *
                  </label>
                  <select
                    value={formData.propertyType || 'Plot'}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 bg-white"
                  >
                    <option value="Plot">Plot</option>
                    <option value="Flat">Flat</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Joint Venture">Joint Venture</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Property Area / Land Size
                  </label>
                  <input
                    type="text"
                    value={formData.propertyArea || formData.groundArea || ''}
                    onChange={(e) => {
                      handleInputChange('propertyArea', e.target.value);
                      handleInputChange('groundArea', e.target.value);
                    }}
                    placeholder="e.g. 2400 sq ft, 1.5 Ground"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {entityType === 'property' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g. ₹ 85,00,000"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Property Address & Locality *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.propertyAddress || formData.address || formData.preferredLocality || ''}
                    onChange={(e) => {
                      handleInputChange('propertyAddress', e.target.value);
                      handleInputChange('address', e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Ownership Type
                  </label>
                  <input
                    type="text"
                    value={formData.ownershipType || ''}
                    onChange={(e) => handleInputChange('ownershipType', e.target.value)}
                    placeholder="Freehold, Patta, etc."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Food Preference
                  </label>
                  <input
                    type="text"
                    value={formData.foodPreference || ''}
                    onChange={(e) => handleInputChange('foodPreference', e.target.value)}
                    placeholder="Veg / Non-Veg / Any"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SEND FOR MODIFICATION */}
          {activeTab === 'modify' && (
            <div className="space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Send Back for Staff Modification:</strong>
                  <p className="mt-0.5 text-[11px] text-rose-800">
                    This will flag this record as <em>Waiting for Modification</em>. It will appear on the
                    staff&apos;s <strong>Waiting for Modification</strong> dashboard under the{' '}
                    <strong>{entityTitle} Details Menu</strong>, allowing staff to make requested
                    corrections and re-submit.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Reason for Modification *
                </label>
                <textarea
                  rows={4}
                  required
                  value={modReason}
                  onChange={(e) => setModReason(e.target.value)}
                  placeholder="Specify clear instructions on what needs to be changed, verified, or updated by the staff member..."
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Quick Suggestion Presets:
                </span>
                <div className="space-y-1.5">
                  {presetReasons.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setModReason(preset)}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-200 text-[11px] text-slate-700 hover:text-rose-900 transition flex items-center justify-between"
                    >
                      <span>• {preset}</span>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0 ml-2">Use</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!modReason.trim()}
                  onClick={handleSendMod}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Waiting for Modification</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
