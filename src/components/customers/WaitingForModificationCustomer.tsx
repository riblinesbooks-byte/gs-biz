import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerLead } from '../../types';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Search,
  Send,
  Users,
  Phone,
  X,
  Edit3,
  Calendar,
  ShieldAlert,
  MessageSquare,
} from 'lucide-react';

export const WaitingForModificationCustomer: React.FC = () => {
  const {
    customerLeads,
    resubmitCustomerForApproval,
    setCurrentPage,
    currentUser,
  } = useApp();

  const [search, setSearch] = useState('');
  const [editingCust, setEditingCust] = useState<CustomerLead | null>(null);
  const [formData, setFormData] = useState<Partial<CustomerLead>>({});

  // Customers waiting for modification
  const modificationCusts = customerLeads.filter((c) => c.waitingForModification);

  const filteredCusts = modificationCusts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.contactNo.includes(q) ||
      (c.propertyAddress && c.propertyAddress.toLowerCase().includes(q)) ||
      (c.propertyArea && c.propertyArea.toLowerCase().includes(q)) ||
      (c.propertyType && c.propertyType.toLowerCase().includes(q)) ||
      (c.modificationReason && c.modificationReason.toLowerCase().includes(q))
    );
  });

  const handleOpenEdit = (cust: CustomerLead) => {
    setEditingCust(cust);
    setFormData({
      name: cust.name,
      contactNo: cust.contactNo,
      propertyType: cust.propertyType || 'Plot',
      propertyArea: cust.propertyArea || '',
      propertyAddress: cust.propertyAddress || '',
      expectedPrice: cust.expectedPrice || '',
      customerType: cust.customerType || 'Seller',
      areaOfLand: cust.areaOfLand || '',
      areaOfBuilding: cust.areaOfBuilding || '',
      ownershipType: cust.ownershipType || 'Freehold',
      foodPreference: cust.foodPreference || 'Any',
      religion: cust.religion || 'Any',
      notes: cust.notes || '',
    });
  };

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCust) return;

    resubmitCustomerForApproval(editingCust.id, formData);
    setEditingCust(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Waiting for Modification (Customer Details)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 font-bold border border-rose-200 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              {modificationCusts.length} Customers To Modify
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customer leads returned by Administration for contact verification, budget adjustment, or missing property specifics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('customer_add')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            + Add Customer Leads
          </button>
          <button
            onClick={() => setCurrentPage('customer_waiting_approval')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            Waiting for Approval
          </button>
        </div>
      </div>

      {/* Staff Guide Callout */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-amber-950 block text-sm">Customer Requirement Revisions</span>
            <span>
              Review Admin feedback regarding client offer, expectations, or property address. Modify details and click <strong>Send Again for Approval</strong>.
            </span>
          </div>
        </div>
        <span className="bg-white/80 px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-800 border border-amber-200 shrink-0">
          User: {currentUser.fullName} ({currentUser.role.toUpperCase()})
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, mobile, address, expected price or modification reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Table */}
      {filteredCusts.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Customers Waiting for Modification</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {search ? 'No records match your search filter.' : 'All customer leads are currently approved, locked, or undergoing standard review.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage('customer_list')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
            >
              View List of Customer
            </button>
            <button
              onClick={() => setCurrentPage('m_reports_customers')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Open Admin M Reports (Customer)
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Date & Requested By</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Property & Area</th>
                  <th className="py-3 px-4">Property Address</th>
                  <th className="py-3 px-4">Admin Modification Instruction</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCusts.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(cust)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit & Resubmit
                      </button>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-900 font-medium">{cust.date}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Req: {cust.modificationRequestedAt || 'Recent'}
                      </div>
                      <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
                        By {cust.modificationRequestedBy || 'Admin'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">{cust.name}</div>
                      <div className="text-slate-600 font-mono text-xs flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {cust.contactNo}
                      </div>
                      <span className="inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 mt-1">
                        {cust.customerType || 'Customer'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">{cust.propertyType || 'Plot'}</span>
                        {cust.propertyArea && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                            {cust.propertyArea}
                          </span>
                        )}
                      </div>
                      {cust.expectedPrice && (
                        <div className="text-[11px] text-emerald-700 font-bold mt-1">
                          Price: {cust.expectedPrice}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-700 text-xs line-clamp-2">
                        {cust.propertyAddress || 'No address specified'}
                      </div>
                      {cust.areaOfLand && (
                        <div className="text-[11px] text-slate-500 mt-0.5">Land: {cust.areaOfLand}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="bg-rose-50/80 border border-rose-200 text-rose-900 rounded-lg p-2.5 text-xs">
                        <div className="font-bold flex items-center gap-1 text-[11px] text-rose-800 uppercase tracking-wider mb-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          Admin Correction Note
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {cust.modificationReason || 'Please verify customer requirements.'}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                        <AlertCircle className="w-3 h-3" />
                        Needs Edit
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-rose-600" />
                  Edit & Resubmit Customer Details
                </h3>
                <p className="text-xs text-slate-500">
                  Update the requested fields and send back for Admin verification
                </p>
              </div>
              <button
                onClick={() => setEditingCust(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-950">
                <span className="font-bold block text-rose-800 uppercase tracking-wider text-[11px] mb-1">
                  Correction Requested by {editingCust.modificationRequestedBy || 'Admin'} on {editingCust.modificationRequestedAt || 'Recent'}
                </span>
                <p className="text-slate-800 bg-white/80 p-2 rounded border border-rose-100 font-medium">
                  &quot;{editingCust.modificationReason || 'Please verify details and update properly.'}&quot;
                </p>
              </div>

              <form id="resubmit-cust-form" onSubmit={handleResubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Mobile *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactNo || ''}
                      onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
                    <select
                      value={formData.propertyType || 'Plot'}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Plot">Plot</option>
                      <option value="Flat">Flat</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Joint Venture">Joint Venture</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Property Area</label>
                    <input
                      type="text"
                      placeholder="e.g. 2400 sq ft / 1.5 Ground"
                      value={formData.propertyArea || ''}
                      onChange={(e) => setFormData({ ...formData, propertyArea: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expected Price / Budget</label>
                    <input
                      type="text"
                      placeholder="e.g. 1.75 Cr"
                      value={formData.expectedPrice || ''}
                      onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Address</label>
                  <textarea
                    rows={2}
                    value={formData.propertyAddress || ''}
                    onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="Enter complete door no, street, locality..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Area of Land</label>
                    <input
                      type="text"
                      placeholder="e.g. 2400 sq ft"
                      value={formData.areaOfLand || ''}
                      onChange={(e) => setFormData({ ...formData, areaOfLand: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Area of Building</label>
                    <input
                      type="text"
                      placeholder="e.g. 1800 sq ft commercial"
                      value={formData.areaOfBuilding || ''}
                      onChange={(e) => setFormData({ ...formData, areaOfBuilding: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ownership Type</label>
                    <select
                      value={formData.ownershipType || 'Freehold'}
                      onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Freehold">Freehold</option>
                      <option value="Patta">Patta</option>
                      <option value="Commercial Freehold">Commercial Freehold</option>
                      <option value="Power of Attorney">Power of Attorney</option>
                      <option value="Joint Venture">Joint Venture</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Food Preference</label>
                    <select
                      value={formData.foodPreference || 'Any'}
                      onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Any">Any</option>
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Religion</label>
                    <select
                      value={formData.religion || 'Any'}
                      onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Any">Any</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Christian">Christian</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Notes & Adjustments</label>
                  <textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="Enter notes about corrections made for admin review..."
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditingCust(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="resubmit-cust-form"
                className="px-5 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                Send Again for Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
