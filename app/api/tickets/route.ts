
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        messages: true,
        notes: true
      },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ticket = await prisma.ticket.create({
      data: {
        subject: body.subject,
        requesterEmail: body.requesterEmail,
        priority: body.priority,
        messages: {
          create: {
            body: body.message,
            fromAgent: false,
            authorName: body.requesterName || body.requesterEmail
          }
        }
      }
    });
    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
