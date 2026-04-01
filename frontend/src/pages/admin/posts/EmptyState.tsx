import React from "react";
import { GRADIENT, GRADIENT_TEXT } from "./postTypes";

interface EmptyStateProps {
  icon: string;
  msg: string;
  spin?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, msg, spin }) => (
  <div className="flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-md gap-4">
    <div className={`p-[2px] rounded-full ${GRADIENT} opacity-40`}>
      <div className="bg-white rounded-full p-4">
        <i className={`${icon} text-3xl ${GRADIENT_TEXT} ${spin ? "animate-spin" : ""}`} />
      </div>
    </div>
    <p className="text-sm text-gray-400">{msg}</p>
  </div>
);

export default EmptyState;
