"use client";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { addSidebarScript, updateSidebarScript } from "@/store/themeConfigSlice";
import { IRootState } from "@/store";

interface TabProps {
  setActiveTab: (tab: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  research: string;
  setResearch: (research: string) => void;
  youtubeTranscript: string;
  scriptId?: number;
  setScriptId?: (id: number) => void;
  setOutline?: (outline: string) => void;
  setScript?: (script: string) => void;
}

const DiscoveryTab: React.FC<TabProps> = ({ 
  setActiveTab, 
  topic, 
  setTopic, 
  research, 
  setResearch, 
  youtubeTranscript, 
  scriptId, 
  setScriptId,
  setOutline,
  setScript
}) => {
  
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const redux_user_id = useSelector((state: IRootState) => state.themeConfig.user_id);
  
  console.log("research", research);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/research/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          transcript_analysis: youtubeTranscript,
        }),
      });
      const data = await response.json();
      setResearch && setResearch(data?.research_summary);
      
      // Clear outline and script when research is regenerated
      if (setOutline) setOutline("");
      if (setScript) setScript("");
      
      // After research is completed, save the topic to database and update sidebar
      await saveTopicToDatabase(data?.research_summary);
      
    } catch (error) {
      console.error("Error researching topic:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateResearch = async () => {
    if (!topic.trim()) {
      console.error("No topic to regenerate");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/research/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          transcript_analysis: youtubeTranscript,
        }),
      });
      const data = await response.json();
      setResearch && setResearch(data?.research_summary);
      
      // Clear outline and script when research is regenerated
      if (setOutline) setOutline("");
      if (setScript) setScript("");
      
      // After research is completed, save the topic to database and update sidebar
      await saveTopicToDatabase(data?.research_summary);
      
    } catch (error) {
      console.error("Error regenerating research:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveTopicToDatabase = async (researchSummary: string) => {
    setSaving(true);
    try {
      const userId = redux_user_id || localStorage.getItem("userId");
      if (!userId) throw new Error("No user ID found");

      let response;
      
      if (scriptId) {
        // Update existing script - clear outline and script when research is regenerated
        response = await fetch(`${BASE_URL}/video-scripts/${scriptId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: topic || "",
            script: "", // Clear script when research is regenerated
            user_id: userId, // <-- Added user_id
            youtube_url: "",
            research: researchSummary || "",
            youtube_transcript: youtubeTranscript || "",
            outline: "" // Clear outline when research is regenerated
          })
        });
      } else {
        // Create new script
        response = await fetch(`${BASE_URL}/video-scripts/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: topic || "New Script",
            script: "",
            user_id: userId,
            youtube_url: "",
            research: researchSummary || "",
            youtube_transcript: youtubeTranscript || "",
            outline: ""
          })
        });
      }

      if (!response.ok) throw new Error("Failed to save topic");
      
      const savedScript = await response.json();
      
      // Update Redux store
      if (scriptId) {
        dispatch(updateSidebarScript(savedScript));
      } else {
        dispatch(addSidebarScript(savedScript));
        // Update the scriptId in the parent component
        if (setScriptId) {
          setScriptId(savedScript.id);
        }
      }
      
      console.log("Topic saved successfully:", savedScript);
      
    } catch (error) {
      console.error("Error saving topic:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatAIContent = (content: string) => {
    if (!content) return '';
    return content.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+\s*/, '');
        return `<h${level} class="text-lg font-bold mb-2">${text}</h${level}>`;
      }
      // Bold text
      if (line.includes('**') && line.includes('**')) {
        return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      }
      // Italic text
      if (line.includes('*') && line.includes('*')) {
        return line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      }
      // Code blocks
      if (line.startsWith('```')) {
        return '<pre class="bg-gray-100 p-2 rounded my-2"><code>';
      }
      if (line.endsWith('```')) {
        return '</code></pre>';
      }
      // Inline code
      if (line.includes('`') && line.includes('`')) {
        return line.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
      }
      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return `<li class="ml-4">${line.substring(2)}</li>`;
      }
      if (line.match(/^\d+\./)) {
        return `<li class="ml-4">${line.replace(/^\d+\.\s*/, '')}</li>`;
      }
      // Links
      if (line.includes('[') && line.includes('](')) {
        return line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
      }
      // Images
      if (line.includes('![') && line.includes('](')) {
        return line.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />');
      }
      return line;
    }).join('\n');
  };

  return (
    <div className="max-w-4xl p-6 mx-auto border-0 border-red-700">
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold text-center">Research Topic</h2>
        <form onSubmit={handleResearch} className="space-y-6">
          <div>
            <input
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic && setTopic(e.target.value);
              }}
              placeholder="Topic for Research"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading || saving}
              className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : saving ? "Saving..." : "Research Topic"}
            </button>
          </div>
        </form>
      </div>
      <div className="py-6">
        {research && (
          <>
            <div className="p-4 mb-6 text-gray-800 whitespace-pre-line border rounded bg-gray-50"
                 dangerouslySetInnerHTML={{ __html: formatAIContent(research) }}
            />
            <div className="flex justify-between">
              <button
                className="px-6 py-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700"
                onClick={handleRegenerateResearch}
                disabled={loading || saving}
              >
                {loading ? "Regenerating..." : "Regenerate Research"}
              </button>
              <button
                className="px-6 py-2 text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700"
                onClick={() => setActiveTab && setActiveTab("Outline")}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoveryTab;
