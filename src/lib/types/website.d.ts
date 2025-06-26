import { LOG_TYPES } from '../utils/types/logs';
import { PERMISSIONS } from '../utils/constants/permissions';
import { ServerConnectionType } from '../utils/constants/server';
import { LicenseType } from '../utils/constants/licenses';

// Nested interfaces for complex objects
export interface GoogleAnalytics {
  gaId: string;
}

export interface Slider {
  id: string;
  text: string;
  description: string;
  image: string;
  route: string;
  buttonText: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Discord {
  webhook_url: string | false;
  guild_id: string;
  webhook_events: LOG_TYPES[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  chest: Chest[];
  balance: number;
  access_token: string | null;
  refresh_token: string | null;
  isOwner?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: PERMISSIONS[];
  modifiable: boolean;
  default: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Authme {
  host: string;
  port: number;
  database: string;
  table: string;
  username: string;
  password: string;
}

export interface ServerConnection {
  type: ServerConnectionType;
  port: string;
  password: number;
}

export interface Server {
  name: string;
  ip: string;  
  port: number;
  image: string;
  connection: ServerConnection;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  server_id: string | null;
  server_command: string | null;
  tags: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string | null;
  server_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chest {
  id: string;
  product: Product;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentProviderConfig {
  id: string;
  provider: 'PayTR' | 'Shipy' | 'Papara' | 'İyzico';
  name: string;
  isActive: boolean;
  config: ProviderConfig;
  priority: number;
  supportedCurrencies: string[];
  minAmount: number;
  maxAmount: number;
  description?: string;
  additionalSettings?: Record<string, any>;
}

export interface ProviderConfig {
  [key: string]: any; // Since it can be PayTRConfig, IyzicoConfig, etc.
}

export interface BasketItem {
  name: string;
  price: string;
  quantity: number;
}

export interface CustomerInfo {
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED',
}

export interface Payment {
  id: string;
  providerId: string;
  providerName: string;
  paymentName: string;
  merchant_oid: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  basket: BasketItem[];
  user: CustomerInfo;
  userIp: string;
  paymentProviderResponse?: any;
  callbackData?: any;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogEventData {
  [key: string]: any; // Flexible object for event-specific data
}

export interface Logs {
  id: string;
  type: LOG_TYPES;
  category: string; // LOG_CATEGORIES enum
  performedBy: string;
  performedByUsername?: string;
  timestamp: Date;
  eventData: LogEventData;
  ipAddress?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  message: string;
  description?: string;
  metadata?: Record<string, any>;
  isSystemGenerated: boolean;
  relatedEntityId?: string;
  relatedEntityType?: string;
  tags?: string[];
}

// Main Website interface
export interface Website {
  id: string;
  name: string;
  url: string;
  description: string;
  currency: string;
  favicon: string;
  image: string;
  keywords: string[];
  google_analytics: GoogleAnalytics | null;
  sliders: Slider[];
  discord: Discord | null;
  users: User[];
  roles: Role[];
  authme: Authme | null;
  servers: Server[];
  products: Product[];
  categories: Category[];
  payment_providers: PaymentProviderConfig[];
  payments: Payment[];
  license_key: string;
  broadcast_items: string[];
  logs: Logs[];
  createdAt: Date;
  updatedAt: Date;
}