import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyItem } from '../../types';
import {
  Home,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  AlertCircle,
  Lock,
  Search,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const PotentialProperty: React.FC = () => {
  const { properties, markPropertyPotential, setCurrentPage } = useApp();

  const [selectedPropId, setSelectedPropId] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [search, setSearch] = useState('');

  // Unmarked properties
  const unsubmitted = properties.filter((p) => !p.isPotential);
  // Marked potential properties awaiting approval or approved
  const potentialProperties = properties.filter((p) => p.isPotential);

  const handleSubmitForApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropId) return;

    markPropertyPotential(selectedPropId);
    setSelectedPropId('');
    setSubmissionNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Potential Property</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-semibold border border-purple-200">
              {potentialProperties.length} Potential Assets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Send specific selected properties for approval and dispatch to the admin approval & lock queue.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('property_lock')}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Go to Approve / Lock Property</span>
        </button>
      </div>

      {/* Dispatch Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Send className="w-4 h-4 text-purple-600" />
          Select Specific Property to Send for Admin Approval
        </h2>

        <form onSubmit={handleSubmitForApproval} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Select Property <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="">-- Choose property ({unsubmitted.length} available) --</option>
              {unsubmitted.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.locality} - Price: {p.price} - Code: {p.propertyCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Verification / Submission Note</label>
            <input
              type="text"
              placeholder="e.g. Patta verified, ready for marketing approval"
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={!selectedPropId}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <span>Submit for Admin Approval & Lock</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Two Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Properties Awaiting Submission */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Standard Properties ({unsubmitted.length})
            </h3>
            <p className="text-[11px] text-slate-500">Not yet flagged as potential or submitted</p>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {unsubmitted.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{p.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {p.locality} • {p.price} • {p.propertyType}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">Owner: {p.ownerName}</div>
                </div>

                <button
                  onClick={() => markPropertyPotential(p.id)}
                  className="shrink-0 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-medium text-[11px] rounded transition flex items-center gap-1"
                >
                  <span>Send for Approval</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}

            {unsubmitted.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                All properties have been sent for potential approval!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Properties in Potential & Approval Queue */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Submitted Potential Properties ({potentialProperties.length})
              </h3>
              <p className="text-[11px] text-slate-500">Awaiting or granted Admin Lock</p>
            </div>
            <button
              onClick={() => setCurrentPage('property_lock')}
              className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Open Lock Portal <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {potentialProperties.map((p) => (
              <div
                key={p.id}
                className={`p-3 rounded-lg border text-xs ${
                  p.isLocked
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900">{p.title}</div>
                  <span className="font-bold text-emerald-700">{p.price}</span>
                </div>

                <div className="text-[11px] text-slate-500 mt-1">
                  {p.locality} • {p.groundArea || `${p.sizeSqFt} sq ft`} • Stage: {p.crmStage}
                </div>

                <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100 text-[11px]">
                  {p.isLocked ? (
                    <span className="text-emerald-800 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Approved & Locked by Admin
                    </span>
                  ) : (
                    <span className="text-amber-800 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      Pending Admin Lock Review
                    </span>
                  )}

                  <span className="text-slate-400 font-mono">{p.propertyCode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
