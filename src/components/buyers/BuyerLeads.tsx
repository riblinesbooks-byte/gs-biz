import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerLead } from '../../types';
import {
  UserPlus,
  Search,
  Filter,
  ArrowRight,
  Phone,
  Trash2,
  Lock,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const BuyerLeads: React.FC = () => {
  const {
    buyerLeads,
    addBuyerLead,
    deleteBuyerLead,
    moveToPotentialBuyer,
    currentRole,
    currentUser,
    users,
    setCurrentPage,
    tags,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [enquiryMode, setEnquiryMode] = useState('Property Plus');
  const [enquiryFor, setEnquiryFor] = useState('Purchase');
  const [propertyType, setPropertyType] = useState('Plot');
  const [budget, setBudget] = useState('');
  const [preferredLocality, setPreferredLocality] = useState('20th Street, Nanganallur');
  const [requirement, setRequirement] = useState('');
  const [firstCallHandledBy, setFirstCallHandledBy] = useState(() => currentUser?.username || 'Venkatesh');

  // Keep synchronized with logged-in user
  useEffect(() => {
    if (currentUser?.username) {
      setFirstCallHandledBy(currentUser.username);
    }
  }, [currentUser?.username]);
  const [recentUpdate, setRecentUpdate] = useState('');
  const [comments, setComments] = useState('');

  const enquirySources = tags.filter((t) => t.category === 'enquiry_source');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactNo.trim()) return;

    addBuyerLead({
      date: new Date().toISOString().split('T')[0],
      name,
      contactNo,
      enquiryMode,
      enquiryFor,
      propertyType,
      budget: budget || 'NA',
      preferredLocality,
      requirement: requirement || 'New buyer enquiry logged',
      firstCallHandledBy,
      recentUpdate: recentUpdate || 'Enquiry received and logged into system.',
      comments,
      isPotential: false,
      potentialApproved: false,
      isLocked: false,
      crmStage: 'New Lead',
      tags: [enquiryMode],
    });

    // Reset
    setName('');
    setContactNo('');
    setBudget('');
    setRequirement('');
    setRecentUpdate('');
    setComments('');
    setShowAddForm(false);
  };

  const filteredLeads = buyerLeads.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.contactNo.includes(search) ||
      b.preferredLocality.toLowerCase().includes(search.toLowerCase()) ||
      b.requirement.toLowerCase().includes(search.toLowerCase());

    const matchMode = filterMode === 'All' || b.enquiryMode === filterMode;
    return matchSearch && matchMode;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add Seller Leads</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200">
              {buyerLeads.length} Total Leads
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Capture new incoming seller enquiries (from Property Plus, Facebook, Walk-in, Newspapers), qualify requirements, and promote them into the Potential Seller pipeline.
          </p>
        </div>

        <button
          id="btn-toggle-add-buyer"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          {showAddForm ? 'Close Form' : 'Add New Seller Lead'}
        </button>
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              New Seller Lead Details
            </h2>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Client / Buyer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Jaishankar (Houston NRI)"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98848 27469"
                required
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Enquiry Mode / Source</label>
              <select
                value={enquiryMode}
                onChange={(e) => setEnquiryMode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                {enquirySources.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="Facebook">Facebook</option>
                <option value="Property Plus">Property Plus</option>
                <option value="Nanganallur Voice">Nanganallur Voice</option>
                <option value="Times of India">Times of India</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Enquiry For</label>
              <select
                value={enquiryFor}
                onChange={(e) => setEnquiryFor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Purchase">Purchase</option>
                <option value="Rental">Rental</option>
                <option value="Joint Venture">Joint Venture</option>
                <option value="Investment">Investment</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Property Type Wanted</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Plot">Plot</option>
                <option value="Flat">Flat</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="Independent House">Independent House</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Budget</label>
              <input
                type="text"
                placeholder="e.g. 1.50 Cr or 80 L"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Locality</label>
              <input
                type="text"
                placeholder="e.g. 20th Street, Nanganallur, Guduvanchery"
                value={preferredLocality}
                onChange={(e) => setPreferredLocality(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Call Handled By</label>
              <select
                value={firstCallHandledBy}
                onChange={(e) => setFirstCallHandledBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
              >
                {users && users.length > 0 ? (
                  users.map((u) => (
                    <option key={u.id} value={u.username}>
                      {u.username} ({u.role === 'admin' ? 'Admin' : 'Staff'})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Venkatesh">Venkatesh (Staff)</option>
                    <option value="Muthukumar">Muthukumar (Staff)</option>
                    <option value="Admin">Admin</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Requirement Notes</label>
              <textarea
                rows={2}
                placeholder="Specific preferences (corner plot, vaastu, road width...)"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recent Update</label>
              <textarea
                rows={2}
                placeholder="Details of first phone interaction"
                value={recentUpdate}
                onChange={(e) => setRecentUpdate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Internal Comments</label>
              <textarea
                rows={2}
                placeholder="Staff notes on urgency or loan status"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 rounded-md text-xs text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm"
            >
              Save Seller Lead
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, phone, locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">Source Filter:</span>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
          >
            <option value="All">All Sources</option>
            <option value="Property Plus">Property Plus</option>
            <option value="Facebook">Facebook</option>
            <option value="Nanganallur Voice">Nanganallur Voice</option>
          </select>
        </div>
      </div>

      {/* Seller Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="px-3.5 py-3">Lead / Client Name</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Type & Budget</th>
                <th className="px-3.5 py-3 min-w-[200px]">Requirement & Update</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3.5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-3.5 py-3">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {lead.name}
                      {lead.isLocked && (
                        <span title="Locked by Admin">
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Added: {lead.date} • Handled by: {lead.firstCallHandledBy}
                    </span>
                  </td>

                  <td className="px-3 py-3 font-mono text-[11px] text-slate-700">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {lead.contactNo}
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      {lead.enquiryMode}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <div className="font-semibold text-slate-800">{lead.propertyType}</div>
                    <div className="text-[11px] font-bold text-emerald-700">{lead.budget}</div>
                  </td>

                  <td className="px-3.5 py-3">
                    <p className="text-slate-700 line-clamp-1 font-medium">{lead.requirement}</p>
                    <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{lead.recentUpdate}</p>
                  </td>

                  <td className="px-3 py-3">
                    {lead.isPotential ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        Potential Seller
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        New Lead
                      </span>
                    )}
                  </td>

                  <td className="px-3.5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!lead.isPotential && (
                        <button
                          onClick={() => moveToPotentialBuyer(lead.id)}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-[11px] transition flex items-center gap-1"
                          title="Move to Potential Seller"
                        >
                          <span>Move to Potential</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteBuyerLead(lead.id)}
                        disabled={lead.isLocked && currentRole === 'staff'}
                        className={`p-1.5 rounded transition ${
                          lead.isLocked && currentRole === 'staff'
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title={
                          lead.isLocked && currentRole === 'staff'
                            ? 'Protected: Locked by Admin - Cannot delete in Staff mode'
                            : 'Delete Lead'
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No seller leads found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
