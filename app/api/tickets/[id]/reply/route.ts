
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const ticketId = parseInt(params.id);
    const body = await req.json();

    // 1. Create the message in DB
    await prisma.ticketMessage.create({
      data: {
        ticketId,
        body: body.message,
        fromAgent: true,
        authorName: body.agentName
      }
    });

    // 2. Log to outbox (simulated mail delivery)
    await prisma.outboxMessage.create({
      data: {
        toEmail: body.email,
        content: body.message
      }
    });

    // 3. Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: "Answered" },
      include: { messages: true, notes: true }
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
