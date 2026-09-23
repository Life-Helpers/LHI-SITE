/**
 * Partner and donor logos shown on the home page, from LHI's "NEW PARTNERS LOGO" folder.
 * `cmsId` links a logo to its partner profile in the CMS, which opens the partner dossier.
 */
export type PartnerLogoCategory =
  | "UN agencies"
  | "Donors & multilaterals"
  | "International NGOs"
  | "Government & national"
  | "National partners"
  | "Private sector";

export interface PartnerLogo {
  id: string;
  name: string;
  category: PartnerLogoCategory;
  logo: string;
  width: number;
  height: number;
  cmsId?: string;
}

export const PARTNER_LOGOS: PartnerLogo[] = [
  { id: "usaid", name: "USAID", category: "Donors & multilaterals", logo: "/images/partners/usaid.webp", width: 480, height: 173, cmsId: "usaid" },
  { id: "unicef", name: "UNICEF", category: "UN agencies", logo: "/images/partners/unicef.webp", width: 480, height: 154, cmsId: "unicef" },
  { id: "plan-international", name: "Plan International", category: "International NGOs", logo: "/images/partners/plan-international.webp", width: 480, height: 221, cmsId: "plan-international" },
  { id: "care", name: "CARE", category: "International NGOs", logo: "/images/partners/care.webp", width: 480, height: 188 },
  { id: "fhi-360", name: "FHI 360", category: "International NGOs", logo: "/images/partners/fhi-360.webp", width: 480, height: 226 },
  { id: "secours-islamique-france", name: "Secours Islamique France", category: "International NGOs", logo: "/images/partners/secours-islamique-france.webp", width: 480, height: 229 },
  { id: "canadian-foodgrains-bank", name: "Canadian Foodgrains Bank", category: "International NGOs", logo: "/images/partners/canadian-foodgrains-bank.webp", width: 374, height: 240 },
  { id: "spotlight-initiative", name: "Spotlight Initiative", category: "UN agencies", logo: "/images/partners/spotlight-initiative.webp", width: 480, height: 225 },
  { id: "british-council", name: "British Council", category: "Donors & multilaterals", logo: "/images/partners/british-council.webp", width: 480, height: 168 },
  { id: "nhf", name: "Nigeria Humanitarian Fund", category: "UN agencies", logo: "/images/partners/nhf.webp", width: 480, height: 125, cmsId: "nhf" },
  { id: "european-union", name: "European Union", category: "Donors & multilaterals", logo: "/images/partners/european-union.webp", width: 321, height: 240, cmsId: "european-union" },
  { id: "save-the-children", name: "Save the Children", category: "International NGOs", logo: "/images/partners/save-the-children.webp", width: 331, height: 240, cmsId: "save-the-children" },
  { id: "union-bank", name: "Union Bank", category: "Private sector", logo: "/images/partners/union-bank.webp", width: 240, height: 240 },
  { id: "victims-support-fund", name: "Victims Support Fund", category: "Government & national", logo: "/images/partners/victims-support-fund.webp", width: 228, height: 240 },
  { id: "arfh", name: "Association for Reproductive and Family Health (ARFH)", category: "National partners", logo: "/images/partners/arfh.webp", width: 240, height: 240 },
  { id: "alive-and-thrive", name: "Alive & Thrive", category: "International NGOs", logo: "/images/partners/alive-and-thrive.webp", width: 307, height: 240 },
  { id: "canada", name: "Government of Canada", category: "Donors & multilaterals", logo: "/images/partners/canada.webp", width: 480, height: 191, cmsId: "global-affairs-canada" },
  { id: "fgn", name: "Federal Government of Nigeria", category: "Government & national", logo: "/images/partners/fgn.webp", width: 273, height: 240 },
  { id: "giscor", name: "GISCOR", category: "National partners", logo: "/images/partners/giscor.webp", width: 215, height: 240 },
  { id: "france-meae", name: "French Ministry for Europe and Foreign Affairs", category: "Donors & multilaterals", logo: "/images/partners/france-meae.webp", width: 365, height: 240 },
  { id: "coopi", name: "COOPI – Cooperazione Internazionale", category: "International NGOs", logo: "/images/partners/coopi.webp", width: 183, height: 240 },
  { id: "sokoto-youth-sports", name: "Sokoto State Ministry of Youth and Sports Development", category: "Government & national", logo: "/images/partners/sokoto-youth-sports.webp", width: 240, height: 240 },
  { id: "fao", name: "Food and Agriculture Organization (FAO)", category: "UN agencies", logo: "/images/partners/fao.webp", width: 480, height: 160 },
  { id: "feed-the-future", name: "Feed the Future", category: "Donors & multilaterals", logo: "/images/partners/feed-the-future.webp", width: 475, height: 240 },
  { id: "sida", name: "Sida", category: "Donors & multilaterals", logo: "/images/partners/sida.webp", width: 424, height: 240 },
  { id: "wep", name: "Women Environmental Programme", category: "National partners", logo: "/images/partners/wep.webp", width: 236, height: 240 },
  { id: "zoa", name: "ZOA", category: "International NGOs", logo: "/images/partners/zoa.webp", width: 466, height: 240 },
  { id: "norway-mfa", name: "Norwegian Ministry of Foreign Affairs", category: "Donors & multilaterals", logo: "/images/partners/norway-mfa.webp", width: 421, height: 240 },
  { id: "irc", name: "International Rescue Committee", category: "International NGOs", logo: "/images/partners/irc.webp", width: 188, height: 240, cmsId: "irc" },
  { id: "unhcr", name: "UNHCR", category: "UN agencies", logo: "/images/partners/unhcr.webp", width: 207, height: 240 },
  { id: "fcmb", name: "FCMB", category: "Private sector", logo: "/images/partners/fcmb.webp", width: 240, height: 240 },
  { id: "sterling-bank", name: "Sterling Bank", category: "Private sector", logo: "/images/partners/sterling-bank.webp", width: 288, height: 240 },
  { id: "gtbank", name: "Guaranty Trust Bank", category: "Private sector", logo: "/images/partners/gtbank.webp", width: 213, height: 240 },
  { id: "tajbank", name: "TAJBank", category: "Private sector", logo: "/images/partners/tajbank.webp", width: 443, height: 240 },
  { id: "stanbic-ibtc", name: "Stanbic IBTC", category: "Private sector", logo: "/images/partners/stanbic-ibtc.webp", width: 135, height: 240 },
  { id: "firstbank", name: "FirstBank", category: "Private sector", logo: "/images/partners/firstbank.webp", width: 266, height: 240 },
  { id: "alima", name: "ALIMA", category: "International NGOs", logo: "/images/partners/alima.webp", width: 205, height: 240 },
  { id: "chad", name: "CHAD – Centre for Community Health and Development International", category: "National partners", logo: "/images/partners/chad.webp", width: 240, height: 240 },
  { id: "bauchi-state", name: "Bauchi State Government", category: "Government & national", logo: "/images/partners/bauchi-state.webp", width: 240, height: 240 },
  { id: "plateau-state", name: "Plateau State Government", category: "Government & national", logo: "/images/partners/plateau-state.webp", width: 240, height: 240 },
  { id: "adamawa-state", name: "Adamawa State Government", category: "Government & national", logo: "/images/partners/adamawa-state.webp", width: 240, height: 240 },
  { id: "borno-state", name: "Borno State Government", category: "Government & national", logo: "/images/partners/borno-state.webp", width: 241, height: 240 },
  { id: "ebonyi-state", name: "Ebonyi State Government", category: "Government & national", logo: "/images/partners/ebonyi-state.webp", width: 238, height: 240 },
  { id: "kebbi-state", name: "Kebbi State Government", category: "Government & national", logo: "/images/partners/kebbi-state.webp", width: 240, height: 240 },
  { id: "zamfara-state", name: "Zamfara State Government", category: "Government & national", logo: "/images/partners/zamfara-state.webp", width: 240, height: 240 },
  { id: "katsina-state", name: "Katsina State Government", category: "Government & national", logo: "/images/partners/katsina-state.webp", width: 242, height: 240 },
  { id: "yobe-state", name: "Yobe State Government", category: "Government & national", logo: "/images/partners/yobe-state.webp", width: 240, height: 240 },
  { id: "fcta", name: "FCT Administration, Abuja", category: "Government & national", logo: "/images/partners/fcta.webp", width: 185, height: 240 },
  { id: "sokoto-state", name: "Sokoto State Government", category: "Government & national", logo: "/images/partners/sokoto-state.webp", width: 352, height: 240 },
  { id: "sdgs", name: "Sustainable Development Goals", category: "UN agencies", logo: "/images/partners/sdgs.webp", width: 240, height: 240 },
  { id: "jsi", name: "John Snow, Inc. (JSI)", category: "International NGOs", logo: "/images/partners/jsi.webp", width: 321, height: 240 },
  { id: "palladium", name: "Palladium", category: "International NGOs", logo: "/images/partners/palladium.webp", width: 480, height: 217 },
  { id: "ndi", name: "National Democratic Institute (NDI)", category: "International NGOs", logo: "/images/partners/ndi.webp", width: 332, height: 240 },
  { id: "crs", name: "Catholic Relief Services", category: "International NGOs", logo: "/images/partners/crs.webp", width: 480, height: 232 },
  { id: "iri", name: "International Republican Institute (IRI)", category: "International NGOs", logo: "/images/partners/iri.webp", width: 405, height: 240 },
  { id: "bmz", name: "German Federal Ministry for Economic Cooperation and Development (BMZ)", category: "Donors & multilaterals", logo: "/images/partners/bmz.webp", width: 480, height: 218, cmsId: "bmz-germany" },
  { id: "kfw", name: "KfW Development Bank", category: "Donors & multilaterals", logo: "/images/partners/kfw.webp", width: 447, height: 240, cmsId: "kfw" },
  { id: "sfh", name: "Society for Family Health", category: "National partners", logo: "/images/partners/sfh.webp", width: 238, height: 240 },
  { id: "giz", name: "German Cooperation (GIZ)", category: "Donors & multilaterals", logo: "/images/partners/giz.webp", width: 406, height: 240 },
  { id: "nta", name: "Nigerian Television Authority", category: "Government & national", logo: "/images/partners/nta.webp", width: 416, height: 240 },
  { id: "creative", name: "Creative Associates International", category: "International NGOs", logo: "/images/partners/creative.webp", width: 240, height: 240 },
  { id: "msh", name: "Management Sciences for Health", category: "International NGOs", logo: "/images/partners/msh.webp", width: 480, height: 215 },
  { id: "world-bank", name: "The World Bank", category: "Donors & multilaterals", logo: "/images/partners/world-bank.webp", width: 437, height: 240 },
  { id: "premiere-urgence", name: "Première Urgence Internationale", category: "International NGOs", logo: "/images/partners/premiere-urgence.webp", width: 480, height: 177 },
  { id: "rti", name: "RTI International", category: "International NGOs", logo: "/images/partners/rti.webp", width: 480, height: 213 },
  { id: "engenderhealth", name: "EngenderHealth", category: "International NGOs", logo: "/images/partners/engenderhealth.webp", width: 382, height: 240 },
  { id: "nigerian-red-cross", name: "Nigerian Red Cross Society", category: "National partners", logo: "/images/partners/nigerian-red-cross.webp", width: 240, height: 240 },
  { id: "ukaid", name: "UK aid", category: "Donors & multilaterals", logo: "/images/partners/ukaid.webp", width: 219, height: 240, cmsId: "fcdo-uk" },
  { id: "eleva-capital", name: "Eleva Capital", category: "Private sector", logo: "/images/partners/eleva-capital.webp", width: 480, height: 162 },
  { id: "un-women", name: "UN Women", category: "UN agencies", logo: "/images/partners/un-women.webp", width: 480, height: 237 },
  { id: "christian-aid", name: "Christian Aid", category: "International NGOs", logo: "/images/partners/christian-aid.webp", width: 403, height: 240 },
  { id: "urbc", name: "URBC", category: "Private sector", logo: "/images/partners/urbc.webp", width: 480, height: 165 },
  { id: "hscl", name: "Health Systems Consult Limited", category: "National partners", logo: "/images/partners/hscl.webp", width: 469, height: 240 },
  { id: "gates-foundation", name: "Bill & Melinda Gates Foundation", category: "Donors & multilaterals", logo: "/images/partners/gates-foundation.webp", width: 240, height: 240 },
  { id: "project-hope", name: "Project HOPE", category: "International NGOs", logo: "/images/partners/project-hope.webp", width: 377, height: 240 },
  { id: "mercy-corps", name: "Mercy Corps", category: "International NGOs", logo: "/images/partners/mercy-corps.webp", width: 480, height: 192 },
  { id: "wfp", name: "World Food Programme", category: "UN agencies", logo: "/images/partners/wfp.webp", width: 169, height: 240, cmsId: "wfp" },
];
