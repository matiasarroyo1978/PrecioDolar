import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CurrencyData } from "../interfaces/interfaces";

const API_URLS = {
  dollars: "https://dolarapi.com/v1/dolares",
  real: "https://dolarapi.com/v1/cotizaciones/brl",
  euro: "https://dolarapi.com/v1/cotizaciones/eur",
  chilean: "https://dolarapi.com/v1/cotizaciones/clp",
  uruguayan: "https://dolarapi.com/v1/cotizaciones/uyu",
  historical: "https://api.argentinadatos.com/v1/cotizaciones/dolares",
};

// Fetch dólares
const fetchDollars = async (): Promise<CurrencyData[]> => {
  const response = await axios.get(API_URLS.dollars);
  // Ordenar para que Blue esté primero
  return response.data.sort((a: CurrencyData, b: CurrencyData) => {
    if (a.nombre === "Blue") return -1;
    if (b.nombre === "Blue") return 1;
    return 0;
  });
};

// Fetch Real Brasileño
const fetchReal = async (): Promise<CurrencyData | null> => {
  try {
    const response = await axios.get(API_URLS.real);
    return response.data;
  } catch {
    return null;
  }
};

// Fetch Euro
const fetchEuro = async (): Promise<CurrencyData | null> => {
  try {
    const response = await axios.get(API_URLS.euro);
    return response.data;
  } catch {
    return null;
  }
};

// Fetch todas las monedas
const fetchAllCurrencies = async () => {
  const [dollars, real, euro] = await Promise.all([
    fetchDollars(),
    fetchReal(),
    fetchEuro(),
  ]);

  // Calcular Real Blue
  let realBlue: CurrencyData | null = null;
  if (real && dollars.length > 0) {
    const dolarBlue = dollars.find((c) => c.nombre === "Blue");
    const dolarOficial = dollars.find((c) => c.nombre === "Oficial");

    if (dolarBlue && dolarOficial) {
      const precioRealBlue =
        (real.compra * dolarBlue.compra) / dolarOficial.compra;
      realBlue = {
        ...real,
        nombre: "Real Blue",
        venta: precioRealBlue,
        compra: precioRealBlue,
      };
    }
  }

  return {
    dollars,
    real: realBlue,
    euro,
    lastUpdated: dollars[0]?.fechaActualizacion || new Date().toISOString(),
  };
};

// Hook principal para obtener todas las cotizaciones
export const useCurrencies = () => {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: fetchAllCurrencies,
    refetchInterval: 60000, // Refrescar cada minuto
    staleTime: 30000, // Considerar datos frescos por 30 segundos
    retry: 3,
  });
};

// Hook para obtener solo dólares
export const useDollars = () => {
  return useQuery({
    queryKey: ["dollars"],
    queryFn: fetchDollars,
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 3,
  });
};

// Tipos para datos históricos
export interface HistoricalData {
  fecha: string;
  casa: string;
  compra: number;
  venta: number;
}

// Tipos de períodos disponibles
export type TimePeriod = "30d" | "6m" | "ytd" | "1y" | "5y" | "all";

export interface TimePeriodOption {
  value: TimePeriod;
  label: string;
  days: number | null; // null para "all" o cálculo dinámico
}

export const TIME_PERIOD_OPTIONS: TimePeriodOption[] = [
  { value: "30d", label: "30 días", days: 30 },
  { value: "6m", label: "6 meses", days: 180 },
  { value: "ytd", label: "YTD", days: null }, // Year to date - calculado dinámicamente
  { value: "1y", label: "1 año", days: 365 },
  { value: "5y", label: "5 años", days: 1825 },
  { value: "all", label: "Todo", days: null },
];

// Calcular días para YTD (desde el 1 de enero del año actual)
const getYTDDays = (): number => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diffTime = Math.abs(now.getTime() - startOfYear.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Fetch datos históricos con período configurable
const fetchHistoricalData = async (
  casa = "blue",
  period: TimePeriod = "30d"
): Promise<HistoricalData[]> => {
  try {
    const response = await axios.get(`${API_URLS.historical}/${casa}`);
    const allData: HistoricalData[] = response.data;

    if (period === "all") {
      return allData;
    }

    let daysToFetch: number;
    if (period === "ytd") {
      daysToFetch = getYTDDays();
    } else {
      const periodOption = TIME_PERIOD_OPTIONS.find((p) => p.value === period);
      daysToFetch = periodOption?.days || 30;
    }

    // Obtener los últimos N días
    return allData.slice(-daysToFetch);
  } catch {
    return [];
  }
};

// Hook para datos históricos con período configurable
export const useHistoricalData = (
  casa = "blue",
  period: TimePeriod = "30d"
) => {
  return useQuery({
    queryKey: ["historical", casa, period],
    queryFn: () => fetchHistoricalData(casa, period),
    staleTime: 300000, // 5 minutos
    retry: 2,
  });
};

// Calcular variación porcentual
export const calculateVariation = (
  current: number,
  previous: number
): number => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Formatear precio
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Formatear fecha
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
