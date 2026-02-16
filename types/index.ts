// ==================== 基础枚举 ====================
export enum SubjectArea {
  CRIMINAL_LAW = '刑法',
  CIVIL_LAW = '民法',
  CRIMINAL_PROCEDURE = '刑事诉讼法',
  CIVIL_PROCEDURE = '民事诉讼法',
  ADMINISTRATIVE_LAW = '行政法与行政诉讼法',
  COMMERCIAL_LAW = '商经知',
  THEORETICAL_LAW = '理论法',
  INTERNATIONAL_LAW = '三国法'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum QuestionType {
  SINGLE_CHOICE = 'single',
  MULTIPLE_CHOICE = 'multiple',
  SUBJECTIVE = 'subjective'
}

// ==================== 输入模型 ====================
export interface CaseInput {
  id: string;
  content: string;           // 案例原文，必填，最少20字
  subjectArea?: SubjectArea; // 可选，用户指定的科目
  createdAt: number;         // 时间戳
  status: 'pending' | 'analyzing' | 'completed' | 'error';
}

// ==================== API请求/响应 ====================
export interface AnalyzeCaseRequest {
  caseContent: string;
  subjectArea?: SubjectArea;
}

export interface AnalyzeCaseResponse {
  success: boolean;
  data?: CaseAnalysis;
  error?: string;
}

// ==================== 分析阶段类型 ====================
export type AnalysisPhase = 'idle' | 'understanding' | 'reasoning' | 'generating' | 'complete';

// ==================== 学习建议 ====================
export interface StudyAdvice {
  summary: string;           // 一句话总结核心要点
  keyPoints: string[];       // 核心知识点列表
  commonMistakes: string[];  // 常见错误分析
  studyTips: string[];       // 复习建议
  relatedTopics: string[];   // 关联考点
}

// ==================== AI分析结果 ====================
export interface CaseAnalysis {
  caseId: string;
  thinking: string;          // DeepSeek-R1思维链（推理过程）
  legalBasis: LegalBasis[];  // 涉及法条
  keyPoints: KeyPoint[];     // 考点分析
  caseType: string;          // 案例类型标签
  difficulty: DifficultyInfo;
  generatedQuestion: GeneratedQuestion;
  studyAdvice: StudyAdvice;  // 结构化学习建议
}

export interface LegalBasis {
  article: string;           // 法条编号，如"刑法第264条"
  content: string;           // 法条原文
  interpretation: string;    // AI通俗解读
  relevance: number;         // 相关度 0-100
  frequency: number;         // 近5年考频（次）
}

export interface KeyPoint {
  name: string;              // 考点名称
  category: SubjectArea;     // 所属科目
  weight: number;            // 重要性权重 0-100
}

export interface DifficultyInfo {
  level: DifficultyLevel;
  score: number;             // 难度分 1-10
  reasoning: string;         // 难度判定理由
}

export interface QuestionExplanation {
  summary: string;           // 一句话总结正确答案
  legalBasis: string[];      // 法律依据分点说明
  reasoning: string[];       // 推理过程分点说明
  conclusion: string;        // 结论
}

export interface GeneratedQuestion {
  type: QuestionType;
  question: string;          // 题目内容
  options?: QuestionOption[]; // 选择题选项
  correctAnswer: string;     // 正确答案（A/B/C/D或文字）
  explanation: QuestionExplanation;  // 结构化详细解析
  commonMistakes: string[];  // 常见错误分析
  relatedArticles: string[]; // 相关法条引用
}

export interface QuestionOption {
  key: string;               // A/B/C/D
  content: string;           // 选项内容
  isCorrect: boolean;        // 是否正确答案
  whyWrong?: string;         // 错误原因（如果是错误选项）
}

// ==================== 用户交互状态 ====================
export interface UserAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpent: number;         // 答题用时（毫秒）
  answeredAt: number;
}

export interface CaseHistoryItem extends CaseInput {
  analysis?: CaseAnalysis;
  userAnswer?: UserAnswer;
}

// ==================== 流式响应类型 ====================
export interface StreamChunk {
  type: 'thinking' | 'analysis' | 'error' | 'complete';
  content?: string;
  data?: CaseAnalysis;
  error?: string;
}
