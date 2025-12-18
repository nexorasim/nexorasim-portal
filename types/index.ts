export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  wallet_balance: number;
  created_at: string;
}

export interface ESIMPlan {
  id: string;
  name: string;
  country: string;
  country_code: string;
  data_amount: string;
  validity_days: number;
  price: number;
  currency: string;
  description: string;
  features: string[];
  is_active: boolean;
}

export interface ESIMOrder {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  qr_code: string;
  activation_code: string;
  amount: number;
  currency: string;
  payment_method: string;
  created_at: string;
  activated_at?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'myanmar' | 'international';
  icon: string;
  is_active: boolean;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface ESIMState {
  plans: ESIMPlan[];
  orders: ESIMOrder[];
  isLoading: boolean;
  selectedPlan: ESIMPlan | null;
}

export interface PaymentState {
  methods: PaymentMethod[];
  isProcessing: boolean;
  lastTransaction: any;
}