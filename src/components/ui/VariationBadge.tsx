import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface VariationBadgeProps {
  variation: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export const VariationBadge = ({
  variation,
  showIcon = true,
  size = "sm",
}: VariationBadgeProps) => {
  const isPositive = variation > 0;
  const isNegative = variation < 0;
  const isNeutral = variation === 0;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold",
        sizeClasses[size],
        {
          "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20":
            isPositive,
          "bg-red-500/10 text-red-500 dark:bg-red-500/20": isNegative,
          "bg-gray-500/10 text-gray-500 dark:bg-gray-500/20": isNeutral,
        }
      )}
    >
      {showIcon && (
        <>
          {isPositive && <TrendingUp className={iconSizes[size]} />}
          {isNegative && <TrendingDown className={iconSizes[size]} />}
          {isNeutral && <Minus className={iconSizes[size]} />}
        </>
      )}
      <span>
        {isPositive && "+"}
        {variation.toFixed(2)}%
      </span>
    </motion.span>
  );
};
