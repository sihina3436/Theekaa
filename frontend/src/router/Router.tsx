import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";
import Feed from "../pages/public/Feed";
import Home from "../pages/public/Home";
import AddPost from "../pages/user/post/AddPost";
import PostDetails from "../pages/public/PostDetails";
import ChatRequest from "../pages/user/chat/ChatRequest";
import Chat from "../pages/user/chat/Chat";
import UpdateProfile from "../pages/user/profile/UpdateProfile";
import Profile from "../pages/user/profile/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },

      { path: "/feed", element: <Feed /> },

      { path: "/profile", element: <Profile /> },

      { path: "/add-post", element: <AddPost /> },

      { path: "/post/:id", element: <PostDetails /> },

      {path: "/chat-requests", element: <ChatRequest/>},

      {path: "/chat/:id", element: <Chat/>},
      {path: "/update-profile", element: <UpdateProfile/>}
    ]
  },

  {
    path: "/signin",
    element: <SignIn />
  },

  {
    path: "/signup",
    element: <SignUp />
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },

  {
    path: "/verify-otp",
    element: <VerifyOTP />
  }
]);