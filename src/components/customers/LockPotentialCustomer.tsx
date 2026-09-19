import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerLead } from '../../types';
import {
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle,
  Trash2,
  Edit2,
  Phone,
  Building,
  Sparkles,
} from 'lucide-react';

export const LockPotentialCustomer: React.FC = () => {
  const {
    customerLeads,
    approveAndLockCustomer,
    unlockCustomer,
    deleteCustomerLead,
    updateCustomerLead,
    currentRole,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [editingCustomer, setEditingCustomer] = useState<CustomerLead | null>(null);

  const potentialCusts = customerLeads.filter((c) => c.isPotential);

  const filtered = potentialCusts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactNo.includes(search) ||
      (c.locality && c.locality.toLowerCase().includes(search.toLowerCase())) ||
      (c.propertyOffered && c.propertyOffered.toLowerCase().includes(search.toLowerCase()));

    if (filterState === 'locked') return matchSearch && c.isLocked;
    if (filterState === 'unlocked') return matchSearch && !c.isLocked;
    return matchSearch;
  });

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    updateCustomerLead(editingCustomer.id, editingCustomer);
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Approve / Lock Potential Customer
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-600" />
              Admin Vault
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Approves and locks customer and seller records by Admin so that{' '}
            <strong className="text-slate-900">staff login cannot delete or alter crucial owner contacts</strong>.
          </p>
        </div>
      </div>

      {/* Role State Banner */}
      {currentRole === 'staff' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block mb-0.5">Staff Security Mode</span>
            You are logged in with standard <strong>Staff access</strong>. Customers with the gold{' '}
            <Lock className="w-3 h-3 inline text-amber-600" /> <strong>Locked</strong> seal cannot be deleted or modified by staff members to prevent loss of sensitive seller or JV landowner relationships.
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block mb-0.5">Admin Superuser Active</span>
            You have full privilege to <strong>Approve & Lock</strong> or <strong>Unlock</strong> customers. Once locked, records are shielded from staff deletion.
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search potential customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              filterState === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Potential ({potentialCusts.length})
          </button>
          <button
            onClick={() => setFilterState('locked')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              filterState === 'locked'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Locked by Admin ({potentialCusts.filter((c) => c.isLocked).length})
          </button>
          <button
            onClick={() => setFilterState('unlocked')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              filterState === 'unlocked'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending Lock ({potentialCusts.filter((c) => !c.isLocked).length})
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleEditSave}
            className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Edit Customer Information</h2>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact</label>
                  <input
                    type="text"
                    value={editingCustomer.contactNo}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, contactNo: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price / Terms</label>
                  <input
                    type="text"
                    value={editingCustomer.expectedPrice}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, expectedPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Offered</label>
                <input
                  type="text"
                  value={editingCustomer.propertyOffered}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, propertyOffered: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="px-3.5 py-1.5 rounded text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs bg-slate-900 text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cust) => {
          const isLocked = cust.isLocked;

          return (
            <div
              key={cust.id}
              className={`bg-white rounded-xl border p-4 shadow-sm transition flex flex-col justify-between ${
                isLocked ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isLocked
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-3 h-3 text-amber-600" />
                        Approved & Locked
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 text-purple-600" />
                        Pending Lock
                      </>
                    )}
                  </span>

                  <span className="font-semibold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {cust.customerType}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{cust.name}</h3>

                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cust.contactNo}</span>
                  <span>•</span>
                  <span>{cust.locality}</span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400">Offered:</span>{' '}
                  <span className="font-semibold text-slate-800">{cust.propertyOffered}</span>
                </div>

                <div className="text-xs mt-1">
                  <span className="text-slate-400">Expected:</span>{' '}
                  <span className="font-bold text-emerald-700">{cust.expectedPrice}</span>
                </div>

                <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100 line-clamp-2">
                  {cust.notes}
                </p>

                {isLocked && (
                  <div className="mt-2 text-[11px] text-amber-900 flex items-center gap-1 bg-white/70 p-1.5 rounded border border-amber-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Locked by Admin ({cust.lockedAt || 'Approved'})</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {currentRole === 'admin' ? (
                  isLocked ? (
                    <button
                      onClick={() => unlockCustomer(cust.id)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 transition text-[11px]"
                    >
                      <Unlock className="w-3 h-3" />
                      <span>Unlock</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => approveAndLockCustomer(cust.id)}
                      className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 shadow-xs transition text-[11px]"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Approve & Lock</span>
                    </button>
                  )
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    {isLocked ? 'Staff cannot delete' : 'Awaiting lock'}
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCustomer(cust)}
                    disabled={isLocked && currentRole === 'staff'}
                    className={`p-1.5 rounded transition ${
                      isLocked && currentRole === 'staff'
                        ? 'text-slate-200 cursor-not-allowed'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isLocked && currentRole === 'staff' ? 'Locked by admin' : 'Edit details'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteCustomerLead(cust.id)}
                    disabled={isLocked && currentRole === 'staff'}
                    className={`p-1.5 rounded transition ${
                      isLocked && currentRole === 'staff'
                        ? 'text-slate-200 cursor-not-allowed'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                    title={
                      isLocked && currentRole === 'staff'
                        ? 'Staff login CANNOT delete locked customer!'
                        : 'Delete customer'
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-300">
            No potential customers found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
};
