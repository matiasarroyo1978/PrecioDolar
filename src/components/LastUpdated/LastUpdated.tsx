import { motion } from "framer-motion";
import { Clock, RefreshCw } from "lucide-react";
import { cn } from "../../utils/cn";

interface LastUpdatedProps {
  fullDate: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const LastUpdated = ({
  fullDate,
  isLoading,
  onRefresh,
}: LastUpdatedProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex items-center justify-between w-full px-3 py-2 rounded-xl",
        "bg-var(--bg-card)/50 border border-var(--border-color)"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <Clock className="w-4 h-4 text-var(--text-muted)" />
          {/* Indicador de actualización en vivo */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-var(--text-muted)">
            Última actualización
          </span>
          {isLoading ? (
            <div className="h-3 w-24 bg-var(--bg-card) rounded animate-pulse" />
          ) : (
            <motion.span
              key={fullDate}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-medium text-var(--text-primary)"
            >
              {fullDate || "Cargando..."}
            </motion.span>
          )}
        </div>
      </div>

      {onRefresh && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          disabled={isLoading}
          className={cn(
            "p-1.5 rounded-lg transition-all duration-200",
            "hover:bg-var(--bg-card) text-var(--text-muted)",
            "hover:text-var(--accent-primary)",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label="Actualizar"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </motion.button>
      )}
    </motion.div>
  );
};
