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
} from 'lucide-react';

export const CreateActivitiesMaster: React.FC = () => {
  const { activityMasters, addActivityMaster, updateActivityMaster, deleteActivityMaster, currentRole } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<ActivityMasterType['category']>('Meeting');
  const [description, setDescription] = useState('');
  const [defaultDuration, setDefaultDuration] = useState(30);
  const [color, setColor] = useState('#3b82f6');

  const resetForm = () => {
    setName('');
    setCode('');
    setCategory('Meeting');
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
        code: code || name.toUpperCase().replace(/\s+/g, '_').slice(0, 10),
        category,
        description,
        defaultDurationMinutes: Number(defaultDuration),
        color,
      });
    } else {
      addActivityMaster({
        name,
        code: code || name.toUpperCase().replace(/\s+/g, '_').slice(0, 10),
        category,
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
    setDescription(act.description);
    setDefaultDuration(act.defaultDurationMinutes);
    setColor(act.color || '#3b82f6');
    setIsCreating(true);
  };

  const getCategoryIcon = (cat: ActivityMasterType['category'], iconName?: string) => {
    switch (cat) {
      case 'Call':
        return <Phone className="w-4 h-4" />;
      case 'Conference':
        return <PhoneCall className="w-4 h-4" />;
      case 'Visit':
        return <MapPin className="w-4 h-4" />;
      case 'Meeting':
      default:
        if (iconName === 'Handshake') return <Handshake className="w-4 h-4" />;
        if (iconName === 'Building2') return <Building2 className="w-4 h-4" />;
        if (iconName === 'Home') return <Home className="w-4 h-4" />;
        return <Users className="w-4 h-4" />;
    }
  };

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
            Configure standardized activities performed across the real estate company (Calls, 121 in Office, 121 at Client Place, Property Visits, Buyer-Customer Conferences, etc.).
          </p>
        </div>

        <button
          id="btn-add-activity-master"
          onClick={() => {
            resetForm();
            setIsCreating(!isCreating);
          }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 text-amber-400" />}
          {isCreating ? 'Cancel' : 'Add Activity Master'}
        </button>
      </div>

      {/* Info notice about company required activities */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Standard Company Activity Catalog:</span> Mobile call, meeting 1, 121 meeting in office, 121 in customer place, property visit, Buyer and Customer Mobile Conference, Buyer and Customer 121 meeting. These can be selected when logging interactions in the Daily Activity Register (DAR) or CRM pipelines.
        </div>
      </div>

      {/* Creation / Edit Form */}
      {isCreating && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 animate-in fade-in slide-in-from-top-2"
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
                placeholder="e.g. 121 in customer place"
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
                placeholder="e.g. MEET_121_CLIENT"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 uppercase"
              />
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
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Duration (Min)</label>
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tag Accent Color</label>
              <div className="flex items-center gap-2">
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
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
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
        {activityMasters.map((act) => (
          <div
            key={act.id}
            id={`act-card-${act.id}`}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: act.color || '#3b82f6' }}
            />

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

            <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 min-h-[32px]">
              {act.description || 'No specific description provided.'}
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-700">
                {act.category}
              </span>
              <span>Avg: {act.defaultDurationMinutes} mins</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
