import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  HiUserCircle,
  HiHeart,
  HiPlusCircle,
  HiChat,
} from "react-icons/hi";
import { IoIosHome } from "react-icons/io";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";
type NavLinkItem = {
  name: string;
  icon: IconType;
  path: string;
};

const links: NavLinkItem[] = [
  { name: "Profile", icon: HiUserCircle, path: "/profile" },
  { name: "Feed", icon: HiHeart, path: "/feed" },
  { name: "Add Post", icon: HiPlusCircle, path: "/add-post" },
  { name: "Chat Requests", icon: HiChat, path: "/chat-requests" },
  { name: "Home", icon: IoIosHome  , path: "/" },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">

        {/* Logo */}
        <div onClick={() => navigate("/")} className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Theeka
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink key={link.name} to={link.path}>
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ y: -3 }}
                    className={`flex flex-col items-center text-sm transition ${
                      isActive
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                        : "text-gray-400 hover:text-pink-400"
                    }`}
                  >
                    <Icon
                      size={24}
                      className={
                        isActive
                          ? "text-pink-500"
                          : "text-gray-400 hover:text-pink-400"
                      }
                    />

                    <span className="text-xs mt-1">{link.name}</span>

                    {isActive && (
                      <motion.div
                        layoutId="indicator"
                        className="w-6 h-1 rounded-full mt-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;