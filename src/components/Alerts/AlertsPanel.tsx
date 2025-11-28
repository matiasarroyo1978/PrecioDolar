import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  Trash2,
  BellOff,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { PriceAlert } from "../../interfaces/interfaces";
import { formatPrice } from "../../hooks/useCurrencies";

interface AlertsPanelProps {
  currentPrices: Record<string, number>;
}

const CURRENCY_OPTIONS = [
  { value: "Blue", label: "Dólar Blue" },
  { value: "Oficial", label: "Dólar Oficial" },
  { value: "MEP", label: "Dólar MEP" },
  { value: "CCL", label: "Dólar CCL" },
];

export const AlertsPanel = ({ currentPrices }: AlertsPanelProps) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem("preciodolar-alerts");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCreating, setIsCreating] = useState(false);
  const [newAlert, setNewAlert] = useState({
    currency: "Blue",
    targetPrice: "",
    condition: "above" as "above" | "below",
  });

  // Guardar alertas en localStorage
  const saveAlerts = (newAlerts: PriceAlert[]) => {
    setAlerts(newAlerts);
    localStorage.setItem("preciodolar-alerts", JSON.stringify(newAlerts));
  };

  // Crear nueva alerta
  const handleCreateAlert = () => {
    if (!newAlert.targetPrice) return;

    const alert: PriceAlert = {
      id: Date.now().toString(),
      currency: newAlert.currency,
      targetPrice: parseFloat(newAlert.targetPrice),
      condition: newAlert.condition,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    saveAlerts([...alerts, alert]);
    setNewAlert({ currency: "Blue", targetPrice: "", condition: "above" });
    setIsCreating(false);

    // Solicitar permiso de notificaciones
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  // Eliminar alerta
  const handleDeleteAlert = (id: string) => {
    saveAlerts(alerts.filter((a) => a.id !== id));
  };

  // Toggle alerta activa/inactiva
  const handleToggleAlert = (id: string) => {
    saveAlerts(
      alerts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  // Verificar si una alerta se ha disparado
  const isAlertTriggered = (alert: PriceAlert) => {
    const currentPrice = currentPrices[alert.currency];
    if (!currentPrice) return false;

    if (alert.condition === "above") {
      return currentPrice >= alert.targetPrice;
    } else {
      return currentPrice <= alert.targetPrice;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-linear-to-br from-amber-500 to-orange-600">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-var(--text-primary)">
              Alertas de Precio
            </h2>
            <p className="text-xs text-var(--text-muted)">
              Recibí notificaciones cuando el precio llegue a tu objetivo
            </p>
          </div>
        </div>
      </div>

      {/* Botón crear alerta */}
      {!isCreating && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreating(true)}
          className={cn(
            "w-full p-3 rounded-xl flex items-center justify-center gap-2",
            "bg-var(--bg-card) border-2 border-dashed border-var(--border-color)",
            "hover:border-var(--accent-primary) hover:bg-var(--bg-card-hover)",
            "text-var(--text-muted) hover:text-var(--accent-primary)",
            "transition-all duration-200"
          )}
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Crear nueva alerta</span>
        </motion.button>
      )}

      {/* Formulario de nueva alerta */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-var(--bg-card) border border-var(--border-color) space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-var(--text-primary)">
                  Nueva Alerta
                </h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-1 rounded-lg hover:bg-var(--bg-primary) text-var(--text-muted)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Selector de moneda */}
              <div>
                <label className="text-xs text-var(--text-muted) mb-1 block">
                  Moneda
                </label>
                <select
                  value={newAlert.currency}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, currency: e.target.value })
                  }
                  className="select-modern w-full"
                >
                  {CURRENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condición */}
              <div>
                <label className="text-xs text-var(--text-muted) mb-1 block">
                  Condición
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setNewAlert({ ...newAlert, condition: "above" })
                    }
                    className={cn(
                      "flex-1 p-2 rounded-xl flex items-center justify-center gap-2",
                      "border transition-all duration-200",
                      newAlert.condition === "above"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                        : "bg-var(--bg-primary) border-var(--border-color) text-var(--text-muted)"
                    )}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Sube a</span>
                  </button>
                  <button
                    onClick={() =>
                      setNewAlert({ ...newAlert, condition: "below" })
                    }
                    className={cn(
                      "flex-1 p-2 rounded-xl flex items-center justify-center gap-2",
                      "border transition-all duration-200",
                      newAlert.condition === "below"
                        ? "bg-red-500/10 border-red-500 text-red-500"
                        : "bg-var(--bg-primary) border-var(--border-color) text-var(--text-muted)"
                    )}
                  >
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">Baja a</span>
                  </button>
                </div>
              </div>

              {/* Precio objetivo */}
              <div>
                <label className="text-xs text-var(--text-muted) mb-1 block">
                  Precio objetivo
                </label>
                <input
                  type="number"
                  value={newAlert.targetPrice}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, targetPrice: e.target.value })
                  }
                  placeholder="Ej: 1200"
                  className="input-modern"
                />
                {currentPrices[newAlert.currency] && (
                  <p className="text-xs text-var(--text-muted) mt-1">
                    Precio actual:{" "}
                    {formatPrice(currentPrices[newAlert.currency])}
                  </p>
                )}
              </div>

              {/* Botón crear */}
              <button
                onClick={handleCreateAlert}
                disabled={!newAlert.targetPrice}
                className="btn-primary w-full"
              >
                Crear Alerta
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de alertas */}
      <div className="space-y-2">
        <AnimatePresence>
          {alerts.map((alert) => {
            const triggered = isAlertTriggered(alert);

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  "p-3 rounded-xl border transition-all duration-200",
                  triggered
                    ? "bg-emerald-500/10 border-emerald-500"
                    : "bg-var(--bg-card) border-var(--border-color)",
                  !alert.isActive && "opacity-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        alert.condition === "above"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {alert.condition === "above" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-var(--text-primary) text-sm">
                        {alert.currency}{" "}
                        {alert.condition === "above" ? "↑" : "↓"}{" "}
                        {formatPrice(alert.targetPrice)}
                      </p>
                      <p className="text-xs text-var(--text-muted)">
                        {triggered ? "¡Alerta activada!" : "Esperando..."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleAlert(alert.id)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        "hover:bg-var(--bg-primary)",
                        alert.isActive
                          ? "text-var(--accent-primary)"
                          : "text-var(--text-muted)"
                      )}
                    >
                      {alert.isActive ? (
                        <Bell className="w-4 h-4" />
                      ) : (
                        <BellOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-var(--text-muted) hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {alerts.length === 0 && !isCreating && (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 mx-auto text-var(--text-muted) opacity-30 mb-2" />
            <p className="text-sm text-var(--text-muted)">
              No tenés alertas configuradas
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
