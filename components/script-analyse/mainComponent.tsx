'use client';
import React, { useState, Suspense, lazy, ErrorInfo, useEffect } from 'react';
import { Product, TargetAudience } from '@/types/product';
import { useDispatch } from "react-redux";
import { addSidebarScript, updateSidebarScript } from "@/store/themeConfigSlice";


import HeaderSection from './HeaderSection';
import FilterButtons from './FilterButtons';

// Dynamic imports for tab components
const DemoTab = lazy(() => import('./DemoTab')) ;
const ObjectionHandlingTab = lazy(() => import('./ObjectionHandling')) ;
const ClosingTab = lazy(() => import('./ClossingTab')) ;
const DiscoveryTab = lazy(() => import('./DiscoveryTab')) ;
const ScriptTab = lazy(() => import('./ScriptTab')) ;
const OutlineTab = lazy(() => import('./OutlineTab')) ;

interface Focus {
    id: string;
    name: string;
}

interface CallPurpose {
    product: Product | null;
    focus: Focus | null;
    targetAudience: TargetAudience | null;
}


// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-50 rounded-lg">
                    <h2 className="mb-2 text-xl font-semibold text-red-600">Something went wrong</h2>
                    <p className="mb-4 text-gray-600">{this.state.error?.message || 'An unexpected error occurred'}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-4 py-2 text-white transition-colors bg-red-600 rounded hover:bg-red-700"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Loading Component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
    </div>
);

// Add id and scriptData prop to MainComponent
interface MainComponentProps {
  id?: string;
  scriptData?: any;
}

const MainComponent: React.FC<MainComponentProps> = ({ id, scriptData }) => {
    console.log("scriptData", scriptData);
    const [activeTab, setActiveTab] = useState<string | null>("Demo");
    const dispatch = useDispatch();

    // Add state for scriptData fields
    const [scriptId, setScriptId] = useState<number | null>(scriptData?.id || null);
    const [topic, setTopic] = useState<string>(scriptData?.topic || "");
    const [script, setScript] = useState<string>(scriptData?.script || "");
    const [userId, setUserId] = useState<number | null>(scriptData?.user_id || null);
    const [youtubeUrl, setYoutubeUrl] = useState<string>(scriptData?.youtube_url || "");
    const [research, setResearch] = useState<string>(scriptData?.research || "");
    const [youtubeTranscript, setYoutubeTranscript] = useState<string>(scriptData?.youtube_transcript || "");
    const [outline, setOutline] = useState<string>(scriptData?.outline || "");
    


    // Function to check if a tab is accessible
    const isTabAccessible = (tabValue: string): boolean => {
        switch (tabValue) {
            case 'Demo':
                return true; // Always accessible
            case 'NewTab':
                return !!youtubeTranscript && youtubeTranscript.trim().length > 0;
            case 'Discovery':
                return !!youtubeTranscript && youtubeTranscript.trim().length > 0;
            case 'Outline':
                return !!youtubeTranscript && youtubeTranscript.trim().length > 0 && 
                       !!research && research.trim().length > 0;
            case 'Closing':
                return !!youtubeTranscript && youtubeTranscript.trim().length > 0 && 
                       !!research && research.trim().length > 0 && 
                       !!outline && outline.trim().length > 0;
            default:
                return false;
        }
    };

    // Function to handle tab changes with restrictions
    const handleTabChange = (tabValue: string | null) => {
        if (tabValue && isTabAccessible(tabValue)) {
            setActiveTab(tabValue);
        }
    };
    
    // Add user product personas query

    // Add effect to log user product personas when they cha
    // Handle API errors

    // Filter calls by type with proper type checking
    
    const headerData = {
        title: 'Script Topic',
        description: '',
        buttons: [
        ],
    };

    const filterButtons = [
        // { label: 'All Types', value: null },
        { label: 'Enter Url', value: 'Demo' },
        { label: 'Video Script', value: 'NewTab' },
        { label: 'Research', value: 'Discovery' },
        { label: 'Outline', value: 'Outline' },
        { label: 'Create Script', value: 'Closing' },
    ];

    // Function to handle when a new script is created during research
    const handleNewScriptCreated = (newScript: any) => {
        setScriptId(newScript.id);
        dispatch(addSidebarScript(newScript));
    };

    return (
      <ErrorBoundary>
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <HeaderSection {...headerData} />
            <FilterButtons
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              buttons={filterButtons}
              isTabAccessible={isTabAccessible}
            />
            {activeTab === null && (
              <div className="relative mx-auto mt-12 max-w-[1550px]">
                <div className="relative flex flex-col items-center justify-between h-auto rounded-2xl backdrop-blur-sm dark:bg-slate-800">
                  <div className="flex items-center justify-center w-full h-full gap-2"></div>
                </div>
              </div>
            )}
            {/* Main Component Tabs */}
            <Suspense fallback={<LoadingSpinner />}>
              {activeTab === "Demo" && (
                <ErrorBoundary>
                  <Suspense fallback={<LoadingSpinner />}>
                    <DemoTab
                      setActiveTab={setActiveTab}
                      youtubeUrl={youtubeUrl}
                      setYoutubeUrl={setYoutubeUrl}
                      setYoutubeTranscript={setYoutubeTranscript}
                      scriptId={scriptId || undefined}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              {/* Script Tab */}
              {activeTab === "NewTab" && (
                <ErrorBoundary>
                  <ScriptTab
                    setActiveTab={setActiveTab}
                    youtubeTranscript={youtubeTranscript}
                  />
                </ErrorBoundary>
              )}
              {/* Research Tab */}
              {activeTab === "Discovery" && (
                <ErrorBoundary>
                  <DiscoveryTab
                    setActiveTab={setActiveTab}
                    topic={topic}
                    setTopic={setTopic}
                    research={research}
                    setResearch={setResearch}
                    youtubeTranscript={youtubeTranscript}
                    scriptId={scriptId || undefined}
                    setScriptId={setScriptId}
                    setOutline={setOutline}
                    setScript={setScript}
                  />
                </ErrorBoundary>
              )}
              {/* Outline Tab */}
              {activeTab === "Outline" && (
                <ErrorBoundary>
                  <OutlineTab
                    setActiveTab={setActiveTab}
                    outline={outline}
                    setOutline={setOutline}
                    topic={topic}
                    research={research}
                    youtubeTranscript={youtubeTranscript}
                    scriptId={scriptId || undefined}
                    setScript={setScript}
                  />
                </ErrorBoundary>
              )}
              {activeTab === "Closing" && (
                <ErrorBoundary>
                  <ClosingTab
                    setActiveTab={setActiveTab}
                    topic={topic}
                    outline={outline}
                    research={research}
                    youtubeTranscript={youtubeTranscript}
                    youtubeUrl={youtubeUrl}
                    scriptId={scriptId || undefined}
                    script={script}
                    setScript={setScript}
                  />
                </ErrorBoundary>
              )}
              {/* {activeTab === "Objection Handling" && (
                <ErrorBoundary>
                  <ObjectionHandlingTab
                    setActiveTab={setActiveTab}
                    scriptData={scriptData}
                  />
                </ErrorBoundary>
              )} */}
              {/* Create Script Tab */}
            </Suspense>
          </div>
        </div>
      </ErrorBoundary>
    );
};

export default MainComponent;
