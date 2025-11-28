import { motion } from "framer-motion";
import { DollarSign, Calculator, TrendingUp, Bell } from "lucide-react";
import { cn } from "../../utils/cn";

export type TabType = "currencies" | "calculator" | "chart" | "alerts";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "currencies" as TabType, label: "Cotizaciones", icon: DollarSign },
  { id: "calculator" as TabType, label: "Calculadora", icon: Calculator },
  { id: "chart" as TabType, label: "Histórico", icon: TrendingUp },
  { id: "alerts" as TabType, label: "Alertas", icon: Bell },
];

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-var(--bg-card) border border-var(--border-color)">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg",
              "text-xs font-medium transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-var(--accent-primary) focus:ring-offset-1",
              isActive
                ? "text-white"
                : "text-var(--text-muted) hover:text-var(--text-primary)"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-600 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
