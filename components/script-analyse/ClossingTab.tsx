"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "@/store";
import { toast } from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import { updateSidebarScript } from "@/store/themeConfigSlice";

interface TabProps {
  setActiveTab: (tab: string) => void;
  topic: string;
  outline: string;
  research: string;
  youtubeTranscript: string;
  youtubeUrl: string;
  scriptId?: number;
  script: string;
  setScript: (script: string) => void;
}

const ClossingTab: React.FC<TabProps> = ({ setActiveTab, topic, outline, research, youtubeTranscript, youtubeUrl, scriptId, script, setScript }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiData, setApiData] = useState<any>(null);
  const hasFetched = useRef(false);
  const [saving, setSaving] = useState(false);

  // FIX: Move userId selector to top
  const redux_user_id = useSelector((state: IRootState) => state.themeConfig.user_id);
  const userId = redux_user_id || (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script || "");
    toast.success("Script copied to clipboard!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // FIX: Use userId from top
  const fetchScript = async () => {
    if (!topic || !outline || !research || !youtubeTranscript) {
      console.log("API not called because of missing value:", { topic, outline, research, youtubeTranscript });
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${BASE_URL}/generate-script/`, {
        topic,
        outline,
        research_summary: research,
        transcript_analysis: youtubeTranscript,
        reference_urls: [],
        user_id: userId,
        youtube_url: youtubeUrl
      });
      setApiData(response.data);
      setScript && setScript(response.data.script);
      // setHasFetched(true); // This line is removed as per the edit hint
    } catch (err) {
      setError("Failed to generate script.");
    } finally {
      setLoading(false);
    }
  };

  // FIX: Only call fetchScript when explicitly needed, not automatically
  useEffect(() => {
    // Only generate script if we have all required data and haven't fetched yet
    if (!hasFetched.current && topic && outline && research && youtubeTranscript && !script) {
      fetchScript();
      hasFetched.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, outline, research, youtubeTranscript]);

  // Reset hasFetched when research or outline changes (indicating they were regenerated)
  useEffect(() => {
    if (research && research.trim().length > 0 && outline && outline.trim().length > 0) {
      hasFetched.current = false;
    }
  }, [research, outline]);

  const handleRegenerate = () => {
    hasFetched.current = false; // Reset the flag to allow regeneration
    fetchScript();
  };

  const formatAIContent = (content: string) => {
    if (!content) return '';
    
    // Split content into lines and process each line
    const lines = content.split('\n');
    let formattedLines: string[] = [];
    let inList = false;
    let listType = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Skip empty lines but add proper spacing
      if (trimmedLine === '') {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push('<br>');
        continue;
      }
      
      // Headers (H1, H2, H3, etc.)
      if (trimmedLine.startsWith('#')) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        const level = trimmedLine.match(/^#+/)?.[0].length || 1;
        const text = trimmedLine.replace(/^#+\s*/, '');
        const headerClass = level === 1 ? 'text-2xl font-bold mb-4 mt-6' : 
                           level === 2 ? 'text-xl font-bold mb-3 mt-5' : 
                           'text-lg font-bold mb-2 mt-4';
        formattedLines.push(`<h${level} class="${headerClass} text-gray-800">${text}</h${level}>`);
        continue;
      }
      
      // Bold text with **
      if (trimmedLine.includes('**')) {
        const processedLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        if (!inList) {
          formattedLines.push(`<p class="mb-3 leading-relaxed text-gray-700">${processedLine}</p>`);
        } else {
          formattedLines.push(`<li class="mb-2 leading-relaxed text-gray-700">${processedLine}</li>`);
        }
        continue;
      }
      
      // Italic text with *
      if (trimmedLine.includes('*') && !trimmedLine.startsWith('* ')) {
        const processedLine = trimmedLine.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
        if (!inList) {
          formattedLines.push(`<p class="mb-3 leading-relaxed text-gray-700">${processedLine}</p>`);
        } else {
          formattedLines.push(`<li class="mb-2 leading-relaxed text-gray-700">${processedLine}</li>`);
        }
        continue;
      }
      
      // Unordered lists (- or *)
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (!inList || listType !== 'ul') {
          if (inList) formattedLines.push('</ol>');
          formattedLines.push('<ul class="list-disc list-inside mb-4 space-y-2">');
          inList = true;
          listType = 'ul';
        }
        const text = trimmedLine.substring(2);
        formattedLines.push(`<li class="mb-2 leading-relaxed text-gray-700">${text}</li>`);
        continue;
      }
      
      // Ordered lists (1., 2., etc.)
      if (trimmedLine.match(/^\d+\./)) {
        if (!inList || listType !== 'ol') {
          if (inList) formattedLines.push('</ul>');
          formattedLines.push('<ol class="list-decimal list-inside mb-4 space-y-2">');
          inList = true;
          listType = 'ol';
        }
        const text = trimmedLine.replace(/^\d+\.\s*/, '');
        formattedLines.push(`<li class="mb-2 leading-relaxed text-gray-700">${text}</li>`);
        continue;
      }
      
      // Code blocks
      if (trimmedLine.startsWith('```')) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push('<pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm">');
        continue;
      }
      if (trimmedLine.endsWith('```')) {
        formattedLines.push('</code></pre>');
        continue;
      }
      
      // Inline code with backticks
      if (trimmedLine.includes('`')) {
        const processedLine = trimmedLine.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>');
        if (!inList) {
          formattedLines.push(`<p class="mb-3 leading-relaxed text-gray-700">${processedLine}</p>`);
        } else {
          formattedLines.push(`<li class="mb-2 leading-relaxed text-gray-700">${processedLine}</li>`);
        }
        continue;
      }
      
      // Links
      if (trimmedLine.includes('[') && trimmedLine.includes('](')) {
        const processedLine = trimmedLine.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline font-medium">$1</a>');
        if (!inList) {
          formattedLines.push(`<p class="mb-3 leading-relaxed text-gray-700">${processedLine}</p>`);
        } else {
          formattedLines.push(`<li class="mb-2 leading-relaxed text-gray-700">${processedLine}</li>`);
        }
        continue;
      }
      
      // Regular paragraphs
      if (!inList) {
        formattedLines.push(`<p class="mb-3 leading-relaxed text-gray-700">${trimmedLine}</p>`);
      } else {
        formattedLines.push(`<li class="mb-2 leading-relaxed text-gray-700">${trimmedLine}</li>`);
      }
    }
    
    // Close any open list
    if (inList) {
      formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
    }
    
    return formattedLines.join('\n');
  };

  const handleSave = async () => {
    if (!scriptId) return;
    if (saving) return; // Prevent double-clicks
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${BASE_URL}/video-scripts/${scriptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic || "",
          script: script || "",
          user_id: userId, // <-- Use the variable from the top
          youtube_url: youtubeUrl || "",
          research: research || "",
          youtube_transcript: youtubeTranscript || "",
          outline: outline || ""
        })
      });
      if (!response.ok) throw new Error("Failed to save script");
      
      const updatedScript = await response.json();
      
      // Update the Redux store to reflect changes in sidebar
      dispatch(updateSidebarScript(updatedScript));
      
      toast.success("Script saved successfully!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      setError("Failed to save script.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 ">
      {loading && <div className="mb-4 text-blue-600">Generating script...</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      
      {/* Show Generate Script button if no script exists */}
      {!script && !loading && (
        <button
          className="px-6 py-2 mb-4 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
          type="button"
          onClick={fetchScript}
          disabled={loading || !topic || !outline || !research || !youtubeTranscript}
        >
          Generate Script
        </button>
      )}
      
      {/* Show Regenerate button if script exists */}
      {script && !loading && (
        <button
          className="px-6 py-2 mb-4 text-white transition-colors bg-gray-400 rounded-md hover:bg-gray-500"
          type="button"
          onClick={handleRegenerate}
          disabled={loading}
        >
          Regenerate Script
        </button>
      )}
      
      <div
        className="w-full p-6 text-gray-700 border rounded-lg bg-white shadow-sm overflow-y-auto"
        style={{ minHeight: '400px', maxHeight: '600px' }}
        dangerouslySetInnerHTML={{ __html: formatAIContent(script) }}
      />
      <button
        className="px-6 py-2 mt-4 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
        type="button"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      {/* {apiData && (
        <div className="p-4 mt-4 mb-6 border rounded bg-gray-50">
          <div className="mb-2"><b>Topic:</b> {apiData.topic}</div>
          <div className="mb-2"><b>Outline:</b> <pre className="whitespace-pre-line">{apiData.outline}</pre></div>
          <div className="mb-2"><b>Research Summary:</b> <pre className="whitespace-pre-line">{apiData.research_summary}</pre></div>
          <div className="mb-2"><b>Transcript Analysis:</b> <pre className="whitespace-pre-line">{apiData.transcript_analysis}</pre></div>
        </div>
      )} */}
    </div>
  );
};

export default ClossingTab;
