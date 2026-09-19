"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  FileText,
  HeartHandshake,
  LogOut,
  MapPin,
  Shield,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { emergencies } from "@/data/emergencies";
import { programs } from "@/data/programs";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string>("admin@lhinigeria.org");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = sessionStorage.getItem("lhi_admin_user");
      if (user) {
        setCurrentUser(user);
      }
      setIsLoaded(true);
    }
  }, [router]);

  function handleSignOut() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("lhi_admin_authenticated");
      sessionStorage.removeItem("lhi_admin_user");
    }
    router.push("/admin/login");
  }

  if (!isLoaded) {
    return (
      <main className="flex flex-1 items-center justify-center py-20 text-muted-foreground">
        Loading admin console…
      </main>
    );
  }

  const activeEmergencies = emergencies.filter((e) => e.status === "active");

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Top bar */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                Staff Administration
              </span>
              <span className="text-xs text-muted-foreground">
                Signed in as <strong className="text-foreground">{currentUser}</strong>
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {siteConfig.name} Portal Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Coordination center for humanitarian field interventions across 11 states.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Public Site
              </Link>
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Emergencies
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-alert" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {activeEmergencies.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Borno & North-West field responses active
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Field Programs
              </CardTitle>
              <HeartHandshake className="h-4 w-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {programs.length} Sectors
              </div>
              <p className="text-xs text-muted-foreground">
                Health, Education, Food Security, Protection
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Beneficiaries Reached
              </CardTitle>
              <Users className="h-4 w-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1.5M+</div>
              <p className="text-xs text-muted-foreground">
                Across 11 operational state offices
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Online Giving Gateway
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Active</div>
              <p className="text-xs text-muted-foreground">
                Stripe payment intents processing smoothly
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action sections */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Active Field Emergency Status */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Active Crisis Responses</CardTitle>
                <Link
                  href="/emergencies"
                  className="text-xs text-primary hover:underline"
                >
                  View public register →
                </Link>
              </div>
              <CardDescription>
                Emergency declarations actively mobilizing relief supplies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeEmergencies.map((em) => (
                <div
                  key={em.id}
                  className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{em.title}</span>
                    <span className="rounded-full bg-alert/20 px-2 py-0.5 text-xs font-semibold text-alert">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {em.region} • Declared {em.declaredAt}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {em.summary}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Management Shortcuts */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Administrative Tools</CardTitle>
              <CardDescription>
                Shortcuts for site governance, accountability & reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Impact & Audit Reports</p>
                    <p className="text-xs text-muted-foreground">Review published audited reports</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/impact">View Reports</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Field Interventions Log</p>
                    <p className="text-xs text-muted-foreground">Track project delivery milestones</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/interventions/projectandintervention">Interventions</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Volunteer & Partner Submissions</p>
                    <p className="text-xs text-muted-foreground">Manage volunteer applications</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/get-involved">Get Involved</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">PSEA & Safeguarding Desk</p>
                    <p className="text-xs text-muted-foreground">Zero tolerance policy enforcement</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/our-commitment">Standards</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
