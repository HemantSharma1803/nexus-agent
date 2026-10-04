export type StepStatus = 'QUEUED' | 'RUNNING' | 'DONE' | 'FAILED' | 'RECOVERED';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  category: string;
  switchType: string;
  layout: string;
  inStock: boolean;
  stockCount: number;
  tag?: string;
  description: string;
  features?: string[];
  accentColor?: string;
  connectivity?: string;
  hotSwappable?: boolean;
}

export interface CandidateEvaluation {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  inStock: boolean;
  statusText: 'IN STOCK' | 'OVER BUDGET' | 'OUT OF STOCK';
  isBestMatch?: boolean;
  reason?: string;
}

export interface ExecutionStep {
  id: string;
  number: number;
  label: string;
  status: StepStatus;
  detail?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'action' | 'warning' | 'recovery' | 'success';
}

export interface SandboxState {
  searchQuery: string;
  priceCap: number;
  sortBy: 'featured' | 'rating' | 'price_low';
  selectedProductId: string | null;
  cart: { product: Product; quantity: number }[];
  cartOpen: boolean;
  activeSelector: string | null;
  currentActionLabel: string | null;
  ratingLabelAdaptive: 'rating' | 'reviews'; // For adaptive recovery demonstration
}

export interface TaskRecord {
  id: string;
  goal: string;
  scenarioType?: 'shopping_research' | 'compare_products' | 'find_and_verify' | 'data_extraction';
  scenarioTitle: string;
  status: 'Completed' | 'Recovered' | 'Failed';
  duration: string;
  actionsCount: number;
  productsEvaluated: number;
  selectedProduct: Product | null;
  resultSummary: string;
  timestamp: string;
  confidence: number;
  steps: ExecutionStep[];
  activities: ActivityLogItem[];
  recoveryCount: number;
  verificationPoints?: string[];
  comparisonMatrix?: { name: string; price: number; rating: number; verdict: string }[];
}

export interface BrowserSessionRecord {
  id: string;
  website: string;
  url: string;
  status: 'Completed' | 'Active' | 'Failed';
  startedAt: string;
  duration: string;
  actionsCount: number;
  result: string;
  taskId: string;
}
