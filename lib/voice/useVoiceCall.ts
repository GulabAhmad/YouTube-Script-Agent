import { useCallback, useRef, useState, useEffect } from 'react';
import { VoiceState } from './types';
import { RealtimeSession } from './RealtimeSession';
import { Product } from '@/types/product';
import { getProductPersonas } from '@/services/productPersonaService';

interface UseVoiceCallProps {
    onStateChange: (state: (prev: VoiceState) => VoiceState) => void;
    product: Product;
    callPurpose: string;
    targetAudienceArea: string;
}

// API Configuration
const API_CONFIG = {
    openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    openaiOrgId: process.env.NEXT_PUBLIC_OPENAI_ORG_ID || '',
    vapiApiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY || '',
    vapiVoiceId: process.env.NEXT_PUBLIC_VAPI_VOICE_ID || '',
};

export function useVoiceCall({ onStateChange, product, callPurpose, targetAudienceArea }: UseVoiceCallProps) {
    const sessionRef = useRef<RealtimeSession | null>(null);
    const [persona, setPersona] = useState<any>(null);
    const [isLoadingPersona, setIsLoadingPersona] = useState(true);
    console.log('callPurpose in useVoiceCall', targetAudienceArea);
    useEffect(() => {
        const loadPersona = async () => {
            try {
                setIsLoadingPersona(true);
                const personaData = await getProductPersonas(product.id);
                setPersona(personaData);
            } catch (error) {
                console.error('Error loading persona:', error);
            } finally {
                setIsLoadingPersona(false);
            }
        };
        loadPersona();
    }, [product.id]);

    const getSystemPrompt = (purpose: string) => {
        return `You are a realistic, professional client in a live sales call with a human salesperson. You must behave like a real business decision-maker. This is a sales simulation — you are NOT an AI, and must never say or suggest that you are artificial. Your language, tone, and responses should be natural, confident, and conversational — just like a genuine client would speak on a business call.

---

🎭 Your Role:
- You are a potential customer from the region: **${targetAudienceArea}**
- Choose a culturally realistic name for yourself based on this region:
  - Examples: USA → John or Emily, Asia → Ramesh, Aiko, Wei, Europe → Emma or Luca, South America → Carlos or Ana, etc.
- Be inquisitive, intelligent, and human-like. Don't follow a rigid script. React naturally to what the salesperson says.
- Speak as someone who has done some homework about the product and is now evaluating if it truly meets your needs.

---

🧠 Product You’re Inquiring About: **${product.name}**

${product.description}

You already know the above about the product and are considering it for your business. Use this knowledge to ask smart, relevant, and context-aware questions.

**Product Target Audiences**:
${product.target_audiences.map((audience, index) => `
  Target Group ${index + 1}:
  - Geography: ${audience.geography?.join(', ') || 'N/A'}
  - Age: ${audience.age_group?.join(', ') || 'N/A'}
  - Budget: ${audience.budget_range?.join(', ') || 'N/A'}
  - Gender: ${audience.gender?.join(', ') || 'N/A'}
  - Industry: ${audience.industry?.join(', ') || 'N/A'}
`).join('\n')}

---

📞 Call Purpose: **${purpose}**

You MUST drive the conversation with questions specifically related to this call purpose. Ask naturally and vary your style like a human would. Use follow-ups, ask for clarification, and dig deeper based on responses.

####  If purpose is "demo":
- Ask what was shown in the demo and **why those features were highlighted**.
- Ask how the AI works — "How does it actually analyze financial viability?" / "Can it handle niche industries?"
- Ask how it integrates into your current workflow.
- Probe for **customization**, visual design, ease of editing the deck, and how investor feedback is incorporated.

#### ✅ If purpose is "discovery":
- Start with your business context — size, goals, industry challenges.
- Ask how the product adapts to your domain or use case.
- Ask: "Can you walk me through how a startup like mine would actually use this day-to-day?"
- Ask about **data inputs, scalability, and how quickly you can get investor-ready**.

#### ✅ If purpose is "objection handling":
- Raise real-world concerns: 
  - “I’m not sure this would work for my specific industry… what proof do you have?”
  - “This seems expensive for an early-stage startup — can you justify the ROI?”
  - “What happens if my team isn't tech-savvy?”
- Be skeptical but open-minded — push the salesperson to win your trust.

#### ✅ If purpose is "closing":
- Ask about pricing models and contract flexibility.
- Ask about onboarding, support, and how soon you can go live.
- Say things like:
  - “What happens if we sign and it doesn’t work as expected?”
  - “Is there any trial or risk-free period?”
  - “Can we negotiate pricing based on volume or referrals?”

---

✅ Conversation Style Guide:
- Always sound human: Use phrases like “I see…”, “That’s interesting”, “Wait — can you explain that again?”, “So you’re saying…”
- React emotionally when relevant (e.g., “That sounds powerful”, “That might be a dealbreaker for us”, “This could save us weeks”).
- Interrupt occasionally or steer the conversation if needed — just like a real client would.
- Stay in character the entire time — never refer to scripts, tokens, or AI logic.`;
    };

    const getDefaultTrainerName = (purpose: string): string => {
        switch (purpose.toLowerCase()) {
            case 'demo':
                return 'Alex';
            case 'discovery':
                return 'Itachi';
            case 'objection handling':
                return 'Thomsan';
            case 'closing':
                return 'Jack';
            default:
                return 'Peter';
        }
    };

    const getFirstMessage = (purpose: string) => {
        switch (purpose.toLowerCase()) {
            case 'demo':
                return `Hello, How are you doing?`;
            case 'discovery':
                return `Hello, How are you doing?`;
            case 'objection handling':
                return `Hello, How are you doing?`;
            case 'closing':
                return `Hello, How are you doing?`;
            default:
                return `Hello, How are you doing?`;
        }
    };

    const startVoiceCall = useCallback(async () => {
        try {
            if (isLoadingPersona) {
                await new Promise((resolve) => {
                    const checkPersona = setInterval(() => {
                        if (!isLoadingPersona) {
                            clearInterval(checkPersona);
                            resolve(true);
                        }
                    }, 100);
                });
            }

            if (!persona) {
                throw new Error('Persona data not available');
            }

            console.log('product in useVoiceCall', product);
            const systemPrompt = getSystemPrompt(callPurpose);
            const firstMessage = getFirstMessage(callPurpose);

            onStateChange(
                (prev: VoiceState): VoiceState => ({
                    ...prev,
                    isCallActive: true,
                    isProcessing: true,
                    transcript: '', // Clear transcript when starting new call
                })
            );

            sessionRef.current = new RealtimeSession({
                apiKey: API_CONFIG.openaiApiKey,
                onStateChange: (state) => {
                    console.log('Connection state changed:', state);
                    onStateChange(
                        (prev: VoiceState): VoiceState => ({
                            ...prev,
                            isProcessing: state === 'connecting',
                            isCallActive: state === 'connected',
                            error: state === 'error' ? new Error('Voice connection error') : null,
                        })
                    );
                },
                onError: (error) => {
                    console.error('Voice call error:', error);
                    onStateChange(
                        (prev: VoiceState): VoiceState => ({
                            ...prev,
                            error,
                            isProcessing: false,
                            isCallActive: false,
                        })
                    );
                },
                onTranscript: (newTranscript) => {
                    onStateChange(
                        (prev: VoiceState): VoiceState => ({
                            ...prev,
                            transcript: prev.transcript ? prev.transcript + '\n' + newTranscript : newTranscript,
                        })
                    );
                },
                voice: {
                    model: 'tts-1',
                    voice: 'alloy',
                    speed: 1.0,
                },
                systemPrompt: systemPrompt,
                firstMessage: firstMessage,
            });

            await sessionRef.current.initialize();
        } catch (error) {
            console.error('Error starting voice call:', error);
            onStateChange(
                (prev: VoiceState): VoiceState => ({
                    ...prev,
                    error: error instanceof Error ? error : new Error('Failed to start voice call'),
                    isCallActive: false,
                    isProcessing: false,
                })
            );
        }
    }, [onStateChange, product, callPurpose, persona, isLoadingPersona]);

    const endVoiceCall = useCallback(async () => {
        try {
            if (sessionRef.current) {
                sessionRef.current.cleanup();
                sessionRef.current = null;
            }

            onStateChange(
                (prev: VoiceState): VoiceState => ({
                    ...prev,
                    isCallActive: false,
                    isProcessing: false,
                    transcript: '', // Clear transcript when ending call
                })
            );
        } catch (error) {
            console.error('Error ending voice call:', error);
            onStateChange(
                (prev: VoiceState): VoiceState => ({
                    ...prev,
                    error: error instanceof Error ? error : new Error('Failed to end voice call'),
                })
            );
        }
    }, [onStateChange]);

    return {
        startVoiceCall,
        endVoiceCall,
    };
}
