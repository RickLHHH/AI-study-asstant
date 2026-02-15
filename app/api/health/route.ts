import { NextResponse } from 'next/server';

export async function GET() {
  // 检查环境变量（只返回是否存在，不返回实际值）
  const envStatus = {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? '已配置' : '未配置',
    NODE_ENV: process.env.NODE_ENV || 'unknown',
  };

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: envStatus,
  });
}
