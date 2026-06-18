import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { sessionAPI } from "../services/api";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Spinner from "../components/common/Spinner";

export default function SessionDetails() {
  const { id } = useParams();

  const { data: sessionData, isLoading } = useQuery(
    ["session", id],
    () => sessionAPI.getSession(id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <Spinner />
      </div>
    );
  }

  const session = sessionData?.data;

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-100 mb-2">{session?.title}</h1>
          <p className="text-gray-400 mb-6">{session?.description}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
              <h2 className="text-lg font-semibold text-gray-100 mb-4">
                اطلاعات جلسه
              </h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-400">زمان شروع</dt>
                  <dd className="text-gray-100">
                    {new Date(session?.startAt).toLocaleDateString("fa-IR")}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-400">زمان پایان</dt>
                  <dd className="text-gray-100">
                    {new Date(session?.endAt).toLocaleDateString("fa-IR")}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-400">مکان</dt>
                  <dd className="text-gray-100">{session?.location || "-"}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-dark-card rounded-lg p-4 border border-dark-border">
              <h2 className="text-lg font-semibold text-gray-100 mb-4">
                فایل‌ها و منابع
              </h2>
              <p className="text-gray-400 text-sm">
                لیست فایل‌های این جلسه در این بخش نمایش داده می‌شود.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}