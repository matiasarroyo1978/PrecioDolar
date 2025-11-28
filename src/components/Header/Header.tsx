import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { cn } from "../../utils/cn";
import logo from "../../assets/logo.png";

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header = ({ onRefresh, isRefreshing }: HeaderProps) => {
  return (
    <header className="relative w-full">
      {/* Barra superior con lineare */}
      <div className="h-1 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-500" />

      {/* Contenido del header */}
      <div className="flex items-center justify-between px-4 py-3 bg-var(--bg-secondary) border-b border-var(--border-color)">
        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <motion.img
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            src={logo}
            alt="PrecioDolar Logo"
            className="w-8 h-8 drop-shadow-lg"
            draggable={false}
          />
          <div className="flex flex-col">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-bold text-var(--text-primary) tracking-tight"
            >
              PrecioDolar
            </motion.h1>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-var(--text-muted)"
            >
              Cotización en tiempo real
            </motion.span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          {/* Botón de refrescar */}
          {onRefresh && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={isRefreshing}
              className={cn(
                "p-2 rounded-xl transition-all duration-300",
                "bg-var(--bg-card) border border-var(--border-color)",
                "hover:border-var(--accent-primary) hover:shadow-lg",
                "focus:outline-none focus:ring-2 focus:ring-var(--accent-primary)",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Actualizar cotizaciones"
            >
              <RefreshCw
                className={cn(
                  "w-5 h-5 text-var(--text-secondary)",
                  isRefreshing && "animate-spin"
                )}
              />
            </motion.button>
          )}

          {/* Toggle de tema */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
