import * as React from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

export interface CheckboxFieldProps
  extends React.ComponentPropsWithoutRef<typeof Checkbox> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
  containerClassName?: string;
}

const CheckboxField = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  CheckboxFieldProps
>(
  (
    { className, label, description, error, containerClassName, id, ...props },
    ref
  ) => {
    const checkboxId = id ?? React.useId();

    return (
      <div className={cn("flex flex-col space-y-1", containerClassName)}>
        <div className="flex items-start space-x-2">
          <div className="pt-1">
            <Checkbox
              ref={ref}
              id={checkboxId}
              className={cn(
                error && "border-destructive focus-visible:ring-destructive/20",
                className
              )}
              aria-invalid={!!error}
              {...props}
            />
          </div>
          {(label || description) && (
            <div className="grid gap-1.5 leading-none">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    "text-sm font-medium cursor-pointer",
                    error && "text-destructive"
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    );
  }
);

CheckboxField.displayName = "CheckboxField";

export { CheckboxField };
