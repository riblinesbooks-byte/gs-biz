import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  AlertCircle,
  Building,
  Users,
  Search,
  CheckCircle,
  Clock,
  Printer,
  Calendar,
  Filter,
  ShieldCheck,
  Send,
  Eye,
  Edit3,
  ExternalLink,
  Lock,
  Download,
} from 'lucide-react';
import { BuyerLead, PropertyItem, CustomerLead } from '../../types';
import { ViewEditModifyModal } from '../modals/ViewEditModifyModal';

interface MReportsHubProps {
  initialTab?: 'all' | 'sellers' | 'properties' | 'customers';
}

export const MReportsHub: React.FC<MReportsHubProps> = ({ initialTab = 'all' }) => {
  const {
    buyerLeads,
    properties,
    customerLeads,
    setCurrentPage,
    approveAndLockBuyer,
    approveAndLockProperty,
    approveAndLockCustomer,
    updateBuyerLead,
    updateProperty,
    updateCustomerLead,
    sendBackBuyerForModification,
    sendBackPropertyForModification,
    sendBackCustomerForModification,
    currentRole,
    currentUser,
    addToast,
  } = useApp();

  const isStaff = currentUser?.role === 'staff' || currentRole === 'staff';

  const [activeTab, setActiveTab] = useState<'all' | 'sellers' | 'properties' | 'customers'>(initialTab);
  const [viewFilter, setViewFilter] = useState<'approved' | 'modification'>('approved');
  const [search, setSearch] = useState('');

  // Modal state for View & Edit & Modify
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntityType, setModalEntityType] = useState<'seller' | 'property' | 'customer'>('seller');
  const [modalRecord, setModalRecord] = useState<BuyerLead | PropertyItem | CustomerLead | null>(null);

  const openViewEditModify = (
    type: 'seller' | 'property' | 'customer',
    item: BuyerLead | PropertyItem | CustomerLead
  ) => {
    if (isStaff && viewFilter === 'approved') {
      addToast('Staff login cannot edit or modify approved records. Admin access required.', 'warning');
      return;
    }
    setModalEntityType(type);
    setModalRecord(item);
    setModalOpen(true);
  };

  // Already Approved records
  const approvedSellers = buyerLeads.filter((b) => b.isLocked || b.potentialApproved);
  const approvedProps = properties.filter((p) => p.isLocked || p.isApproved);
  const approvedCusts = customerLeads.filter((c) => c.isLocked || c.isApproved);
  const totalApprovedCount = approvedSellers.length + approvedProps.length + approvedCusts.length;

  // Records waiting for modification
  const modSellers = buyerLeads.filter((b) => b.waitingForModification);
  const modProps = properties.filter((p) => p.waitingForModification);
  const modCusts = customerLeads.filter((c) => c.waitingForModification);
  const totalModCount = modSellers.length + modProps.length + modCusts.length;

  // Active counts based on viewFilter
  const displaySellers = viewFilter === 'approved' ? approvedSellers : modSellers;
  const displayProps = viewFilter === 'approved' ? approvedProps : modProps;
  const displayCusts = viewFilter === 'approved' ? approvedCusts : modCusts;
  const displayTotal = displaySellers.length + displayProps.length + displayCusts.length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              M Reports (Approved Master Records &amp; Modification Tracking)
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {totalApprovedCount} Approved Records
            </span>
            {totalModCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 font-bold border border-rose-200 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                {totalModCount} In Modification
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized management hub where administration can review, edit, and modify all verified seller, property, and customer records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Filter: All Approved vs In Modification */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewFilter('approved')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 ${
                viewFilter === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>All Approved ({totalApprovedCount})</span>
            </button>
            <button
              onClick={() => setViewFilter('modification')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 ${
                viewFilter === 'modification'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>In Modification ({totalModCount})</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('all')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${activeTab === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
              {viewFilter === 'approved' ? 'Total Approved Records' : 'Total In Modification'}
            </span>
            <FileText className={`w-4 h-4 ${activeTab === 'all' ? 'text-emerald-400' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-black mt-2">{displayTotal}</div>
          <div className={`text-[11px] mt-1 ${activeTab === 'all' ? 'text-slate-400' : 'text-slate-500'}`}>
            Across Seller, Property &amp; Customer
          </div>
        </div>

        <div
          onClick={() => setActiveTab('sellers')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activeTab === 'sellers'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${activeTab === 'sellers' ? 'text-indigo-200' : 'text-slate-500'}`}>
              {viewFilter === 'approved' ? 'Approved Sellers' : 'Seller Modifications'}
            </span>
            <Users className={`w-4 h-4 ${activeTab === 'sellers' ? 'text-indigo-300' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-black mt-2">{displaySellers.length}</div>
          <div className={`text-[11px] mt-1 ${activeTab === 'sellers' ? 'text-indigo-200' : 'text-slate-500'}`}>
            Under Seller Details Menu
          </div>
        </div>

        <div
          onClick={() => setActiveTab('properties')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activeTab === 'properties'
              ? 'bg-amber-900 text-white border-amber-900 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${activeTab === 'properties' ? 'text-amber-200' : 'text-slate-500'}`}>
              {viewFilter === 'approved' ? 'Approved Properties' : 'Property Modifications'}
            </span>
            <Building className={`w-4 h-4 ${activeTab === 'properties' ? 'text-amber-300' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-black mt-2">{displayProps.length}</div>
          <div className={`text-[11px] mt-1 ${activeTab === 'properties' ? 'text-amber-200' : 'text-slate-500'}`}>
            Under Property Details Menu
          </div>
        </div>

        <div
          onClick={() => setActiveTab('customers')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activeTab === 'customers'
              ? 'bg-blue-900 text-white border-blue-900 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${activeTab === 'customers' ? 'text-blue-200' : 'text-slate-500'}`}>
              {viewFilter === 'approved' ? 'Approved Customers' : 'Customer Modifications'}
            </span>
            <Users className={`w-4 h-4 ${activeTab === 'customers' ? 'text-blue-300' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-black mt-2">{displayCusts.length}</div>
          <div className={`text-[11px] mt-1 ${activeTab === 'customers' ? 'text-blue-200' : 'text-slate-500'}`}>
            Under Customer Details Menu
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Reports ({displayTotal})
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'sellers'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            List of Sellers ({displaySellers.length})
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'properties'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            List of Property ({displayProps.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'customers'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            List of Customer ({displayCusts.length})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search report items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500/20"
          />
        </div>
      </div>

      {/* SECTION 1: SELLERS LIST */}
      {(activeTab === 'all' || activeTab === 'sellers') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                {viewFilter === 'approved' ? 'Approved Seller Records' : 'Sellers Sent for Modification'}
              </h2>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                viewFilter === 'approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {displaySellers.length} Records
              </span>
            </div>
            <button
              onClick={() => setCurrentPage(viewFilter === 'approved' ? 'buyer_list' : 'buyer_waiting_modification')}
              className="text-xs text-indigo-700 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <span>{viewFilter === 'approved' ? 'Open Seller Details Menu' : 'Open Staff Modification View'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-2.5 px-4 text-indigo-900">Action</th>
                    <th className="py-2.5 px-4">Date 🔒</th>
                    <th className="py-2.5 px-4">Seller Name &amp; Contact 🔒</th>
                    <th className="py-2.5 px-4">Property Specs 🔒</th>
                    <th className="py-2.5 px-4">Address 🔒</th>
                    <th className="py-2.5 px-4">Status</th>
                    {viewFilter === 'modification' && <th className="py-2.5 px-4">Admin Instructions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displaySellers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No seller records found.
                      </td>
                    </tr>
                  ) : (
                    displaySellers
                      .filter(
                        (b) =>
                          !search ||
                          b.name.toLowerCase().includes(search.toLowerCase()) ||
                          b.contactNo.includes(search) ||
                          (b.propertyAddress && b.propertyAddress.toLowerCase().includes(search.toLowerCase())) ||
                          (b.modificationReason && b.modificationReason.toLowerCase().includes(search.toLowerCase()))
                      )
                      .map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                          {/* Action button: View & Edit & Modify */}
                          <td className="py-2.5 px-4 whitespace-nowrap">
                            <button
                              id={`mreport-seller-btn-${lead.id}`}
                              disabled={isStaff && viewFilter === 'approved'}
                              onClick={() => openViewEditModify('seller', lead)}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                                isStaff && viewFilter === 'approved'
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60 shadow-none'
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border border-indigo-200 shadow-2xs cursor-pointer'
                              }`}
                              title={
                                isStaff && viewFilter === 'approved'
                                  ? 'Staff login cannot edit or modify approved records (Admin access required)'
                                  : 'View, Edit, or Send for Modification'
                              }
                            >
                              <Edit3 className={`w-3.5 h-3.5 ${isStaff && viewFilter === 'approved' ? 'text-slate-400' : 'text-indigo-600'}`} />
                              <span>View &amp; Edit &amp; Modify</span>
                            </button>
                          </td>

                          <td className="py-2.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                            <div className="flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{lead.date}</span>
                            </div>
                          </td>

                          <td className="py-2.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{lead.name}</span>
                            </div>
                            <div className="text-slate-500 font-mono text-[11px]">{lead.contactNo}</div>
                          </td>

                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                              {lead.propertyType}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {lead.propertyArea || 'Standard'}
                            </div>
                          </td>

                          <td className="py-2.5 px-4 max-w-xs truncate text-slate-600" title={lead.propertyAddress || lead.preferredLocality}>
                            {lead.propertyAddress || lead.preferredLocality || 'Chennai'}
                          </td>

                          <td className="py-2.5 px-4 whitespace-nowrap">
                            {lead.waitingForModification ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                In Modification
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Approved &amp; Locked
                              </span>
                            )}
                          </td>

                          {viewFilter === 'modification' && (
                            <td className="py-2.5 px-4 max-w-sm">
                              <div className="bg-rose-50 border border-rose-100 text-rose-900 rounded p-2 text-xs">
                                {lead.modificationReason || 'Verification needed.'}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PROPERTIES LIST */}
      {(activeTab === 'all' || activeTab === 'properties') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                {viewFilter === 'approved' ? 'Approved Property Records' : 'Properties Sent for Modification'}
              </h2>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                viewFilter === 'approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {displayProps.length} Records
              </span>
            </div>
            <button
              onClick={() => setCurrentPage(viewFilter === 'approved' ? 'property_list' : 'property_waiting_modification')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <span>{viewFilter === 'approved' ? 'Open Property Details Menu' : 'Open Staff Modification View'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-2.5 px-4 text-indigo-900">Action</th>
                    <th className="py-2.5 px-4">Code</th>
                    <th className="py-2.5 px-4">Property Title 🔒</th>
                    <th className="py-2.5 px-4">Owner &amp; Contact 🔒</th>
                    <th className="py-2.5 px-4">Specs &amp; Locality 🔒</th>
                    <th className="py-2.5 px-4">Price</th>
                    <th className="py-2.5 px-4">Status</th>
                    {viewFilter === 'modification' && <th className="py-2.5 px-4">Admin Instructions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayProps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No property records found.
                      </td>
                    </tr>
                  ) : (
                    displayProps
                      .filter(
                        (p) =>
                          !search ||
                          p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.locality.toLowerCase().includes(search.toLowerCase()) ||
                          p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
                          (p.modificationReason && p.modificationReason.toLowerCase().includes(search.toLowerCase()))
                      )
                      .map((prop) => (
                        <tr key={prop.id} className="hover:bg-slate-50/80 transition">
                          {/* Action button: View & Edit & Modify */}
                          <td className="py-2.5 px-4 whitespace-nowrap">
                            <button
                              id={`mreport-prop-btn-${prop.id}`}
                              disabled={isStaff && viewFilter === 'approved'}
                              onClick={() => openViewEditModify('property', prop)}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                                isStaff && viewFilter === 'approved'
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60 shadow-none'
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border border-indigo-200 shadow-2xs cursor-pointer'
                              }`}
                              title={
                                isStaff && viewFilter === 'approved'
                                  ? 'Staff login cannot edit or modify approved records (Admin access required)'
                                  : 'View, Edit, or Send for Modification'
                              }
                            >
                              <Edit3 className={`w-3.5 h-3.5 ${isStaff && viewFilter === 'approved' ? 'text-slate-400' : 'text-indigo-600'}`} />
                              <span>View &amp; Edit &amp; Modify</span>
                            </button>
                          </td>

                          <td className="py-2.5 px-4 whitespace-nowrap font-mono text-slate-700 font-bold">
                            {prop.propertyCode}
                          </td>

                          <td className="py-2.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{prop.title}</span>
                            </div>
                            <div className="text-slate-400 text-[11px] font-mono">{prop.date}</div>
                          </td>

                          <td className="py-2.5 px-4">
                            <div className="font-semibold text-slate-800">{prop.ownerName}</div>
                            <div className="text-slate-500 font-mono text-[11px]">{prop.ownerContact}</div>
                          </td>

                          <td className="py-2.5 px-4">
                            <div className="font-semibold text-slate-800">{prop.propertyType} • {prop.sizeSqFt} sq ft</div>
                            <div className="text-[11px] text-slate-500">{prop.locality}</div>
                          </td>

                          <td className="py-2.5 px-4 whitespace-nowrap font-bold text-emerald-700">
                            {prop.price}
                          </td>

                          <td className="py-2.5 px-4 whitespace-nowrap">
                            {prop.waitingForModification ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                In Modification
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Approved &amp; Locked
                              </span>
                            )}
                          </td>

                          {viewFilter === 'modification' && (
                            <td className="py-2.5 px-4 max-w-sm">
                              <div className="bg-amber-50 border border-amber-100 text-amber-900 rounded p-2 text-xs">
                                {prop.modificationReason || 'Verification needed.'}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CUSTOMERS LIST */}
      {(activeTab === 'all' || activeTab === 'customers') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                {viewFilter === 'approved' ? 'Approved Customer Records' : 'Customers Sent for Modification'}
              </h2>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                viewFilter === 'approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {displayCusts.length} Records
              </span>
            </div>
            <button
              onClick={() => setCurrentPage(viewFilter === 'approved' ? 'customer_list' : 'customer_waiting_modification')}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>{viewFilter === 'approved' ? 'Open Customer Details Menu' : 'Open Staff Modification View'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-2.5 px-4 text-indigo-900">Action</th>
                    <th className="py-2.5 px-4">Date 🔒</th>
                    <th className="py-2.5 px-4">Customer Name &amp; Contact 🔒</th>
                    <th className="py-2.5 px-4">Property Specs 🔒</th>
                    <th className="py-2.5 px-4">Customer Type</th>
                    <th className="py-2.5 px-4">Status</th>
                    {viewFilter === 'modification' && <th className="py-2.5 px-4">Admin Instructions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayCusts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No customer records found.
                      </td>
                    </tr>
                  ) : (
                    displayCusts
                      .filter(
                        (c) =>
                          !search ||
                          c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.contactNo.includes(search) ||
                          (c.propertyAddress && c.propertyAddress.toLowerCase().includes(search.toLowerCase())) ||
                          (c.modificationReason && c.modificationReason.toLowerCase().includes(search.toLowerCase()))
                      )
                      .map((cust) => (
                        <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                          {/* Action button: View & Edit & Modify */}
                          <td className="py-2.5 px-4 whitespace-nowrap">
                            <button
                              id={`mreport-cust-btn-${cust.id}`}
                              disabled={isStaff && viewFilter === 'approved'}
                              onClick={() => openViewEditModify('customer', cust)}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                                isStaff && viewFilter === 'approved'
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60 shadow-none'
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border border-indigo-200 shadow-2xs cursor-pointer'
                              }`}
                              title={
                                isStaff && viewFilter === 'approved'
                                  ? 'Staff login cannot edit or modify approved records (Admin access required)'
                                  : 'View, Edit, or Send for Modification'
                              }
                            >
                              <Edit3 className={`w-3.5 h-3.5 ${isStaff && viewFilter === 'approved' ? 'text-slate-400' : 'text-indigo-600'}`} />
                              <span>View &amp; Edit &amp; Modify</span>
                            </button>
                          </td>

                          <td className="py-2.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                            <div className="flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{cust.date}</span>
                            </div>
                          </td>

                          <td className="py-2.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{cust.name}</span>
                            </div>
                            <div className="text-slate-500 font-mono text-[11px]">{cust.contactNo}</div>
                          </td>

                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                              {cust.propertyType || 'Plot'}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {cust.propertyArea || 'Standard'} • {cust.propertyAddress || 'Chennai'}
                            </div>
                          </td>

                          <td className="py-2.5 px-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-800">{cust.customerType}</span>
                          </td>

                          <td className="py-2.5 px-4 whitespace-nowrap">
                            {cust.waitingForModification ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                In Modification
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Approved &amp; Locked
                              </span>
                            )}
                          </td>

                          {viewFilter === 'modification' && (
                            <td className="py-2.5 px-4 max-w-sm">
                              <div className="bg-blue-50 border border-blue-100 text-blue-900 rounded p-2 text-xs">
                                {cust.modificationReason || 'Verification needed.'}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Shared View, Edit & Modify Modal */}
      <ViewEditModifyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        entityType={modalEntityType}
        record={modalRecord}
        onSaveEdit={(updates) => {
          if (modalRecord) {
            if (modalEntityType === 'seller') {
              updateBuyerLead(modalRecord.id, updates);
              addToast('Seller record updated', 'success');
            } else if (modalEntityType === 'property') {
              updateProperty(modalRecord.id, updates);
              addToast('Property record updated', 'success');
            } else if (modalEntityType === 'customer') {
              updateCustomerLead(modalRecord.id, updates);
              addToast('Customer record updated', 'success');
            }
          }
        }}
        onSendModification={(reason) => {
          if (modalRecord) {
            if (modalEntityType === 'seller') {
              sendBackBuyerForModification(modalRecord.id, reason);
              addToast('Seller sent for staff modification', 'info');
            } else if (modalEntityType === 'property') {
              sendBackPropertyForModification(modalRecord.id, reason);
              addToast('Property sent for staff modification', 'info');
            } else if (modalEntityType === 'customer') {
              sendBackCustomerForModification(modalRecord.id, reason);
              addToast('Customer sent for staff modification', 'info');
            }
          }
        }}
      />
    </div>
  );
};
