import { useQuery } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import { courseAPI } from "../services/api";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Spinner from "../components/common/Spinner";

export default function Dashboard() {
  const { user, isTeacher, isAdmin } = useAuth();

  // Fetch courses based on user role
  const { data: coursesData, isLoading } = useQuery(
    ["courses"],
    () => courseAPI.getCourses({ limit: 100 }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <Spinner />
      </div>
    );
  }

  const courses = coursesData?.data?.docs || [];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-100 mb-6">
            داشبورد {user?.firstName} عزیز
          </h1>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
              <p className="text-gray-400 text-sm">دوره‌های من</p>
              <p className="text-2xl font-bold text-gold-500">
                {isTeacher ? courses.length : courses.length}
              </p>
            </div>
            <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
              <p className="text-gray-400 text-sm">جلسات فعال</p>
              <p className="text-2xl font-bold text-gold-500">0</p>
            </div>
            <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
              <p className="text-gray-400 text-sm">نوبت بعدی</p>
              <p className="text-gray-300">هیچ جلسه‌ای نیست</p>
            </div>
          </div>

          {/* Courses List */}
          <div className="bg-dark-card rounded-lg border border-dark-border">
            <div className="p-4 border-b border-dark-border">
              <h2 className="text-lg font-semibold text-gray-100">
                {isTeacher ? "دوره‌های من" : "دوره‌های من"}
              </h2>
            </div>
            <div className="p-4">
              {courses.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  هیچ دوره‌ای یافت نشد
                </p>
              ) : (
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      className="flex items-center justify-between p-3 bg-dark-bg rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-100">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {course.courseCode}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          course.status === "published"
                            ? "bg-green-500/20 text-green-400"
                            : course.status === "archived"
                            ? "bg-gray-500/20 text-gray-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {course.status === "published"
                          ? "منتشر شده"
                          : course.status === "archived"
                          ? "آرشیو"
                          : "پیش‌نویس"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}