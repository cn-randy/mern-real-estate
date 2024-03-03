import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../store/user/userSlice.js";
import { useNavigate } from "react-router-dom";

export default function Oauth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async function () {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const response = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await response.json();
      dispatch(signInSuccess(data));
      console.log(data);
      navigate("/");
    } catch (err) {
      console.error("Could not sign in with Google.", err);
    }
  };

  return (
    <button
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:bg-red-800"
      onClick={handleGoogleClick}
    >
      Continue with google
    </button>
  );
}
