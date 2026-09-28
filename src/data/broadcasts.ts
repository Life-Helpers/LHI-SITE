/**
 * LHI's radio and TV programmes (Radio & TV page and the home page radio section).
 * Schedules as provided by LHI's communications team, September 2026.
 */
export interface RadioProgramme {
  id: string;
  name: string;
  /** Local name, if any. */
  alias?: string;
  schedule: string;
  station: string;
  partners: string;
  /** Matches the "Programme" chosen on each episode in Admin → Radio Episodes. */
  episodeProgramme: string;
}

export interface TvProgramme {
  id: string;
  name: string;
  project: string;
  channel: string;
  partners: string;
  youtubeId: string;
  url: string;
}

export const RADIO_PROGRAMMES: RadioProgramme[] = [
  {
    id: "wespeak",
    name: "WeSpeak",
    alias: "Muyi Magana",
    schedule: "Every Tuesday, 11:00 AM – 12:00 PM",
    station: "Royal FM 101.5 (Radio Nigeria), Sokoto",
    partners: "Supported by Life Helpers Initiative",
    episodeProgramme: "WeSpeak (Muyi Magana)",
  },
  {
    id: "unesco",
    name: "UNESCO Project",
    schedule: "Third Thursday of the month, 11:00 AM – 12:00 PM",
    station: "Iconic FM, Sokoto State",
    partners: "UNESCO · Life Helpers Initiative",
    episodeProgramme: "UNESCO Project",
  },
  {
    id: "sarah",
    name: "SARAH Project",
    schedule: "Every Thursday, 11:00 AM – 12:00 PM",
    station: "RIMA Radio, Sokoto State",
    partners: "EU · UNICEF · Life Helpers Initiative",
    episodeProgramme: "SARAH Project",
  },
];

export const TV_PROGRAMMES: TvProgramme[] = [
  {
    id: "sarah-maternal-health",
    name: "Maternal Health",
    project: "SARAH Project",
    channel: "NTA (Nigerian Television Authority)",
    partners: "EU · UNICEF · Life Helpers Initiative",
    youtubeId: "gwm1H7vY-4c",
    url: "https://www.youtube.com/live/gwm1H7vY-4c",
  },
];
