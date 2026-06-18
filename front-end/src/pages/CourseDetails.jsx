import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { courseAPI, sessionAPI } from "../services/api";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Spinner from "../components/common/Spinner";

export default function CourseDetails() {
  const { id } = useParams();

  // Fetch course details
  const { data: courseData, isLoading: isLoadingCourse } = useQuery(
    ["course", id],
    () => courseAPI.getCourse(id)
  );

  // Fetch sessions for this course
  const { data: sessionsData, isLoading: isLoadingSessions } = useQuery(
    ["sessions", id],
    () => courseAPI.getSession(id)
  );

  if (isLoadingCourse || isLoadingSessions) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <Spinner />
      </div>
    );
  }

  const course = courseData?.data;
  const sessions = sessionsData?.data?.docs || [];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-100 mb-2">{course?.title}</h1>
          <p className="text-gray-400 mb-6">{course?.description}</p>

          <div className="space-y-4">
            {sessions.length === 0 ? (
              <p className="text-gray-400">هیچ جلسه‌ای برای این دوره یافت نشد</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session._id}
                  className="bg-dark-card rounded-lg p-4 border border-dark-border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-100">{session.title}</h3>
                      <p className="text-sm text-gray-400">
                        جلسه {session.sessionNumber}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        session.status === "scheduled"
                          ? "bg-blue-500/20 text-blue-400"
                          : session.status === "live"
                          ? "bg-green-500/20 text-green-400"
                          : session.status === "completed"
                          ? "bg-gray-500/20 text-gray-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {session.status === "scheduled"
                        ? "برنامه‌ریزی شده"
                        : session.status === "live"
                        ? "در حال برگزاری"
                        : session.status === "completed"
                        ? "تمام شده"
                        : "لغو شده"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}