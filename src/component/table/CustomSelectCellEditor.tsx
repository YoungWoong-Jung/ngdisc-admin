import React, { useEffect, useRef } from "react";

interface Option {
  value: string | number;
  label?: string;
}

interface CustomSelectCellEditorProps {
  value: any;
  options: Option[];
  onValueChange?: (value: any) => void;
  placeholder?: string;

}

function CustomSelectCellEditor({ value, options, onValueChange, placeholder = '선택' }: CustomSelectCellEditorProps) {
  // value를 실제 타입(숫자/문자열)로 변환하는 함수
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    // options에서 선택된 value의 타입을 찾아서 맞춰줌
    const matchedOption = options.find(opt => String(opt.value) === selectedValue);
    let outputValue: string | number = selectedValue;
    if (matchedOption) {
      outputValue = typeof matchedOption.value === "number" ? Number(selectedValue) : selectedValue;
    }
    onValueChange?.(outputValue);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      style={{ width: "100%", height: "100%" }}
      className="outline-1 outline outline-blueTone"
    >
      <option value="" className="text-black-500">{placeholder || '선택'}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label || opt.value}
        </option>
      ))}
    </select>
  );
}

export default CustomSelectCellEditor;
