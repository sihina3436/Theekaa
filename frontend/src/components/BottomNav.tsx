import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  HiUserCircle,
  HiHeart,
  HiPlusCircle,
  HiChat,
} from "react-icons/hi";
import { IoIosHome } from "react-icons/io";

const BottomNav: React.FC = () => {
  const links = [
    { name: "Profile", icon: HiUserCircle, path: "/profile" },
    { name: "Feed", icon: HiHeart, path: "/feed" },
    { name: "Add", icon: HiPlusCircle, path: "/add-post", center: true },
    { name: "Chat Requests", icon: HiChat, path: "/chat-requests" },
    { name: "Home", icon: IoIosHome  , path: "/" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-md py-2 z-50">
      <div className="grid grid-cols-5 max-w-md mx-auto items-end">

        {links.map((link) => {
          const Icon = link.icon;

          if (link.center) {
            return (
              <NavLink key={link.name} to={link.path} className="flex justify-center">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="p-[3px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg -translate-y-6"
                >
                  <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 rounded-full">
                    <Icon size={26} className="text-white" />
                  </div>
                </motion.div>
              </NavLink>
            );
          }

          return (
            <NavLink key={link.name} to={link.path}>
              {({ isActive }) => (
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  className={`flex flex-col items-center text-[11px] transition ${
                    isActive ? "text-pink-500" : "text-gray-400 hover:text-pink-400"
                  }`}
                >
                  <Icon
                    size={24}
                    className={
                      isActive ? "text-pink-500" : "text-gray-400"
                    }
                  />
                  <span
                    className={
                      isActive
                        ? "mt-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                        : "mt-1"
                    }
                  >
                    {link.name}
                  </span>
                </motion.div>
              )}
            </NavLink>
          );
        })}

      </div>
    </nav>
  );
};

export default BottomNav;