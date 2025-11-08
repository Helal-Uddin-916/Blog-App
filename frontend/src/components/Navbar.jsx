import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../utils/userSlice";

function Navbar() {
  const { token, name, profilePic, username } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setsearchQuery] = useState("");
  const [showSearchbar, setshowSearchbar] = useState(false);
  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logout());
    setShowPopup(false);
  }

  useEffect(() => {
    if (window.location.pathname !== "/search") {
      setsearchQuery(null);
    }
    return () => {
      if (window.location.pathname !== "/") {
        setShowPopup(false);
      }
    };
  }, [window.location.pathname]);
  return (
    <>
      <div className="bg-white max-w-full relative h-[70px] px-[30px] flex justify-between items-center  drop-shadow-sm">
        <div className="flex gap-4 items-center relative">
          <Link to={"/"}>
            <div>
              <img src={logo} alt="" />
            </div>
          </Link>

          <div
            className={`relative max-sm:z-40 max-sm:absolute max-sm:top-16 sm:block ${
              showSearchbar ? "max-sm:block" : "max-sm:hidden"
            }`}
          >
            <i className="fi absolute text-lg top-1/2 -translate-y-1/2 ml-4 opacity-40 fi-rr-search"></i>
            <input
              type="text"
              className="bg-gray-100 focus:outline-none max-sm:w-[calc(100vw-70px)] rounded-full pl-12 p-2"
              placeholder="Search"
              value={searchQuery ? searchQuery : null}
              onChange={(e) => setsearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  if (searchQuery.trim()) {
                    setshowSearchbar(false);
                    if (showSearchbar) {
                      setsearchQuery("");
                    }
                    navigate(`/search?q=${searchQuery}`);
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="flex gap-5 justify-center items-center">
          <i
            className="fi fi-rr-search text-xl sm:hidden cursor-pointer"
            onClick={() => setshowSearchbar((prev) => !prev)}
          ></i>
          <Link to={"/add-blog"}>
            <div className="flex gap-2 items-center">
              <i className="fi text-2xl mt-1 fi-ts-drawer-alt"></i>
              <span className="text-xl hidden sm:inline">Write</span>
            </div>
          </Link>

          {token ? (
            // <div className="text-xl capitalize">{name}</div>
            <div
              className="w-10 h-10 cursor-pointer"
              onClick={() => setShowPopup((prev) => !prev)}
            >
              <img
                className="w-full h-full rounded-full object-cover"
                src={
                  profilePic
                    ? profilePic
                    : `https://api.dicebear.com/9.x/micah/svg?seed=${name}`
                }
                alt=""
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to={"/signup"}>
                <button className="bg-blue-500 px-6 py-3 text-white rounded-full">
                  Sign up
                </button>
              </Link>
              <Link to={"/signin"}>
                <button className="border px-6 py-3 rounded-full">
                  Sign in
                </button>
              </Link>
            </div>
          )}
        </div>
        {showPopup ? (
          <div
            onMouseLeave={() => setShowPopup(false)}
            className="w-[150px] bg-gray-200 absolute z-40 right-2 top-14 rounded-xl drop-shadow-md"
          >
            <Link to={`/@${username}`}>
              <p className="text-lg py-2 px-3 hover:bg-blue-500 hover:text-white rounded-t-xl cursor-pointer">
                Profile
              </p>
            </Link>
            <Link to={"/setting"}>
              <p className="text-lg py-2 px-3 hover:bg-blue-500 hover:text-white cursor-pointer">
                Setting
              </p>
            </Link>
            <p
              onClick={handleLogout}
              className="text-lg py-2 px-3 hover:bg-blue-500 hover:text-white rounded-b-xl cursor-pointer"
            >
              Logout
            </p>
          </div>
        ) : null}
      </div>
      <Outlet />
    </>
  );
}

export default Navbar;
