import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerLead } from '../../types';
import {
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Phone,
  Lock,
  Search,
  Building,
} from 'lucide-react';

export const PotentialCustomerList: React.FC = () => {
  const { customerLeads, moveToPotentialCustomer, setCurrentPage } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [remark, setRemark] = useState('');
  const [search, setSearch] = useState('');

  const unpromoted = customerLeads.filter((c) => !c.isPotential);
  const potentialCustomers = customerLeads.filter((c) => c.isPotential);

  const handlePromote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) return;

    moveToPotentialCustomer(selectedCustomerId, remark);
    setSelectedCustomerId('');
    setRemark('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Potential Customer List</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-semibold border border-purple-200">
              {potentialCustomers.length} Potential Customers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming property owners and sellers, verify title readiness, and send selected customer leads for Admin Approval & Locking.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('customer_lock')}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Go to Approve / Lock Customer</span>
        </button>
      </div>

      {/* Action Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-purple-600" />
          Select Specific Customer Lead to Move to Potential Customer
        </h2>

        <form onSubmit={handlePromote} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Select Customer Lead <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="">-- Choose customer lead ({unpromoted.length} available) --</option>
              {unpromoted.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.customerType} - Offering: {c.propertyOffered} in {c.locality})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Approval Submission Remark</label>
            <input
              type="text"
              placeholder="e.g. Terms negotiated, genuine seller"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={!selectedCustomerId}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <span>Promote to Potential & Send for Approval</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Unpromoted Leads */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Customer Leads Awaiting Potential Status ({unpromoted.length})
            </h3>
            <p className="text-[11px] text-slate-500">Click to elevate directly</p>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {unpromoted.map((cust) => (
              <div
                key={cust.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{cust.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {cust.contactNo}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-purple-700">{cust.customerType}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Offering: {cust.propertyOffered} ({cust.expectedPrice})
                  </div>
                </div>

                <button
                  onClick={() => moveToPotentialCustomer(cust.id)}
                  className="shrink-0 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-medium text-[11px] rounded transition flex items-center gap-1"
                >
                  <span>Promote</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}

            {unpromoted.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                All customer leads have been promoted to potential status!
              </div>
            )}
          </div>
        </div>

        {/* Right: Potential Customers */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Current Potential Customers ({potentialCustomers.length})
              </h3>
              <p className="text-[11px] text-slate-500">Sent for Admin Approval & Locking</p>
            </div>
            <button
              onClick={() => setCurrentPage('customer_lock')}
              className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Admin Lock Portal <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {potentialCustomers.map((cust) => (
              <div
                key={cust.id}
                className={`p-3 rounded-lg border text-xs ${
                  cust.isLocked
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-purple-200 bg-purple-50/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    {cust.name}
                    {cust.isLocked && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Locked
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-purple-700">{cust.customerType}</span>
                </div>

                <div className="text-[11px] text-slate-600 mt-1">
                  Offering: <strong>{cust.propertyOffered}</strong> • {cust.locality}
                </div>

                <p className="text-[11px] text-slate-500 mt-1.5 italic bg-white/70 p-1.5 rounded border border-slate-100">
                  {cust.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
