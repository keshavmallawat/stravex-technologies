export interface Solution {
  slug: string;
  name: string;
  description: string;
  relatedProducts: string[];
}

export const solutions: Solution[] = [
  {
    slug: "counter-uas",
    name: "Counter-UAS",
    description:
      "Neutralizing hostile drones before they complete a surveillance or attack mission, using AI-assisted detection and kinetic interception.",
    relatedProducts: ["agnistrike"],
  },
  {
    slug: "border-security",
    name: "Border Security",
    description:
      "Persistent aerial awareness and rapid-response interception along contested or high-traffic border zones.",
    relatedProducts: ["agnistrike", "fpv-drones"],
  },
  {
    slug: "critical-infrastructure",
    name: "Critical Infrastructure",
    description:
      "Protecting airbases, power installations, and other high-value fixed sites from small unmanned aerial threats.",
    relatedProducts: ["agnistrike"],
  },
  {
    slug: "tactical-operations",
    name: "Tactical Operations",
    description:
      "Reconnaissance, surveillance, and mission-specific aerial support for units operating in contested environments.",
    relatedProducts: ["agnistrike", "fpv-drones"],
  },
  {
    slug: "pilot-training",
    name: "Pilot Training",
    description:
      "Bringing UAV operators to mission readiness in a zero-risk simulated environment before they fly live aircraft.",
    relatedProducts: ["rakshakh"],
  },
  {
    slug: "mobile-battlefield-support",
    name: "Mobile Battlefield Support",
    description:
      "Forward-deployed repair, assembly, and logistics infrastructure that keeps UAV fleets mission-ready without returning to depot.",
    relatedProducts: ["rudra", "fpv-drones"],
  },
];
