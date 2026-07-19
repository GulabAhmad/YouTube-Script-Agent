"use client";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { toggleSidebar, setSidebarScripts, addSidebarScript, updateSidebarScript, removeSidebarScript } from "@/store/themeConfigSlice";
import { IRootState } from "@/store";
import { useState, useEffect } from "react";
import IconCaretsDown from "@/components/icon/icon-carets-down";
import IconMenuDashboard from "@/components/icon/menu/icon-menu-dashboard";
import IconMinus from "@/components/icon/icon-minus";
import { usePathname, useRouter } from "next/navigation";
import { getTranslation } from "@/i18n";
import IconTrendingUp from "@/components/icon/icon-trending-up";
import { setDbScript } from "@/store/themeConfigSlice";
import { Youtube } from "lucide-react";
import { BASE_URL } from "@/lib/utils";
import IconTrash from "@/components/icon/icon-trash";
import { toast } from "react-toastify";
import { TopicData } from "@/types/videoScript";

const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = getTranslation();
  const pathname = usePathname();
  const [currentMenu, setCurrentMenu] = useState<string>("");
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark
  );

  const redux_user_id = useSelector((state: IRootState) => state.themeConfig.user_id);
  const scripts = useSelector((state: IRootState) => state.themeConfig.sidebarScripts);

  const [creating, setCreating] = useState(false);

  // Hydrate Redux user_id from localStorage if missing
  useEffect(() => {
    if (!redux_user_id) {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        dispatch(require("@/store/themeConfigSlice").setUserId(storedUserId));
      }
    }
  }, [redux_user_id, dispatch]);

  useEffect(() => {
    // Fetch scripts from API only if userId is available
    const fetchScripts = async () => {
      try {
        // Get user ID from Redux (should be hydrated if needed)
        const userId = redux_user_id || localStorage.getItem("userId");
        if (!userId) {
          console.error("No user ID found in Redux or localStorage");
          dispatch(setSidebarScripts([]));
          return;
        }
        console.log("userId", userId);
        // Call the new API endpoint
        const response = await fetch(`${BASE_URL}/get-history/${userId}`);
        const data = await response.json();
        // Set scripts in Redux store
        dispatch(setSidebarScripts(data.reverse()));
      } catch (error) {
        console.error("Error fetching scripts:", error);
        dispatch(setSidebarScripts([]));
      }
    };
    if (redux_user_id || localStorage.getItem("userId")) {
      fetchScripts();
    }
  }, [redux_user_id, dispatch]);

  const handleTopicClick = (topic: TopicData) => {
    setSelectedId(topic.id);
    dispatch(setDbScript(topic.script));
  };

  const handleDeleteScript = async (scriptId: number) => {
    setDeleting(scriptId);
    try {
      const response = await fetch(`${BASE_URL}/video-scripts/${scriptId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) throw new Error("Failed to delete script");
      
      // Remove from Redux store
      dispatch(removeSidebarScript(scriptId));
      
      // If we're currently on the deleted script page, redirect to home
      if (pathname === `/script-analyse/${scriptId}`) {
        router.push('/');
      }
      
      console.log("Script deleted successfully");
      toast.success("Script deleted successfully!");
    } catch (error) {
      console.error("Error deleting script:", error);
      toast.error("Failed to delete script.");
    } finally {
      setDeleting(null);
      setShowDeleteConfirm(null);
    }
  };

  const confirmDelete = (scriptId: number) => {
    setShowDeleteConfirm(scriptId);
  };

  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? "" : value;
    });
  };

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any =
          ul.closest("li.menu").querySelectorAll(".nav-link") || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [pathname]);

  const setActiveRoute = () => {
    let allLinks = document.querySelectorAll(".sidebar ul a.active");
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove("active");
    }
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    selector?.classList.add("active");
  };

  // Helper to generate a unique New Script topic
  const generateUniqueNewScript = () => {
    let i = 1;
    let topic = `New Script`;
    const topicSet = new Set(scripts.map(t => t.topic));
    while (topicSet.has(topic)) {
      i++;
      topic = `New Script ${i}`;
    }
    return topic;
  };

  const handleNewStory = async () => {
    setCreating(true);
    try {
      const userId = redux_user_id || localStorage.getItem("userId");
      if (!userId) throw new Error("No user ID found");
      const topic = generateUniqueNewScript();
      const payload = {
        topic,
        script: '',
        user_id: userId,
        youtube_url: '',
        research: '',
        youtube_transcript: '',
        outline: ''
      };
      const response = await fetch(`${BASE_URL}/video-scripts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to create script");
      const newScript = await response.json();
      // Add to Redux store immediately
      dispatch(addSidebarScript(newScript));
      setSelectedId(newScript.id);
      router.push(`/script-analyse/${newScript.id}`);
      toast.success("New script created successfully!");
    } catch (error) {
      console.error("Error creating new story:", error);
      toast.error("Failed to create new script.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="dark">
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] text-white-dark shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300`}
      >
        <div className="h-full bg-black">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <Link href="/" className="flex items-center main-logo shrink-0">
              <Youtube className="w-6 h-6 text-white" />
            </Link>

            <button
              type="button"
              className="flex items-center w-8 h-8 transition duration-300 rounded-full collapse-icon hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              <li className="nav-item">
                <ul>
                  <li className="mt-2 nav-item">
                    <button
                      className="w-full text-left group"
                      onClick={handleNewStory}
                      disabled={creating}
                    >
                      <div className="flex items-center">
                        <span className="text-sm text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                          {creating ? 'Creating...' : t("New Story")}
                        </span>
                      </div>
                    </button>
                  </li>
                  {/* Display scripts list */}
                  {scripts.map((topic, index) => {
                    const isActive = pathname === `/script-analyse/${topic.id}`;
                    return (
                      <li key={index} className="mt-2 nav-item relative">
                        <div
                          className={`w-full flex items-center justify-between px-3 py-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group ${
                            isActive ? 'bg-blue-500/30 border-l-4 border-blue-500 dark:bg-blue-700/40 dark:border-blue-400' : ''
                          }`}
                          onMouseEnter={() => setHoveredItem(topic.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <Link
                            href={`/script-analyse/${topic.id}`}
                            className="flex-1 flex items-center min-w-0"
                          >
                            <span
                              className={`text-sm font-medium truncate ${isActive ? 'text-white font-bold' : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'}`}
                              title={topic.topic}
                            >
                              {topic.topic}
                            </span>
                          </Link>
                          {/* Delete icon */}
                          <div className="relative">
                            <button
                              className={`p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200 ${
                                hoveredItem === topic.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                confirmDelete(topic.id);
                              }}
                              disabled={deleting === topic.id}
                              title="Delete script"
                            >
                              {deleting === topic.id ? (
                                <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <IconTrash className="w-4 h-4 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" />
                              )}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                  {scripts.length === 0 && (
                    <li className="mt-2 nav-item">
                      <div className="flex items-center px-1 py-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400 ltr:pl-3 rtl:pr-3">
                          No scripts yet. Start by creating a new story!
                        </span>
                      </div>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Script
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this script? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deleting === showDeleteConfirm}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                onClick={() => handleDeleteScript(showDeleteConfirm)}
                disabled={deleting === showDeleteConfirm}
              >
                {deleting === showDeleteConfirm ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
