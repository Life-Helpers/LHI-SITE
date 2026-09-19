import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Program } from "@/types/content";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg">
      {program.image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={program.image}
            alt={program.imageAlt || program.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            referrerPolicy="no-referrer"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-medium drop-shadow-sm">Life Helpers Initiative</span>
            <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground backdrop-blur-sm">
              Fulfillment
            </span>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {program.region}
          </div>
          {program.status === "completed" && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Completed
            </span>
          )}
        </div>
        <CardTitle>{program.name}</CardTitle>
        <CardDescription>{program.summary}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-2xl font-bold text-primary">
          {program.metricValue}
        </p>
        <p className="text-sm text-muted-foreground">{program.metricLabel}</p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/${program.id}`}
          className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Learn more
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
