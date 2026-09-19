import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerLead } from '../../types';
import {
  Clock,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Search,
  Eye,
  Lock,
  ArrowRight,
  Building,
  UserCheck,
  X,
  Sparkles,
} from 'lucide-react';

export const WaitingForApproval: React.FC = () => {
  const {
    buyerLeads,
    approveAndLockBuyer,
    sendBackBuyerForModification,
    currentRole,
    setCurrentPage,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<BuyerLead | null>(null);
  const [showModBox, setShowModBox] = useState(false);
  const [modReason, setModReason] = useState('');

  // Leads waiting for approval
  const waitingLeads = buyerLeads.filter((b) => b.waitingForApproval && !b.isLocked);

  const filteredLeads = waitingLeads.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.contactNo.includes(q) ||
      (b.propertyAddress && b.propertyAddress.toLowerCase().includes(q)) ||
      (b.propertyArea && b.propertyArea.toLowerCase().includes(q)) ||
      b.propertyType.toLowerCase().includes(q)
    );
  });

  const handleApprove = (leadId: string) => {
    approveAndLockBuyer(leadId);
    setSelectedLead(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Waiting for approval</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {waitingLeads.length} Pending Approval
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Seller leads submitted for verification. <strong className="text-slate-800">Only Admin can approve; staff cannot approve.</strong>
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setCurrentPage('buyer_list')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1"
          >
            <span>Go to List of Seller</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Permission Banner */}
      {currentRole === 'admin' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Admin Authority Active:</span> You are authorized to review and approve seller leads. Approving locks the seller&apos;s core details (Name, Mobile No, Date, Property Type, Property Area, Property Address) and unlocks them for Property Canvas and CRM.
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Staff Access Notice:</span> You are viewing in Staff mode. Staff can view submitted seller leads, but <span className="underline font-semibold">cannot approve</span> them (Admin authorization required).
          </div>
        </div>
      )}

      {/* Table Card matching Page 2: List of Seller waiting for approval */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-600" />
              List of Seller waiting for approval
            </h2>
            <p className="text-[11px] text-slate-500">Awaiting Admin sign-off and record locking</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, phone, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px] tracking-wider">
                <th className="px-4 py-3 text-center w-52">Actions</th>
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
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No sellers currently waiting for approval.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition">
                    {/* Action Column: View Details button */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] border border-slate-300 transition flex items-center gap-1"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>View Details</span>
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

      {/* View & Approve Modal Dialog */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">Seller Verification Details</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              {/* Security Banner inside modal */}
              {currentRole !== 'admin' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Staff Restriction:</strong> Only Admin login has permission to approve this seller lead.
                  </span>
                </div>
              )}

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Core Details (Will be Locked on Approval)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500">Name:</span>
                    <div className="font-bold text-slate-900 text-sm">{selectedLead.name}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Mobile No:</span>
                    <div className="font-bold text-slate-900 font-mono">{selectedLead.contactNo}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Date of Entry:</span>
                    <div className="font-medium text-slate-800 font-mono">{selectedLead.date}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Property Type:</span>
                    <div className="font-semibold text-blue-700">{selectedLead.propertyType}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Property Area:</span>
                    <div className="font-semibold text-slate-800">{selectedLead.propertyArea || 'Standard'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Property Address:</span>
                    <div className="font-medium text-slate-800">{selectedLead.propertyAddress || selectedLead.preferredLocality}</div>
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="border border-slate-200 rounded-lg p-3.5 space-y-2">
                <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Additional Specifications (Not Compulsory)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500">Area of Land:</span>
                    <div className="font-medium text-slate-800">{selectedLead.areaOfLand || 'Not Specified'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Area of Building:</span>
                    <div className="font-medium text-slate-800">{selectedLead.areaOfBuilding || 'Not Specified'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Ownership Type:</span>
                    <div className="font-medium text-slate-800">{selectedLead.ownershipType || 'Freehold Patta'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Food Preference:</span>
                    <div className="font-medium text-slate-800">{selectedLead.foodPreference || 'Veg'}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Religion if applicable:</span>
                    <div className="font-medium text-slate-800">{selectedLead.religion || 'Any'}</div>
                  </div>
                </div>
              </div>

              {currentRole === 'admin' && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {showModBox ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-2">
                      <label className="block text-[11px] font-bold text-rose-900">
                        Admin Note / Reason for Requesting Modification:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Survey number missing, please verify road width or get patta copy..."
                        value={modReason}
                        onChange={(e) => setModReason(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-rose-300 rounded focus:ring-2 focus:ring-rose-500/20"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowModBox(false)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            sendBackBuyerForModification(selectedLead.id, modReason);
                            setSelectedLead(null);
                            setShowModBox(false);
                            setModReason('');
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded shadow-xs"
                        >
                          Confirm & Return to Staff
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-500 italic">
                        * By approving, core details are locked and moved to List of Seller.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowModBox(true)}
                        className="text-xs font-semibold text-rose-700 hover:text-rose-800 underline decoration-rose-300"
                      >
                        Needs changes? Send back for modification
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="border-t border-slate-200 p-4 bg-slate-50/50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedLead(null);
                  setShowModBox(false);
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100"
              >
                Close
              </button>

              {currentRole === 'admin' ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModBox(true)}
                    className="px-3.5 py-2 rounded-lg border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs transition"
                  >
                    Return for Modification
                  </button>
                  <button
                    type="button"
                    id="btn-admin-approve-modal"
                    onClick={() => handleApprove(selectedLead.id)}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-xs transition"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span>Approve & Lock Seller</span>
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-400 font-semibold cursor-not-allowed flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Approval Disabled (Staff Login)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
