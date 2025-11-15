import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
        
      include: {
        therapist: true,
        patient: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Transform the data to include therapist and patient names at the top level
    const transformedSessions = sessions.map((session) => ({
      id: session.id,
      therapistName: session.therapist.name,
      patientName: session.patient.name,
      date: session.date,
      status: session.status,
      therapist: session.therapist,
      patient: session.patient,
    }));

    return NextResponse.json(transformedSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}