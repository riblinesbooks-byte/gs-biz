import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppUser } from '../../types';
import {
  Users,
  UserPlus,
  Key,
  CheckCircle,
  XCircle,
  Search,
  Phone,
  Mail,
  Shield,
  Briefcase,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const StaffCreationPage: React.FC = () => {
  const {
    users,
    currentUser,
    addUser,
    updateUser,
    changePassword,
    deleteUser,
    currentRole,
    setCurrentPage,
  } = useApp();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [passwordModalUser, setPasswordModalUser] = useState<AppUser | null>(null);
  const [editModalUser, setEditModalUser] = useState<AppUser | null>(null);

  // New staff form state
  const [newStaff, setNewStaff] = useState({
    username: '',
    fullName: '',
    password: '',
    phone: '',
    email: '',
    designation: 'Field Sales Executive',
    department: 'Sales & Field Visits',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Change password form state
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Edit staff form state
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    designation: '',
    department: '',
    active: true,
  });

  // Filter staff members only
  const staffList = users.filter((u) => u.role === 'staff');
  const filteredStaff = staffList.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.username.toLowerCase().includes(q) ||
      s.fullName.toLowerCase().includes(q) ||
      (s.phone && s.phone.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.designation && s.designation.toLowerCase().includes(q))
    );
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.username.trim() || !newStaff.password.trim()) return;

    const created = addUser({
      username: newStaff.username.trim(),
      fullName: newStaff.fullName.trim() || newStaff.username.trim(),
      role: 'staff',
      roleProfile: 'staff',
      password: newStaff.password.trim(),
      phone: newStaff.phone.trim() || undefined,
      email: newStaff.email.trim() || undefined,
      designation: newStaff.designation.trim() || 'Sales Executive',
      department: newStaff.department.trim() || 'Operations',
      active: true,
    });

    if (created) {
      setNewStaff({
        username: '',
        fullName: '',
        password: '',
        phone: '',
        email: '',
        designation: 'Field Sales Executive',
        department: 'Sales & Field Visits',
      });
      setShowAddModal(false);
    }
  };

  const handleOpenPasswordModal = (user: AppUser) => {
    setPasswordModalUser(user);
    setNewPasswordVal('');
    setConfirmPasswordVal('');
    setPasswordError('');
    setShowModalPassword(false);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser) return;
    if (newPasswordVal.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      return;
    }
    if (newPasswordVal !== confirmPasswordVal) {
      setPasswordError('Passwords do not match');
      return;
    }

    const success = changePassword(passwordModalUser.id, newPasswordVal);
    if (success) {
      setPasswordModalUser(null);
    }
  };

  const handleOpenEditModal = (user: AppUser) => {
    setEditModalUser(user);
    setEditForm({
      fullName: user.fullName,
      phone: user.phone || '',
      email: user.email || '',
      designation: user.designation || '',
      department: user.department || '',
      active: user.active,
    });
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalUser) return;
    updateUser(editModalUser.id, {
      fullName: editForm.fullName.trim() || editModalUser.username,
      phone: editForm.phone.trim() || undefined,
      email: editForm.email.trim() || undefined,
      designation: editForm.designation.trim() || undefined,
      department: editForm.department.trim() || undefined,
      active: editForm.active,
    });
    setEditModalUser(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Staff Creation & Directory
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
                  {staffList.length} Registered Staff
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage field personnel, provision login passwords, and maintain active CRM caller records.
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="btn-open-create-staff-modal"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('setting_role_power')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            <span>Configure Role Powers</span>
          </button>
        </div>
      </div>

      {/* Role Governance Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-4 text-xs text-blue-950 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <p className="font-semibold text-blue-900">
            Role Policy: User Submission & Admin Authorization
          </p>
          <p className="text-blue-800 leading-relaxed">
            Staff users have power to create buyer/seller leads, input phone logs, and <strong>send records for approval</strong>. Only designated <strong>Administrators</strong> hold the power to review, approve, and lock potential property and customer records.
          </p>
        </div>
      </div>

      {/* Pre-Configured Accounts Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Staff Account 1</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">Active</span>
          </div>
          <div className="font-bold text-slate-900 text-sm">Venkatesh</div>
          <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono">
            <Key className="w-3 h-3 text-slate-400" />
            <span>Password: <strong>pro123</strong></span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Staff Account 2</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">Active</span>
          </div>
          <div className="font-bold text-slate-900 text-sm">Muthukumar</div>
          <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono">
            <Key className="w-3 h-3 text-slate-400" />
            <span>Password: <strong>pro333</strong></span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Active Staff Tiers</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Verified</span>
          </div>
          <div className="font-bold text-slate-900 text-sm">{staffList.filter(s => s.active).length} Active Personnel</div>
          <div className="text-xs text-slate-500 mt-1">Field operations & phone inquiries</div>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Current Logged In</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">{currentUser.role}</span>
          </div>
          <div className="font-bold text-slate-900 text-sm">{currentUser.fullName}</div>
          <div className="text-xs text-slate-500 mt-1">User: @{currentUser.username}</div>
        </div>
      </div>

      {/* Staff Table & Search Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, username, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="text-xs text-slate-500">
            Showing {filteredStaff.length} of {staffList.length} staff accounts
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Login Username</th>
                <th className="py-3 px-4">Designation & Dept</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Password Provision</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                        {staff.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{staff.fullName}</div>
                        <div className="text-[11px] text-slate-400">Created: {staff.createdAt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    @{staff.username}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="font-medium text-slate-800">{staff.designation || 'Sales Staff'}</div>
                    <div className="text-[11px] text-slate-400">{staff.department || 'Field Operations'}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex flex-col gap-0.5">
                      {staff.phone && (
                        <span className="flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {staff.phone}
                        </span>
                      )}
                      {staff.email && (
                        <span className="flex items-center gap-1 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {staff.email}
                        </span>
                      )}
                      {!staff.phone && !staff.email && <span className="text-slate-400 italic">Not set</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleOpenPasswordModal(staff)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded border border-slate-300 flex items-center gap-1 transition"
                      title="Change password for this staff member"
                    >
                      <Key className="w-3 h-3 text-amber-600" />
                      <span>Change Password</span>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    {staff.active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3 h-3" />
                        Deactivated
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(staff)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition"
                        title="Edit Staff Info"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove staff member ${staff.fullName} (@${staff.username})?`)) {
                            deleteUser(staff.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No staff accounts match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Add New Staff Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Staff User Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh"
                    value={newStaff.username}
                    onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400">Used for CRM sign-in</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newStaff.fullName}
                    onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Set login password (e.g. pro123)"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 pr-9 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98400 xxxxx"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="staff@realestatecrm.com"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Site Visit Executive"
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sales / Field Visits"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Default permissions: Can input leads and send for approval. Admin only can approve.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Change Password for @{passwordModalUser.username}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModalUser(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="p-5 space-y-4">
              <div className="text-xs text-slate-600">
                Updating credentials for: <strong>{passwordModalUser.fullName}</strong>
              </div>

              {passwordError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password"
                    value={newPasswordVal}
                    onChange={(e) => setNewPasswordVal(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword(!showModalPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showModalPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type={showModalPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPasswordVal}
                  onChange={(e) => setConfirmPasswordVal(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Info Modal */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Edit @{editModalUser.username}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditModalUser(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-staff-active"
                  checked={editForm.active}
                  onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="chk-staff-active" className="text-xs font-medium text-slate-700">
                  Account Active (allows CRM login and field call entries)
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
