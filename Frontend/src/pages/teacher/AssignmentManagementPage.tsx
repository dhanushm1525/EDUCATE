import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AssignmentForm } from "../../components/teacher/assingment/AssignmentForm";

import { assignmentService } from "../../services/assingment.service";

import type { CreateAssignmentRequest } from "../../types/assingment";

export default function AssignmentManagementPage() {
  const { courseId, chapterId, lessonId } = useParams<{
    courseId: string;
    chapterId: string;
    lessonId: string;
  }>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateAssignmentRequest) => {
    if (!lessonId) {
      return;
    }

    try {
      setLoading(true);

      await assignmentService.create(lessonId, data);

      navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lessons`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Assignment</h1>

        <p className="text-gray-500">
          Create an MCQ assignment for this lesson.
        </p>
      </div>

      <AssignmentForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
