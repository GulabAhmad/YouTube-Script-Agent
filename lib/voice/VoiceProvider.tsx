import React, { createContext, useContext, useState, useCallback } from 'react';
import { VoiceContextType, VoiceState } from './types';
import { useVoiceCall } from './useVoiceCall';
import { Product } from '@/types/product';

const VoiceContext = createContext<VoiceContextType | null>(null);

const initialState: VoiceState = {
  isCallActive: false,
  isProcessing: false,
  error: null,
  transcript: '',
  audioUrl: null,
};

interface VoiceProviderProps {
  children: React.ReactNode;
  product: Product;
  callPurpose: string;
  targetAudienceArea: string;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children, product, callPurpose, targetAudienceArea }) => {
  const [state, setState] = useState<VoiceState>(initialState);

  const handleStateChange = useCallback((newState: (prev: VoiceState) => VoiceState) => {
    setState(prev => {
      const updatedState = newState(prev);
      // console.log('Voice state updated:', updatedState); // Debug log
      return updatedState;
    });
  }, []);

  const { startVoiceCall, endVoiceCall } = useVoiceCall({
    onStateChange: handleStateChange,
    product: product,
    callPurpose: callPurpose,
    targetAudienceArea: targetAudienceArea
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const contextValue: VoiceContextType = {
    ...state,
    startCall: startVoiceCall,
    endCall: endVoiceCall,
    clearError,
  };

  return (
    <VoiceContext.Provider value={contextValue}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}; 