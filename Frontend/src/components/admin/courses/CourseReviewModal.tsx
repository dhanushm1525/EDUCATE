import { useState } from "react";
import { CheckCircle, XCircle, BookOpen } from "lucide-react";

import type { Course } from "../../../types/course";
import { Modal } from "../../common/ui/Modal";
import { Button } from "../../common/ui/Button";
import { Textarea } from "../../common/ui/Textarea";

interface CourseReviewModalProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
  onApprove: (course: Course) => Promise<void>;
  onReject: (course: Course, rejectionReason: string) => Promise<void>;
  processing: boolean;
}

export default function CourseReviewModal({
  course,
  open,
  onClose,
  onApprove,
  onReject,
  processing,
}: CourseReviewModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [reasonError, setReasonError] = useState("");

  if (!course) {
    return null;
  }

  const handleReject = async () => {
    const reason = rejectionReason.trim();

    if (!reason) {
      setReasonError("Please provide a reason for rejection.");
      return;
    }

    setReasonError("");
    await onReject(course, reason);
  };

  const handleClose = () => {
    if (processing) {
      return;
    }

    setRejectionReason("");
    setShowRejectionForm(false);
    setReasonError("");
    onClose();
  };

  const handleCancelRejection = () => {
    setShowRejectionForm(false);
    setRejectionReason("");
    setReasonError("");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Review course"
      description="Review the submitted course before making a decision."
      width="lg"
    >
      <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={`${course.title} thumbnail`}
            className="h-44 w-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg bg-slate-800">
            <BookOpen size={36} className="text-slate-400" />
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold text-white">{course.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{course.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-xs text-slate-400">Level</p>
            <p className="mt-1 font-medium text-white">{course.level}</p>
          </div>

          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-xs text-slate-400">Language</p>
            <p className="mt-1 font-medium text-white">{course.language}</p>
          </div>

          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-xs text-slate-400">Duration</p>
            <p className="mt-1 font-medium text-white">{course.duration}</p>
          </div>

          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-xs text-slate-400">Final price</p>
            <p className="mt-1 font-medium text-white">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(course.finalPrice)}
            </p>
          </div>
        </div>

        <section>
          <h4 className="text-sm font-semibold text-white">Description</h4>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
            {course.description}
          </p>
        </section>

        {course.objectives && course.objectives.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-white">
              Learning objectives
            </h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              {course.objectives.map((objective, index) => (
                <li key={`${index}-${objective}`}>{objective}</li>
              ))}
            </ul>
          </section>
        )}

        {course.requirements && course.requirements.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-white">Requirements</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              {course.requirements.map((requirement, index) => (
                <li key={`${index}-${requirement}`}>{requirement}</li>
              ))}
            </ul>
          </section>
        )}

        {course.tags && course.tags.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-white">Tags</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {showRejectionForm && (
          <div className="space-y-3 rounded-lg border border-red-900/60 bg-red-950/20 p-4">
            <Textarea
              id="course-rejection-reason"
              label="Reason for rejection"
              placeholder="Explain what needs to be corrected before resubmission..."
              value={rejectionReason}
              onChange={(event) => {
                setRejectionReason(event.target.value);

                if (event.target.value.trim()) {
                  setReasonError("");
                }
              }}
              error={reasonError}
              maxLength={1000}
              disabled={processing}
            />

            <p className="text-right text-xs text-slate-400">
              {rejectionReason.length}/1000
            </p>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelRejection}
                disabled={processing}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="danger"
                loading={processing}
                onClick={() => void handleReject()}
              >
                <XCircle size={16} />
                Confirm rejection
              </Button>
            </div>
          </div>
        )}

        {!showRejectionForm && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-800 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={processing}
            >
              Close
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={() => setShowRejectionForm(true)}
              disabled={processing}
            >
              <XCircle size={16} />
              Reject
            </Button>

            <Button
              type="button"
              loading={processing}
              onClick={() => void onApprove(course)}
            >
              <CheckCircle size={16} />
              Approve course
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
