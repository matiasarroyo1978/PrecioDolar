import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { useHistoricalData, HistoricalData } from "../../hooks/useCurrencies";
import { ChartSkeleton } from "../ui/Skeleton";
import { cn } from "../../utils/cn";

interface HistoricalChartProps {
  defaultCurrency?: string;
}

const CURRENCY_OPTIONS = [
  { value: "blue", label: "Dólar Blue" },
  { value: "oficial", label: "Dólar Oficial" },
  { value: "bolsa", label: "Dólar MEP" },
  { value: "contadoconliqui", label: "Dólar CCL" },
  { value: "tarjeta", label: "Dólar Tarjeta" },
];

export const HistoricalChart = ({
  defaultCurrency = "blue",
}: HistoricalChartProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const { data, isLoading, error } = useHistoricalData(selectedCurrency);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="glass-card p-4 text-center">
        <p className="text-var(--text-muted)">
          No hay datos históricos disponibles
        </p>
      </div>
    );
  }

  // Formatear datos para el gráfico
  const chartData = data.map((item: HistoricalData) => ({
    fecha: new Date(item.fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
    }),
    venta: item.venta,
    compra: item.compra,
  }));

  // Calcular variación
  const firstValue = data[0]?.venta || 0;
  const lastValue = data[data.length - 1]?.venta || 0;
  const variation =
    firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  const isPositive = variation >= 0;

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-var(--bg-secondary) border border-var(--border-color) rounded-lg p-3 shadow-lg">
          <p className="text-xs text-var(--text-muted) mb-1">{label}</p>
          <p className="font-bold text-var(--text-primary)">
            ${payload[0].value.toLocaleString("es-AR")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-var(--text-primary) text-sm">
              Histórico
            </h3>
            <p className="text-xs text-var(--text-muted)">Últimos 30 días</p>
          </div>
        </div>

        {/* Selector de moneda */}
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="select-modern text-xs py-1.5 px-3"
        >
          {CURRENCY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-xl bg-var(--bg-primary)/50 text-center">
          <p className="text-xs text-var(--text-muted)">Mínimo</p>
          <p className="font-bold text-var(--text-primary) text-sm">
            ${Math.min(...data.map((d) => d.venta)).toLocaleString("es-AR")}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-var(--bg-primary)/50 text-center">
          <p className="text-xs text-var(--text-muted)">Máximo</p>
          <p className="font-bold text-var(--text-primary) text-sm">
            ${Math.max(...data.map((d) => d.venta)).toLocaleString("es-AR")}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-var(--bg-primary)/50 text-center">
          <p className="text-xs text-var(--text-muted)">Variación</p>
          <p
            className={cn(
              "font-bold text-sm",
              isPositive ? "text-emerald-500" : "text-red-500"
            )}
          >
            {isPositive ? "+" : ""}
            {variation.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorVenta" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#10b981" : "#ef4444"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#10b981" : "#ef4444"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="fecha"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              interval="preserveStartEnd"
            />
            <YAxis hide domain={["dataMin - 50", "dataMax + 50"]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="venta"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVenta)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer con fecha */}
      <div className="flex items-center justify-center gap-1 text-xs text-var(--text-muted)">
        <Calendar className="w-3 h-3" />
        <span>
          {new Date(data[0]?.fecha).toLocaleDateString("es-AR")} -{" "}
          {new Date(data[data.length - 1]?.fecha).toLocaleDateString("es-AR")}
        </span>
      </div>
    </motion.div>
  );
};
