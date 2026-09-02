import TeacherSidebar from "../../components/teacher/TeacherSidebar";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <TeacherSidebar />

      <main className="ml-64 min-h-screen p-8">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>

        <p className="mt-2 text-sm text-slate-400">
          Welcome back. Here is an overview of your teaching activity.
        </p>
      </main>
    </div>
  );
}
