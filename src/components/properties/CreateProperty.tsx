import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyItem } from '../../types';
import {
  Home,
  Plus,
  Search,
  MapPin,
  Lock,
  Trash2,
  Edit2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Building,
  User,
  Phone,
  Tag,
  Calendar,
} from 'lucide-react';

export const CreateProperty: React.FC = () => {
  const {
    properties,
    addProperty,
    deleteProperty,
    markPropertyPotential,
    buyerLeads,
    customerLeads,
    currentRole,
    setCurrentPage,
    addToast,
  } = useApp();

  const [showForm, setShowForm] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Form Fields matching Document Page 1:
  // "Add Property For Sale Details"
  // - Property Title *
  // - Property Code
  // - Property Type
  // - Locality / Area
  // - Price / Expected Value
  // - Size (Sq. Ft)
  // - Ground / Plot Dimensions
  // - Listing Status
  // - Owner / Customer Name * ("drop down - form the potential seller list")
  // - Owner Contact Phone
  // - Features (Comma separated)
  // - Address
  const [title, setTitle] = useState('');
  const [propertyCode, setPropertyCode] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyItem['propertyType']>('Plot');
  const [locality, setLocality] = useState('Nanganallur');
  const [address, setAddress] = useState('');
  const [sizeSqFt, setSizeSqFt] = useState<number | string>(2400);
  const [groundArea, setGroundArea] = useState('1 Ground (40 x 60)');
  const [price, setPrice] = useState('2.50 Cr');
  const [status, setStatus] = useState<PropertyItem['status']>('Available');

  // Owner / Customer Name dropdown from potential sellers
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [features, setFeatures] = useState('DTCP Approved, 24ft Road, Clear Patta');

  // List of potential sellers/customers for the dropdown
  const potentialSellers = useMemo(() => {
    const list: { id: string; name: string; contact: string; locality: string; type: string }[] = [];
    buyerLeads.forEach((b) => {
      list.push({
        id: `buyer-${b.id}`,
        name: `${b.name} (${b.isLocked ? 'Approved Seller' : b.isPotential ? 'Potential Seller' : 'Seller'})`,
        contact: b.contactNo,
        locality: b.preferredLocality || 'Chennai',
        type: 'Seller',
      });
    });
    customerLeads.forEach((c) => {
      list.push({
        id: `cust-${c.id}`,
        name: `${c.name} (${c.customerType})`,
        contact: c.contactNo,
        locality: c.locality || c.propertyAddress || 'Chennai',
        type: 'Customer',
      });
    });
    return list;
  }, [buyerLeads, customerLeads]);

  // Handle selecting a seller from dropdown to auto-fill
  const handleSellerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedSellerId(id);
    if (!id || id === 'custom') {
      return;
    }
    const found = potentialSellers.find((s) => s.id === id);
    if (found) {
      // Strip role annotation for clean name
      const cleanName = found.name.split(' (')[0];
      setOwnerName(cleanName);
      setOwnerContact(found.contact);
      if (!address && found.locality) {
        setLocality(found.locality);
        setAddress(`${found.locality}, Chennai`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !ownerName.trim()) {
      addToast('Property Title and Owner Name are required.', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    addProperty({
      date: today,
      title: title.trim(),
      propertyCode: propertyCode.trim() || `PROP-${Date.now().toString().slice(-4)}`,
      propertyType,
      locality: locality.trim() || 'Nanganallur',
      address: address.trim() || `${locality}, Chennai`,
      sizeSqFt: Number(sizeSqFt) || 1200,
      groundArea: groundArea.trim(),
      price: price.trim(),
      ownerName: ownerName.trim(),
      ownerContact: ownerContact.trim(),
      status,
      isPotential: false,
      waitingForApproval: false,
      isApproved: false,
      isLocked: false,
      crmStage: 'Listing',
      features: features.split(',').map((f) => f.trim()).filter(Boolean),
      onlineAdsPostedCount: 0,
      totalSiteVisits: 0,
    });

    addToast(`Property "${title}" registered successfully!`, 'success');

    // Reset form
    setTitle('');
    setPropertyCode('');
    setAddress('');
    setOwnerName('');
    setOwnerContact('');
    setSelectedSellerId('');
  };

  const filtered = properties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.locality.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      p.propertyCode.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'All' || p.propertyType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Property</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              {properties.length} Active Listings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Register new properties for sale, select owners from the potential seller list, and initiate the approval workflow.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-nav-move-potential-prop"
            onClick={() => setCurrentPage('property_move_potential')}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <span>Move to Potential Property</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FORM AS SHOWN IN DOCUMENT PAGE 1: "Add Property For Sale Details" */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Add Property For Sale Details</h2>
              <p className="text-[11px] text-slate-500">Document Specification Format</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            {showForm ? 'Collapse Form' : 'Expand Form'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Grid Row 1: Title, Code, Type, Locality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Property Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20th Street Residential Plot"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Code</label>
                <input
                  type="text"
                  placeholder="e.g. PROP-20ST-01"
                  value={propertyCode}
                  onChange={(e) => setPropertyCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyItem['propertyType'])}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Plot">Plot / Land</option>
                  <option value="Flat">Flat / Apartment</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Joint Venture">Joint Venture (JV)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Locality / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Nanganallur"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Grid Row 2: Price, Size, Ground/Plot Dimensions, Listing Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Price / Expected Value</label>
                <input
                  type="text"
                  placeholder="e.g. 2.50 Cr"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Size (Sq. Ft)</label>
                <input
                  type="number"
                  placeholder="e.g. 2400"
                  value={sizeSqFt}
                  onChange={(e) => setSizeSqFt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ground / Plot Dimensions</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Ground (40 x 60)"
                  value={groundArea}
                  onChange={(e) => setGroundArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Listing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PropertyItem['status'])}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                  <option value="Under Offer">Under Offer</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>

            {/* Grid Row 3: Owner / Customer Name (Dropdown from potential seller list as indicated in Page 1), Owner Contact Phone, Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Document Page 1 Red Circle: "drop down - form the potential seller list" */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Owner / Customer Name <span className="text-rose-500">*</span>
                  <span className="text-[10px] text-purple-600 font-normal ml-1">
                    (Select from Potential Seller List)
                  </span>
                </label>
                <select
                  id="select-owner-seller-dropdown"
                  value={selectedSellerId}
                  onChange={handleSellerSelect}
                  className="w-full px-3 py-2 rounded-lg border border-purple-300 bg-purple-50/40 text-purple-900 font-medium focus:ring-1 focus:ring-purple-500 outline-hidden"
                >
                  <option value="">-- Select from Potential Seller List --</option>
                  {potentialSellers.map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.name} - {seller.contact}
                    </option>
                  ))}
                  <option value="custom">+ Enter Custom / New Landlord Name</option>
                </select>

                <input
                  type="text"
                  placeholder="Owner or Landlord Name"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 mt-1 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Owner Contact Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +91 94444 XXXXX"
                  value={ownerContact}
                  onChange={(e) => setOwnerContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Features (Comma separated)</label>
                <input
                  type="text"
                  placeholder="DTCP Approved, 24ft Road, Clear Patta"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Address */}
            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">Address</label>
              <input
                type="text"
                placeholder="Full Property Street Address & Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Form Actions matching Page 1 */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  setPropertyCode('');
                  setAddress('');
                  setOwnerName('');
                  setOwnerContact('');
                  setSelectedSellerId('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                id="btn-save-property"
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Property</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Property Listings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Active Property Master Inventory</h2>
            <span className="text-xs bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search property, owner, code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-hidden w-56 bg-white"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500 outline-hidden"
            >
              <option value="All">All Types</option>
              <option value="Plot">Plot / Land</option>
              <option value="Flat">Flat</option>
              <option value="Independent House">House</option>
              <option value="Commercial">Commercial</option>
              <option value="Joint Venture">JV</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Property Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Owner / Seller</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Size & Ground</th>
                <th className="py-3 px-4">Locality & Address</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No properties found.
                  </td>
                </tr>
              ) : (
                filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
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
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{prop.ownerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{prop.ownerContact}</div>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-emerald-700 whitespace-nowrap">
                      {prop.price}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                      <div>{prop.sizeSqFt} sq ft</div>
                      <div className="text-[11px] text-slate-400">{prop.groundArea || '—'}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate" title={prop.address}>
                      <div className="font-medium text-slate-800">{prop.locality}</div>
                      <div className="text-[11px] text-slate-400 truncate">{prop.address}</div>
                    </td>
                    <td className="py-2.5 px-4 text-center whitespace-nowrap">
                      {prop.isLocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <Lock className="w-2.5 h-2.5" /> Approved
                        </span>
                      ) : prop.waitingForApproval ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                          Waiting Approval
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          Active Listing
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setCurrentPage('property_move_potential')}
                          className="px-2.5 py-1 text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-md border border-purple-200 transition"
                        >
                          Potential List →
                        </button>
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
