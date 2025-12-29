// User and Auth Types
export type UserRole = 'manager' | 'clerk';

export interface WorkingHour {
  day: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface User {
  id: string;
  name?: string; // Computed from firstName + lastName for backward compatibility
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  permissions?: string[];
  phoneNumber?: string;
  avatar?: string;
  branch_id?: string; // Only for clerks - the branch they belong to
  isActive?: boolean;
  isTemporaryPassword?: boolean;
  createdAt: number | Date;
  updatedAt: number | Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
  requiresPasswordSetup?: boolean;
  requiresLocation?: boolean;
}

// Order Types
export type OrderStatus = 'PENDING' | 'QUOTED' | 'PAID' | 'RECEIVED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ClerkOrderClient {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
}

export interface ClerkOrderFile {
  url: string;
  publicId: string;
  name: string;
  size: number;
  type: string;
}

export interface ClerkOrderItemOptions {
  frontBack: boolean;
  color: boolean;
  printCut: boolean;
  frontOnly?: boolean;
  files: ClerkOrderFile[];
  selectedBaseConfigId?: string;
  selectedOptions?: string[];
  selectedCustomSpecs?: string[];
}

export interface SelectedConfigDetails {
  baseConfig?: { id: string; name: string };
  options?: Array<{ id: string; name: string; priceModifier?: number }>;
  customSpecs?: Array<{ id: string; name: string; priceModifier?: number }>;
}

export interface ClerkOrderItemCategory {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface ClerkOrderItemSubCategory {
  id: string;
  name: string;
  imageUrl?: string;
  pricingType: string;
}

export interface ClerkOrderItem {
  id: string;
  serviceName: string;
  category: ClerkOrderItemCategory;
  subCategory: ClerkOrderItemSubCategory;
  width: number;
  height: number;
  measurementUnit: string;
  quantity: number;
  options: ClerkOrderItemOptions;
  selectedConfigDetails?: SelectedConfigDetails;
  calculatedPrice: number;
  createdAt: string | Date;
}

export interface ClerkOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalPrice: number;
  client: ClerkOrderClient;
  itemCount: number;
  estimatedCompletionTime?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ClerkOrderDetail extends ClerkOrder {
  items: ClerkOrderItem[];
}

export interface ClerkOrdersResponse {
  data: ClerkOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ClerkOrdersFilters {
  status?: OrderStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'newest' | 'oldest' | 'status' | 'totalPrice' | 'clientName';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Dashboard Types
export interface ClerkDashboardStats {
  total: number;
  pending: number;
  quoted: number;
  paid: number;
  inProgress: number;
  completed: number;
  todayOrders: number;
  thisWeekOrders: number;
  thisMonthOrders: number;
}

export interface ManagerOverviewStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  quotedOrders: number;
  paidOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  todayOrders: number;
  todayRevenue: number;
  thisMonthOrders: number;
  thisMonthRevenue: number;
  branchCount: number;
  activeBranchCount: number;
}

export interface ManagerBranchStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  quotedOrders: number;
  paidOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  todayOrders: number;
  todayRevenue: number;
  thisMonthOrders: number;
  thisMonthRevenue: number;
  thisWeekOrders: number;
  thisWeekRevenue: number;
}

export interface CategoryAnalytics {
  categoryId: string;
  categoryName: string;
  categoryImageUrl?: string;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  quotedOrders: number;
  paidOrders: number;
  inProgressOrders: number;
  totalRevenue?: number;
  paidRevenue?: number;
  pendingRevenue?: number;
  orderItemsCount: number;
  averageOrderValue?: number;
  branchBreakdown?: BranchCategoryBreakdown[];
}

export interface BranchCategoryBreakdown {
  branchId: string;
  branchName: string;
  orders: number;
  revenue: number;
}

export interface ClerkCategoryAnalytics {
  categoryId: string;
  categoryName: string;
  categoryImageUrl?: string;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  quotedOrders: number;
  paidOrders: number;
  inProgressOrders: number;
  orderItemsCount: number;
}

export interface WeeklyActivityItem {
  date: string;
  orders: number;
  revenue?: number;
}

export interface ClerkWeeklyActivity {
  date: string;
  orders: number;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  phoneNumber?: string;
  manager_id: string; // Manager who owns this branch
  branchEmailAddress?: string; // Branch-specific email
  branchCoverImage?: string; // Branch cover image
  isMainBranch: boolean;
  payStackSubAccountId?: string;
  location_id?: string; // Reference to location table
  status: 'active' | 'inactive' | 'temporarily_closed';
  operatingHours: {
    [key: string]: { // day of week (e.g., "monday", "tuesday")
      open: string;  // e.g., "09:00"
      close: string; // e.g., "17:00"
    };
  };
  location?: { // Populated from JOIN query
    id: string;
    address: string;
    latitude: number;
    longitude: number;
    createdAt?: Date;
    updatedAt?: Date;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Category Types
export type CategoryType =
  | 'wassce_result'
  | 'bece_result'
  | 'novdec_result'
  | 'large_format'
  | 'regular_format';

export type RegularFormatProperties = 'front_only' | 'front_and_back';

export interface Category {
  id: string;
  name: string;
  unitPrice: number;
  description?: string;
  adminId: string;
  categoryType?: CategoryType;
  regularFormatProperties?: RegularFormatProperties;
  createdAt?: number;
  updatedAt?: number;
}

// New Service Types (Platform-owned services structure)
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ServiceSubCategory {
  id: string;
  categoryId: string;
  name: string;
  pricingType: 'AREA_BASED' | 'UNIT_ONLY' | 'AREA_FEET' | 'AREA_INCH' | 'MIXED' | 'CUSTOM_QUOTE';
  description?: string;
  imageUrl?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ServiceTemplate {
  id: string;
  subCategoryId: string;
  name: string;
  measurementUnit: 'FEET' | 'INCH' | 'UNIT';
  allowsCustomSize: boolean;
  supportsFrontBack: boolean;
  supportsColor: boolean;
  supportsPrintCut: boolean;
  pricingFormulaId?: string;
  description?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Flexible Pricing Configuration Types
export type BaseConfigurationType = 'PRESET' | 'CUSTOM';

export interface BaseConfiguration {
  id: string;
  name: string;
  type: BaseConfigurationType;
  unitPrice: number;
  customValue?: string | null;
}

export interface PricingOption {
  id: string;
  name: string;
  enabled: boolean;
  default: boolean;
  priceModifier: number;
}

export interface CustomSpecification {
  id: string;
  name: string;
  priceModifier: number;
}

export interface PricingConfig {
  baseConfigurations: BaseConfiguration[];
  options: PricingOption[];
  customSpecifications: CustomSpecification[];
}

export interface AgentService {
  id: string;
  branchId: string;
  serviceTemplateId: string;
  pricePerUnit: number;
  constant: number | null;
  colorPriceModifier: number | null;
  isActive: boolean;
  supportsPrintCut: boolean;
  supportsColor: boolean;
  supportsFrontBack: boolean;
  supportsFrontOnly: boolean;
  pricingConfig?: PricingConfig | null; // New flexible pricing configuration
  createdAt?: Date | string;
  updatedAt?: Date | string;
  // Populated fields (from joins)
  serviceTemplate?: ServiceTemplate;
  subCategory?: ServiceSubCategory;
  category?: ServiceCategory;
}

export interface CreateAgentServiceData {
  branchId: string;
  serviceTemplateId: string;
  pricePerUnit: number;
  constant?: number | null;
  colorPriceModifier?: number | null;
  isActive?: boolean;
  supportsPrintCut?: boolean;
  supportsColor?: boolean;
  supportsFrontBack?: boolean;
  supportsFrontOnly?: boolean;
}

export interface UpdateAgentServiceData {
  pricePerUnit?: number;
  constant?: number | null;
  colorPriceModifier?: number | null;
  isActive?: boolean;
  supportsPrintCut?: boolean;
  supportsColor?: boolean;
  supportsFrontBack?: boolean;
  supportsFrontOnly?: boolean;
}

// Legacy types for compatibility
export interface PrintJob {
  id: string;
  customerId: string;
  customerName: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  submittedAt: string;
  processedAt?: string;
  completedAt?: string;
  agentId?: string;
  printerId?: string;
  pages?: number;
  cost?: number;
}

export interface PrinterAgent {
  id: string;
  name: string;
  computerId: string;
  printerId: string;
  status: 'online' | 'offline' | 'error';
  lastSeen: string;
  currentJob?: string;
  totalJobs: number;
  totalPages: number;
}

export interface PrinterLog {
  id: string;
  printerId: string;
  agentId?: string;
  jobId?: string;
  action: 'print' | 'error' | 'maintenance' | 'anonymous_print';
  fileName?: string;
  pages?: number;
  timestamp: string;
  details?: string;
}

export interface AnalyticsData {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  totalPages: number;
  totalRevenue: number;
  averageJobTime: number;
  jobsByStatus: Record<string, number>;
  jobsByDay: Array<{
    date: string;
    jobs: number;
    pages: number;
  }>;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    jobs: number;
    pages: number;
  }>;
}
