import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth.jsx";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { username, email, password } = formData;

  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = function (e) {
    setFormData((oldState) => ({ ...oldState, [e.target.id]: e.target.value }));
  };

  const handleFormSubmission = async function (e) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success === false) {
        // registration failed
        setErrors(data.errors);
        setIsLoading(false);
        return;
      }

      // rgistration success
      setErrors(null);
      setIsLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setErrors(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">Sign Up</h1>
      <form className="flex flex-col  gap-4" onSubmit={handleFormSubmission}>
        <div className="flex flex-col">
          <label className="block mb-2 font-bold" htmlFor="username">
            Username
          </label>
          <input
            className="border px-3 py-2 rounded-lg"
            id="username"
            type="text"
            value={username}
            onChange={handleInputChange}
          />
          {errors?.username && (
            <p className="text-red-500 mt-1">{errors.username.message}</p>
          )}
        </div>

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
            {isLoading ? "Registering user..." : "Sign up"}
          </button>
        </div>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          Have an account?{" "}
          <Link to="/sign-in">
            <span className="text-blue-700">Sign in</span>
          </Link>
        </p>
      </div>
      {errors?.system && (
        <p className="text-red-500 mt-5">{errors.system.message}</p>
      )}
    </div>
  );
}
