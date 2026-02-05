import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DisplayBlogs from "../components/DisplayBlogs";
import { handleFollowCreator } from "./BlogPage";
import ProfileSkeleton from "../components/ProfileSkeleton";

function ProfilePage() {
  const { username } = useParams();
  const location = useLocation();

  const reduxUser = useSelector((state) => state.user);
  const { token, id: userId } = reduxUser;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ NEW

  // ----------------------------
  // FETCH USER DETAILS
  // ----------------------------
  useEffect(() => {
    async function fetchUserDetails() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/${username.split("@")[1]}`,
        );
        setUserData(res.data.user);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false); // ✅ stop skeleton
      }
    }

    fetchUserDetails();
  }, [username]);

  // ----------------------------
  // SYNC UPDATED PROFILE PIC FROM REDUX
  // ----------------------------
  useEffect(() => {
    if (reduxUser?.username && userData?.username === reduxUser.username) {
      setUserData((prev) => ({
        ...prev,
        profilePic: reduxUser.profilePic,
        name: reduxUser.name,
        bio: reduxUser.bio,
      }));
    }
  }, [reduxUser]);

  // ----------------------------
  // SHOW SKELETON FIRST (IMPORTANT)
  // ----------------------------
  if (loading || !userData) {
    return <ProfileSkeleton />;
  }

  // ----------------------------
  // RENDER BLOG SECTIONS
  // ----------------------------
  function renderComponent() {
    if (location.pathname === `/${username}`) {
      return (
        <DisplayBlogs blogs={userData.blogs.filter((blog) => !blog.draft)} />
      );
    }

    if (
      userData.showSavedBlogs ||
      location.pathname === `/${username}/saved-blogs`
    ) {
      return userData._id === userId ? (
        <DisplayBlogs blogs={userData.saveBlogs} />
      ) : (
        <Navigate to={`/${username}`} />
      );
    }

    if (location.pathname === `/${username}/draft-blogs`) {
      return userData._id === userId ? (
        <DisplayBlogs blogs={userData.blogs.filter((blog) => blog.draft)} />
      ) : (
        <Navigate to={`/${username}`} />
      );
    }

    return userData.showlikeBlogs || userData._id === userId ? (
      <DisplayBlogs blogs={userData.likeBlogs} />
    ) : (
      <Navigate to={`/${username}`} />
    );
  }

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="w-full flex justify-center">
      <div className="w-[80%] flex max-lg:flex-col-reverse justify-evenly">
        {/* LEFT */}
        <div className="max-lg:w-full w-[50%]">
          <div className="hidden sm:flex justify-between my-10">
            <p className="text-4xl font-semibold">{userData.name}</p>
            <i className="fi fi-bs-menu-dots cursor-pointer opacity-70"></i>
          </div>

          <nav className="my-4">
            <ul className="flex gap-6">
              <li>
                <Link
                  to={`/${username}`}
                  className={`${
                    location.pathname === `/${username}`
                      ? "border-b-2 border-black"
                      : ""
                  } pb-1`}
                >
                  Home
                </Link>
              </li>

              {(userData.showSavedBlogs || userData._id === userId) && (
                <li>
                  <Link
                    to={`/${username}/saved-blogs`}
                    className={`${
                      location.pathname === `/${username}/saved-blogs`
                        ? "border-b-2 border-black"
                        : ""
                    } pb-1`}
                  >
                    Saved Blogs
                  </Link>
                </li>
              )}

              {(userData.showlikeBlogs || userData._id === userId) && (
                <li>
                  <Link
                    to={`/${username}/liked-blogs`}
                    className={`${
                      location.pathname === `/${username}/liked-blogs`
                        ? "border-b-2 border-black"
                        : ""
                    } pb-1`}
                  >
                    Liked Blogs
                  </Link>
                </li>
              )}

              {userData._id === userId && (
                <li>
                  <Link
                    to={`/${username}/draft-blogs`}
                    className={`${
                      location.pathname === `/${username}/draft-blogs`
                        ? "border-b-2 border-black"
                        : ""
                    } pb-1`}
                  >
                    Draft Blogs
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {renderComponent()}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="max-lg:w-full w-[20%] lg:border-l max-lg:flex lg:pl-10 lg:min-h-[calc(100vh-70px)]">
          <div className="my-10">
            <div className="w-20 h-20">
              <img
                className="rounded-full w-full h-full object-cover"
                src={
                  userData.profilePic
                    ? userData.profilePic
                    : `https://api.dicebear.com/9.x/micah/svg?seed=${userData.name}`
                }
                alt={userData.name}
              />
            </div>

            <p className="text-base font-medium my-3">{userData.name}</p>
            <p>{userData.followers.length} Followers</p>

            <p className="line-clamp-2 text-slate-600 text-sm my-3">
              {userData.bio}
            </p>

            {userId === userData._id ? (
              <Link to="/edit-profile">
                <button className="bg-green-600 px-7 py-3 rounded-full text-white my-3 w-full">
                  Edit Profile
                </button>
              </Link>
            ) : (
              <button
                onClick={() => handleFollowCreator(userData._id, token)}
                className="bg-green-600 px-7 py-3 rounded-full text-white my-3 w-full"
              >
                {userData.followers.some((f) => f._id === userId)
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
