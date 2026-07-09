import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, company, phone, email, message } = (body ?? {}) as Record<string, unknown>;

  const nameStr = typeof name === "string" ? name.trim() : "";
  const emailStr = typeof email === "string" ? email.trim() : "";
  const messageStr = typeof message === "string" ? message.trim() : "";
  const companyStr = typeof company === "string" ? company.trim() : "";
  const phoneStr = typeof phone === "string" ? phone.trim() : "";

  if (!nameStr || !emailStr || !messageStr) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }
  if (messageStr.length > 1000) {
    return NextResponse.json(
      { error: "Message must be 1000 characters or fewer." },
      { status: 400 }
    );
  }

  const contact = await prisma.contact.create({
    data: {
      name: nameStr,
      company: companyStr || null,
      phone: phoneStr || null,
      email: emailStr,
      message: messageStr,
    },
  });

  await notify({
    type: "new_contact",
    message: `New contact enquiry from ${nameStr}`,
    linkHref: "/admin/contacts",
  });

  return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
}
