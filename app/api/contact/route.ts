import { handleContact } from '@/lib/contact';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
export async function POST(request: Request) { return handleContact(request); }
