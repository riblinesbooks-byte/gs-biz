import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleProfile, RolePowerLevel } from '../../types';
import {
  ROLE_PROFILES,
  MENU_TITLES,
  SYSTEM_MODULES,
  ModuleDefinition,
} from '../../data/rolePermissions';
import {
  RotateCcw,
  Save,
  Check,
  Eye,
  EyeOff,
  UserPlus,
  Send,
  Clock,
  CheckCircle,
  Home,
  Building,
  Users,
  UserCheck,
  PhoneCall,
  Kanban,
  Activity,
  Tag,
  Layers,
  ShieldAlert,
  Sliders,
  BarChart3,
  FileSpreadsheet,
  History,
  Filter,
  Info,
  Sparkles,
  Settings,
  Search,
  Shield,
  Briefcase,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  UserPlus,
  Send,
  Clock,
  RotateCcw,
  CheckCircle,
  Home,
  Building,
  Users,
  UserCheck,
  PhoneCall,
  Kanban,
  Activity,
  Tag,
  Layers,
  ShieldAlert,
  Sliders,
  BarChart3,
  FileSpreadsheet,
  History,
  Filter,
  Settings,
};

const MENU_ICON_MAP: Record<string, React.ElementType> = {
  'Dashboard': Sparkles,
  'Seller Details': UserCheck,
  'Property Details': Home,
  'Customer Details': Users,
  'Canvas': Layers,
  'CRM': Kanban,
  'Reports': BarChart3,
  'M Reports': FileSpreadsheet,
  'Create Tag': Tag,
  'Setting': Settings,
};

export const RoleBasedPowerWorksheet: React.FC = () => {
  const {
    rolePermissions,
    updateRolePermission,
    updateRoleCategoryPower,
    resetRolePermissionsToDefault,
    addToast,
    currentUser,
    currentRole,
  } = useApp();

  // Exactly two roles: Admin and Staff
  const [selectedRole, setSelectedRole] = useState<RoleProfile>('admin');
  const [hasSaved, setHasSaved] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [powerFilter, setPowerFilter] = useState<'all' | 'edit' | 'view' | 'hide'>('all');

  const handleSetPower = (moduleId: string, power: RolePowerLevel) => {
    updateRolePermission(selectedRole, moduleId, power);
    setHasSaved(false);
  };

  const handleCategoryQuickAction = (category: string, power: RolePowerLevel) => {
    updateRoleCategoryPower(selectedRole, category, power);
    setHasSaved(false);
  };

  const handleSaveConfiguration = () => {
    setHasSaved(true);
    addToast(
      `Role power matrix for ${selectedRole.toUpperCase()} saved and applied successfully!`,
      'success'
    );
    setTimeout(() => setHasSaved(false), 3000);
  };

  // Compute power counts for selected role
  const activePermissions = rolePermissions[selectedRole] || {};
  const stats = useMemo(() => {
    let editCount = 0;
    let viewCount = 0;
    let hideCount = 0;
    SYSTEM_MODULES.forEach((m) => {
      const p = activePermissions[m.id] || (selectedRole === 'admin' ? 'edit' : 'view');
      if (p === 'edit') editCount++;
      else if (p === 'view') viewCount++;
      else if (p === 'hide') hideCount++;
    });
    return { editCount, viewCount, hideCount, total: SYSTEM_MODULES.length };
  }, [activePermissions, selectedRole]);

  // Filter modules based on search and power filter
  const filteredModules = useMemo(() => {
    return SYSTEM_MODULES.filter((module) => {
      const currentPower: RolePowerLevel =
        activePermissions[module.id] || (selectedRole === 'admin' ? 'edit' : 'view');

      // Power filter
      if (powerFilter !== 'all' && currentPower !== powerFilter) {
        return false;
      }

      // Search filter
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesName = module.name.toLowerCase().includes(query);
        const matchesCategory = module.category.toLowerCase().includes(query);
        const matchesDesc = module.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [activePermissions, selectedRole, searchFilter, powerFilter]);

  // Group filtered modules by menu title
  const modulesByMenu = useMemo(() => {
    const map = new Map<string, ModuleDefinition[]>();
    MENU_TITLES.forEach((title) => {
      const items = filteredModules.filter((m) => m.category === title);
      if (items.length > 0) {
        map.set(title, items);
      }
    });
    return map;
  }, [filteredModules]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Role Based Power Configuration
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Configure system powers across <strong>Admin</strong> and <strong>Staff</strong> roles. Review all top-level menu titles and configure powers for each of their respective below pages.
            </p>
          </div>
        </div>

        {/* Action Buttons: Reset Defaults & Save Configuration */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            id="btn-role-power-reset"
            onClick={resetRolePermissionsToDefault}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Reset to system default role permissions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            id="btn-role-power-save"
            onClick={handleSaveConfiguration}
            className={`px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer ${
              hasSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {hasSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>Saved &amp; Applied</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. SELECT ROLE PROFILE: ONLY ADMIN AND STAFF */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span>1. Select User Role to Configure (Admin &amp; Staff Only)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Active: <strong className="text-slate-700 uppercase">{selectedRole}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLE_PROFILES.map((profile) => {
            const isSelected = selectedRole === profile.id;
            const isProfileAdmin = profile.id === 'admin';
            return (
              <button
                key={profile.id}
                type="button"
                id={`role-profile-select-${profile.id}`}
                onClick={() => setSelectedRole(profile.id)}
                className={`text-left p-4 rounded-xl border transition relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-500/50'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                          isSelected
                            ? 'bg-slate-800 text-amber-400'
                            : isProfileAdmin
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isProfileAdmin ? (
                          <Shield className="w-4 h-4" />
                        ) : (
                          <Briefcase className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-black tracking-wider uppercase ${
                          isSelected ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {profile.name}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        isSelected
                          ? 'bg-slate-800 text-amber-300 border-slate-700'
                          : profile.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {profile.badge}
                    </span>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {profile.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/40 text-[11px]">
                  <span className={isSelected ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                    {isSelected ? '● Currently Configuring' : 'Click to Configure Powers'}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500 text-slate-950'
                        : 'border-slate-300 bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rule Notice Banner: User sends to approval, Admin can only approve */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-900">
            Core Approval Architecture: Staff Submits, Admin Exclusively Approves
          </p>
          <p className="text-amber-800 leading-relaxed">
            In this CRM, <strong>Staff members</strong> register inquiries and click <strong>"Send for approval"</strong> in the Move to Potential module. Only <strong>Administrators</strong> hold the power to grant final approval and lock potential Seller, Property, and Customer records. Staff logins are also restricted from modifying approved property/seller records.
          </p>
        </div>
      </div>

      {/* Filter and Quick Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="input-search-below-pages"
            placeholder="Search menu titles or below pages..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full text-xs pl-9 pr-7 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Power Level Filter & Stats */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto justify-start sm:justify-end">
          <span className="text-[11px] text-slate-400 font-medium mr-1 uppercase">Filter:</span>
          <button
            onClick={() => setPowerFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
              powerFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setPowerFilter('edit')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              powerFilter === 'edit'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Check className="w-3 h-3" />
            Full Edit ({stats.editCount})
          </button>
          <button
            onClick={() => setPowerFilter('view')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              powerFilter === 'view'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <Eye className="w-3 h-3" />
            View Only ({stats.viewCount})
          </button>
          <button
            onClick={() => setPowerFilter('hide')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              powerFilter === 'hide'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
            }`}
          >
            <EyeOff className="w-3 h-3" />
            Hidden ({stats.hideCount})
          </button>
        </div>
      </div>

      {/* 2. CONFIGURE POWERS BY ALL MENU TITLES AND THEIR RESPECTIVE BELOW PAGES */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            2. Menu Titles &amp; Respective Below Pages ({selectedRole === 'admin' ? 'ADMIN' : 'STAFF'})
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Showing {filteredModules.length} below pages across {modulesByMenu.size} menu titles
          </span>
        </div>

        {Array.from(modulesByMenu.entries()).map(([menuTitle, belowPages]) => {
          const MenuIcon = MENU_ICON_MAP[menuTitle] || Home;

          return (
            <div
              key={menuTitle}
              id={`section-menu-${menuTitle.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition"
            >
              {/* Menu Title Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-2xs">
                    <MenuIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        {menuTitle}
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                        {belowPages.length} {belowPages.length === 1 ? 'Page' : 'Below Pages'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Powers applied to navigation dropdown &amp; operational actions under{' '}
                      <strong>{menuTitle}</strong>
                    </p>
                  </div>
                </div>

                {/* Quick Action Toggles for this entire Menu Title */}
                <div className="flex items-center gap-1.5 text-xs self-end sm:self-auto">
                  <span className="text-[11px] text-slate-400 font-medium mr-1 uppercase hidden md:inline">
                    Quick Set All:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCategoryQuickAction(menuTitle, 'edit')}
                    className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition cursor-pointer"
                    title={`Set all below pages in ${menuTitle} to Full / Edit`}
                  >
                    Full / Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryQuickAction(menuTitle, 'view')}
                    className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 transition cursor-pointer"
                    title={`Set all below pages in ${menuTitle} to View Only`}
                  >
                    View Only
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryQuickAction(menuTitle, 'hide')}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-300 transition cursor-pointer"
                    title={`Hide all below pages in ${menuTitle}`}
                  >
                    Hide All
                  </button>
                </div>
              </div>

              {/* Grid of Respective Below Pages under this Menu Title */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {belowPages.map((page) => {
                  const currentPower: RolePowerLevel =
                    activePermissions[page.id] || (selectedRole === 'admin' ? 'edit' : 'view');
                  const IconComponent = ICON_MAP[page.iconName || 'Home'] || Home;

                  return (
                    <div
                      key={page.id}
                      id={`power-card-${page.id}`}
                      className={`p-3.5 rounded-xl border transition flex flex-col justify-between gap-3 ${
                        currentPower === 'edit'
                          ? 'bg-emerald-50/30 border-emerald-200 shadow-2xs'
                          : currentPower === 'view'
                          ? 'bg-blue-50/30 border-blue-200 shadow-2xs'
                          : 'bg-slate-50/80 border-slate-200 opacity-80'
                      }`}
                    >
                      {/* Sub-page Title, Icon & Description */}
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            currentPower === 'edit'
                              ? 'bg-emerald-100 text-emerald-800'
                              : currentPower === 'view'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                              {page.name}
                            </h4>
                            <span
                              className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded whitespace-nowrap ${
                                currentPower === 'edit'
                                  ? 'bg-emerald-600 text-white'
                                  : currentPower === 'view'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-700 text-white'
                              }`}
                            >
                              {currentPower === 'edit'
                                ? 'Full Edit'
                                : currentPower === 'view'
                                ? 'View Only'
                                : 'Hidden'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {page.description}
                          </p>
                        </div>
                      </div>

                      {/* 3 Power Level Toggle Buttons */}
                      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200/80">
                        {/* Edit Button */}
                        <button
                          type="button"
                          id={`btn-power-${page.id}-edit`}
                          onClick={() => handleSetPower(page.id, 'edit')}
                          className={`py-1.5 px-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                            currentPower === 'edit'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {/* View Button */}
                        <button
                          type="button"
                          id={`btn-power-${page.id}-view`}
                          onClick={() => handleSetPower(page.id, 'view')}
                          className={`py-1.5 px-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                            currentPower === 'view'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>

                        {/* Hide Button */}
                        <button
                          type="button"
                          id={`btn-power-${page.id}-hide`}
                          onClick={() => handleSetPower(page.id, 'hide')}
                          className={`py-1.5 px-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                            currentPower === 'hide'
                              ? 'bg-slate-900 text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Hide</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {modulesByMenu.size === 0 && (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
            <Sliders className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-700">No below pages match your filter</p>
            <p className="text-xs text-slate-400 mt-1">
              Try clearing the search text or selecting "All" power levels.
            </p>
            <button
              onClick={() => {
                setSearchFilter('');
                setPowerFilter('all');
              }}
              className="mt-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-md"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Sticky Bottom Save Bar for easy access without scrolling */}
      <div className="sticky bottom-4 z-20 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-amber-400 uppercase tracking-wide">
            Configuring {selectedRole === 'admin' ? 'Admin' : 'Staff'} Powers
          </span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline text-slate-300">
            {stats.editCount} Edit / {stats.viewCount} View / {stats.hideCount} Hidden
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetRolePermissionsToDefault}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSaveConfiguration}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer ${
              hasSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {hasSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-100" />
                <span>Saved &amp; Applied</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
