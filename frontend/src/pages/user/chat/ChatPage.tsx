
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Chat from "./Chat";
import { signInToFirebase } from "../../../firebase/firebaseConfig";


const ChatPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [firebaseReady, setFirebaseReady] = useState(false);

  const otherUserId  = params.get("with")   ?? "";
  const otherUserName   = params.get("name")   ?? "User";
  const otherUserAvatar = params.get("avatar") ?? undefined;


  useEffect(() => {
    signInToFirebase().finally(() => setFirebaseReady(true));
  }, []);

  if (!otherUserId) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-sm">
        No user selected. Go back and open a chat from your requests.
      </div>
    );
  }


  if (!firebaseReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Chat
      otherUserId={otherUserId}
      otherUserName={otherUserName}
      otherUserAvatar={otherUserAvatar}
      onBack={() => navigate(-1)}
    />
  );
};

export default ChatPage;
