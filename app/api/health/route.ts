import { NextResponse } from 'next/server';

export async function GET() {
  // 检查环境变量（只返回是否存在，不返回实际值）
  const envStatus = {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? '已配置' : '未配置',
    DEEPSEEK_API_KEY_LENGTH: process.env.DEEPSEEK_API_KEY?.length || 0,
    NODE_ENV: process.env.NODE_ENV || 'unknown',
    ALL_ENV_KEYS: Object.keys(process.env).filter(k => 
      !k.includes('SECRET') && !k.includes('KEY') && !k.includes('TOKEN') && !k.includes('PASSWORD')
    ),
  };

  // 检查特定变量
  const hasApiKey = !!process.env.DEEPSEEK_API_KEY;
  const apiKeyPrefix = process.env.DEEPSEEK_API_KEY 
    ? process.env.DEEPSEEK_API_KEY.substring(0, 10) + '...' 
    : 'none';

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: envStatus,
    diagnostics: {
      hasApiKey,
      apiKeyPrefix,
    }
  });
}
