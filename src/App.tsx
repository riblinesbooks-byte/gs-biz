/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';

// Activities & Master
import { CreateActivitiesMaster } from './components/activities/CreateActivitiesMaster';

// Buyers
import { AddSellerLeads } from './components/buyers/AddSellerLeads';
import { BuyerLeads } from './components/buyers/BuyerLeads';
import { MoveToPotentialBuyer } from './components/buyers/MoveToPotentialBuyer';
import { WaitingForApproval } from './components/buyers/WaitingForApproval';
import { WaitingForModification } from './components/buyers/WaitingForModification';
import { ListOfSeller } from './components/buyers/ListOfSeller';
import { LockPotentialBuyer } from './components/buyers/LockPotentialBuyer';

// Properties
import { CreateProperty } from './components/properties/CreateProperty';
import { MoveToPotentialProperty } from './components/properties/MoveToPotentialProperty';
import { WaitingForApprovalProperty } from './components/properties/WaitingForApprovalProperty';
import { WaitingForModificationProperty } from './components/properties/WaitingForModificationProperty';
import { ListOfProperty } from './components/properties/ListOfProperty';
import { PotentialProperty } from './components/properties/PotentialProperty';
import { LockProperty } from './components/properties/LockProperty';
import { PropertyCanvas } from './components/canvas/PropertyCanvas';
import { CustomerCanvas } from './components/canvas/CustomerCanvas';
import { SellerCanvas } from './components/canvas/SellerCanvas';

// Customers
import { AddCustomerLeads } from './components/customers/AddCustomerLeads';
import { MoveToPotentialCustomer } from './components/customers/MoveToPotentialCustomer';
import { WaitingForApprovalCustomer } from './components/customers/WaitingForApprovalCustomer';
import { WaitingForModificationCustomer } from './components/customers/WaitingForModificationCustomer';
import { ListOfCustomer } from './components/customers/ListOfCustomer';
import { CustomerLeads } from './components/customers/CustomerLeads';
import { PotentialCustomerList } from './components/customers/PotentialCustomerList';
import { LockPotentialCustomer } from './components/customers/LockPotentialCustomer';

// CRM Modules (Document Specification Layout)
import { CustomerCrmPage } from './components/crm/CustomerCrmPage';
import { SellerCrmPage } from './components/crm/SellerCrmPage';
import { PropertyCrmPage } from './components/crm/PropertyCrmPage';

// Reports, M Reports & Tags
import { ReportsHub } from './components/reports/ReportsHub';
import { MReportsHub } from './components/m_reports/MReportsHub';
import { TagManager } from './components/tags/TagManager';

// Settings & Role Governance
import { StaffCreationPage } from './components/settings/StaffCreationPage';
import { AdminPasswordPage } from './components/settings/AdminPasswordPage';
import { RoleBasedPowerWorksheet } from './components/settings/RoleBasedPowerWorksheet';

// Auth Login Page
import { LoginPage } from './components/auth/LoginPage';

const AppContent: React.FC = () => {
  const { currentPage, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Sticky Top Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        {currentPage === 'dashboard' && <Dashboard />}

        {/* Activities Master & Tags */}
        {(currentPage === 'activities_create' || currentPage === 'activities_master') && <CreateActivitiesMaster />}

        {/* Seller Details Module */}
        {(currentPage === 'buyer_leads' || currentPage === 'buyer_add') && <AddSellerLeads />}
        {currentPage === 'buyer_move_potential' && <MoveToPotentialBuyer />}
        {currentPage === 'buyer_waiting_approval' && <WaitingForApproval />}
        {currentPage === 'buyer_waiting_modification' && <WaitingForModification />}
        {currentPage === 'buyer_list' && <ListOfSeller />}
        {currentPage === 'buyer_lock' && <LockPotentialBuyer />}
        {(currentPage === 'crm_buyer' ||
          currentPage === 'buyer_crm' ||
          currentPage === 'reports_crm_buyer') && <SellerCrmPage />}

        {/* Property Details Module (Document Specification Workflow) */}
        {currentPage === 'property_create' && <CreateProperty />}
        {(currentPage === 'property_move_potential' || currentPage === 'property_potential') && <MoveToPotentialProperty />}
        {(currentPage === 'property_waiting_approval' || currentPage === 'property_lock') && <WaitingForApprovalProperty />}
        {currentPage === 'property_waiting_modification' && <WaitingForModificationProperty />}
        {currentPage === 'property_list' && <ListOfProperty />}
        {(currentPage === 'crm_property' ||
          currentPage === 'property_crm' ||
          currentPage === 'reports_crm_property') && <PropertyCrmPage />}

        {/* Customer Details Module (Document Specification Workflow) */}
        {(currentPage === 'customer_add' || currentPage === 'customer_leads') && <AddCustomerLeads />}
        {(currentPage === 'customer_move_potential' || currentPage === 'customer_potential') && <MoveToPotentialCustomer />}
        {(currentPage === 'customer_waiting_approval' || currentPage === 'customer_lock') && <WaitingForApprovalCustomer />}
        {currentPage === 'customer_waiting_modification' && <WaitingForModificationCustomer />}
        {currentPage === 'customer_list' && <ListOfCustomer />}
        {(currentPage === 'crm_customer' ||
          currentPage === 'customer_crm' ||
          currentPage === 'reports_crm_customer') && <CustomerCrmPage />}

        {/* Canvas Module */}
        {(currentPage === 'seller_canvas' || currentPage === 'buyer_canvas') && <SellerCanvas />}
        {(currentPage === 'customer_canvas' || currentPage === 'reports_customer_canvas') && <CustomerCanvas />}
        {(currentPage === 'property_canvas' || currentPage === 'reports_property_canvas') && <PropertyCanvas />}

        {/* Reports Module */}
        {(currentPage === 'reports' ||
          (currentPage.startsWith('reports_') &&
            currentPage !== 'reports_customer_canvas' &&
            currentPage !== 'reports_property_canvas' &&
            currentPage !== 'reports_crm_customer' &&
            currentPage !== 'reports_crm_buyer' &&
            currentPage !== 'reports_crm_property')) && <ReportsHub />}

        {/* M Reports Module */}
        {currentPage === 'm_reports' && <MReportsHub initialTab="all" />}
        {currentPage === 'm_reports_sellers' && <MReportsHub initialTab="sellers" />}
        {currentPage === 'm_reports_properties' && <MReportsHub initialTab="properties" />}
        {currentPage === 'm_reports_customers' && <MReportsHub initialTab="customers" />}

        {/* Tags Taxonomy Module */}
        {(currentPage === 'tags' || currentPage.startsWith('tag_')) && <TagManager />}

        {/* Settings Module (Staff Creation, Admin Password, Role Based Power) */}
        {currentPage === 'setting_staff_creation' && <StaffCreationPage />}
        {currentPage === 'setting_admin_password' && <AdminPasswordPage />}
        {(currentPage === 'setting_role_power' || currentPage === 'settings') && (
          <RoleBasedPowerWorksheet />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Real Estate CRM Enterprise • Secured Admin / Staff Governance</span>
          <span>Property Plus • Nanganallur Voice • DAR Daily Activity Report Engine</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
