import fs from "fs";
import path from "path";

/** Slugify a display name for static portrait filenames, e.g. "Krishna Mallawat" → "krishna-mallawat". */
export function teamMemberPhotoSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolve a team member portrait URL.
 * Prefers a local JPG in public/images/team/, then an optional CMS URL.
 */
export function resolveTeamMemberPhotoSrc(
  name: string,
  cmsPhotoUrl?: string | null,
): string | undefined {
  const slug = teamMemberPhotoSlug(name);
  const localPath = path.join(process.cwd(), "public", "images", "team", `${slug}.jpg`);
  if (fs.existsSync(localPath)) {
    return `/images/team/${slug}.jpg`;
  }
  return cmsPhotoUrl ?? undefined;
}
