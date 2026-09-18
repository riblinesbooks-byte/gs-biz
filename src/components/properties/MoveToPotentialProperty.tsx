import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyItem } from '../../types';
import {
  Home,
  Search,
  Calendar,
  Send,
  Edit,
  X,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Building,
  MapPin,
  Phone,
  Tag,
} from 'lucide-react';

export const MoveToPotentialProperty: React.FC = () => {
  const {
    properties,
    sendPropertyForApproval,
    updateProperty,
    currentRole,
    setCurrentPage,
  } = useApp();

  const [search, setSearch] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modal State for "Send for approval" Dialog Box (Page 1 & Page 2 of document)
  const [approvalTarget, setApprovalTarget] = useState<PropertyItem | null>(null);

  // Dialog box fields matching Page 2 of Document:
  // - Property Title *
  // - Property Code
  // - Property Type
  // - Locality / Area
  // - Price / Expected Value
  // - Size (Sq. Ft)
  // - Ground / Plot Dimensions
  // - Listing Status
  // - Owner / Customer Name *
  // - Owner Contact Phone
  // - Features
  // - Address
  // Button: "approval button" (Send for approval)
  const [modalTitle, setModalTitle] = useState('');
  const [modalPropertyCode, setModalPropertyCode] = useState('');
  const [modalPropertyType, setModalPropertyType] = useState<PropertyItem['propertyType']>('Plot');
  const [modalLocality, setModalLocality] = useState('');
  const [modalPrice, setModalPrice] = useState('');
  const [modalSizeSqFt, setModalSizeSqFt] = useState<number | string>(2400);
  const [modalGroundArea, setModalGroundArea] = useState('');
  const [modalStatus, setModalStatus] = useState<PropertyItem['status']>('Available');
  const [modalOwnerName, setModalOwnerName] = useState('');
  const [modalOwnerContact, setModalOwnerContact] = useState('');
  const [modalFeatures, setModalFeatures] = useState('');
  const [modalAddress, setModalAddress] = useState('');

  // Modal State for "Edit Button"
  const [editTarget, setEditTarget] = useState<PropertyItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<PropertyItem['propertyType']>('Plot');
  const [editOwner, setEditOwner] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editAddress, setEditAddress] = useState('');

  // Open "Send for approval" Dialog Box
  const handleOpenSendForApproval = (prop: PropertyItem) => {
    setApprovalTarget(prop);
    setModalTitle(prop.title);
    setModalPropertyCode(prop.propertyCode);
    setModalPropertyType(prop.propertyType);
    setModalLocality(prop.locality);
    setModalPrice(prop.price);
    setModalSizeSqFt(prop.sizeSqFt);
    setModalGroundArea(prop.groundArea || '');
    setModalStatus(prop.status);
    setModalOwnerName(prop.ownerName);
    setModalOwnerContact(prop.ownerContact);
    setModalFeatures(prop.features ? prop.features.join(', ') : '');
    setModalAddress(prop.address);
  };

  const handleSaveAndSendForApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalTarget) return;

    sendPropertyForApproval(approvalTarget.id, {
      title: modalTitle.trim(),
      propertyCode: modalPropertyCode.trim(),
      propertyType: modalPropertyType,
      locality: modalLocality.trim(),
      price: modalPrice.trim(),
      sizeSqFt: Number(modalSizeSqFt) || approvalTarget.sizeSqFt,
      groundArea: modalGroundArea.trim(),
      status: modalStatus,
      ownerName: modalOwnerName.trim(),
      ownerContact: modalOwnerContact.trim(),
      features: modalFeatures.split(',').map((f) => f.trim()).filter(Boolean),
      address: modalAddress.trim(),
    });

    setApprovalTarget(null);
  };

  // Open "Edit Button" Modal
  const handleOpenEdit = (prop: PropertyItem) => {
    setEditTarget(prop);
    setEditTitle(prop.title);
    setEditType(prop.propertyType);
    setEditOwner(prop.ownerName);
    setEditContact(prop.ownerContact);
    setEditPrice(prop.price);
    setEditArea(prop.groundArea || `${prop.sizeSqFt} sq ft`);
    setEditAddress(prop.address);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    updateProperty(editTarget.id, {
      title: editTitle.trim(),
      propertyType: editType,
      ownerName: editOwner.trim(),
      ownerContact: editContact.trim(),
      price: editPrice.trim(),
      groundArea: editArea.trim(),
      address: editAddress.trim(),
    });

    setEditTarget(null);
  };

  // Only show properties that are not yet approved & locked
  const newProperties = useMemo(() => {
    return properties.filter((p) => !p.isLocked);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return newProperties.filter((prop) => {
      const propDate = prop.date || '2026-08-15';
      if (fromDate && propDate < fromDate) return false;
      if (toDate && propDate > toDate) return false;

      if (propertyTypeFilter !== 'All' && prop.propertyType !== propertyTypeFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(q);
        const matchOwner = prop.ownerName.toLowerCase().includes(q);
        const matchContact = prop.ownerContact.includes(q);
        const matchAddress = prop.address.toLowerCase().includes(q);
        const matchLocality = prop.locality.toLowerCase().includes(q);
        if (!matchTitle && !matchOwner && !matchContact && !matchAddress && !matchLocality) {
          return false;
        }
      }

      return true;
    });
  }, [newProperties, fromDate, toDate, propertyTypeFilter, search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Move to Potential Property
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">
              {filteredProperties.length} Inventory Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Filter properties by date range, edit specifications, and send for Admin approval with the full property specification dialog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-nav-waiting-approval-property"
            onClick={() => setCurrentPage('property_waiting_approval')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <span>Waiting for approval Property</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table Card: In "Move to Potential Property" (Document Page 1) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Title & Filters Bar */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Move to Potential Property Register
              </h2>
              <span className="text-xs text-slate-500 font-normal">
                (Document Page 1 Format)
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search property, seller, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden w-64 bg-white"
              />
            </div>
          </div>

          {/* Filters Bar: From Date, To Date, Property Type */}
          <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                From Date:
              </span>
              <input
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
                <option value="Plot">Plot / Land</option>
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

        {/* Table representation exactly as drawn in Document Page 1:
            Columns: Actions (Edit Button, Send for approval button) | Date | Property Title | Property Type | Seller Name | Property Area | Property Address */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3 w-48 text-center bg-slate-200/50">Actions</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Property Title</th>
                <th className="py-3 px-4">Property Type</th>
                <th className="py-3 px-4">Seller Name</th>
                <th className="py-3 px-4">Property Area</th>
                <th className="py-3 px-4">Property Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No property records found matching the specified filters.
                  </td>
                </tr>
              ) : (
                filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/80 transition">
                    {/* Actions Column as drawn in Page 1: Edit Button, Send for approval button */}
                    <td className="py-2.5 px-3 whitespace-nowrap bg-slate-50/50 border-r border-slate-100">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          id={`btn-edit-prop-${prop.id}`}
                          onClick={() => handleOpenEdit(prop)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-md border border-slate-300 shadow-2xs transition flex items-center gap-1"
                          title="Edit Button"
                        >
                          <Edit className="w-3 h-3 text-slate-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          id={`btn-send-approval-prop-${prop.id}`}
                          onClick={() => handleOpenSendForApproval(prop)}
                          className={`px-2.5 py-1 font-semibold text-[11px] rounded-md shadow-2xs transition flex items-center gap-1 ${
                            prop.waitingForApproval
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                          title="Send for approval approval"
                        >
                          <Send className="w-3 h-3" />
                          <span>{prop.waitingForApproval ? 'Resend' : 'Send for approval'}</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-2.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {prop.date || '2026-08-15'}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div>{prop.title}</div>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">{prop.propertyCode}</span>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {prop.propertyType}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      <div>{prop.ownerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">{prop.ownerContact}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                      <div>{prop.groundArea || `${prop.sizeSqFt} sq ft`}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate" title={prop.address}>
                      {prop.address || `${prop.locality}, Chennai`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIALOG BOX FOR SEND FOR APPROVAL (Document Page 1 & Page 2 Specification) */}
      {/* "when we click - send for approval - Dialog box for send for approval -" */}
      {approvalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Dialog box for send for approval
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Review and confirm property specifications before submitting for Admin approval
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApprovalTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form exactly matching Page 2 fields */}
            <form onSubmit={handleSaveAndSendForApproval} className="p-6 space-y-4 text-xs">
              {/* Row 1: Title, Code, Type, Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Property Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Code</label>
                  <input
                    type="text"
                    value={modalPropertyCode}
                    onChange={(e) => setModalPropertyCode(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={modalPropertyType}
                    onChange={(e) => setModalPropertyType(e.target.value as PropertyItem['propertyType'])}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  >
                    <option value="Plot">Plot / Land</option>
                    <option value="Flat">Flat</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Joint Venture">Joint Venture</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Locality / Area</label>
                  <input
                    type="text"
                    required
                    value={modalLocality}
                    onChange={(e) => setModalLocality(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Price, Size, Ground Dimensions, Listing Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price / Expected Value</label>
                  <input
                    type="text"
                    required
                    value={modalPrice}
                    onChange={(e) => setModalPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Size (Sq. Ft)</label>
                  <input
                    type="number"
                    value={modalSizeSqFt}
                    onChange={(e) => setModalSizeSqFt(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ground / Plot Dimensions</label>
                  <input
                    type="text"
                    value={modalGroundArea}
                    onChange={(e) => setModalGroundArea(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Listing Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as PropertyItem['status'])}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Owner Name, Owner Contact, Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Owner / Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalOwnerName}
                    onChange={(e) => setModalOwnerName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Owner Contact Phone</label>
                  <input
                    type="text"
                    value={modalOwnerContact}
                    onChange={(e) => setModalOwnerContact(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Features (Comma separated)</label>
                  <input
                    type="text"
                    value={modalFeatures}
                    onChange={(e) => setModalFeatures(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={modalAddress}
                  onChange={(e) => setModalAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                />
              </div>

              {/* Bottom Action: "approval button" circled in Page 2 */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApprovalTarget(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  id="btn-modal-property-approval-button"
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 border-2 border-blue-400"
                  title="approval button"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send for Approval</span>
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
                <span>Edit Property Details</span>
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
                <label className="block font-semibold text-slate-700 mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as PropertyItem['propertyType'])}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden bg-white"
                  >
                    <option value="Plot">Plot / Land</option>
                    <option value="Flat">Flat</option>
                    <option value="Independent House">House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Joint Venture">JV</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price</label>
                  <input
                    type="text"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Seller Name</label>
                  <input
                    type="text"
                    required
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Seller Contact</label>
                  <input
                    type="text"
                    value={editContact}
                    onChange={(e) => setEditContact(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 outline-hidden"
                  />
                </div>
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
