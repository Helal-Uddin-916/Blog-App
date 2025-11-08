import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSlice";
import Input from "../components/Input";
import googlelogo from "../../src/assets/googlelogo.svg";
import { googleAuth } from "../utils/firebase";

function AuthForm({ type }) {
  const [userdata, setUserdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleAuthform(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/${type}`,
        userdata
      );
      if (type == "signup") {
        toast.success(res.data.message);
        navigate("/signin");
      } else {
        dispatch(login(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function handleGoogleAuth() {
    try {
      let data = await googleAuth();
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google-auth`,
        {
          accessToken: data.user.accessToken,
        }
      );
      dispatch(login(res.data.user));
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className="w-full">
      <div className="max-w-[350px] bg-gray-200 p-4 rounded-xl flex flex-col items-center gap-5 mt-52 mx-auto">
        <h1 className="text-3xl">
          {type === "signin" ? "Sign In" : "Sign Up"}
        </h1>
        <form
          className="w-full flex flex-col items-center gap-5"
          onSubmit={handleAuthform}
        >
          {type == "signup" && (
            <Input
              type={"text"}
              placeholder={"Enter your name"}
              setUserdata={setUserdata}
              field={"name"}
              value={userdata.name}
              icon={"fi-br-user"}
            />
          )}

          <Input
            type={"email"}
            placeholder={"Enter your mail"}
            setUserdata={setUserdata}
            field={"email"}
            value={userdata.email}
            icon={"fi-rr-at"}
          />

          <Input
            type={"password"}
            placeholder={"Enter your password"}
            setUserdata={setUserdata}
            field={"password"}
            value={userdata.password}
            icon={"fi-rs-lock"}
          />
          <button className="w-[100px] h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-blue-500">
            {type === "signin" ? "Log In" : "Register"}
          </button>
        </form>
        <p className="text-xl font-semibold">Or</p>
        <div
          onClick={handleGoogleAuth}
          className="bg-white border hover:bg-blue-200 w-full gap-4 flex justify-center cursor-pointer items-center overflow-hidden py-3 px-4 rounded-full"
        >
          <p className="text-2xl font-medium"> Continue with</p>
          <div className="">
            <img className="w-8 h-8" src={googlelogo} alt="" />
          </div>
        </div>
        {type == "signin" ? (
          <p>
            Don't have an account <Link to={"/signup"}>Sign Up</Link>
          </p>
        ) : (
          <p>
            Already, Have an account <Link to={"/signin"}>Sign In</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
