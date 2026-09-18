import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerLead } from '../../types';
import {
  Users,
  Search,
  Calendar,
  Send,
  Edit,
  X,
  CheckCircle,
  FileSpreadsheet,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const MoveToPotentialCustomer: React.FC = () => {
  const {
    customerLeads,
    sendCustomerForApproval,
    updateCustomerLead,
    currentRole,
    setCurrentPage,
  } = useApp();

  // Filters from document Page 1:
  // "From Date", "To Date"
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');

  // Modal State for "Send for approval" Dialog Box (Page 1 & 2 of document)
  const [approvalTarget, setApprovalTarget] = useState<CustomerLead | null>(null);

  // Dialog fields according to document Page 2:
  // - Name
  // - Mobile No
  // - Property Type
  // - Property Area
  // - Property Address
  // - Area of Land (not compulsory)
  // - Area of Building (not compulsory)
  // - Ownership type (not compulsory)
  // - Food veg or non veg (not compulsory)
  // - Religion if applicable (not compulsory)
  // Button: Save and send for approval button
  const [modalName, setModalName] = useState('');
  const [modalMobileNo, setModalMobileNo] = useState('');
  const [modalPropertyType, setModalPropertyType] = useState('Plot');
  const [modalPropertyArea, setModalPropertyArea] = useState('');
  const [modalPropertyAddress, setModalPropertyAddress] = useState('');
  const [modalAreaOfLand, setModalAreaOfLand] = useState('');
  const [modalAreaOfBuilding, setModalAreaOfBuilding] = useState('');
  const [modalOwnershipType, setModalOwnershipType] = useState('');
  const [modalFoodPreference, setModalFoodPreference] = useState('');
  const [modalReligion, setModalReligion] = useState('');

  // Modal State for "Edit Button"
  const [editTarget, setEditTarget] = useState<CustomerLead | null>(null);
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editType, setEditType] = useState('Plot');
  const [editArea, setEditArea] = useState('');
  const [editAddress, setEditAddress] = useState('');

  // Open "Send for approval" Dialog Box
  const handleOpenSendForApproval = (cust: CustomerLead) => {
    setApprovalTarget(cust);
    setModalName(cust.name);
    setModalMobileNo(cust.contactNo);
    setModalPropertyType(cust.propertyType || 'Plot');
    setModalPropertyArea(cust.propertyArea || '');
    setModalPropertyAddress(cust.propertyAddress || cust.locality || '');
    setModalAreaOfLand(cust.areaOfLand || '');
    setModalAreaOfBuilding(cust.areaOfBuilding || '');
    setModalOwnershipType(cust.ownershipType || '');
    setModalFoodPreference(cust.foodPreference || 'Veg');
    setModalReligion(cust.religion || 'Hindu');
  };

  const handleSaveAndSendForApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalTarget) return;

    sendCustomerForApproval(approvalTarget.id, {
      name: modalName.trim(),
      contactNo: modalMobileNo.trim(),
      propertyType: modalPropertyType,
      propertyArea: modalPropertyArea.trim(),
      propertyAddress: modalPropertyAddress.trim(),
      areaOfLand: modalAreaOfLand.trim(),
      areaOfBuilding: modalAreaOfBuilding.trim(),
      ownershipType: modalOwnershipType.trim(),
      foodPreference: modalFoodPreference.trim(),
      religion: modalReligion.trim(),
      isPotential: true,
    });

    setApprovalTarget(null);
  };

  // Open "Edit" Modal
  const handleOpenEdit = (cust: CustomerLead) => {
    setEditTarget(cust);
    setEditName(cust.name);
    setEditMobile(cust.contactNo);
    setEditType(cust.propertyType || 'Plot');
    setEditArea(cust.propertyArea || '');
    setEditAddress(cust.propertyAddress || cust.locality || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    updateCustomerLead(editTarget.id, {
      name: editName.trim(),
      contactNo: editMobile.trim(),
      propertyType: editType,
      propertyArea: editArea.trim(),
      propertyAddress: editAddress.trim(),
    });

    setEditTarget(null);
  };

  // Only show customers that are not yet approved & locked (new or in pipeline)
  const newCustomers = useMemo(() => {
    return customerLeads.filter((c) => !c.isLocked);
  }, [customerLeads]);

  // Apply Date and Search Filters
  const filteredCustomers = useMemo(() => {
    return newCustomers.filter((cust) => {
      // Date Filter
      if (fromDate && cust.date < fromDate) return false;
      if (toDate && cust.date > toDate) return false;

      // Property Type Filter
      if (propertyTypeFilter !== 'All' && cust.propertyType !== propertyTypeFilter) return false;

      // Search Filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = cust.name.toLowerCase().includes(q);
        const matchMobile = cust.contactNo.includes(q);
        const matchType = (cust.propertyType || '').toLowerCase().includes(q);
        const matchArea = (cust.propertyArea || '').toLowerCase().includes(q);
        const matchAddress = (cust.propertyAddress || '').toLowerCase().includes(q);
        if (!matchName && !matchMobile && !matchType && !matchArea && !matchAddress) {
          return false;
        }
      }

      return true;
    });
  }, [newCustomers, fromDate, toDate, propertyTypeFilter, search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Move to Potential Customer
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">
              {filteredCustomers.length} Active Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Filter new customer records by date range, edit entry details, and send for Admin approval with additional specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-nav-waiting-approval-customer"
            onClick={() => setCurrentPage('customer_waiting_approval')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <span>Waiting for approval Customer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table Card: List of New Customer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Title & Filters Bar (From Date / To Date as per document) */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">List of New Customer</h2>
              <span className="text-xs text-slate-500 font-normal">
                (Document Table Format)
              </span>
            </div>

            {/* Quick search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search customer, phone, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden w-64 bg-white"
              />
            </div>
          </div>

          {/* Filters Bar: From Date, To Date */}
          <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                From Date:
              </span>
              <input
                id="filter-from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-purple-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                To Date:
              </span>
              <input
                id="filter-to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-purple-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Property Type:</span>
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-purple-500 outline-hidden"
              >
                <option value="All">All Types</option>
                <option value="Plot">Plot</option>
                <option value="Flat">Flat</option>
                <option value="Independent House">Independent House</option>
                <option value="Commercial">Commercial</option>
                <option value="Joint Venture">Joint Venture</option>
              </select>
            </div>

            {(fromDate || toDate || propertyTypeFilter !== 'All' || search) && (
              <button
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                  setPropertyTypeFilter('All');
                  setSearch('');
                }}
                className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 underline ml-auto"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Table representation exactly as drawn in Document Page 1 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3 w-48 text-center bg-slate-200/50">Actions</th>
                <th className="py-3 px-4">Date of Entry</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Mobile No</th>
                <th className="py-3 px-4">Property Type</th>
                <th className="py-3 px-4">Property Area</th>
                <th className="py-3 px-4">Property Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No customer records found matching the specified date range and filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                    {/* Action Buttons as drawn in Page 1: Edit Button, Send for approval button */}
                    <td className="py-2.5 px-3 whitespace-nowrap bg-slate-50/50 border-r border-slate-100">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          id={`btn-edit-customer-${cust.id}`}
                          onClick={() => handleOpenEdit(cust)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-md border border-slate-300 shadow-2xs transition flex items-center gap-1"
                          title="Edit Button"
                        >
                          <Edit className="w-3 h-3 text-slate-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          id={`btn-send-approval-${cust.id}`}
                          onClick={() => handleOpenSendForApproval(cust)}
                          className={`px-2.5 py-1 font-semibold text-[11px] rounded-md shadow-2xs transition flex items-center gap-1 ${
                            cust.waitingForApproval
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                          title="Send for approval button"
                        >
                          <Send className="w-3 h-3" />
                          <span>{cust.waitingForApproval ? 'Resend' : 'Send for approval'}</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-2.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {cust.date}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {cust.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 font-mono whitespace-nowrap">
                      {cust.contactNo}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {cust.propertyType || 'Plot'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                      {cust.propertyArea || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate" title={cust.propertyAddress}>
                      {cust.propertyAddress || cust.locality || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIALOG BOX FOR SEND FOR APPROVAL (Document Page 1 & 2 Specification) */}
      {/* "Dialog box for send for approval - we add to had more details - not compulsory" */}
      {approvalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-purple-600" />
                  <span>Dialog box for send for approval</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Core details pre-filled. Optional extra specifications can be added (not compulsory) as per document.
                </p>
              </div>
              <button
                onClick={() => setApprovalTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAndSendForApproval} className="p-6 space-y-4 text-xs">
              {/* Core Details (from Document Page 1 & 2) */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
                  Primary Customer & Property Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mobile No <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={modalMobileNo}
                      onChange={(e) => setModalMobileNo(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Property Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={modalPropertyType}
                      onChange={(e) => setModalPropertyType(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                    >
                      <option value="Plot">Plot</option>
                      <option value="Flat">Flat</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Joint Venture">Joint Venture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Property Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2400 sq ft / 1.5 Ground"
                      value={modalPropertyArea}
                      onChange={(e) => setModalPropertyArea(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Property Address
                  </label>
                  <input
                    type="text"
                    placeholder="Full Address"
                    value={modalPropertyAddress}
                    onChange={(e) => setModalPropertyAddress(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Additional Details according to Document Page 2 - Not Compulsory */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                    Additional Specifications
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                    Not Compulsory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Area of Land <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Ground, 40 x 60 ft"
                      value={modalAreaOfLand}
                      onChange={(e) => setModalAreaOfLand(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Area of Building <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1800 sq ft, G+1"
                      value={modalAreaOfBuilding}
                      onChange={(e) => setModalAreaOfBuilding(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Ownership type <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <select
                      value={modalOwnershipType}
                      onChange={(e) => setModalOwnershipType(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                    >
                      <option value="">Select ownership</option>
                      <option value="Freehold Patta">Freehold Patta</option>
                      <option value="Individual Freehold">Individual Freehold</option>
                      <option value="Joint Ownership">Joint Ownership</option>
                      <option value="Power of Attorney">Power of Attorney</option>
                      <option value="Ancestral">Ancestral</option>
                      <option value="Builder Freehold">Builder Freehold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Food veg or non veg <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <select
                      value={modalFoodPreference}
                      onChange={(e) => setModalFoodPreference(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                    >
                      <option value="">Select preference</option>
                      <option value="Veg">Veg</option>
                      <option value="Non-veg">Non-veg</option>
                      <option value="Veg / Non-veg (Both)">Veg / Non-veg (Both)</option>
                      <option value="Any">Any</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Religion if applicable <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hindu / Muslim / Christian / Any"
                      value={modalReligion}
                      onChange={(e) => setModalReligion(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions - "Save and send for approval button" */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApprovalTarget(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  id="btn-modal-save-and-send-approval"
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save and send for approval button</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL FOR "Edit Button" */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-4 h-4 text-slate-700" />
                <span>Edit Customer Details</span>
              </h3>
              <button
                onClick={() => setEditTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile No</label>
                <input
                  type="tel"
                  required
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  >
                    <option value="Plot">Plot</option>
                    <option value="Flat">Flat</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Joint Venture">Joint Venture</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Area</label>
                  <input
                    type="text"
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Address</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
