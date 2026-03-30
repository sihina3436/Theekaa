import React, { useState } from "react";

import CurrentPost from "./CurrentPost";
import AddProfile from "./AddProfile";
import UpdateProfile from "./UpdateProfile";
import ProfileDetails from "./ProfileDetails";

import { FiUser, FiEdit, FiPlus, FiFileText } from "react-icons/fi";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("post");

  const tabs: Tab[] = [
    { id: "post", label: "Current Post", icon: <FiFileText size={15} /> },
    { id: "profile", label: "Profile", icon: <FiUser size={15} /> },
    { id: "add", label: "Add Profile", icon: <FiPlus size={15} /> },
    { id: "update",  label: "Update Profile",  icon: <FiEdit size={15} /> },
  ];

  const SectionHeader = ({
    title,
    subtitle,
    icon,
    badge,
  }: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    badge?: string;
  }) => (
    <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow">
          {icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400">{subtitle}</p>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      </div>
      {badge && (
        <div className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow">
          {badge}
        </div>
      )}
    </div>
  );

  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  return (

    <div className="h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex flex-col lg:flex-row">

      <aside className="hidden lg:flex lg:flex-col lg:w-64 h-full bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-xl">
        <div className="p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            My Dashboard
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

      <div className="lg:hidden flex flex-col h-full">

        <header className="shrink-0 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm">
          <div className="px-4 pt-4 pb-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              My Dashboard
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

        <main className="flex-1 overflow-y-auto p-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6">

            {activeTab === "post" && (
              <>
                <SectionHeader title="Your Current Post" subtitle="Post Overview" icon={<FiFileText size={16} />} />
                <CurrentPost />
              </>
            )}
            {activeTab === "profile" && (
              <>
                <SectionHeader title="Your Profile" subtitle="Profile Details" icon={<FiUser size={16} />} />
                <ProfileDetails />
              </>
            )}
            {activeTab === "add" && (
              <>
                <SectionHeader title="Add Profile" subtitle="Create New" icon={<FiPlus size={16} />} badge="New" />
                <AddProfile />
              </>
            )}
            {activeTab === "update" && (
              <>
                <SectionHeader title="Update Profile" subtitle="Profile Settings" icon={<FiEdit size={16} />} badge="Edit Mode" />
                <UpdateProfile />
              </>
            )}

          </div>
        </main>

      </div>

      {/* ── Desktop scrollable content ── */}
      <main className="hidden lg:flex flex-1 h-full overflow-y-auto p-10">
        <div className="w-full bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-10 self-start">

          {activeTab === "post" && (
            <>
              <SectionHeader title="Your Current Post" subtitle="Post Overview" icon={<FiFileText size={16} />} />
              <CurrentPost />
            </>
          )}
          {activeTab === "profile" && (
            <>
              <SectionHeader title="Your Profile" subtitle="Profile Details" icon={<FiUser size={16} />} />
              <ProfileDetails />
            </>
          )}
          {activeTab === "add" && (
            <>
              <SectionHeader title="Add Profile" subtitle="Create New" icon={<FiPlus size={16} />} badge="New" />
              <AddProfile />
            </>
          )}
          {activeTab === "update" && (
            <>
              <SectionHeader title="Update Profile" subtitle="Profile Settings" icon={<FiEdit size={16} />} badge="Edit Mode" />
              <UpdateProfile />
            </>
          )}

        </div>
      </main>

    </div>
  );
};

export default Profile;
