
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  subscribeToMessages,
  sendMessage as firestoreSend,
  markMessagesAsRead,
  getRoomId,
} from "../../../services/firebase/chatService";
import { Message } from "../../../types/chat.types";
import { getBaseURL } from "../../../utils/baseURL";

const MessageTick: React.FC<{ status: Message["status"]; isMe: boolean }> = ({ status, isMe }) => {
  if (!isMe) return null;
  if (status === "sent")      return <span className="text-[10px] text-white/60 ml-1 select-none">✓</span>;
  if (status === "delivered") return <span className="text-[10px] text-white/60 ml-1 select-none">✓✓</span>;
  return <span className="text-[10px] text-blue-200 ml-1 select-none font-medium">✓✓</span>;
};

const MessageBubble: React.FC<{ msg: Message; isMe: boolean }> = ({ msg, isMe }) => {
  const time = msg.createdAt instanceof Date
    ? msg.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}>
      <div className={`relative max-w-[72%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm
        ${isMe
          ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-br-sm"
          : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"}`}>
        <p className="break-words">{msg.text}</p>
        <div className="flex items-center justify-end gap-0.5 mt-0.5">
          <span className={`text-[10px] ${isMe ? "text-white/60" : "text-gray-400"}`}>{time}</span>
          <MessageTick status={msg.status} isMe={isMe} />
        </div>
      </div>
    </div>
  );
};

const DateDivider: React.FC<{ date: string }> = ({ date }) => (
  <div className="flex items-center gap-2 my-3">
    <div className="flex-1 h-px bg-gray-200" />
    <span className="text-[11px] text-gray-400 font-medium px-2">{date}</span>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
);

const formatDateLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
};

interface ChatProps {
  otherUserId: string;
  otherUserName?: string;
  otherUserAvatar?: string;
  onBack?: () => void;
}

const Chat: React.FC<ChatProps> = ({ otherUserId, otherUserName = "User", otherUserAvatar, onBack }) => {
  const currentUser    = useSelector((state: any) => state.user.user);
  const currentUserId  = currentUser?._id ?? "";

  const [messages, setMessages]   = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading]  = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const unsubRef  = useRef<(() => void) | null>(null);

  const roomId = getRoomId(currentUserId, otherUserId);

  useEffect(() => {
    if (!currentUserId || !otherUserId) {
      setError("Cannot open chat — user session missing.");
      return;
    }
    setLoading(true);
    setError(null);
    unsubRef.current?.();

    unsubRef.current = subscribeToMessages(
      roomId,
      (msgs) => {
        setMessages(msgs);
        setLoading(false);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      },
      (err) => {
        setError(err.message.includes("permission")
          ? "Permission denied. Make sure you are logged in."
          : "Failed to load messages. Please try again.");
        setLoading(false);
      }
    );

    markMessagesAsRead(roomId, currentUserId).catch(console.error);
    return () => { unsubRef.current?.(); unsubRef.current = null; };
  }, [currentUserId, otherUserId, roomId]);

  useEffect(() => {
    if (!currentUserId || messages.length === 0) return;
    markMessagesAsRead(roomId, currentUserId).catch(console.error);
  }, [messages, roomId, currentUserId]);

  
  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !currentUserId || !otherUserId || sending) return;

    setInputText("");
    setSending(true);
    setError(null);

    
    try {
      await firestoreSend(roomId, currentUserId, otherUserId, text);
    } catch (err) {
      console.error("Firestore write failed:", err);
      setError("Failed to send message. Please try again.");
      setInputText(text); 
      setSending(false);
      inputRef.current?.focus();
      return;
    }

   
    try {
      await axios.post(
        `${getBaseURL()}/api/messages/send`,
        { senderId: currentUserId, receiverId: otherUserId, text },
        { withCredentials: true }
      );
    } catch (err) {
      
      console.warn("Push notification request failed (non-fatal):", err);
    }

    setSending(false);
    inputRef.current?.focus();
  }, [inputText, currentUserId, otherUserId, sending, roomId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const groupedMessages = messages.reduce<Array<{ dateLabel: string; msgs: Message[] }>>(
    (groups, msg) => {
      const date  = msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt);
      const label = formatDateLabel(date);
      const last  = groups[groups.length - 1];
      if (last && last.dateLabel === label) last.msgs.push(msg);
      else groups.push({ dateLabel: label, msgs: [msg] });
      return groups;
    }, []
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm z-10">
        {onBack && (
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="relative">
          <img src={otherUserAvatar || "/default-avatar.png"} alt={otherUserName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-200" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 text-sm truncate">{otherUserName}</h2>
          <p className="text-[11px] text-green-500 font-medium">Online</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)", backgroundSize: "24px 24px" }}>
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        {!loading && messages.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <span className="text-4xl">👋</span>
            <p className="text-gray-500 text-sm">
              Say hi to <span className="font-semibold text-violet-600">{otherUserName}</span>!
            </p>
          </div>
        )}
        {!loading && groupedMessages.map(({ dateLabel, msgs }) => (
          <div key={dateLabel}>
            <DateDivider date={dateLabel} />
            {msgs.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} isMe={msg.senderId === currentUserId} />
            ))}
          </div>
        ))}
        {error && (
          <div className="sticky bottom-0 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 text-center">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input ref={inputRef} value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={sending || loading}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-800
            placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white
            transition disabled:opacity-50"
        />
        <button onClick={handleSend} disabled={!inputText.trim() || sending || loading}
          className="w-10 h-10 flex items-center justify-center rounded-full
            bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md
            hover:from-violet-600 hover:to-indigo-700
            disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95">
          {sending ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 translate-x-px" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;
