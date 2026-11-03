import type { ReactNode } from "react";
import TeacherSidebar from "../TeacherSidebar";

interface TeacherLayoutProps {
  children: ReactNode;
  contentClassName?: string;
  mainClassName?: string;
}

export default function TeacherLayout({
  children,
  contentClassName = "mx-auto w-full max-w-7xl",
  mainClassName = "min-h-screen p-8",
}: TeacherLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <TeacherSidebar />

      <main className={`ml-64 ${mainClassName}`}>
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}
