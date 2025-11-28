import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { CopyButton } from "../ui/CopyButton";
import { VariationBadge } from "../ui/VariationBadge";
import { CurrencySkeleton } from "../ui/Skeleton";
import { cn } from "../../utils/cn";
import { formatPrice } from "../../hooks/useCurrencies";

interface CurrencyCardProps {
  type: string;
  buyValue: number;
  sellValue: number;
  variation?: number;
  isLoading?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  delay?: number;
}

export const CurrencyCard = ({
  type,
  buyValue,
  sellValue,
  variation,
  isLoading,
  isFavorite,
  onToggleFavorite,
  delay = 0,
}: CurrencyCardProps) => {
  if (isLoading) {
    return <CurrencySkeleton />;
  }

  // Determinar el icono y color según el tipo
  const getTypeConfig = (type: string) => {
    const configs: Record<
      string,
      { label: string; color: string; icon: string }
    > = {
      Blue: {
        label: "Dólar Blue",
        color: "from-blue-500 to-blue-600",
        icon: "💵",
      },
      Oficial: {
        label: "Dólar Oficial",
        color: "from-emerald-500 to-emerald-600",
        icon: "🏛️",
      },
      MEP: {
        label: "Dólar MEP",
        color: "from-purple-500 to-purple-600",
        icon: "📊",
      },
      CCL: {
        label: "Dólar CCL",
        color: "from-orange-500 to-orange-600",
        icon: "🌐",
      },
      Tarjeta: {
        label: "Dólar Tarjeta",
        color: "from-pink-500 to-pink-600",
        icon: "💳",
      },
      Mayorista: {
        label: "Dólar Mayorista",
        color: "from-cyan-500 to-cyan-600",
        icon: "🏭",
      },
      Cripto: {
        label: "Dólar Cripto",
        color: "from-yellow-500 to-yellow-600",
        icon: "₿",
      },
      "Real Blue": {
        label: "Real Blue",
        color: "from-green-500 to-green-600",
        icon: "🇧🇷",
      },
    };
    return (
      configs[type] || {
        label: `Dólar ${type}`,
        color: "from-gray-500 to-gray-600",
        icon: "💰",
      }
    );
  };

  const config = getTypeConfig(type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="currency-card group"
    >
      {/* Barra de color superior */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          config.color
        )}
      />

      {/* Header de la tarjeta */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <h3 className="font-semibold text-var(--text-primary) text-sm">
            {config.label}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          {variation !== undefined && (
            <VariationBadge variation={variation} size="sm" />
          )}

          {onToggleFavorite && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleFavorite}
              className="p-1 rounded-lg hover:bg-var(--bg-card) transition-colors"
              aria-label={
                isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
              }
            >
              <Star
                className={cn(
                  "w-4 h-4 transition-colors",
                  isFavorite
                    ? "fill-amber-400 text-amber-400"
                    : "text-var(--text-muted) hover:text-amber-400"
                )}
              />
            </motion.button>
          )}
        </div>
      </div>

      {/* Valores */}
      <div className="space-y-2">
        {/* Venta */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-var(--bg-primary)/50">
          <span className="text-xs text-var(--text-muted) font-medium">
            Venta
          </span>
          <div className="flex items-center gap-1">
            <motion.span
              key={sellValue}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-var(--text-primary)"
            >
              {formatPrice(Math.round(sellValue))}
            </motion.span>
            <CopyButton value={Math.round(sellValue)} />
          </div>
        </div>

        {/* Compra */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-var(--bg-primary)/50">
          <span className="text-xs text-var(--text-muted) font-medium">
            Compra
          </span>
          <div className="flex items-center gap-1">
            <motion.span
              key={buyValue}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-var(--text-primary)"
            >
              {formatPrice(Math.round(buyValue))}
            </motion.span>
            <CopyButton value={Math.round(buyValue)} />
          </div>
        </div>
      </div>

      {/* Spread indicator */}
      {buyValue > 0 && sellValue > 0 && (
        <div className="mt-3 pt-2 border-t border-var(--border-color)">
          <div className="flex items-center justify-between text-xs">
            <span className="text-var(--text-muted)">Spread</span>
            <span className="text-var(--text-secondary) font-medium">
              {(((sellValue - buyValue) / buyValue) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
