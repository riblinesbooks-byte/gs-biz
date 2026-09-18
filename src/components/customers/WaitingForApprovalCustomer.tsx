import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerLead } from '../../types';
import {
  Clock,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle,
  Eye,
  Lock,
  X,
  UserCheck,
  Building,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';

export const WaitingForApprovalCustomer: React.FC = () => {
  const {
    customerLeads,
    approveAndLockCustomer,
    currentRole,
    setRole,
    setCurrentPage,
    addToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<CustomerLead | null>(null);

  // Filter customers waiting for approval or potential customers awaiting admin sign-off
  const waitingCustomers = customerLeads.filter(
    (c) => (c.waitingForApproval || (c.isPotential && !c.isApproved)) && !c.isLocked
  );

  const filtered = waitingCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactNo.includes(search) ||
      (c.propertyAddress && c.propertyAddress.toLowerCase().includes(search.toLowerCase())) ||
      (c.propertyType && c.propertyType.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApprove = (cust: CustomerLead) => {
    if (currentRole !== 'admin') {
      addToast('Permission Denied: Only Admin can approve. Staff cannot approve.', 'error');
      return;
    }
    approveAndLockCustomer(cust.id);
    setSelectedCust(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Waiting for approval Customer
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
              {waitingCustomers.length} Awaiting Approval
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customer submissions pending Admin verification. Strict role-based validation enforced.
          </p>
        </div>

        {/* Quick Role Switcher for instant testing of Admin vs Staff rule */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-600 px-2">Role:</span>
          <button
            id="btn-role-admin"
            onClick={() => setRole('admin')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              currentRole === 'admin'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
          <button
            id="btn-role-staff"
            onClick={() => setRole('staff')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              currentRole === 'staff'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Staff</span>
          </button>
        </div>
      </div>

      {/* Role Enforcement Alert Banner */}
      {currentRole === 'admin' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="font-bold">Admin Authority Active:</strong> You have authorization to review and approve customer leads. Once approved, the customer is permanently locked and added to the approval list.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="font-bold">Staff Read-Only Restriction:</strong> Only Admin can approve. Staff cannot approve. You may view details, but approval controls are strictly locked.
            </div>
          </div>
          <button
            onClick={() => setRole('admin')}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md text-[11px] shrink-0"
          >
            Switch to Admin
          </button>
        </div>
      )}

      {/* Table Card: List of Customer waiting for approval (Page 2) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              List of Customer waiting for approval
            </h2>
            <span className="text-xs text-slate-500 font-normal">
              (Document Page 2 Format)
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, phone, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden w-60 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3 w-48 text-center bg-slate-200/50">Actions</th>
                <th className="py-3 px-4">Date of Entry</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Mobile No</th>
                <th className="py-3 px-4">Property Type</th>
                <th className="py-3 px-4">Property Area</th>
                <th className="py-3 px-4">Property Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <UserCheck className="w-6 h-6 text-slate-400" />
                      <p className="font-semibold text-slate-700">No customers waiting for approval</p>
                      <p className="text-[11px] text-slate-500">
                        Go to &ldquo;Move to Potential Customer&rdquo; and click &ldquo;Send for approval&rdquo;.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                    {/* View and approve button as drawn in Page 2 */}
                    <td className="py-2.5 px-3 whitespace-nowrap bg-slate-50/50 border-r border-slate-100">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          id={`btn-view-approve-${cust.id}`}
                          onClick={() => setSelectedCust(cust)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-[11px] rounded-md border border-slate-300 shadow-2xs transition flex items-center gap-1"
                          title="View and approve button"
                        >
                          <Eye className="w-3 h-3 text-purple-600" />
                          <span>View & Details</span>
                        </button>

                        {currentRole === 'admin' ? (
                          <button
                            id={`btn-approve-direct-${cust.id}`}
                            onClick={() => handleApprove(cust)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-md shadow-2xs transition flex items-center gap-1"
                            title="Admin Approve Customer"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        ) : (
                          <button
                            disabled
                            onClick={() =>
                              addToast('Permission Denied: Only Admin can approve. Staff cannot approve.', 'error')
                            }
                            className="px-2.5 py-1 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed font-semibold text-[11px] rounded-md flex items-center gap-1"
                            title="Admin Only: Staff cannot approve"
                          >
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Locked</span>
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {cust.date}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {cust.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 font-mono whitespace-nowrap">
                      {cust.contactNo}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {cust.propertyType || 'Plot'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                      {cust.propertyArea || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate" title={cust.propertyAddress}>
                      {cust.propertyAddress || cust.locality || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW & APPROVE MODAL (Full inspection of core + optional fields) */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span>Customer Approval Specification</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Review complete property and owner specifications before Admin approval
                </p>
              </div>
              <button
                onClick={() => setSelectedCust(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs">
              {/* Core Information */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-2.5">
                <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
                  Core Property Details (To be locked upon approval)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Customer Name:</span>
                    <strong className="text-slate-900 font-bold text-sm">{selectedCust.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Mobile Number:</span>
                    <strong className="text-slate-900 font-mono text-xs">{selectedCust.contactNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Date of Entry:</span>
                    <strong className="text-slate-800">{selectedCust.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Type:</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                      {selectedCust.propertyType || 'Plot'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Area:</span>
                    <strong className="text-slate-800">{selectedCust.propertyArea || 'Standard'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Address:</span>
                    <strong className="text-slate-800">{selectedCust.propertyAddress || selectedCust.locality || '—'}</strong>
                  </div>
                </div>
              </div>

              {/* Additional Details (from Dialog box) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Additional Specifications
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Area of Land:</span>
                    <strong className="text-slate-800">{selectedCust.areaOfLand || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Area of Building:</span>
                    <strong className="text-slate-800">{selectedCust.areaOfBuilding || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Ownership type:</span>
                    <strong className="text-slate-800">{selectedCust.ownershipType || 'Freehold'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Food Preference:</span>
                    <strong className="text-slate-800">{selectedCust.foodPreference || 'Veg'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Religion:</span>
                    <strong className="text-slate-800">{selectedCust.religion || '—'}</strong>
                  </div>
                </div>
              </div>

              {/* Strict Admin Permission Guard Notice */}
              <div className="p-3 rounded-lg border text-[11px] flex items-center gap-2">
                {currentRole === 'admin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-900">
                      <strong>Admin Verified:</strong> Approving will lock the 6 core attributes (Name, Mobile No, Date, Type, Area, Address) and move customer to List of Customer.
                    </span>
                  </>
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
                  onClick={() => setSelectedCust(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>

                {currentRole === 'admin' ? (
                  <button
                    id="btn-modal-approve-customer"
                    type="button"
                    onClick={() => handleApprove(selectedCust)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve and Lock Customer</span>
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
