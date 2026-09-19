import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Emergency } from "@/types/content";

export function EmergencyCard({ emergency }: { emergency: Emergency }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {emergency.region}
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              emergency.status === "active"
                ? "bg-alert text-alert-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {emergency.status === "active" ? "Active" : "Resolved"}
          </span>
        </div>
        <CardTitle>{emergency.title}</CardTitle>
        <CardDescription>{emergency.summary}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-sm text-muted-foreground">
          Declared {emergency.declaredAt}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/emergencies/${emergency.id}`}
          className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          View response
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
