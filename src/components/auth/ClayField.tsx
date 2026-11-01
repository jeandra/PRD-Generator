"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type ClayFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> & {
  icon: ReactNode;
  label: string;
  type?: string;
  toggle?: boolean;
};

export default function ClayField({
  icon,
  label,
  type = "text",
  toggle = false,
  ...props
}: ClayFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputType = toggle ? (visible ? "text" : "password") : type;

  return (
    <div className="clay-field">
      <span className="clay-field-icon" aria-hidden="true">
        {icon}
      </span>
      <label className="sr-only" htmlFor={props.id}>
        {label}
      </label>
      <input {...props} id={props.id} type={inputType} />
      {toggle ? (
        <button
          type="button"
          className="clay-eye"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
        >
          {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      ) : null}
    </div>
  );
}
