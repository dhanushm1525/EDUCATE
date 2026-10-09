import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import { Button } from "../../components/common/ui/Button";

import { CourseForm } from "../../components/teacher/courses/CourseForm";

import { categoryService } from "../../services/category.service";

import { courseService } from "../../services/course.service";

import { getApiErrorMessage } from "../../utils/apiError";

import { useToastStore } from "../../store/toastStore";

import type { Category } from "../../types/category";

import type { CreateCourseRequest } from "../../types/course";

export default function CreateCoursePage() {
  const navigate = useNavigate();

  const { addToast } = useToastStore();

  const [categories, setCategories] = useState<Category[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const result = await categoryService.getCategories();

        setCategories(result);
      } catch (error) {
        addToast(getApiErrorMessage(error), "error");
      } finally {
        setLoadingCategories(false);
      }
    };

    void loadCategories();
  }, [addToast]);

  const handleCreate = async (data: CreateCourseRequest) => {
    try {
      setCreating(true);

      const course = await courseService.createCourse(data);

      addToast("Course created successfully", "success");

      navigate(`/teacher/courses/${course.courseId}`);
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setCreating(false);
    }
  };

  if (loadingCategories) {
    return (
      <div
        className="
                    flex
                    min-h-full
                    items-center
                    justify-center
                    bg-slate-950
                    text-sm
                    text-slate-400
                "
      >
        Loading categories...
      </div>
    );
  }

  return (
    <div
      className="
                min-h-full
                bg-slate-950
                p-6
                text-white
            "
    >
      <div
        className="
                    mx-auto
                    max-w-4xl
                "
      >
        <div
          className="
                        mb-6
                        flex
                        items-center
                        gap-4
                    "
        >
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Back
          </Button>

          <div>
            <h1
              className="
                                text-2xl
                                font-semibold
                            "
            >
              Create Course
            </h1>

            <p
              className="
                                mt-1
                                text-sm
                                text-slate-400
                            "
            >
              Start building your course content.
            </p>
          </div>
        </div>

        <div
          className="
                        rounded-xl
                        border
                        border-slate-800
                        bg-slate-900
                        p-6
                    "
        >
          <CourseForm
            categories={categories}
            onSubmit={handleCreate}
            onCancel={() => navigate(-1)}
            loading={creating}
          />
        </div>
      </div>
    </div>
  );
}
