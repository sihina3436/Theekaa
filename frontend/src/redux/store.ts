import { configureStore } from "@reduxjs/toolkit";

// User Auth
import userReducer from "./userAuth/userAuthSlice";
import { userAuthAPI } from "./userAuth/userAuthAPI";

// Admin Auth
import adminAuthReducer from "./adminAuth/adminAuthSlice";
import { adminAuthAPI } from "./adminAuth/adminAuthApi";

// Other APIs
import { chatAPI } from "./chatRequests/chatApi";
import { imageAPI } from "./image/imageAPI";
import { postAPI } from "./post/postAPI";
import { postLikeAPI } from "./postLike/postLikeAPI";

export const store = configureStore({
  reducer: {
    // Auth Slices
    user: userReducer,
    admin: adminAuthReducer,

    // RTK Query APIs
    [userAuthAPI.reducerPath]: userAuthAPI.reducer,
    [adminAuthAPI.reducerPath]: adminAuthAPI.reducer,
    [chatAPI.reducerPath]: chatAPI.reducer,
    [imageAPI.reducerPath]: imageAPI.reducer,
    [postAPI.reducerPath]: postAPI.reducer,
    [postLikeAPI.reducerPath]: postLikeAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userAuthAPI.middleware,
      adminAuthAPI.middleware,
      chatAPI.middleware,
      imageAPI.middleware,
      postAPI.middleware,
      postLikeAPI.middleware
    ),
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
