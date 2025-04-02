import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Ensure uploads directory exists
const createUploadsDir = async () => {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
  return uploadDir;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Create a file extension based on mime type
    const fileExtension = file.type.split('/')[1] || '';
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Ensure uploads directory exists
    const uploadDir = await createUploadsDir();
    const filePath = path.join(uploadDir, fileName);
    
    // Convert file to buffer and write to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Return the public URL
    const publicUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      url: publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 