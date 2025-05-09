"use client";

import * as React from "react";
import { cn } from "../../lib/utils"; 

const ProgressPrimitive = {
  Root: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: number }>(
    function Root({ className, value, ...props }, ref) {
      return <div ref={ref} className={className} {...props} />;
    }
  ),
  Indicator: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }>(
    function Indicator({ className, style, ...props }, ref) {
      return <div ref={ref} className={className} style={style} {...props} />;
    }
  )
};

ProgressPrimitive.Root.displayName = "Progress";
ProgressPrimitive.Indicator.displayName = "ProgressIndicator";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };