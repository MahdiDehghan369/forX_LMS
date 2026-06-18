import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    { name: "داشبورد", icon: "home", href: "/dashboard" },
    { name: "دوره‌های من", icon: "book-open", href: "/dashboard/courses" },
    { name: "تقویم جلسات", icon: "calendar", href: "/dashboard/schedule" },
  ];

  const teacherItems = [
    { name: "مدیریت دوره‌ها", icon: "users", href: "/admin/courses" },
    { name: "مدیریت سس-session‌ها", icon: "clock", href: "/admin/sessions" },
  ];

  const adminItems = [
    { name: "مدیریت کاربران", icon: "cog", href: "/admin/users" },
    { name: "گزارش‌ها", icon: "chart-bar", href: "/admin/reports" },
  ];

  return (
    <aside className="w-64 bg-dark-card border-r border-dark-border">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
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
          <div>
            <p className="font-medium text-gray-100">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-dark-bg/50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gray-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                {/* Simple icon based on type - you can replace with actual icons */}
                {item.icon === "home" && (
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                )}
                {item.icon === "book-open" && (
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H4zM9 14v-6a4 4 0 004 4v6" />
                )}
                {item.icon === "calendar" && (
                  <>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <path d="M16 2v4M12 2v4M8 2v4M3 10h18" />
                  </>
                )}
              </svg>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}

          {/* Teacher-specific items */}
          {user?.role === "teacher" && (
            <>
              <hr className="my-4 border-dark-border" />
              {teacherItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-dark-bg/50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    {item.icon === "users" && (
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    )}
                    {item.icon === "clock" && (
                      <>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </>
                    )}
                  </svg>
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </>
          )}

          {/* Admin-specific items */}
          {user?.role === "admin" && (
            <>
              <hr className="my-4 border-dark-border" />
              {adminItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-dark-bg/50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    {item.icon === "cog" && (
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0L10.519 5l2.389.951c.3.921.3 2.013 0 2.94l-2.39.95c-.628.246-1.213.322-1.813.206-1.199-.287-2.085-1.073-2.085-2.238v-.56c0-1.165.472-2.169 1.234-2.889l1.24-1.655.624-.791c.558-.704 1.375-.796 2.085-.644l1.592.447c.3.921.3 2.013 0 2.94l-2.39.95c-.628.246-1.213.322-1.813.206-1.199-.287-2.085-1.073-2.085-2.238v-.56c0-1.165.472-2.169 1.234-2.889l1.24-1.655.624-.791c.558-.704 1.375-.796 2.085-.644l1.592.447z" />
                    )}
                    {item.icon === "chart-bar" && (
                      <path d="M3 3v18h18V3H3zM5 7h2v10H5V7zm4 0h2v10h-2V7zm4 0h2v10h-2V7z" />
                    )}
                  </svg>
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}
