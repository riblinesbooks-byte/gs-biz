import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerLead } from '../../types';
import {
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Edit2,
  Sparkles,
  Phone,
  Info,
} from 'lucide-react';

export const LockPotentialBuyer: React.FC = () => {
  const {
    buyerLeads,
    approveAndLockBuyer,
    unlockBuyer,
    deleteBuyerLead,
    updateBuyerLead,
    currentRole,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [editingLead, setEditingLead] = useState<BuyerLead | null>(null);

  // We only show potential buyers here (or all leads that can be approved)
  const potentialBuyers = buyerLeads.filter((b) => b.isPotential);

  const filtered = potentialBuyers.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.contactNo.includes(search) ||
      b.preferredLocality.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === 'locked') return matchSearch && b.isLocked;
    if (filterStatus === 'unlocked') return matchSearch && !b.isLocked;
    return matchSearch;
  });

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    updateBuyerLead(editingLead.id, editingLead);
    setEditingLead(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Approved / Lock Potential Seller
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-600" />
              Admin Security Vault
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Admin approves and locks potential sellers to safeguard vital client data. Once locked, records{' '}
            <strong className="text-slate-900">cannot be deleted or overwritten by staff login</strong>.
          </p>
        </div>
      </div>

      {/* Role State Banner */}
      {currentRole === 'staff' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block mb-0.5">Staff Mode Active</span>
            You are logged in with standard <strong>Staff permissions</strong>. Records marked with the gold{' '}
            <Lock className="w-3 h-3 inline text-amber-600" /> <strong>Locked</strong> badge are protected by Admin. Staff cannot delete or un-approve these records (Admin authorization required to manage lock statuses).
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block mb-0.5">Admin Superuser Active</span>
            You have full authorization to <strong>Approve & Lock</strong> or <strong>Unlock</strong> potential sellers. Locking ensures critical seller leads cannot be removed by branch or telecalling staff.
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search potential sellers by name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({potentialBuyers.length})
          </button>
          <button
            onClick={() => setFilterStatus('locked')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              filterStatus === 'locked'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Locked by Admin ({potentialBuyers.filter((b) => b.isLocked).length})
          </button>
          <button
            onClick={() => setFilterStatus('unlocked')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              filterStatus === 'unlocked'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending Approval ({potentialBuyers.filter((b) => !b.isLocked).length})
          </button>
        </div>
      </div>

      {/* Edit Modal if triggered */}
      {editingLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleEditSave}
            className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Edit Potential Seller Record</h2>
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seller Name</label>
                <input
                  type="text"
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact</label>
                  <input
                    type="text"
                    value={editingLead.contactNo}
                    onChange={(e) => setEditingLead({ ...editingLead, contactNo: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget</label>
                  <input
                    type="text"
                    value={editingLead.budget}
                    onChange={(e) => setEditingLead({ ...editingLead, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Locality</label>
                <input
                  type="text"
                  value={editingLead.preferredLocality}
                  onChange={(e) => setEditingLead({ ...editingLead, preferredLocality: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirement Notes</label>
                <textarea
                  rows={2}
                  value={editingLead.requirement}
                  onChange={(e) => setEditingLead({ ...editingLead, requirement: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingLead(null)}
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

      {/* Potential Buyers List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((buyer) => {
          const isLocked = buyer.isLocked;

          return (
            <div
              key={buyer.id}
              className={`bg-white rounded-xl border p-4 shadow-sm transition relative flex flex-col justify-between ${
                isLocked ? 'border-amber-300/80 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Status Bar */}
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
                        Pending Admin Lock
                      </>
                    )}
                  </span>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {buyer.budget}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{buyer.name}</h3>

                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{buyer.contactNo}</span>
                  <span>•</span>
                  <span>{buyer.preferredLocality}</span>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100">
                  {buyer.requirement}
                </p>

                {isLocked && (
                  <div className="mt-2 text-[11px] text-amber-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Locked by Admin ({buyer.lockedAt || 'Approved'})</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {/* Admin Lock / Unlock Toggle */}
                {currentRole === 'admin' ? (
                  isLocked ? (
                    <button
                      onClick={() => unlockBuyer(buyer.id)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 transition text-[11px]"
                    >
                      <Unlock className="w-3 h-3" />
                      <span>Unlock Record</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => approveAndLockBuyer(buyer.id)}
                      className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 shadow-xs transition text-[11px]"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Approve & Lock</span>
                    </button>
                  )
                ) : (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 italic">
                    {isLocked ? (
                      <>
                        <Lock className="w-3 h-3 text-amber-500" /> Staff Deletion Blocked
                      </>
                    ) : (
                      'Staff View Only'
                    )}
                  </span>
                )}

                {/* Edit & Delete Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingLead(buyer)}
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
                    onClick={() => deleteBuyerLead(buyer.id)}
                    disabled={isLocked && currentRole === 'staff'}
                    className={`p-1.5 rounded transition ${
                      isLocked && currentRole === 'staff'
                        ? 'text-slate-200 cursor-not-allowed'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                    title={
                      isLocked && currentRole === 'staff'
                        ? 'Staff login CANNOT delete locked potential seller!'
                        : 'Delete seller'
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
            No potential sellers found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
