export interface CreateTeacherApplicationDTO {
    qualification: string;
    experience: number;
    skills: string[];
    bio: string;
    documents?: string[];
    certificates?: string[];
}