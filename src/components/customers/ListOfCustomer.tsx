import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerLead } from '../../types';
import {
  Users,
  Search,
  Lock,
  Unlock,
  CheckCircle,
  Download,
  Calendar,
  Layers,
  Kanban,
  Eye,
  ShieldCheck,
  Building,
  Phone,
  MapPin,
  X,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { ViewEditModifyModal } from '../modals/ViewEditModifyModal';

export const ListOfCustomer: React.FC = () => {
  const {
    customerLeads,
    unlockCustomer,
    updateCustomerLead,
    sendBackCustomerForModification,
    currentRole,
    currentUser,
    setCurrentPage,
    addToast,
  } = useApp();

  const isStaff = currentUser?.role === 'staff' || currentRole === 'staff';

  const [search, setSearch] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [inspectCustomer, setInspectCustomer] = useState<CustomerLead | null>(null);
  const [modifyingCust, setModifyingCust] = useState<CustomerLead | null>(null);

  // According to Document Page 2:
  // "once approved the Customer is moved to approval list, then this customer can be add in property canva and CRM, and customer is locked (details which can be locked are Name, Mobile No, Date, Property Type, Property Area and Property Address."
  const approvedCustomers = useMemo(() => {
    return customerLeads.filter((c) => c.isLocked || c.isApproved);
  }, [customerLeads]);

  const filtered = useMemo(() => {
    return approvedCustomers.filter((cust) => {
      if (fromDate && cust.date < fromDate) return false;
      if (toDate && cust.date > toDate) return false;
      if (propertyTypeFilter !== 'All' && cust.propertyType !== propertyTypeFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = cust.name.toLowerCase().includes(q);
        const matchPhone = cust.contactNo.includes(q);
        const matchAddress = (cust.propertyAddress || '').toLowerCase().includes(q);
        const matchType = (cust.propertyType || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchAddress && !matchType) return false;
      }
      return true;
    });
  }, [approvedCustomers, fromDate, toDate, propertyTypeFilter, search]);

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      addToast('No approved customer records to export', 'warning');
      return;
    }
    const headers = [
      'Date of Entry (Locked)',
      'Name (Locked)',
      'Mobile No (Locked)',
      'Property Type (Locked)',
      'Property Area (Locked)',
      'Property Address (Locked)',
      'Area of Land',
      'Area of Building',
      'Ownership Type',
      'Food Preference',
      'Religion',
      'Locked By',
      'CRM Stage',
    ];

    const rows = filtered.map((c) => [
      c.date,
      `"${c.name}"`,
      `"${c.contactNo}"`,
      c.propertyType || 'Plot',
      `"${c.propertyArea || ''}"`,
      `"${c.propertyAddress || c.locality || ''}"`,
      `"${c.areaOfLand || ''}"`,
      `"${c.areaOfBuilding || ''}"`,
      `"${c.ownershipType || ''}"`,
      `"${c.foodPreference || ''}"`,
      `"${c.religion || ''}"`,
      c.lockedBy || 'Admin',
      c.crmStage || 'Admin Approved',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `List_of_Approved_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Approved customer list exported to CSV', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">List of Customer</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
              {approvedCustomers.length} Approved & Locked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Master directory of Admin-approved customers. Key attributes are permanently locked against staff alteration.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-export-approved-customers"
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 shadow-2xs transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setCurrentPage('customer_canvas')}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-purple-200" />
            <span>Property Canva (360°)</span>
          </button>
        </div>
      </div>

      {/* Locked Attributes Specification Highlight (Document Page 2) */}
      <div className="bg-slate-900 text-white rounded-xl p-4.5 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Protected Record Security Rule (Document Specification)
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Once approved by Admin, the following 6 details are locked and protected from modification or deletion:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 font-semibold text-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-400" /> Name
            </span>
            <span className="px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 font-semibold text-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-400" /> Mobile No
            </span>
            <span className="px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 font-semibold text-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-400" /> Date
            </span>
            <span className="px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 font-semibold text-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-400" /> Property Type
            </span>
            <span className="px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 font-semibold text-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-400" /> Property Area
            </span>
            <span className="px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 font-semibold text-slate-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-400" /> Property Address
            </span>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Approved Customer Register</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search approved customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden w-56 bg-white"
              />
            </div>

            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
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

        {/* Master Table with Locked Indicators on all 6 fields */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 text-indigo-900">Action</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 text-slate-800">
                    <Lock className="w-3 h-3 text-rose-500" />
                    <span>Date of Entry</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 text-slate-800">
                    <Lock className="w-3 h-3 text-rose-500" />
                    <span>Name</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 text-slate-800">
                    <Lock className="w-3 h-3 text-rose-500" />
                    <span>Mobile No</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 text-slate-800">
                    <Lock className="w-3 h-3 text-rose-500" />
                    <span>Property Type</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 text-slate-800">
                    <Lock className="w-3 h-3 text-rose-500" />
                    <span>Property Area</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 text-slate-800">
                    <Lock className="w-3 h-3 text-rose-500" />
                    <span>Property Address</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Pipeline Integrations</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500">
                    No approved customers found in the system.
                  </td>
                </tr>
              ) : (
                filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                    {/* View & Edit & Modify button */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        id={`btn-cust-mod-${cust.id}`}
                        disabled={isStaff}
                        onClick={() => {
                          if (isStaff) {
                            addToast('Staff login cannot edit or modify approved customer records. Admin access required.', 'warning');
                            return;
                          }
                          setModifyingCust(cust);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                          isStaff
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60 shadow-none'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border border-indigo-200 shadow-2xs cursor-pointer'
                        }`}
                        title={
                          isStaff
                            ? 'Staff login cannot edit or modify approved records (Admin access required)'
                            : 'View, Edit, or Send for Modification'
                        }
                      >
                        <Edit3 className={`w-3.5 h-3.5 ${isStaff ? 'text-slate-400' : 'text-indigo-600'}`} />
                        <span>View &amp; Edit &amp; Modify</span>
                      </button>
                    </td>

                    {/* 1. Date (Locked) */}
                    <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
                        {cust.date}
                        <Lock className="w-2.5 h-2.5 text-rose-500/80" />
                      </span>
                    </td>

                    {/* 2. Name (Locked) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{cust.name}</span>
                        <span className="p-0.5 rounded-xs bg-rose-50 text-rose-600" title="Locked by Admin">
                          <Lock className="w-3 h-3" />
                        </span>
                      </div>
                    </td>

                    {/* 3. Mobile No (Locked) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono text-slate-700">
                        {cust.contactNo}
                        <Lock className="w-2.5 h-2.5 text-rose-500/80" />
                      </span>
                    </td>

                    {/* 4. Property Type (Locked) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                        {cust.propertyType || 'Plot'}
                        <Lock className="w-2.5 h-2.5 text-purple-700" />
                      </span>
                    </td>

                    {/* 5. Property Area (Locked) */}
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-medium">
                        {cust.propertyArea || '—'}
                        <Lock className="w-2.5 h-2.5 text-rose-500/80" />
                      </span>
                    </td>

                    {/* 6. Property Address (Locked) */}
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={cust.propertyAddress}>
                      <span className="inline-flex items-center gap-1">
                        <span className="truncate">{cust.propertyAddress || cust.locality || '—'}</span>
                        <Lock className="w-2.5 h-2.5 text-rose-500/80 shrink-0" />
                      </span>
                    </td>

                    {/* Document Page 2: "then this customer can be add in property canva and CRM" */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          id={`btn-canvas-${cust.id}`}
                          onClick={() => {
                            setCurrentPage('customer_canvas');
                            addToast(`Opened Canvas matching for ${cust.name}`, 'info');
                          }}
                          className="px-2 py-1 text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-md border border-purple-200 flex items-center gap-1 transition"
                          title="Add in Property Canva (360° Match)"
                        >
                          <Layers className="w-3 h-3" />
                          <span>Property Canva</span>
                        </button>

                        <button
                          id={`btn-crm-${cust.id}`}
                          onClick={() => {
                            setCurrentPage('reports_crm_customer');
                            addToast(`Viewing ${cust.name} in Customer CRM pipeline`, 'info');
                          }}
                          className="px-2 py-1 text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-md border border-blue-200 flex items-center gap-1 transition"
                          title="Open in CRM Pipeline"
                        >
                          <Kanban className="w-3 h-3" />
                          <span>CRM</span>
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectCustomer(cust)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 rounded-md hover:bg-slate-100 transition"
                          title="View Complete Specifications"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {currentRole === 'admin' && (
                          <button
                            onClick={() => unlockCustomer(cust.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition"
                            title="Admin Unlock Record"
                          >
                            <Unlock className="w-4 h-4" />
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

      {/* INSPECT APPROVED CUSTOMER MODAL */}
      {inspectCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Approved Customer Profile</h3>
              </div>
              <button
                onClick={() => setInspectCustomer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-emerald-900">Locked and Approved by Admin</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">Protected against staff edits</span>
              </div>

              <div className="space-y-2 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                  Locked Attributes
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Name 🔒:</span>
                    <strong className="text-slate-900 font-bold">{inspectCustomer.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Mobile No 🔒:</span>
                    <strong className="text-slate-900 font-mono">{inspectCustomer.contactNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Date of Entry 🔒:</span>
                    <strong className="text-slate-800">{inspectCustomer.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Type 🔒:</span>
                    <strong className="text-purple-700">{inspectCustomer.propertyType || 'Plot'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Area 🔒:</span>
                    <strong className="text-slate-800">{inspectCustomer.propertyArea || 'Standard'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Address 🔒:</span>
                    <strong className="text-slate-800">{inspectCustomer.propertyAddress || inspectCustomer.locality || '—'}</strong>
                  </div>
                </div>
              </div>

              {/* Extra specifications */}
              <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50/60">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                  Additional Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Area of Land:</span>
                    <strong className="text-slate-800">{inspectCustomer.areaOfLand || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Area of Building:</span>
                    <strong className="text-slate-800">{inspectCustomer.areaOfBuilding || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Ownership:</span>
                    <strong className="text-slate-800">{inspectCustomer.ownershipType || 'Freehold'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Food Preference:</span>
                    <strong className="text-slate-800">{inspectCustomer.foodPreference || 'Veg'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Religion:</span>
                    <strong className="text-slate-800">{inspectCustomer.religion || '—'}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInspectCustomer(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setInspectCustomer(null);
                      setCurrentPage('customer_canvas');
                    }}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Match in Canvas</span>
                  </button>

                  <button
                    onClick={() => {
                      setInspectCustomer(null);
                      setCurrentPage('reports_crm_customer');
                    }}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1"
                  >
                    <Kanban className="w-3.5 h-3.5" />
                    <span>CRM View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View, Edit & Modify Modal */}
      <ViewEditModifyModal
        isOpen={!!modifyingCust}
        onClose={() => setModifyingCust(null)}
        entityType="customer"
        record={modifyingCust}
        onSaveEdit={(updates) => {
          if (modifyingCust) {
            updateCustomerLead(modifyingCust.id, updates);
            addToast('Customer record updated successfully', 'success');
          }
        }}
        onSendModification={(reason) => {
          if (modifyingCust) {
            sendBackCustomerForModification(modifyingCust.id, reason);
            addToast('Customer sent back to Waiting for Modification', 'info');
          }
        }}
      />
    </div>
  );
};
