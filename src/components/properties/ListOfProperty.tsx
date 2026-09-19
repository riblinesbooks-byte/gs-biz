import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyItem } from '../../types';
import {
  Home,
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
  Tag,
  Grid,
  List,
  UploadCloud,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { ViewEditModifyModal } from '../modals/ViewEditModifyModal';

export const ListOfProperty: React.FC = () => {
  const {
    properties,
    unlockProperty,
    updateProperty,
    sendBackPropertyForModification,
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
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [inspectProp, setInspectProp] = useState<PropertyItem | null>(null);
  const [modifyingProp, setModifyingProp] = useState<PropertyItem | null>(null);

  // According to Document Page 2:
  // "once approved the property is moved to approval list, then this property can be add in property canva and CRM, and customer is locked (details which can be locked are Name, Mobile No, Date, Property Type, Property Area and Property Address."
  const approvedProperties = useMemo(() => {
    return properties.filter((p) => p.isLocked || p.isApproved);
  }, [properties]);

  const filtered = useMemo(() => {
    return approvedProperties.filter((prop) => {
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
  }, [approvedProperties, fromDate, toDate, propertyTypeFilter, search]);

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      addToast('No approved properties to export', 'warning');
      return;
    }
    const headers = [
      'Date (Locked)',
      'Property Title (Locked)',
      'Property Type (Locked)',
      'Seller Name (Locked)',
      'Seller Contact (Locked)',
      'Property Area (Locked)',
      'Property Address (Locked)',
      'Price',
      'Listing Status',
      'Features',
      'Locked By',
    ];

    const rows = filtered.map((p) => [
      p.date || '2026-08-15',
      `"${p.title}"`,
      p.propertyType,
      `"${p.ownerName}"`,
      `"${p.ownerContact}"`,
      `"${p.groundArea || `${p.sizeSqFt} sq ft`}"`,
      `"${p.address || p.locality}"`,
      `"${p.price}"`,
      p.status,
      `"${p.features?.join(';') || ''}"`,
      p.lockedBy || 'Admin',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `List_of_Approved_Properties_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Approved property list exported to CSV', 'success');
  };

  const handlePhotoUpload = (propId: string) => {
    const defaultPics = [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1524813686514-a57563d77d66?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60',
    ];
    const randomPic = defaultPics[Math.floor(Math.random() * defaultPics.length)];
    updateProperty(propId, { imageUrl: randomPic });
    addToast('Property photo updated successfully', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">List of Property</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
              {approvedProperties.length} Approved & Locked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Master directory of Admin-approved properties. Fully verified and ready for Property Canva (360°) and CRM pipeline execution.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle View Cards / Table */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'cards' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Cards View (Document Mockup)"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            id="btn-export-approved-properties"
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 shadow-2xs transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setCurrentPage('property_canvas')}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-purple-200" />
            <span>Property Canva</span>
          </button>
        </div>
      </div>

      {/* Locked Attributes Notice (Document Page 2 Specification) */}
      <div className="bg-slate-900 text-white rounded-xl p-4.5 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Protected Property Governance Rule (Document Specification)
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Once approved by Admin, the property is moved to this approval list, can be added in property canva and CRM, and core details are permanently locked:
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Approved Property Inventory</h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
            {filtered.length} Properties
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search approved property, seller..."
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
            <option value="Plot">Plot / Land</option>
            <option value="Flat">Flat</option>
            <option value="Independent House">Independent House</option>
            <option value="Commercial">Commercial</option>
            <option value="Joint Venture">Joint Venture</option>
          </select>
        </div>
      </div>

      {/* VIEW MODE: CARDS (Matching Page 2 Screenshot Mockup exactly) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
              No approved properties found.
            </div>
          ) : (
            filtered.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col"
              >
                {/* Card Header: Code, Title, Status */}
                <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span>{prop.propertyCode}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-slate-600 font-semibold">
                        <Lock className="w-2.5 h-2.5 text-rose-500" />
                        {prop.date || '2026-08-15'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 tracking-tight flex items-center gap-1.5">
                      <span>{prop.title}</span>
                      <span title="Locked Title"><Lock className="w-3 h-3 text-rose-500 shrink-0" /></span>
                    </h3>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
                      <span className="truncate">{prop.address || `${prop.locality}, Chennai`}</span>
                      <Lock className="w-2.5 h-2.5 text-rose-500/80 shrink-0" />
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {prop.status}
                  </span>
                </div>

                {/* PHOTO OF PROPERTY (Box matching Document Page 2) */}
                <div className="relative bg-slate-100 h-44 overflow-hidden group">
                  {prop.imageUrl ? (
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-lg m-2 bg-slate-50/80 text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mb-1 text-slate-500">
                        <Home className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">photo of property</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Click upload to attach visual photo</span>
                    </div>
                  )}

                  {/* Upload photo button overlay */}
                  <button
                    onClick={() => handlePhotoUpload(prop.id)}
                    className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-semibold rounded-md backdrop-blur-xs flex items-center gap-1 transition"
                  >
                    <UploadCloud className="w-3 h-3" />
                    <span>Upload Photo</span>
                  </button>

                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-xs rounded-md text-[10px] font-bold text-purple-900 border border-purple-200 flex items-center gap-1 shadow-2xs">
                    <span>{prop.propertyType}</span>
                    <Lock className="w-2.5 h-2.5 text-purple-700" />
                  </div>
                </div>

                {/* Card Specs: Asking Price & Area */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                          Asking Price
                        </span>
                        <span className="text-base font-bold text-emerald-700">{prop.price}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-end gap-0.5">
                          Area <Lock className="w-2.5 h-2.5 text-rose-500" />
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {prop.groundArea || `${prop.sizeSqFt} sq ft`}
                        </span>
                      </div>
                    </div>

                    {/* Features pills */}
                    <div className="pt-2 flex flex-wrap gap-1">
                      {prop.features?.slice(0, 3).map((f, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Owner / Seller info */}
                    <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                      <div className="truncate">
                        <span className="text-slate-400 text-[10px] block flex items-center gap-0.5">
                          Owner / Seller <Lock className="w-2.5 h-2.5 text-rose-500" />
                        </span>
                        <span className="font-bold text-slate-900 truncate block">{prop.ownerName}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-slate-400 text-[10px] block flex items-center justify-end gap-0.5">
                          Mobile <Lock className="w-2.5 h-2.5 text-rose-500" />
                        </span>
                        <span className="font-mono font-medium text-slate-700">{prop.ownerContact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Page 2: "then this property can be add in property canva and CRM" */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <button
                      id={`btn-prop-card-mod-${prop.id}`}
                      disabled={isStaff}
                      onClick={() => {
                        if (isStaff) {
                          addToast('Staff login cannot edit or modify approved property records. Admin access required.', 'warning');
                          return;
                        }
                        setModifyingProp(prop);
                      }}
                      className={`w-full py-1.5 px-3 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 ${
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

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setCurrentPage('property_canvas');
                            addToast(`Matched ${prop.title} in Property Canvas`, 'info');
                          }}
                          className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[11px] rounded-lg border border-purple-200 flex items-center gap-1 transition"
                          title="Add in Property Canva (360° Match)"
                        >
                          <Layers className="w-3 h-3" />
                          <span>Property Canva</span>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentPage('reports_crm_property');
                            addToast(`Viewing ${prop.title} in Property CRM pipeline`, 'info');
                          }}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] rounded-lg border border-blue-200 flex items-center gap-1 transition"
                          title="Open in CRM Pipeline"
                        >
                          <Kanban className="w-3 h-3" />
                          <span>CRM</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setInspectProp(prop)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition"
                        title="Inspect Specifications"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW MODE: TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4 text-indigo-900">Action</th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-rose-500" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-rose-500" />
                      <span>Property Title</span>
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-rose-500" />
                      <span>Property Type</span>
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-rose-500" />
                      <span>Seller Name</span>
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-rose-500" />
                      <span>Mobile No</span>
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-rose-500" />
                      <span>Property Area</span>
                    </div>
                  </th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-rose-500" />
                      <span>Property Address</span>
                    </div>
                  </th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-center">Pipeline Integrations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        id={`btn-prop-table-mod-${prop.id}`}
                        disabled={isStaff}
                        onClick={() => {
                          if (isStaff) {
                            addToast('Staff login cannot edit or modify approved property records. Admin access required.', 'warning');
                            return;
                          }
                          setModifyingProp(prop);
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
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        {prop.date || '2026-08-15'}
                        <Lock className="w-2.5 h-2.5 text-rose-500/80" />
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>{prop.title}</span>
                        <Lock className="w-3 h-3 text-rose-500" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">{prop.propertyCode}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                        {prop.propertyType}
                        <Lock className="w-2.5 h-2.5 text-purple-700" />
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>{prop.ownerName}</span>
                        <Lock className="w-2.5 h-2.5 text-rose-500" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        {prop.ownerContact}
                        <Lock className="w-2.5 h-2.5 text-rose-500" />
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        {prop.groundArea || `${prop.sizeSqFt} sq ft`}
                        <Lock className="w-2.5 h-2.5 text-rose-500" />
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={prop.address}>
                      <span className="inline-flex items-center gap-1">
                        <span className="truncate">{prop.address || `${prop.locality}, Chennai`}</span>
                        <Lock className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap">
                      {prop.price}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setCurrentPage('property_canvas');
                            addToast(`Opened Canvas for ${prop.title}`, 'info');
                          }}
                          className="px-2 py-1 text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-md border border-purple-200 flex items-center gap-1"
                        >
                          <Layers className="w-3 h-3" />
                          <span>Canva</span>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentPage('reports_crm_property');
                            addToast(`Opened CRM for ${prop.title}`, 'info');
                          }}
                          className="px-2 py-1 text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-md border border-blue-200 flex items-center gap-1"
                        >
                          <Kanban className="w-3 h-3" />
                          <span>CRM</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECTION MODAL */}
      {inspectProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Approved Property Profile</h3>
              </div>
              <button
                onClick={() => setInspectProp(null)}
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
                    <strong className="text-slate-900 font-bold">{inspectProp.title}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Mobile No 🔒:</span>
                    <strong className="text-slate-900 font-mono">{inspectProp.ownerContact}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Date 🔒:</span>
                    <strong className="text-slate-800">{inspectProp.date || '2026-08-15'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Type 🔒:</span>
                    <strong className="text-purple-700">{inspectProp.propertyType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Area 🔒:</span>
                    <strong className="text-slate-800">{inspectProp.groundArea || `${inspectProp.sizeSqFt} sq ft`}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Property Address 🔒:</span>
                    <strong className="text-slate-800">{inspectProp.address || inspectProp.locality}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInspectProp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setInspectProp(null);
                      setCurrentPage('property_canvas');
                    }}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Match in Canva</span>
                  </button>

                  <button
                    onClick={() => {
                      setInspectProp(null);
                      setCurrentPage('reports_crm_property');
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
        isOpen={!!modifyingProp}
        onClose={() => setModifyingProp(null)}
        entityType="property"
        record={modifyingProp}
        onSaveEdit={(updates) => {
          if (modifyingProp) {
            updateProperty(modifyingProp.id, updates);
            addToast('Property updated successfully', 'success');
          }
        }}
        onSendModification={(reason) => {
          if (modifyingProp) {
            sendBackPropertyForModification(modifyingProp.id, reason);
            addToast('Property sent back to Waiting for Modification', 'info');
          }
        }}
      />
    </div>
  );
};
