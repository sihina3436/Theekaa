// context/ChatContext.tsx
import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import {
  getOrCreateChatRoom,
  sendMessage,
  fetchMessages,
  editMessage,
  deleteMessage,
  markMessageAsRead,
  muteChat,
  archiveChat,
  updateChatMetadata,
} from "../services/firebase/chatService";
import {
  IChatRoom,
  IChatMessage,
  IChatContextType,
} from "../types/chat.types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ChatContext = createContext<IChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentChatRoom, setCurrentChatRoom] = useState<IChatRoom | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);


  const currentUserId = "";
  const currentUserName = ""; 
  const currentUserProfilePic = ""; 


  const openChat = useCallback(
    async (otherUserId: string) => {
      setLoading(true);
      setError(null);

      try {
       
        const chatRoom = await getOrCreateChatRoom(currentUserId, otherUserId);
        setCurrentChatRoom(chatRoom);

        
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }

      
        const messagesRef = collection(db, "messages");
        const q = query(
          messagesRef,
          where("chatRoomId", "==", chatRoom.id)
        );

        unsubscribeRef.current = onSnapshot(q, (snapshot) => {
          const fetchedMessages = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate?.() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
            }))
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            ) as IChatMessage[];

          setMessages(fetchedMessages);
        });

        // Mark all messages as read
        await updateChatMetadata(currentUserId, chatRoom.id, {
          unreadCount: 0,
          lastReadTime: new Date(),
        });
      } catch (err) {
        console.error("Error opening chat:", err);
        setError(err instanceof Error ? err.message : "Failed to open chat");
      } finally {
        setLoading(false);
      }
    },
    [currentUserId]
  );

  /**
   * SEND MESSAGE
   */
  const sendChatMessage = useCallback(
    async (content: string, images?: File[]) => {
      if (!currentChatRoom) {
        setError("No chat room selected");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await sendMessage(
          currentChatRoom.id,
          currentUserId,
          currentUserName,
          currentUserProfilePic,
          content,
          images
        );
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setLoading(false);
      }
    },
    [currentChatRoom, currentUserId, currentUserName, currentUserProfilePic]
  );

  /**
   * EDIT MESSAGE
   */
  const editChatMessage = useCallback(async (messageId: string, newContent: string) => {
    setError(null);

    try {
      await editMessage(messageId, newContent);
    } catch (err) {
      console.error("Error editing message:", err);
      setError(err instanceof Error ? err.message : "Failed to edit message");
    }
  }, []);

  /**
   * DELETE MESSAGE
   */
  const deleteChatMessage = useCallback(async (messageId: string) => {
    setError(null);

    try {
      const message = messages.find((m) => m.id === messageId);
      if (message) {
        await deleteMessage(messageId, message.images);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      setError(err instanceof Error ? err.message : "Failed to delete message");
    }
  }, [messages]);

  /**
   * MARK AS READ
   */
  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  }, []);

  /**
   * MUTE CHAT
   */
  const muteChatRoom = useCallback(async (chatRoomId: string) => {
    try {
      await muteChat(currentUserId, chatRoomId, true);
    } catch (err) {
      console.error("Error muting chat:", err);
      setError(err instanceof Error ? err.message : "Failed to mute chat");
    }
  }, [currentUserId]);

  /**
   * UNMUTE CHAT
   */
  const unmuteChatRoom = useCallback(async (chatRoomId: string) => {
    try {
      await muteChat(currentUserId, chatRoomId, false);
    } catch (err) {
      console.error("Error unmuting chat:", err);
      setError(err instanceof Error ? err.message : "Failed to unmute chat");
    }
  }, [currentUserId]);

  /**
   * ARCHIVE CHAT
   */
  const archiveChatRoom = useCallback(async (chatRoomId: string) => {
    try {
      await archiveChat(currentUserId, chatRoomId, true);
    } catch (err) {
      console.error("Error archiving chat:", err);
      setError(err instanceof Error ? err.message : "Failed to archive chat");
    }
  }, [currentUserId]);

  /**
   * UNARCHIVE CHAT
   */
  const unarchiveChatRoom = useCallback(async (chatRoomId: string) => {
    try {
      await archiveChat(currentUserId, chatRoomId, false);
    } catch (err) {
      console.error("Error unarchiving chat:", err);
      setError(err instanceof Error ? err.message : "Failed to unarchive chat");
    }
  }, [currentUserId]);

  const value: IChatContextType = {
    currentChatRoom,
    messages,
    loading,
    error,
    openChat,
    sendMessage: sendChatMessage,
    editMessage: editChatMessage,
    deleteMessage: deleteChatMessage,
    markAsRead,
    muteChat: muteChatRoom,
    unmuteChat: unmuteChatRoom,
    archiveChat: archiveChatRoom,
    unarchiveChat: unarchiveChatRoom,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};


export const useChat = (): IChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};

export default ChatContext;
