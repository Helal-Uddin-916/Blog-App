import { configureStore, current } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import selectedBlogSlice from "./selectedBlogSlice";
import commentSlice from "./commentSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    currentBlog: selectedBlogSlice,
    comment: commentSlice,
  },
});

export default store;
