export const TECH_SOLUTION_STATUSES = ["draft", "published"] as const;
export type TechSolutionStatus = (typeof TECH_SOLUTION_STATUSES)[number];

export interface TechnologyFormValues {
  name: string;
  slug: string;
  description: string;
  relatedSlugs: string[];
  status: TechSolutionStatus;
}

export const emptyTechnologyForm: TechnologyFormValues = {
  name: "",
  slug: "",
  description: "",
  relatedSlugs: [],
  status: "draft",
};

export interface SolutionFormValues {
  name: string;
  slug: string;
  description: string;
  relatedSlugs: string[];
  status: TechSolutionStatus;
}

export const emptySolutionForm: SolutionFormValues = {
  name: "",
  slug: "",
  description: "",
  relatedSlugs: [],
  status: "draft",
};
