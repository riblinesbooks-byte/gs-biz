import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityMasterType } from '../../types';
import {
  Phone,
  Users,
  Building2,
  Home,
  MapPin,
  PhoneCall,
  Handshake,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Info,
  RefreshCw,
  FileText,
  Camera,
  ArrowRight,
  Kanban,
  CheckCircle2,
} from 'lucide-react';

export const CreateActivitiesMaster: React.FC = () => {
  const {
    activityMasters,
    addActivityMaster,
    updateActivityMaster,
    deleteActivityMaster,
    currentRole,
    setCurrentPage,
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'current' | 'pending'>('all');

  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<ActivityMasterType['category']>('Meeting');
  const [activityGroup, setActivityGroup] = useState<'current' | 'pending'>('current');
  const [description, setDescription] = useState('');
  const [defaultDuration, setDefaultDuration] = useState(30);
  const [color, setColor] = useState('#3b82f6');

  const resetForm = () => {
    setName('');
    setCode('');
    setCategory('Meeting');
    setActivityGroup('current');
    setDescription('');
    setDefaultDuration(30);
    setColor('#3b82f6');
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateActivityMaster(editingId, {
        name,
        code: code || name.toUpperCase().replace(/\s+/g, '_').slice(0, 15),
        category,
        activityGroup,
        description,
        defaultDurationMinutes: Number(defaultDuration),
        color,
      });
    } else {
      addActivityMaster({
        name,
        code: code || name.toUpperCase().replace(/\s+/g, '_').slice(0, 15),
        category,
        activityGroup,
        description,
        defaultDurationMinutes: Number(defaultDuration),
        color,
        isSystem: false,
      });
    }
    resetForm();
  };

  const startEdit = (act: ActivityMasterType) => {
    setEditingId(act.id);
    setName(act.name);
    setCode(act.code);
    setCategory(act.category);
    setActivityGroup(act.activityGroup || 'current');
    setDescription(act.description);
    setDefaultDuration(act.defaultDurationMinutes);
    setColor(act.color || '#3b82f6');
    setIsCreating(true);
  };

  const getCategoryIcon = (cat: ActivityMasterType['category'], iconName?: string) => {
    if (iconName === 'RefreshCw') return <RefreshCw className="w-4 h-4" />;
    if (iconName === 'FileText') return <FileText className="w-4 h-4" />;
    if (iconName === 'Camera') return <Camera className="w-4 h-4" />;
    if (iconName === 'Handshake') return <Handshake className="w-4 h-4" />;
    if (iconName === 'Building2') return <Building2 className="w-4 h-4" />;
    if (iconName === 'Home') return <Home className="w-4 h-4" />;
    if (iconName === 'Phone') return <Phone className="w-4 h-4" />;
    if (iconName === 'PhoneCall') return <PhoneCall className="w-4 h-4" />;
    if (iconName === 'MapPin') return <MapPin className="w-4 h-4" />;
    if (iconName === 'Users') return <Users className="w-4 h-4" />;

    switch (cat) {
      case 'Call':
        return <Phone className="w-4 h-4" />;
      case 'Conference':
        return <PhoneCall className="w-4 h-4" />;
      case 'Visit':
        return <MapPin className="w-4 h-4" />;
      case 'Meeting':
        return <Users className="w-4 h-4" />;
      default:
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  const currentGroupCount = activityMasters.filter((a) => a.activityGroup === 'current' || !a.activityGroup).length;
  const pendingGroupCount = activityMasters.filter((a) => a.activityGroup === 'pending').length;

  const filteredMasters = activityMasters.filter((act) => {
    if (activeTab === 'current') return act.activityGroup === 'current' || !act.activityGroup;
    if (activeTab === 'pending') return act.activityGroup === 'pending';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Activities Master</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {activityMasters.length} Active Types
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Configure standardized activities synchronized across <strong>CRM for Customer</strong>, <strong>CRM for Seller</strong>, and <strong>CRM for Property</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-add-activity-master"
            onClick={() => {
              resetForm();
              setIsCreating(!isCreating);
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition"
          >
            {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 text-amber-400" />}
            {isCreating ? 'Cancel' : 'Add Activity Master'}
          </button>
        </div>
      </div>

      {/* Synchronized Notice with Direct Links to CRM */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-900 flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-sm">
            <Kanban className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900">CRM Synchronization Active</div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Activities defined here populate both the <strong>Current Activites</strong> (pipeline days elapsed) and <strong>Pending Activites</strong> (document & field tasks) tables and dropdowns in Customer, Seller, and Property CRM pages.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentPage('reports_crm_customer')}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-[11px] flex items-center gap-1 transition"
          >
            Customer CRM <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
          <button
            onClick={() => setCurrentPage('reports_crm_buyer')}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-[11px] flex items-center gap-1 transition"
          >
            Seller CRM <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
          <button
            onClick={() => setCurrentPage('reports_crm_property')}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-[11px] flex items-center gap-1 transition"
          >
            Property CRM <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-md transition ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Activities ({activityMasters.length})
        </button>

        <button
          onClick={() => setActiveTab('current')}
          className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'current'
              ? 'bg-yellow-400 text-slate-950 font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Current Activites ({currentGroupCount})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Pending Activites ({pendingGroupCount})
        </button>
      </div>

      {/* Creation / Edit Form */}
      {isCreating && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-xl border border-slate-300 shadow-sm p-5 space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {editingId ? 'Edit Activity Master' : 'Create New Activity Master'}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Activity Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="act-input-name"
                type="text"
                placeholder="e.g. Staff - 121 or Document Collection"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Code</label>
              <input
                id="act-input-code"
                type="text"
                placeholder="e.g. ACT_STAFF_121"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CRM Table Group <span className="text-rose-500">*</span>
              </label>
              <select
                id="act-input-group"
                value={activityGroup}
                onChange={(e) => setActivityGroup(e.target.value as 'current' | 'pending')}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white font-medium"
              >
                <option value="current">Current Activites (Pipeline & Days Elapsed)</option>
                <option value="pending">Pending Activites (Tasks & Document Milestones)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                id="act-input-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityMasterType['category'])}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Visit">Visit</option>
                <option value="Conference">Conference</option>
                <option value="Other">Other / Review</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose / Description</label>
              <input
                id="act-input-description"
                type="text"
                placeholder="Detailed explanation of this activity"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Avg Duration (Min)</label>
                <input
                  id="act-input-duration"
                  type="number"
                  min="5"
                  max="360"
                  step="5"
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Color Tag</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full text-xs px-2 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md shadow-sm transition"
            >
              {editingId ? 'Update Activity' : 'Save Activity Master'}
            </button>
          </div>
        </form>
      )}

      {/* Grid of Activity Masters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMasters.map((act) => (
          <div
            key={act.id}
            id={`act-card-${act.id}`}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: act.color || '#3b82f6' }}
            />

            <div>
              <div className="flex items-start justify-between gap-2 mt-1">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: act.color || '#3b82f6' }}
                  >
                    {getCategoryIcon(act.category, act.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{act.name}</h3>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {act.code}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(act)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition"
                    title="Edit Activity"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteActivityMaster(act.id)}
                    disabled={act.isSystem && currentRole !== 'admin'}
                    className={`p-1 rounded transition ${
                      act.isSystem && currentRole !== 'admin'
                        ? 'text-slate-200 cursor-not-allowed'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                    title={act.isSystem && currentRole !== 'admin' ? 'System activity' : 'Delete Activity'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5">
                {act.activityGroup === 'pending' ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Pending Activites (Table 2)
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    Current Activites (Table 1)
                  </span>
                )}
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {act.category}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2 min-h-[32px]">
                {act.description || 'Standard CRM interaction pipeline milestone.'}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-[10px] text-slate-400 font-mono">
                {act.isSystem ? 'System Default' : 'Custom Added'}
              </span>
              <span>Duration: {act.defaultDurationMinutes} mins</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
