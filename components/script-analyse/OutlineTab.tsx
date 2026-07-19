"use client";
import React, { useState, useEffect, useRef } from "react";
import { BASE_URL } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateSidebarScript } from "@/store/themeConfigSlice";
import { IRootState } from "@/store";

interface TabProps {
  setActiveTab: (tab: string) => void;
  outline: string;
  setOutline: (outline: string) => void;
  topic: string;
  research: string;
  youtubeTranscript: string;
  scriptId?: number;
  setScript?: (script: string) => void;
}

const OutlineTab: React.FC<TabProps> = ({ setActiveTab, outline, setOutline, topic, research, youtubeTranscript, scriptId, setScript }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);

  const fetchOutline = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${BASE_URL}/create-outline/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          research_summary: research,
          transcript_analysis: youtubeTranscript,
        }),
      });
      const data = await response.json();
      setOutline && setOutline(data.outline);
      
      // Clear script when outline is regenerated
      if (setScript) setScript("");
      
      // Save the outline to database
      if (scriptId) {
        await saveOutlineToDatabase(data.outline);
      }
    } catch (err) {
      setError("Failed to fetch outline.");
    } finally {
      setLoading(false);
    }
  };

  const saveOutlineToDatabase = async (outlineContent: string) => {
    if (!scriptId) return;
    
    setSaving(true);
    try {
      const response = await fetch(`${BASE_URL}/video-scripts/${scriptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic || "",
          script: "", // Clear script when outline is regenerated
          user_id: useSelector((state: IRootState) => state.themeConfig.user_id) || localStorage.getItem("userId"), // <-- Added user_id
          youtube_url: "",
          research: research || "",
          youtube_transcript: youtubeTranscript || "",
          outline: outlineContent || ""
        })
      });
      
      if (!response.ok) throw new Error("Failed to save outline");
      
      const updatedScript = await response.json();
      
      // Update the Redux store to reflect changes in sidebar
      dispatch(updateSidebarScript(updatedScript));
      
      console.log("Outline saved successfully");
      
    } catch (error) {
      console.error("Error saving outline:", error);
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
        return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
      }
      // Italic text
      if (line.includes('*') && line.includes('*')) {
        return `<p>${line.replace(/\*(.*?)\*/g, '<em>$1</em>')}</p>`;
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
        return `<p>${line.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')}</p>`;
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
        return `<p>${line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')}</p>`;
      }
      // Images
      if (line.includes('![') && line.includes('](')) {
        return `<p>${line.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')}</p>`;
      }
      // Default: wrap in paragraph
      if (line.trim() !== '') {
        return `<p>${line}</p>`;
      }
      return '';
    }).join('\n');
  };

  // Call fetchOutline on mount if outline is empty or null
  useEffect(() => {
    if (!hasFetched.current && (!outline || outline.length === 0)) {
      fetchOutline();
      hasFetched.current = true;
    }
  }, [outline]);

  // Reset hasFetched when research changes (indicating research was regenerated)
  useEffect(() => {
    if (research && research.trim().length > 0) {
      hasFetched.current = false;
    }
  }, [research]);

  const handleRegenerateOutline = () => {
    hasFetched.current = false;
    fetchOutline();
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold text-center">Script Outline</h2>
        {loading && <div className="mb-4 text-blue-600">Generating outline...</div>}
        {saving && <div className="mb-4 text-green-600">Saving outline...</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}
      </div>
      <div className="py-6">
        {outline && (
          <>
            <div className="p-4 mb-6 text-gray-800 whitespace-pre-line border rounded bg-gray-50"
                 dangerouslySetInnerHTML={{ __html: formatAIContent(outline) }}
            />
            <div className="flex justify-between">
              <button
                className="px-6 py-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700"
                onClick={handleRegenerateOutline}
                disabled={loading || saving}
              >
                {loading ? "Regenerating..." : "Regenerate Outline"}
              </button>
              <button
                className="px-6 py-2 text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700"
                onClick={() => setActiveTab && setActiveTab("Closing")}
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

export default OutlineTab;
