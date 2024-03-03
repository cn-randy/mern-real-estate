import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../store/user/userSlice.js";

import Oauth from "../components/Oauth.jsx";

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const { isLoading, errors } = useSelector((state) => state.user);

  const handleInputChange = function (e) {
    setFormData((oldState) => ({ ...oldState, [e.target.id]: e.target.value }));
  };

  const handleFormSubmission = async function (e) {
    e.preventDefault();

    dispatch(signInStart());

    try {
      const response = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        dispatch(signInFailure(data.errors));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="p3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">Sign In</h1>
      <form className="flex flex-col  gap-4" onSubmit={handleFormSubmission}>
        <div className="flex flex-col">
          <label className="block font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="border px-3 py-2 rounded-lg"
            id="email"
            type="text"
            value={email}
            onChange={handleInputChange}
          />
          {errors?.email && (
            <p className="text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="block font-bold mb-2" htmlFor="password">
            Password{" "}
          </label>
          <input
            className="border px-3 py-2 rounded-lg"
            id="password"
            type="password"
            value={password}
            onChange={handleInputChange}
          />
          {errors?.password && (
            <p className="text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg w-full uppercase hover:opacity-95 disabled:opacity-80"
            disabled={isLoading}
          >
            {isLoading ? "Logging in user..." : "Sign in"}
          </button>
        </div>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          Dont have an account?{" "}
          <Link to="/sign-up">
            <span className="text-blue-700">Sign up</span>
          </Link>
        </p>
      </div>
      {errors?.system && (
        <p className="text-red-500 mt-5">{errors.system.message}</p>
      )}
    </div>
  );
}
