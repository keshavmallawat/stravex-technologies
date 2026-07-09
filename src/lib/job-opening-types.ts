export const JOB_OPENING_STATUSES = ["draft", "published", "archived"] as const;
export type JobOpeningStatus = (typeof JOB_OPENING_STATUSES)[number];

export const WORK_MODES = ["onsite", "hybrid", "remote"] as const;
export type WorkMode = (typeof WORK_MODES)[number];

export interface JobOpeningFormValues {
  title: string;
  slug: string;
  status: JobOpeningStatus;
  featured: boolean;
  department: string;
  employmentType: string;
  experience: string;
  location: string;
  workMode: WorkMode;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  salary: string;
  expiryDate: string; // yyyy-mm-dd, empty = no expiry
}

export const emptyJobOpeningForm: JobOpeningFormValues = {
  title: "",
  slug: "",
  status: "draft",
  featured: false,
  department: "",
  employmentType: "Full-time",
  experience: "",
  location: "",
  workMode: "onsite",
  responsibilities: [],
  requirements: [],
  skills: [],
  salary: "",
  expiryDate: "",
};
