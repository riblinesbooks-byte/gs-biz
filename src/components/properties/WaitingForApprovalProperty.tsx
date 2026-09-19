import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyItem } from '../../types';
import {
  Clock,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle,
  Eye,
  Lock,
  X,
  Home,
  Building,
  MapPin,
  Phone,
  Tag,
  ArrowRight,
} from 'lucide-react';

export const WaitingForApprovalProperty: React.FC = () => {
  const {
    properties,
    approveAndLockProperty,
    sendBackPropertyForModification,
    currentRole,
    setCurrentPage,
    addToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedProp, setSelectedProp] = useState<PropertyItem | null>(null);
  const [showModBox, setShowModBox] = useState(false);
  const [modReason, setModReason] = useState('');

  // Filter properties waiting for approval
  const waitingProperties = properties.filter(
    (p) => (p.waitingForApproval || (p.isPotential && !p.isApproved)) && !p.isLocked
  );

  const filtered = waitingProperties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerContact.includes(search) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.locality.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (prop: PropertyItem) => {
    if (currentRole !== 'admin') {
      addToast('Permission Denied: Only Admin can approve. Staff cannot approve.', 'error');
      return;
    }
    approveAndLockProperty(prop.id);
    setSelectedProp(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Waiting for approval Property
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
              {waitingProperties.length} Awaiting Approval
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Properties submitted for Admin sign-off. Strict governance: Only Admin can approve, staff cannot approve.
          </p>
        </div>
      </div>

      {/* Role Enforcement Alert Banner */}
      {currentRole === 'admin' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="font-bold">Admin Authority Active:</strong> You have full authorization to approve and lock property listings. Upon approval, core property details will be permanently locked against staff modification.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="font-bold">Staff Read-Only Restriction:</strong> Only Admin can approve, staff cannot approve. You may inspect property details, but approval controls are disabled.
            </div>
          </div>
        </div>
      )}

      {/* Table Card: List of Property waiting for approval */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              List of Property waiting for approval
            </h2>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search property, seller, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden w-64 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3 w-48 text-center bg-slate-200/50">Actions</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Property Title</th>
                <th className="py-3 px-4">Property Type</th>
                <th className="py-3 px-4">Seller Name</th>
                <th className="py-3 px-4">Property Area</th>
                <th className="py-3 px-4">Property Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Home className="w-6 h-6 text-slate-400" />
                      <p className="font-semibold text-slate-700">No properties waiting for approval</p>
                      <p className="text-[11px] text-slate-500">
                        Go to &ldquo;Move to Potential Property&rdquo; and click &ldquo;Send for approval&rdquo;.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/80 transition">
                    {/* View Details button */}
                    <td className="py-2.5 px-3 whitespace-nowrap bg-slate-50/50 border-r border-slate-100">
                      <div className="flex items-center justify-center">
                        <button
                          id={`btn-view-approve-prop-${prop.id}`}
                          onClick={() => setSelectedProp(prop)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-[11px] rounded-md border border-slate-300 shadow-2xs transition flex items-center gap-1"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3 text-purple-600" />
                          <span>View & Details</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-2.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {prop.date || '2026-08-15'}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div>{prop.title}</div>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">{prop.propertyCode}</span>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {prop.propertyType}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      <div>{prop.ownerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">{prop.ownerContact}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                      <div>{prop.groundArea || `${prop.sizeSqFt} sq ft`}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate" title={prop.address}>
                      {prop.address || `${prop.locality}, Chennai`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW & APPROVE MODAL */}
      {selectedProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Home className="w-4 h-4 text-purple-600" />
                  <span>Property Approval Specification</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Review specifications before Admin approval and locking
                </p>
              </div>
              <button
                onClick={() => setSelectedProp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Property Details */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-2.5">
                <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
                  Core Property Details (To be locked upon approval)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Title:</span>
                    <strong className="text-slate-900 font-bold text-sm">{selectedProp.title}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Code:</span>
                    <span className="font-mono text-xs text-slate-800">{selectedProp.propertyCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Type:</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                      {selectedProp.propertyType}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Price:</span>
                    <strong className="text-emerald-700 font-bold">{selectedProp.price}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Size & Dimensions:</span>
                    <strong className="text-slate-800">{selectedProp.sizeSqFt} sq ft • {selectedProp.groundArea || 'Standard'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Locality & Address:</span>
                    <strong className="text-slate-800">{selectedProp.address || selectedProp.locality}</strong>
                  </div>
                </div>
              </div>

              {/* Owner / Seller Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Owner / Seller Details
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Seller Name:</span>
                    <strong className="text-slate-900">{selectedProp.ownerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Seller Contact:</span>
                    <strong className="text-slate-900 font-mono">{selectedProp.ownerContact}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Listing Status:</span>
                    <span className="text-slate-800">{selectedProp.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Features:</span>
                    <span className="text-slate-800">{selectedProp.features?.join(', ') || 'Standard Features'}</span>
                  </div>
                </div>
              </div>

              {/* Admin Guard Notice */}
              <div className="p-3 rounded-lg border text-[11px] flex items-center gap-2">
                {currentRole === 'admin' ? (
                  <div className="w-full space-y-2">
                    {showModBox ? (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-2">
                        <label className="block text-[11px] font-bold text-rose-900">
                          Admin Reason for Property Modification:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Verify road width, clarify pricing or get encumbrance certificate..."
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
                              sendBackPropertyForModification(selectedProp.id, modReason);
                              setSelectedProp(null);
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
                        <span className="text-emerald-900">
                          <strong>Admin Verified:</strong> Approving will lock property attributes and transfer to List of Property.
                        </span>
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
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-rose-900 font-semibold">
                      Permission Denied: Only Admin can approve. Staff cannot approve.
                    </span>
                  </>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedProp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>

                {currentRole === 'admin' ? (
                  <button
                    id="btn-modal-approve-prop"
                    type="button"
                    onClick={() => handleApprove(selectedProp)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve and Lock Property</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 italic">
                      Staff cannot approve
                    </span>
                    <button
                      disabled
                      className="px-4 py-2 bg-slate-200 text-slate-400 cursor-not-allowed font-bold text-xs rounded-lg flex items-center gap-1.5"
                      title="Only Admin can approve"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Approve (Admin Only)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
