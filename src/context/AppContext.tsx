import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  RoleProfile,
  RolePowerLevel,
  AppUser,
  RolePermissionsConfig,
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
import { INITIAL_APP_USERS } from '../data/initialUsers';
import { DEFAULT_ROLE_PERMISSIONS, SYSTEM_MODULES } from '../data/rolePermissions';

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

  // User & Password Management
  isAuthenticated: boolean;
  logoutUser: () => void;
  users: AppUser[];
  currentUser: AppUser;
  loginUser: (username: string, password: string) => boolean;
  switchUser: (userId: string) => void;
  addUser: (user: Omit<AppUser, 'id' | 'createdAt'>) => AppUser | null;
  updateUser: (userId: string, updates: Partial<AppUser>) => void;
  changePassword: (userId: string, newPassword: string) => boolean;
  deleteUser: (userId: string) => boolean;

  // Role Based Power Management
  rolePermissions: RolePermissionsConfig;
  updateRolePermission: (role: RoleProfile, moduleId: string, power: RolePowerLevel) => void;
  updateRoleCategoryPower: (role: RoleProfile, category: string, power: RolePowerLevel) => void;
  resetRolePermissionsToDefault: () => void;
  hasModulePower: (moduleId: string) => RolePowerLevel;

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
  sendBackBuyerForModification: (id: string, reason: string) => void;
  resubmitBuyerForApproval: (id: string, updates?: Partial<BuyerLead>) => void;
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
  sendBackPropertyForModification: (id: string, reason: string) => void;
  resubmitPropertyForApproval: (id: string, updates?: Partial<PropertyItem>) => void;
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
  sendBackCustomerForModification: (id: string, reason: string) => void;
  resubmitCustomerForApproval: (id: string, updates?: Partial<CustomerLead>) => void;
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

  // User Accounts State
  const [users, setUsers] = useState<AppUser[]>(() => {
    try {
      const saved = localStorage.getItem('crm_users');
      if (saved) {
        const parsed: AppUser[] = JSON.parse(saved);
        const usernames = new Set(parsed.map((u) => u.username.toLowerCase()));
        const merged = [...parsed];
        INITIAL_APP_USERS.forEach((initUser) => {
          if (!usernames.has(initUser.username.toLowerCase())) {
            merged.push(initUser);
          }
        });
        return merged;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APP_USERS;
  });

  useEffect(() => {
    localStorage.setItem('crm_users', JSON.stringify(users));
  }, [users]);

  // Authentication Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Default to true if authenticated or if previous session exists; otherwise false
    const authSaved = localStorage.getItem('crm_is_authenticated');
    return authSaved === 'true';
  });

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('crm_is_authenticated');
    addToast('You have been signed out from the CRM system', 'info');
  };

  // Current Active User
  const [currentUser, setCurrentUser] = useState<AppUser>(() => {
    const savedUserId = localStorage.getItem('crm_current_user_id');
    const matched = users.find((u) => u.id === savedUserId);
    return matched || users[0] || INITIAL_APP_USERS[0];
  });

  const setRole = (role: UserRole) => {
    setRoleState(role);
    localStorage.setItem('crm_role', role);
    // Find matching user for quick switch
    const match = users.find((u) => u.role === role);
    if (match && match.id !== currentUser.id) {
      setCurrentUser(match);
      localStorage.setItem('crm_current_user_id', match.id);
    }
    addToast(`Switched active role to ${role.toUpperCase()}`, 'info');
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setRoleState(target.role);
      setIsAuthenticated(true);
      localStorage.setItem('crm_is_authenticated', 'true');
      localStorage.setItem('crm_current_user_id', target.id);
      localStorage.setItem('crm_role', target.role);
      addToast(`Logged in as ${target.fullName} (${target.role.toUpperCase()})`, 'success');
    }
  };

  const loginUser = (username: string, password: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const target = users.find(
      (u) => u.username.trim().toLowerCase() === cleanUser && u.password === password
    );
    if (target) {
      if (!target.active) {
        addToast('This account has been deactivated. Please contact administration.', 'error');
        return false;
      }
      setCurrentUser(target);
      setRoleState(target.role);
      setIsAuthenticated(true);
      localStorage.setItem('crm_is_authenticated', 'true');
      localStorage.setItem('crm_current_user_id', target.id);
      localStorage.setItem('crm_role', target.role);
      addToast(`Authentication successful! Welcome, ${target.fullName}`, 'success');
      return true;
    }
    addToast('Invalid username or password. Please verify credentials.', 'error');
    return false;
  };

  const addUser = (userData: Omit<AppUser, 'id' | 'createdAt'>): AppUser | null => {
    const cleanUser = userData.username.trim();
    if (!cleanUser) {
      addToast('Username cannot be blank', 'error');
      return null;
    }
    const exists = users.some(
      (u) => u.username.trim().toLowerCase() === cleanUser.toLowerCase()
    );
    if (exists) {
      addToast(`User "${cleanUser}" already exists! Please use a unique username.`, 'error');
      return null;
    }
    const newUser: AppUser = {
      ...userData,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    addToast(`Account created for ${newUser.fullName} (${newUser.role.toUpperCase()})`, 'success');
    return newUser;
  };

  const updateUser = (userId: string, updates: Partial<AppUser>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updates };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
            if (updates.role) {
              setRoleState(updates.role);
              localStorage.setItem('crm_role', updates.role);
            }
          }
          return updated;
        }
        return u;
      })
    );
    addToast('User details updated successfully', 'success');
  };

  const changePassword = (userId: string, newPassword: string): boolean => {
    if (!newPassword || newPassword.trim().length < 4) {
      addToast('Password must be at least 4 characters long', 'error');
      return false;
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, password: newPassword };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    addToast('Password updated successfully', 'success');
    return true;
  };

  const deleteUser = (userId: string): boolean => {
    const target = users.find((u) => u.id === userId);
    if (!target) return false;
    if (target.id === currentUser.id) {
      addToast('Cannot delete the currently logged-in account', 'error');
      return false;
    }
    const adminCount = users.filter((u) => u.role === 'admin' && u.active).length;
    if (target.role === 'admin' && adminCount <= 1) {
      addToast('Cannot delete the only active Administrator', 'error');
      return false;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast(`User ${target.username} has been removed`, 'info');
    return true;
  };

  // Role Permissions Configuration
  const [rolePermissions, setRolePermissions] = useState<RolePermissionsConfig>(() => {
    try {
      const saved = localStorage.getItem('crm_role_powers');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ROLE_PERMISSIONS;
  });

  useEffect(() => {
    localStorage.setItem('crm_role_powers', JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  const updateRolePermission = (role: RoleProfile, moduleId: string, power: RolePowerLevel) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: {
        ...(prev[role] || {}),
        [moduleId]: power,
      },
    }));
  };

  const updateRoleCategoryPower = (role: RoleProfile, category: string, power: RolePowerLevel) => {
    const modulesInCategory = SYSTEM_MODULES.filter((m) => m.category === category);
    setRolePermissions((prev) => {
      const roleConfig = { ...(prev[role] || {}) };
      modulesInCategory.forEach((m) => {
        roleConfig[m.id] = power;
      });
      return {
        ...prev,
        [role]: roleConfig,
      };
    });
    addToast(`Applied "${power.toUpperCase()}" to all ${category} tiles for ${role.toUpperCase()}`, 'info');
  };

  const resetRolePermissionsToDefault = () => {
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    localStorage.setItem('crm_role_powers', JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
    addToast('Role powers reset to system default worksheet configuration', 'info');
  };

  const hasModulePower = (moduleId: string): RolePowerLevel => {
    const profile = currentUser?.roleProfile || (currentRole === 'admin' ? 'admin' : 'staff');
    return rolePermissions[profile]?.[moduleId] || (currentRole === 'admin' ? 'edit' : 'view');
  };

  const setCurrentPage = (page: NavigationPage) => {
    setCurrentPageState(page);
    localStorage.setItem('crm_page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State with LocalStorage Persistence
  const [activityMasters, setActivityMasters] = useState<ActivityMasterType[]>(() => {
    // Obsolete mock names that shouldn't pollute the custom activity list
    const legacyOldNames = new Set([
      'phone call',
      'in-person meeting',
      'site visit',
      'whatsapp follow-up',
      'email / brochure sent',
      'negotiation',
      'token advance',
      'contract signed',
    ]);

    const sanitizeActivities = (rawList: ActivityMasterType[]): ActivityMasterType[] => {
      const result: ActivityMasterType[] = [];
      const seenIds = new Set<string>();
      const seenNames = new Set<string>();

      // 1. Seed all official initialActivityMasters
      for (const std of initialActivityMasters) {
        // If user edited/customized this standard activity, preserve their edits
        const userVersion = rawList.find(
          (c) => c.name.toLowerCase().trim() === std.name.toLowerCase().trim() || c.id === std.id
        );
        const item = userVersion ? { ...std, ...userVersion, id: std.id, name: std.name } : std;
        result.push(item);
        seenIds.add(item.id);
        seenNames.add(item.name.toLowerCase().trim());
      }

      // 2. Add legitimate custom activities created by the user (discarding obsolete template relics)
      for (const item of rawList) {
        if (!item || !item.name) continue;
        const normName = item.name.toLowerCase().trim();
        if (legacyOldNames.has(normName)) continue;
        if (seenNames.has(normName)) continue;

        let uniqueId = item.id;
        if (!uniqueId || seenIds.has(uniqueId)) {
          uniqueId = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        }
        seenIds.add(uniqueId);
        seenNames.add(normName);
        result.push({ ...item, id: uniqueId });
      }

      return result;
    };

    const saved = localStorage.getItem('crm_act_masters');
    if (saved) {
      try {
        const parsed: ActivityMasterType[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeActivities(parsed);
          localStorage.setItem('crm_act_masters', JSON.stringify(sanitized));
          return sanitized;
        }
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
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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

  const sendBackBuyerForModification = (id: string, reason: string) => {
    const today = new Date().toISOString().split('T')[0];
    const target = buyerLeads.find((b) => b.id === id);
    const adminName = currentUser.fullName || currentUser.username || 'Admin';

    setBuyerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            waitingForModification: true,
            waitingForApproval: false,
            potentialApproved: false,
            isLocked: false,
            modificationReason: reason || 'Modification requested by Admin. Please verify and update information.',
            modificationRequestedBy: adminName,
            modificationRequestedAt: today,
            recentUpdate: `Sent back for modification by ${adminName}: ${reason}`,
          };
        }
        return item;
      })
    );

    // Auto-record DAR activity
    addActivityLog({
      date: today,
      activityTypeId: 'act-1',
      activityTypeName: 'Returned for Modification',
      entityType: 'buyer',
      entityName: `Modification Requested: ${target?.name || id}`,
      contactNumber: target?.contactNo || '',
      propertyType: target?.propertyType || 'Plot',
      budget: target?.budget || 'Standard',
      notes: `Admin ${adminName} requested modification: ${reason}`,
      recentUpdate: 'Waiting for modification by Staff',
      handledBy: adminName,
      status: 'Follow-up Required',
    });

    addToast(`Seller sent back to Staff for modification.`, 'info');
  };

  const resubmitBuyerForApproval = (id: string, updates?: Partial<BuyerLead>) => {
    const today = new Date().toISOString().split('T')[0];
    const staffName = currentUser.fullName || currentUser.username || 'Staff';

    setBuyerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...(updates || {}),
            waitingForModification: false,
            waitingForApproval: true,
            waitingForApprovalAt: today,
            isPotential: true,
            recentUpdate: `Modified by ${staffName} and resubmitted for Admin approval`,
          };
        }
        return item;
      })
    );

    addToast('Seller details updated and sent again for Admin approval!', 'success');
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

  const sendBackPropertyForModification = (id: string, reason: string) => {
    const today = new Date().toISOString().split('T')[0];
    const target = properties.find((p) => p.id === id);
    const adminName = currentUser.fullName || currentUser.username || 'Admin';

    setProperties((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            waitingForModification: true,
            waitingForApproval: false,
            isApproved: false,
            isLocked: false,
            modificationReason: reason || 'Modification requested by Admin. Please update property specifics and pricing.',
            modificationRequestedBy: adminName,
            modificationRequestedAt: today,
            crmStage: 'Verification',
          };
        }
        return item;
      })
    );

    // Auto-record DAR activity
    addActivityLog({
      date: today,
      activityTypeId: 'act-1',
      activityTypeName: 'Returned for Modification',
      entityType: 'property',
      entityName: `Modification Requested: ${target?.title || id}`,
      contactNumber: target?.ownerContact || '',
      propertyType: target?.propertyType || 'Plot',
      budget: target?.price || 'Standard',
      notes: `Admin ${adminName} requested modification: ${reason}`,
      recentUpdate: 'Waiting for modification by Staff',
      handledBy: adminName,
      status: 'Follow-up Required',
    });

    addToast(`Property sent back to Staff for modification.`, 'info');
  };

  const resubmitPropertyForApproval = (id: string, updates?: Partial<PropertyItem>) => {
    const today = new Date().toISOString().split('T')[0];

    setProperties((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...(updates || {}),
            waitingForModification: false,
            waitingForApproval: true,
            waitingForApprovalAt: today,
            isPotential: true,
            crmStage: 'Admin Approval',
          };
        }
        return item;
      })
    );

    addToast('Property details updated and sent again for Admin approval!', 'success');
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

  const sendBackCustomerForModification = (id: string, reason: string) => {
    const today = new Date().toISOString().split('T')[0];
    const target = customerLeads.find((c) => c.id === id);
    const adminName = currentUser.fullName || currentUser.username || 'Admin';

    setCustomerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            waitingForModification: true,
            waitingForApproval: false,
            isApproved: false,
            isLocked: false,
            modificationReason: reason || 'Modification requested by Admin. Please update client requirements and budget.',
            modificationRequestedBy: adminName,
            modificationRequestedAt: today,
            statusTag: 'Waiting Modification',
            recentUpdate: `Sent back for modification by ${adminName}: ${reason}`,
          };
        }
        return item;
      })
    );

    // Auto-record DAR activity
    addActivityLog({
      date: today,
      activityTypeId: 'act-1',
      activityTypeName: 'Returned for Modification',
      entityType: 'customer',
      entityName: `Modification Requested: ${target?.name || id}`,
      contactNumber: target?.contactNo || '',
      propertyType: target?.propertyType || 'Plot',
      budget: target?.expectedPrice || 'Standard',
      notes: `Admin ${adminName} requested modification: ${reason}`,
      recentUpdate: 'Waiting for modification by Staff',
      handledBy: adminName,
      status: 'Follow-up Required',
    });

    addToast(`Customer sent back to Staff for modification.`, 'info');
  };

  const resubmitCustomerForApproval = (id: string, updates?: Partial<CustomerLead>) => {
    const today = new Date().toISOString().split('T')[0];
    const staffName = currentUser.fullName || currentUser.username || 'Staff';

    setCustomerLeads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...(updates || {}),
            waitingForModification: false,
            waitingForApproval: true,
            waitingForApprovalAt: today,
            isPotential: true,
            statusTag: 'Waiting Approval',
            recentUpdate: `Modified by ${staffName} and resubmitted for Admin approval`,
          };
        }
        return item;
      })
    );

    addToast('Customer details updated and sent again for Admin approval!', 'success');
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
        sendBackBuyerForModification,
        resubmitBuyerForApproval,
        approveAndLockBuyer,
        unlockBuyer,
        updateBuyerCrmStage,
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        markPropertyPotential,
        sendPropertyForApproval,
        sendBackPropertyForModification,
        resubmitPropertyForApproval,
        approveAndLockProperty,
        unlockProperty,
        updatePropertyCrmStage,
        customerLeads,
        addCustomerLead,
        updateCustomerLead,
        deleteCustomerLead,
        moveToPotentialCustomer,
        sendCustomerForApproval,
        sendBackCustomerForModification,
        resubmitCustomerForApproval,
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

        // Users & Authentication
        isAuthenticated,
        logoutUser,
        users,
        currentUser,
        loginUser,
        switchUser,
        addUser,
        updateUser,
        changePassword,
        deleteUser,

        // Role Based Power Management
        rolePermissions,
        updateRolePermission,
        updateRoleCategoryPower,
        resetRolePermissionsToDefault,
        hasModulePower,
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
