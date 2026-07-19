"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "@/lib/utils";

const GenerateScript = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [references, setReferences] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const isSubmitting = useRef(false);

  const handleAddReference = () => {
    setReferences([...references, ""]);
  };

  const handleChangeReference = (index: number, value: string) => {
    const newRefs = [...references];
    newRefs[index] = value;
    setReferences(newRefs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting.current) {
      console.log("Form is already submitting, ignoring this submission");
      return;
    }
    
    isSubmitting.current = true;
    setLoading(true);
    setError(null);
    
    try {
      console.log("Submitting form...");
      const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
      const res = await axios.post(`${BASE_URL}/generate-script/`, {
        topic,
        outline: "", // No outline field in this form, so send empty string
        research_summary: "", // No research_summary field in this form, so send empty string
        transcript_analysis: "", // No transcript_analysis field in this form, so send empty string
        reference_urls: references.filter((ref) => ref.trim() !== ""),
        user_id: userId,
        youtube_url: youtubeUrl
      });
      setResponse(res.data);
      console.log("Form submitted successfully");
    } catch (error: any) {
      console.error('Error generating script:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while generating the script');
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl p-8 mx-auto bg-white shadow-2xl rounded-xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-blue-700">
          AI Script Generator
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">YouTube URL</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Topic</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Reference URLs</label>
            {references.map((ref, idx) => (
              <input
                key={idx}
                type="text"
                className="w-full p-2 mb-2 border rounded-lg"
                value={ref}
                onChange={(e) => handleChangeReference(idx, e.target.value)}
              />
            ))}
            <button
              type="button"
              className="mt-2 text-sm text-blue-600 hover:underline"
              onClick={handleAddReference}
            >
              + Add another reference
            </button>
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 font-semibold text-white transition duration-200 rounded-lg ${
              loading || isSubmitting.current
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading || isSubmitting.current}
          >
            {loading || isSubmitting.current ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </div>
            ) : (
              "Generate Script"
            )}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {response && (
          <div className="mt-6 max-h-[600px] overflow-auto rounded-lg bg-gray-50 p-4 shadow-inner">
            <h2 className="mb-3 text-xl font-bold text-green-700">
              Script Result
            </h2>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateScript;
