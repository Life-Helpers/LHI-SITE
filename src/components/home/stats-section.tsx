"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useSiteData } from "@/components/site-data-provider";
import { useLocale } from "@/i18n/locale-context";
import { MapPin, Users, Home, Calendar } from "lucide-react";
import { CountUp } from "@/components/home/count-up";

export function StatsSection() {
  const { stats } = useSiteData();
  const { t } = useLocale();

  const statsList = [
    {
      value: stats.statesActive,
      label: t.home.stats.statesActive,
      icon: MapPin,
    },
    {
      value: stats.peopleReached,
      label: t.home.stats.individualsReached,
      icon: Users,
    },
    {
      value: stats.households,
      label: t.home.stats.householdsReached,
      icon: Home,
    },
    {
      value: stats.yearsOfService,
      label: t.home.stats.yearsOfService,
      icon: Calendar,
    },
  ];

  return (
    <section
      aria-labelledby="impact-stats-heading"
      className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
    >
      <h2 id="impact-stats-heading" className="sr-only">Impact Statistics</h2>
      <ScrollReveal>
        <div className="neu-glass grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 rounded-[2rem] p-5 sm:p-8">
          {statsList.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="neu-raised neu-press flex flex-col items-center text-center p-4 rounded-2xl group"
              >
                <div className="neu-inset mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full text-primary group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <CountUp
                  value={stat.value}
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif-display text-foreground tracking-tight"
                />
                <span className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
