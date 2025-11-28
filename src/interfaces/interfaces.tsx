// Datos de moneda de la API
export interface CurrencyData {
  venta: number;
  compra: number;
  moneda: string;
  nombre: string;
  casa: string;
  fechaActualizacion: string;
}

// Props para el componente de última actualización
export interface LastUpdatedProps {
  fullDate: string;
  isLoading?: boolean;
}

// Props para la calculadora
export interface CalculatorProps {
  currencies: CurrencyData[];
  real: CurrencyData | null;
}

// Props para el componente de moneda
export interface CurrencyComponentProps {
  type: string;
  buyValue: number;
  sellValue: number;
  variation?: number;
  isLoading?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onCopy?: (value: number) => void;
}

// Datos históricos
export interface HistoricalData {
  fecha: string;
  casa: string;
  compra: number;
  venta: number;
}

// Configuración de alertas
export interface PriceAlert {
  id: string;
  currency: string;
  targetPrice: number;
  condition: "above" | "below";
  isActive: boolean;
  createdAt: string;
}

// Estado de la aplicación
export interface AppState {
  favorites: string[];
  alerts: PriceAlert[];
  autoRefresh: boolean;
  refreshInterval: number;
  calculatorPinned: boolean;
}

// Props para el gráfico histórico
export interface HistoricalChartProps {
  data: HistoricalData[];
  currency: string;
  isLoading?: boolean;
}

// Props para el skeleton loader
export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

// Props para el toggle de tema
export interface ThemeToggleProps {
  className?: string;
}

// Props para el badge de variación
export interface VariationBadgeProps {
  variation: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

// Props para el botón de copiar
export interface CopyButtonProps {
  value: string | number;
  onCopy?: () => void;
  className?: string;
}

// Respuesta de la API de cotizaciones
export interface CurrenciesResponse {
  dollars: CurrencyData[];
  real: CurrencyData | null;
  euro: CurrencyData | null;
  lastUpdated: string;
}

// Configuración del usuario
export interface UserSettings {
  theme: "light" | "dark" | "system";
  favorites: string[];
  calculatorPinned: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}
