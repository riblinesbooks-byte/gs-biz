import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  NavigationPage,
  ActivityMasterType,
  ActivityLog,
  BuyerLead,
  PropertyItem,
  CustomerLead,
  TagItem,
  WeeklyAdItem,
  BlacklistedContact,
} from '../types';
import {
  initialActivityMasters,
  initialTags,
  initialProperties,
  initialBuyerLeads,
  initialCustomerLeads,
  initialActivitiesLogs,
  sampleWeeklyAds,
} from '../mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Activities Master
  activityMasters: ActivityMasterType[];
  addActivityMaster: (act: Omit<ActivityMasterType, 'id'>) => void;
  updateActivityMaster: (id: string, act: Partial<ActivityMasterType>) => void;
  deleteActivityMaster: (id: string) => boolean;

  // Activity Logs
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id'>) => void;
  updateActivityLog: (id: string, log: Partial<ActivityLog>) => void;
  deleteActivityLog: (id: string) => boolean;

  // Buyers
  buyerLeads: BuyerLead[];
  addBuyerLead: (buyer: Omit<BuyerLead, 'id'>) => void;
  updateBuyerLead: (id: string, buyer: Partial<BuyerLead>) => void;
  deleteBuyerLead: (id: string) => boolean;
  moveToPotentialBuyer: (id: string, notes?: string) => void;
  sendBuyerForApproval: (id: string, additionalDetails?: Partial<BuyerLead>) => void;
  approveAndLockBuyer: (id: string) => void;
  unlockBuyer: (id: string) => void;
  updateBuyerCrmStage: (id: string, stage: BuyerLead['crmStage']) => void;

  // Properties
  properties: PropertyItem[];
  addProperty: (prop: Omit<PropertyItem, 'id'>) => void;
  updateProperty: (id: string, prop: Partial<PropertyItem>) => void;
  deleteProperty: (id: string) => boolean;
  markPropertyPotential: (id: string) => void;
  sendPropertyForApproval: (id: string, additionalDetails?: Partial<PropertyItem>) => void;
  approveAndLockProperty: (id: string) => void;
  unlockProperty: (id: string) => void;
  updatePropertyCrmStage: (id: string, stage: PropertyItem['crmStage']) => void;

  // Customers
  customerLeads: CustomerLead[];
  addCustomerLead: (cust: Omit<CustomerLead, 'id'>) => void;
  updateCustomerLead: (id: string, cust: Partial<CustomerLead>) => void;
  deleteCustomerLead: (id: string) => boolean;
  moveToPotentialCustomer: (id: string, notes?: string) => void;
  sendCustomerForApproval: (id: string, additionalDetails?: Partial<CustomerLead>) => void;
  approveAndLockCustomer: (id: string) => void;
  unlockCustomer: (id: string) => void;
  updateCustomerCrmStage: (id: string, stage: CustomerLead['crmStage']) => void;

  // Tags
  tags: TagItem[];
  addTag: (tag: Omit<TagItem, 'id'>) => void;
  deleteTag: (id: string) => void;

  // Weekly Ads
  weeklyAds: WeeklyAdItem[];

  // Blacklist
  blacklistedContacts: BlacklistedContact[];
  addToBlacklist: (contact: { name: string; mobile: string; who: 'Seller' | 'Customer'; reason?: string }) => void;
  removeFromBlacklist: (id: string) => void;

  // Reset Data
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('crm_role') as UserRole) || 'admin';
  });

  const [currentPage, setCurrentPageState] = useState<NavigationPage>(() => {
    return (localStorage.getItem('crm_page') as NavigationPage) || 'dashboard';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (role: UserRole) => {
    setRoleState(role);
    localStorage.setItem('crm_role', role);
    addToast(`Switched active profile to ${role.toUpperCase()}`, 'info');
  };

  const setCurrentPage = (page: NavigationPage) => {
    setCurrentPageState(page);
    localStorage.setItem('crm_page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State with LocalStorage Persistence
  const [activityMasters, setActivityMasters] = useState<ActivityMasterType[]>(() => {
    const saved = localStorage.getItem('crm_act_masters');
    if (saved) {
      try {
        const parsed: ActivityMasterType[] = JSON.parse(saved);
        // If saved list already contains "Update on Job" and "Staff - Mobile Call", use it
        const hasJobUpdate = parsed.some((a) => a.name === 'Update on Job');
        const hasStaffCall = parsed.some((a) => a.name === 'Staff - Mobile Call');
        if (hasJobUpdate && hasStaffCall) {
          return parsed;
        }
        // Otherwise, merge custom activities while preserving initial standard CRM activities
        const standardNames = new Set(initialActivityMasters.map((a) => a.name.toLowerCase()));
        const customOnly = parsed.filter((a) => !standardNames.has(a.name.toLowerCase()));
        const merged = [...initialActivityMasters, ...customOnly];
        localStorage.setItem('crm_act_masters', JSON.stringify(merged));
        return merged;
      } catch (err) {
        console.error('Error parsing crm_act_masters:', err);
      }
    }
    return initialActivityMasters;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('crm_act_logs');
    return saved ? JSON.parse(saved) : initialActivitiesLogs;
  });

  const [buyerLeads, setBuyerLeads] = useState<BuyerLead[]>(() => {
    const saved = localStorage.getItem('crm_buyers');
    return saved ? JSON.parse(saved) : initialBuyerLeads;
  });

  const [properties, setProperties] = useState<PropertyItem[]>(() => {
    const saved = localStorage.getItem('crm_properties');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [customerLeads, setCustomerLeads] = useState<CustomerLead[]>(() => {
    const saved = localStorage.getItem('crm_customers');
    return saved ? JSON.parse(saved) : initialCustomerLeads;
  });

  const [tags, setTags] = useState<TagItem[]>(() => {
    const saved = localStorage.getItem('crm_tags');
    return saved ? JSON.parse(saved) : initialTags;
  });

  const [weeklyAds, setWeeklyAds] = useState<WeeklyAdItem[]>(() => {
    const saved = localStorage.getItem('crm_weekly_ads');
    return saved ? JSON.parse(saved) : sampleWeeklyAds;
  });

  const [blacklistedContacts, setBlacklistedContacts] = useState<BlacklistedContact[]>(() => {
    const saved = localStorage.getItem('crm_blacklisted');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'bl-1',
            name: 'Kannan (Spam Agent)',
            mobile: '+91 99999 11111',
            who: 'Seller',
            reason: 'Repeated non-genuine brokerage calls',
            blacklistedAt: '2026-08-18',
          },
        ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('crm_act_masters', JSON.stringify(activityMasters));
  }, [activityMasters]);

  useEffect(() => {
    localStorage.setItem('crm_act_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('crm_buyers', JSON.stringify(buyerLeads));
  }, [buyerLeads]);

  useEffect(() => {
    localStorage.setItem('crm_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('crm_customers', JSON.stringify(customerLeads));
  }, [customerLeads]);

  useEffect(() => {
    localStorage.setItem('crm_tags', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem('crm_blacklisted', JSON.stringify(blacklistedContacts));
  }, [blacklistedContacts]);

  // Blacklist Handlers
  const addToBlacklist = (contact: { name: string; mobile: string; who: 'Seller' | 'Customer'; reason?: string }) => {
    const newEntry: BlacklistedContact = {
      id: `bl-${Date.now()}`,
      name: contact.name || 'Unnamed',
      mobile: contact.mobile,
      who: contact.who,
      reason: contact.reason || 'Flagged from Daily New Leads sheet',
      blacklistedAt: new Date().toISOString().split('T')[0],
    };
    setBlacklistedContacts((prev) => [newEntry, ...prev]);
    addToast(`Blacklisted: ${newEntry.name} (${newEntry.mobile})`, 'info');
  };

  const removeFromBlacklist = (id: string) => {
    setBlacklistedContacts((prev) => prev.filter((item) => item.id !== id));
    addToast('Removed contact from blacklist', 'success');
  };

  // Activity Master Handlers
  const addActivityMaster = (act: Omit<ActivityMasterType, 'id'>) => {
    const newAct: ActivityMasterType = {
      ...act,
      id: `act-${Date.now()}`,
    };
    setActivityMasters((prev) => [newAct, ...prev]);
    addToast(`Created Activity: ${newAct.name}`, 'success');
  };

  const updateActivityMaster = (id: string, act: Partial<ActivityMasterType>) => {
    setActivityMasters((prev) => prev.map((item) => (item.id === id ? { ...item, ...act } : item)));
    addToast('Activity updated successfully', 'success');
  };

  const deleteActivityMaster = (id: string) => {
    const target = activityMasters.find((a) => a.id === id);
    if (target?.isSystem && currentRole !== 'admin') {
      addToast('System activity cannot be removed', 'error');
      return false;
    }
    setActivityMasters((prev) => prev.filter((item) => item.id !== id));
    addToast('Activity removed', 'info');
    return true;
  };

  // Activity Logs Handlers
  const addActivityLog = (log: Omit<ActivityLog, 'id'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now()}`,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    addToast(`Recorded activity for ${newLog.entityName}`, 'success');
  };

  const updateActivityLog = (id: string, log: Partial<ActivityLog>) => {
    setActivityLogs((prev) => prev.map((item) => (item.id === id ? { ...item, ...log } : item)));
    addToast('Activity log updated', 'success');
  };

  const deleteActivityLog = (id: string) => {
    setActivityLogs((prev) => prev.filter((item) => item.id !== id));
    addToast('Activity log deleted', 'info');
    return true;
  };

  // Buyers Handlers
  const addBuyerLead = (buyer: Omit<BuyerLead, 'id'>) => {
    const newBuyer: BuyerLead = {
      ...buyer,
      id: `buyer-${Date.now()}`,
    };
    setBuyerLeads((prev) => [newBuyer, ...prev]);
    addToast(`Added buyer lead: ${newBuyer.name}`, 'success');
  };

  const updateBuyerLead = (id: string, buyer: Partial<BuyerLead>) => {
    const existing = buyerLeads.find((b) => b.id === id);
    if (existing?.isLocked && currentRole === 'staff') {
      addToast('Cannot modify Locked Potential Buyer with Staff login. Admin access required.', 'error');
      return;
    }
    setBuyerLeads((prev) => prev.map((item) => (item.id === id ? { ...item, ...buyer } : item)));
    addToast('Buyer lead updated', 'success');
  };

  const deleteBuyerLead = (id: string) => {
    const existing = buyerLeads.find((b) => b.id === id);
    if (existing?.isLocked && currentRole === 'staff') {
      addToast('Permission Denied: Staff login cannot delete locked potential buyer.', 'error');
      return false;
    }
    setBuyerLeads((prev) => prev.filter((item) => item.id !== id));
    addToast('Buyer lead removed', 'info');
    return true;
  };

  const moveToPotentialBuyer = (id: string, notes?: string) => {
    setBuyerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isPotential: true,
            crmStage: 'Potential',
            recentUpdate: notes || 'Promoted to Potential Buyer pipeline',
          };
        }
        return item;
      })
    );
    addToast('Moved lead to Potential Buyer list for admin review', 'success');
  };

  const sendBuyerForApproval = (id: string, additionalDetails?: Partial<BuyerLead>) => {
    const today = new Date().toISOString().split('T')[0];
    setBuyerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...additionalDetails,
            waitingForApproval: true,
            waitingForApprovalAt: today,
            isPotential: true,
            crmStage: 'Potential',
            recentUpdate: 'Sent for Admin approval with detailed specification',
          };
        }
        return item;
      })
    );
    addToast('Seller successfully sent for Admin approval', 'success');
  };

  const approveAndLockBuyer = (id: string) => {
    if (currentRole !== 'admin') {
      addToast('Permission Denied: Only Admin can approve. Staff cannot approve.', 'error');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const targetBuyer = buyerLeads.find((b) => b.id === id);

    setBuyerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isPotential: true,
            potentialApproved: true,
            waitingForApproval: false,
            isLocked: true,
            lockedAt: today,
            lockedBy: 'Admin',
            crmStage: 'Approved / Locked',
            lockedFields: ['name', 'contactNo', 'date', 'propertyType', 'propertyArea', 'propertyAddress'],
            recentUpdate: 'Approved and locked into system by Admin',
          };
        }
        return item;
      })
    );

    // Auto-record DAR activity
    addActivityLog({
      date: today,
      activityTypeId: 'act-1',
      activityTypeName: 'Admin Approval & Locking',
      entityType: 'buyer',
      entityName: `Seller Approved: ${targetBuyer?.name || id}`,
      contactNumber: targetBuyer?.contactNo || '',
      propertyType: targetBuyer?.propertyType || 'Plot',
      budget: targetBuyer?.budget || 'Standard',
      notes: 'Approved seller by Admin. Core details locked: Name, Mobile No, Date, Property Type, Property Area, Property Address.',
      recentUpdate: 'Approved and locked',
      handledBy: 'Admin',
      status: 'Completed',
    });

    addToast('Seller approved and locked! Moved to List of Seller.', 'success');
  };

  const unlockBuyer = (id: string) => {
    if (currentRole !== 'admin') {
      addToast('Only Admin login can unlock records.', 'error');
      return;
    }
    setBuyerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isLocked: false,
          };
        }
        return item;
      })
    );
    addToast('Buyer record unlocked by Admin.', 'info');
  };

  const updateBuyerCrmStage = (id: string, stage: BuyerLead['crmStage']) => {
    setBuyerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            crmStage: stage,
            isPotential: stage !== 'New Lead' && stage !== 'Dropped' ? true : item.isPotential,
          };
        }
        return item;
      })
    );
    addToast(`Buyer moved to stage "${stage}"`, 'info');
  };

  // Properties Handlers
  const addProperty = (prop: Omit<PropertyItem, 'id'>) => {
    const newProp: PropertyItem = {
      ...prop,
      id: `prop-${Date.now()}`,
    };
    setProperties((prev) => [newProp, ...prev]);
    addToast(`Property created: ${newProp.title}`, 'success');
  };

  const updateProperty = (id: string, prop: Partial<PropertyItem>) => {
    const existing = properties.find((p) => p.id === id);
    if (existing?.isLocked && currentRole === 'staff') {
      addToast('Permission Denied: Staff login cannot edit locked property.', 'error');
      return;
    }
    setProperties((prev) => prev.map((item) => (item.id === id ? { ...item, ...prop } : item)));
    addToast('Property updated', 'success');
  };

  const deleteProperty = (id: string) => {
    const existing = properties.find((p) => p.id === id);
    if (existing?.isLocked && currentRole === 'staff') {
      addToast('Permission Denied: Staff login cannot delete locked property.', 'error');
      return false;
    }
    setProperties((prev) => prev.filter((item) => item.id !== id));
    addToast('Property deleted', 'info');
    return true;
  };

  const markPropertyPotential = (id: string) => {
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPotential: true, crmStage: 'Admin Approval' } : item))
    );
    addToast('Property marked as Potential', 'success');
  };

  const sendPropertyForApproval = (id: string, additionalDetails?: Partial<PropertyItem>) => {
    const today = new Date().toISOString().split('T')[0];
    setProperties((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...(additionalDetails || {}),
            isPotential: true,
            waitingForApproval: true,
            waitingForApprovalAt: today,
            crmStage: 'Admin Approval',
          };
        }
        return item;
      })
    );
    addToast('Property sent for Admin approval successfully.', 'success');
  };

  const approveAndLockProperty = (id: string) => {
    if (currentRole !== 'admin') {
      addToast('Permission Denied: Only Admin can approve. Staff cannot approve.', 'error');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    setProperties((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isPotential: true,
            waitingForApproval: false,
            isApproved: true,
            isLocked: true,
            lockedAt: today,
            lockedBy: 'Admin',
            lockedFields: [
              'title',
              'propertyType',
              'sizeSqFt',
              'price',
              'ownerName',
              'ownerContact',
              'locality',
              'address',
            ],
            crmStage: 'Active Marketing',
          };
        }
        return item;
      })
    );
    addToast('Property approved and locked by Admin. Protected from staff modification.', 'success');
  };

  const unlockProperty = (id: string) => {
    if (currentRole !== 'admin') {
      addToast('Only Admin can unlock properties.', 'error');
      return;
    }
    setProperties((prev) => prev.map((item) => (item.id === id ? { ...item, isLocked: false } : item)));
    addToast('Property unlocked by Admin', 'info');
  };

  const updatePropertyCrmStage = (id: string, stage: PropertyItem['crmStage']) => {
    setProperties((prev) => prev.map((item) => (item.id === id ? { ...item, crmStage: stage } : item)));
    addToast(`Property moved to stage "${stage}"`, 'info');
  };

  // Customers Handlers
  const addCustomerLead = (cust: Omit<CustomerLead, 'id'>) => {
    const newCust: CustomerLead = {
      ...cust,
      id: `cust-${Date.now()}`,
    };
    setCustomerLeads((prev) => [newCust, ...prev]);
    addToast(`Added customer lead: ${newCust.name}`, 'success');
  };

  const updateCustomerLead = (id: string, cust: Partial<CustomerLead>) => {
    const existing = customerLeads.find((c) => c.id === id);
    if (existing?.isLocked && currentRole === 'staff') {
      addToast('Permission Denied: Staff login cannot edit locked customer.', 'error');
      return;
    }
    setCustomerLeads((prev) => prev.map((item) => (item.id === id ? { ...item, ...cust } : item)));
    addToast('Customer details updated', 'success');
  };

  const deleteCustomerLead = (id: string) => {
    const existing = customerLeads.find((c) => c.id === id);
    if (existing?.isLocked && currentRole === 'staff') {
      addToast('Permission Denied: Staff login cannot delete locked customer.', 'error');
      return false;
    }
    setCustomerLeads((prev) => prev.filter((item) => item.id !== id));
    addToast('Customer lead deleted', 'info');
    return true;
  };

  const moveToPotentialCustomer = (id: string, notes?: string) => {
    setCustomerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isPotential: true,
            crmStage: 'Potential Review',
            notes: notes ? `${item.notes} | ${notes}` : item.notes,
            statusTag: 'Potential Customer',
          };
        }
        return item;
      })
    );
    addToast('Customer moved to Potential list for admin approval', 'success');
  };

  const sendCustomerForApproval = (id: string, additionalDetails?: Partial<CustomerLead>) => {
    const today = new Date().toISOString().split('T')[0];
    setCustomerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...additionalDetails,
            waitingForApproval: true,
            waitingForApprovalAt: today,
            isPotential: true,
            crmStage: 'Potential Review',
            statusTag: 'Waiting Approval',
          };
        }
        return item;
      })
    );
    addToast('Customer successfully sent for Admin approval', 'success');
  };

  const approveAndLockCustomer = (id: string) => {
    if (currentRole !== 'admin') {
      addToast('Permission Denied: Only Admin can approve. Staff cannot approve.', 'error');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const targetCust = customerLeads.find((c) => c.id === id);

    setCustomerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isPotential: true,
            isApproved: true,
            waitingForApproval: false,
            isLocked: true,
            lockedAt: today,
            lockedBy: 'Admin',
            crmStage: 'Admin Approved',
            lockedFields: ['name', 'contactNo', 'date', 'propertyType', 'propertyArea', 'propertyAddress'],
            statusTag: 'Approved & Locked',
          };
        }
        return item;
      })
    );

    // Auto-record DAR activity
    addActivityLog({
      date: today,
      activityTypeId: 'act-1',
      activityTypeName: 'Admin Approval & Locking',
      entityType: 'customer',
      entityName: `Customer Approved: ${targetCust?.name || id}`,
      contactNumber: targetCust?.contactNo || '',
      propertyType: targetCust?.propertyType || 'Plot',
      budget: targetCust?.expectedPrice || 'Standard',
      notes: 'Approved customer by Admin. Core details locked: Name, Mobile No, Date, Property Type, Property Area, Property Address.',
      recentUpdate: 'Approved and locked',
      handledBy: 'Admin',
      status: 'Completed',
    });

    addToast('Customer approved and locked! Moved to List of Customer.', 'success');
  };

  const unlockCustomer = (id: string) => {
    if (currentRole !== 'admin') {
      addToast('Only Admin can unlock customers.', 'error');
      return;
    }
    setCustomerLeads((prev) => prev.map((item) => (item.id === id ? { ...item, isLocked: false } : item)));
    addToast('Customer record unlocked by Admin', 'info');
  };

  const updateCustomerCrmStage = (id: string, stage: CustomerLead['crmStage']) => {
    setCustomerLeads((prev) => prev.map((item) => (item.id === id ? { ...item, crmStage: stage } : item)));
    addToast(`Customer moved to stage "${stage}"`, 'info');
  };

  // Tags Handlers
  const addTag = (tag: Omit<TagItem, 'id'>) => {
    const newTag: TagItem = {
      ...tag,
      id: `tag-${Date.now()}`,
    };
    setTags((prev) => [...prev, newTag]);
    addToast(`Tag added: ${newTag.name}`, 'success');
  };

  const deleteTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    addToast('Tag removed', 'info');
  };

  const resetAllData = () => {
    setActivityMasters(initialActivityMasters);
    setActivityLogs(initialActivitiesLogs);
    setBuyerLeads(initialBuyerLeads);
    setProperties(initialProperties);
    setCustomerLeads(initialCustomerLeads);
    setTags(initialTags);
    addToast('All modules reset to verified initial datasets', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole,
        currentPage,
        setCurrentPage,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        activityMasters,
        addActivityMaster,
        updateActivityMaster,
        deleteActivityMaster,
        activityLogs,
        addActivityLog,
        updateActivityLog,
        deleteActivityLog,
        buyerLeads,
        addBuyerLead,
        updateBuyerLead,
        deleteBuyerLead,
        moveToPotentialBuyer,
        sendBuyerForApproval,
        approveAndLockBuyer,
        unlockBuyer,
        updateBuyerCrmStage,
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        markPropertyPotential,
        sendPropertyForApproval,
        approveAndLockProperty,
        unlockProperty,
        updatePropertyCrmStage,
        customerLeads,
        addCustomerLead,
        updateCustomerLead,
        deleteCustomerLead,
        moveToPotentialCustomer,
        sendCustomerForApproval,
        approveAndLockCustomer,
        unlockCustomer,
        updateCustomerCrmStage,
        tags,
        addTag,
        deleteTag,
        weeklyAds,
        blacklistedContacts,
        addToBlacklist,
        removeFromBlacklist,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
