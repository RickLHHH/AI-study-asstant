'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SubjectArea } from '@/types';

interface SubjectSelectorProps {
  value?: SubjectArea;
  onChange: (value: SubjectArea | undefined) => void;
}

const AUTO_VALUE = '___auto___';

const subjectOptions = [
  { value: AUTO_VALUE, label: '自动识别' },
  ...Object.values(SubjectArea).map((subject) => ({
    value: subject,
    label: subject,
  })),
];

export function SubjectSelector({ value, onChange }: SubjectSelectorProps) {
  const selectValue = value || AUTO_VALUE;

  const handleChange = (val: string) => {
    if (val === AUTO_VALUE) {
      onChange(undefined);
    } else {
      onChange(val as SubjectArea);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        科目分类（可选）
      </label>
      <Select
        value={selectValue}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="自动识别" />
        </SelectTrigger>
        <SelectContent>
          {subjectOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-slate-500">
        如不选择，AI将自动识别案例所属科目
      </p>
    </div>
  );
}
