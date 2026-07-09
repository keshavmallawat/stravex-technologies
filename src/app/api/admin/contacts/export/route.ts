import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toCSV, toExcelBuffer, type ExportColumn } from "@/lib/export";

interface ContactExportRow {
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

const columns: ExportColumn<ContactExportRow>[] = [
  { header: "Name", value: (r) => r.name },
  { header: "Company", value: (r) => r.company ?? "" },
  { header: "Email", value: (r) => r.email },
  { header: "Phone", value: (r) => r.phone ?? "" },
  { header: "Message", value: (r) => r.message },
  { header: "Status", value: (r) => r.status },
  { header: "Received", value: (r) => r.createdAt.toISOString() },
];

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const format = req.nextUrl.searchParams.get("format") === "xlsx" ? "xlsx" : "csv";
  const status = req.nextUrl.searchParams.get("status");

  const contacts = await prisma.contact.findMany({
    where: {
      deletedAt: null,
      ...(status && status !== "all" ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  if (format === "xlsx") {
    const buffer = await toExcelBuffer(contacts, columns, "Contacts");
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="contacts.xlsx"`,
      },
    });
  }

  const csv = toCSV(contacts, columns);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contacts.csv"`,
    },
  });
}
