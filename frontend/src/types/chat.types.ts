// types/chat.types.ts

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: any; 
  read: boolean;
  status: "sent" | "delivered" | "read"; 
}

export interface ChatRoom {
  participants: string[];
  lastMessage: string;
  lastMessageAt: string; 
  lastSenderId: string;
}

export interface ChatUser {
  _id: string;
  first_name: string;
  last_name: string;
  ProfilePicture?: string;
}
