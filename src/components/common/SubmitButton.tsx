import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  text?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "submit" | "button";
}

export const SubmitButton = ({
  className = "",
  size = "default",
  text = "",
  isLoading = false,
  disabled = false,
  onClick,
  type = "submit",
}: SubmitButtonProps) => {
  return (
    <Button
      type={onClick ? "button" : type}
      size={size}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`${className} cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 ${
        isLoading ? "pointer-events-none opacity-70" : ""
      }`}
    >
      {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
      {text}
    </Button>
  );
};
