/**
 * Third-party press coverage. This is NOT company-issued content — every
 * item here is attributed to and linked back to the original outlet, per
 * explicit instruction not to present it as an official Stravex claim.
 */
export interface PressItem {
  outlet: string;
  title: string;
  url: string;
  date?: string;
  summary: string;
}

export const pressItems: PressItem[] = [
  {
    outlet: "Indian Defence News",
    title:
      "Stravex Technologies Successfully Completes Army Trials of AgniStrike, India's First Indigenous Drone Interceptor",
    url: "https://www.indiandefensenews.in/2026/06/stravex-technologies-successfully.html",
    summary:
      "Reports on a demonstration of AgniStrike conducted with the Indian Army's 97 Artillery Regiment.",
  },
  {
    outlet: "idrw.org",
    title:
      "Stravex Technologies Completes Indian Army Trials of AgniStrike Next-Generation Drone Interceptor",
    url: "https://idrw.org/stravex-technologies-completes-indian-army-trials-of-agnistrike-next-generation-drone-interceptor/",
    summary:
      "Coverage of the AgniStrike trial, describing it as a hard-kill, drone-on-drone counter-UAS approach.",
  },
  {
    outlet: "Startuppedia",
    title:
      "Speed, AI, And A Three-Minute Kill Window: Meet Stravex Technologies' AgniStrike System",
    url: "https://startuppedia.in/tech-innovation/stravex-technologies-agnistrike-india-indigenous-drone-interceptor-army-2025-12034774",
    summary:
      "Profile of AgniStrike's reported detection-to-interception approach and its positioning within India's indigenous counter-drone efforts.",
  },
];
