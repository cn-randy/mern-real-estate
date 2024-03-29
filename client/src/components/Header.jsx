import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.user || null;
  return (
    <header className="bg-slate-200 shadow-md max-w-6xl mx-auto p-3">
      <div className="flex justify-between items-center">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Twohalls</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/">Home</Link>
          </li>
          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/about">About</Link>
          </li>
          {user && (
            <li className="sm:inline text-slate-700 hover:underline">
              <img
                className="rounded-full h-7 w=7 object-cover"
                src={user.avatar}
                alt="profile"
              />
              <Link to="/profile">Sign in</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
