import { NextResponse } from 'next/server';

export async function GET() {
  // 尝试读取各种可能的环境变量名
  const possibleKeys = [
    'DEEPSEEK_API_KEY',
    'DEEPSEEK_APIKEY', 
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_DEEPSEEK_API_KEY'
  ];
  
  const keyStatus: Record<string, { exists: boolean; length?: number }> = {};
  
  possibleKeys.forEach(key => {
    const value = process.env[key];
    keyStatus[key] = {
      exists: !!value,
      length: value?.length
    };
  });
  
  // 主 key
  const mainKey = process.env.DEEPSEEK_API_KEY;
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      allPossibleKeys: keyStatus,
      activeKey: mainKey ? {
        exists: true,
        prefix: mainKey.substring(0, 7) + '...',
        length: mainKey.length,
        validFormat: mainKey.startsWith('sk-')
      } : {
        exists: false
      }
    },
    setup_instructions: {
      step1: '进入 Railway Dashboard',
      step2: '选择你的项目',
      step3: '点击左侧 "Variables"',
      step4: '点击 "New Variable"',
      step5: 'Name 填写: DEEPSEEK_API_KEY',
      step6: 'Value 填写: 你的 DeepSeek API Key (以 sk- 开头)',
      step7: '点击 "Add"',
      step8: '进入 "Deployments" 标签，点击 "Redeploy" 重新部署'
    }
  });
}
