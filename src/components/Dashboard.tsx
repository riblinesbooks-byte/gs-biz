import React, { useState, useId } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
  ShieldAlert,
  Save,
  Sparkles,
  UserCheck,
  Home,
  CalendarCheck,
  Lock,
  Calendar,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

interface NewLeadRow {
  id: string;
  who: 'Seller' | 'Customer';
  name: string;
  mobile: string;
  propertyType: string;
  propertyArea: string;
  propertyAddress: string;
  isSaved?: boolean;
  isBlacklisted?: boolean;
}

interface FollowUpRow {
  id: string;
  who: 'Seller' | 'Customer';
  contactId: string;
  name: string;
  type: string;
  mobile: string;
  activity: string;
  propertyType: string;
  propertyArea: string;
  propertyAddress: string;
  isLogged?: boolean;
}

const PROPERTY_TYPES = [
  'Plot',
  'Commercial Plot',
  '2 BHK Flat',
  '3 BHK Flat',
  'Independent House',
  'Commercial Building',
  'Villa',
  'Farm Land',
  'Warehouse / Industrial',
];

export const Dashboard: React.FC = () => {
  const {
    currentRole,
    setCurrentPage,
    buyerLeads,
    addBuyerLead,
    customerLeads,
    addCustomerLead,
    properties,
    activityMasters,
    activityLogs,
    addActivityLog,
    blacklistedContacts,
    addToBlacklist,
    removeFromBlacklist,
    addToast,
  } = useApp();

  const datalistId = useId();

  // Active view tab: spreadsheet by default
  const [activeTab, setActiveTab] = useState<'spreadsheet' | 'blacklist' | 'executive'>('spreadsheet');

  // Excel Date header
  const todayStr = new Date().toISOString().split('T')[0];
  const [sheetDate, setSheetDate] = useState<string>(todayStr);

  // Rows for "Daily New Leads Form"
  const [leadRows, setLeadRows] = useState<NewLeadRow[]>([
    {
      id: 'lead-row-1',
      who: 'Seller',
      name: '',
      mobile: '',
      propertyType: '',
      propertyArea: '',
      propertyAddress: '',
    },
    {
      id: 'lead-row-2',
      who: 'Seller',
      name: '',
      mobile: '',
      propertyType: '',
      propertyArea: '',
      propertyAddress: '',
    },
    {
      id: 'lead-row-3',
      who: 'Customer',
      name: '',
      mobile: '',
      propertyType: '',
      propertyArea: '',
      propertyAddress: '',
    },
    {
      id: 'lead-row-4',
      who: 'Customer',
      name: '',
      mobile: '',
      propertyType: '',
      propertyArea: '',
      propertyAddress: '',
    },
  ]);

  // Rows for "Daily Follow up Form"
  const [followUpRows, setFollowUpRows] = useState<FollowUpRow[]>([
    {
      id: 'fu-row-1',
      who: 'Seller',
      contactId: '',
      name: '',
      type: '',
      mobile: '',
      activity: 'Mobile call',
      propertyType: '',
      propertyArea: '',
      propertyAddress: '',
    },
    {
      id: 'fu-row-2',
      who: 'Seller',
      contactId: '',
      name: '',
      type: '',
      mobile: '',
      activity: '121 meeting in office',
      propertyType: '',
      propertyArea: '',
      propertyAddress: '',
    },
    {
      id: 'fu-row-3',
      who: 'Customer',
      contactId: '',
      name: '',
      type: '',
      mobile: '',
      activity: 'Property visit',
      propertyType: '',
      propertyArea: '',
      propertyAddress: '',
    },
    {
      id: 'fu-row-4',
      who: 'Customer',
      contactId: '',
      name: '',
      type: '',
      mobile: '',
      activity: 'Mobile call',
      propertyType: '',
      propertyArea: '',
      propertyAddress: '',
    },
  ]);

  // Handle updates in Daily New Leads Form
  const updateLeadRow = (id: string, field: keyof NewLeadRow, value: any) => {
    setLeadRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Add Row in New Leads Form
  const addLeadRow = () => {
    const newId = `lead-row-${Date.now()}`;
    setLeadRows((prev) => [
      ...prev,
      {
        id: newId,
        who: 'Seller',
        name: '',
        mobile: '',
        propertyType: '',
        propertyArea: '',
        propertyAddress: '',
      },
    ]);
    addToast('Added new lead row in spreadsheet', 'info');
  };

  const removeLeadRow = (id: string) => {
    if (leadRows.length <= 1) {
      addToast('Cannot remove last row', 'error');
      return;
    }
    setLeadRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Handle "Save as New Seller / Customer"
  const handleSaveLeadRow = (row: NewLeadRow) => {
    if (!row.name.trim() || !row.mobile.trim()) {
      addToast('Please enter both Name and Mobile No before saving.', 'error');
      return;
    }

    if (row.who === 'Seller') {
      addBuyerLead({
        date: sheetDate,
        name: row.name.trim(),
        contactNo: row.mobile.trim(),
        enquiryMode: 'Direct Walk-in',
        enquiryFor: 'Selling Property',
        propertyType: row.propertyType.trim() || 'Plot',
        budget: row.propertyArea ? `Area: ${row.propertyArea}` : 'Standard',
        preferredLocality: row.propertyArea.trim() || 'Chennai',
        requirement: `Property Address: ${row.propertyAddress || 'Not specified'}. Registered via Excel Dashboard on ${sheetDate}.`,
        firstCallHandledBy: currentRole === 'admin' ? 'Admin' : 'Staff',
        recentUpdate: 'Entered via Excel Dashboard',
        comments: `Property Type: ${row.propertyType || 'Plot'}, Locality: ${row.propertyArea || 'Chennai'}`,
        isPotential: false,
        potentialApproved: false,
        isLocked: false,
        crmStage: 'New Lead',
        tags: ['Daily Sheet Intake'],
      });
      addToast(`Saved "${row.name}" as New Seller Lead!`, 'success');
    } else {
      addCustomerLead({
        date: sheetDate,
        name: row.name.trim(),
        contactNo: row.mobile.trim(),
        propertyType: row.propertyType.trim() || 'Plot',
        propertyArea: row.propertyArea.trim() || '2400 sq ft',
        propertyAddress: row.propertyAddress.trim() || 'Nanganallur, Chennai',
        customerType: 'Seller',
        propertyOffered: `${row.propertyType.trim() || 'Plot'} (${row.propertyArea.trim() || 'Standard'}) at ${row.propertyAddress.trim() || 'Chennai'}`,
        locality: row.propertyAddress.trim() || row.propertyArea.trim() || 'Chennai',
        expectedPrice: 'Market Rate',
        notes: `Property Address: ${row.propertyAddress || 'Not specified'}. Registered via Excel Dashboard on ${sheetDate}.`,
        handledBy: currentRole === 'admin' ? 'Admin' : 'Staff',
        isPotential: false,
        isApproved: false,
        waitingForApproval: false,
        isLocked: false,
        crmStage: 'Lead Intake',
        statusTag: 'New Lead',
      });
      addToast(`Saved "${row.name}" as New Customer Lead!`, 'success');
    }

    setLeadRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, isSaved: true } : r))
    );
  };

  // Handle "Send to blacklisted"
  const handleSendToBlacklist = (row: NewLeadRow) => {
    if (!row.mobile.trim()) {
      addToast('Cannot blacklist without a mobile number.', 'error');
      return;
    }

    addToBlacklist({
      name: row.name.trim() || 'Unknown Lead',
      mobile: row.mobile.trim(),
      who: row.who,
      reason: `Flagged from Daily New Leads sheet on ${sheetDate}`,
    });

    setLeadRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, isBlacklisted: true } : r))
    );
  };

  // Save All Unsaved Leads in the table
  const handleSaveAllLeads = () => {
    let savedCount = 0;
    leadRows.forEach((row) => {
      if (!row.isSaved && !row.isBlacklisted && row.name.trim() && row.mobile.trim()) {
        handleSaveLeadRow(row);
        savedCount++;
      }
    });
    if (savedCount === 0) {
      addToast('No valid unsaved lead rows found. Fill Name & Mobile No.', 'info');
    } else {
      addToast(`Successfully saved ${savedCount} new leads into CRM!`, 'success');
    }
  };

  // Handle updates in Daily Follow up Form
  const updateFollowUpRow = (id: string, field: keyof FollowUpRow, value: any) => {
    setFollowUpRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        const updated = { ...row, [field]: value };

        if (field === 'who') {
          updated.contactId = '';
          updated.name = '';
          updated.type = '';
          updated.mobile = '';
          updated.propertyType = '';
          updated.propertyArea = '';
          updated.propertyAddress = '';
        }

        if (field === 'contactId') {
          if (updated.who === 'Seller') {
            const seller = buyerLeads.find((b) => b.id === value);
            if (seller) {
              updated.name = seller.name;
              updated.type = seller.isLocked
                ? 'Locked Potential Seller'
                : seller.isPotential
                ? 'Potential Seller'
                : 'New Seller Lead';
              updated.mobile = seller.contactNo;
              updated.propertyType = seller.propertyType || 'Plot';
              updated.propertyArea = seller.preferredLocality || '';
              updated.propertyAddress = seller.requirement?.split('.')[0] || seller.preferredLocality || '';
            }
          } else {
            const customer = customerLeads.find((c) => c.id === value);
            if (customer) {
              updated.name = customer.name;
              updated.type = customer.isLocked
                ? 'Locked Potential Customer'
                : customer.isPotential
                ? 'Potential Customer'
                : 'New Customer Lead';
              updated.mobile = customer.contactNo;
              updated.propertyType = customer.propertyOffered || 'Plot';
              updated.propertyArea = customer.locality || '';
              updated.propertyAddress = customer.notes?.split('.')[0] || customer.locality || '';
            }
          }
        }

        return updated;
      })
    );
  };

  // Add Row in Follow-up Form
  const addFollowUpRow = () => {
    const newId = `fu-row-${Date.now()}`;
    setFollowUpRows((prev) => [
      ...prev,
      {
        id: newId,
        who: 'Seller',
        contactId: '',
        name: '',
        type: '',
        mobile: '',
        activity: 'Mobile call',
        propertyType: '',
        propertyArea: '',
        propertyAddress: '',
      },
    ]);
    addToast('Added follow-up row in spreadsheet', 'info');
  };

  const removeFollowUpRow = (id: string) => {
    if (followUpRows.length <= 1) {
      addToast('Cannot remove last row', 'error');
      return;
    }
    setFollowUpRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Log Follow-up Activity
  const handleLogFollowUp = (row: FollowUpRow) => {
    if (!row.name) {
      addToast('Please select a contact from the Name list first.', 'error');
      return;
    }

    addActivityLog({
      date: sheetDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activityTypeId: 'act-1',
      activityTypeName: row.activity || 'Mobile call',
      entityType: row.who === 'Seller' ? 'buyer' : 'customer',
      entityId: row.contactId,
      entityName: row.name,
      contactNumber: row.mobile,
      propertyType: row.propertyType,
      notes: `Follow-up on ${row.propertyType} at ${row.propertyArea || 'area'} (${row.type}). Address: ${row.propertyAddress || 'N/A'}. Logged via Excel Dashboard.`,
      handledBy: currentRole === 'admin' ? 'Admin' : 'Staff',
      status: 'Completed',
    });

    setFollowUpRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, isLogged: true } : r))
    );
    addToast(`Logged activity "${row.activity}" for ${row.name}!`, 'success');
  };

  // Export full sheet as CSV
  const handleExportCSV = () => {
    let csv = `EXCEL REAL ESTATE CRM - DAILY SPREADSHEET (${sheetDate})\n\n`;
    csv += `DAILY NEW LEADS FORM\n`;
    csv += `Who,Name,Mobile No,Property Type,Property Area,Property Address,Status\n`;
    leadRows.forEach((r) => {
      csv += `"${r.who}","${r.name}","${r.mobile}","${r.propertyType}","${r.propertyArea}","${r.propertyAddress}","${
        r.isSaved ? 'Saved' : r.isBlacklisted ? 'Blacklisted' : 'Draft'
      }"\n`;
    });

    csv += `\nDAILY FOLLOW UP FORM\n`;
    csv += `Who,Name,Type,Mobile No,Activity,Property Type,Property Area,Property Address,Status\n`;
    followUpRows.forEach((r) => {
      csv += `"${r.who}","${r.name}","${r.type}","${r.mobile}","${r.activity}","${r.propertyType}","${r.propertyArea}","${r.propertyAddress}","${
        r.isLogged ? 'Logged' : 'Pending'
      }"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RealEstate_Daily_Sheet_${sheetDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Spreadsheet exported to CSV successfully!', 'success');
  };

  // Calculations for Executive Overview
  const potentialBuyers = buyerLeads.filter((b) => b.isPotential);
  const lockedBuyers = buyerLeads.filter((b) => b.isLocked);
  const lockedCustomers = customerLeads.filter((c) => c.isLocked);

  return (
    <div className="space-y-4 pb-14 font-sans max-w-[1500px] mx-auto">
      {/* Top Header Card: Presentable, Clean, Professional */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Daily Intake & Follow-up Register
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Live Spreadsheet
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive workspace for intake of new leads, instant blacklist routing, and daily follow-up tracking.
            </p>
          </div>
        </div>

        {/* Centered / Prominent Date Control */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-700 px-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Date
          </span>
          <input
            type="date"
            value={sheetDate}
            onChange={(e) => setSheetDate(e.target.value)}
            className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-bold text-slate-900 shadow-2xs outline-none focus:border-emerald-600 cursor-pointer"
          />
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSaveAllLeads}
            className="px-3 py-1.5 bg-[#107c41] hover:bg-[#0e6b37] text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save All Leads
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-slate-200 gap-2 px-1">
        <button
          onClick={() => setActiveTab('spreadsheet')}
          className={`px-4 py-2 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'spreadsheet'
              ? 'border-emerald-600 text-emerald-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Daily Leads & Follow-up
        </button>

        <button
          onClick={() => setActiveTab('blacklist')}
          className={`px-4 py-2 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'blacklist'
              ? 'border-red-600 text-red-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-600" />
          Blacklisted Contacts ({blacklistedContacts.length})
        </button>

        <button
          onClick={() => setActiveTab('executive')}
          className={`px-4 py-2 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'executive'
              ? 'border-blue-600 text-blue-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          Executive KPI Overview
        </button>
      </div>

      {/* VIEW 1: SPREADSHEET VIEW (Clean, presentable without top/side rulers) */}
      {activeTab === 'spreadsheet' && (
        <div className="space-y-6">
          {/* SECTION 1: Daily New Leads Form */}
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
            {/* Form Section Header Bar */}
            <div className="bg-slate-100 border-b border-slate-300 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Daily New Leads Form
                </h2>
                <span className="text-[11px] text-slate-500 font-normal">
                  (Intake register for walk-in & direct callers)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={addLeadRow}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded border border-slate-300 shadow-2xs transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  Add Row
                </button>
              </div>
            </div>

            {/* Leads Spreadsheet Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[#b8cce4] text-slate-900 font-bold border-b border-slate-300">
                    <th className="w-40 border-r border-slate-300 py-2 px-3 text-center">
                      Action
                    </th>
                    <th className="w-32 border-r border-slate-300 py-2 px-3 text-center">
                      Action
                    </th>
                    <th className="w-32 border-r border-slate-300 py-2 px-3 text-center">
                      Who
                    </th>
                    <th className="w-48 border-r border-slate-300 py-2 px-3 text-left">
                      Name
                    </th>
                    <th className="w-40 border-r border-slate-300 py-2 px-3 text-left">
                      Mobile No
                    </th>
                    <th className="w-40 border-r border-slate-300 py-2 px-3 text-left">
                      Property Type
                    </th>
                    <th className="w-40 border-r border-slate-300 py-2 px-3 text-left">
                      Property Area
                    </th>
                    <th className="min-w-[200px] border-r border-slate-300 py-2 px-3 text-left">
                      Property Address
                    </th>
                    <th className="w-24 border-r border-slate-300 py-2 px-2 text-center">
                      Status
                    </th>
                    <th className="w-12 py-2 px-2 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4d4d4]">
                  {leadRows.map((row) => {
                    const isDone = row.isSaved;
                    const isBlack = row.isBlacklisted;

                    return (
                      <tr
                        key={row.id}
                        className={`h-10 transition ${
                          isBlack
                            ? 'bg-red-50/60'
                            : isDone
                            ? 'bg-emerald-50/50'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Action 1: Send to blacklisted */}
                        <td className="border-r border-[#d4d4d4] px-3 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleSendToBlacklist(row)}
                            disabled={isBlack}
                            className={`font-semibold underline text-xs transition ${
                              isBlack
                                ? 'text-red-400 line-through cursor-not-allowed'
                                : 'text-[#002060] hover:text-red-600'
                            }`}
                            title="Send this phone number to Blacklisted Contacts"
                          >
                            {isBlack ? 'Blacklisted' : 'Send to blacklisted'}
                          </button>
                        </td>

                        {/* Action 2: Save as Button */}
                        <td className="border-r border-[#d4d4d4] px-2 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleSaveLeadRow(row)}
                            disabled={isDone || isBlack}
                            className={`px-3 py-1 rounded text-xs font-semibold transition ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                                : isBlack
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-[#002060] hover:bg-[#001848] text-white shadow-2xs active:scale-95'
                            }`}
                            title="Save lead into CRM database"
                          >
                            {isDone ? 'Saved ✓' : 'Save as'}
                          </button>
                        </td>

                        {/* Who: Dropdown */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <select
                            value={row.who}
                            disabled={isDone || isBlack}
                            onChange={(e) =>
                              updateLeadRow(row.id, 'who', e.target.value as 'Seller' | 'Customer')
                            }
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-800 font-medium outline-none focus:bg-emerald-50 cursor-pointer"
                          >
                            <option value="Seller">Seller</option>
                            <option value="Customer">Customer</option>
                          </select>
                        </td>

                        {/* Name: Type Text */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <input
                            type="text"
                            placeholder="Type Text"
                            value={row.name}
                            disabled={isDone || isBlack}
                            onChange={(e) => updateLeadRow(row.id, 'name', e.target.value)}
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-900 outline-none focus:bg-emerald-50"
                          />
                        </td>

                        {/* Mobile No: Type number as text */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <input
                            type="text"
                            placeholder="Type number as text"
                            value={row.mobile}
                            disabled={isDone || isBlack}
                            onChange={(e) => updateLeadRow(row.id, 'mobile', e.target.value)}
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-900 font-mono outline-none focus:bg-emerald-50"
                          />
                        </td>

                        {/* Property Type: Type Text / Dropdown */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <input
                            type="text"
                            list={datalistId}
                            placeholder="Type Text"
                            value={row.propertyType}
                            disabled={isDone || isBlack}
                            onChange={(e) => updateLeadRow(row.id, 'propertyType', e.target.value)}
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-900 outline-none focus:bg-emerald-50"
                          />
                        </td>

                        {/* Property Area: Type Text */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <input
                            type="text"
                            placeholder="Type Text"
                            value={row.propertyArea}
                            disabled={isDone || isBlack}
                            onChange={(e) => updateLeadRow(row.id, 'propertyArea', e.target.value)}
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-900 outline-none focus:bg-emerald-50"
                          />
                        </td>

                        {/* Property Address: Type Text */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <input
                            type="text"
                            placeholder="Type Text"
                            value={row.propertyAddress}
                            disabled={isDone || isBlack}
                            onChange={(e) => updateLeadRow(row.id, 'propertyAddress', e.target.value)}
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-900 outline-none focus:bg-emerald-50"
                          />
                        </td>

                        {/* Status Badge */}
                        <td className="border-r border-[#d4d4d4] px-2 py-1.5 text-center">
                          {isDone ? (
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                              Saved
                            </span>
                          ) : isBlack ? (
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-red-100 text-red-800">
                              Blacklisted
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">Ready</span>
                          )}
                        </td>

                        {/* Row Delete */}
                        <td className="px-2 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => removeLeadRow(row.id)}
                            className="text-slate-300 hover:text-red-500 transition p-1"
                            title="Remove this empty row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: Daily Follow up Form */}
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
            {/* Form Section Header Bar */}
            <div className="bg-slate-100 border-b border-slate-300 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Daily Follow up Form
                </h2>
                <span className="text-[11px] text-slate-500 font-normal">
                  (Select registered contact to auto-fill details and log activities)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={addFollowUpRow}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded border border-slate-300 shadow-2xs transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  Add Row
                </button>
              </div>
            </div>

            {/* Follow-up Spreadsheet Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[#b8cce4] text-slate-900 font-bold border-b border-slate-300">
                    <th className="w-32 border-r border-slate-300 py-2 px-3 text-center">
                      Who
                    </th>
                    <th className="w-56 border-r border-slate-300 py-2 px-3 text-left">
                      Name
                    </th>
                    <th className="w-44 border-r border-slate-300 py-2 px-3 text-left">
                      Type
                    </th>
                    <th className="w-36 border-r border-slate-300 py-2 px-3 text-left">
                      Mobile No
                    </th>
                    <th className="w-48 border-r border-slate-300 py-2 px-3 text-left">
                      Activity
                    </th>
                    <th className="w-40 border-r border-slate-300 py-2 px-3 text-left">
                      Property Type
                    </th>
                    <th className="w-40 border-r border-slate-300 py-2 px-3 text-left">
                      Property Area
                    </th>
                    <th className="min-w-[200px] border-r border-slate-300 py-2 px-3 text-left">
                      Property Address
                    </th>
                    <th className="w-24 border-r border-slate-300 py-2 px-2 text-center">
                      Action
                    </th>
                    <th className="w-12 py-2 px-2 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4d4d4]">
                  {followUpRows.map((row) => {
                    // Contact list filtered by row.who
                    const contactsList =
                      row.who === 'Seller'
                        ? buyerLeads.map((b) => ({ id: b.id, name: b.name, mobile: b.contactNo }))
                        : customerLeads.map((c) => ({ id: c.id, name: c.name, mobile: c.contactNo }));

                    return (
                      <tr
                        key={row.id}
                        className={`h-10 transition ${
                          row.isLogged ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Who: Dropdown */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <select
                            value={row.who}
                            onChange={(e) =>
                              updateFollowUpRow(row.id, 'who', e.target.value as 'Seller' | 'Customer')
                            }
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-800 font-medium outline-none focus:bg-blue-50 cursor-pointer"
                          >
                            <option value="Seller">Seller</option>
                            <option value="Customer">Customer</option>
                          </select>
                        </td>

                        {/* Name: Drop Down Select from List */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <select
                            value={row.contactId}
                            onChange={(e) => updateFollowUpRow(row.id, 'contactId', e.target.value)}
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-900 font-semibold outline-none focus:bg-blue-50 cursor-pointer"
                          >
                            <option value="">-- Drop Down Select from List --</option>
                            {contactsList.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.mobile})
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Type: automatic (new or potential) */}
                        <td className="border-r border-[#d4d4d4] px-3 py-1.5 text-slate-600 text-xs bg-slate-50/60 select-none">
                          {row.type ? (
                            <span className="font-semibold text-slate-800">{row.type}</span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">
                              automatic (new or potential)
                            </span>
                          )}
                        </td>

                        {/* Mobile No: automatic */}
                        <td className="border-r border-[#d4d4d4] px-3 py-1.5 text-slate-600 text-xs bg-slate-50/60 font-mono">
                          {row.mobile ? (
                            <span className="font-semibold text-slate-800">{row.mobile}</span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">automatic</span>
                          )}
                        </td>

                        {/* Activity: Drop down from activity list */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <select
                            value={row.activity}
                            onChange={(e) => updateFollowUpRow(row.id, 'activity', e.target.value)}
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-800 font-medium outline-none focus:bg-blue-50 cursor-pointer"
                          >
                            {activityMasters.length > 0 ? (
                              activityMasters.map((a, idx) => (
                                <option key={`dash-act-${a.id}-${idx}`} value={a.name}>
                                  {a.name}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="Mobile call">Mobile call</option>
                                <option value="Meeting">Meeting</option>
                                <option value="121 meeting in office">121 meeting in office</option>
                                <option value="121 in customer place">121 in customer place</option>
                                <option value="Property visit">Property visit</option>
                                <option value="Buyer and Customer Mobile Conference">
                                  Buyer and Customer Mobile Conference
                                </option>
                                <option value="Buyer and Customer 121 meeting">
                                  Buyer and Customer 121 meeting
                                </option>
                              </>
                            )}
                          </select>
                        </td>

                        {/* Property Type: prefilled or editable */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <input
                            type="text"
                            placeholder="Property Type"
                            value={row.propertyType}
                            onChange={(e) => updateFollowUpRow(row.id, 'propertyType', e.target.value)}
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-900 outline-none focus:bg-blue-50"
                          />
                        </td>

                        {/* Property Area: prefilled or editable */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <input
                            type="text"
                            placeholder="Property Area"
                            value={row.propertyArea}
                            onChange={(e) => updateFollowUpRow(row.id, 'propertyArea', e.target.value)}
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-900 outline-none focus:bg-blue-50"
                          />
                        </td>

                        {/* Property Address: prefilled or editable */}
                        <td className="border-r border-[#d4d4d4] p-0">
                          <input
                            type="text"
                            placeholder="Property Address"
                            value={row.propertyAddress}
                            onChange={(e) => updateFollowUpRow(row.id, 'propertyAddress', e.target.value)}
                            className="w-full h-full px-2.5 py-1.5 bg-transparent text-xs text-slate-900 outline-none focus:bg-blue-50"
                          />
                        </td>

                        {/* Action: Log Activity */}
                        <td className="border-r border-[#d4d4d4] px-2 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleLogFollowUp(row)}
                            className={`px-3 py-1 rounded text-xs font-semibold transition ${
                              row.isLogged
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                            }`}
                          >
                            {row.isLogged ? 'Logged ✓' : 'Log'}
                          </button>
                        </td>

                        {/* Row Delete */}
                        <td className="px-2 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => removeFollowUpRow(row.id)}
                            className="text-slate-300 hover:text-red-500 transition p-1"
                            title="Remove this row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: BLACKLISTED CONTACTS */}
      {activeTab === 'blacklist' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Blacklisted Contacts Register ({blacklistedContacts.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Contacts and telephone numbers sent to blacklisted from the Excel sheet. Prevents non-genuine broker calls.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('spreadsheet')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              ← Back to Spreadsheet
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Mobile No</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Reason</th>
                  <th className="px-3 py-2">Date Blacklisted</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blacklistedContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-bold text-slate-900">{contact.name}</td>
                    <td className="px-3 py-2.5 font-mono text-red-600 font-semibold">{contact.mobile}</td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {contact.who}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{contact.reason || 'Flagged in daily leads'}</td>
                    <td className="px-3 py-2.5 text-slate-500">{contact.blacklistedAt}</td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => removeFromBlacklist(contact.id)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                      >
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
                {blacklistedContacts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No blacklisted contacts recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: EXECUTIVE KPI OVERVIEW & MODULE LAUNCHER */}
      {activeTab === 'executive' && (
        <div className="space-y-5">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 rounded-xl p-6 border border-slate-700/80 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5" /> Real Estate Executive Overview
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    currentRole === 'admin'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  Role: {currentRole.toUpperCase()}
                </span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Activities, Leads & Property Deal Overview
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl mt-1">
                Synchronized pipeline statistics across Sellers, Customers, Properties, and Activity logs.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('spreadsheet')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg shadow transition flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Open Daily Sheet
            </button>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller Leads</span>
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{buyerLeads.length}</span>
                <span className="text-xs font-medium text-emerald-600">{potentialBuyers.length} Potential</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Locked & Approved</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" /> {lockedBuyers.length}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Properties Listed</span>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{properties.length}</span>
                <span className="text-xs font-medium text-emerald-600">
                  {properties.filter((p) => p.status === 'Available').length} Available
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Potential Verified</span>
                <span className="font-semibold text-slate-700">
                  {properties.filter((p) => p.isPotential).length} Active
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Leads</span>
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{customerLeads.length}</span>
                <span className="text-xs font-medium text-purple-600">
                  {customerLeads.filter((c) => c.isPotential).length} Qualified
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Locked Customers</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" /> {lockedCustomers.length}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logged Activities</span>
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{activityLogs.length}</span>
                <span className="text-xs font-medium text-slate-500">
                  {activityMasters.length} Activity Types
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Calls & 121 Meetings</span>
                <span className="font-semibold text-slate-700">Tracked</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Log Strip */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Recent Activity Logs
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {activityLogs.slice(-5).reverse().map((log) => (
                <div key={log.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{log.entityName}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-blue-600 font-semibold">{log.activityTypeName}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{log.notes}</p>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{log.date} {log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Datalist for Property Types */}
      <datalist id={datalistId}>
        {PROPERTY_TYPES.map((type) => (
          <option key={type} value={type} />
        ))}
      </datalist>
    </div>
  );
};
