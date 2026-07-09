export interface JobOpening {
  id: string;
  title: string;
  department: string;
  employmentType: string;
  location: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
}

/**
 * Add real openings here — each entry renders as a card on /careers with an
 * "Apply Now" button that links to /contact?role=<title>, which pre-fills
 * the Contact form. No page-layout changes are needed to add or remove roles.
 *
 * Example shape:
 * {
 *   id: "ai-cv-engineer",
 *   title: "AI & Computer Vision Engineer",
 *   department: "AI & Computer Vision Engineering",
 *   employmentType: "Full-time",
 *   location: "Navi Mumbai, India",
 *   description: "One or two sentence summary of the role.",
 *   responsibilities: ["...", "..."],
 *   requiredSkills: ["...", "..."],
 * }
 */
export const jobOpenings: JobOpening[] = [];
