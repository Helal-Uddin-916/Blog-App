import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../utils/userSlice";
import { Navigate, useNavigate } from "react-router-dom";

function EditProfile() {
  const {
    token,
    id: userId,
    email,
    name,
    username,
    profilePic,
    bio,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    profilePic,
    name,
    username,
    bio,
  });
  const [initialData, setInitialData] = useState({
    profilePic,
    name,
    username,
    bio,
  });

  const [isBtnDisabled, setisBtnDisabled] = useState(true);
  const navigate = useNavigate();

  function handleChange(e) {
    const { value, name, files } = e.target;
    if (files) {
      setUserData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  }

  async function handleUpdateProfile() {
    setisBtnDisabled(true);
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("username", userData.username);
    if (userData.profilePic) {
      formData.append("profilePic", userData.profilePic);
    }
    formData.append("bio", JSON.stringify(userData.bio));

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message);
      dispatch(login({ ...res.data.user, token, email, id: userId }));
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    if (initialData) {
      const isEqual = JSON.stringify(userData) === JSON.stringify(initialData);
      setisBtnDisabled(isEqual);
    }
  }, [userData, initialData]);
  return token == null ? (
    <Navigate to={"/signin"} />
  ) : (
    <div className="w-full p-5">
      <div className="w-full md:w-[70%] lg:w-[55%] mx-auto my-10 p-5 lg:px-10">
        <h1 className="text-center text-3xl font-medium my-4 ">Edit Profile</h1>
        <div>
          <div className="">
            <h2 className="text-2xl font-semibold my-2 ">Photo</h2>
            <div className="flex items-center flex-col gap-3 ">
              <label htmlFor="image" className="">
                {userData?.profilePic ? (
                  <img
                    src={
                      typeof userData?.profilePic == "string"
                        ? userData?.profilePic
                        : URL.createObjectURL(userData?.profilePic)
                    }
                    alt=""
                    className="aspect-square w-[150px] h-[150px] object-cover rounded-full"
                  />
                ) : (
                  <div className="w-[150px] h-[150px] bg-white border-2 border-dashed rounded-full opacity-50 aspect-square flex justify-center items-center text-xl">
                    Select Image
                  </div>
                )}
              </label>
              <h2
                onClick={() =>
                  setUserData((prevData) => ({ ...prevData, profilePic: null }))
                }
                className="text-lg text-red-500 font-medium cursor-pointer"
              >
                Remove
              </h2>
            </div>
            <input
              name="profilePic"
              className="hidden"
              id="image"
              type="file"
              accept=".png, jpeg, .jpg"
              onChange={handleChange}
            />
          </div>
          <div className="my-4">
            <h2 className="text-2xl font-semibold my-2 ">Name</h2>
            <input
              name="name"
              type="text"
              placeholder="name"
              onChange={handleChange}
              defaultValue={userData.name}
              className=" border focus:outline-none rounded-lg p-2 w-1/2 placeholder:text-lg placeholder:opacity-95"
            />
          </div>
          <div className="my-4">
            <h2 className="text-2xl font-semibold my-2 ">Username</h2>
            <input
              name="username"
              type="text"
              placeholder="username"
              onChange={handleChange}
              defaultValue={userData.username}
              className=" border focus:outline-none rounded-lg p-2 w-1/2 placeholder:text-lg placeholder:opacity-95"
            />
          </div>
          <div className="my-4">
            <h2 className="text-2xl font-semibold my-2 ">Bio</h2>
            <textarea
              name="bio"
              type="text"
              placeholder="bio"
              onChange={handleChange}
              defaultValue={userData.bio}
              className=" h-[100px] resize-none w-full border text-lg focus:outline-none rounded-lg p-3"
            />
          </div>
          <button
            disabled={isBtnDisabled}
            onClick={handleUpdateProfile}
            className={`px-7 py-3 rounded-full text-white my-3 ${
              isBtnDisabled ? "bg-gray-600" : "bg-green-600"
            } `}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
