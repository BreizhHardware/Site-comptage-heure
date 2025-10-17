import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as csvWriter from 'csv-writer';
import ExcelJS from 'exceljs';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')
  ) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  const hours = await prisma.hour.findMany({
    include: { user: { select: { email: true } } },
  });

  if (format === 'csv') {
    const csvString = await generateCSV(hours);
    return new NextResponse(csvString, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="hours.csv"',
      },
    });
  } else if (format === 'excel') {
    const buffer = await generateExcel(hours);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="hours.xlsx"',
      },
    });
  } else {
    return NextResponse.json({ error: 'Format invalide' }, { status: 400 });
  }
}

async function generateCSV(hours: any[]) {
  const createCsvWriter = csvWriter.createObjectCsvStringifier;
  const csvWriterInstance = createCsvWriter({
    header: [
      { id: 'id', title: 'ID' },
      { id: 'date', title: 'Date' },
      { id: 'duration', title: 'Duration (min)' },
      { id: 'reason', title: 'Reason' },
      { id: 'status', title: 'Status' },
      { id: 'userEmail', title: 'User Email' },
    ],
  });

  const records = hours.map((h) => ({
    id: h.id,
    date: h.date.toISOString().split('T')[0],
    duration: h.duration,
    reason: h.reason,
    status: h.status,
    userEmail: h.user.email,
  }));

  return (
    csvWriterInstance.getHeaderString() +
    csvWriterInstance.stringifyRecords(records)
  );
}

async function generateExcel(hours: any[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Hours');

  worksheet.columns = [
    { header: 'ID', key: 'id' },
    { header: 'Date', key: 'date' },
    { header: 'Duration (min)', key: 'duration' },
    { header: 'Reason', key: 'reason' },
    { header: 'Status', key: 'status' },
    { header: 'User Email', key: 'userEmail' },
  ];

  hours.forEach((h) => {
    worksheet.addRow({
      id: h.id,
      date: h.date.toISOString().split('T')[0],
      duration: h.duration,
      reason: h.reason,
      status: h.status,
      userEmail: h.user.email,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
