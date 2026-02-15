import { NextResponse } from 'next/server';

// 这个路由在每次请求时动态读取环境变量
export async function GET() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  return NextResponse.json({
    message: '环境变量诊断',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      DEEPSEEK_API_KEY: {
        exists: !!apiKey,
        length: apiKey?.length || 0,
        preview: apiKey ? `${apiKey.substring(0, 10)}...` : 'not set',
        valid: apiKey?.startsWith('sk-') || false
      }
    },
    all_env_keys: Object.keys(process.env).filter(k => 
      !k.includes('SECRET') && 
      !k.includes('PASSWORD') && 
      !k.includes('TOKEN') &&
      !k.includes('KEY')
    ).sort()
  });
}

export async function POST(req: Request) {
  // 测试带 body 的请求
  const body = await req.json().catch(() => ({}));
  
  return NextResponse.json({
    message: 'POST 测试成功',
    received_body: body,
    env_key_exists: !!process.env.DEEPSEEK_API_KEY,
    timestamp: new Date().toISOString()
  });
}
