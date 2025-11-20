import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import ExcelJS from 'exceljs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const results: { sheetName: string; users: any[]; errors: string[]; preview: string[][] }[] = [];

    const getCellValue = (cellValue: any): string => {
      if (cellValue === null || cellValue === undefined) return '';
      if (typeof cellValue === 'object') {
        if ('text' in cellValue) return cellValue.text.toString();
        if ('result' in cellValue) return cellValue.result?.toString() || '';
        if ('hyperlink' in cellValue && 'text' in cellValue) return cellValue.text.toString();
      }
      return cellValue.toString();
    };

    for (const worksheet of workbook.worksheets) {
      const sheetName = worksheet.name;
      const users: any[] = [];
      const errors: string[] = [];
      const preview: string[][] = [];

      // Collect preview of first 5 rows
      let rowCount = 0;
      worksheet.eachRow((row, rowNumber) => {
        if (rowCount < 5) {
          const cells = row.values as any[];
          // Handle 1-based index of row.values where index 0 is usually undefined
          // We want columns 1 to end.
          const rowValues = Array.isArray(cells) ? cells : [];
          // Slice from 1 to get actual columns if using row.values
          const displayValues = rowValues.slice(1).map(cell => getCellValue(cell));
          preview.push(displayValues);
          rowCount++;
        }
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        const cells = row.values as any[];
        // Columns: NOM Prénom, Classe, Fonction dans le club, Mail
        // ExcelJS row.values is 1-based, so index 1 is column 1.
        const fullName = getCellValue(cells[1]).trim();
        const email = getCellValue(cells[4]).trim();

        if (!fullName || !email) {
          errors.push(`Row ${rowNumber}: Missing required fields (NOM Prénom: "${fullName}", Mail: "${email}")`);
          return;
        }

        // Skip lines that don't look like user entries
        // Must have name with at least one space (first last), and valid email
        if (!fullName.includes(' ') || fullName.split(' ').length < 2) {
          errors.push(`Row ${rowNumber}: Skipped - name doesn't look like "LastName FirstName" (NOM Prénom: "${fullName}")`);
          return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push(`Row ${rowNumber}: Invalid email format: "${email}"`);
          return;
        }

        // Split fullName into firstName and lastName
        // Assume format: "LastName FirstName"
        const nameParts = fullName.split(' ');
        const lastName = nameParts[0];
        const firstName = nameParts.slice(1).join(' ');

        users.push({
          id: uuidv4(),
          email,
          firstName,
          lastName,
          password: '', // Will be set to require reset
          role: 'MEMBER',
          passwordResetRequired: true,
        });
      });

      results.push({ sheetName, users, errors, preview });
    }

    // For now, return the parsed data for confirmation
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sheetName, users } = await request.json();

    if (!sheetName || !users) {
      return NextResponse.json({ error: 'Missing sheetName or users' }, { status: 400 });
    }

    const createdUsers = [];
    const errors = [];

    for (const user of users) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          errors.push(`User with email ${user.email} already exists`);
          continue;
        }

        // Hash a temporary password
        const hashedPassword = await bcrypt.hash('123456', 10);

        const newUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: hashedPassword,
            role: 'MEMBER',
            passwordResetRequired: true,
          },
        });

        createdUsers.push(newUser);
      } catch (error) {
        errors.push(`Error creating user ${user.email}: ${(error as Error).message}`);
      }
    }

    return NextResponse.json({ createdUsers, errors });
  } catch (error) {
    console.error('Confirm import error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}