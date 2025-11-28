import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator as CalculatorIcon,
  ArrowRightLeft,
  Trash2,
  ChevronDown,
} from "lucide-react";
import CurrencyInput from "react-currency-input-field";
import { CurrencyData } from "../../interfaces/interfaces";
import { cn } from "../../utils/cn";
import { formatPrice } from "../../hooks/useCurrencies";

interface CalculatorProps {
  currencies: CurrencyData[];
  real: CurrencyData | null;
}

export const Calculator = ({ currencies, real }: CalculatorProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyData | null>(
    null
  );
  const [amount, setAmount] = useState<string>("");
  const [isReversed, setIsReversed] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Combinar monedas disponibles - memoizado para evitar recreación en cada render
  const allCurrencies = useMemo(
    () => [...currencies, ...(real ? [real] : [])],
    [currencies, real]
  );

  // Seleccionar Blue por defecto
  useEffect(() => {
    if (allCurrencies.length > 0 && !selectedCurrency) {
      const blue = allCurrencies.find((c) => c.nombre === "Blue");
      setSelectedCurrency(blue || allCurrencies[0]);
    }
  }, [allCurrencies, selectedCurrency]);

  // Limpiar al cambiar moneda
  useEffect(() => {
    setAmount("");
  }, [selectedCurrency]);

  // Calcular resultado
  const calculateResult = () => {
    if (!selectedCurrency || !amount) return 0;
    const numAmount = parseFloat(amount.replace(/[^0-9.-]/g, ""));
    if (isNaN(numAmount)) return 0;

    if (isReversed) {
      // ARS a USD/BRL
      return numAmount / selectedCurrency.venta;
    } else {
      // USD/BRL a ARS
      return numAmount * selectedCurrency.venta;
    }
  };

  const result = calculateResult();
  const isRealBlue = selectedCurrency?.nombre === "Real Blue";
  const currencySymbol = isRealBlue ? "BRL" : "USD";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600">
          <CalculatorIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-var(--text-primary)">Calculadora</h2>
          <p className="text-xs text-var(--text-muted)">
            Convertí monedas al instante
          </p>
        </div>
      </div>

      {/* Selector de moneda */}
      <div className="relative">
        <button
          onClick={() => setIsSelectOpen(!isSelectOpen)}
          className={cn(
            "w-full p-3 rounded-xl flex items-center justify-between",
            "bg-var(--bg-card) border border-var(--border-color)",
            "hover:border-var(--accent-primary) transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-var(--accent-primary)"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{isRealBlue ? "🇧🇷" : "💵"}</span>
            <div className="text-left">
              <span className="font-medium text-var(--text-primary)">
                {selectedCurrency?.nombre || "Seleccionar"}
              </span>
              {selectedCurrency && (
                <p className="text-xs text-var(--text-muted)">
                  1 {currencySymbol} ={" "}
                  {formatPrice(Math.round(selectedCurrency.venta))}
                </p>
              )}
            </div>
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-var(--text-muted) transition-transform",
              isSelectOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isSelectOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "absolute z-50 w-full mt-2 py-2 rounded-xl",
                "bg-var(--bg-secondary) border border-var(--border-color)",
                "shadow-lg max-h-60 overflow-y-auto"
              )}
            >
              {allCurrencies.map((currency) => (
                <button
                  key={currency.nombre}
                  onClick={() => {
                    setSelectedCurrency(currency);
                    setIsSelectOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2 flex items-center gap-3 text-left",
                    "hover:bg-var(--bg-card) transition-colors",
                    selectedCurrency?.nombre === currency.nombre &&
                      "bg-var(--bg-card)"
                  )}
                >
                  <span>{currency.nombre === "Real Blue" ? "🇧🇷" : "💵"}</span>
                  <div>
                    <span className="font-medium text-var(--text-primary)">
                      {currency.nombre}
                    </span>
                    <p className="text-xs text-var(--text-muted)">
                      {formatPrice(Math.round(currency.venta))}
                    </p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Inputs de conversión */}
      <div className="space-y-3">
        {/* Input origen */}
        <div
          className={cn(
            "p-4 rounded-xl",
            "bg-var(--bg-card) border border-var(--border-color)",
            "focus-within:border-var(--accent-primary) transition-colors"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-var(--text-muted)">
              {isReversed ? "Pesos Argentinos" : currencySymbol}
            </span>
            <AnimatePresence>
              {amount && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => setAmount("")}
                  className="p-1 rounded-lg hover:bg-red-500/10 text-var(--text-muted) hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <CurrencyInput
            className={cn(
              "w-full bg-transparent text-2xl font-bold",
              "text-var(--text-primary) placeholder:text-var(--text-muted)",
              "focus:outline-none"
            )}
            placeholder="0"
            prefix={isReversed ? "$ " : `${currencySymbol} `}
            decimalsLimit={2}
            groupSeparator="."
            decimalSeparator=","
            value={amount}
            onValueChange={(value) => setAmount(value || "")}
            autoFocus
          />
        </div>

        {/* Botón de intercambio */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsReversed(!isReversed)}
            className={cn(
              "p-3 rounded-full",
              "bg-linear-to-br from-emerald-500 to-teal-600",
              "text-white shadow-lg shadow-emerald-500/25",
              "hover:shadow-xl hover:shadow-emerald-500/30 transition-shadow"
            )}
          >
            <ArrowRightLeft className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Output resultado */}
        <div
          className={cn(
            "p-4 rounded-xl",
            "bg-linear-to-br from-emerald-500/10 to-teal-500/10",
            "border border-emerald-500/20"
          )}
        >
          <span className="text-xs font-medium text-var(--text-muted)">
            {isReversed ? currencySymbol : "Pesos Argentinos"}
          </span>
          <motion.div
            key={result}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-emerald-500 mt-1"
          >
            {isReversed
              ? `${currencySymbol} ${result.toFixed(2)}`
              : formatPrice(Math.round(result))}
          </motion.div>
        </div>
      </div>

      {/* Info adicional */}
      {selectedCurrency && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-var(--bg-card) border border-var(--border-color)"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-var(--text-muted)">Cotización actual</span>
            <div className="text-right">
              <p className="font-medium text-var(--text-primary)">
                Venta: {formatPrice(Math.round(selectedCurrency.venta))}
              </p>
              <p className="text-xs text-var(--text-muted)">
                Compra: {formatPrice(Math.round(selectedCurrency.compra))}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
