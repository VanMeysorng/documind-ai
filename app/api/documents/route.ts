import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    
    const filename = `${Date.now()}-${file.name}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    // Find a valid user
    let actualUserId = '';
    
    if (userId && userId !== 'guest') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        actualUserId = user.id;
      }
    }
    
    if (!actualUserId) {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        actualUserId = firstUser.id;
      } else {
        const guestUser = await prisma.user.create({
          data: {
            email: `guest${Date.now()}@documind.ai`,
            name: 'Guest User',
          },
        });
        actualUserId = guestUser.id;
      }
    }

    const document = await prisma.document.create({
      data: {
        userId: actualUserId,
        title: file.name,
        type: file.type.includes('pdf') ? 'PDF' : 'IMAGE',
        fileUrl: `/uploads/${filename}`,
        fileSize: BigInt(file.size),
        mimeType: file.type,
      },
    });

    // Convert BigInt to string for JSON
    const responseData = {
      ...document,
      fileSize: document.fileSize.toString(),
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Convert BigInt to string for JSON
    const responseData = documents.map(doc => ({
      ...doc,
      fileSize: doc.fileSize.toString(),
    }));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
