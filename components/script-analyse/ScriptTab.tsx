"use client"
import React from 'react'

interface TabProps {
    setActiveTab?: (tab: string) => void;
    youtubeTranscript?: string;
}

const ScriptTab: React.FC<TabProps> = ({ setActiveTab, youtubeTranscript }) => {
    

    // Format AI-generated content with proper styling
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

    return (
        <>
            <div className="p-2">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Video Script</h2>

                <div
                    className="w-full p-6 text-gray-700 border rounded-lg bg-white shadow-sm overflow-y-auto"
                    style={{ minHeight: '400px', maxHeight: '600px' }}
                    dangerouslySetInnerHTML={{ __html: formatAIContent(youtubeTranscript || '') }}
                />
            </div>
            <div className="bottom-0 flex justify-end mt-6">
                <button
                    className="px-6 py-2 text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700"
                    onClick={() => setActiveTab && setActiveTab("Discovery")}
                >
                    Next
                </button>
            </div>

            {/* <button
                onClick={() => {
                    setActiveTab && setActiveTab("Discovery");
                }}
                className={`rounded-md px-6 py-3 font-medium text-white transition-all duration-200 
                bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500`}
            >
                buttn
            </button> */}
        </>
    )
}

export default ScriptTab