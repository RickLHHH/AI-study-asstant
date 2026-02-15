import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeCaseRequest, CaseAnalysis } from '@/types';

const SYSTEM_PROMPT = `你是一位拥有15年教学经验的资深法考培训专家，擅长刑法、民法等法律科目教学。
请对以下法律案例进行深度分析，并生成高质量的法考模拟题。

输出要求：
1. 必须严格按照提供的JSON格式输出
2. 法条引用必须准确，使用现行有效法律条文
3. 考点必须是近5年法考真题中出现过的核心考点
4. 思维链(thinking)要展示你的法律推理过程，不少于200字
5. 生成的题目必须符合2024年法考大纲要求
6. 干扰项必须有迷惑性但逻辑上必然错误，符合常见错误思维

JSON Schema:
{
  "thinking": "string (法律推理过程，200字以上)",
  "legalBasis": [
    {
      "article": "string (法条编号)",
      "content": "string (法条原文)",
      "interpretation": "string (通俗解读)",
      "relevance": "number (0-100)",
      "frequency": "number (近5年考频)"
    }
  ],
  "keyPoints": [
    {
      "name": "string (考点名)",
      "category": "string (科目)",
      "weight": "number (0-100)"
    }
  ],
  "caseType": "string (案例类型)",
  "difficulty": {
    "level": "string (easy/medium/hard)",
    "score": "number (1-10)",
    "reasoning": "string (难度判定理由)"
  },
  "generatedQuestion": {
    "type": "string (single/multiple/subjective)",
    "question": "string (题目)",
    "options": [
      {
        "key": "string (A/B/C/D)",
        "content": "string (选项内容)",
        "isCorrect": "boolean",
        "whyWrong": "string (错误原因，仅错误选项需要)"
      }
    ],
    "correctAnswer": "string",
    "explanation": "string (详细解析，包含法律依据)",
    "commonMistakes": ["string"],
    "relatedArticles": ["string"]
  },
  "studyAdvice": "string (学习建议)"
}`;

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeCaseRequest = await req.json();
    const { caseContent, subjectArea } = body;

    if (!caseContent || caseContent.length < 20) {
      return NextResponse.json(
        { success: false, error: '案例内容至少需要20字' },
        { status: 400 }
      );
    }

    // 读取 API Key - 支持多种环境变量名
    let apiKey = process.env.DEEPSEEK_API_KEY;
    
    // 如果找不到，尝试其他可能的变量名
    if (!apiKey) {
      apiKey = process.env.DEEPSEEK_APIKEY;
    }
    if (!apiKey) {
      apiKey = process.env.OPENAI_API_KEY; // 有些用户可能用这个
    }
    
    console.log('[API] Environment check:', {
      node_env: process.env.NODE_ENV,
      hasDeepseekKey: !!process.env.DEEPSEEK_API_KEY,
      keyLength: apiKey?.length,
    });
    
    if (!apiKey) {
      console.error('[API] DEEPSEEK_API_KEY is not set!');
      return NextResponse.json(
        { 
          success: false, 
          error: 'API密钥未配置。请在 Railway Dashboard → Variables 中添加 DEEPSEEK_API_KEY',
          hint: '设置步骤: 1.进入Railway Dashboard→Variables 2.点击New Variable 3.Name填写DEEPSEEK_API_KEY 4.Value填写你的API Key 5.点击Add后重新部署'
        },
        { status: 500 }
      );
    }
    
    // 验证 API Key 格式
    if (!apiKey.startsWith('sk-')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'API Key 格式不正确。DeepSeek API Key 应该以 "sk-" 开头'
        },
        { status: 500 }
      );
    }

    const userPrompt = `请分析以下法律案例${subjectArea ? `（科目：${subjectArea}）` : ''}：

${caseContent}

请按照系统指令中的JSON格式返回分析结果。`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        stream: true,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { success: false, error: `API请求失败: ${error}` },
        { status: 500 }
      );
    }

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.error(new Error('无法获取响应流'));
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let thinkingContent = '';
        let jsonContent = '';
        let isInThinking = false;
        let isInJson = false;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta;
                  
                  if (delta?.reasoning_content) {
                    // 推理过程（思维链）
                    const chunk = delta.reasoning_content;
                    thinkingContent += chunk;
                    controller.enqueue(
                      new TextEncoder().encode(
                        JSON.stringify({ type: 'thinking', content: chunk }) + '\n'
                      )
                    );
                  } else if (delta?.content) {
                    // 正式内容（JSON）
                    const content = delta.content;
                    
                    // 尝试提取JSON
                    if (!isInJson && content.includes('{')) {
                      isInJson = true;
                      const startIdx = content.indexOf('{');
                      jsonContent += content.slice(startIdx);
                    } else if (isInJson) {
                      jsonContent += content;
                    }
                  }
                } catch (e) {
                  // 忽略解析错误
                }
              }
            }
          }

          // 尝试解析最终JSON
          if (jsonContent) {
            try {
              // 清理可能的markdown标记
              const cleanJson = jsonContent
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
              
              const analysis: CaseAnalysis = JSON.parse(cleanJson);
              controller.enqueue(
                new TextEncoder().encode(
                  JSON.stringify({ type: 'analysis', data: analysis }) + '\n'
                )
              );
            } catch (e) {
              // 如果JSON解析失败，返回错误
              controller.enqueue(
                new TextEncoder().encode(
                  JSON.stringify({ 
                    type: 'error', 
                    error: '分析结果解析失败，请重试' 
                  }) + '\n'
                )
              );
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
