import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
}: FormInputProps) => {
  const [show, setShow] = useState(false);
  const isPassword =
    type === "password" || name?.toLowerCase().includes("password");
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="font-inter font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          type={isPassword ? (show ? "text" : "password") : type}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          className={cn("bg-input-background border-border pr-12", {
            "opacity-50 cursor-not-allowed": disabled,
          })}
          {...register(name, validation)}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {show ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;
