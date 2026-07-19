export interface Product {
  id: number;
  name: string;
  description: string;
  key_features: Array<{ name: string; description: string }>;
  target_audiences: Array<{
    name: string;
    description: string;
    questions?: string[];
    industry?: string[];
    gender?: string[];
    geography?: string[];
    age_group?: string[];
    budget_range?: string[];
  }>;
  call_settings: {
    duration: number;
    warmupTime: number;
    maxAttempts: number;
  };
  status?: boolean;
  user_id?: number;
} 

export interface TargetAudience {
  id: string;
  name: string;
  description: string;
  questions?: string[];
  industry?: string[];
  gender?: string[];
  geography?: string[];
  age_group?: string[];
  budget_range?: string[];
} 