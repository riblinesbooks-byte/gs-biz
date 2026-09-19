import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyItem } from '../../types';
import {
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  MapPin,
  Building2,
  Info,
} from 'lucide-react';

export const LockProperty: React.FC = () => {
  const {
    properties,
    approveAndLockProperty,
    unlockProperty,
    deleteProperty,
    updateProperty,
    currentRole,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [editingProp, setEditingProp] = useState<PropertyItem | null>(null);

  const potentialProps = properties.filter((p) => p.isPotential);

  const filtered = potentialProps.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.locality.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      p.propertyCode.toLowerCase().includes(search.toLowerCase());

    if (filterState === 'locked') return matchSearch && p.isLocked;
    if (filterState === 'unlocked') return matchSearch && !p.isLocked;
    return matchSearch;
  });

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProp) return;
    updateProperty(editingProp.id, editingProp);
    setEditingProp(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Approve / Lock Property
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-600" />
              Admin Property Vault
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Admin approves and locks listed property assets. Locked properties{' '}
            <strong className="text-slate-900">cannot be deleted or tampered with by staff login</strong>.
          </p>
        </div>
      </div>

      {/* Role State Banner */}
      {currentRole === 'staff' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block mb-0.5">Staff Security Restrictions Active</span>
            You are viewing in <strong>Staff Mode</strong>. Properties with the gold{' '}
            <Lock className="w-3 h-3 inline text-amber-600" /> <strong>Approved & Locked</strong> seal have been verified by company management. The system restricts staff login from deleting or altering them.
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block mb-0.5">Admin Management Active</span>
            You have full authority to <strong>Approve & Lock</strong> properties (such as 20th Street Plot, Guduvanchery, Urapakkam, Karthikeyapuram). Locking guarantees staff members cannot delete approved assets from the company inventory.
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search property by title, locality, code..."
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
            All Potential ({potentialProps.length})
          </button>
          <button
            onClick={() => setFilterState('locked')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              filterState === 'locked'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Locked & Approved ({potentialProps.filter((p) => p.isLocked).length})
          </button>
          <button
            onClick={() => setFilterState('unlocked')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              filterState === 'unlocked'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending Admin Lock ({potentialProps.filter((p) => !p.isLocked).length})
          </button>
        </div>
      </div>

      {/* Edit Property Modal */}
      {editingProp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleEditSave}
            className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Edit Property Details</h2>
              <button
                type="button"
                onClick={() => setEditingProp(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingProp.title}
                  onChange={(e) => setEditingProp({ ...editingProp, title: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price</label>
                  <input
                    type="text"
                    value={editingProp.price}
                    onChange={(e) => setEditingProp({ ...editingProp, price: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Locality</label>
                  <input
                    type="text"
                    value={editingProp.locality}
                    onChange={(e) => setEditingProp({ ...editingProp, locality: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Owner Contact</label>
                <input
                  type="text"
                  value={editingProp.ownerContact}
                  onChange={(e) => setEditingProp({ ...editingProp, ownerContact: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingProp(null)}
                className="px-3.5 py-1.5 rounded text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs bg-slate-900 text-white font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Potential Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((prop) => {
          const isLocked = prop.isLocked;

          return (
            <div
              key={prop.id}
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

                  <span className="font-mono text-[10px] text-slate-500 font-bold">
                    {prop.propertyCode}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{prop.title}</h3>

                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{prop.locality}</span>
                  <span>•</span>
                  <span>{prop.propertyType}</span>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Value:</span>
                  <span className="text-sm font-extrabold text-emerald-700">{prop.price}</span>
                </div>

                <div className="text-[11px] text-slate-600 mt-1">
                  Owner: <strong>{prop.ownerName}</strong> ({prop.ownerContact})
                </div>

                {isLocked && (
                  <div className="mt-2 text-[11px] text-amber-900 flex items-center gap-1 bg-white/70 p-1.5 rounded border border-amber-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Locked by Admin ({prop.lockedAt || 'Approved'})</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {currentRole === 'admin' ? (
                  isLocked ? (
                    <button
                      onClick={() => unlockProperty(prop.id)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 transition text-[11px]"
                    >
                      <Unlock className="w-3 h-3" />
                      <span>Unlock Asset</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => approveAndLockProperty(prop.id)}
                      className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 shadow-xs transition text-[11px]"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Approve & Lock</span>
                    </button>
                  )
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    {isLocked ? 'Staff deletion locked' : 'Awaiting admin lock'}
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingProp(prop)}
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
                    onClick={() => deleteProperty(prop.id)}
                    disabled={isLocked && currentRole === 'staff'}
                    className={`p-1.5 rounded transition ${
                      isLocked && currentRole === 'staff'
                        ? 'text-slate-200 cursor-not-allowed'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                    title={
                      isLocked && currentRole === 'staff'
                        ? 'Staff login CANNOT delete locked property!'
                        : 'Delete property'
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
            No potential properties found in this view.
          </div>
        )}
      </div>
    </div>
  );
};
