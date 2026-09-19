import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyItem, ActivityLog } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  User,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  Plus,
  Search,
  History,
  Info,
  ShieldCheck,
  Tag,
  Home,
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

const DEFAULT_PROPERTY_METRICS_MAP: Record<string, ActivityDaysMetrics> = {
  'prop-1': {
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
  'prop-2': {
    updateOnJob: 1,
    staffMobileCall: 2,
    staff121: 10,
    mdMobileCall: 4,
    md121: 28,
    propertyDocCollection: 0,
    propertyRd: 0,
    propertyPhotoVideo: 0,
    buyerSellerMeeting: 0,
  },
  'prop-3': {
    updateOnJob: 3,
    staffMobileCall: 1,
    staff121: 14,
    mdMobileCall: 3,
    md121: 32,
    propertyDocCollection: 0,
    propertyRd: 0,
    propertyPhotoVideo: 0,
    buyerSellerMeeting: 0,
  },
  'prop-4': {
    updateOnJob: 2,
    staffMobileCall: 1,
    staff121: 7,
    mdMobileCall: 2,
    md121: 20,
    propertyDocCollection: 0,
    propertyRd: 0,
    propertyPhotoVideo: 0,
    buyerSellerMeeting: 0,
  },
  'prop-5': {
    updateOnJob: 5,
    staffMobileCall: 3,
    staff121: 15,
    mdMobileCall: 5,
    md121: 45,
    propertyDocCollection: 0,
    propertyRd: 0,
    propertyPhotoVideo: 0,
    buyerSellerMeeting: 0,
  },
};

export const PropertyCrmPage: React.FC = () => {
  const {
    properties,
    buyerLeads,
    customerLeads,
    activityLogs,
    activityMasters,
    addActivityLog,
    currentRole,
    currentUser,
    setCurrentPage,
  } = useApp();

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Dynamic Current and Pending Activities sourced directly from Activity Master
  const currentActivities = useMemo(() => {
    const list = activityMasters.filter((a) => a.activityGroup === 'current');
    if (list.length > 0) return list;
    return activityMasters.filter((a) => !['Document Verification', 'Agreement Signed', 'Token Advance Received', 'Registration Complete'].includes(a.name));
  }, [activityMasters]);

  const pendingActivities = useMemo(() => {
    const list = activityMasters.filter((a) => a.activityGroup === 'pending');
    if (list.length > 0) return list;
    return activityMasters.filter((a) => ['Document Verification', 'Agreement Signed', 'Token Advance Received', 'Registration Complete'].includes(a.name));
  }, [activityMasters]);

  // Local storage for property days metrics
  const [metricsStore, setMetricsStore] = useState<Record<string, ActivityDaysMetrics>>(() => {
    try {
      const saved = localStorage.getItem('crm_property_activity_metrics');
      if (saved) {
        return { ...DEFAULT_PROPERTY_METRICS_MAP, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROPERTY_METRICS_MAP;
  });

  useEffect(() => {
    try {
      localStorage.setItem('crm_property_activity_metrics', JSON.stringify(metricsStore));
    } catch {
      // Ignore
    }
  }, [metricsStore]);

  // Selected property
  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) return null;
    return properties.find((p) => p.id === selectedPropertyId) || null;
  }, [properties, selectedPropertyId]);

  // Helper to get metrics for a property
  const getPropertyMetrics = (propertyId: string): ActivityDaysMetrics => {
    if (metricsStore[propertyId]) return metricsStore[propertyId];
    if (DEFAULT_PROPERTY_METRICS_MAP[propertyId]) return DEFAULT_PROPERTY_METRICS_MAP[propertyId];
    return {
      updateOnJob: 0,
      staffMobileCall: 1,
      staff121: 10,
      mdMobileCall: 3,
      md121: 30,
      propertyDocCollection: 0,
      propertyRd: 0,
      propertyPhotoVideo: 0,
      buyerSellerMeeting: 0,
    };
  };

  // Dynamic lookup for any activity name (handles custom added master activities)
  const getPropertyDays = (propertyId: string, actName: string): number => {
    const metrics = getPropertyMetrics(propertyId) as unknown as Record<string, number>;
    const normalizedKey = actName.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check known standard mappings
    if (normalizedKey.includes('updateonjob') || normalizedKey.includes('jobupdate')) return metrics.updateOnJob ?? 0;
    if (normalizedKey.includes('staffmobile') || normalizedKey.includes('staffcall')) return metrics.staffMobileCall ?? 1;
    if (normalizedKey.includes('staff121') || normalizedKey.includes('staffmeeting')) return metrics.staff121 ?? 10;
    if (normalizedKey.includes('mdmobile') || normalizedKey.includes('mdcall')) return metrics.mdMobileCall ?? 3;
    if (normalizedKey.includes('md121') || normalizedKey.includes('mdmeeting')) return metrics.md121 ?? 30;
    if (normalizedKey.includes('doc') || normalizedKey.includes('collection')) return metrics.propertyDocCollection ?? 0;
    if (normalizedKey.includes('rd') || normalizedKey.includes('research')) return metrics.propertyRd ?? 0;
    if (normalizedKey.includes('photo') || normalizedKey.includes('video')) return metrics.propertyPhotoVideo ?? 0;
    if (normalizedKey.includes('buyerseller') || normalizedKey.includes('meeting')) return metrics.buyerSellerMeeting ?? 0;

    // Check custom key in store
    if (metrics[normalizedKey] !== undefined) return metrics[normalizedKey];
    return 0;
  };

  // Update metrics for a property
  const updateMetric = (propertyId: string, key: keyof ActivityDaysMetrics, value: number) => {
    setMetricsStore((prev) => {
      const curr = prev[propertyId] || getPropertyMetrics(propertyId);
      return {
        ...prev,
        [propertyId]: {
          ...curr,
          [key]: Math.max(0, value),
        },
      };
    });
  };

  // Update metric for any dynamic activity name
  const updatePropertyMetric = (propertyId: string, actName: string, value: number) => {
    const normalizedKey = actName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedKey.includes('updateonjob') || normalizedKey.includes('jobupdate')) {
      updateMetric(propertyId, 'updateOnJob', value);
    } else if (normalizedKey.includes('staffmobile') || normalizedKey.includes('staffcall')) {
      updateMetric(propertyId, 'staffMobileCall', value);
    } else if (normalizedKey.includes('staff121') || normalizedKey.includes('staffmeeting')) {
      updateMetric(propertyId, 'staff121', value);
    } else if (normalizedKey.includes('mdmobile') || normalizedKey.includes('mdcall')) {
      updateMetric(propertyId, 'mdMobileCall', value);
    } else if (normalizedKey.includes('md121') || normalizedKey.includes('mdmeeting')) {
      updateMetric(propertyId, 'md121', value);
    } else if (normalizedKey.includes('doc') || normalizedKey.includes('collection')) {
      updateMetric(propertyId, 'propertyDocCollection', value);
    } else if (normalizedKey.includes('rd') || normalizedKey.includes('research')) {
      updateMetric(propertyId, 'propertyRd', value);
    } else if (normalizedKey.includes('photo') || normalizedKey.includes('video')) {
      updateMetric(propertyId, 'propertyPhotoVideo', value);
    } else if (normalizedKey.includes('buyerseller') || normalizedKey.includes('meeting')) {
      updateMetric(propertyId, 'buyerSellerMeeting', value);
    } else {
      setMetricsStore((prev) => {
        const curr = prev[propertyId] || (getPropertyMetrics(propertyId) as unknown as Record<string, number>);
        return {
          ...prev,
          [propertyId]: {
            ...curr,
            [normalizedKey]: Math.max(0, value),
          },
        };
      });
    }
  };

  // Form state for logging a new activity in specific property CRM page
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

  // Filtered properties list
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchQuery =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.propertyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.locality && p.locality.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.ownerName && p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.ownerContact && p.ownerContact.includes(searchQuery));

      const matchType = filterType === 'all' || p.propertyType === filterType;

      return matchQuery && matchType;
    });
  }, [properties, searchQuery, filterType]);

  // Consolidated activity timeline for selected property
  const propertyTimeline = useMemo(() => {
    if (!selectedProperty) return [];

    const list: Array<{
      id: string;
      date: string;
      time?: string;
      title: string;
      performer: string;
      notes: string;
      source: 'Activity Master' | 'Customer Link' | 'Milestone' | 'Direct CRM';
      badgeColor: string;
    }> = [];

    // 1. Logs from activityLogs matching property
    activityLogs
      .filter((log) => {
        return (
          log.entityId === selectedProperty.id ||
          log.entityName.toLowerCase().includes(selectedProperty.title.toLowerCase()) ||
          log.entityName.toLowerCase().includes(selectedProperty.propertyCode.toLowerCase()) ||
          (log.notes && log.notes.toLowerCase().includes(selectedProperty.propertyCode.toLowerCase()))
        );
      })
      .forEach((log) => {
        list.push({
          id: log.id,
          date: log.date,
          time: log.time || '11:00 AM',
          title: log.activityTypeName || 'Activity Logged',
          performer: log.handledBy || 'Staff',
          notes: log.notes || log.requirement || log.recentUpdate || '',
          source: 'Activity Master',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        });
      });

    // 2. Customer Leads matching property owner or requirements
    customerLeads
      .filter((c) => {
        return (
          (selectedProperty.ownerName && c.name.toLowerCase().includes(selectedProperty.ownerName.toLowerCase())) ||
          (selectedProperty.ownerContact && c.contactNo && selectedProperty.ownerContact.includes(c.contactNo))
        );
      })
      .forEach((c) => {
        list.push({
          id: `cust-match-${c.id}`,
          date: c.date || selectedProperty.date || '2026-08-15',
          time: '11:30 AM',
          title: `Linked Customer: ${c.name}`,
          performer: c.handledBy || 'Staff',
          notes: `Customer record linked with property. Contact: ${c.contactNo} • Type: ${c.customerType} • Locality: ${c.locality}`,
          source: 'Customer Link',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        });
      });

    // 3. Property Milestones
    if (selectedProperty.date) {
      list.push({
        id: `milestone-created-${selectedProperty.id}`,
        date: selectedProperty.date,
        time: '09:00 AM',
        title: 'Property Listed in Database',
        performer: 'Staff',
        notes: `Property Code: ${selectedProperty.propertyCode} • Type: ${selectedProperty.propertyType} • Size: ${selectedProperty.sizeSqFt} sq ft • Expected: ${selectedProperty.price}. Owner: ${selectedProperty.ownerName}`,
        source: 'Milestone',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      });
    }

    if (selectedProperty.isLocked || selectedProperty.isApproved) {
      list.push({
        id: `milestone-approved-${selectedProperty.id}`,
        date: selectedProperty.lockedAt || selectedProperty.date || '2026-08-15',
        time: '04:00 PM',
        title: 'Admin Approved & Asset Locked',
        performer: selectedProperty.lockedBy || 'Admin',
        notes: `Property title verified and record locked for secure listing. Stage: ${selectedProperty.crmStage}`,
        source: 'Milestone',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      });
    }

    // Sort by date descending
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedProperty, activityLogs, customerLeads]);

  // Handle saving new activity from the bottom entry box
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    if (!newActivityNotes.trim()) {
      alert('Please enter details or notes for this activity.');
      return;
    }

    const matchedAct = activityMasters.find((a) => a.name === newActivityType);
    const newLog: Omit<ActivityLog, 'id'> = {
      date: newActivityDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activityTypeId: matchedAct ? matchedAct.id : 'act-custom-prop',
      activityTypeName: newActivityType,
      entityType: 'property',
      entityId: selectedProperty.id,
      entityName: `${selectedProperty.propertyCode} - ${selectedProperty.title}`,
      contactNumber: selectedProperty.ownerContact,
      notes: newActivityNotes,
      handledBy: newActivityHandledBy,
      status: 'Completed',
    };

    addActivityLog(newLog);

    // Reset the corresponding days passed to 0
    updatePropertyMetric(selectedProperty.id, newActivityType, 0);

    setNewActivityNotes('');
  };

  return (
    <div id="property-crm-container" className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* If no specific property is selected, render the master "CRM for Property" list view */}
      {!selectedProperty ? (
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
                CRM for Property
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Multi-stage property asset monitoring. Track days elapsed across key verification touchpoints and access detailed history.
              </p>
            </div>

            {/* Quick Search and Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search code, title, locality, owner..."
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
                <option value="Plot">Plot</option>
                <option value="Flat">Flat</option>
                <option value="Independent House">Independent House</option>
                <option value="Commercial">Commercial</option>
                <option value="Joint Venture">Joint Venture</option>
              </select>

              <button
                onClick={() => setCurrentPage('property_create')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Property
              </button>
            </div>
          </div>

          {/* Explanatory Guide Box Matching Document Page 1 Annotations */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-950 flex items-start gap-3 shadow-xs">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-amber-900">How to read this matrix: </span>
              The top number in each box indicates the <strong className="font-semibold text-red-700">"Nos of Day passed after the activities is done"</strong>.
              Click the blue circular arrow <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold mx-1">➔</span> to open the <strong className="font-semibold">"Specific Property CRM Page"</strong> with the complete auto-logged history and activity tables.
            </div>
          </div>

          {/* Property Matrix Table / Rows matching Document Page 1 */}
          <div className="space-y-3">
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                No properties found matching criteria.
              </div>
            ) : (
              filteredProperties.map((prop) => {
                const metrics = getPropertyMetrics(prop.id);

                return (
                  <div
                    key={prop.id}
                    id={`crm-property-row-${prop.id}`}
                    className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Left: Property Title, Code & Key Identifiers */}
                    <div className="lg:w-1/4 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-[10px] border border-blue-200">
                          {prop.propertyCode}
                        </span>
                        <button
                          onClick={() => setSelectedPropertyId(prop.id)}
                          className="text-left font-bold text-slate-900 hover:text-blue-600 text-sm transition line-clamp-1"
                          title="Click to view detailed CRM page"
                        >
                          {prop.title}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {prop.propertyType}
                        </span>
                        <span className="text-emerald-700 font-bold">
                          {prop.price}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span>{prop.sizeSqFt} sq ft</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-0.5 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {prop.locality}
                        </span>
                        {prop.ownerName && (
                          <span className="text-slate-400 truncate">
                            Owner: {prop.ownerName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Horizontal Activity Step Blocks (Dynamic from Tag Master) */}
                    <div className="flex-1 overflow-x-auto pb-1 lg:pb-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-[560px]">
                        {currentActivities.slice(0, 5).map((act, idx) => {
                          const days = getPropertyDays(prop.id, act.name);
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
                            <div key={`prop-top-act-${act.id}-${idx}`} className="flex-1 text-center">
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
                        id={`btn-open-property-crm-${prop.id}`}
                        onClick={() => setSelectedPropertyId(prop.id)}
                        className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow hover:shadow-md transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title="Click to go to Specific Property page for detailed CRM"
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
        /* Specific Property CRM Page matching Page 1 bottom & Page 2 of document */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Header & Back Navigation */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="btn-back-to-property-list"
                  onClick={() => setSelectedPropertyId(null)}
                  className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
                  title="Back to CRM for Property list"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-200">
                      {selectedProperty.propertyCode}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                      Specific Property CRM Page
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                    {selectedProperty.title}
                  </h1>
                </div>
              </div>

              {/* Status and Action badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 font-semibold border border-purple-200">
                  {selectedProperty.propertyType}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  {selectedProperty.crmStage}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                  {selectedProperty.status}
                </span>
                {selectedProperty.isLocked && (
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
                <span className="text-slate-400 text-[11px]">Expected Price</span>
                <p className="font-bold text-emerald-700 mt-0.5">
                  {selectedProperty.price}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Locality & Address</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {selectedProperty.locality}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Size & Layout</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  {selectedProperty.sizeSqFt} sq ft {selectedProperty.groundArea ? `(${selectedProperty.groundArea})` : ''}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Owner Contact</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {selectedProperty.ownerContact || selectedProperty.ownerName || 'Direct'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Two-Column Layout (Matching Page 1 bottom & Page 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: History & Auto-Logged Activities Feed (Approx 7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col h-full">
                {/* Header with Document Annotation Callout */}
                <div className="border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Property History & Activity Log
                    </h2>
                  </div>
                  <div className="mt-2 bg-blue-50/70 border border-blue-200/80 rounded-lg p-2.5 text-[11px] text-blue-950">
                    <p className="leading-relaxed">
                      <strong>Auto-Logging Engine:</strong> All details and activities are logged automatically. History is recorded here from front-page activity logs, property visits, site inspections, and buyer-seller meetings.
                    </p>
                  </div>
                </div>

                {/* Chronological Timeline Feed */}
                <div className="flex-1 overflow-y-auto max-h-[420px] pr-1 space-y-3">
                  {propertyTimeline.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No activities logged yet for this property. Use the box below to record the first entry.
                    </div>
                  ) : (
                    propertyTimeline.map((item) => (
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
                            <option key={`prop-opt-curr-${act.id}-${idx}`} value={act.name}>
                              {act.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Pending Activites (Field & Document Tasks)">
                          {pendingActivities.map((act, idx) => (
                            <option key={`prop-opt-pend-${act.id}-${idx}`} value={act.name}>
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
                      placeholder="Type details or activity update for this property..."
                      value={newActivityNotes}
                      onChange={(e) => setNewActivityNotes(e.target.value)}
                      className="flex-1 text-xs py-2 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      id="btn-save-property-activity"
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
                      const days = getPropertyDays(selectedProperty.id, act.name);
                      return (
                        <tr key={`prop-tbl1-${act.id}-${idx}`} className="hover:bg-amber-50/50 transition-colors">
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
                                onClick={() => updatePropertyMetric(selectedProperty.id, act.name, days + 1)}
                                className="text-[10px] px-1 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                                title="Add 1 day"
                              >
                                +1d
                              </button>
                              <button
                                onClick={() => updatePropertyMetric(selectedProperty.id, act.name, 0)}
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
                      const days = getPropertyDays(selectedProperty.id, act.name);
                      return (
                        <tr key={`prop-tbl2-${act.id}-${idx}`} className="hover:bg-amber-50/50 transition-colors">
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
                                    entityType: 'property',
                                    entityId: selectedProperty.id,
                                    entityName: `${selectedProperty.propertyCode} - ${selectedProperty.title}`,
                                    notes: `Completed ${act.name} for property.`,
                                    handledBy: currentUser?.username || (currentRole === 'admin' ? 'MD' : 'Staff'),
                                    status: 'Completed',
                                  };
                                  addActivityLog(newLog);
                                  updatePropertyMetric(selectedProperty.id, act.name, 0);
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
