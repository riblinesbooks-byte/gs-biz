import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerLead, PropertyItem, CustomerLead } from '../../types';
import {
  Kanban,
  Phone,
  Calendar,
  Lock,
  Plus,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Clock,
  User,
  Building,
  Home,
  FileText,
} from 'lucide-react';

interface CrmKanbanBoardProps {
  moduleType: 'buyer' | 'property' | 'customer';
  title: string;
  description: string;
}

export const CrmKanbanBoard: React.FC<CrmKanbanBoardProps> = ({ moduleType, title, description }) => {
  const {
    buyerLeads,
    updateBuyerCrmStage,
    properties,
    updatePropertyCrmStage,
    customerLeads,
    updateCustomerCrmStage,
    activityMasters,
    addActivityLog,
    currentRole,
  } = useApp();

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Quick activity log modal state
  const [activeItemForLog, setActiveItemForLog] = useState<{
    id: string;
    name: string;
    contact?: string;
    type: string;
  } | null>(null);

  const [selectedActivityType, setSelectedActivityType] = useState<string>('Mobile call');
  const [activityNote, setActivityNote] = useState('');
  const [activityHandledBy, setActivityHandledBy] = useState('Venkatesh');

  // Define columns based on moduleType
  const columns = (() => {
    if (moduleType === 'buyer') {
      return [
        { id: 'New Lead', title: 'New Leads', color: 'border-blue-400 bg-blue-50/20' },
        { id: 'Potential', title: 'Potential Buyer', color: 'border-purple-400 bg-purple-50/20' },
        { id: 'Site Visit Scheduled', title: 'Site Visit Scheduled', color: 'border-amber-400 bg-amber-50/20' },
        { id: 'Negotiation', title: 'In Negotiation', color: 'border-orange-400 bg-orange-50/20' },
        { id: 'Approved / Locked', title: 'Approved & Locked', color: 'border-emerald-400 bg-emerald-50/20' },
        { id: 'Deal Closed', title: 'Deal Closed', color: 'border-green-600 bg-green-50/20' },
      ];
    } else if (moduleType === 'property') {
      return [
        { id: 'Listing', title: 'New Listing', color: 'border-slate-400 bg-slate-50/20' },
        { id: 'Verification', title: 'Doc Verification', color: 'border-blue-400 bg-blue-50/20' },
        { id: 'Admin Approval', title: 'Pending Approval', color: 'border-amber-400 bg-amber-50/20' },
        { id: 'Active Marketing', title: 'Active Marketing', color: 'border-purple-400 bg-purple-50/20' },
        { id: 'Site Visits', title: 'Site Visits', color: 'border-indigo-400 bg-indigo-50/20' },
        { id: 'Under Negotiation', title: 'Negotiation', color: 'border-orange-400 bg-orange-50/20' },
        { id: 'Closed / Sold', title: 'Sold / Closed', color: 'border-emerald-500 bg-emerald-50/20' },
      ];
    } else {
      // customer
      return [
        { id: 'Lead Intake', title: 'Lead Intake', color: 'border-blue-400 bg-blue-50/20' },
        { id: 'Potential Review', title: 'Potential Review', color: 'border-purple-400 bg-purple-50/20' },
        { id: 'Property Inspection', title: 'Site Inspection', color: 'border-amber-400 bg-amber-50/20' },
        { id: 'Admin Approved', title: 'Approved & Locked', color: 'border-emerald-400 bg-emerald-50/20' },
        { id: 'Mandate Signed', title: 'Mandate Signed', color: 'border-indigo-400 bg-indigo-50/20' },
        { id: 'Completed', title: 'Completed', color: 'border-green-600 bg-green-50/20' },
      ];
    }
  })();

  // Items by module
  const items = (() => {
    if (moduleType === 'buyer') {
      return buyerLeads.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.contactNo.includes(search) ||
          b.preferredLocality.toLowerCase().includes(search.toLowerCase())
      );
    } else if (moduleType === 'property') {
      return properties.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.locality.toLowerCase().includes(search.toLowerCase()) ||
          p.ownerName.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return customerLeads.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.contactNo.includes(search) ||
          (c.locality && c.locality.toLowerCase().includes(search.toLowerCase()))
      );
    }
  })();

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (!itemId) return;

    if (moduleType === 'buyer') {
      updateBuyerCrmStage(itemId, columnId as BuyerLead['crmStage']);
    } else if (moduleType === 'property') {
      updatePropertyCrmStage(itemId, columnId as PropertyItem['crmStage']);
    } else {
      updateCustomerCrmStage(itemId, columnId as CustomerLead['crmStage']);
    }
    setDraggedItemId(null);
  };

  const handleSaveActivityModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItemForLog) return;

    addActivityLog({
      date: new Date().toISOString().split('T')[0],
      activityTypeId: activityMasters.find((m) => m.name === selectedActivityType)?.id || 'act-1',
      activityTypeName: selectedActivityType,
      entityType: moduleType,
      entityId: activeItemForLog.id,
      entityName: activeItemForLog.name,
      contactNumber: activeItemForLog.contact,
      propertyType: activeItemForLog.type,
      notes: activityNote || 'Activity logged directly from CRM Drag-and-Drop board',
      recentUpdate: activityNote || 'Activity recorded',
      comments: `Recorded in ${title}`,
      handledBy: activityHandledBy,
      status: 'Completed',
    });

    setActiveItemForLog(null);
    setActivityNote('');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <Kanban className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Drag & Drop Categorization
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter cards by name, area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Instruction Tip */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs text-slate-600 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <Kanban className="w-3.5 h-3.5 text-blue-600" />
          <strong>Drag & Drop Enabled:</strong> Click and drag any card to advance or recategorize stages. Click "+ Activity" on any card to record instant calls/meetings.
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Total in Board: <strong>{items.length}</strong>
        </span>
      </div>

      {/* Quick Activity Log Modal */}
      {activeItemForLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveActivityModal}
            className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Record CRM Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">For: {activeItemForLog.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveItemForLog(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Activity</label>
                <select
                  value={selectedActivityType}
                  onChange={(e) => setSelectedActivityType(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-white"
                >
                  {activityMasters.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Handled By</label>
                <select
                  value={activityHandledBy}
                  onChange={(e) => setActivityHandledBy(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-white"
                >
                  <option value="Venkatesh">Venkatesh</option>
                  <option value="Muthukumar">Muthukumar</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interaction Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Discussed 20th Street price. Customer agreed for office visit."
                  required
                  value={activityNote}
                  onChange={(e) => setActivityNote(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveItemForLog(null)}
                className="px-3.5 py-1.5 rounded text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
              >
                Save & Update CRM
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board Columns Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[580px]">
        {columns.map((col) => {
          let colItems: any[] = [];
          if (moduleType === 'buyer') {
            colItems = (items as BuyerLead[]).filter((b) => b.crmStage === col.id);
          } else if (moduleType === 'property') {
            colItems = (items as PropertyItem[]).filter((p) => p.crmStage === col.id);
          } else {
            colItems = (items as CustomerLead[]).filter((c) => c.crmStage === col.id);
          }

          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              id={`kanban-col-${col.id}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`w-72 shrink-0 rounded-xl border flex flex-col bg-slate-100/80 p-3 transition-colors ${
                isOver ? 'ring-2 ring-blue-500 bg-blue-50/50 border-blue-400' : 'border-slate-200'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full border ${col.color.split(' ')[0]}`}></span>
                  {col.title}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 shadow-2xs">
                  {colItems.length}
                </span>
              </div>

              {/* Cards inside Column */}
              <div className="space-y-3 min-h-[200px] flex-1">
                {colItems.map((item: any) => {
                  const isLocked = item.isLocked;

                  return (
                    <div
                      key={item.id}
                      id={`kanban-card-${item.id}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className={`bg-white rounded-lg p-3.5 border shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none ${
                        isLocked ? 'border-amber-300 bg-amber-50/15' : 'border-slate-200'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.title || item.name}
                        </h4>
                        {isLocked && (
                          <span title="Locked & Approved by Admin">
                            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          </span>
                        )}
                      </div>

                      {/* Subtitle / Details */}
                      <div className="text-[11px] text-slate-500 space-y-1 mt-1">
                        {item.contactNo && (
                          <div className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{item.contactNo}</span>
                          </div>
                        )}
                        {(item.budget || item.price) && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Value:</span>
                            <span className="font-bold text-emerald-700">{item.budget || item.price}</span>
                          </div>
                        )}
                        {(item.preferredLocality || item.locality) && (
                          <div className="text-slate-600 line-clamp-1">
                            📍 {item.preferredLocality || item.locality}
                          </div>
                        )}
                        {item.propertyType && (
                          <div className="text-slate-600 font-medium">Type: {item.propertyType}</div>
                        )}
                      </div>

                      {/* Notes / Update */}
                      {(item.recentUpdate || item.notes || item.requirement) && (
                        <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-1.5 rounded border border-slate-100 line-clamp-2 italic">
                          {item.recentUpdate || item.requirement || item.notes}
                        </p>
                      )}

                      {/* Card Action: Quick Activity Log */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono text-[10px]">
                          {item.date || 'Active'}
                        </span>
                        <button
                          onClick={() =>
                            setActiveItemForLog({
                              id: item.id,
                              name: item.title || item.name,
                              contact: item.contactNo || item.ownerContact,
                              type: item.propertyType || 'Plot',
                            })
                          }
                          className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Activity</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {colItems.length === 0 && (
                  <div className="h-28 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                    Drop items here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
