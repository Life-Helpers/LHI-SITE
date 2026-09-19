import Link from "next/link";
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
    <Card className="flex flex-col">
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
          className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Learn more
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
