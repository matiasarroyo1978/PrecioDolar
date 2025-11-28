import { useState, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { useCurrencies, formatDate } from "./hooks/useCurrencies";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { CurrencyCard } from "./components/CurrencyCard/CurrencyCard";
import { Calculator } from "./components/Calculator/Calculator";
import { HistoricalChart } from "./components/HistoricalChart/HistoricalChart";
import { AlertsPanel } from "./components/Alerts/AlertsPanel";
import { LastUpdated } from "./components/LastUpdated/LastUpdated";
import { TabNavigation, TabType } from "./components/Navigation/TabNavigation";
import { CurrencySkeleton } from "./components/ui/Skeleton";
import "./index.css";

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

// Componente principal de la aplicación
const AppContent = () => {
  const [activeTab, setActiveTab] = useState<TabType>("currencies");
  const { data, isLoading, isRefetching, refetch } = useCurrencies();

  // Formatear fecha de actualización
  const formattedDate = useMemo(() => {
    if (!data?.lastUpdated) return "";
    return formatDate(data.lastUpdated);
  }, [data?.lastUpdated]);

  // Obtener precios actuales para alertas
  const currentPrices = useMemo(() => {
    if (!data?.dollars) return {};
    const prices: Record<string, number> = {};
    data.dollars.forEach((d) => {
      prices[d.nombre] = d.venta;
    });
    return prices;
  }, [data?.dollars]);

  // Renderizar contenido según tab activo
  const renderContent = () => {
    switch (activeTab) {
      case "currencies":
        return (
          <motion.div
            key="currencies"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {/* Grid de monedas */}
            <div className="grid grid-cols-2 gap-3">
              {isLoading ? (
                // Skeletons mientras carga
                <>
                  {[...Array(6)].map((_, i) => (
                    <CurrencySkeleton key={i} />
                  ))}
                </>
              ) : (
                // Tarjetas de monedas
                <>
                  {data?.dollars.map((currency, index) => (
                    <CurrencyCard
                      key={currency.nombre}
                      type={
                        currency.nombre === "Contado con liquidación"
                          ? "CCL"
                          : currency.nombre
                      }
                      buyValue={currency.compra}
                      sellValue={currency.venta}
                      delay={index}
                    />
                  ))}
                  {data?.real && (
                    <CurrencyCard
                      type="Real Blue"
                      buyValue={data.real.compra}
                      sellValue={data.real.venta}
                      delay={data.dollars.length}
                    />
                  )}
                </>
              )}
            </div>

            {/* Última actualización */}
            <LastUpdated
              fullDate={formattedDate}
              isLoading={isLoading}
              onRefresh={() => refetch()}
            />
          </motion.div>
        );

      case "calculator":
        return (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Calculator
              currencies={data?.dollars || []}
              real={data?.real || null}
            />
          </motion.div>
        );

      case "chart":
        return (
          <motion.div
            key="chart"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <HistoricalChart />
          </motion.div>
        );

      case "alerts":
        return (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <AlertsPanel currentPrices={currentPrices} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="extension-wrapper flex flex-col min-h-screen">
      {/* Header */}
      <Header onRefresh={() => refetch()} isRefreshing={isRefetching} />

      {/* Contenido principal */}
      <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Navegación por tabs */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Contenido dinámico */}
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// App con providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
