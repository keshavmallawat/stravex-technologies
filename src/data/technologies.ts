export interface Technology {
  slug: string;
  name: string;
  description: string;
  appliedIn: string[];
}

export const technologies: Technology[] = [
  {
    slug: "counter-drone-systems",
    name: "Counter-Drone Systems",
    description:
      "Portable, AI-powered hard-kill systems built to detect, track, and neutralize unauthorized or hostile drones — engineered to function in GPS-denied and electronically contested conditions.",
    appliedIn: ["AgniStrike"],
  },
  {
    slug: "autonomous-operations",
    name: "Autonomous Operations",
    description:
      "Navigation and mission logic for autonomous platforms, with fail-safe redundancy for reliable operation in the field.",
    appliedIn: ["FPV Drones", "Indigenous Flight Controller & ESC"],
  },
  {
    slug: "indigenous-hardware",
    name: "Indigenous Hardware",
    description:
      "Rugged electronics, sensor fusion, and power systems designed and built in-house for Indian operational environments — reducing reliance on imported components.",
    appliedIn: ["AgniStrike", "FPV Drones", "Indigenous Flight Controller & ESC", "RUDRA"],
  },
  {
    slug: "training-support-infrastructure",
    name: "Training & Support Infrastructure",
    description:
      "Pilot training programs and mobile repair infrastructure that keep systems mission-ready in the field, not just in the lab.",
    appliedIn: ["RAKSHAKH", "RUDRA"],
  },
];

export function getTechnologyByName(name: string) {
  return technologies.find((t) => t.name === name);
}
