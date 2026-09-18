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
import { ListOfSeller } from './components/buyers/ListOfSeller';
import { LockPotentialBuyer } from './components/buyers/LockPotentialBuyer';

// Properties
import { CreateProperty } from './components/properties/CreateProperty';
import { MoveToPotentialProperty } from './components/properties/MoveToPotentialProperty';
import { WaitingForApprovalProperty } from './components/properties/WaitingForApprovalProperty';
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
import { ListOfCustomer } from './components/customers/ListOfCustomer';
import { CustomerLeads } from './components/customers/CustomerLeads';
import { PotentialCustomerList } from './components/customers/PotentialCustomerList';
import { LockPotentialCustomer } from './components/customers/LockPotentialCustomer';

// CRM Drag & Drop Boards
import { CrmKanbanBoard } from './components/crm/CrmKanbanBoard';

// Reports & Tags
import { ReportsHub } from './components/reports/ReportsHub';
import { TagManager } from './components/tags/TagManager';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

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
        {currentPage === 'buyer_list' && <ListOfSeller />}
        {currentPage === 'buyer_lock' && <LockPotentialBuyer />}
        {(currentPage === 'crm_buyer' || currentPage === 'buyer_crm') && (
          <CrmKanbanBoard
            moduleType="buyer"
            title="CRM for Seller"
            description="Track seller interaction history, mobile calls, 121 meetings in office, property visits, and conferences with drag-and-drop pipeline progression."
          />
        )}

        {/* Property Details Module (Document Specification Workflow) */}
        {currentPage === 'property_create' && <CreateProperty />}
        {(currentPage === 'property_move_potential' || currentPage === 'property_potential') && <MoveToPotentialProperty />}
        {(currentPage === 'property_waiting_approval' || currentPage === 'property_lock') && <WaitingForApprovalProperty />}
        {currentPage === 'property_list' && <ListOfProperty />}
        {(currentPage === 'crm_property' || currentPage === 'property_crm') && (
          <CrmKanbanBoard
            moduleType="property"
            title="CRM for Property"
            description="Manage property sale lifecycle from verification to active marketing, site visits, legal approvals, and deal closings."
          />
        )}

        {/* Customer Details Module (Document Specification Workflow) */}
        {(currentPage === 'customer_add' || currentPage === 'customer_leads') && <AddCustomerLeads />}
        {(currentPage === 'customer_move_potential' || currentPage === 'customer_potential') && <MoveToPotentialCustomer />}
        {(currentPage === 'customer_waiting_approval' || currentPage === 'customer_lock') && <WaitingForApprovalCustomer />}
        {currentPage === 'customer_list' && <ListOfCustomer />}
        {(currentPage === 'crm_customer' || currentPage === 'customer_crm') && (
          <CrmKanbanBoard
            moduleType="customer"
            title="CRM for Customer"
            description="Track activities with property owners, sellers, JV promoters, and landlords with drag-and-drop status transitions."
          />
        )}

        {/* Canvas Module */}
        {(currentPage === 'seller_canvas' || currentPage === 'buyer_canvas') && <SellerCanvas />}
        {(currentPage === 'customer_canvas' || currentPage === 'reports_customer_canvas') && <CustomerCanvas />}
        {(currentPage === 'property_canvas' || currentPage === 'reports_property_canvas') && <PropertyCanvas />}

        {/* Reports Module */}
        {(currentPage === 'reports' ||
          (currentPage.startsWith('reports_') &&
            currentPage !== 'reports_customer_canvas' &&
            currentPage !== 'reports_property_canvas')) && <ReportsHub />}

        {/* Tags Taxonomy Module */}
        {(currentPage === 'tags' || currentPage.startsWith('tag_')) && <TagManager />}
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
