import { configureStore } from "@reduxjs/toolkit";
import platformReducer from "../features/platform/platformSlice";
import notificationReducer from "../features/notification/notificationSlice";
import userReducer from "../features/user/userSlice";
import collectionReducer from "../features/collection/collectionSlice";
import contentReducer from "../features/content/contentSlice";
import linkReducer from "../features/link/linkSlice";
import adReducer from "../features/ad/adSlice";
import frontendReducer from "../features/frontend/frontendSlice";
import authReducer from "../features/auth/authSlice";
import uploaderReducer from "../features/uploader/uploaderSlice";
import chatReducer from "../features/chat/chatSlice";

export default configureStore({
  reducer: {
    platform: platformReducer,
    notification: notificationReducer,
    user: userReducer,
    collection: collectionReducer,
    content: contentReducer,
    link: linkReducer,
    ad: adReducer,
    frontend: frontendReducer,
    auth: authReducer,
    uploader: uploaderReducer,
    chat: chatReducer
  }
});
