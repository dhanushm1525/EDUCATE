export type TeacherApplicationStatus =
    | "pending"
    | "approved"
    | "rejected";

export interface TeacherApplication {
    applicationId: string;
    userId: string;
    qualification: string;
    experience: number;
    skills: string[];
    bio: string;
    documents: string[];
    certificates: string[];
    status: TeacherApplicationStatus;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;

    applicant: {
        firstName: string;
        lastName: string;
        email: string;
        avatar?: string;
    };
}

export interface TeacherApplicationsResponse {
    success: boolean;
    message: string;
    data: TeacherApplication[];
}

export interface TeacherApplicationActionResult {
    applicationId: string;
    userId: string;
    status: TeacherApplicationStatus;
    rejectionReason?: string;
}

export interface TeacherApplicationActionResponse {
    success: boolean;
    message: string;
    data: TeacherApplicationActionResult;
}

// Student application submission

export interface CreateTeacherApplicationRequest {
    qualification: string;
    experience: number;
    skills: string[];
    bio: string;
    documents: string[];
    certificates: string[];
}

// Student's own application (does not contain applicant details)

export interface StudentTeacherApplication {
    applicationId: string;
    userId: string;
    qualification: string;
    experience: number;
    skills: string[];
    bio: string;
    documents: string[];
    certificates: string[];
    status: TeacherApplicationStatus;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface StudentTeacherApplicationResponse {
    success: boolean;
    message: string;
    data: StudentTeacherApplication | null;
}

// S3 document upload

export type TeacherApplicationFileType =
    | "document"
    | "certificate";

export interface GenerateTeacherApplicationUploadUrlRequest {
    fileType: TeacherApplicationFileType;
    contentType: string;
}

export interface GenerateTeacherApplicationUploadUrlResult {
    uploadUrl: string;
    key: string;
}

export interface GenerateTeacherApplicationUploadUrlResponse {
    success: boolean;
    message: string;
    data: GenerateTeacherApplicationUploadUrlResult;
}

export interface CreateTeacherApplicationResponse {
    success: boolean;
    message: string;
    data: StudentTeacherApplication;
}