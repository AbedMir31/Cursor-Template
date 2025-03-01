import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    
    // Try to exchange code for session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes, adding a success parameter
  return NextResponse.redirect(new URL('/app?success=true', requestUrl.origin));
} 