"use client";
import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateSidebarScript } from "@/store/themeConfigSlice";
import { IRootState } from "@/store";

interface TabProps {
  setActiveTab: (tab: string) => void;
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  setYoutubeTranscript: (transcript: string) => void;
  scriptId?: number;
}

const DemoTab: React.FC<TabProps> = ({ setActiveTab, youtubeUrl, setYoutubeUrl, setYoutubeTranscript, scriptId }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const redux_user_id = useSelector((state: IRootState) => state.themeConfig.user_id);

  const saveToDatabase = async (transcriptAnalysis: string) => {
    if (!scriptId) return;
    
    setSaving(true);
    try {
      const response = await fetch(`${BASE_URL}/video-scripts/${scriptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "",
          script: "",
          user_id: redux_user_id || localStorage.getItem("userId"), // <-- Added user_id
          youtube_url: youtubeUrl || "",
          research: "",
          youtube_transcript: transcriptAnalysis || "",
          outline: ""
        })
      });
      
      if (!response.ok) throw new Error("Failed to save YouTube data");
      
      const updatedScript = await response.json();
      
      // Update the Redux store to reflect changes in sidebar
      dispatch(updateSidebarScript(updatedScript));
      
      console.log("YouTube data saved successfully");
      
    } catch (error) {
      console.error("Error saving YouTube data:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold text-center">Enter YouTube URL</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl && setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={async () => {
              setIsLoading(true);
              try {
                const response = await axios.post(`${BASE_URL}/analyze-transcript/`, {
                  youtube_url: youtubeUrl
                });
                console.log("response", response);
                // Store transcript_analysis in analysis_script
                setYoutubeTranscript && setYoutubeTranscript(response.data.transcript_analysis);
                
                if (setYoutubeUrl) setYoutubeUrl(youtubeUrl || "");
                
                // Save to database if scriptId exists
                if (scriptId) {
                  await saveToDatabase(response.data.transcript_analysis);
                }
                
                setActiveTab && setActiveTab("NewTab");
              } catch (error) {
                console.error("Error analyzing transcript:", error);
              } finally {
                setIsLoading(false);
              }
            }}
              disabled={isLoading || !youtubeUrl?.trim()}
            className={`rounded-md px-6 py-3 font-medium text-white transition-all duration-200 ${isLoading || !youtubeUrl?.trim()
                ? "cursor-not-allowed bg-blue-400"
                : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
              }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {saving ? 'Saving...' : 'Analyzing...'}
              </div>
            ) : (
              "Analyse"
            )}
          </button>
        </div>
        {/* <button
          onClick={() => setActiveTab && setActiveTab("NewTab")}
          className="w-full px-6 py-3 font-medium text-white transition-all duration-200 bg-green-500 rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500"
        >
          Next
        </button> */}
      </div>
    </div>
  );
};

export default DemoTab;
