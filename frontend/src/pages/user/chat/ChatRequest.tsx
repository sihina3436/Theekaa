import React, { useState } from "react";
import ReceivedRequest from "./ReceivedRequest";
import SendRequest from "./SendRequest";

const ChatRequest: React.FC = () => {

  const [tab, setTab] = useState<"received" | "sent">("received");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Chat Requests
        </h1>

        {/* Tabs */}
        <div className="flex bg-white/80 backdrop-blur-xl border border-white/40 shadow-md rounded-xl p-1 mb-6 w-fit">

          <button
            onClick={() => setTab("received")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === "received"
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
                : "text-gray-500 hover:text-pink-400"
            }`}
          >
            <i className="ri-inbox-line mr-1"></i>
            Received
          </button>

          <button
            onClick={() => setTab("sent")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === "sent"
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
                : "text-gray-500 hover:text-pink-400"
            }`}
          >
            <i className="ri-send-plane-line mr-1"></i>
            Sent
          </button>

        </div>

        {tab === "received" ? <ReceivedRequest /> : <SendRequest />}

      </div>
    </div>
  );
};

export default ChatRequest;