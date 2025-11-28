import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Coffee, Mail, Heart } from "lucide-react";
import { cn } from "../../utils/cn";

const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/matiasarroyo1978/PrecioDolar",
    label: "GitHub",
    tooltip: "Dejale una ⭐ al repo",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/matias-arroyo19/",
    label: "LinkedIn",
    tooltip: "Conectemos en LinkedIn",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/arroyomatias19",
    label: "Twitter",
    tooltip: "Seguime en Twitter",
  },
  {
    icon: Coffee,
    href: "https://cafecito.app/matt_arr",
    label: "Cafecito",
    tooltip: "Invitame un cafecito ☕",
  },
  {
    icon: Mail,
    href: "mailto:arroyomatias19@gmail.com",
    label: "Email",
    tooltip: "Enviame un email",
  },
];

export const Footer = () => {
  return (
    <footer className="w-full mt-auto">
      {/* Divider con lineare */}
      <div className="h-px bg-linear-to-r from-transparent via-var(--border-color) to-transparent" />

      <div className="px-4 py-4 bg-var(--bg-secondary)">
        {/* Créditos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3"
        >
          <p className="text-xs text-var(--text-muted) flex items-center justify-center gap-1">
            Desarrollado con
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            por
            <a
              href="https://github.com/matiasarroyo1978"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-var(--text-primary) hover:text-var(--accent-primary) transition-colors"
            >
              Matias Arroyo
            </a>
          </p>
        </motion.div>

        {/* Links sociales */}
        <div className="flex items-center justify-center gap-2">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-2 rounded-xl transition-all duration-200",
                "bg-var(--bg-card) border border-var(--border-color)",
                "hover:border-var(--accent-primary) hover:shadow-lg",
                "text-var(--text-muted) hover:text-var(--accent-primary)",
                "group relative"
              )}
              aria-label={link.label}
              title={link.tooltip}
            >
              <link.icon className="w-4 h-4" />
            </motion.a>
          ))}
        </div>

        {/* Fuente de datos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-center"
        >
          <p className="text-[10px] text-var(--text-muted)">
            Datos de{" "}
            <a
              href="https://dolarapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-var(--accent-primary) hover:underline"
            >
              DolarAPI
            </a>{" "}
            • Fuente:{" "}
            <a
              href="https://dolarhoy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-var(--accent-primary) hover:underline"
            >
              dolarhoy.com
            </a>
          </p>
        </motion.div>

        {/* Versión */}
        <div className="mt-2 text-center">
          <span className="text-[10px] text-var(--text-muted) opacity-50">
            v2.0.0
          </span>
        </div>
      </div>
    </footer>
  );
};
