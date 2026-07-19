'use client';
import React, { useState } from 'react';
import IconCreditCard from '@/components/icon/icon-credit-card';
import IconBrain from '@/components/icon/icon-brain'; // Assuming you have this icon or use another

interface GoalsProgressProps {
    icon?: React.ReactNode;
    title: string;
    current: number;
    target: number;
    percentChange?: number;
    colorFrom?: string;
    colorTo?: string;
}

const GoalsProgress = ({ 
    icon = <IconCreditCard />, 
    title = 'Goals Achieved', 
    current = 85, 
    target = 100,
    percentChange,
    colorFrom = '#f09819',
    colorTo = '#ff5858' 
}: GoalsProgressProps) => {
    const [showAiSuggestions, setShowAiSuggestions] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    // Calculate progress percentage
    const progress = Math.min(100, Math.round((current / target) * 100));

    const askForSuggestions = async () => {
        setIsLoadingAi(true);
        setShowAiSuggestions(true);
        
        try {
            // Simulating an API call to GPT
            // In production, replace with actual API call to your GPT endpoint
            setTimeout(() => {
                setAiSuggestions([
                    'Break larger goals into smaller milestones',
                    'Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)',
                    'Focus on the goals that align with your priorities'
                ]);
                setIsLoadingAi(false);
            }, 1000);
        } catch (error) {
            console.error('Error fetching AI suggestions:', error);
            setIsLoadingAi(false);
        }
    };

    const toggleAiPanel = () => {
        if (!showAiSuggestions && aiSuggestions.length === 0) {
            askForSuggestions();
        } else {
            setShowAiSuggestions(!showAiSuggestions);
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center">
                <div className="h-9 w-9 ltr:mr-3 rtl:ml-3">
                    <div className="grid h-9 w-9 place-content-center rounded-full bg-warning-light text-warning dark:bg-warning dark:text-warning-light">
                        {icon}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="mb-2 flex font-semibold text-white-dark justify-between">
                        <h6 className="flex items-center">
                            {title}
                            <span 
                                className="ml-2 cursor-pointer text-xs rounded-full bg-primary/20 text-primary px-1.5 py-0.5"
                                title="Ask AI to analyze your goals"
                                onClick={toggleAiPanel}
                            >
                                AI
                            </span>
                        </h6>
                        <div className="flex items-center">
                            <p className="ltr:ml-auto rtl:mr-auto">{current}</p>
                            {percentChange && (
                                <span className={`text-xs ml-1 ${percentChange >= 0 ? 'text-success' : 'text-danger'}`}>
                                    ({percentChange >= 0 ? '+' : ''}{percentChange}%)
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-dark-light shadow dark:bg-[#1b2e4b]">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r transition-all duration-300"
                            style={{ 
                                width: `${progress}%`,
                                backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo})`
                            }}
                            data-goal-progress={progress}
                            data-goal-target={target}
                            data-goal-insights="true"
                        ></div>
                    </div>
                    <div className="mt-1 text-xs flex justify-between text-white-dark">
                        <span>Target: {target}</span>
                        <span 
                            className="cursor-pointer hover:text-primary"
                            onClick={askForSuggestions}
                        >
                            Ask for suggestions
                        </span>
                    </div>
                </div>
            </div>

            {/* AI Suggestions Panel */}
            {showAiSuggestions && (
                <div className="mt-3 p-3 bg-white dark:bg-[#1b2e4b] rounded-md shadow-md border border-gray-200 dark:border-gray-700 text-sm">
                    <div className="flex items-center mb-2">
                        <IconBrain className="w-4 h-4 mr-2 text-primary" />
                        <h6 className="font-semibold">AI Goal Suggestions</h6>
                    </div>
                    
                    {isLoadingAi ? (
                        <div className="flex justify-center py-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {aiSuggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                                    <span>{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    
                    <div className="mt-2 flex justify-end">
                        <button 
                            className="text-xs text-primary hover:underline"
                            onClick={() => setShowAiSuggestions(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalsProgress; 