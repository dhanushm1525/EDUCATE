
import { StudentNavbar } from "../../components/student/StudentNavbar";
import CoursesPage from "../course/CoursesPage";

export default function StudentCoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNavbar />
      <CoursesPage />
    </div>
  );
}
