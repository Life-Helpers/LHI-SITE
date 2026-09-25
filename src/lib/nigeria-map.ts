"use client";

import { useEffect, useState } from "react";

export interface MapLocation {
  id: string;
  name: string;
  path: string;
}

/** The @svg-maps/nigeria viewBox, known up front so maps keep their shape while the outlines load. */
export const NIGERIA_VIEWBOX = "0 0 744 600";
export const NIGERIA_VB_W = 744;
export const NIGERIA_VB_H = 600;

let cached: MapLocation[] | null = null;
let loading: Promise<MapLocation[]> | null = null;

function loadLocations() {
  loading ??= import("@svg-maps/nigeria").then((m) => {
    cached = (m.default as { locations: MapLocation[] }).locations;
    return cached;
  });
  return loading;
}

/**
 * The state outlines (~65 KB) are loaded on demand rather than bundled with every page
 * that shows a map; until they arrive the map renders empty at its final size.
 */
export function useNigeriaLocations(): MapLocation[] {
  const [locations, setLocations] = useState<MapLocation[]>(cached ?? []);
  useEffect(() => {
    if (cached) return;
    let live = true;
    void loadLocations().then((l) => live && setLocations(l));
    return () => {
      live = false;
    };
  }, []);
  return locations;
}
