import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Get the initial mock mode status from environment variables
let useMock = process.env.USE_REAL_LNBITS !== 'true' && process.env.NODE_ENV !== 'production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Mode can only be changed in development environment' },
        { status: 403 }
      );
    }
    
    if (body.useMock !== undefined) {
      useMock = !!body.useMock;
      
      // Try to update the .env.local file for persistence
      try {
        const envPath = path.join(process.cwd(), '.env.local');
        let envContent = '';
        
        if (fs.existsSync(envPath)) {
          envContent = fs.readFileSync(envPath, 'utf8');
          
          // Replace or add the USE_REAL_LNBITS setting
          if (envContent.includes('USE_REAL_LNBITS=')) {
            envContent = envContent.replace(
              /USE_REAL_LNBITS=(true|false)/,
              `USE_REAL_LNBITS=${!useMock}`
            );
          } else {
            envContent += `\nUSE_REAL_LNBITS=${!useMock}\n`;
          }
          
          fs.writeFileSync(envPath, envContent);
        }
      } catch (fsError) {
        console.error('Could not update .env.local file:', fsError);
        // Continue anyway, since we've updated the in-memory setting
      }
      
      return NextResponse.json({ useMock });
    }
    
    return NextResponse.json(
      { error: 'Missing useMock parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating mode:', error);
    return NextResponse.json(
      { error: 'Failed to update mode' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Log the current mode for debugging
  console.log(`Current mode: ${useMock ? 'mock' : 'real'}, USE_REAL_LNBITS=${process.env.USE_REAL_LNBITS}`);
  return NextResponse.json({ useMock });
}