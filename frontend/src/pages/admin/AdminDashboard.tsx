import React, { useState } from "react";
import ManageUsers from "./users/ManageUsers";
import ManagePosts from "./posts/ManagePosts";
import ManageWebsite from "./site/ManageWebsite";
import { FiUsers, FiFileText, FiGlobe, FiSettings } from "react-icons/fi";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const AdminDashboard: React.FC = () => {

  const [activeTab, setActiveTab] = useState<Tab["id"]>("User");

  const tabs: Tab[] = [
    { id: "User", label: "Manage Users", icon: <FiUsers size={15} /> },
    { id: "Posts", label: "Manage Posts", icon: <FiFileText size={15} /> },
    { id: "WebSite", label: "Manage Website", icon: <FiGlobe size={15} /> },
    { id: "Settings", label: "Settings", icon: <FiSettings size={15} /> },
  ];

  return (
  
    <div className="h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex flex-col lg:flex-row">

      {/* ── Sidebar (desktop) — fixed height, never scrolls ── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 h-full bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-xl">

        <div className="p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 text-left p-3 rounded-xl font-medium transition
                ${activeTab === tab.id
                  ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                }`}
            >
              <span className={activeTab === tab.id ? "opacity-90" : "opacity-50"}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

      </aside>

      {/* ── Mobile layout: pinned header + scrollable content ── */}
      <div className="lg:hidden flex flex-col h-full">

        <header className="shrink-0 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm">
          <div className="px-4 pt-4 pb-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Admin Panel
            </h2>
          </div>
          <div className="flex overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition
                  ${activeTab === tab.id
                    ? "text-pink-500 border-pink-500"
                    : "text-gray-500 border-transparent hover:text-purple-400"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Mobile scrollable content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6">
            <TabContent activeTab={activeTab} />
          </div>
        </main>

      </div>

      {/* ── Desktop scrollable content ── */}
      <main className="hidden lg:flex flex-1 h-full overflow-y-auto p-10">
        <div className="w-full bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-10 self-start">
          <TabContent activeTab={activeTab} />
        </div>
      </main>

    </div>
  );
};

/* Extracted to avoid duplication between mobile and desktop */
const TabContent: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const headingClass =
    "text-xl lg:text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent";

  return (
    <>
      {activeTab === "User" && (
        <>
          <h1 className={headingClass}>Manage Users</h1>
          <ManageUsers />
        </>
      )}

      {activeTab === "Posts" && (
        <>
          <h1 className={headingClass}>Manage Posts</h1>
          <ManagePosts />
        </>
      )}

      {activeTab === "WebSite" && (
        <>
          <h1 className={headingClass}>Manage Website</h1>
          <ManageWebsite />
        </>
      )}

      {activeTab === "Settings" && (
        <>
          <h1 className={headingClass}>Settings</h1>
          <p className="text-gray-400 text-sm">Settings coming soon.</p>
        </>
      )}
    </>
  );
};

export default AdminDashboard;
