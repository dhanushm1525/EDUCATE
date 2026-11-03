import { useCallback, useEffect, useRef, useState } from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Info,
  RefreshCw,
  Send,
  X,
} from "lucide-react";

import { StudentNavbar } from "../../components/student/StudentNavbar";
import { Input } from "../../components/common/ui/Input";
import { Textarea } from "../../components/common/ui/Textarea";
import { TagInput } from "../../components/common/ui/TagInput";
import { Button } from "../../components/common/ui/Button";

import { teacherApplicationService } from "../../services/teacherApplication.service";
import { getApiErrorMessage } from "../../utils/apiError";

import type {
  StudentTeacherApplication,
  TeacherApplicationFileType,
} from "../../types/teacherApplication";

interface SelectedFile {
  id: string;
  file: File;
  fileType: TeacherApplicationFileType;
  progress: number;
}

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function BecomeTeacherPage() {
  const [application, setApplication] =
    useState<StudentTeacherApplication | null>(null);

  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const documentInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);

  // Initial application retrieval
  useEffect(() => {
    let isMounted = true;

    const loadApplication = async () => {
      try {
        const result = await teacherApplicationService.getMyApplication();

        if (isMounted) {
          setApplication(result);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadApplication();

    return () => {
      isMounted = false;
    };
  }, []);

  // Retry application retrieval
  const fetchApplication = useCallback(async () => {
    setLoading(true);

    try {
      setErrorMessage(null);

      const result = await teacherApplicationService.getMyApplication();

      setApplication(result);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle document selection
  const handleFileSelection = (
    selectedFiles: FileList | null,
    fileType: TeacherApplicationFileType,
  ) => {
    if (!selectedFiles) return;

    const newFiles: SelectedFile[] = [];
    const errors: string[] = [];

    for (const file of Array.from(selectedFiles)) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        errors.push(
          `${file.name}: Unsupported file type. Use PDF, JPG, PNG, WEBP, DOC or DOCX.`,
        );
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size must not exceed 10 MB.`);
        continue;
      }

      newFiles.push({
        id: crypto.randomUUID(),
        file,
        fileType,
        progress: 0,
      });
    }

    setFiles((previous) => [...previous, ...newFiles]);
    setErrorMessage(errors.length > 0 ? errors.join(" ") : null);
  };

  const removeFile = (id: string) => {
    setFiles((previous) => previous.filter((file) => file.id !== id));
  };

  // Upload selected files directly to S3
  const uploadSelectedFiles = async (): Promise<{
    documents: string[];
    certificates: string[];
  }> => {
    const documents: string[] = [];
    const certificates: string[] = [];

    for (const selectedFile of files) {
      const uploadDetails = await teacherApplicationService.generateUploadUrl(
        selectedFile.fileType,
        selectedFile.file.type,
      );

      await teacherApplicationService.uploadDocument(
        uploadDetails.uploadUrl,
        selectedFile.file,
        (progress) => {
          setFiles((previous) =>
            previous.map((item) =>
              item.id === selectedFile.id ? { ...item, progress } : item,
            ),
          );
        },
      );

      if (selectedFile.fileType === "document") {
        documents.push(uploadDetails.key);
      } else {
        certificates.push(uploadDetails.key);
      }
    }

    return { documents, certificates };
  };

  // Submit teacher application
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!qualification.trim()) {
      setErrorMessage("Please enter your qualification.");
      return;
    }

    if (!experience.trim() || Number(experience) < 0) {
      setErrorMessage("Please enter valid years of experience.");
      return;
    }

    if (skills.length === 0) {
      setErrorMessage("Please add at least one skill.");
      return;
    }

    if (!bio.trim()) {
      setErrorMessage("Please enter your teaching profile.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const uploadedFiles = await uploadSelectedFiles();

      const result = await teacherApplicationService.createApplication({
        qualification: qualification.trim(),
        experience: Number(experience),
        skills,
        bio: bio.trim(),
        documents: uploadedFiles.documents,
        certificates: uploadedFiles.certificates,
      });

      setApplication(result);
      setFiles([]);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const canApply = !application || application.status === "rejected";

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNavbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <GraduationCap size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Become a Teacher
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Share your knowledge and start teaching on EDUCATE.
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-500">
                Checking your application...
              </p>
            </div>
          </div>
        )}

        {!loading && errorMessage && !application && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{errorMessage}</p>

            <Button
              type="button"
              size="sm"
              className="mt-3"
              onClick={() => void fetchApplication()}
            >
              <RefreshCw size={14} />
              Try again
            </Button>
          </div>
        )}

        {!loading && application?.status === "pending" && (
          <div className="rounded-2xl border border-amber-200 bg-white p-8">
            <div className="flex items-center gap-3">
              <Clock className="text-amber-500" size={30} />

              <h2 className="text-xl font-bold text-slate-900">
                Application Under Review
              </h2>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Your teacher application has been submitted successfully. Our
              administration team will review your details.
            </p>

            <p className="mt-5 text-xs text-slate-400">
              Submitted on{" "}
              {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {!loading && application?.status === "approved" && (
          <div className="rounded-2xl border border-green-200 bg-white p-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600" size={30} />

              <h2 className="text-xl font-bold text-slate-900">
                You're now a Teacher!
              </h2>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Your application has been approved. You can now access the teacher
              portal.
            </p>
          </div>
        )}

        {!loading && canApply && (
          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="space-y-6"
          >
            {application?.status === "rejected" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <h2 className="font-semibold text-red-800">
                  Previous Application Rejected
                </h2>

                <p className="mt-2 text-sm text-red-700">
                  {application.rejectionReason ||
                    "Your previous application was not approved."}
                </p>

                <p className="mt-3 text-sm text-red-700">
                  You can update your details and submit a new application.
                </p>
              </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Professional Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Tell us about your education and experience.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="qualification"
                  label="Highest Qualification"
                  placeholder="e.g. B.Tech in Computer Science"
                  value={qualification}
                  onChange={(event) => setQualification(event.target.value)}
                  required
                />

                <Input
                  id="experience"
                  label="Teaching / Professional Experience (Years)"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g. 2"
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                  required
                />
              </div>

              <div className="mt-5">
                <TagInput
                  label="Skills and Subjects"
                  values={skills}
                  onChange={setSkills}
                  placeholder="Type a skill and press Enter"
                />
              </div>

              <div className="mt-5">
                <Textarea
                  id="bio"
                  label="Professional Bio"
                  placeholder="Describe your expertise, teaching experience and what students can learn from you..."
                  rows={6}
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  required
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Supporting Documents
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload documents that support your qualifications and
                  experience.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <input
                    ref={documentInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                    className="hidden"
                    onChange={(event) => {
                      handleFileSelection(event.target.files, "document");
                      event.target.value = "";
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => documentInputRef.current?.click()}
                    className="flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 p-5 text-left transition hover:border-indigo-400 hover:bg-indigo-50"
                  >
                    <FileText className="text-indigo-600" />

                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Upload Documents
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        Qualification or experience proof
                      </span>
                    </span>
                  </button>
                </div>

                <div>
                  <input
                    ref={certificateInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                    className="hidden"
                    onChange={(event) => {
                      handleFileSelection(event.target.files, "certificate");
                      event.target.value = "";
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => certificateInputRef.current?.click()}
                    className="flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 p-5 text-left transition hover:border-indigo-400 hover:bg-indigo-50"
                  >
                    <Award className="text-indigo-600" />

                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Upload Certificates
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        Professional or course certificates
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-5 space-y-3">
                  {files.map((selectedFile) => (
                    <div
                      key={selectedFile.id}
                      className="rounded-lg border border-slate-200 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {selectedFile.file.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {selectedFile.fileType} ·{" "}
                            {(selectedFile.file.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => removeFile(selectedFile.id)}
                          className="text-slate-400 hover:text-red-500 disabled:opacity-50"
                          aria-label={`Remove ${selectedFile.file.name}`}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {submitting && (
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{
                              width: `${selectedFile.progress}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Info size={14} />
                Supported formats: PDF, JPG, PNG, WEBP, DOC and DOCX. Maximum 10
                MB per file.
              </p>
            </section>

            {errorMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                loading={submitting}
                disabled={submitting}
              >
                <Send size={16} />
                {submitting
                  ? "Submitting Application..."
                  : "Submit Application"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
