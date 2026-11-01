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

  return <AssignmentForm onSubmit={handleSubmit} loading={loading} />;
}
