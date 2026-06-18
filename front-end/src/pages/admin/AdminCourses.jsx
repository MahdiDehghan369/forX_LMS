import { useState } from "react";
import { useQuery } from "react-query";
import { courseAPI } from "../../services/api";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import Spinner from "../../components/common/Spinner";

export default function AdminCourses() {
  const { data: coursesData, isLoading } = useQuery(
    ["courses"],
    () => courseAPI.getCourses({ limit: 100 }),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-100">مدیریت دوره‌ها</h1>
            <button className="px-4 py-2 rounded-lg bg-gold-500 text-dark-bg font-medium hover:shadow-lg hover:shadow-gold-500/30 transition-all">
              دوره جدید
            </button>
          </div>

          <div className="bg-dark-card rounded-lg border border-dark-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      عنوان دوره
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      کد دوره
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      وضعیت
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      اقدامات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} className="border-b border-dark-border">
                      <td className="p-4 text-gray-100">{course.title}</td>
                      <td className="p-4 text-gray-400">{course.courseCode}</td>
                      <td className="p-4">
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
                      </td>
                      <td className="p-4">
                        <button className="text-sm text-gold-500 hover:text-gold-400">
                          ویرایش
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}