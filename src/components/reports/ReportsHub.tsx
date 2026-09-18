import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { WeeklyAdItem } from '../../types';
import {
  FileText,
  BarChart3,
  Download,
  Filter,
  Calendar,
  Users,
  Home,
  Building,
  CheckCircle2,
  TrendingUp,
  Megaphone,
  Printer,
  Search,
  Layers,
} from 'lucide-react';

export const ReportsHub: React.FC = () => {
  const {
    buyerLeads,
    properties,
    customerLeads,
    activityLogs,
    activityMasters,
    weeklyAds,
    currentPage,
    setCurrentPage,
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<
    | 'buyer_list'
    | 'customer_leads'
    | 'property_list'
    | 'crm_buyer'
    | 'crm_property'
    | 'crm_customer'
    | 'activities_filter'
    | 'enquiry_stats'
    | 'weekly_ads'
  >('buyer_list');

  useEffect(() => {
    if (currentPage === 'reports_buyers') setActiveReportTab('buyer_list');
    else if (currentPage === 'reports_leads') setActiveReportTab('customer_leads');
    else if (currentPage === 'reports_properties') setActiveReportTab('property_list');
    else if (currentPage === 'reports_crm_buyer') setActiveReportTab('crm_buyer');
    else if (currentPage === 'reports_crm_property') setActiveReportTab('crm_property');
    else if (currentPage === 'reports_crm_customer') setActiveReportTab('crm_customer');
    else if (currentPage === 'reports_activities_filter') setActiveReportTab('activities_filter');
    else if (currentPage === 'reports_enquiry_stats') setActiveReportTab('enquiry_stats');
    else if (currentPage === 'reports_ads') setActiveReportTab('weekly_ads');
  }, [currentPage]);

  // Activity filter states
  const [selectedStaff, setSelectedStaff] = useState('All');
  const [selectedActivityType, setSelectedActivityType] = useState('All');
  const [dateRange, setDateRange] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Export CSV Helper
  const exportTableToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const val = row[header] ?? '';
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered Activities
  const filteredActivities = activityLogs.filter((log) => {
    const matchStaff = selectedStaff === 'All' || log.handledBy === selectedStaff;
    const matchType = selectedActivityType === 'All' || log.activityTypeName === selectedActivityType;
    const matchSearch =
      log.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.contactNumber && log.contactNumber.includes(searchQuery));
    return matchStaff && matchType && matchSearch;
  });

  // Source statistics calculations
  const sourceStats = buyerLeads.reduce((acc: Record<string, number>, lead) => {
    const mode = lead.enquiryMode || 'Direct';
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {});

  const staffStats = activityLogs.reduce((acc: Record<string, number>, log) => {
    acc[log.handledBy] = (acc[log.handledBy] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Reports & Analytics</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              Audit & BI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete management reporting suite for Seller Lists, Property Inventories, CRM Histories, Activity Filters, Ad Performances, and Enquiry Statistics.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* Report Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveReportTab('enquiry_stats')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
            activeReportTab === 'enquiry_stats'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Enquiry Statistics
        </button>
        <button
          onClick={() => setActiveReportTab('buyer_list')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
            activeReportTab === 'buyer_list'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          List of Sellers
        </button>
        <button
          onClick={() => setActiveReportTab('customer_leads')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
            activeReportTab === 'customer_leads'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          List of Customer Leads
        </button>
        <button
          onClick={() => setActiveReportTab('property_list')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
            activeReportTab === 'property_list'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          List of Property
        </button>
        <button
          onClick={() => setActiveReportTab('crm_buyer')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
            activeReportTab === 'crm_buyer'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          CRM for Seller Report
        </button>
        <button
          onClick={() => setActiveReportTab('crm_property')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
            activeReportTab === 'crm_property'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          CRM for Property Report
        </button>
        <button
          onClick={() => setActiveReportTab('crm_customer')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
            activeReportTab === 'crm_customer'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          CRM for Customer Report
        </button>
        <button
          onClick={() => setActiveReportTab('activities_filter')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
            activeReportTab === 'activities_filter'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Activities Filter
        </button>
        <button
          onClick={() => setActiveReportTab('weekly_ads')}
          className={`px-3 py-2 border-b-2 whitespace-nowrap transition ${
            activeReportTab === 'weekly_ads'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Weekly Ads
        </button>
      </div>

      {/* TAB CONTENT: 1. Enquiry Statistics */}
      {activeReportTab === 'enquiry_stats' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Seller Inquiries</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{buyerLeads.length}</div>
              <div className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Property Plus #1 Source
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Potential Rate</span>
              <div className="text-2xl font-bold text-purple-700 mt-1">
                {Math.round((buyerLeads.filter((b) => b.isPotential).length / (buyerLeads.length || 1)) * 100)}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {buyerLeads.filter((b) => b.isPotential).length} Qualified Potential
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Activities Executed</span>
              <div className="text-2xl font-bold text-blue-600 mt-1">{activityLogs.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">DAR logs recorded</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Locked / Secured Records</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {buyerLeads.filter((b) => b.isLocked).length + properties.filter((p) => p.isLocked).length}
              </div>
              <div className="text-[11px] text-amber-700 mt-1 font-medium">Protected by Admin</div>
            </div>
          </div>

          {/* Sources Breakdown & Staff Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Enquiry Sources Breakdown</h3>
                <span className="text-xs text-slate-400">Marketing ROI</span>
              </div>

              <div className="space-y-3">
                {Object.entries(sourceStats).map(([source, count]) => {
                  const pct = Math.round((count / (buyerLeads.length || 1)) * 100);
                  return (
                    <div key={source} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>{source}</span>
                        <span className="font-bold">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Staff Activity Output */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Staff DAR Activity Output</h3>
                <span className="text-xs text-slate-400">Field & Telecall</span>
              </div>

              <div className="space-y-3">
                {Object.entries(staffStats).map(([staff, count]) => {
                  const pct = Math.round((count / (activityLogs.length || 1)) * 100);
                  return (
                    <div key={staff} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>{staff}</span>
                        <span className="font-bold">
                          {count} activities ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. List of Sellers (Approved / Active Potential Sellers) */}
      {activeReportTab === 'buyer_list' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              List of Sellers ({buyerLeads.filter((b) => b.isPotential).length} Qualified Sellers)
            </span>
            <button
              onClick={() =>
                exportTableToCSV(
                  buyerLeads.filter((b) => b.isPotential),
                  'Potential_Sellers_List'
                )
              }
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 font-semibold text-slate-600 border-b border-slate-200">
                  <th className="px-3.5 py-3">Seller Name</th>
                  <th className="px-3 py-3">Contact</th>
                  <th className="px-3 py-3">Budget</th>
                  <th className="px-3 py-3">Property Wanted</th>
                  <th className="px-3 py-3">Preferred Locality</th>
                  <th className="px-3.5 py-3">CRM Stage</th>
                  <th className="px-3 py-3">Admin Lock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {buyerLeads
                  .filter((b) => b.isPotential)
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">{b.name}</td>
                      <td className="px-3 py-2.5 font-mono">{b.contactNo}</td>
                      <td className="px-3 py-2.5 font-bold text-emerald-700">{b.budget}</td>
                      <td className="px-3 py-2.5">{b.propertyType}</td>
                      <td className="px-3 py-2.5">{b.preferredLocality}</td>
                      <td className="px-3.5 py-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-semibold">
                          {b.crmStage}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {b.isLocked ? (
                          <span className="text-amber-800 font-bold text-[11px]">Locked</span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Unlocked</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. List of Customer Leads */}
      {(activeReportTab === 'customer_leads' || (activeReportTab as any) === 'buyer_leads') && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              Complete List of Customer Leads ({customerLeads.length} Records)
            </span>
            <button
              onClick={() => exportTableToCSV(customerLeads, 'All_Customer_Leads')}
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 font-semibold text-slate-600 border-b border-slate-200">
                  <th className="px-3.5 py-3">Date</th>
                  <th className="px-3.5 py-3">Lead Name</th>
                  <th className="px-3 py-3">Contact</th>
                  <th className="px-3 py-3">Customer Type</th>
                  <th className="px-3 py-3">Property Offered / Locality</th>
                  <th className="px-3.5 py-3">Handled By</th>
                  <th className="px-3.5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerLeads.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-3.5 py-2.5 text-slate-500">{c.date}</td>
                    <td className="px-3.5 py-2.5 font-bold text-slate-900">{c.name}</td>
                    <td className="px-3 py-2.5 font-mono">{c.contactNo}</td>
                    <td className="px-3 py-2.5">{c.customerType}</td>
                    <td className="px-3 py-2.5">
                      {c.propertyOffered} - <span className="font-bold text-emerald-700">{c.locality}</span>
                    </td>
                    <td className="px-3.5 py-2.5">{c.handledBy}</td>
                    <td className="px-3.5 py-2.5">
                      {c.isPotential ? (
                        <span className="text-purple-700 font-semibold">Potential Customer</span>
                      ) : (
                        <span className="text-slate-500">{c.crmStage || 'New Lead'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. List of Property */}
      {activeReportTab === 'property_list' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              List of Property ({properties.length} Active Listings)
            </span>
            <button
              onClick={() => exportTableToCSV(properties, 'Properties_Inventory')}
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 font-semibold text-slate-600 border-b border-slate-200">
                  <th className="px-3.5 py-3">Code</th>
                  <th className="px-3.5 py-3">Property Title</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Locality</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Owner & Contact</th>
                  <th className="px-3 py-3">Approval / Lock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-3.5 py-2.5 font-mono font-bold text-slate-600">{p.propertyCode}</td>
                    <td className="px-3.5 py-2.5 font-bold text-slate-900">{p.title}</td>
                    <td className="px-3 py-2.5">{p.propertyType}</td>
                    <td className="px-3 py-2.5">{p.locality}</td>
                    <td className="px-3 py-2.5 font-extrabold text-emerald-700">{p.price}</td>
                    <td className="px-3 py-2.5">
                      {p.ownerName} ({p.ownerContact})
                    </td>
                    <td className="px-3 py-2.5">
                      {p.isLocked ? (
                        <span className="text-emerald-700 font-bold">Approved & Locked</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Pending Approval</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5, 6, 7 CRM Reports */}
      {(activeReportTab === 'crm_buyer' ||
        activeReportTab === 'crm_property' ||
        activeReportTab === 'crm_customer') && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 capitalize">
                {activeReportTab === 'crm_buyer'
                  ? 'CRM for Seller Stage Audit'
                  : `${activeReportTab.replace('_', ' ')} Stage Audit`}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Stage progression history and logs recorded across pipeline
              </p>
            </div>
            <button
              onClick={() => {
                if (activeReportTab === 'crm_buyer') setCurrentPage('buyer_crm');
                if (activeReportTab === 'crm_property') setCurrentPage('property_crm');
                if (activeReportTab === 'crm_customer') setCurrentPage('customer_crm');
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
            >
              Open Interactive Kanban Board
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 font-semibold text-slate-600 border-b border-slate-200">
                  <th className="px-3.5 py-3">Entity Name</th>
                  <th className="px-3 py-3">Current CRM Stage</th>
                  <th className="px-3 py-3">Key Details</th>
                  <th className="px-3 py-3">Latest Recorded Update</th>
                  <th className="px-3 py-3">Handled By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeReportTab === 'crm_buyer' &&
                  buyerLeads.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">{b.name}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">
                          {b.crmStage}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {b.propertyType} • {b.budget}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{b.recentUpdate || b.requirement}</td>
                      <td className="px-3 py-2.5">{b.firstCallHandledBy}</td>
                    </tr>
                  ))}

                {activeReportTab === 'crm_property' &&
                  properties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">{p.title}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">
                          {p.crmStage}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {p.locality} • {p.price}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">
                        Total site visits: {p.totalSiteVisits} • Ads: {p.onlineAdsPostedCount}
                      </td>
                      <td className="px-3 py-2.5">Team</td>
                    </tr>
                  ))}

                {activeReportTab === 'crm_customer' &&
                  customerLeads.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">{c.name}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-semibold">
                          {c.crmStage}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {c.customerType} • Offering: {c.propertyOffered}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{c.notes}</td>
                      <td className="px-3 py-2.5">{c.handledBy}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 8. Activities Filter */}
      {activeReportTab === 'activities_filter' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Filter by Staff Member</label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="All">All Staff Members</option>
                <option value="Venkatesh">Venkatesh</option>
                <option value="Muthukumar">Muthukumar</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Filter by Activity Type</label>
              <select
                value={selectedActivityType}
                onChange={(e) => setSelectedActivityType(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="All">All Activities</option>
                {activityMasters.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Keyword Search</label>
              <input
                type="text"
                placeholder="Search notes, names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => exportTableToCSV(filteredActivities, 'Filtered_Activities_Report')}
                className="w-full px-3 py-2 bg-slate-900 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Export Filtered CSV
              </button>
            </div>
          </div>

          {/* Activities List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 font-semibold text-slate-600 border-b border-slate-200">
                  <th className="px-3.5 py-3">Date</th>
                  <th className="px-3.5 py-3">Activity Type</th>
                  <th className="px-3.5 py-3">Client / Entity</th>
                  <th className="px-3.5 py-3">Contact</th>
                  <th className="px-3.5 py-3 min-w-[240px]">Notes & Updates</th>
                  <th className="px-3 py-3">Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActivities.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-3.5 py-2.5 text-slate-500 font-mono">{log.date}</td>
                    <td className="px-3.5 py-2.5">
                      <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {log.activityTypeName}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 font-bold text-slate-800">{log.entityName}</td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-600">{log.contactNumber || '—'}</td>
                    <td className="px-3.5 py-2.5 text-slate-700">{log.notes}</td>
                    <td className="px-3 py-2.5 font-semibold text-blue-700">{log.handledBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 9. Weekly Ads */}
      {activeReportTab === 'weekly_ads' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Property Advertisements Tracking</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track ad campaigns in Property Plus, Facebook, Nanganallur Voice, Times of India
              </p>
            </div>
            <button
              onClick={() => exportTableToCSV(weeklyAds, 'Weekly_Ads_Performance')}
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyAds.map((ad: WeeklyAdItem) => (
              <div key={ad.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                    {ad.newspaperOrPortal}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">{ad.weekStartDate}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mt-1">{ad.propertyTitle}</h4>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Cost:</span>
                  <span className="font-bold text-slate-800">{ad.cost}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Enquiries Generated:</span>
                  <span className="font-bold text-emerald-700">{ad.enquiriesGenerated} Leads</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Site Visits Booked:</span>
                  <span className="font-semibold text-blue-700">{ad.siteVisitsBooked} Visits</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
