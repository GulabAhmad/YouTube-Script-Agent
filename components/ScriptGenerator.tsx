// import React, { useState } from 'react';
// import DemoTab from './live-calls/DemoTab';
// import DiscoveryTab from './live-calls/DiscoveryTab';
// import ClossingTab from './live-calls/ClossingTab';

// const ScriptGenerator: React.FC = () => {
//     const [youtubeUrl, setYoutubeUrl] = useState<string>('');
//     const [referenceUrls, setReferenceUrls] = useState<string[]>([]);
//     const [activeTab, setActiveTab] = useState<'demo' | 'discovery' | 'closing'>('demo');

//     const handleYoutubeUrlChange = (url: string) => {
//         setYoutubeUrl(url);
//         // Automatically move to discovery tab when URL is set
//         setActiveTab('discovery');
//     };

//     const handleReferenceUrlsChange = (urls: string[]) => {
//         setReferenceUrls(urls);
//         // Automatically move to closing tab when reference URLs are set
//         setActiveTab('closing');
//     };

//     return (
//         <div className="container px-4 py-8 mx-auto">
//             {/* Tab Navigation */}
//             <div className="flex mb-8 space-x-4 border-b">
//                 <button
//                     className={`px-4 py-2 ${
//                         activeTab === 'demo'
//                             ? 'border-b-2 border-blue-500 text-blue-600'
//                             : 'text-gray-500'
//                     }`}
//                     onClick={() => setActiveTab('demo')}
//                 >
//                     Demo
//                 </button>
//                 <button
//                     className={`px-4 py-2 ${
//                         activeTab === 'discovery'
//                             ? 'border-b-2 border-blue-500 text-blue-600'
//                             : 'text-gray-500'
//                     }`}
//                     onClick={() => setActiveTab('discovery')}
//                 >
//                     Discovery
//                 </button>
//                 <button
//                     className={`px-4 py-2 ${
//                         activeTab === 'closing'
//                             ? 'border-b-2 border-blue-500 text-blue-600'
//                             : 'text-gray-500'
//                     }`}
//                     onClick={() => setActiveTab('closing')}
//                 >
//                     Script Generation
//                 </button>
//             </div>

//             {/* Tab Content */}
//             <div className="mt-4">
//                 {activeTab === 'demo' && (
//                     <DemoTab onYoutubeUrlChange={handleYoutubeUrlChange} />
//                 )}
//                 {activeTab === 'discovery' && (
//                     <DiscoveryTab
//                         calls={[]}
//                         onReferenceUrlsChange={handleReferenceUrlsChange}
//                     />
//                 )}
//                 {activeTab === 'closing' && (
//                     <ClossingTab
//                         youtube_url={youtubeUrl}
//                         reference_urls={referenceUrls}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ScriptGenerator; 