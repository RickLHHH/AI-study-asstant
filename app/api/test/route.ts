import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API 路由正常工作',
    timestamp: new Date().toISOString(),
    node_env: process.env.NODE_ENV,
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  
  return NextResponse.json({
    message: 'POST 请求正常',
    received: body,
    hasApiKey: !!process.env.DEEPSEEK_API_KEY,
    apiKeyLength: process.env.DEEPSEEK_API_KEY?.length || 0,
  });
}
