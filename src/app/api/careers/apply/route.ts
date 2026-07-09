import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeFilename } from "@/lib/media";
import { notify } from "@/lib/notifications";

const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const applicantName = String(formData.get("applicantName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const appliedRole = String(formData.get("appliedRole") || "").trim() || "General Application";
  const jobOpeningId = String(formData.get("jobOpeningId") || "").trim() || null;
  const company = String(formData.get("company") || "").trim() || null;
  const phone = String(formData.get("phone") || "").trim() || null;
  const message = String(formData.get("message") || "").trim() || null;
  const resume = formData.get("resume");

  if (!applicantName || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "A resume file is required." }, { status: 400 });
  }
  if (!ALLOWED_RESUME_TYPES.has(resume.type)) {
    return NextResponse.json(
      { error: "Resume must be a PDF or Word document." },
      { status: 400 }
    );
  }
  if (resume.size > MAX_RESUME_BYTES) {
    return NextResponse.json(
      { error: "Resume must be 5MB or smaller." },
      { status: 400 }
    );
  }

  let validJobOpeningId: string | null = null;
  if (jobOpeningId) {
    const job = await prisma.jobOpening.findFirst({
      where: { id: jobOpeningId, status: "published", deletedAt: null },
    });
    if (job) validJobOpeningId = job.id;
  }

  const ext = path.extname(resume.name);
  const base = sanitizeFilename(path.basename(resume.name, ext)) || "resume";
  const filename = `${base}-${randomUUID().slice(0, 8)}${ext.toLowerCase()}`;
  const resumeDir = path.join(process.cwd(), "public", "uploads", "resumes");
  await mkdir(resumeDir, { recursive: true });

  const buffer = Buffer.from(await resume.arrayBuffer());
  await writeFile(path.join(resumeDir, filename), buffer);

  const application = await prisma.careerApplication.create({
    data: {
      applicantName,
      appliedRole,
      jobOpeningId: validJobOpeningId,
      company,
      email,
      phone,
      resumeUrl: `/uploads/resumes/${filename}`,
      message,
    },
  });

  await notify({
    type: "new_application",
    message: `New application from ${applicantName} for ${appliedRole}`,
    linkHref: "/admin/careers?tab=applications",
  });

  return NextResponse.json({ success: true, id: application.id }, { status: 201 });
}
