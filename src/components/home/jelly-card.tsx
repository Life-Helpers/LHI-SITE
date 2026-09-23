"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export interface JellyCardProps {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
  tag: string;
  roleNumber: number; // 1 to 6
  roll: "upper" | "lower";
  themeColor: {
    bgLight: string;
    border: string;
    hoverBorder: string;
    glow: string;
    iconBg: string;
    iconText: string;
    badgeBg: string;
    badgeText: string;
  };
}

export function JellyCard({
  label,
  href,
  description,
  icon: Icon,
  tag,
  roleNumber,
  roll,
  themeColor,
}: JellyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Jelly physics spring definition
  const jellySpring = {
    type: "spring" as const,
    stiffness: 420,
    damping: 12,
    mass: 0.8,
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (roleNumber % 3) * 0.08 }}
      className="relative h-full"
    >
      <Link
        href={href}
        aria-label={`${label} - ${description}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="block h-full focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring rounded-3xl"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : isHovered
              ? {
                  scale: 1.035,
                  y: -8,
                  rotate: [-0.5, 1, -0.6, 0.3, 0],
                  borderRadius: ["24px", "30px", "20px", "26px"],
                }
              : {
                  scale: 1,
                  y: 0,
                  rotate: 0,
                  borderRadius: "24px",
                }
          }
          whileTap={
            shouldReduceMotion
              ? {}
              : {
                  scale: 0.94,
                  scaleY: 0.92,
                  scaleX: 1.04,
                  y: 2,
                }
          }
          transition={jellySpring}
          style={{
            transformOrigin: "bottom center",
          }}
          className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border ${themeColor.border} ${themeColor.bgLight} p-6 sm:p-7 backdrop-blur-md transition-all duration-300 ${themeColor.hoverBorder} ${themeColor.glow} shadow-sm hover:shadow-xl`}
        >
          {/* Jelly Specular Gloss Overlay */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, x: "-100%" }}
            animate={isHovered ? { opacity: 0.35, x: "120%" } : { opacity: 0, x: "-100%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/15"
          />

          {/* Jelly Organic Backdrop Orbs */}
          <motion.div
            aria-hidden="true"
            animate={
              shouldReduceMotion
                ? {}
                : isHovered
                ? {
                    scale: [1, 1.25, 1.1],
                    x: [0, 8, -4, 0],
                    y: [0, -6, 4, 0],
                  }
                : { scale: 1, x: 0, y: 0 }
            }
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-xl"
          />

          {/* Card Top: Tag + Roll Index */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-5">
              <motion.span
                animate={isHovered ? { scale: 1.08, rotate: [0, -3, 2, 0] } : { scale: 1, rotate: 0 }}
                transition={jellySpring}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${themeColor.badgeBg} ${themeColor.badgeText} shadow-xs`}
              >
                <Sparkles className="h-3 w-3" />
                {tag}
              </motion.span>

              <span className="text-[11px] font-mono font-medium text-muted-foreground">
                {roll === "upper" ? "ROLL 1" : "ROLL 2"} · 0{roleNumber}
              </span>
            </div>

            {/* Bouncy Jelly Icon */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : isHovered
                  ? {
                      scale: [1, 1.18, 0.95, 1.08],
                      rotate: [0, 6, -5, 0],
                      borderRadius: ["18px", "24px", "14px", "18px"],
                    }
                  : { scale: 1, rotate: 0, borderRadius: "18px" }
              }
              transition={{ type: "spring", stiffness: 450, damping: 11 }}
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${themeColor.iconBg} ${themeColor.iconText} shadow-md mb-4`}
            >
              <Icon className="h-7 w-7 transition-transform duration-300" aria-hidden="true" />
            </motion.div>

            {/* Title & Description */}
            <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
              {label}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Bottom CTA Bar */}
          <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Explore Program
            </span>
            <motion.div
              animate={isHovered ? { x: 5, scale: 1.15 } : { x: 0, scale: 1 }}
              transition={jellySpring}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${themeColor.iconBg} ${themeColor.iconText}`}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
