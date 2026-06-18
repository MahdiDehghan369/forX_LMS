import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { enrollmentAPI } from "../services/api";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Spinner from "../components/common/Spinner";

export default function AdminEnrollments() {
  const { user } = useAuth();
  const { courseId } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load enrollments for a specific course
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await enrollmentAPI.getCourseEnrollments(courseId);
        setEnrollments(data.docs || []);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-100">مدیریت ثبت‌نام‌ها</h1>
            <button className="px-4 py-2 rounded-lg bg-gold-500 text-dark-bg font-medium hover:shadow-lg hover:shadow-gold-500/30 transition-all">
              ثبت‌نام جدید
            </button>
          </div>

          <div className="bg-dark-card rounded-lg border border-dark-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      نام دانش‌آموز
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      وضعیت
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      تاریخ ثبت‌نام
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      اقدامات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400">
                        هیچ ثبت‌نامی یافت نشد
                      </td>
                    </tr>
                  ) : (
                    enrollments.map((enrollment) => (
                      <tr key={enrollment._id} className="border-b border-dark-border">
                        <td className="p-4 text-gray-100">
                          {enrollment.userId?.firstName} {enrollment.userId?.lastName}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              enrollment.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : enrollment.status === "completed"
                                ? "bg-gray-500/20 text-gray-400"
                                : enrollment.status === "dropped"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {enrollment.status === "active"
                              ? "فعال"
                              : enrollment.status === "completed"
                              ? "تکمیل شده"
                              : enrollment.status === "dropped"
                              ? "لغو شده"
                              : "در انتظار"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">
                          {new Date(enrollment.enrollmentDate).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="p-4 space-x-2 space-x-reverse">
                          <button className="text-sm text-gold-500 hover:text-gold-400">
                            ویرایش
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}