import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerLead } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Trash2,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const CustomerLeads: React.FC = () => {
  const { customerLeads, addCustomerLead, deleteCustomerLead, moveToPotentialCustomer, currentRole, setCurrentPage } =
    useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [customerType, setCustomerType] = useState<CustomerLead['customerType']>('Seller');
  const [propertyOffered, setPropertyOffered] = useState('');
  const [locality, setLocality] = useState('Nanganallur');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [handledBy, setHandledBy] = useState('Venkatesh');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactNo.trim()) return;

    addCustomerLead({
      date: new Date().toISOString().split('T')[0],
      name,
      contactNo,
      customerType,
      propertyOffered: propertyOffered || 'Residential Land / Apartment',
      locality,
      expectedPrice: expectedPrice || 'Market Rate',
      notes: notes || 'Incoming customer/seller lead',
      handledBy,
      isPotential: false,
      isApproved: false,
      isLocked: false,
      crmStage: 'Lead Intake',
      statusTag: 'New Lead',
    });

    setName('');
    setContactNo('');
    setPropertyOffered('');
    setExpectedPrice('');
    setNotes('');
    setShowAddForm(false);
  };

  const filtered = customerLeads.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactNo.includes(search) ||
      (c.locality && c.locality.toLowerCase().includes(search.toLowerCase())) ||
      (c.propertyOffered && c.propertyOffered.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add Customer Leads</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-semibold border border-purple-200">
              {customerLeads.length} Total Customers / Sellers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Capture new customer leads (property owners, builders, landlords, and JV investors), record their asset offerings, and promote to Potential Customer List.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          {showAddForm ? 'Close Form' : 'Add Customer Lead'}
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
              <Sparkles className="w-4 h-4 text-purple-600" />
              New Customer / Owner Lead
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
                Customer / Owner Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Anil (Padappai JV Owner)"
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
                placeholder="e.g. 98847 56066"
                required
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Profile Type</label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as CustomerLead['customerType'])}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Seller">Seller (Flat/House)</option>
                <option value="Landowner">Landowner (Plot/Acres)</option>
                <option value="Builder">Builder / Promoter</option>
                <option value="Investor">Investor</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Locality</label>
              <input
                type="text"
                placeholder="e.g. Padappai, Nanganallur"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Property Offered</label>
              <input
                type="text"
                placeholder="e.g. 4.5 grounds JV or 2 BHK Flat"
                value={propertyOffered}
                onChange={(e) => setPropertyOffered(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expected Price / Terms</label>
              <input
                type="text"
                placeholder="e.g. 3.5 Cr advance or 65 Lakhs"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Handled By</label>
              <select
                value={handledBy}
                onChange={(e) => setHandledBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Venkatesh">Venkatesh</option>
                <option value="Muthukumar">Muthukumar</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Conversation Notes / Mandate</label>
            <textarea
              rows={2}
              placeholder="e.g. He spoke to me and send details of JV in Padappai. 4.5 grounds. 3.5 cr advance. Outright also fine."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
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
              className="px-4 py-1.5 rounded-md text-xs bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-sm"
            >
              Save Customer Lead
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search customer leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="px-3.5 py-3">Customer Name</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Profile</th>
                <th className="px-3 py-3">Property Offered & Expected</th>
                <th className="px-3.5 py-3 min-w-[220px]">Notes</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3.5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-3.5 py-3">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {lead.name}
                      {lead.isLocked && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <span className="text-[11px] text-slate-400">Handled: {lead.handledBy}</span>
                  </td>

                  <td className="px-3 py-3 font-mono text-[11px]">
                    <div className="flex items-center gap-1 text-slate-700">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {lead.contactNo}
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[11px] font-semibold">
                      {lead.customerType}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <div className="font-semibold text-slate-800">{lead.propertyOffered}</div>
                    <div className="text-[11px] text-emerald-700 font-bold">{lead.expectedPrice}</div>
                  </td>

                  <td className="px-3.5 py-3 text-slate-600 line-clamp-2">{lead.notes}</td>

                  <td className="px-3 py-3">
                    {lead.isPotential ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Potential Customer
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                        New Lead
                      </span>
                    )}
                  </td>

                  <td className="px-3.5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!lead.isPotential && (
                        <button
                          onClick={() => moveToPotentialCustomer(lead.id)}
                          className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-medium text-[11px] flex items-center gap-1 transition"
                        >
                          <span>Move to Potential</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteCustomerLead(lead.id)}
                        disabled={lead.isLocked && currentRole === 'staff'}
                        className={`p-1.5 rounded transition ${
                          lead.isLocked && currentRole === 'staff'
                            ? 'text-slate-200 cursor-not-allowed'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title={
                          lead.isLocked && currentRole === 'staff'
                            ? 'Protected: Locked by Admin'
                            : 'Delete customer lead'
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
