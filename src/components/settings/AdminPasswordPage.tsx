import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppUser } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  Key,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Users,
  Building,
  Phone,
  Mail,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const AdminPasswordPage: React.FC = () => {
  const {
    users,
    currentUser,
    addUser,
    changePassword,
    loginUser,
    switchUser,
    setCurrentPage,
    currentRole,
  } = useApp();

  const [selectedAdminId, setSelectedAdminId] = useState<string>(() => {
    const firstAdmin = users.find((u) => u.role === 'admin');
    return firstAdmin ? firstAdmin.id : '';
  });

  // Change password form state
  const [oldPasswordVerify, setOldPasswordVerify] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [changeStatus, setChangeStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Add more Admin modal
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    username: '',
    fullName: '',
    password: '',
    roleProfile: 'admin' as 'super_admin' | 'admin',
    phone: '',
    email: '',
    designation: 'Managing Partner & Executive Admin',
  });
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);

  // Fast credential test form
  const [testUsername, setTestUsername] = useState('GS');
  const [testPassword, setTestPassword] = useState('success123');
  const [testResult, setTestResult] = useState<string | null>(null);

  const adminList = users.filter((u) => u.role === 'admin');
  const targetAdmin = users.find((u) => u.id === selectedAdminId) || adminList[0];

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeStatus(null);

    if (!targetAdmin) {
      setChangeStatus({ type: 'error', msg: 'No administrator selected' });
      return;
    }

    if (newPassword.length < 4) {
      setChangeStatus({ type: 'error', msg: 'New password must be at least 4 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeStatus({ type: 'error', msg: 'New passwords do not match' });
      return;
    }

    const success = changePassword(targetAdmin.id, newPassword);
    if (success) {
      setChangeStatus({
        type: 'success',
        msg: `Password for @${targetAdmin.username} (${targetAdmin.fullName}) updated successfully!`,
      });
      setOldPasswordVerify('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminForm.username.trim() || !newAdminForm.password.trim()) return;

    const created = addUser({
      username: newAdminForm.username.trim(),
      fullName: newAdminForm.fullName.trim() || newAdminForm.username.trim(),
      role: 'admin',
      roleProfile: newAdminForm.roleProfile,
      password: newAdminForm.password.trim(),
      phone: newAdminForm.phone.trim() || undefined,
      email: newAdminForm.email.trim() || undefined,
      designation: newAdminForm.designation.trim() || 'Executive Administrator',
      department: 'Corporate Governance',
      active: true,
    });

    if (created) {
      setShowAddAdminModal(false);
      setSelectedAdminId(created.id);
      setNewAdminForm({
        username: '',
        fullName: '',
        password: '',
        roleProfile: 'admin',
        phone: '',
        email: '',
        designation: 'Managing Partner & Executive Admin',
      });
    }
  };

  const handleRunCredentialTest = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginUser(testUsername, testPassword);
    if (ok) {
      setTestResult(`Authenticated successfully as @${testUsername}! Role switched.`);
    } else {
      setTestResult(`Authentication failed for @${testUsername}. Please check username and password.`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Admin Password & Security Governance
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                  {adminList.length} Active Admins
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage administrative security keys, change master passwords, and provision additional administrator accounts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="btn-add-more-admin"
            onClick={() => setShowAddAdminModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add More Admin</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('setting_role_power')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Role Power Worksheet</span>
          </button>
        </div>
      </div>

      {/* Required Admin Credentials Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GS Admin Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-xs">
                GS
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Super Administrator</span>
                <h3 className="text-base font-bold text-slate-900">Admin User Name: GS</h3>
                <p className="text-xs text-slate-500">Managing Director & Super Admin</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between font-mono">
            <span className="text-slate-500">Password:</span>
            <strong className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
              {users.find((u) => u.username === 'GS')?.password || 'success123'}
            </strong>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Power: Send & Approve All</span>
            <button
              type="button"
              onClick={() => {
                const gs = users.find((u) => u.username === 'GS');
                if (gs) {
                  setSelectedAdminId(gs.id);
                  switchUser(gs.id);
                }
              }}
              className="text-amber-600 font-semibold hover:underline"
            >
              Switch to GS
            </button>
          </div>
        </div>

        {/* MD Admin Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-slate-900 text-amber-400 font-black text-base flex items-center justify-center shadow-xs">
                MD
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Managing Partner</span>
                <h3 className="text-base font-bold text-slate-900">Admin User Name: MD</h3>
                <p className="text-xs text-slate-500">Corporate Administrator</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between font-mono">
            <span className="text-slate-500">Password:</span>
            <strong className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
              {users.find((u) => u.username === 'MD')?.password || 'winwin 123'}
            </strong>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Power: Send & Approve All</span>
            <button
              type="button"
              onClick={() => {
                const md = users.find((u) => u.username === 'MD');
                if (md) {
                  setSelectedAdminId(md.id);
                  switchUser(md.id);
                }
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Switch to MD
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                Change Password for Administrator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an administrator profile to update their sign-in credentials.
              </p>
            </div>
          </div>

          {changeStatus && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                changeStatus.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {changeStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{changeStatus.msg}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Admin Account to Update
              </label>
              <select
                value={selectedAdminId}
                onChange={(e) => setSelectedAdminId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
              >
                {adminList.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    @{admin.username} — {admin.fullName} ({admin.designation || 'Administrator'})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                id="btn-save-admin-password"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Save New Password</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewPassword('');
                  setConfirmPassword('');
                  setChangeStatus(null);
                }}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Quick Credentials Test & Verification Card */}
        <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-xs border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Quick Credential Test Login
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Verify admin or staff credentials directly to test authentication flows.
            </p>
          </div>

          {testResult && (
            <div
              className={`p-2.5 rounded-lg text-xs border ${
                testResult.includes('successfully')
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-700 text-rose-300'
              }`}
            >
              {testResult}
            </div>
          )}

          <form onSubmit={handleRunCredentialTest} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Username</label>
              <input
                type="text"
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Password</label>
              <input
                type="text"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition"
            >
              Test Sign-In
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Default Verified Credentials:</p>
            <p>• Admin 1: <strong>GS</strong> / <code>success123</code></p>
            <p>• Admin 2: <strong>MD</strong> / <code>winwin 123</code></p>
            <p>• Staff 1: <strong>Venkatesh</strong> / <code>pro123</code></p>
            <p>• Staff 2: <strong>Muthukumar</strong> / <code>pro333</code></p>
          </div>
        </div>
      </div>

      {/* Add More Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Add New Administrator Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAdminModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin User Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RK"
                    value={newAdminForm.username}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-400">Short admin identifier</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhakrishnan"
                    value={newAdminForm.fullName}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Master Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewAdminPassword ? 'text' : 'password'}
                    required
                    placeholder="Set secure password"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Tier
                  </label>
                  <select
                    value={newAdminForm.roleProfile}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, roleProfile: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="admin">Administrator (Standard Executive)</option>
                    <option value="super_admin">Super Administrator (Root Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Managing Partner"
                    value={newAdminForm.designation}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 94440 xxxxx"
                    value={newAdminForm.phone}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="admin@realestatecrm.com"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Admin Authority:</strong> This account will have full power to approve and lock potential seller leads, property inventory, and customer files.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm"
                >
                  Create Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
