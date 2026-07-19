import { Product } from '@/types/product';

export interface VoiceConfig {
  model: string;
  voice: string;
  speed: number;
}

export interface RealtimeConfig {
  apiKey: string;
  onStateChange?: (state: ConnectionState) => void;
  onError?: (error: Error) => void;
  onTranscript?: (transcript: string) => void;
  voice?: VoiceConfig;
  systemPrompt?: string;
  product?: Product | null;
  firstMessage?: string;
}

export type ConnectionState = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export interface VoiceState {
  isCallActive: boolean;
  isProcessing: boolean;
  error: Error | null;
  transcript?: string;
  audioUrl?: string | null;
}

export interface VoiceContextType extends VoiceState {
  startCall: () => Promise<void>;
  endCall: () => Promise<void>;
  clearError: () => void;
} 