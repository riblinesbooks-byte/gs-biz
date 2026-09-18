import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  ArrowRight,
  Trash2,
  Lock,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  FileSpreadsheet,
} from 'lucide-react';

export const AddCustomerLeads: React.FC = () => {
  const {
    customerLeads,
    addCustomerLead,
    deleteCustomerLead,
    moveToPotentialCustomer,
    currentRole,
    setCurrentPage,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Form state according to document Page 1:
  // Title: Add Customer
  // Fields: Name, Mobile No, Property Type, Property Area, Property Address
  // Action: save as button
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [propertyType, setPropertyType] = useState('Plot');
  const [propertyArea, setPropertyArea] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveAs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobileNo.trim()) return;
    setIsSubmitting(true);

    const today = new Date().toISOString().split('T')[0];

    addCustomerLead({
      date: today,
      name: name.trim(),
      contactNo: mobileNo.trim(),
      propertyType,
      propertyArea: propertyArea.trim() || '2400 sq ft',
      propertyAddress: propertyAddress.trim() || 'Nanganallur, Chennai',
      customerType: 'Seller',
      propertyOffered: `${propertyType} (${propertyArea.trim() || 'Standard'}) at ${propertyAddress.trim() || 'Chennai'}`,
      locality: propertyAddress.trim() || 'Nanganallur',
      expectedPrice: 'Market Rate',
      notes: `Captured via Add Customer form for ${propertyType} (${propertyArea || 'Standard'}).`,
      handledBy: currentRole === 'admin' ? 'Admin' : 'Staff',
      isPotential: false,
      isApproved: false,
      waitingForApproval: false,
      isLocked: false,
      crmStage: 'Lead Intake',
      statusTag: 'New Lead',
    });

    // Reset form
    setName('');
    setMobileNo('');
    setPropertyType('Plot');
    setPropertyArea('');
    setPropertyAddress('');
    setIsSubmitting(false);
  };

  const filteredLeads = customerLeads.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactNo.includes(search) ||
      (c.propertyAddress && c.propertyAddress.toLowerCase().includes(search.toLowerCase())) ||
      (c.propertyArea && c.propertyArea.toLowerCase().includes(search.toLowerCase()));

    const matchType = filterType === 'All' || c.propertyType === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add Customer Leads</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200">
              {customerLeads.length} Total Customer Leads
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Register new customer leads and property intake. Fast single-screen entry as specified in the document.
          </p>
        </div>

        <button
          id="btn-nav-move-potential-customer"
          onClick={() => setCurrentPage('customer_move_potential')}
          className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Move to Potential Customer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Left Column = Add Customer Form (document Page 1), Right Column = Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900">Add Customer</h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Document Specification Form</span>
          </div>

          <form onSubmit={handleSaveAs} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-customer-name"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar / Anil Builders"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition"
                />
              </div>

              {/* Mobile No */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile No <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="input-customer-mobile"
                    type="tel"
                    required
                    placeholder="e.g. 98401 23456"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    className="w-full pl-8.5 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Type <span className="text-rose-500">*</span>
                </label>
                <select
                  id="select-customer-property-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition bg-white"
                >
                  <option value="Plot">Plot</option>
                  <option value="Flat">Flat</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Joint Venture">Joint Venture</option>
                </select>
              </div>

              {/* Property Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Area
                </label>
                <input
                  id="input-customer-property-area"
                  type="text"
                  placeholder="e.g. 2400 sq ft / 1.5 Ground / 1050 sq ft"
                  value={propertyArea}
                  onChange={(e) => setPropertyArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition"
                />
              </div>
            </div>

            {/* Property Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <textarea
                  id="input-customer-property-address"
                  rows={2}
                  placeholder="e.g. Door No. 14, 20th Street, Nanganallur, Chennai"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full pl-8.5 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition resize-none"
                />
              </div>
            </div>

            {/* Save as Button */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setMobileNo('');
                  setPropertyArea('');
                  setPropertyAddress('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                Clear
              </button>
              <button
                id="btn-customer-save-as"
                type="submit"
                disabled={isSubmitting || !name.trim() || !mobileNo.trim()}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save as</span>
              </button>
            </div>
          </form>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Workflow Guide
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              This intake form maps directly to the standard customer onboarding protocol:
            </p>
            <ol className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>
                  <strong>Add Customer Leads</strong>: Fill in Name, Mobile, Property Type, Area, Address and click <strong>Save as</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>
                  <strong>Move to Potential Customer</strong>: Filter by date, review list of new customers, edit, and click <strong>Send for approval</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>
                  <strong>Admin Approval</strong>: Only Admin can approve. Staff cannot approve.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  4
                </span>
                <span>
                  <strong>List of Customer</strong>: Once approved, customer is permanently locked (Name, Mobile No, Date, Type, Area, Address) and available in Canvas & CRM.
                </span>
              </li>
            </ol>
          </div>

          <div className="bg-purple-50/70 border border-purple-200/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-purple-800 text-xs font-bold mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Permission Guard</span>
            </div>
            <p className="text-[11px] text-purple-900/80">
              Currently logged in as <strong className="capitalize">{currentRole}</strong>. Only <strong>Admin</strong> has authority to approve and lock records.
            </p>
          </div>
        </div>
      </div>

      {/* Recorded Customer Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Recorded Customer Leads</h3>
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
              {filteredLeads.length}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search name, phone, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden w-48 sm:w-60 bg-white"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-purple-500 outline-hidden"
            >
              <option value="All">All Types</option>
              <option value="Plot">Plot</option>
              <option value="Flat">Flat</option>
              <option value="Independent House">Independent House</option>
              <option value="Commercial">Commercial</option>
              <option value="Joint Venture">Joint Venture</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Date of Entry</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Mobile No</th>
                <th className="py-3 px-4">Property Type</th>
                <th className="py-3 px-4">Property Area</th>
                <th className="py-3 px-4">Property Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No customer leads match the criteria. Add one using the form above.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {cust.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {cust.name}
                        {cust.isLocked && <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-mono whitespace-nowrap">
                      {cust.contactNo}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {cust.propertyType || 'Plot'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {cust.propertyArea || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={cust.propertyAddress}>
                      {cust.propertyAddress || cust.locality || '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {cust.isLocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Approved & Locked
                        </span>
                      ) : cust.waitingForApproval ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" /> Waiting Approval
                        </span>
                      ) : cust.isPotential ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                          Potential Customer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          New Lead
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {!cust.isPotential && !cust.waitingForApproval && !cust.isLocked && (
                          <button
                            onClick={() => moveToPotentialCustomer(cust.id)}
                            className="px-2.5 py-1 text-[11px] bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold rounded-md transition"
                          >
                            Promote to Potential
                          </button>
                        )}
                        {!cust.isLocked && (
                          <button
                            onClick={() => deleteCustomerLead(cust.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
