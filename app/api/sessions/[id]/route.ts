import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = parseInt(id);

    // Validate ID
    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || (status !== 'Scheduled' && status !== 'Completed')) {
      return NextResponse.json(
        { error: 'Status must be either "Scheduled" or "Completed"' },
        { status: 400 }
      );
    }

    // Check if session exists
    const existingSession = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Update the session
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { status },
      include: {
        therapist: true,
        patient: true,
      },
    });

    // Transform the response data
    const transformedSession = {
      id: updatedSession.id,
      therapistName: updatedSession.therapist?.name ?? '',
      patientName: updatedSession.patient?.name ?? '',
      date: updatedSession.date,
      status: updatedSession.status,
      therapist: updatedSession.therapist,
      patient: updatedSession.patient,
    };

    return NextResponse.json(transformedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}