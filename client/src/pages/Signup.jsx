import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="p3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">Sign Up</h1>
      <form className="flex flex-col  gap-4">
        <div className="flex flex-col">
          <label className="block mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="border px-3 py-2 rounded-lg"
            id="username"
            type="text"
          />
        </div>

        <div className="flex flex-col">
          <label className="block mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="border px-3 py-2 rounded-lg"
            id="email"
            type="text"
          />
        </div>

        <div className="flex flex-col">
          <label className="block mb-2" htmlFor="password">
            Password{" "}
          </label>
          <input
            className="border px-3 py-2 rounded-lg"
            id="password"
            type="password"
          />
        </div>

        <div>
          <button
            type="button"
            className="bg-slate-700 text-white p-3 rounded-lg w-full uppercase hover:opacity-95 disabled:opacity-80"
          >
            Sign up
          </button>
        </div>
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          Have an account?{" "}
          <Link to="/sign-in">
            <span className="text-blue-700">Sign in</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
