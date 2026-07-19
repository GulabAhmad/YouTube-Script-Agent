import { createSlice } from "@reduxjs/toolkit";
import themeConfig from "@/theme.config";
import { TopicData } from "@/types/videoScript";

const initialState = {
  // =============================================
  user_id: "",  
  yt_url: "",
  yt_title: "",
  db_script: "",
  dboutlines: "",
  analysis_script: "",
  research_summary: "",
  sidebarScripts: [] as TopicData[],
  // =============================================
  isDarkMode: false,
  sidebar: false,
  theme: themeConfig.theme,
  menu: themeConfig.menu,
  layout: themeConfig.layout,
  rtlClass: themeConfig.rtlClass,
  animation: themeConfig.animation,
  navbar: themeConfig.navbar,
  locale: themeConfig.locale,
  semidark: themeConfig.semidark,
  languageList: [
    { code: "zh", name: "Chinese" },
    { code: "da", name: "Danish" },
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "hu", name: "Hungarian" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "es", name: "Spanish" },
    { code: "sv", name: "Swedish" },
    { code: "tr", name: "Turkish" },
    { code: "ae", name: "Arabic" },
  ],
};

const themeConfigSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {

    setYtUrl(state, { payload }) {
      state.yt_url = payload;
    },
    
    setUserId(state, { payload }) {
      state.user_id = payload;
    },

    setDbScript(state, { payload }) {
      state.db_script = payload;
    },
    setYtTitle(state, { payload }) {
      state.yt_title = payload;
    },
    setYtOutlines(state, { payload }) {
      state.dboutlines = payload;
    },

    setAnalysisScript(state, { payload }) {
      state.analysis_script = payload;
    },
    setResearchSummary(state, { payload }) {
      state.research_summary = payload;
    },

    // New actions for sidebar management
    setSidebarScripts(state, { payload }) {
      state.sidebarScripts = payload;
    },
    
    addSidebarScript(state, { payload }) {
      state.sidebarScripts.unshift(payload); // Add to beginning of array
    },
    
    updateSidebarScript(state, { payload }) {
      const index = state.sidebarScripts.findIndex(script => script.id === payload.id);
      if (index !== -1) {
        state.sidebarScripts[index] = payload;
      }
    },
    
    removeSidebarScript(state, { payload }) {
      state.sidebarScripts = state.sidebarScripts.filter(script => script.id !== payload);
    },
    
    toggleTheme(state, { payload }) {
      payload = payload || state.theme; // light | dark | system
      localStorage.setItem("theme", payload);
      state.theme = payload;
      if (payload === "light") {
        state.isDarkMode = false;
      } else if (payload === "dark") {
        state.isDarkMode = true;
      } else if (payload === "system") {
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          state.isDarkMode = true;
        } else {
          state.isDarkMode = false;
        }
      }

      if (state.isDarkMode) {
        document.querySelector("body")?.classList.add("dark");
      } else {
        document.querySelector("body")?.classList.remove("dark");
      }
    },
    toggleMenu(state, { payload }) {
      payload = payload || state.menu; // vertical, collapsible-vertical, horizontal
      localStorage.setItem("menu", payload);
      state.menu = payload;
    },
    toggleLayout(state, { payload }) {
      payload = payload || state.layout; // full, boxed-layout
      localStorage.setItem("layout", payload);
      state.layout = payload;
    },
    toggleRTL(state, { payload }) {
      payload = payload || state.rtlClass; // rtl, ltr
      localStorage.setItem("rtlClass", payload);
      state.rtlClass = payload;
      document
        .querySelector("html")
        ?.setAttribute("dir", state.rtlClass || "ltr");
    },
    toggleAnimation(state, { payload }) {
      payload = payload || state.animation; // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
      payload = payload?.trim();
      localStorage.setItem("animation", payload);
      state.animation = payload;
    },
    toggleNavbar(state, { payload }) {
      payload = payload || state.navbar; // navbar-sticky, navbar-floating, navbar-static
      localStorage.setItem("navbar", payload);
      state.navbar = payload;
    },
    toggleSemidark(state, { payload }) {
      payload = payload === true || payload === "true" ? true : false;
      localStorage.setItem("semidark", payload);
      state.semidark = payload;
    },
    toggleSidebar(state) {
      state.sidebar = !state.sidebar;
    },
    resetToggleSidebar(state) {
      state.sidebar = false;
    },
  },
});

export const {
  setDbScript,
  setYtTitle,
  setUserId,
  setYtUrl,
  setYtOutlines,
  setAnalysisScript,
  setResearchSummary,
  setSidebarScripts,
  addSidebarScript,
  updateSidebarScript,
  removeSidebarScript,
  toggleTheme,
  toggleMenu,
  toggleLayout,
  toggleRTL,
  toggleAnimation,
  toggleNavbar,
  toggleSemidark,
  toggleSidebar,
  resetToggleSidebar,
} = themeConfigSlice.actions;

export default themeConfigSlice.reducer;
