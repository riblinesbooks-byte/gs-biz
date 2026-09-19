export type UserRole = 'admin' | 'staff';

export type ActivityMasterType = {
  id: string;
  name: string;
  code: string;
  category: 'Call' | 'Meeting' | 'Visit' | 'Conference' | 'Other';
  description: string;
  iconName?: string;
  color?: string;
  defaultDurationMinutes: number;
  isSystem?: boolean;
  activityGroup?: 'current' | 'pending';
};

export type ActivityLog = {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  activityTypeId: string;
  activityTypeName: string;
  entityType: 'buyer' | 'property' | 'customer' | 'general';
  entityId?: string;
  entityName: string;
  contactNumber?: string;
  propertyType?: string;
  budget?: string;
  requirement?: string;
  callNumber?: number; // 1 to 8
  notes: string;
  recentUpdate?: string;
  comments?: string;
  handledBy: string;
  status: 'Completed' | 'Pending' | 'Follow-up Required' | 'Cancelled';
  nextFollowUpDate?: string;
};

export type BuyerLead = {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  contactNo: string;
  enquiryMode: string; // 'Property Plus' | 'Facebook' | 'Walk-in' | etc.
  enquiryFor: string; // 'Purchase' | 'Rental' | 'Joint Venture'
  propertyType: string; // 'Plot' | 'Flat' | 'Independent House' | '2 BHK' | '3 BHK' | 'NA'
  budget: string; // e.g. '80 L', '1.5 Cr', 'NA'
  preferredLocality: string; // e.g. '20th Street', 'Nanganallur', 'Guduvanchery'
  requirement: string;
  propertyArea?: string; // e.g. '2400 sq ft', '1.5 ground'
  propertyAddress?: string;
  areaOfLand?: string;
  areaOfBuilding?: string;
  ownershipType?: string; // 'Freehold' | 'Patta' | 'Power of Attorney' | 'Joint Venture' | etc.
  foodPreference?: string; // 'Veg' | 'Non-Veg' | 'Any'
  religion?: string; // 'Hindu' | 'Muslim' | 'Christian' | 'Any'
  waitingForApproval?: boolean;
  waitingForApprovalAt?: string;
  lockedFields?: string[];
  firstCallHandledBy: string;
  recentUpdate: string;
  comments: string;
  isPotential: boolean;
  potentialApproved: boolean; // Approved by admin
  isLocked: boolean; // Locked by admin - staff cannot delete
  lockedAt?: string;
  lockedBy?: string;
  crmStage: 'New Lead' | 'Potential' | 'Site Visit Scheduled' | 'Negotiation' | 'Approved / Locked' | 'Deal Closed' | 'Dropped';
  tags: string[];
};

export type PropertyItem = {
  id: string;
  date?: string; // Entry Date
  title: string;
  propertyCode: string;
  propertyType: 'Plot' | 'Flat' | 'Independent House' | 'Commercial' | 'Joint Venture' | string;
  locality: string;
  address: string;
  sizeSqFt: number;
  groundArea?: string; // e.g. '1.5 ground', '40 x 120'
  facing?: string;
  roadWidthFt?: number;
  price: string;
  priceNumeric?: number;
  ownerName: string;
  ownerContact: string;
  availableFrom?: string;
  status: 'Available' | 'Not Available' | 'Under Offer' | 'Sold';
  imageUrl?: string; // Photo of property
  isPotential: boolean;
  waitingForApproval?: boolean;
  waitingForApprovalAt?: string;
  isApproved: boolean;
  isLocked: boolean; // Locked by admin so staff cannot delete or edit core details
  lockedFields?: string[];
  lockedAt?: string;
  lockedBy?: string;
  crmStage: 'Listing' | 'Verification' | 'Admin Approval' | 'Active Marketing' | 'Site Visits' | 'Under Negotiation' | 'Closed / Sold';
  features: string[];
  onlineAdsPostedCount?: number;
  totalSiteVisits?: number;
};

export type CustomerLead = {
  id: string;
  date: string;
  name: string;
  contactNo: string;
  propertyType?: string; // Plot, Flat, Independent House, Commercial, Joint Venture
  propertyArea?: string; // e.g. 2400 sq ft, 1.5 Ground
  propertyAddress?: string; // Full address
  customerType: 'Seller' | 'Landowner' | 'Investor' | 'Builder';
  propertyOffered?: string;
  locality?: string;
  expectedPrice?: string;
  notes: string;
  handledBy: string;
  // Additional non-compulsory details for Send for Approval
  areaOfLand?: string;
  areaOfBuilding?: string;
  ownershipType?: string;
  foodPreference?: string;
  religion?: string;
  // Approval pipeline
  isPotential: boolean;
  waitingForApproval?: boolean;
  waitingForApprovalAt?: string;
  isApproved: boolean;
  isLocked: boolean; // Locked by admin so staff cannot edit/delete
  lockedFields?: string[];
  lockedAt?: string;
  lockedBy?: string;
  crmStage: 'Lead Intake' | 'Potential Review' | 'Property Inspection' | 'Admin Approved' | 'Mandate Signed' | 'Completed';
  statusTag: string;
};

export type TagItem = {
  id: string;
  category: 'enquiry_source' | 'buyer_status' | 'customer_status';
  name: string;
  color: string;
  count?: number;
};

export type WeeklyAdItem = {
  id: string;
  propertyTitle: string;
  newspaperOrPortal: string;
  weekStartDate: string;
  cost: string;
  enquiriesGenerated: number;
  siteVisitsBooked: number;
};

export type BlacklistedContact = {
  id: string;
  name: string;
  mobile: string;
  who: 'Seller' | 'Customer';
  reason?: string;
  blacklistedAt: string;
};

export type NavigationPage =
  | 'dashboard'
  | 'activities_master'
  | 'activities_create'
  | 'buyer_add'
  | 'buyer_leads'
  | 'buyer_move_potential'
  | 'buyer_waiting_approval'
  | 'buyer_list'
  | 'buyer_lock'
  | 'buyer_crm'
  | 'buyer_canvas'
  | 'seller_canvas'
  | 'crm_buyer'
  | 'property_create'
  | 'property_move_potential'
  | 'property_waiting_approval'
  | 'property_list'
  | 'property_potential'
  | 'property_lock'
  | 'property_canvas'
  | 'property_crm'
  | 'crm_property'
  | 'customer_add'
  | 'customer_leads'
  | 'customer_move_potential'
  | 'customer_waiting_approval'
  | 'customer_list'
  | 'customer_potential'
  | 'customer_lock'
  | 'customer_canvas'
  | 'customer_crm'
  | 'crm_customer'
  | 'reports'
  | 'reports_buyers'
  | 'reports_leads'
  | 'reports_properties'
  | 'reports_crm_buyer'
  | 'reports_crm_property'
  | 'reports_crm_customer'
  | 'reports_customer_canvas'
  | 'reports_property_canvas'
  | 'reports_activities_filter'
  | 'reports_enquiry_stats'
  | 'reports_ads'
  | 'tags'
  | 'tag_enquiry_source'
  | 'tag_buyer_status'
  | 'tag_customer_status';
