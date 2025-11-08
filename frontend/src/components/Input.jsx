import React, { useState } from "react";

function Input({ type, placeholder, value, setUserdata, field, icon }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <i
        className={
          "fi " + icon + "  absolute top-1/2 -translate-y-1/2 left-3 mt-1"
        }
      ></i>
      <input
        value={value}
        type={type !== "password" ? type : (showPassword ? "text" : "password")}
        className="w-full h-[50px] pl-10 text-black text-xl p-2 rounded-full focus:outline-none bg-white"
        placeholder={placeholder}
        onChange={(e) =>
          setUserdata((prev) => ({ ...prev, [field]: e.target.value }))
        }
      />
      {type == "password" && (
        <i
          onClick={() => setShowPassword((prev) => !prev)}
          className={`fi ${
            showPassword ? " fi-rs-eye " : " fi-rs-crossed-eye "
          } absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer mt-1`}
        ></i>
      )}
    </div>
  );
}

export default Input;
