import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerLead } from '../../types';
import {
  Send,
  Edit2,
  Calendar,
  Search,
  CheckCircle,
  X,
  Clock,
  ArrowRight,
  Sparkles,
  Building,
} from 'lucide-react';

export const MoveToPotentialBuyer: React.FC = () => {
  const {
    buyerLeads,
    sendBuyerForApproval,
    updateBuyerLead,
    setCurrentPage,
  } = useApp();

  // Filters: From Date and To Date as requested in Document Page 1
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Dialog states
  const [approvalModalLead, setApprovalModalLead] = useState<BuyerLead | null>(null);
  const [editModalLead, setEditModalLead] = useState<BuyerLead | null>(null);

  // Form states for "Send for approval" dialog (Page 2 of document):
  // Name, Mobile No, Property Type, Property Area, Property Address
  // Additional (not compulsory): Area of Land, Area of Building, Ownership type, Food veg or non veg, Religion if applicable
  const [approvalForm, setApprovalForm] = useState({
    name: '',
    mobileNo: '',
    propertyType: 'Plot',
    propertyArea: '',
    propertyAddress: '',
    areaOfLand: '',
    areaOfBuilding: '',
    ownershipType: 'Freehold Patta',
    foodPreference: 'Veg',
    religion: 'Hindu',
  });

  // Open "Send for Approval" dialog
  const handleOpenApprovalDialog = (lead: BuyerLead) => {
    setApprovalModalLead(lead);
    setApprovalForm({
      name: lead.name || '',
      mobileNo: lead.contactNo || '',
      propertyType: lead.propertyType || 'Plot',
      propertyArea: lead.propertyArea || '',
      propertyAddress: lead.propertyAddress || lead.preferredLocality || '',
      areaOfLand: lead.areaOfLand || '',
      areaOfBuilding: lead.areaOfBuilding || '',
      ownershipType: lead.ownershipType || 'Freehold Patta',
      foodPreference: lead.foodPreference || 'Veg',
      religion: lead.religion || 'Hindu',
    });
  };

  // Submit "Save and send for approval"
  const handleSaveAndSendForApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalModalLead) return;

    sendBuyerForApproval(approvalModalLead.id, {
      name: approvalForm.name.trim(),
      contactNo: approvalForm.mobileNo.trim(),
      propertyType: approvalForm.propertyType,
      propertyArea: approvalForm.propertyArea.trim(),
      propertyAddress: approvalForm.propertyAddress.trim(),
      areaOfLand: approvalForm.areaOfLand.trim() || undefined,
      areaOfBuilding: approvalForm.areaOfBuilding.trim() || undefined,
      ownershipType: approvalForm.ownershipType || undefined,
      foodPreference: approvalForm.foodPreference || undefined,
      religion: approvalForm.religion || undefined,
    });

    setApprovalModalLead(null);
  };

  // Handle Edit Save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalLead) return;
    updateBuyerLead(editModalLead.id, editModalLead);
    setEditModalLead(null);
  };

  // Filter candidates: unapproved leads (not locked)
  const candidateLeads = buyerLeads.filter((b) => !b.isLocked && !b.waitingForApproval);

  const filteredLeads = candidateLeads.filter((b) => {
    // Date filter
    if (fromDate && b.date < fromDate) return false;
    if (toDate && b.date > toDate) return false;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        b.name.toLowerCase().includes(q) ||
        b.contactNo.includes(q) ||
        (b.propertyAddress && b.propertyAddress.toLowerCase().includes(q)) ||
        (b.propertyArea && b.propertyArea.toLowerCase().includes(q)) ||
        b.propertyType.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Move to Potential Seller</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-semibold border border-purple-200">
              {candidateLeads.length} Eligible
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming leads in the &quot;List of New Customer&quot; table. Add non-compulsory property details and send to Admin for approval.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('buyer_waiting_approval')}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Clock className="w-4 h-4" />
          <span>View Waiting for Approval</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Card matching Page 1 Document */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Card Header with Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" />
              List of New Customer
            </h2>
            <p className="text-[11px] text-slate-500">Filter by entry date range and submit for Admin approval</p>
          </div>

          {/* Date and Search Filters as per Page 1 diagram */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* From Date */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <label className="text-slate-600 font-medium whitespace-nowrap">From Date:</label>
              <input
                type="date"
                id="filter-from-date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-xs text-slate-800 outline-hidden bg-transparent"
              />
            </div>

            {/* To Date */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <label className="text-slate-600 font-medium whitespace-nowrap">To Date:</label>
              <input
                type="date"
                id="filter-to-date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-xs text-slate-800 outline-hidden bg-transparent"
              />
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs w-40 sm:w-48"
              />
            </div>

            {(fromDate || toDate || search) && (
              <button
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                  setSearch('');
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table matching Page 1 format */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px] tracking-wider">
                <th className="px-4 py-3 text-center w-48">Actions</th>
                <th className="px-4 py-3">Date of Entry</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Mobile No</th>
                <th className="px-4 py-3">Property Type</th>
                <th className="px-4 py-3">Property Area</th>
                <th className="px-4 py-3">Property Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No customers found matching the date range.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition">
                    {/* Action buttons: Edit Button & Send for approval button */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditModalLead(lead)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] border border-slate-300 transition flex items-center gap-1"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-3 h-3 text-slate-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleOpenApprovalDialog(lead)}
                          className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] shadow-xs transition flex items-center gap-1"
                          title="Send for Approval"
                        >
                          <Send className="w-3 h-3 text-amber-300" />
                          <span>Send for approval</span>
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{lead.date}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{lead.name}</td>
                    <td className="px-4 py-3 text-slate-700 font-mono">{lead.contactNo}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {lead.propertyType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{lead.propertyArea || 'NA'}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={lead.propertyAddress || lead.preferredLocality}>
                      {lead.propertyAddress || lead.preferredLocality}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page 2 Document Dialog: "Send for approval" */}
      {approvalModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-400" />
                  Send for Approval
                </h3>
                <p className="text-[11px] text-slate-300">
                  Add optional property specifications for Admin verification
                </p>
              </div>
              <button
                onClick={() => setApprovalModalLead(null)}
                className="p-1 rounded text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAndSendForApproval} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Primary Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={approvalForm.name}
                    onChange={(e) => setApprovalForm({ ...approvalForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile No</label>
                  <input
                    type="text"
                    required
                    value={approvalForm.mobileNo}
                    onChange={(e) => setApprovalForm({ ...approvalForm, mobileNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={approvalForm.propertyType}
                    onChange={(e) => setApprovalForm({ ...approvalForm, propertyType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Plot">Plot</option>
                    <option value="Flat">Flat</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Joint Venture">Joint Venture</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Area</label>
                  <input
                    type="text"
                    required
                    value={approvalForm.propertyArea}
                    onChange={(e) => setApprovalForm({ ...approvalForm, propertyArea: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Address</label>
                <textarea
                  rows={2}
                  required
                  value={approvalForm.propertyAddress}
                  onChange={(e) => setApprovalForm({ ...approvalForm, propertyAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              {/* Additional Details (Not Compulsory - explicitly specified on Page 1 & 2) */}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Additional Details
                  </span>
                  <span className="text-[10px] text-slate-500 italic">Not compulsory</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Area of Land</label>
                    <input
                      type="text"
                      placeholder="e.g. 1.5 Grounds / 3600 sq ft"
                      value={approvalForm.areaOfLand}
                      onChange={(e) => setApprovalForm({ ...approvalForm, areaOfLand: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Area of Building</label>
                    <input
                      type="text"
                      placeholder="e.g. 2400 sq ft Built-up G+1"
                      value={approvalForm.areaOfBuilding}
                      onChange={(e) => setApprovalForm({ ...approvalForm, areaOfBuilding: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Ownership type</label>
                    <input
                      type="text"
                      placeholder="e.g. Freehold Patta, CMDA, Power of Attorney"
                      value={approvalForm.ownershipType}
                      onChange={(e) => setApprovalForm({ ...approvalForm, ownershipType: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Food veg or non veg</label>
                    <select
                      value={approvalForm.foodPreference}
                      onChange={(e) => setApprovalForm({ ...approvalForm, foodPreference: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Veg">Pure Veg</option>
                      <option value="Non-Veg">Non-Veg Allowed</option>
                      <option value="Any">Any / No Restriction</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-600 mb-1">Religion if applicable</label>
                    <input
                      type="text"
                      placeholder="e.g. Hindu / Any"
                      value={approvalForm.religion}
                      onChange={(e) => setApprovalForm({ ...approvalForm, religion: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button: "Save and send for approval button" */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApprovalModalLead(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="btn-save-and-send-approval"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-2 shadow-xs transition"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Save and send for approval</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Dialog */}
      {editModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                Edit Customer Details
              </h3>
              <button
                onClick={() => setEditModalLead(null)}
                className="p-1 rounded text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editModalLead.name}
                  onChange={(e) => setEditModalLead({ ...editModalLead, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile No</label>
                <input
                  type="text"
                  required
                  value={editModalLead.contactNo}
                  onChange={(e) => setEditModalLead({ ...editModalLead, contactNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                <select
                  value={editModalLead.propertyType}
                  onChange={(e) => setEditModalLead({ ...editModalLead, propertyType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Plot">Plot</option>
                  <option value="Flat">Flat</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Joint Venture">Joint Venture</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Area</label>
                <input
                  type="text"
                  value={editModalLead.propertyArea || ''}
                  onChange={(e) => setEditModalLead({ ...editModalLead, propertyArea: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Address</label>
                <textarea
                  rows={2}
                  value={editModalLead.propertyAddress || editModalLead.preferredLocality || ''}
                  onChange={(e) =>
                    setEditModalLead({
                      ...editModalLead,
                      propertyAddress: e.target.value,
                      preferredLocality: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalLead(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Update Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
