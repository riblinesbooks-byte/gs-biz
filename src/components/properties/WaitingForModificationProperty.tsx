import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyItem } from '../../types';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Search,
  Send,
  Building,
  Phone,
  X,
  Edit3,
  Calendar,
  ShieldAlert,
  MessageSquare,
  Compass,
} from 'lucide-react';

export const WaitingForModificationProperty: React.FC = () => {
  const {
    properties,
    resubmitPropertyForApproval,
    setCurrentPage,
    currentUser,
  } = useApp();

  const [search, setSearch] = useState('');
  const [editingProp, setEditingProp] = useState<PropertyItem | null>(null);
  const [formData, setFormData] = useState<Partial<PropertyItem>>({});

  // Properties waiting for modification
  const modificationProps = properties.filter((p) => p.waitingForModification);

  const filteredProps = modificationProps.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.propertyCode.toLowerCase().includes(q) ||
      p.locality.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.ownerName.toLowerCase().includes(q) ||
      p.ownerContact.includes(q) ||
      (p.modificationReason && p.modificationReason.toLowerCase().includes(q))
    );
  });

  const handleOpenEdit = (prop: PropertyItem) => {
    setEditingProp(prop);
    setFormData({
      title: prop.title,
      propertyCode: prop.propertyCode,
      propertyType: prop.propertyType,
      locality: prop.locality,
      address: prop.address,
      sizeSqFt: prop.sizeSqFt,
      groundArea: prop.groundArea || '',
      facing: prop.facing || 'East',
      roadWidthFt: prop.roadWidthFt || 30,
      price: prop.price,
      ownerName: prop.ownerName,
      ownerContact: prop.ownerContact,
      availableFrom: prop.availableFrom || '',
    });
  };

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProp) return;

    resubmitPropertyForApproval(editingProp.id, formData);
    setEditingProp(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Waiting for Modification (Property Details)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 font-bold border border-rose-200 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              {modificationProps.length} Properties To Modify
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Properties returned by Administration for document, dimension, or price revisions. Staff can adjust details and resubmit for approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('property_create')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            + Create Property
          </button>
          <button
            onClick={() => setCurrentPage('property_waiting_approval')}
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
            <span className="font-bold text-amber-950 block text-sm">Property Re-verification</span>
            <span>
              Admin feedback requires verifying specific site details (facing, road width, legal clearances, or owner price quote). Once corrected, click <strong>Send Again for Approval</strong>.
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
            placeholder="Search by property title, code, locality, owner or modification note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Table */}
      {filteredProps.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Properties Waiting for Modification</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {search ? 'No properties match your filter.' : 'All properties are currently approved, locked, or undergoing standard review.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage('property_list')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
            >
              View List of Property
            </button>
            <button
              onClick={() => setCurrentPage('m_reports_properties')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Open Admin M Reports (Property)
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
                  <th className="py-3 px-4">Property & Code</th>
                  <th className="py-3 px-4">Specs & Locality</th>
                  <th className="py-3 px-4">Price & Owner</th>
                  <th className="py-3 px-4">Admin Modification Instruction</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProps.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit & Resubmit
                      </button>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-900 font-medium">{prop.date || 'Active Entry'}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Req: {prop.modificationRequestedAt || 'Recent'}
                      </div>
                      <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
                        By {prop.modificationRequestedBy || 'Admin'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">{prop.title}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                          {prop.propertyCode}
                        </span>
                        <span>{prop.propertyType}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{prop.locality}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {prop.sizeSqFt} sq ft {prop.groundArea ? `• ${prop.groundArea}` : ''}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Compass className="w-3 h-3 text-slate-400" /> {prop.facing || 'East'}
                        </span>
                        <span>Road: {prop.roadWidthFt || 30} ft</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-emerald-700 text-sm">{prop.price}</div>
                      <div className="text-slate-700 text-xs mt-0.5">{prop.ownerName}</div>
                      <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {prop.ownerContact}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="bg-rose-50/80 border border-rose-200 text-rose-900 rounded-lg p-2.5 text-xs">
                        <div className="font-bold flex items-center gap-1 text-[11px] text-rose-800 uppercase tracking-wider mb-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          Admin Correction Note
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {prop.modificationReason || 'Please clarify property specifics.'}
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

      {/* Edit Property Modal */}
      {editingProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-rose-600" />
                  Edit & Resubmit Property
                </h3>
                <p className="text-xs text-slate-500">
                  Update the requested fields and send back for Admin verification
                </p>
              </div>
              <button
                onClick={() => setEditingProp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-950">
                <span className="font-bold block text-rose-800 uppercase tracking-wider text-[11px] mb-1">
                  Correction Requested by {editingProp.modificationRequestedBy || 'Admin'} on {editingProp.modificationRequestedAt || 'Recent'}
                </span>
                <p className="text-slate-800 bg-white/80 p-2 rounded border border-rose-100 font-medium">
                  &quot;{editingProp.modificationReason || 'Please verify details and update properly.'}&quot;
                </p>
              </div>

              <form id="resubmit-prop-form" onSubmit={handleResubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Locality *</label>
                    <input
                      type="text"
                      required
                      value={formData.locality || ''}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quoted Price *</label>
                    <input
                      type="text"
                      required
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Size (Sq Ft)</label>
                    <input
                      type="number"
                      value={formData.sizeSqFt || 0}
                      onChange={(e) => setFormData({ ...formData, sizeSqFt: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ground Area</label>
                    <input
                      type="text"
                      placeholder="e.g. 1.5 Ground"
                      value={formData.groundArea || ''}
                      onChange={(e) => setFormData({ ...formData, groundArea: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Facing</label>
                    <select
                      value={formData.facing || 'East'}
                      onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="North">North</option>
                      <option value="South">South</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="North-East">North-East</option>
                      <option value="North-West">North-West</option>
                      <option value="South-East">South-East</option>
                      <option value="South-West">South-West</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Road Width (Ft)</label>
                    <input
                      type="number"
                      value={formData.roadWidthFt || 30}
                      onChange={(e) => setFormData({ ...formData, roadWidthFt: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Property Address</label>
                  <textarea
                    rows={2}
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Owner / Seller Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.ownerName || ''}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Owner Contact No *</label>
                    <input
                      type="text"
                      required
                      value={formData.ownerContact || ''}
                      onChange={(e) => setFormData({ ...formData, ownerContact: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditingProp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="resubmit-prop-form"
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
