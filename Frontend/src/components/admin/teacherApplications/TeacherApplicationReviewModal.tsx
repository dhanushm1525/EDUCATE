import { useState } from "react";

import {
  CheckCircle,
  XCircle,
  GraduationCap,
  Mail,
  Briefcase,
  FileText,
  ShieldCheck,
} from "lucide-react";

import type { TeacherApplication } from "../../../types/teacherApplication";

import { Modal } from "../../common/ui/Modal";
import { Button } from "../../common/ui/Button";
import { Textarea } from "../../common/ui/Textarea";

interface TeacherApplicationReviewModalProps {
  application: TeacherApplication | null;
  open: boolean;
  onClose: () => void;
  onApprove: (application: TeacherApplication) => Promise<void>;
  onReject: (
    application: TeacherApplication,
    rejectionReason: string,
  ) => Promise<void>;
  processing: boolean;
}

export default function TeacherApplicationReviewModal({
  application,
  open,
  onClose,
  onApprove,
  onReject,
  processing,
}: TeacherApplicationReviewModalProps) {
  const [showApprovalConfirmation, setShowApprovalConfirmation] =
    useState(false);

  const [showRejectionForm, setShowRejectionForm] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");

  const [reasonError, setReasonError] = useState("");

  if (!application) {
    return null;
  }

  const applicantName = [
    application.applicant.firstName,
    application.applicant.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const handleApprove = async () => {
    await onApprove(application);
  };

  const handleReject = async () => {
    const reason = rejectionReason.trim();

    if (reason.length < 5) {
      setReasonError("Rejection reason must contain at least 5 characters.");
      return;
    }

    if (reason.length > 500) {
      setReasonError("Rejection reason cannot exceed 500 characters.");
      return;
    }

    setReasonError("");

    await onReject(application, reason);
  };

  const handleClose = () => {
    if (processing) {
      return;
    }

    setShowApprovalConfirmation(false);
    setShowRejectionForm(false);
    setRejectionReason("");
    setReasonError("");

    onClose();
  };

  const handleCancelAction = () => {
    setShowApprovalConfirmation(false);
    setShowRejectionForm(false);
    setRejectionReason("");
    setReasonError("");
  };

  const renderFileList = (files: string[], emptyMessage: string) => {
    if (files.length === 0) {
      return <p className="mt-2 text-sm text-slate-500">{emptyMessage}</p>;
    }

    return (
      <div className="mt-3 space-y-2">
        {files.map((file, index) => {
          const isHttpUrl = /^https?:\/\//i.test(file);

          const fileName = file.split("/").pop() || `Document ${index + 1}`;

          return (
            <div
              key={`${file}-${index}`}
              className="flex items-center gap-3 rounded-lg bg-slate-800 p-3"
            >
              <FileText size={18} className="shrink-0 text-indigo-400" />

              {isHttpUrl ? (
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-indigo-300 hover:underline"
                >
                  {fileName}
                </a>
              ) : (
                <span className="break-all text-sm text-slate-300">
                  {fileName}
                  <span className="ml-2 text-xs text-slate-500">
                    (Storage key — preview unavailable)
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Review teacher application"
      description="Review the applicant's qualifications and teaching experience before making a decision."
      width="lg"
    >
      <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
        {/* Applicant Profile */}

        <section className="flex items-center gap-4 rounded-xl bg-slate-800 p-4">
          {application.applicant.avatar ? (
            <img
              src={application.applicant.avatar}
              alt={applicantName}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-xl font-semibold text-indigo-400">
              {application.applicant.firstName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white">
              {applicantName}
            </h3>

            <p className="mt-1 flex items-center gap-2 break-all text-sm text-slate-400">
              <Mail size={14} />
              {application.applicant.email}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Applied on{" "}
              {new Date(application.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </section>

        {/* Qualification and Experience */}

        <section>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <GraduationCap size={18} className="text-indigo-400" />
            Professional Information
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-800 p-4">
              <p className="text-xs text-slate-400">Qualification</p>

              <p className="mt-2 font-medium text-white">
                {application.qualification}
              </p>
            </div>

            <div className="rounded-lg bg-slate-800 p-4">
              <p className="text-xs text-slate-400">Experience</p>

              <p className="mt-2 flex items-center gap-2 font-medium text-white">
                <Briefcase size={16} />
                {application.experience} years
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}

        <section>
          <h4 className="font-semibold text-white">Skills</h4>

          {application.skills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {application.skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No skills provided.</p>
          )}
        </section>

        {/* Biography */}

        <section>
          <h4 className="font-semibold text-white">Teaching Biography</h4>

          <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-800 p-4 text-sm leading-6 text-slate-300">
            {application.bio}
          </p>
        </section>

        {/* Documents */}

        <section>
          <h4 className="font-semibold text-white">Supporting Documents</h4>

          {renderFileList(
            application.documents,
            "No supporting documents submitted.",
          )}
        </section>

        {/* Certificates */}

        <section>
          <h4 className="font-semibold text-white">Certificates</h4>

          {renderFileList(
            application.certificates,
            "No certificates submitted.",
          )}
        </section>

        {/* Approval Confirmation */}

        {showApprovalConfirmation && (
          <div className="space-y-3 rounded-lg border border-emerald-800/60 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck size={18} />
              <h4 className="font-semibold">Confirm teacher approval</h4>
            </div>

            <p className="text-sm leading-6 text-slate-300">
              Approving this application will change{" "}
              <strong>{applicantName}</strong>'s account role from Student to
              Teacher.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelAction}
                disabled={processing}
              >
                Cancel
              </Button>

              <Button
                type="button"
                loading={processing}
                onClick={() => void handleApprove()}
              >
                <CheckCircle size={16} />
                Confirm approval
              </Button>
            </div>
          </div>
        )}

        {/* Rejection Form */}

        {showRejectionForm && (
          <div className="space-y-3 rounded-lg border border-red-900/60 bg-red-950/20 p-4">
            <h4 className="font-semibold text-red-400">
              Reject teacher application
            </h4>

            <Textarea
              id="teacher-application-rejection"
              label="Reason for rejection"
              placeholder="Explain why this application is being rejected..."
              value={rejectionReason}
              onChange={(event) => {
                setRejectionReason(event.target.value);

                if (event.target.value.trim().length >= 5) {
                  setReasonError("");
                }
              }}
              error={reasonError}
              maxLength={500}
              disabled={processing}
            />

            <p className="text-right text-xs text-slate-400">
              {rejectionReason.length}/500
            </p>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelAction}
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

        {/* Main Actions */}

        {!showApprovalConfirmation && !showRejectionForm && (
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
              onClick={() => setShowApprovalConfirmation(true)}
              disabled={processing}
            >
              <CheckCircle size={16} />
              Approve application
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
