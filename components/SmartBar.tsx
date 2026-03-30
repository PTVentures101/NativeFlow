"use client";

import { QueryInput } from "@/components/QueryInput";

interface SmartBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function SmartBar({ value, onChange, onSubmit, isLoading }: SmartBarProps) {
  return (
    <QueryInput
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
      placeholder={`How do natives say it?\nType a phrase in any language, or ask how to say something...`}
      submitLabel="Check"
      loadingLabel="Analysing"
      minLength={5}
      maxLength={600}
      showMic
    />
  );
}
