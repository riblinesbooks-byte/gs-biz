import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building,
  Search,
  ArrowRight,
  Trash2,
  Lock,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react';

export const AddSellerLeads: React.FC = () => {
  const {
    buyerLeads,
    addBuyerLead,
    deleteBuyerLead,
    moveToPotentialBuyer,
    currentRole,
    setCurrentPage,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Form state according to document Page 1:
  // Title: Add seller
  // Fields: Name, Mobile No, Property Type, Property Area, Property Address
  // Action: save as button
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [propertyType, setPropertyType] = useState('Plot');
  const [propertyArea, setPropertyArea] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobileNo.trim()) return;
    setIsSubmitting(true);

    const today = new Date().toISOString().split('T')[0];

    addBuyerLead({
      date: today,
      name: name.trim(),
      contactNo: mobileNo.trim(),
      propertyType,
      propertyArea: propertyArea.trim() || '2400 sq ft',
      propertyAddress: propertyAddress.trim() || 'Nanganallur, Chennai',
      enquiryMode: 'Direct Entry',
      enquiryFor: 'Purchase',
      budget: 'Standard',
      preferredLocality: propertyAddress.trim() || 'Nanganallur',
      requirement: `Seller lead for ${propertyType} (${propertyArea || 'Standard'}) at ${propertyAddress || 'Chennai'}`,
      firstCallHandledBy: currentRole === 'admin' ? 'Admin' : 'Staff',
      recentUpdate: 'New seller lead entered into system.',
      comments: 'Captured via Add Seller form.',
      isPotential: false,
      potentialApproved: false,
      waitingForApproval: false,
      isLocked: false,
      crmStage: 'New Lead',
      tags: ['Seller Lead', propertyType],
    });

    // Reset form
    setName('');
    setMobileNo('');
    setPropertyType('Plot');
    setPropertyArea('');
    setPropertyAddress('');
    setIsSubmitting(false);
  };

  const filteredLeads = buyerLeads.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.contactNo.includes(search) ||
      (b.propertyAddress && b.propertyAddress.toLowerCase().includes(search.toLowerCase())) ||
      (b.propertyArea && b.propertyArea.toLowerCase().includes(search.toLowerCase()));

    const matchType = filterType === 'All' || b.propertyType === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add Seller Leads</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200">
              {buyerLeads.length} Total Leads
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Capture new seller inquiries and property specifications, then advance them to the Potential Seller pipeline.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('buyer_move_potential')}
          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Move to Potential Seller</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Form matching document Page 1: Add seller */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden max-w-2xl">
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2 tracking-wide">
            <Building className="w-4 h-4 text-amber-400" />
            Add seller
          </h2>
          <span className="text-[11px] text-slate-300 font-mono">Step 1: Lead Information</span>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-4">
            {/* Name */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="add-seller-name"
                placeholder="Enter seller name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden bg-slate-50/50 text-slate-900 text-xs"
              />
            </div>

            {/* Mobile No */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile No <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="add-seller-mobile"
                placeholder="e.g. 98848 27469"
                required
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden bg-slate-50/50 text-slate-900 font-mono text-xs"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Property Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="add-seller-property-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden bg-white text-slate-900 text-xs"
              >
                <option value="Plot">Plot</option>
                <option value="Flat">Flat</option>
                <option value="Independent House">Independent House</option>
                <option value="Commercial">Commercial</option>
                <option value="Joint Venture">Joint Venture</option>
              </select>
            </div>

            {/* Property Area */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Property Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="add-seller-property-area"
                placeholder="e.g. 2400 sq ft, 1.5 Ground, 1200 sq ft"
                required
                value={propertyArea}
                onChange={(e) => setPropertyArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden bg-slate-50/50 text-slate-900 text-xs"
              />
            </div>

            {/* Property Address */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Property Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                id="add-seller-property-address"
                placeholder="Enter complete address, street, landmark, locality"
                required
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-hidden bg-slate-50/50 text-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              id="btn-save-as-seller"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Save as</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recorded Seller Leads List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recorded Seller Leads</h3>
            <p className="text-[11px] text-slate-500">All registered incoming seller leads</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="All">All Property Types</option>
              <option value="Plot">Plot</option>
              <option value="Flat">Flat</option>
              <option value="Independent House">Independent House</option>
              <option value="Commercial">Commercial</option>
              <option value="Joint Venture">Joint Venture</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px] tracking-wider">
                <th className="px-4 py-3">Date of Entry</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Mobile No</th>
                <th className="px-4 py-3">Property Type</th>
                <th className="px-4 py-3">Property Area</th>
                <th className="px-4 py-3">Property Address</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No seller leads found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{b.date}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{b.name}</td>
                    <td className="px-4 py-3 text-slate-700 font-mono">{b.contactNo}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {b.propertyType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{b.propertyArea || 'NA'}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={b.propertyAddress || b.preferredLocality}>
                      {b.propertyAddress || b.preferredLocality}
                    </td>
                    <td className="px-4 py-3">
                      {b.isLocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Lock className="w-2.5 h-2.5" /> Approved & Locked
                        </span>
                      ) : b.waitingForApproval ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-2.5 h-2.5" /> Waiting Approval
                        </span>
                      ) : b.isPotential ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                          Potential Seller
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          New Lead
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!b.isPotential && !b.waitingForApproval && !b.isLocked && (
                          <button
                            onClick={() => {
                              moveToPotentialBuyer(b.id);
                              setCurrentPage('buyer_move_potential');
                            }}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold rounded text-[11px] border border-purple-200 transition"
                          >
                            Move to Potential
                          </button>
                        )}
                        {currentRole === 'admin' && !b.isLocked && (
                          <button
                            onClick={() => deleteBuyerLead(b.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
