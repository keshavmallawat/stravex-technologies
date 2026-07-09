import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import type {
  WorkflowStage,
  TechnicalSpec,
  FeatureListSection,
} from "../src/lib/product-types";

interface SeedProduct {
  slug: string;
  name: string;
  category: string;
  sortOrder: number;
  heroImageAspect: string;
  tagline?: string;
  positioning: string;
  purpose: string;
  problemStatement: string;
  missionProfile?: string;
  designGoals?: string[];
  workflow: WorkflowStage[];
  coreCapabilities: string[];
  keyFeatures: string[];
  applications: string[];
  relatedTechnologies: string[];
  technicalSpecs?: TechnicalSpec[];
  extraFeatureLists?: FeatureListSection[];
}

const seedProducts: SeedProduct[] = [
  {
    slug: "agnistrike",
    name: "AgniStrike",
    category: "Tactical Interception",
    sortOrder: 0,
    heroImageAspect: "16 / 10",
    tagline: "Point. Analyze. Press. Protect.",
    positioning: "Next-generation AI-powered portable drone interception system.",
    purpose:
      "AgniStrike is designed to detect, analyze, track, and neutralize hostile aerial threats through AI-assisted optical detection and a high-speed hard-kill interceptor — engineered to function in GPS-denied and electronically contested conditions.",
    problemStatement:
      "Small, low-cost hostile drones are increasingly used for surveillance and attack in contested airspace. Many counter-drone systems are heavy, slow to deploy, or dependent on imported hardware — a gap for units that need a fast, man-portable response.",
    designGoals: [
      "Portable",
      "Rapid deployment",
      "Backpack transportable",
      "Operated by trained personnel",
      "AI-assisted target analysis",
      "Fast interception",
      "Multiple engagement capability",
    ],
    workflow: [
      { stage: "Detect", description: "AI-driven optical detection identifies aerial objects in the operator's field of view." },
      { stage: "Classify", description: "Target classification distinguishes hostile drones from background traffic." },
      { stage: "Analyze", description: "Speed, trajectory, and intent analysis builds a real-time engagement picture." },
      { stage: "Lock", description: "Precision target locking tracks the threat through evasive movement." },
      { stage: "Intercept", description: "A high-speed hard-kill interceptor (200–250 km/h) is launched to neutralize the target." },
      { stage: "Reload", description: "Rapid reload capability restores the system for the next engagement." },
    ],
    coreCapabilities: [
      "AI-driven optical detection",
      "Target classification",
      "Speed, trajectory and intent analysis",
      "Precision target locking",
      "High-speed interceptor (200–250 km/h)",
      "Hard-kill kinetic interception",
      "GPS-denied and electronically contested operation",
      "Advanced countermeasures",
      "Rapid reload capability",
    ],
    keyFeatures: [
      "Under 2.5 kg",
      "Backpack portable",
      "AI optical detection",
      "200–250 km/h interceptor",
      "GPS-denied operation",
      "Rapid reload",
      "Mission-ready field deployment",
    ],
    applications: [
      "Border security",
      "Critical infrastructure",
      "VIP protection",
      "Counter-UAS",
      "Tactical operations",
    ],
    relatedTechnologies: ["Counter-Drone Systems", "Indigenous Hardware"],
  },
  {
    slug: "fpv-drones",
    name: "FPV Drones",
    category: "Aerial Platforms",
    sortOrder: 1,
    heroImageAspect: "16 / 10",
    positioning: "Modular FPV tactical drone platform with swappable mission payloads.",
    purpose:
      "Designed as flexible aerial platforms capable of rapidly adapting to different operational missions through modular payload architecture.",
    problemStatement:
      "Single-purpose drones force units to carry multiple airframes for reconnaissance, logistics, and strike roles. A modular platform that reconfigures for the mission reduces that logistical burden.",
    workflow: [
      { stage: "Airframe", description: "Operators select the 5″, 7″, or 10″ platform sized for the mission." },
      { stage: "Payload", description: "A mission payload — surveillance, sensor, supply drop, or impact module — is quick-mounted." },
      { stage: "Flight", description: "High-speed FPV control gives tactical maneuverability in contested environments." },
      { stage: "Mission", description: "Precision flight and operational endurance carry the payload through to mission completion." },
    ],
    coreCapabilities: [
      "Modular payload architecture",
      "Quick-swap payload mechanism",
      "High-speed FPV control",
      "Tactical maneuverability",
      "Operational endurance",
      "Precision flight",
    ],
    keyFeatures: [
      "5″ / 7″ / 10″ platform options",
      "Quick-swap payload mechanism",
      "High-speed FPV control",
      "Tactical maneuverability",
    ],
    applications: [
      "Tactical reconnaissance",
      "Defence operations",
      "Surveillance",
      "Logistics",
      "Mission-specific deployment",
    ],
    relatedTechnologies: ["Autonomous Operations", "Indigenous Hardware"],
    extraFeatureLists: [
      { heading: "Available Platforms", items: ["5-inch", "7-inch", "10-inch"] },
      {
        heading: "Mission Payloads",
        items: [
          "Supply drop modules",
          "Surveillance payloads",
          "Sensor modules",
          "Mission-specific impact payloads",
        ],
      },
    ],
  },
  {
    slug: "flight-controller-esc",
    name: "Indigenous Flight Controller & ESC",
    category: "Avionics",
    sortOrder: 2,
    heroImageAspect: "3 / 4",
    positioning: "Indigenous flight electronics platform forming the core of Stravex's UAV ecosystem.",
    purpose:
      "Develop a fully indigenous flight control and motor control platform optimized for tactical and commercial unmanned aerial systems.",
    problemStatement:
      "Flight controllers and ESCs are among the most import-dependent components in Indian UAV manufacturing. An indigenous avionics layer is foundational to building drones without relying on foreign electronics supply chains.",
    workflow: [
      { stage: "Sense", description: "Onboard sensors feed real-time telemetry into the flight controller." },
      { stage: "Stabilize", description: "AI-based stabilization and adaptive flight algorithms compute corrections for high-precision control." },
      { stage: "Drive", description: "The ESC translates control signals into advanced motor control with efficient power delivery." },
      { stage: "Sustain", description: "Optimized power management and high system reliability keep the platform mission-ready." },
    ],
    coreCapabilities: [
      "AI-based stabilization",
      "Adaptive flight algorithms",
      "Real-time telemetry processing",
      "Efficient power delivery",
      "Advanced motor control",
    ],
    keyFeatures: [
      "AI-based flight stabilization",
      "Real-time telemetry processing",
      "Efficient power delivery",
      "Optimized power management",
    ],
    applications: [
      "Foundational avionics layer for future Stravex aerial platforms",
    ],
    relatedTechnologies: ["Indigenous Hardware", "Autonomous Operations"],
    extraFeatureLists: [
      {
        heading: "Flight Controller Features",
        items: [
          "AI-based stabilization",
          "Adaptive flight algorithms",
          "Real-time telemetry processing",
          "Autonomous flight support",
          "High-precision flight control",
        ],
      },
      {
        heading: "ESC Features",
        items: [
          "Efficient power delivery",
          "Advanced motor control",
          "High system reliability",
          "Optimized power management",
        ],
      },
      {
        heading: "Supported Platforms",
        items: [
          "FPV drones",
          "Industrial drones",
          "Logistics drones",
          "Surveillance drones",
          "Tactical UAVs",
        ],
      },
    ],
  },
  {
    slug: "rakshakh",
    name: "RAKSHAKH",
    category: "Training & Simulation",
    sortOrder: 3,
    heroImageAspect: "3 / 4",
    tagline: "Plug. Train. Master. Deploy.",
    positioning: "High-fidelity FPV Drone Pilot Training Simulator.",
    purpose:
      "RAKSHAKH is designed to train UAV operators in a realistic, zero-risk environment before they operate real aircraft. It bridges the gap between classroom learning and operational readiness by combining professional-grade hardware with advanced flight simulation software.",
    problemStatement:
      "A drone pilot's first flight shouldn't be in a live combat zone — a rookie mistake with a high-stakes asset can cost significant equipment loss and months of operational readiness. Training operators directly on live aircraft is costly and risks damaging real hardware during the steepest part of the learning curve.",
    missionProfile:
      "By combining professional-grade hardware with advanced simulation software, RAKSHAKH replicates real-world flight dynamics, weather conditions, and high-risk environments with absolute precision. Trainees plug in true-to-life RC transmitters and strap on high-resolution FPV goggles, completely immersing themselves in a zero-risk, repeatable training platform. Whether mastering the hair-raising maneuvers of FPV combat drones or the precise positioning of multirotor platforms, RAKSHAKH eliminates equipment damage, slashes operational costs, and scales effortlessly across multiple units. Built to take pilots from beginner loops to advanced tactical deployment — RAKSHAKH ensures your operators are ready before the props ever spin.",
    workflow: [
      { stage: "Rig", description: "Operators connect professional-grade FPV goggles and RC transmitter hardware to the simulator." },
      { stage: "Simulate", description: "Realistic flight dynamics, weather, and environmental simulation recreate operational conditions." },
      { stage: "Train", description: "Repeatable tactical mission and FPV combat scenarios build muscle memory with zero aircraft risk." },
      { stage: "Assess", description: "Performance is evaluated across multirotor and combat drone scenarios before live deployment." },
    ],
    coreCapabilities: [
      "Realistic flight dynamics simulation",
      "Tactical mission training",
      "Weather and environmental simulation",
      "FPV combat training",
      "Multirotor training",
      "Immersive operator experience",
      "Repeatable mission scenarios",
      "Zero-risk pilot development",
    ],
    keyFeatures: [
      "True-to-life flight simulation hardware",
      "High-resolution FPV goggles & RC transmitter",
      "Supports FPV combat drones & multirotors",
      "Safe, zero-risk repeatable environment",
      "Pre-configured, plug-and-train setup",
    ],
    applications: [
      "Defence pilot training",
      "Military UAV operator development",
      "Tactical simulation",
      "Training academies",
      "Skill assessment",
      "Mission rehearsal",
    ],
    relatedTechnologies: ["Training & Support Infrastructure"],
  },
  {
    slug: "rudra",
    name: "RUDRA",
    category: "Mobile UAV Support Infrastructure",
    sortOrder: 4,
    heroImageAspect: "16 / 10",
    tagline: "Deploy. Repair. Validate. Relaunch.",
    positioning: "Mobile Drone Repair & Assembly Station.",
    purpose:
      "RUDRA is a lorry-mounted mobile UAV workshop that brings complete drone repair, assembly, maintenance, payload integration, and validation capabilities directly to forward operating locations, reducing downtime and increasing operational readiness.",
    problemStatement:
      "Damaged or grounded drones typically have to travel back to a central depot for repair, taking fleets out of action for extended periods. Forward-deployed maintenance keeps units flying by bringing the workshop to the field.",
    missionProfile:
      "Engineered for defense, paramilitary, and rapid-response units, this fully functional mobile facility eliminates the critical bottleneck of transporting damaged assets back to distant, fixed repair centers. By housing six specialized, parallel workstations within a single vehicle, RUDRA enables technicians to simultaneously handle everything from flight controller programming and airframe assembly to battery manufacturing and thrust validation. Whether executing rapid battle-damage repairs or hot-swapping payloads for immediate mission-role changes, RUDRA drastically cuts operational downtime and keeps your aerial fleets airborne where they are needed most.",
    workflow: [
      { stage: "Deploy", description: "The lorry-mounted platform moves the workshop directly to the forward operating location." },
      { stage: "Repair", description: "Six dedicated workstations run rapid battle-damage repair and drone assembly in parallel." },
      { stage: "Integrate", description: "Flight controller programming, payload integration, and battery manufacturing prepare the airframe." },
      { stage: "Validate", description: "Thrust validation confirms the platform is fit before relaunch." },
      { stage: "Relaunch", description: "The drone returns to active fleet duty with minimal transport downtime." },
    ],
    coreCapabilities: [
      "Forward-deployed UAV maintenance",
      "Rapid battle-damage repair",
      "Drone assembly",
      "Flight controller programming",
      "Payload integration",
      "Battery manufacturing",
      "Thrust validation",
      "Fleet readiness support",
    ],
    keyFeatures: [
      "Six dedicated UAV assembly & repair workstations",
      "Mobile workshop on wheels for forward deployments",
      "Parallel workstation operation for simultaneous repairs",
      "Supports full drone assembly & payload integration",
      "Eliminates transport downtime to fixed facilities",
    ],
    applications: [
      "Defence operations",
      "Military logistics",
      "Forward operating bases",
      "Paramilitary forces",
      "Rapid response units",
      "Field maintenance",
    ],
    relatedTechnologies: ["Training & Support Infrastructure", "Indigenous Hardware"],
  },
];

async function main() {
  for (const p of seedProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        category: p.category,
        status: "published",
        displayStatus: "In Development",
        sortOrder: p.sortOrder,
        heroImageAspect: p.heroImageAspect,
        tagline: p.tagline ?? null,
        positioning: p.positioning,
        purpose: p.purpose,
        problemStatement: p.problemStatement,
        missionProfile: p.missionProfile ?? null,
        designGoals: (p.designGoals ?? []) as object,
        workflow: p.workflow as object,
        coreCapabilities: p.coreCapabilities as object,
        keyFeatures: p.keyFeatures as object,
        technicalSpecs: (p.technicalSpecs ?? []) as object,
        applications: p.applications as object,
        relatedTechnologies: p.relatedTechnologies as object,
        extraFeatureLists: (p.extraFeatureLists ?? []) as object,
      },
    });
    console.log(`Seeded: ${p.name}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
