import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerLead } from '../../types';
import {
  ShieldCheck,
  Lock,
  Search,
  Building,
  Layers,
  Phone,
  Calendar,
  ExternalLink,
  Download,
  Eye,
  X,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';

export const ListOfSeller: React.FC = () => {
  const {
    buyerLeads,
    setCurrentPage,
    currentRole,
    unlockBuyer,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedSeller, setSelectedSeller] = useState<BuyerLead | null>(null);

  // Approved and locked sellers
  const approvedSellers = buyerLeads.filter((b) => b.isLocked || b.potentialApproved);

  const filteredSellers = approvedSellers.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.contactNo.includes(search) ||
      (b.propertyAddress && b.propertyAddress.toLowerCase().includes(search.toLowerCase())) ||
      (b.propertyArea && b.propertyArea.toLowerCase().includes(search.toLowerCase()));

    const matchType = filterType === 'All' || b.propertyType === filterType;
    return matchSearch && matchType;
  });

  // Export CSV
  const handleExportCSV = () => {
    if (filteredSellers.length === 0) return;
    const headers = [
      'Date of Entry',
      'Name',
      'Mobile No',
      'Property Type',
      'Property Area',
      'Property Address',
      'Area of Land',
      'Area of Building',
      'Ownership Type',
      'Food Preference',
      'Religion',
      'Locked Status',
      'Approved By',
    ];

    const rows = filteredSellers.map((s) => [
      `"${s.date}"`,
      `"${s.name}"`,
      `"${s.contactNo}"`,
      `"${s.propertyType}"`,
      `"${s.propertyArea || ''}"`,
      `"${(s.propertyAddress || s.preferredLocality || '').replace(/"/g, '""')}"`,
      `"${s.areaOfLand || ''}"`,
      `"${s.areaOfBuilding || ''}"`,
      `"${s.ownershipType || ''}"`,
      `"${s.foodPreference || ''}"`,
      `"${s.religion || ''}"`,
      `"${s.isLocked ? 'Locked' : 'Unlocked'}"`,
      `"${s.lockedBy || 'Admin'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `List_of_Sellers_Approved_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">List of Seller</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {approvedSellers.length} Approved & Locked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official repository of verified sellers. Approved records are locked and ready for deployment in Property Canvas and CRM pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Lock Guarantee Banner as specified in Page 2 */}
      <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/30 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-amber-300">Customer Details Locked Guarantee</div>
            <p className="text-slate-300 text-[11px] mt-0.5">
              The 6 core attributes are permanently locked: <strong className="text-white">Name</strong>, <strong className="text-white">Mobile No</strong>, <strong className="text-white">Date of Entry</strong>, <strong className="text-white">Property Type</strong>, <strong className="text-white">Property Area</strong>, and <strong className="text-white">Property Address</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentPage('property_canvas')}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Property Canvas</span>
          </button>
          <button
            onClick={() => setCurrentPage('reports_crm_buyer')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs border border-slate-700 transition flex items-center gap-1"
          >
            <span>Open CRM</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Approved Seller Records</h2>
            <span className="text-[11px] text-slate-500">({filteredSellers.length} records)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="All">All Types</option>
              <option value="Plot">Plot</option>
              <option value="Flat">Flat</option>
              <option value="Independent House">Independent House</option>
              <option value="Commercial">Commercial</option>
              <option value="Joint Venture">Joint Venture</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px] tracking-wider">
                <th className="px-4 py-3">Date 🔒</th>
                <th className="px-4 py-3">Name 🔒</th>
                <th className="px-4 py-3">Mobile No 🔒</th>
                <th className="px-4 py-3">Property Type 🔒</th>
                <th className="px-4 py-3">Property Area 🔒</th>
                <th className="px-4 py-3">Property Address 🔒</th>
                <th className="px-4 py-3">Additional Details</th>
                <th className="px-4 py-3 text-right">Quick Integrations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No approved sellers found matching your query.
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/70 transition">
                    {/* Date 🔒 */}
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{seller.date}</span>
                      </div>
                    </td>

                    {/* Name 🔒 */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Lock className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{seller.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                        Approved by {seller.lockedBy || 'Admin'}
                      </span>
                    </td>

                    {/* Mobile No 🔒 */}
                    <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{seller.contactNo}</span>
                      </div>
                    </td>

                    {/* Property Type 🔒 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-600" />
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          {seller.propertyType}
                        </span>
                      </div>
                    </td>

                    {/* Property Area 🔒 */}
                    <td className="px-4 py-3 font-medium text-slate-800">
                      <div className="flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{seller.propertyArea || 'Standard'}</span>
                      </div>
                    </td>

                    {/* Property Address 🔒 */}
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={seller.propertyAddress || seller.preferredLocality}>
                      <div className="flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{seller.propertyAddress || seller.preferredLocality}</span>
                      </div>
                    </td>

                    {/* Additional Details */}
                    <td className="px-4 py-3 text-[11px] text-slate-600">
                      <div>
                        {seller.areaOfLand ? `Land: ${seller.areaOfLand}` : ''}
                        {seller.ownershipType ? ` • ${seller.ownershipType}` : ''}
                        {seller.foodPreference ? ` • ${seller.foodPreference}` : ''}
                      </div>
                      <button
                        onClick={() => setSelectedSeller(seller)}
                        className="text-[10px] text-purple-700 hover:text-purple-900 font-semibold underline mt-0.5"
                      >
                        View Full Specs
                      </button>
                    </td>

                    {/* Quick Integrations */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setCurrentPage('property_canvas')}
                          className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-[11px] border border-amber-300 transition flex items-center gap-1"
                          title="Add / Match in Property Canvas"
                        >
                          <Layers className="w-3 h-3 text-amber-600" />
                          <span>Canvas</span>
                        </button>

                        <button
                          onClick={() => setCurrentPage('reports_crm_buyer')}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] border border-slate-300 transition flex items-center gap-1"
                          title="View in CRM Report"
                        >
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                          <span>CRM</span>
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

      {/* View Full Locked Specs Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold">Approved Seller Record (Locked)</h3>
              </div>
              <button
                onClick={() => setSelectedSeller(null)}
                className="p-1 rounded text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-900 text-[11px]">
                🔒 <strong>Locked by Admin:</strong> This record cannot be deleted or modified by Staff users. All details have been verified for canvas deal matching.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium">Name:</span>
                  <div className="font-bold text-slate-900">{selectedSeller.name}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium">Mobile No:</span>
                  <div className="font-bold text-slate-900 font-mono">{selectedSeller.contactNo}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium">Date of Entry:</span>
                  <div className="font-semibold text-slate-800 font-mono">{selectedSeller.date}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium">Property Type:</span>
                  <div className="font-semibold text-blue-700">{selectedSeller.propertyType}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium">Property Area:</span>
                  <div className="font-semibold text-slate-800">{selectedSeller.propertyArea || 'Standard'}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium">Property Address:</span>
                  <div className="font-semibold text-slate-800">{selectedSeller.propertyAddress || selectedSeller.preferredLocality}</div>
                </div>
              </div>

              {/* Additional Specifications */}
              <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-purple-50/30">
                <div className="font-bold text-purple-900 text-[11px]">Additional Specifications:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-500">Area of Land:</span> <span className="font-medium text-slate-800">{selectedSeller.areaOfLand || 'Not Specified'}</span></div>
                  <div><span className="text-slate-500">Area of Building:</span> <span className="font-medium text-slate-800">{selectedSeller.areaOfBuilding || 'Not Specified'}</span></div>
                  <div><span className="text-slate-500">Ownership:</span> <span className="font-medium text-slate-800">{selectedSeller.ownershipType || 'Freehold Patta'}</span></div>
                  <div><span className="text-slate-500">Food:</span> <span className="font-medium text-slate-800">{selectedSeller.foodPreference || 'Veg'}</span></div>
                  <div className="col-span-2"><span className="text-slate-500">Religion:</span> <span className="font-medium text-slate-800">{selectedSeller.religion || 'Any'}</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>CRM Stage: <strong className="text-slate-800">{selectedSeller.crmStage}</strong></span>
                <span>Locked At: <strong className="text-slate-800 font-mono">{selectedSeller.lockedAt || selectedSeller.date}</strong></span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex items-center justify-between">
              {currentRole === 'admin' && (
                <button
                  onClick={() => {
                    unlockBuyer(selectedSeller.id);
                    setSelectedSeller(null);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Admin Unlock Record
                </button>
              )}
              <button
                onClick={() => setSelectedSeller(null)}
                className="ml-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
