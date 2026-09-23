"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Mail,
  Phone,
  Copy,
  Check,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Compass,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { siteConfig } from "@/config/site";

export interface OfficeLocation {
  id: string;
  type: string;
  name: string;
  stateName: string;
  stateCode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
  email: string;
  phone: string;
  mapQuery: string;
  x: number; // ViewBox x (0-900)
  y: number; // ViewBox y (0-620)
  zone: "North-West" | "North-East" | "North-Central" | "South-East";
  code: string;
  headlinePrograms: string[];
  operationalRole: string;
}

const officeDetails: OfficeLocation[] = [
  {
    id: "sokoto-hq",
    type: "National Headquarters (HQ)",
    name: "Sokoto - HQ",
    stateName: "Sokoto State",
    stateCode: "SOK",
    address: "Goshen Development Center Tamaje Area Eastern Byepass Road Sokoto",
    city: "Sokoto",
    state: "Sokoto State",
    country: "Nigeria",
    postalCode: "840001",
    isPrimary: true,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery: "Goshen Development Center Tamaje Area Eastern Byepass Road Sokoto",
    x: 235,
    y: 110,
    zone: "North-West",
    code: "SOK",
    operationalRole:
      "Executive Leadership, Central Administration & Tom Brown Production Facility",
    headlinePrograms: [
      "Tom Brown Supplementary Feeding Production",
      "Executive Project Management & Oversight",
      "Child Protection & Safeguarding Coordination",
      "Central Supply Chain & Logistics Hub",
    ],
  },
  {
    id: "adamawa-office",
    type: "North-East Field Office",
    name: "Adamawa Office",
    stateName: "Adamawa State",
    stateCode: "ADA",
    address: "House 7, Jos Street Off Capital School Damsawo Jimeta. Adamawa.",
    city: "Jimeta, Yola",
    state: "Adamawa State",
    country: "Nigeria",
    postalCode: "640284",
    isPrimary: false,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery: "House 7, Jos Street Off Capital School Damsawo Jimeta Adamawa",
    x: 720,
    y: 315,
    zone: "North-East",
    code: "AD",
    operationalRole:
      "Agro-Pastoral Peace Dialogues, Youth Livelihoods & Climate Resilience",
    headlinePrograms: [
      "Community Cohesion & Peacebuilding Dialogues",
      "Solar Water Boreholes & Sanitation Facilities",
      "Adolescent Girls' Literacy & STEM Circles",
      "Agribusiness Grants for Vulnerable Youth",
    ],
  },
  {
    id: "bauchi-office",
    type: "North-East Field Office",
    name: "Bauchi Office",
    stateName: "Bauchi State",
    stateCode: "BAU",
    address:
      "Suite 51 Ibrosulada Plaza Opposite Keystone Bank, Bank Road, Bauchi.",
    city: "Bauchi",
    state: "Bauchi State",
    country: "Nigeria",
    postalCode: "740241",
    isPrimary: false,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery:
      "Suite 51 Ibrosulada Plaza Opposite Keystone Bank, Bank Road, Bauchi",
    x: 550,
    y: 240,
    zone: "North-East",
    code: "BA",
    operationalRole:
      "Community Nutrition Distribution, Microfinance & Primary Healthcare",
    headlinePrograms: [
      "Tom Brown Infant Nutrition Outposts",
      "Village Savings & Loans Associations (VSLA)",
      "Routine Immunization Community Mobilization",
      "Vocational Apprenticeships for Young Women",
    ],
  },
  {
    id: "kebbi-office",
    type: "North-West Field Office",
    name: "Kebbi Office",
    stateName: "Kebbi State",
    stateCode: "KEB",
    address:
      "Plot: 130 & 131 off Sani Abacha By-pass Behind Leisure City Garden & Event Centre Kawara Area Birnin-Kebbi, Kebbi State.",
    city: "Birnin-Kebbi",
    state: "Kebbi State",
    country: "Nigeria",
    postalCode: "860241",
    isPrimary: false,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery:
      "Plot 130 & 131 off Sani Abacha By-pass Behind Leisure City Garden Birnin-Kebbi Kebbi",
    x: 165,
    y: 155,
    zone: "North-West",
    code: "KB",
    operationalRole:
      "Smallholder Agronomy Hub, Severe Malnutrition Units & Out-of-School Children",
    headlinePrograms: [
      "Climate-Smart Farmer Support Services",
      "Targeted Supplementary Feeding for Toddlers",
      "WASH Potable Water Points Rehabilitation",
      "Out-of-School Re-enrollment Campaigns",
    ],
  },
  {
    id: "zamfara-office",
    type: "North-West Field Office",
    name: "Zamafara Office",
    stateName: "Zamfara State",
    stateCode: "ZAM",
    address:
      "2nd Floor A.S Mamuda Apartment Opposite Oando Filling station Gusau.",
    city: "Gusau",
    state: "Zamfara State",
    country: "Nigeria",
    postalCode: "860221",
    isPrimary: false,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery:
      "2nd Floor A.S Mamuda Apartment Opposite Oando Filling station Gusau",
    x: 310,
    y: 155,
    zone: "North-West",
    code: "ZM",
    operationalRole:
      "Conflict Emergency Relief, IDP Psycho-Social Support & Humanitarian Response",
    headlinePrograms: [
      "Emergency IDP Food Security Assistance",
      "Trauma-Informed Psychosocial Counseling",
      "Protection Kits & Dignity Materials Distribution",
      "Rapid Community Health Interventions",
    ],
  },
  {
    id: "maiduguri-office",
    type: "North-East Humanitarian Hub",
    name: "Maiduguri Office",
    stateName: "Borno State",
    stateCode: "BOR",
    address:
      "House 12, Gidan Giwa, Sale Kida Street, Close to ICRC, Off Damboa Road, Maiduguri.",
    city: "Maiduguri",
    state: "Borno State",
    country: "Nigeria",
    postalCode: "600001",
    isPrimary: false,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery:
      "House 12 Gidan Giwa Sale Kida Street Off Damboa Road Maiduguri Borno",
    x: 770,
    y: 165,
    zone: "North-East",
    code: "BO",
    operationalRole:
      "Lake Chad Humanitarian Cluster Coordination & Emergency IDP Hub",
    headlinePrograms: [
      "UN OCHA Humanitarian Cluster Partnership",
      "Child-Friendly Safe Spaces & Trauma Relief",
      "Emergency WASH & Water Quality Assurance",
      "Gender-Based Violence (GBV) Case Management",
    ],
  },
  {
    id: "yobe-office",
    type: "North-East Field Office",
    name: "Yobe Office",
    stateName: "Yobe State",
    stateCode: "YOB",
    address:
      "House No 157, Usman Adamu Kabarma Street Sabon Fegi, Behind Classi Hotel Damaturu",
    city: "Damaturu",
    state: "Yobe State",
    country: "Nigeria",
    postalCode: "620101",
    isPrimary: false,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery:
      "House No 157 Usman Adamu Kabarma Street Sabon Fegi Damaturu Yobe",
    x: 670,
    y: 165,
    zone: "North-East",
    code: "YB",
    operationalRole:
      "Severe Acute Malnutrition (SAM) Treatment & Adolescent Hygiene Initiatives",
    headlinePrograms: [
      "SAM Stabilization & Feeding Centers",
      "NIDAKE Menstrual Hygiene Kit Distribution",
      "Temporary Learning Shelters & Safe Classrooms",
      "Livelihood Rehabilitation for Displaced Families",
    ],
  },
  {
    id: "ebonyi-office",
    type: "South-East Field Office",
    name: "Ebonyi Office",
    stateName: "Ebonyi State",
    stateCode: "EBO",
    address:
      "Plot 2, Federal Housing Estate, Judges quarters,opposite Isadore Inn, Abakaliki",
    city: "Abakaliki",
    state: "Ebonyi State",
    country: "Nigeria",
    postalCode: "480101",
    isPrimary: false,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery:
      "Plot 2 Federal Housing Estate Judges Quarters Abakaliki Ebonyi",
    x: 475,
    y: 495,
    zone: "South-East",
    code: "EB",
    operationalRole:
      "Maternal & Child Survival Outposts, Women Cooperatives & Rights Advocacy",
    headlinePrograms: [
      "Maternal Mortality Reduction Programs",
      "Women Agricultural Cooperatives & Seed Grants",
      "Child Protection & Legal Aid Assistance",
      "Rural Clean Water Access Development",
    ],
  },
  {
    id: "jos-office",
    type: "North-Central Field Office",
    name: "Jos Office",
    stateName: "Plateau State",
    stateCode: "PLA",
    address:
      "Office No 28a Tafawa Balewa Street,opposite United Baptist Church, Jos",
    city: "Jos",
    state: "Plateau State",
    country: "Nigeria",
    postalCode: "930101",
    isPrimary: false,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery:
      "Office No 28a Tafawa Balewa Street Jos Plateau State",
    x: 505,
    y: 295,
    zone: "North-Central",
    code: "PL",
    operationalRole:
      "Inter-Faith Peace Reconciliation, Trauma Recovery & Youth Social Labs",
    headlinePrograms: [
      "Inter-Religious Mediation Forums",
      "Community Trauma Healing Workshops",
      "Youth Civic Leadership Training",
      "Preventive Community Health Outreaches",
    ],
  },
  {
    id: "abuja-office",
    type: "Federal Implementation & Liaison Office",
    name: "Abuja Office",
    stateName: "Federal Capital Territory",
    stateCode: "FCT",
    address:
      "Office lock C, Flat 3. Tail Solarin Crescent Oppositee Zenith Bank. 5th Avenue Gwarimpa.",
    city: "Gwarimpa, Abuja",
    state: "Federal Capital Territory",
    country: "Nigeria",
    postalCode: "900108",
    isPrimary: false,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery:
      "Office lock C Flat 3 Tai Solarin Crescent Opposite Zenith Bank 5th Avenue Gwarimpa Abuja",
    x: 400,
    y: 335,
    zone: "North-Central",
    code: "FCT",
    operationalRole:
      "Federal Government Liaison, Bilateral Donor Relations & Policy Coordination",
    headlinePrograms: [
      "Federal Ministries & Agency Strategic Liaison",
      "Bilateral & Diplomatic Mission Engagements",
      "National Safeguarding & Whistleblowing Center",
      "Multi-State Procurement & High-Level Audits",
    ],
  },
  {
    id: "katsina-office",
    type: "North-West Field Office",
    name: "Katsina Office",
    stateName: "Katsina State",
    stateCode: "KAT",
    address:
      "Plot No 14 Bayajidda Road, Along INEC State Office Behind ICPC GRA Katsina",
    city: "Katsina",
    state: "Katsina State",
    country: "Nigeria",
    postalCode: "820101",
    isPrimary: false,
    email: "official@lhinigeria.org",
    phone: "+234 901 715 9526",
    mapQuery:
      "Plot No 14 Bayajidda Road Along INEC State Office Behind ICPC GRA Katsina",
    x: 395,
    y: 115,
    zone: "North-West",
    code: "KT",
    operationalRole:
      "Child Safeguarding, Girls' Education Retention & Supplementary Nutrition",
    headlinePrograms: [
      "Community Child Protection Committees",
      "Girls' Secondary Education Scholarships",
      "Local Grain Sourcing & Farmer Partnerships",
      "Malnutrition Screening in Remote Hamlets",
    ],
  },
];

/** Addresses and names come from siteConfig (the Organisational Profile) so they stay in one place. */
export const nationwideOffices: OfficeLocation[] = officeDetails.map((office) => {
  const official = siteConfig.offices.find((o) => o.id === office.id);
  return official
    ? { ...office, name: official.name, address: `${official.address}, ${official.city}`, mapQuery: official.mapQuery, phone: official.phone }
    : office;
});

// Structured Nigerian State Geometry Definitions
interface StateGeometry {
  id: string;
  name: string;
  code: string;
  officeId?: string;
  d: string;
  labelX: number;
  labelY: number;
  zone: string;
}

const stateGeometries: StateGeometry[] = [
  // 11 OPERATIONAL STATES WITH LHI OFFICES
  {
    id: "state-sokoto",
    name: "Sokoto",
    code: "SOK",
    officeId: "sokoto-hq",
    d: "M 175 140 L 195 95 L 245 75 L 290 85 L 305 125 L 275 155 L 225 150 L 175 140 Z",
    labelX: 235,
    labelY: 135,
    zone: "North-West",
  },
  {
    id: "state-kebbi",
    name: "Kebbi",
    code: "KEB",
    officeId: "kebbi-office",
    d: "M 120 170 L 175 140 L 225 150 L 210 200 L 165 240 L 140 230 L 125 195 Z",
    labelX: 165,
    labelY: 180,
    zone: "North-West",
  },
  {
    id: "state-zamfara",
    name: "Zamfara",
    code: "ZAM",
    officeId: "zamfara-office",
    d: "M 275 155 L 305 125 L 345 110 L 370 145 L 350 195 L 295 190 L 275 155 Z",
    labelX: 315,
    labelY: 175,
    zone: "North-West",
  },
  {
    id: "state-katsina",
    name: "Katsina",
    code: "KAT",
    officeId: "katsina-office",
    d: "M 345 110 L 380 70 L 420 80 L 435 120 L 415 160 L 370 145 Z",
    labelX: 395,
    labelY: 135,
    zone: "North-West",
  },
  {
    id: "state-bauchi",
    name: "Bauchi",
    code: "BAU",
    officeId: "bauchi-office",
    d: "M 485 195 L 560 160 L 620 200 L 610 260 L 555 285 L 505 255 Z",
    labelX: 550,
    labelY: 260,
    zone: "North-East",
  },
  {
    id: "state-yobe",
    name: "Yobe",
    code: "YOB",
    officeId: "yobe-office",
    d: "M 570 115 L 640 105 L 705 115 L 720 175 L 685 210 L 620 200 L 560 160 Z",
    labelX: 650,
    labelY: 185,
    zone: "North-East",
  },
  {
    id: "state-borno",
    name: "Borno",
    code: "BOR",
    officeId: "maiduguri-office",
    d: "M 705 115 L 760 120 L 835 165 L 840 225 L 800 265 L 755 260 L 720 175 Z",
    labelX: 775,
    labelY: 185,
    zone: "North-East",
  },
  {
    id: "state-adamawa",
    name: "Adamawa",
    code: "ADA",
    officeId: "adamawa-office",
    d: "M 690 265 L 755 260 L 800 265 L 785 340 L 735 375 L 690 330 Z",
    labelX: 730,
    labelY: 335,
    zone: "North-East",
  },
  {
    id: "state-plateau",
    name: "Plateau",
    code: "PLA",
    officeId: "jos-office",
    d: "M 480 265 L 555 285 L 565 330 L 515 345 L 470 310 Z",
    labelX: 510,
    labelY: 315,
    zone: "North-Central",
  },
  {
    id: "state-fct",
    name: "Abuja (FCT)",
    code: "FCT",
    officeId: "abuja-office",
    d: "M 370 300 L 425 295 L 430 350 L 380 355 Z",
    labelX: 400,
    labelY: 355,
    zone: "North-Central",
  },
  {
    id: "state-ebonyi",
    name: "Ebonyi",
    code: "EBO",
    officeId: "ebonyi-office",
    d: "M 465 440 L 510 445 L 515 495 L 465 490 Z",
    labelX: 485,
    labelY: 515,
    zone: "South-East",
  },

  // GEOGRAPHIC CONTEXT STATES OF NIGERIA
  {
    id: "state-kano",
    name: "Kano",
    code: "KAN",
    d: "M 415 160 L 435 120 L 475 115 L 500 150 L 485 195 L 435 190 Z",
    labelX: 455,
    labelY: 155,
    zone: "North-West",
  },
  {
    id: "state-jigawa",
    name: "Jigawa",
    code: "JIG",
    d: "M 475 115 L 530 95 L 570 115 L 560 160 L 500 150 Z",
    labelX: 525,
    labelY: 135,
    zone: "North-West",
  },
  {
    id: "state-kaduna",
    name: "Kaduna",
    code: "KAD",
    d: "M 350 195 L 415 160 L 485 195 L 480 265 L 420 270 L 370 250 Z",
    labelX: 420,
    labelY: 220,
    zone: "North-West",
  },
  {
    id: "state-gombe",
    name: "Gombe",
    code: "GOM",
    d: "M 620 200 L 685 210 L 690 265 L 645 280 L 610 260 Z",
    labelX: 650,
    labelY: 245,
    zone: "North-East",
  },
  {
    id: "state-taraba",
    name: "Taraba",
    code: "TAR",
    d: "M 590 340 L 690 330 L 735 375 L 695 445 L 615 440 L 575 390 Z",
    labelX: 645,
    labelY: 390,
    zone: "North-East",
  },
  {
    id: "state-niger",
    name: "Niger",
    code: "NIG",
    d: "M 210 200 L 275 190 L 350 195 L 370 250 L 370 300 L 325 340 L 230 310 L 165 240 Z",
    labelX: 275,
    labelY: 260,
    zone: "North-Central",
  },
  {
    id: "state-nasarawa",
    name: "Nasarawa",
    code: "NAS",
    d: "M 430 350 L 515 345 L 545 375 L 485 400 L 425 385 Z",
    labelX: 480,
    labelY: 375,
    zone: "North-Central",
  },
  {
    id: "state-benue",
    name: "Benue",
    code: "BEN",
    d: "M 485 400 L 545 375 L 590 395 L 595 445 L 525 455 L 475 440 Z",
    labelX: 535,
    labelY: 425,
    zone: "North-Central",
  },
  {
    id: "state-kogi",
    name: "Kogi",
    code: "KOG",
    d: "M 325 340 L 380 355 L 425 385 L 410 435 L 335 425 L 295 380 Z",
    labelX: 360,
    labelY: 390,
    zone: "North-Central",
  },
  {
    id: "state-kwara",
    name: "Kwara",
    code: "KWA",
    d: "M 165 240 L 230 310 L 295 380 L 245 385 L 180 365 L 150 300 Z",
    labelX: 205,
    labelY: 335,
    zone: "North-Central",
  },
  {
    id: "state-oyo",
    name: "Oyo",
    code: "OYO",
    d: "M 150 300 L 180 365 L 225 390 L 205 445 L 140 435 L 130 360 Z",
    labelX: 170,
    labelY: 395,
    zone: "South-West",
  },
  {
    id: "state-osun",
    name: "Osun",
    code: "OSU",
    d: "M 225 390 L 265 390 L 260 435 L 205 445 Z",
    labelX: 235,
    labelY: 420,
    zone: "South-West",
  },
  {
    id: "state-ekiti",
    name: "Ekiti",
    code: "EKI",
    d: "M 265 390 L 305 390 L 300 435 L 260 435 Z",
    labelX: 280,
    labelY: 415,
    zone: "South-West",
  },
  {
    id: "state-ondo",
    name: "Ondo",
    code: "OND",
    d: "M 305 390 L 335 425 L 330 480 L 275 480 L 260 435 Z",
    labelX: 295,
    labelY: 455,
    zone: "South-West",
  },
  {
    id: "state-ogun",
    name: "Ogun",
    code: "OGU",
    d: "M 140 435 L 205 445 L 245 480 L 155 495 L 125 465 Z",
    labelX: 180,
    labelY: 470,
    zone: "South-West",
  },
  {
    id: "state-lagos",
    name: "Lagos",
    code: "LAG",
    d: "M 125 465 L 185 490 L 200 520 L 120 520 Z",
    labelX: 155,
    labelY: 510,
    zone: "South-West",
  },
  {
    id: "state-edo",
    name: "Edo",
    code: "EDO",
    d: "M 335 425 L 385 435 L 375 485 L 325 480 Z",
    labelX: 350,
    labelY: 455,
    zone: "South-South",
  },
  {
    id: "state-delta",
    name: "Delta",
    code: "DEL",
    d: "M 325 480 L 375 485 L 370 540 L 305 540 Z",
    labelX: 335,
    labelY: 515,
    zone: "South-South",
  },
  {
    id: "state-bayelsa",
    name: "Bayelsa",
    code: "BAY",
    d: "M 320 540 L 370 540 L 370 585 L 320 575 Z",
    labelX: 345,
    labelY: 565,
    zone: "South-South",
  },
  {
    id: "state-rivers",
    name: "Rivers",
    code: "RIV",
    d: "M 370 540 L 425 535 L 420 590 L 370 585 Z",
    labelX: 395,
    labelY: 565,
    zone: "South-South",
  },
  {
    id: "state-akwa-ibom",
    name: "Akwa Ibom",
    code: "AKW",
    d: "M 425 535 L 475 540 L 465 590 L 420 590 Z",
    labelX: 445,
    labelY: 565,
    zone: "South-South",
  },
  {
    id: "state-cross-river",
    name: "Cross River",
    code: "CRO",
    d: "M 475 540 L 535 495 L 555 540 L 495 580 Z",
    labelX: 520,
    labelY: 545,
    zone: "South-South",
  },
  {
    id: "state-enugu",
    name: "Enugu",
    code: "ENU",
    d: "M 425 445 L 465 440 L 465 485 L 420 485 Z",
    labelX: 440,
    labelY: 465,
    zone: "South-East",
  },
  {
    id: "state-anambra",
    name: "Anambra",
    code: "ANA",
    d: "M 385 435 L 425 445 L 420 495 L 380 485 Z",
    labelX: 400,
    labelY: 465,
    zone: "South-East",
  },
  {
    id: "state-imo",
    name: "Imo",
    code: "IMO",
    d: "M 380 485 L 420 495 L 415 535 L 375 525 Z",
    labelX: 395,
    labelY: 510,
    zone: "South-East",
  },
  {
    id: "state-abia",
    name: "Abia",
    code: "ABI",
    d: "M 420 495 L 465 490 L 460 540 L 415 535 Z",
    labelX: 440,
    labelY: 515,
    zone: "South-East",
  },
];

interface NigeriaMapProps {
  selectedOfficeId: string;
  onSelectOffice: (id: string) => void;
}

export function NigeriaMap({
  selectedOfficeId,
  onSelectOffice,
}: NigeriaMapProps) {
  const [hoveredOfficeId, setHoveredOfficeId] = useState<string | null>(null);
  const [activeZoneFilter, setActiveZoneFilter] = useState<string>("All");
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSatelliteEmbed, setShowSatelliteEmbed] = useState<boolean>(false);

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedOffice =
    nationwideOffices.find((o) => o.id === selectedOfficeId) ||
    nationwideOffices[0];

  const zones = [
    "All",
    "North-West",
    "North-East",
    "North-Central",
    "South-East",
  ];

  const filteredOffices =
    activeZoneFilter === "All"
      ? nationwideOffices
      : nationwideOffices.filter((o) => o.zone === activeZoneFilter);

  // Auto scroll office card into view in horizontal scroller
  const scrollToOffice = useCallback((id: string) => {
    if (!scrollTrackRef.current) return;
    const cardEl = scrollTrackRef.current.querySelector(
      `[data-office-card="${id}"]`
    );
    if (cardEl) {
      cardEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, []);

  // Handle office selection
  const handleSelectOffice = useCallback(
    (id: string) => {
      onSelectOffice(id);
      scrollToOffice(id);
    },
    [onSelectOffice, scrollToOffice]
  );

  // Auto-tour player
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      const currentIndex = nationwideOffices.findIndex(
        (o) => o.id === selectedOfficeId
      );
      const nextIndex = (currentIndex + 1) % nationwideOffices.length;
      const nextOffice = nationwideOffices[nextIndex];
      handleSelectOffice(nextOffice.id);
    }, 3800);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, selectedOfficeId, handleSelectOffice]);

  // Copy full verified address to clipboard
  const copyAddressToClipboard = (office: OfficeLocation) => {
    const fullText = `${office.name}: ${office.address}, ${office.city}, ${office.state}, Nigeria. Tel: ${office.phone} (Email: ${office.email})`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedId(office.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handlePrevOffice = () => {
    const currentIndex = nationwideOffices.findIndex(
      (o) => o.id === selectedOfficeId
    );
    const prevIndex =
      (currentIndex - 1 + nationwideOffices.length) % nationwideOffices.length;
    handleSelectOffice(nationwideOffices[prevIndex].id);
  };

  const handleNextOffice = () => {
    const currentIndex = nationwideOffices.findIndex(
      (o) => o.id === selectedOfficeId
    );
    const nextIndex = (currentIndex + 1) % nationwideOffices.length;
    handleSelectOffice(nationwideOffices[nextIndex].id);
  };

  return (
    <div
      id="structured-nigeria-map-container"
      className="flex flex-col gap-6 w-full"
    >
      {/* Top Controls: Geopolitical Zone Filter & Auto-Tour Player */}
      <div
        id="nigeria-map-controls-bar"
        className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold text-muted-foreground">
            Zone Filter:
          </span>
          {zones.map((zone) => (
            <button
              key={zone}
              id={`filter-btn-${zone.toLowerCase().replace(/\s+/g, "-")}`}
              type="button"
              onClick={() => {
                setActiveZoneFilter(zone);
                const firstInZone =
                  zone === "All"
                    ? nationwideOffices[0]
                    : nationwideOffices.find((o) => o.zone === zone);
                if (firstInZone) handleSelectOffice(firstInZone.id);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                activeZoneFilter === zone
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {zone}
            </button>
          ))}
        </div>

        {/* Auto Tour Play/Pause Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="auto-tour-toggle-btn"
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all border ${
              isAutoPlaying
                ? "bg-primary/15 text-primary dark:text-primary border-primary/40 ring-2 ring-primary/20"
                : "bg-card text-foreground border-border hover:border-primary/40"
            }`}
            title="Automatically step through each state office"
          >
            {isAutoPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-primary dark:text-primary animate-pulse" />
                <span>Pause Tour</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-primary" />
                <span>Auto-Tour 11 Offices</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Map Card */}
      <div
        id="nigeria-map-visual-card"
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card via-card/95 to-muted/30 p-4 sm:p-6 shadow-sm dark:bg-[#070e1c]"
      >
        {/* Subtle decorative grid/glow behind map */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent opacity-60"
        />

        {/* Map Header Status & Selected State Banner */}
        <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
            <span className="text-xs font-semibold text-foreground">
              Life Helpers Initiative — Nigeria Operations Map
            </span>
            <span className="hidden sm:inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              11 Active Offices
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-primary ring-2 ring-primary/30" />
              <span className="font-semibold text-foreground">Sokoto HQ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Field Offices</span>
            </div>
          </div>
        </div>

        {/* Structured Nigeria SVG Map Canvas */}
        <div
          id="nigeria-svg-wrapper"
          className="relative aspect-[900/620] w-full"
        >
          <svg
            id="nigeria-structured-map-svg"
            viewBox="0 0 900 620"
            className="h-full w-full select-none"
            aria-label="Structured Interactive Map of Nigeria showing Life Helpers Initiative State Offices"
          >
            <defs>
              {/* Radial gradient for Sokoto National Headquarters beacon */}
              <radialGradient id="hqRadarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </radialGradient>

              {/* Radial pulse gradient for field offices */}
              <radialGradient id="fieldPinPulse" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  stopColor="var(--accent)"
                  stopOpacity="0.7"
                />
                <stop
                  offset="60%"
                  stopColor="var(--accent)"
                  stopOpacity="0.25"
                />
                <stop
                  offset="100%"
                  stopColor="var(--accent)"
                  stopOpacity="0"
                />
              </radialGradient>

              {/* Active state highlight pattern */}
              <linearGradient
                id="activeStateGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.12" />
              </linearGradient>

              {/* HQ Active state highlight */}
              <linearGradient
                id="hqStateGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.32" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.16" />
              </linearGradient>
            </defs>

            {/* Gulf of Guinea / Atlantic Ocean Ambient Backdrop */}
            <rect
              x="80"
              y="530"
              width="500"
              height="80"
              fill="currentColor"
              className="text-accent/5"
            />
            <text
              x="220"
              y="590"
              fill="currentColor"
              fontSize="11"
              letterSpacing="0.18em"
              className="text-muted-foreground/40 font-bold uppercase"
            >
              Gulf of Guinea (Atlantic Ocean)
            </text>

            {/* Lake Chad Basin Ambient Representation */}
            <path
              d="M 810 140 Q 860 170 835 220 Z"
              fill="var(--accent)"
              opacity="0.18"
            />
            <text
              x="800"
              y="160"
              fill="currentColor"
              fontSize="9"
              className="text-accent dark:text-accent font-semibold"
              opacity="0.8"
            >
              Lake Chad
            </text>

            {/* HIGH-ACCURACY NIGERIA EXTERIOR BORDER OUTLINE */}
            <path
              d="M 120 170 L 140 140 L 195 95 L 245 75 L 345 70 L 420 80 L 530 95 L 640 105 L 760 120 L 835 165 L 840 225 L 800 265 L 785 340 L 735 375 L 695 445 L 615 440 L 575 390 L 555 540 L 495 580 L 420 590 L 370 585 L 320 575 L 305 540 L 200 520 L 120 520 L 125 465 L 130 360 L 150 300 L 120 170 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinejoin="round"
              className="text-primary/30 dark:text-primary/20"
            />

            {/* ALL 36 STATES + FCT STRUCTURED POLYGONS */}
            <g id="nigeria-states-layer">
              {stateGeometries.map((state) => {
                const isOperational = Boolean(state.officeId);
                const isHQ = state.officeId === "sokoto-hq";
                const isSelected = state.officeId === selectedOfficeId;
                const isHovered = state.officeId === hoveredOfficeId;

                let fill = "currentColor";
                let fillClass = "text-muted/15 dark:text-muted/5";
                let strokeClass =
                  "stroke-border/40 text-border/60 hover:stroke-border/80";

                if (isOperational) {
                  if (isHQ) {
                    fill = isSelected
                      ? "url(#hqStateGradient)"
                      : isHovered
                      ? "url(#hqRadarGlow)"
                      : "currentColor";
                    fillClass = isSelected
                      ? ""
                      : isHovered
                      ? "text-primary/30"
                      : "text-primary/15 hover:text-primary/25";
                    strokeClass = isSelected
                      ? "stroke-primary stroke-[2.5]"
                      : isHovered
                      ? "stroke-primary/80 stroke-[2]"
                      : "stroke-primary/40 hover:stroke-primary/70";
                  } else {
                    fill = isSelected
                      ? "url(#activeStateGradient)"
                      : isHovered
                      ? "url(#fieldPinPulse)"
                      : "currentColor";
                    fillClass = isSelected
                      ? ""
                      : isHovered
                      ? "text-primary/30"
                      : "text-primary/15 hover:text-primary/25";
                    strokeClass = isSelected
                      ? "stroke-primary stroke-[2.5]"
                      : isHovered
                      ? "stroke-primary/80 stroke-[2]"
                      : "stroke-primary/40 hover:stroke-primary/70";
                  }
                }

                return (
                  <g
                    key={state.id}
                    id={state.id}
                    onClick={() => {
                      if (state.officeId) handleSelectOffice(state.officeId);
                    }}
                    onMouseEnter={() => {
                      if (state.officeId) setHoveredOfficeId(state.officeId);
                    }}
                    onMouseLeave={() => {
                      if (state.officeId) setHoveredOfficeId(null);
                    }}
                    className={
                      isOperational
                        ? "cursor-pointer transition-all duration-200"
                        : "cursor-default"
                    }
                  >
                    <path
                      d={state.d}
                      fill={fill}
                      strokeWidth={isSelected ? "2.5" : "1.2"}
                      strokeLinejoin="round"
                      className={`${fillClass} ${strokeClass} transition-colors duration-200`}
                    />

                    {/* State Abbreviation Label */}
                    <text
                      x={state.labelX}
                      y={state.labelY}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize={isOperational ? "10" : "8"}
                      fontWeight={isSelected || isHQ ? "700" : "500"}
                      className={`pointer-events-none transition-all duration-200 ${
                        isSelected
                          ? isHQ
                            ? "text-primary dark:text-primary font-bold"
                            : "text-primary font-bold"
                          : isOperational
                          ? "text-foreground/80"
                          : "text-muted-foreground/35"
                      }`}
                    >
                      {state.code}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* River Niger and River Benue Confluence System */}
            <g id="nigeria-river-system" opacity="0.45">
              {/* River Niger */}
              <path
                d="M 140 220 Q 210 260 280 320 T 385 390"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.2"
                strokeDasharray="4 3"
              />
              {/* River Benue */}
              <path
                d="M 720 330 Q 560 350 385 390"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.2"
                strokeDasharray="4 3"
              />
              {/* Niger Delta Lower River */}
              <path
                d="M 385 390 Q 400 460 370 550"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.6"
                strokeDasharray="4 3"
              />
              {/* Lokoja Confluence Mark */}
              <circle cx="385" cy="390" r="3.5" fill="var(--accent)" />
              <text
                x="340"
                y="405"
                fill="currentColor"
                fontSize="8"
                className="text-accent dark:text-accent font-semibold"
              >
                Niger-Benue Confluence
              </text>
            </g>

            {/* ANIMATED OFFICE LOCATION BEACONS & PINS */}
            <g id="nigeria-office-pins-layer">
              {filteredOffices.map((office) => {
                const isSelected = office.id === selectedOfficeId;
                const isHovered = office.id === hoveredOfficeId;

                return (
                  <g
                    key={office.id}
                    id={`pin-group-${office.id}`}
                    className="cursor-pointer transition-transform duration-300"
                    onClick={() => handleSelectOffice(office.id)}
                    onMouseEnter={() => setHoveredOfficeId(office.id)}
                    onMouseLeave={() => setHoveredOfficeId(null)}
                  >
                    {/* Continuous Animating Radar Waves for Sokoto HQ */}
                    {office.isPrimary && (
                      <>
                        <circle
                          cx={office.x}
                          cy={office.y}
                          r="34"
                          fill="url(#hqRadarGlow)"
                          className="animate-pulse"
                        />
                        <circle
                          cx={office.x}
                          cy={office.y}
                          r="22"
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          className="animate-spin"
                          style={{ animationDuration: "12s" }}
                        />
                      </>
                    )}

                    {/* Continuous Pulsing Radar Rings for Field Offices */}
                    {!office.isPrimary && (
                      <circle
                        cx={office.x}
                        cy={office.y}
                        r="18"
                        fill="url(#fieldPinPulse)"
                        className="animate-pulse"
                        style={{
                          animationDuration: isSelected ? "1.8s" : "3.2s",
                        }}
                      />
                    )}

                    {/* Dynamic Selection Ping Ripple Ring */}
                    {isSelected && (
                      <circle
                        cx={office.x}
                        cy={office.y}
                        r={office.isPrimary ? 28 : 20}
                        fill="none"
                        stroke={
                          office.isPrimary
                            ? "var(--primary)"
                            : "var(--accent)"
                        }
                        strokeWidth="2.5"
                        className="animate-ping"
                        style={{ animationDuration: "2.4s" }}
                      />
                    )}

                    {/* Pin Drop Pinhead Shadow */}
                    <ellipse
                      cx={office.x}
                      cy={office.y + (office.isPrimary ? 15 : 12)}
                      rx={office.isPrimary ? 8 : 5}
                      ry={office.isPrimary ? 3 : 2}
                      fill="#000000"
                      opacity="0.3"
                    />

                    {/* Pin Circle Body */}
                    <circle
                      cx={office.x}
                      cy={office.y}
                      r={
                        office.isPrimary
                          ? isSelected
                            ? 15
                            : 13
                          : isSelected
                          ? 11
                          : 8.5
                      }
                      fill={
                        office.isPrimary
                          ? "var(--primary)"
                          : isSelected
                          ? "var(--accent)"
                          : "var(--accent)"
                      }
                      stroke="#ffffff"
                      strokeWidth={office.isPrimary ? "3" : "2"}
                      className="transition-all duration-300 drop-shadow-md"
                    />

                    {/* Pin Central Glyph (Star for HQ, Dot for Field Offices) */}
                    {office.isPrimary ? (
                      <text
                        x={office.x}
                        y={office.y + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        ★
                      </text>
                    ) : (
                      <circle
                        cx={office.x}
                        cy={office.y}
                        r={isSelected ? 3 : 2.5}
                        fill="#ffffff"
                      />
                    )}

                    {/* State / Office City Label Pill */}
                    <g
                      transform={`translate(${office.x}, ${
                        office.y + (office.y > 380 ? -18 : 22)
                      })`}
                    >
                      <rect
                        x="-40"
                        y="-10"
                        width="80"
                        height="19"
                        rx="9.5"
                        fill={
                          office.isPrimary
                            ? "var(--primary)"
                            : isSelected
                            ? "#0f172a"
                            : "#1e293b"
                        }
                        className="shadow-sm"
                        opacity={isSelected || isHovered ? "1" : "0.85"}
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight={
                          isSelected || office.isPrimary ? "700" : "600"
                        }
                        letterSpacing="0.01em"
                      >
                        {office.isPrimary
                          ? "Sokoto HQ"
                          : office.name.replace(" Office", "")}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Map Legend & Footnote */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Sokoto Central HQ
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Field Offices & Hubs
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Niger & Benue River Systems
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span>Click any state or beacon to reveal full details</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL SCROLLABLE OFFICE SELECTOR TRACK */}
      <div id="office-scroll-track-container" className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Scroll & Select State Offices
            </span>
            <span className="text-xs text-muted-foreground">
              ({nationwideOffices.length} nationwide)
            </span>
          </div>

          {/* Previous / Next Scroll Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id="scroll-prev-btn"
              type="button"
              onClick={handlePrevOffice}
              aria-label="Previous office location"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              id="scroll-next-btn"
              type="button"
              onClick={handleNextOffice}
              aria-label="Next office location"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* The Scrollable Horizontal Strip */}
        <div
          ref={scrollTrackRef}
          id="office-horizontal-scroll-track"
          className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-muted-foreground/30 snap-x snap-mandatory"
        >
          {nationwideOffices.map((office, idx) => {
            const isSelected = office.id === selectedOfficeId;
            return (
              <button
                key={office.id}
                data-office-card={office.id}
                id={`office-track-card-${office.id}`}
                type="button"
                onClick={() => handleSelectOffice(office.id)}
                className={`flex shrink-0 w-64 snap-center flex-col text-left rounded-2xl border p-3.5 transition-all ${
                  isSelected
                    ? office.isPrimary
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm"
                      : "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      office.isPrimary
                        ? "bg-primary/20 text-primary dark:text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {office.isPrimary ? "HQ" : office.zone}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                    {idx + 1} of 11
                  </span>
                </div>

                <h4 className="mt-2 text-sm font-bold text-foreground line-clamp-1">
                  {office.name}
                </h4>

                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                  {office.city}, {office.state}
                </p>

                <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                  <span className="font-semibold text-primary">
                    {office.stateCode}
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    {isSelected ? "Selected" : "Click to view"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPREHENSIVE DETAIL CARD (Referenced directly from lhinigeria.org/contactus/) */}
      <div id="comprehensive-office-detail-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedOffice.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className={`overflow-hidden rounded-3xl border bg-card shadow-sm ${
              selectedOffice.isPrimary
                ? "border-primary/40 ring-1 ring-primary/20"
                : "border-border"
            }`}
          >
            {/* Header with Badges and Direct Action Buttons */}
            <div className="border-b border-border/70 p-5 sm:p-6 bg-muted/20">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                        selectedOffice.isPrimary
                          ? "bg-primary/20 text-primary dark:text-primary ring-1 ring-primary/30"
                          : "bg-primary/15 text-primary font-semibold"
                      }`}
                    >
                      {selectedOffice.type}
                    </span>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                      {selectedOffice.zone} Zone
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified Location
                    </span>
                  </div>

                  <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {selectedOffice.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {selectedOffice.operationalRole}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    id="copy-address-action-btn"
                    type="button"
                    onClick={() => copyAddressToClipboard(selectedOffice)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                    title="Copy full office address"
                  >
                    {copiedId === selectedOffice.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  <a
                    id="google-maps-directions-btn"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedOffice.mapQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Get Directions</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </div>
              </div>
            </div>

            {/* Comprehensive Information Details Grid */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Exact Verified Physical Address Box */}
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Exact Address (from lhinigeria.org/contactus/)
                    </span>
                    <p className="font-semibold text-foreground leading-relaxed">
                      {selectedOffice.address}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                      <span>
                        City:{" "}
                        <strong className="text-foreground">
                          {selectedOffice.city}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        State:{" "}
                        <strong className="text-foreground">
                          {selectedOffice.state}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Postal Code:{" "}
                        <strong className="text-foreground">
                          {selectedOffice.postalCode}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Country:{" "}
                        <strong className="text-foreground">
                          {selectedOffice.country}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Communication Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Official Phone */}
                <div className="flex items-start gap-3 rounded-2xl border border-border p-4 bg-background">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                      Contact Hotline
                    </span>
                    <p className="mt-0.5">
                      <a
                        href={`tel:${selectedOffice.phone}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {selectedOffice.phone}
                      </a>
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      Operating: Mon – Fri, 8:00 AM – 5:00 PM (WAT)
                    </span>
                  </div>
                </div>

                {/* Official Email */}
                <div className="flex items-start gap-3 rounded-2xl border border-border p-4 bg-background">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                      Official Inquiries Email
                    </span>
                    <p className="mt-0.5">
                      <a
                        href={`mailto:${selectedOffice.email}`}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {selectedOffice.email}
                      </a>
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      Direct inquiries & official correspondence
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Regional Operations & Programs */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Core Operational Interventions Managed From This Office
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedOffice.headlinePrograms.map((prog, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 text-xs text-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{prog}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Street / Satellite Google Maps Embed Toggle */}
              <div className="border-t border-border/70 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Satellite & Street Location Map
                    </span>
                  </div>
                  <button
                    id="toggle-satellite-embed-btn"
                    type="button"
                    onClick={() => setShowSatelliteEmbed((prev) => !prev)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {showSatelliteEmbed ? "Hide Map View" : "Show Map View"}
                  </button>
                </div>

                {showSatelliteEmbed && (
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl border border-border bg-muted">
                    <iframe
                      title={`Google Map for ${selectedOffice.name}`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        selectedOffice.mapQuery
                      )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
