import { Route, Routes } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";
import VerifyUser from "./components/VerifyUser";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import SearchBlogs from "./pages/SearchBlogs";
import Setting from "./components/Setting";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/signin" element={<AuthForm type={"signin"} />}></Route>
          <Route path="/signup" element={<AuthForm type={"signup"} />}></Route>
          <Route path="/add-blog" element={<AddBlog />}></Route>
          <Route path="/blog/:id" element={<BlogPage />}></Route>
          <Route path="/edit-blog/:id" element={<AddBlog />}></Route>
          <Route path="/verify-email/:verificationToken" element={<VerifyUser />}></Route>
          <Route path="/:username" element={<ProfilePage />}></Route>
          <Route path="/:username/saved-blogs" element={<ProfilePage />}></Route>
          <Route path="/:username/liked-blogs" element={<ProfilePage />}></Route>
          <Route path="/:username/draft-blogs" element={<ProfilePage />}></Route>
          <Route path="/edit-profile" element={<EditProfile />}></Route>
          <Route path="/setting" element={<Setting />}></Route>
          <Route path="/search" element={<SearchBlogs />}></Route>
          <Route path="/tag/:tag" element={<SearchBlogs />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
