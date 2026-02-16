import { SubjectArea } from '@/types';

export interface PresetCase {
  id: string;
  title: string;
  subject: SubjectArea;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  content: string;
}

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'criminal-law-1',
    title: '转化型抢劫案',
    subject: SubjectArea.CRIMINAL_LAW,
    category: '财产犯罪',
    difficulty: 'medium',
    description: '盗窃转化为抢劫的经典案例，涉及刑法第269条',
    content: `案例：李某盗窃案

李某深夜潜入王某家中，窃得现金5000元及手机一部。在准备离开时，被回家的王某发现。王某上前阻拦并呼喊抓贼。李某为抗拒抓捕，随手拿起桌上的水果刀威胁王某："别过来，否则捅死你！"随后逃离现场。

经鉴定，被盗物品总价值6500元。李某于次日被公安机关抓获。

问题：李某的行为应当如何定性？`,
  },
  {
    id: 'civil-law-1',
    title: '房屋买卖合同纠纷',
    subject: SubjectArea.CIVIL_LAW,
    category: '合同纠纷',
    difficulty: 'medium',
    description: '一房二卖与善意取得的复杂案例',
    content: `案例：房屋买卖纠纷案

2023年3月，张某将其名下的一套房产以200万元的价格出售给李某，双方签订了房屋买卖合同，李某支付了全部房款，但尚未办理过户登记。2023年5月，张某又将该房产以220万元的价格出售给王某，并立即办理了过户登记手续。

李某得知后，要求张某履行合同并办理过户，同时要求王某返还房屋。王某主张自己是善意第三人，已取得房屋所有权。

问题：
1. 李某与张某、王某与张某之间的合同效力如何？
2. 该房屋的所有权归谁所有？
3. 李某的权利如何保护？`,
  },
  {
    id: 'criminal-procedure-1',
    title: '非法证据排除',
    subject: SubjectArea.CRIMINAL_PROCEDURE,
    category: '证据规则',
    difficulty: 'hard',
    description: '刑讯逼供与非法证据排除规则的适用',
    content: `案例：非法证据排除案

赵某涉嫌故意杀人罪被公安机关刑事拘留。在讯问过程中，侦查人员采用连续审讯、不让休息、殴打等方式，迫使赵某作出了有罪供述。根据赵某的供述，公安机关找到了作案工具和被害人尸体。

案件移送审查起诉后，赵某的辩护人申请排除赵某的有罪供述，并主张根据该供述找到的作案工具和尸体也应一并排除。

问题：
1. 赵某的有罪供述是否应当排除？
2. 根据供述找到的作案工具和尸体是否应当排除？
3. 法院应当如何审查非法证据排除申请？`,
  },
  {
    id: 'administrative-law-1',
    title: '行政处罚与复议',
    subject: SubjectArea.ADMINISTRATIVE_LAW,
    category: '行政处罚',
    difficulty: 'easy',
    description: '行政处罚的程序与行政复议的期限',
    content: `案例：行政处罚复议案

2023年8月15日，某市市场监督管理局以某超市销售过期食品为由，作出罚款5万元的行政处罚决定，并于当日将处罚决定书送达超市负责人。处罚决定书载明：如不服本处罚决定，可在收到决定书之日起60日内向市人民政府申请行政复议，或在6个月内向人民法院提起行政诉讼。

超市于2023年11月1日向市人民政府申请行政复议，市人民政府以超过复议期限为由不予受理。超市不服，向法院提起行政诉讼。

问题：
1. 超市申请行政复议是否超过法定期限？
2. 市人民政府不予受理的决定是否合法？
3. 超市如何维护自己的权益？`,
  },
  {
    id: 'commercial-law-1',
    title: '公司股东出资纠纷',
    subject: SubjectArea.COMMERCIAL_LAW,
    category: '公司法',
    difficulty: 'medium',
    description: '股东出资义务与债权人保护',
    content: `案例：股东出资纠纷案

甲、乙、丙三人共同出资设立某有限责任公司，注册资本100万元。其中甲认缴出资40万元，乙认缴出资30万元，丙认缴出资30万元，出资期限均为2030年12月31日。

2023年，该公司因经营不善欠下大量债务，债权人丁公司要求甲、乙、丙提前缴纳出资以清偿债务。甲、乙、丙辩称出资期限尚未届满，拒绝提前出资。丁公司遂向法院起诉，要求甲、乙、丙在认缴出资范围内对公司债务承担补充赔偿责任。

问题：
1. 在出资期限尚未届满的情况下，股东是否有义务提前出资？
2. 债权人丁公司的请求能否得到支持？
3. 什么情况下可以要求股东提前缴纳出资？`,
  },
];

export function getPresetCaseById(id: string): PresetCase | undefined {
  return PRESET_CASES.find(c => c.id === id);
}

export function getPresetCasesBySubject(subject: SubjectArea): PresetCase[] {
  return PRESET_CASES.filter(c => c.subject === subject);
}
