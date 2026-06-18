import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-dark-card border-b border-dark-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-2 space-x-reverse">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-dark-bg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L1 7v6c0 5 3.58 9.74 8 10 4.42-.26 8-5 8-10V7L12 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gold-500">LMS</h1>
        </Link>

        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-gray-300 text-sm hidden sm:inline-block">
            {user?.firstName} {user?.lastName}
          </span>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.firstName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-dark-bg font-bold">
              {user?.firstName?.charAt(0)}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm rounded-lg bg-dark-bg border border-dark-border text-gray-300 hover:text-gold-500 transition-colors"
          >
            خروج
          </button>
        </div>
      </div>
    </header>
  );
}