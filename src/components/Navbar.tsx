import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NavigationPage } from '../types';
import {
  Building2,
  UserCheck,
  Home,
  Users,
  BarChart3,
  Tag,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  Search,
  RotateCcw,
  Sparkles,
  Lock,
  Kanban,
  FileSpreadsheet,
  Layers,
  PhoneCall,
  Flame,
} from 'lucide-react';

interface DropdownItem {
  id: NavigationPage;
  label: string;
  badge?: number | string;
  isLockedItem?: boolean;
}

interface MenuSection {
  title: string;
  icon: React.ElementType;
  items: DropdownItem[];
}

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    currentRole,
    setRole,
    searchQuery,
    setSearchQuery,
    buyerLeads,
    properties,
    customerLeads,
    resetAllData,
  } = useApp();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Counts for badges
  const potentialBuyersCount = buyerLeads.filter((b) => b.isPotential && !b.isLocked).length;
  const waitingApprovalCount = buyerLeads.filter((b) => b.waitingForApproval && !b.isLocked).length;
  const approvedSellersCount = buyerLeads.filter((b) => b.isLocked || b.potentialApproved).length;
  const potentialPropsCount = properties.filter((p) => p.isPotential && !p.isLocked).length;
  const waitingPropertyApprovalCount = properties.filter((p) => (p.waitingForApproval || (p.isPotential && !p.isApproved)) && !p.isLocked).length;
  const approvedPropertyCount = properties.filter((p) => p.isLocked || p.isApproved).length;
  const lockedPropsCount = properties.filter((p) => p.isLocked).length;
  const potentialCustCount = customerLeads.filter((c) => c.isPotential && !c.isLocked).length;
  const waitingCustomerApprovalCount = customerLeads.filter((c) => (c.waitingForApproval || (c.isPotential && !c.isApproved)) && !c.isLocked).length;
  const approvedCustomerCount = customerLeads.filter((c) => c.isLocked).length;

  const menuSections: MenuSection[] = [
    {
      title: 'Seller Details',
      icon: UserCheck,
      items: [
        { id: 'buyer_add', label: 'Add Seller Leads' },
        { id: 'buyer_move_potential', label: 'Move to Potential Seller' },
        { id: 'buyer_waiting_approval', label: 'Waiting for approval', badge: waitingApprovalCount },
        { id: 'buyer_list', label: 'List of Seller', badge: approvedSellersCount },
      ],
    },
    {
      title: 'Property Details',
      icon: Home,
      items: [
        { id: 'property_create', label: 'Create Property' },
        { id: 'property_move_potential', label: 'Move to Potential Property' },
        { id: 'property_waiting_approval', label: 'Waiting for approval Property', badge: waitingPropertyApprovalCount },
        { id: 'property_list', label: 'List of Property', badge: approvedPropertyCount },
      ],
    },
    {
      title: 'Customer Details',
      icon: Users,
      items: [
        { id: 'customer_add', label: 'Add Customer Leads' },
        { id: 'customer_move_potential', label: 'Move to Potential Customer' },
        { id: 'customer_waiting_approval', label: 'Waiting for approval Customer', badge: waitingCustomerApprovalCount },
        { id: 'customer_list', label: 'List of Customer', badge: approvedCustomerCount },
      ],
    },
    {
      title: 'Canvas',
      icon: Layers,
      items: [
        { id: 'seller_canvas', label: 'View Seller Canvas' },
        { id: 'customer_canvas', label: 'View Customer Canvas' },
        { id: 'property_canvas', label: 'View Property Canvas' },
      ],
    },
    {
      title: 'CRM',
      icon: Kanban,
      items: [
        { id: 'reports_crm_buyer', label: 'CRM for Seller Report' },
        { id: 'reports_crm_property', label: 'CRM for Property Report' },
        { id: 'reports_crm_customer', label: 'CRM for Customer Report' },
      ],
    },
    {
      title: 'Reports',
      icon: BarChart3,
      items: [
        { id: 'reports_buyers', label: 'List of Sellers' },
        { id: 'reports_leads', label: 'List of Customer Leads' },
        { id: 'reports_properties', label: 'List of Property' },
        { id: 'reports_activities_filter', label: 'Activities Filter' },
        { id: 'reports_enquiry_stats', label: 'Enquiry Statistics' },
        { id: 'reports_ads', label: 'Weekly Advertisement Report' },
      ],
    },
    {
      title: 'Create Tag',
      icon: Tag,
      items: [
        { id: 'activities_master', label: 'Create Activities Master' },
        { id: 'tag_enquiry_source', label: 'Enquiry Source' },
        { id: 'tag_buyer_status', label: 'Seller Status' },
        { id: 'tag_customer_status', label: 'Customer Status' },
      ],
    },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (page: NavigationPage) => {
    setCurrentPage(page);
    setOpenDropdown(null);
  };

  return (
    <header
      ref={navRef}
      id="top-fixed-navbar"
      className="sticky top-0 z-50 bg-slate-900 text-slate-100 shadow-md border-b border-slate-800"
    >
      {/* Top Banner with Role Switcher & Fast Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between min-h-[3.5rem] py-1.5 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="brand-home-button"
              onClick={() => handleNavigate('dashboard')}
              className="flex items-center space-x-2 text-left hover:opacity-90 transition-opacity focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  Real Estate CRM
                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    Pro
                  </span>
                </span>
                <p className="text-[11px] text-slate-400 -mt-0.5">Activities & Deal Pipeline</p>
              </div>
            </button>
          </div>

          {/* Quick Search */}
          <div className="hidden sm:flex items-center flex-1 max-w-xs mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="global-search-input"
                type="text"
                placeholder="Search leads, plots, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 text-xs text-white placeholder-slate-400 pl-9 pr-3 py-1.5 rounded-md border border-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Controls: Role Switcher & Sample Data Reset */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Role Simulation Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                id="role-admin-toggle"
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
                  currentRole === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Admin Login: Can approve, lock, unlock and delete all records"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
              <button
                id="role-staff-toggle"
                onClick={() => setRole('staff')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
                  currentRole === 'staff'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Staff Login: Restricted. Cannot delete or alter Approved/Locked potential records"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Staff</span>
              </button>
            </div>

            {/* Reset mock data button */}
            <button
              id="reset-sample-data-button"
              onClick={resetAllData}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
              title="Reset records to default sample data (from PDF records)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Navigation Bar (Permanently visible at all zoom levels) */}
        <nav
          id="main-navigation-menu"
          className="flex flex-wrap items-center gap-1 sm:gap-1.5 py-1.5 border-t border-slate-800/80 text-xs font-medium"
        >
          {/* Dashboard Button */}
          <button
            id="nav-item-dashboard"
            onClick={() => handleNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
              currentPage === 'dashboard'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Dashboard
          </button>

          {/* Dynamic Dropdown Sections */}
          {menuSections.map((section, index) => {
            const isSectionActive = section.items.some((item) => item.id === currentPage);
            const isOpen = openDropdown === section.title;
            const Icon = section.icon;
            const isRightEdge = index >= menuSections.length - 2;

            return (
              <div key={section.title} className="relative shrink-0">
                <button
                  id={`nav-menu-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setOpenDropdown(isOpen ? null : section.title)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md flex items-center gap-1.5 transition whitespace-nowrap ${
                    isSectionActive
                      ? 'bg-slate-800 text-amber-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`dropdown-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`absolute ${
                      isRightEdge ? 'right-0' : 'left-0'
                    } mt-1 w-64 max-w-[calc(100vw-1.5rem)] bg-slate-900 border border-slate-700/90 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1`}
                  >
                    <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                      {section.title}
                    </div>
                    {section.items.map((subItem) => {
                      const isSubActive = currentPage === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          id={`nav-link-${subItem.id}`}
                          onClick={() => handleNavigate(subItem.id)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                            isSubActive
                              ? 'bg-amber-500/15 text-amber-400 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {subItem.isLockedItem && <Lock className="w-3 h-3 text-amber-400" />}
                            {subItem.label}
                          </span>
                          {subItem.badge !== undefined && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {subItem.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
