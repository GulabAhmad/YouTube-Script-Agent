import Vapi from "@vapi-ai/web";
import { RealtimeConfig, ConnectionState } from './types';

const API_CONFIG = {
  openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  openaiOrgId: process.env.NEXT_PUBLIC_OPENAI_ORG_ID || '',
  vapiApiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY || '',
  vapiVoiceId: process.env.NEXT_PUBLIC_VAPI_VOICE_ID || ''
};

export class RealtimeSession {
  private vapi: any = null;
  private transcript: string = '';
  constructor(private config: RealtimeConfig) {}

  async initialize() {
    try {
      this.config.onStateChange?.('connecting');
      // console.debug('Starting VAPI initialization...');

      this.vapi = new Vapi(API_CONFIG.vapiApiKey);

      this.vapi.on("call-start", () => {
        console.debug('Call started');
        this.config.onStateChange?.('connected');
      });

      this.vapi.on("call-end", () => {
        console.debug('Call ended');
        this.config.onStateChange?.('disconnected');
      });

      this.vapi.on("error", (error: any) => {
        console.error('VAPI error:', error);
        if (error.action === 'error' && 
            (error.errorMsg === 'Meeting has ended' || 
             error.error?.type === 'ejected')) {
          this.cleanup();
          return;
        }
        this.config.onError?.(error);
        this.config.onStateChange?.('error');
      });

      this.vapi.on("message", (message: any) => {
        console.debug('Received message:', message);
        if (message.type === 'transcript') {
          // Format the transcript with speaker labels
          const formattedTranscript = message.role === 'assistant' 
            ? `Agent: ${message.transcript}`
            : `User: ${message.transcript}`;
          
          this.transcript = this.transcript 
            ? this.transcript + '\n' + formattedTranscript 
            : formattedTranscript;
            
          this.config.onTranscript?.(formattedTranscript);
        }
      });

      const usePremadeAssistant = process.env.VITE_USE_PREMADE_ASSISTANT === 'true';
      const assistantId = process.env.VITE_VAPI_ASSISTANT_ID;

      if (usePremadeAssistant && assistantId) {
        console.debug('Using pre-made assistant with ID:', assistantId);
        await this.vapi.start({
          assistantId: assistantId
        });
      } else {
        console.debug('Creating dynamic assistant');
        console.log('System Prompt:', this.config.systemPrompt || "You are a helpful sales training AI assistant. Keep responses concise and focused on the current topic.");
        try {
          await this.vapi.start({
            name: "Sales Training Assistant",
            model: {
              provider: "openai",
              model: "gpt-4o-mini",
              apiKey: process.env.VITE_OPENAI_API_KEY,
              organization: process.env.VITE_OPENAI_ORG_ID,
              messages: [
                {
                  role: "system",
                  content: this.config.systemPrompt || "You are a helpful sales training AI assistant. Keep responses concise and focused on the current topic."
                }
              ],
              temperature: 0.7
            },
            transcriber: {
              provider: "deepgram",
              model: "nova",
              language: "en-US"
            },
            voice: {
              provider: "11labs",
              voiceId:  "IKne3meq5aSn9XLyUdCD",
              model: "eleven_multilingual_v2"
            },
            firstMessage: this.config.firstMessage||"Hi, how are you?",
            recordingEnabled: true,
            clientMessages: ["transcript", "status-update", "model-output", "speech-update"],
            backchannelingEnabled: true,
            backgroundDenoisingEnabled: false
          });
          this.config.onStateChange?.('connected');
        } catch (error) {
          console.error('Failed to start VAPI:', error);
          this.config.onStateChange?.('error');
          throw error;
        }
      }

      this.vapi.on("disconnect", () => {
        console.debug('Call disconnected, attempting to reconnect...');
        this.config.onStateChange?.('connecting');
      });

      this.vapi.on("reconnect", () => {
        console.debug('Reconnected successfully');
        this.config.onStateChange?.('connected');
      });

      this.vapi.on("reconnect_failed", () => {
        console.error('Failed to reconnect after maximum attempts');
        this.config.onError?.(new Error('Failed to reconnect to call'));
        this.config.onStateChange?.('error');
        this.cleanup();
      });

      // console.debug('VAPI initialized successfully');
      return true;
    } catch (err) {
      // console.error('VAPI initialization failed:', err);
      this.cleanup();
      throw err;
    }
  }

  getTranscript(): string {
    return this.transcript;
  }

  cleanup() {
    // console.debug('Cleaning up VAPI session');
    if (this.vapi) {
      this.vapi.stop();
      this.vapi = null;
    }
    this.transcript = '';
    this.config.onStateChange?.('disconnected');
  }
} 