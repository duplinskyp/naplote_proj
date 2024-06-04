'use client';

import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface CheckboxProps {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  disabled,
  register,
  errors,
}) => {
  return (
    <div className="w-full relative flex items-center">
      <input
        id={id}
        disabled={disabled}
        {...register(id)}
        type="checkbox"
        className={`
          form-checkbox
          w-6
          h-6
          text-blue-600
          border-2
          rounded-md
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
          ${errors[id] ? 'focus:ring-rose-500' : 'focus:ring-blue-300'}
          mr-2
        `}
      />
      <label 
        htmlFor={id}
        className={`
          text-md
          ${errors[id] ? 'text-rose-500' : 'text-zinc-400'}
        `}
      >
        {label}
      </label>
      {errors[id] && (
  <p className="text-rose-500 text-sm mt-2">
    {errors[id]?.message as string} {/* Type assertion */}
  </p>
)}
    </div>
  );
}

export default Checkbox;
