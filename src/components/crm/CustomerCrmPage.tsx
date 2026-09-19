import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerLead, ActivityLog } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Send,
  Sparkles,
  Layers,
  History,
  Info,
  ShieldCheck,
  Tag,
  Kanban,
  Edit3,
  RefreshCw,
  FileText,
  Users,
} from 'lucide-react';

interface ActivityDaysMetrics {
  updateOnJob: number;
  staffMobileCall: number;
  staff121: number;
  mdMobileCall: number;
  md121: number;
  propertyDocCollection: number;
  propertyRd: number;
  propertyPhotoVideo: number;
  buyerSellerMeeting: number;
}

const DEFAULT_METRICS_MAP: Record<string, ActivityDaysMetrics> = {
  'cust-e': {
    updateOnJob: 0,
    staffMobileCall: 1,
    staff121: 10,
    mdMobileCall: 3,
    md121: 30,
    propertyDocCollection: 0,
    propertyRd: 0,
    propertyPhotoVideo: 0,
    buyerSellerMeeting: 0,
  },
  'cust-b': {
    updateOnJob: 1,
    staffMobileCall: 1,
    staff121: 10,
    mdMobileCall: 3,
    md121: 30,
    propertyDocCollection: 0,
    propertyRd: 0,
    propertyPhotoVideo: 0,
    buyerSellerMeeting: 0,
  },
  'cust-y': {
    updateOnJob: 3,
    staffMobileCall: 1,
    staff121: 10,
    mdMobileCall: 3,
    md121: 30,
    propertyDocCollection: 0,
    propertyRd: 0,
    propertyPhotoVideo: 0,
    buyerSellerMeeting: 0,
  },
  'cust-d': {
    updateOnJob: 5,
    staffMobileCall: 1,
    staff121: 10,
    mdMobileCall: 3,
    md121: 30,
    propertyDocCollection: 0,
    propertyRd: 0,
    propertyPhotoVideo: 0,
    buyerSellerMeeting: 0,
  },
};

export const CustomerCrmPage: React.FC = () => {
  const {
    customerLeads,
    properties,
    activityLogs,
    activityMasters,
    addActivityLog,
    currentRole,
    currentUser,
    setCurrentPage,
  } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Categorize activities dynamically from Activity Masters (Create Tag menu)
  const currentActivities = useMemo(() => {
    return activityMasters.filter(
      (a) =>
        a.activityGroup === 'current' ||
        (!a.activityGroup &&
          !['Property Document Collection', 'Property R/D', 'Property Photo and Video', 'Buyer and Seller meeting'].includes(a.name))
    );
  }, [activityMasters]);

  const pendingActivities = useMemo(() => {
    return activityMasters.filter(
      (a) =>
        a.activityGroup === 'pending' ||
        ['Property Document Collection', 'Property R/D', 'Property Photo and Video', 'Buyer and Seller meeting'].includes(a.name)
    );
  }, [activityMasters]);

  // Local storage for customer days metrics
  const [metricsStore, setMetricsStore] = useState<Record<string, ActivityDaysMetrics>>(() => {
    try {
      const saved = localStorage.getItem('crm_customer_activity_metrics');
      if (saved) {
        return { ...DEFAULT_METRICS_MAP, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_METRICS_MAP;
  });

  useEffect(() => {
    try {
      localStorage.setItem('crm_customer_activity_metrics', JSON.stringify(metricsStore));
    } catch {
      // Ignore
    }
  }, [metricsStore]);

  // Selected customer
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return customerLeads.find((c) => c.id === selectedCustomerId) || null;
  }, [customerLeads, selectedCustomerId]);

  // Dynamic helper to get days elapsed for any activity
  const getCustomerDays = (customerId: string, actName: string): number => {
    const metrics: any = metricsStore[customerId] || DEFAULT_METRICS_MAP[customerId] || {};
    const norm = actName.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (metrics[actName] !== undefined) return metrics[actName];
    if (metrics[norm] !== undefined) return metrics[norm];

    // Standard alias check
    if (norm.includes('update') && norm.includes('job')) return metrics.updateOnJob ?? 0;
    if (norm.includes('staff') && norm.includes('call')) return metrics.staffMobileCall ?? 1;
    if (norm.includes('staff') && norm.includes('121')) return metrics.staff121 ?? 10;
    if (norm.includes('md') && norm.includes('call')) return metrics.mdMobileCall ?? 3;
    if (norm.includes('md') && norm.includes('121')) return metrics.md121 ?? 30;
    if (norm.includes('doc')) return metrics.propertyDocCollection ?? 0;
    if (norm.includes('rd')) return metrics.propertyRd ?? 0;
    if (norm.includes('photo')) return metrics.propertyPhotoVideo ?? 0;
    if (norm.includes('buyer') && norm.includes('seller')) return metrics.buyerSellerMeeting ?? 0;

    return 0;
  };

  // Update metrics for a customer
  const updateCustomerMetric = (customerId: string, actName: string, value: number) => {
    const norm = actName.toLowerCase().replace(/[^a-z0-9]/g, '');
    setMetricsStore((prev) => {
      const curr: any = prev[customerId] || DEFAULT_METRICS_MAP[customerId] || {};
      const updated: any = {
        ...curr,
        [actName]: Math.max(0, value),
        [norm]: Math.max(0, value),
      };

      if (norm.includes('update') && norm.includes('job')) updated.updateOnJob = Math.max(0, value);
      if (norm.includes('staff') && norm.includes('call')) updated.staffMobileCall = Math.max(0, value);
      if (norm.includes('staff') && norm.includes('121')) updated.staff121 = Math.max(0, value);
      if (norm.includes('md') && norm.includes('call')) updated.mdMobileCall = Math.max(0, value);
      if (norm.includes('md') && norm.includes('121')) updated.md121 = Math.max(0, value);
      if (norm.includes('doc')) updated.propertyDocCollection = Math.max(0, value);
      if (norm.includes('rd')) updated.propertyRd = Math.max(0, value);
      if (norm.includes('photo')) updated.propertyPhotoVideo = Math.max(0, value);
      if (norm.includes('buyer') && norm.includes('seller')) updated.buyerSellerMeeting = Math.max(0, value);

      return {
        ...prev,
        [customerId]: updated,
      };
    });
  };

  // Form state for logging a new activity in specific customer CRM page
  const [newActivityType, setNewActivityType] = useState('Staff - Mobile Call');
  const [newActivityNotes, setNewActivityNotes] = useState('');
  const [newActivityDate, setNewActivityDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newActivityHandledBy, setNewActivityHandledBy] = useState(() => currentUser?.username || (currentRole === 'admin' ? 'MD' : 'Staff'));

  // Automatically keep Handled By synchronized with logged in user
  useEffect(() => {
    if (currentUser?.username) {
      setNewActivityHandledBy(currentUser.username);
    }
  }, [currentUser?.username]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customerLeads.filter((c) => {
      const matchQuery =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.contactNo && c.contactNo.includes(searchQuery)) ||
        (c.locality && c.locality.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.propertyOffered && c.propertyOffered.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchType = filterType === 'all' || c.customerType === filterType;

      return matchQuery && matchType;
    });
  }, [customerLeads, searchQuery, filterType]);

  // Consolidated activity timeline for selected customer
  const customerTimeline = useMemo(() => {
    if (!selectedCustomer) return [];

    const list: Array<{
      id: string;
      date: string;
      time?: string;
      title: string;
      performer: string;
      notes: string;
      source: 'Activity Master' | 'Property Link' | 'Milestone' | 'Direct CRM';
      badgeColor: string;
    }> = [];

    // 1. Logs from activityLogs
    activityLogs
      .filter((log) => {
        return (
          log.entityId === selectedCustomer.id ||
          log.entityName.toLowerCase().includes(selectedCustomer.name.toLowerCase()) ||
          selectedCustomer.name.toLowerCase().includes(log.entityName.toLowerCase())
        );
      })
      .forEach((log) => {
        list.push({
          id: log.id,
          date: log.date,
          time: log.time || '11:00 AM',
          title: log.activityTypeName || 'Activity Logged',
          performer: log.handledBy || selectedCustomer.handledBy,
          notes: log.notes || log.requirement || log.recentUpdate || '',
          source: 'Activity Master',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        });
      });

    // 2. Automated links from Property Creation where seller/customer was selected
    properties
      .filter((p) => {
        return (
          (p.ownerName && p.ownerName.toLowerCase().includes(selectedCustomer.name.toLowerCase())) ||
          (p.ownerContact && selectedCustomer.contactNo && p.ownerContact.includes(selectedCustomer.contactNo))
        );
      })
      .forEach((p) => {
        list.push({
          id: `prop-link-${p.id}`,
          date: p.date || selectedCustomer.date,
          time: '10:00 AM',
          title: `Property Linked: ${p.title}`,
          performer: selectedCustomer.handledBy || 'Staff',
          notes: `Customer selected in Property Creation. Locality: ${p.locality} • Size: ${p.sizeSqFt} sq ft • Expected: ${p.price}. Status: ${p.status}.`,
          source: 'Property Link',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        });
      });

    // 3. Customer Milestone events
    if (selectedCustomer.date) {
      list.push({
        id: `milestone-created-${selectedCustomer.id}`,
        date: selectedCustomer.date,
        time: '09:30 AM',
        title: 'Customer Lead Created',
        performer: selectedCustomer.handledBy,
        notes: `Registered as ${selectedCustomer.customerType} offering ${selectedCustomer.propertyOffered || 'property'}. Initial requirement: ${selectedCustomer.notes}`,
        source: 'Milestone',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      });
    }

    if (selectedCustomer.isApproved) {
      list.push({
        id: `milestone-approved-${selectedCustomer.id}`,
        date: selectedCustomer.lockedAt || selectedCustomer.date,
        time: '04:15 PM',
        title: 'Admin Approved & Record Locked',
        performer: selectedCustomer.lockedBy || 'Admin',
        notes: `Record authorized by administrator. Locked fields for immutable data security. Stage: ${selectedCustomer.crmStage}`,
        source: 'Milestone',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      });
    }

    // Sort by date descending
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedCustomer, activityLogs, properties]);

  // Handle saving new activity from the bottom entry box
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    if (!newActivityNotes.trim()) {
      alert('Please enter details or notes for this activity.');
      return;
    }

    const newLog: Omit<ActivityLog, 'id'> = {
      date: newActivityDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activityTypeId: 'act-custom',
      activityTypeName: newActivityType,
      entityType: 'customer',
      entityId: selectedCustomer.id,
      entityName: selectedCustomer.name,
      contactNumber: selectedCustomer.contactNo,
      notes: newActivityNotes,
      handledBy: newActivityHandledBy,
      status: 'Completed',
    };

    addActivityLog(newLog);

    // Reset the corresponding days passed to 0
    updateCustomerMetric(selectedCustomer.id, newActivityType, 0);

    setNewActivityNotes('');
  };

  return (
    <div id="customer-crm-container" className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* If no specific customer is selected, render the master "CRM Customer" list view */}
      {!selectedCustomer ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wide">
                  CRM Module
                </span>
                <span className="text-xs text-slate-500 font-medium">Document Specification Layout</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
                CRM Customer
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Multi-stage customer activity monitoring. Track days elapsed across key touchpoints and access detailed history.
              </p>
            </div>

            {/* Quick Search and Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer, phone, locality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Types</option>
                <option value="Seller">Seller</option>
                <option value="Landowner">Landowner</option>
                <option value="Builder">Builder</option>
                <option value="Investor">Investor</option>
              </select>

              <button
                onClick={() => setCurrentPage('customer_add')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Lead
              </button>
            </div>
          </div>

          {/* Explanatory Guide Box Matching Document Page 1 Annotations */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-950 flex items-start gap-3 shadow-xs">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-amber-900">How to read this matrix: </span>
              The top number in each box indicates the <strong className="font-semibold text-red-700">"Nos of Day passed after the activities is done"</strong>.
              Click the blue circular arrow <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold mx-1">➔</span> to open the <strong className="font-semibold">"Specific customer CRM Page"</strong> with the complete auto-logged history and activity tables.
            </div>
          </div>

          {/* Customer Matrix Table / Rows matching Document Page 1 */}
          <div className="space-y-3">
            {filteredCustomers.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                No customer leads found matching criteria.
              </div>
            ) : (
              filteredCustomers.map((cust) => {
                return (
                  <div
                    key={cust.id}
                    id={`crm-customer-row-${cust.id}`}
                    className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Left: Customer Name & Key Identifiers */}
                    <div className="lg:w-1/4 shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCustomerId(cust.id)}
                          className="text-left font-bold text-slate-900 hover:text-blue-600 text-sm transition"
                          title="Click to view detailed CRM page"
                        >
                          {cust.name}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {cust.customerType}
                        </span>
                        {cust.contactNo && (
                          <span className="flex items-center gap-0.5 text-slate-600">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {cust.contactNo}
                          </span>
                        )}
                      </div>
                      {cust.propertyOffered && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                          {cust.propertyOffered}
                        </p>
                      )}
                    </div>

                    {/* Middle: Horizontal Activity Step Blocks (Dynamic from Tag Master) */}
                    <div className="flex-1 overflow-x-auto pb-1 lg:pb-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-[560px]">
                        {currentActivities.slice(0, 5).map((act, idx) => {
                          const days = getCustomerDays(cust.id, act.name);
                          const isYellow = idx < 2;
                          const isSky = idx >= 2 && idx < 4;
                          const bgTop = isYellow
                            ? 'bg-amber-50 text-amber-950 border-amber-300/80'
                            : isSky
                            ? 'bg-sky-50 text-sky-950 border-sky-300/80'
                            : 'bg-orange-50 text-orange-950 border-orange-300/80';
                          const bgBottom = isYellow
                            ? 'bg-amber-200 text-amber-950 border-amber-300'
                            : isSky
                            ? 'bg-sky-200 text-sky-950 border-sky-300'
                            : 'bg-orange-200 text-orange-950 border-orange-300';

                          return (
                            <div key={`cust-top-act-${act.id}-${idx}`} className="flex-1 text-center">
                              <div className={`border rounded-t-md py-1 text-xs font-bold shadow-xs ${bgTop}`}>
                                {days}
                              </div>
                              <div className={`border-x border-b font-bold text-[11px] sm:text-xs py-1.5 px-2 rounded-b-md whitespace-nowrap shadow-xs ${bgBottom}`}>
                                {act.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Circular Blue Action Arrow Button matching Page 1 */}
                    <div className="shrink-0 flex items-center justify-end pl-2">
                      <button
                        id={`btn-open-crm-${cust.id}`}
                        onClick={() => setSelectedCustomerId(cust.id)}
                        className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow hover:shadow-md transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title="Click to go to Specific customer page for detailed CRM"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Specific Customer CRM Page matching Page 1 bottom & Page 2 of document */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Header & Back Navigation */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="btn-back-to-crm-list"
                  onClick={() => setSelectedCustomerId(null)}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
                  title="Back to CRM Customer list"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    Specific Customer CRM Page
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {selectedCustomer.name}
                  </h1>
                </div>
              </div>

              {/* Status and Action badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 font-semibold border border-purple-200">
                  {selectedCustomer.customerType}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  {selectedCustomer.crmStage}
                </span>
                {selectedCustomer.isLocked && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Locked Record
                  </span>
                )}
              </div>
            </div>

            {/* Quick Metadata Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Contact Phone</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {selectedCustomer.contactNo || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Locality</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {selectedCustomer.locality || 'Chennai'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Property Offered</span>
                <p className="font-semibold text-slate-800 mt-0.5 truncate">
                  {selectedCustomer.propertyOffered || selectedCustomer.propertyType}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Staff Lead</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {selectedCustomer.handledBy}
                </p>
              </div>
            </div>
          </div>

          {/* Main Two-Column Layout (Matching Page 1 bottom & Page 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Customer History & Auto-Logged Activities Feed (Approx 7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col h-full">
                {/* Header with Document Annotation Callout */}
                <div className="border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Customer History & Activity Log
                    </h2>
                  </div>
                  <div className="mt-2 bg-blue-50/70 border border-blue-200/80 rounded-lg p-2.5 text-[11px] text-blue-950">
                    <p className="leading-relaxed">
                      <strong>Auto-Logging Engine:</strong> All details and activities are logged automatically. History is recorded here from front-page activity logs, property creations, and buyer-seller meetings.
                    </p>
                  </div>
                </div>

                {/* Chronological Timeline Feed */}
                <div className="flex-1 overflow-y-auto max-h-[420px] pr-1 space-y-3">
                  {customerTimeline.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No activities logged yet for this customer. Use the box below to record the first entry.
                    </div>
                  ) : (
                    customerTimeline.map((item, idx) => (
                      <div
                        key={item.id}
                        className="relative pl-6 pb-3 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200 last:before:hidden"
                      >
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white" />
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:bg-white hover:border-slate-300 transition-colors shadow-2xs">
                          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badgeColor}`}>
                                {item.title}
                              </span>
                              <span className="text-slate-400 text-[11px]">•</span>
                              <span className="font-semibold text-slate-700 text-[11px]">
                                {item.performer}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {item.date} {item.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                            {item.notes}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Activity Input Box (With Green Save Button matching screenshot) */}
                <form
                  onSubmit={handleSaveActivity}
                  className="mt-4 pt-4 border-t border-slate-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Activity Type
                      </label>
                      <select
                        value={newActivityType}
                        onChange={(e) => setNewActivityType(e.target.value)}
                        className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      >
                        <optgroup label="Current Activites (Pipeline & Days Elapsed)">
                          {currentActivities.map((act, idx) => (
                            <option key={`cust-opt-curr-${act.id}-${idx}`} value={act.name}>
                              {act.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Pending Activites (Field & Document Tasks)">
                          {pendingActivities.map((act, idx) => (
                            <option key={`cust-opt-pend-${act.id}-${idx}`} value={act.name}>
                              {act.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div className="w-28">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={newActivityDate}
                        onChange={(e) => setNewActivityDate(e.target.value)}
                        className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="w-32">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Handled By
                      </label>
                      <input
                        type="text"
                        value={newActivityHandledBy}
                        onChange={(e) => setNewActivityHandledBy(e.target.value)}
                        placeholder="User ID / Name"
                        title={`Logged in user: ${currentUser?.username || 'User'}`}
                        className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type details or activity update for this customer..."
                      value={newActivityNotes}
                      onChange={(e) => setNewActivityNotes(e.target.value)}
                      className="flex-1 text-xs py-2 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      id="btn-save-customer-activity"
                      className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Two Yellow-Header Activity Matrix Tables (Approx 5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* TABLE 1: Current Activites List Details (Dynamic from Tag Master) */}
              <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-yellow-300 border-b border-slate-300 text-slate-950">
                      <th className="py-2 px-3 font-bold text-left border-r border-slate-300">
                        <div className="flex items-center justify-between">
                          <span>Current Activites List Details</span>
                          <button
                            type="button"
                            onClick={() => setCurrentPage('activities_master')}
                            className="text-[10px] font-normal px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition flex items-center gap-1 font-sans"
                            title="Open Create Activities Master in Tag Menu"
                          >
                            <Plus className="w-3 h-3 text-amber-400" /> Manage in Tag
                          </button>
                        </div>
                      </th>
                      <th className="py-2 px-2 font-bold text-center w-36">
                        Nos Days <span className="block text-[10px] font-normal text-slate-800">(Passed after activities)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentActivities.map((act, idx) => {
                      const days = getCustomerDays(selectedCustomer.id, act.name);
                      return (
                        <tr key={`cust-tbl1-${act.id}-${idx}`} className="hover:bg-amber-50/50 transition-colors">
                          <td className="py-2.5 px-3 font-medium text-slate-800 border-r border-slate-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: act.color || '#eab308' }}
                                />
                                <span>{act.name}</span>
                              </div>
                              {act.category && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">
                                  {act.category}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="font-bold text-slate-900 text-sm">{days}</span>
                              <button
                                onClick={() => updateCustomerMetric(selectedCustomer.id, act.name, days + 1)}
                                className="text-[10px] px-1 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                                title="Add 1 day"
                              >
                                +1d
                              </button>
                              <button
                                onClick={() => updateCustomerMetric(selectedCustomer.id, act.name, 0)}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 font-medium"
                                title="Reset to 0 (Done Today)"
                              >
                                Today
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* TABLE 2: Pending Activites (Dynamic from Tag Master) */}
              <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-yellow-300 border-b border-slate-300 text-slate-950">
                      <th className="py-2 px-3 font-bold text-left border-r border-slate-300">
                        <div className="flex items-center justify-between">
                          <span>Pending Activites</span>
                          <button
                            type="button"
                            onClick={() => setCurrentPage('activities_master')}
                            className="text-[10px] font-normal px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition flex items-center gap-1 font-sans"
                            title="Open Create Activities Master in Tag Menu"
                          >
                            <Plus className="w-3 h-3 text-amber-400" /> Manage in Tag
                          </button>
                        </div>
                      </th>
                      <th className="py-2 px-2 font-bold text-center w-36">
                        Nos Days <span className="block text-[10px] font-normal text-slate-800">(Passed after activities)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pendingActivities.map((act, idx) => {
                      const days = getCustomerDays(selectedCustomer.id, act.name);
                      return (
                        <tr key={`cust-tbl2-${act.id}-${idx}`} className="hover:bg-amber-50/50 transition-colors">
                          <td className="py-2.5 px-3 font-medium text-slate-800 border-r border-slate-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: act.color || '#10b981' }}
                                />
                                <span>{act.name}</span>
                              </div>
                              {act.category && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">
                                  {act.category}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="font-bold text-slate-900 text-sm">{days}</span>
                              <button
                                onClick={() => {
                                  const newLog: Omit<ActivityLog, 'id'> = {
                                    date: new Date().toISOString().split('T')[0],
                                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    activityTypeId: act.id,
                                    activityTypeName: act.name,
                                    entityType: 'customer',
                                    entityId: selectedCustomer.id,
                                    entityName: selectedCustomer.name,
                                    notes: `Completed ${act.name} with customer.`,
                                    handledBy: currentUser?.username || selectedCustomer.handledBy || (currentRole === 'admin' ? 'MD' : 'Staff'),
                                    status: 'Completed',
                                  };
                                  addActivityLog(newLog);
                                  updateCustomerMetric(selectedCustomer.id, act.name, 0);
                                }}
                                className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold"
                                title="Log activity completed today & reset days"
                              >
                                Mark Done
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
