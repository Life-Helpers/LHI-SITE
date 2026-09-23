import { LHI_PHOTOS, type LhiPhotoKey } from "@/data/lhi-photos";

/**
 * Humanitarian training courses. Lesson content is taken from LHI's Comprehensive
 * Safeguarding Training (facilitated by Hadiza Ibrahim Yaro, Director, Safeguarding,
 * Accountability & Gender) and the LHI Child Safeguarding Policy.
 *
 * Final-assessment answer keys live server-side in answer-keys.ts, never in this file.
 */

export type LessonBlock =
  | { type: "p"; text: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "callout"; tone: "info" | "warning" | "success"; title: string; text: string }
  | { type: "steps"; title?: string; items: string[] };

export interface CheckQuestion {
  prompt: string;
  options: string[];
  /** Index of the correct option: knowledge checks are practice and give instant feedback. */
  answer: number;
  explain: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  photo: LhiPhotoKey;
  blocks: LessonBlock[];
  check: CheckQuestion[];
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  audience: string;
  facilitator: string;
  photo: LhiPhotoKey;
  passMark: number;
  lessons: Lesson[];
  exam: ExamQuestion[];
}

const safeguarding: Course = {
  id: "comprehensive-safeguarding",
  title: "Comprehensive Safeguarding Training",
  subtitle: "Prevent harm, programme safely, report and act",
  description:
    "LHI's core safeguarding course for staff, volunteers, partners, vendors and community structures: what safeguarding is, who it protects, the do's and don'ts, types of concerns, reporting channels, a survivor-centred approach and prevention measures.",
  level: "Foundation",
  audience: "Staff, volunteers, interns, consultants, vendors and partners",
  facilitator: "Hadiza Ibrahim Yaro, Director, Safeguarding, Accountability & Gender",
  photo: "caseManagement",
  passMark: 100,
  lessons: [
    {
      id: "what-is-safeguarding",
      title: "What is safeguarding, and who does it protect?",
      summary: "The definition LHI works to, and the people every safeguarding measure is designed to protect.",
      minutes: 6,
      photo: "communityDialogue",
      blocks: [
        {
          type: "callout",
          tone: "info",
          title: "Safeguarding",
          text: "Taking reasonable steps and measures to prevent harm, particularly sexual exploitation, abuse and harassment, from occurring. Making sure that all those who come in contact with us are safe from any form of abuse or exploitation.",
        },
        {
          type: "list",
          title: "Safeguarding protects",
          items: [
            "Children",
            "Women and girls",
            "Vulnerable adults",
            "Persons with disabilities",
            "Staff and community members",
            "Associates and vendors",
          ],
        },
        {
          type: "p",
          text: "Under the Nigerian constitution, which LHI abides by, a child is anyone under 18 years of age, irrespective of creed, tribe or religion. Vulnerable adults are persons over 18 who are unable to take care of or protect themselves against harm or exploitation for whatever reason.",
        },
      ],
      check: [
        {
          prompt: "Which best describes safeguarding at LHI?",
          options: [
            "Responding only after abuse has been reported",
            "Taking reasonable steps to prevent harm, especially sexual exploitation, abuse and harassment",
            "Protecting the organisation's reputation",
          ],
          answer: 1,
          explain: "Safeguarding is first about prevention: taking reasonable steps so that harm does not occur.",
        },
        {
          prompt: "Up to what age is a person considered a child under LHI's policy?",
          options: ["Under 16", "Under 18", "Under 21"],
          answer: 1,
          explain: "A child is anyone under 18 years of age, irrespective of creed, tribe or religion.",
        },
      ],
    },
    {
      id: "purpose-of-the-policy",
      title: "Why we have a safeguarding policy",
      summary: "The four purposes of LHI's safeguarding policy.",
      minutes: 6,
      photo: "staffTraining",
      blocks: [
        {
          type: "steps",
          items: [
            "Prevent harm: identify risks early and put measures in place to stop abuse, exploitation, neglect, harassment, discrimination or unsafe practices from happening to children, adults, staff, volunteers and community members.",
            "Ensure safe programming: plan and implement every project activity so it does not expose beneficiaries or staff to danger, through safe recruitment, proper staff conduct, risk assessment, safe distribution points, confidential reporting channels and inclusive, respectful activities.",
            "Promote accountability: staff, volunteers, partners, vendors and community structures are answerable for their actions, and complaints are taken seriously, investigated properly and acted upon without fear, bias or retaliation.",
            "Protect dignity and rights: everyone has the right to respect, fairness and confidentiality. Survivors and complainants are listened to, supported and referred for appropriate services.",
          ],
        },
      ],
      check: [
        {
          prompt: "Which of these is part of “safe programming”?",
          options: ["Choosing distribution points without assessing risks", "Safe distribution points and confidential reporting channels", "Sharing beneficiary details on social media"],
          answer: 1,
          explain: "Safe programming includes risk assessment, safe distribution points and confidential reporting channels.",
        },
        {
          prompt: "When a complaint is made, it should be handled…",
          options: ["Without fear, bias or retaliation", "Only if the complainant is a staff member", "Informally, to avoid paperwork"],
          answer: 0,
          explain: "Complaints are taken seriously, investigated properly and acted upon without fear, bias or retaliation.",
        },
      ],
    },
    {
      id: "core-principles",
      title: "Core principles",
      summary: "The principles that guide every safeguarding decision.",
      minutes: 5,
      photo: "womenGroup",
      blocks: [
        {
          type: "list",
          items: [
            "Do No Harm: activities should never put people at risk.",
            "Best Interest of the Child: decisions must prioritise children's safety and wellbeing.",
            "Zero Tolerance: no abuse or exploitation is acceptable.",
            "Confidentiality: sensitive information is shared only when necessary, on a need-to-know basis.",
            "Accountability: everyone has a duty to report and act on concerns.",
            "Non-discrimination: equal protection for all.",
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "All concerns must be reported and acted upon",
          text: "The protection of children from all forms of violence is both a corporate and an individual responsibility.",
        },
      ],
      check: [
        {
          prompt: "“Confidentiality” in safeguarding means information is shared…",
          options: ["With anyone who asks", "Only on a need-to-know basis", "Never, even with the safeguarding officer"],
          answer: 1,
          explain: "Sensitive information is shared only when necessary, with those who need to know.",
        },
        {
          prompt: "Which principle means activities must never put people at risk?",
          options: ["Do No Harm", "Zero Tolerance", "Accountability"],
          answer: 0,
          explain: "Do No Harm: activities should never put people at risk.",
        },
      ],
    },
    {
      id: "safeguarding-dos",
      title: "Safeguarding do's",
      summary: "Behaviour and conduct, protection and prevention, reporting, and working with children and vulnerable adults.",
      minutes: 7,
      photo: "kitDistribution",
      blocks: [
        {
          type: "list",
          title: "Behaviour & conduct",
          items: [
            "Treat everyone with respect, dignity and fairness",
            "Maintain professional boundaries at all times",
            "Be a positive role model in your behaviour",
            "Promote a safe, inclusive and respectful environment",
          ],
        },
        {
          type: "list",
          title: "Protection & prevention",
          items: [
            "Always prioritise safety (“Do No Harm”)",
            "Ensure beneficiaries know their rights and reporting channels",
            "Take all concerns seriously and act quickly",
            "Identify and reduce risks in activities (distribution, registration, field work)",
          ],
        },
        {
          type: "list",
          title: "Reporting & accountability",
          items: [
            "Report any concern, suspicion or incident immediately",
            "Follow official reporting channels only",
            "Maintain confidentiality (share only on a need-to-know basis)",
            "Support a survivor-centred approach",
          ],
        },
        {
          type: "list",
          title: "Working with children & vulnerable adults",
          items: [
            "Always act in the best interest of the child",
            "Obtain consent before taking photos or sharing information",
            "Work in safe, visible environments and avoid isolated situations",
            "Respect privacy and personal boundaries",
          ],
        },
      ],
      check: [
        {
          prompt: "Before photographing a beneficiary you should…",
          options: ["Obtain consent", "Take the photo and ask later", "Only ask if the photo will be published"],
          answer: 0,
          explain: "Always obtain consent before taking photos or sharing information.",
        },
        {
          prompt: "Where should you work with a child?",
          options: ["In a private, closed room", "In a safe, visible environment", "Anywhere the child chooses"],
          answer: 1,
          explain: "Work in safe, visible environments and avoid isolated situations.",
        },
      ],
    },
    {
      id: "safeguarding-donts",
      title: "Safeguarding don'ts",
      summary: "Zero-tolerance behaviours, unprofessional conduct, mishandling cases and unsafe communication.",
      minutes: 7,
      photo: "activismWomen",
      blocks: [
        {
          type: "callout",
          tone: "warning",
          title: "Abuse & exploitation: zero tolerance",
          text: "Do NOT engage in sexual exploitation or abuse. Do NOT exchange money, jobs or favours for sex. Do NOT have any sexual activity with a child: this is abuse, regardless of the local age of consent, and mistaken belief about a child's age is not a defence.",
        },
        {
          type: "list",
          title: "Unprofessional behaviour",
          items: [
            "Do NOT form personal or intimate relationships with beneficiaries",
            "Do NOT use abusive, discriminatory or inappropriate language",
            "Do NOT misuse your position of power or authority",
          ],
        },
        {
          type: "list",
          title: "Handling safeguarding cases",
          items: [
            "Do NOT ignore, delay or hide incidents",
            "Do NOT investigate cases yourself; report instead",
            "Do NOT share information with unauthorised persons",
          ],
        },
        {
          type: "list",
          title: "Interaction & communication",
          items: [
            "Do NOT be alone unnecessarily with a child or vulnerable person",
            "Do NOT share personal contacts (phone, social media)",
            "Do NOT take photos without proper consent",
          ],
        },
      ],
      check: [
        {
          prompt: "You suspect a colleague of misconduct. What should you do?",
          options: ["Investigate quietly to gather proof first", "Report it through official channels and not investigate yourself", "Confront the colleague publicly"],
          answer: 1,
          explain: "Do NOT investigate cases yourself; report through official channels.",
        },
        {
          prompt: "A beneficiary asks for your personal WhatsApp number. You should…",
          options: ["Share it so they can reach you", "Not share personal contacts; direct them to official channels", "Share it only after working hours"],
          answer: 1,
          explain: "Do NOT share personal contacts (phone, social media) with beneficiaries.",
        },
      ],
    },
    {
      id: "types-of-concerns",
      title: "Types of safeguarding concerns",
      summary: "Recognising physical, emotional and sexual abuse, exploitation, neglect, bullying, harassment and online harm.",
      minutes: 7,
      photo: "motherChildNutrition",
      blocks: [
        {
          type: "list",
          items: [
            "Physical abuse: any harm to the body, e.g. beating, injury, forcing harmful tasks.",
            "Emotional abuse: harm to mental wellbeing, e.g. insults, humiliation, threats.",
            "Sexual exploitation & abuse (PSEA): any sexual activity with a child or exchange of money or goods for sex. A child cannot give consent. Abuse of power is prohibited.",
            "Neglect: failure to provide basic care such as food, supervision or medical care.",
            "Exploitation: forced labour, child labour, human trafficking.",
            "Discrimination: unfair treatment based on gender, disability or background.",
            "Bullying & harassment: repeated harmful or unwanted behaviour, including workplace intimidation.",
            "Digital safeguarding / online abuse: bullying, grooming, or tricking children through phones, social media or the internet; posting children's photos without consent.",
          ],
        },
      ],
      check: [
        {
          prompt: "Posting a child's photo online without consent is an example of…",
          options: ["A digital safeguarding risk", "Good visibility practice", "Neglect"],
          answer: 0,
          explain: "Posting children's photos without consent and sharing personal information are digital safeguarding risks.",
        },
        {
          prompt: "Failure to provide food, supervision or medical care is…",
          options: ["Emotional abuse", "Neglect", "Harassment"],
          answer: 1,
          explain: "Neglect is the failure to provide basic care.",
        },
      ],
    },
    {
      id: "reporting",
      title: "Reporting concerns",
      summary: "Who can report, the channels available, how to respond, and what happens next.",
      minutes: 8,
      photo: "communityLeaders",
      blocks: [
        {
          type: "p",
          text: "Safeguarding reporting is the process of raising concerns, complaints or allegations about abuse, exploitation, neglect, harassment or misconduct affecting beneficiaries, children, staff, volunteers, community members or associates.",
        },
        {
          type: "list",
          title: "Reporting channels",
          items: [
            "Safeguarding Officer",
            "Supervisor or line manager (direct supervisors, team leaders, project coordinators)",
            "Suggestion boxes",
            "Toll-free hotline",
            "Email reporting",
            "Verbal reporting",
          ],
        },
        {
          type: "steps",
          title: "If someone tells you about a concern",
          items: ["Listen carefully", "Maintain confidentiality", "Report immediately to the safeguarding unit", "Avoid investigating personally"],
        },
        {
          type: "callout",
          tone: "info",
          title: "Report immediately, within 48 hours at the latest",
          text: "There is no retaliation for reporting. The reporting flow is: concern identified → report to Safeguarding Officer → immediate risk assessment → investigation initiated → decision and action taken.",
        },
        {
          type: "list",
          title: "What happens after reporting",
          items: [
            "The complaint is documented",
            "Immediate safety risks are assessed",
            "Referral services are provided if needed",
            "An investigation is initiated where necessary",
            "Confidential follow-up is conducted",
            "Corrective actions are implemented",
          ],
        },
      ],
      check: [
        {
          prompt: "Within what time should a safeguarding concern be reported?",
          options: ["Within 48 hours at the latest, immediately where possible", "Within one month", "At the next team meeting"],
          answer: 0,
          explain: "Report immediately, within 48 hours.",
        },
        {
          prompt: "Which is NOT an LHI reporting channel?",
          options: ["Suggestion boxes", "Toll-free hotline", "Posting about it on social media"],
          answer: 2,
          explain: "Use official channels only: safeguarding officer, supervisor, suggestion boxes, hotline, email or verbal report.",
        },
      ],
    },
    {
      id: "survivor-centred-response",
      title: "A survivor-centred approach and disciplinary measures",
      summary: "Putting the survivor first, and the consequences of breaching the policy.",
      minutes: 6,
      photo: "caseManagement",
      blocks: [
        {
          type: "list",
          title: "Survivor-centred approach",
          items: [
            "Safety first: protect the survivor from further harm.",
            "Respect and dignity: treat survivors with compassion, without judgement or blame.",
            "Confidentiality: keep their information private and share only when necessary.",
            "Choice and empowerment: give survivors options and involve them in decisions.",
            "Access to support: connect survivors to medical care, counselling, legal aid or other services.",
            "Non-retaliation: protect survivors from backlash or punishment for speaking up.",
          ],
        },
        {
          type: "list",
          title: "Violations of the policy will result in",
          items: [
            "Verbal warning for minor misconduct",
            "Written warning for repeated or moderate violations",
            "Suspension (with or without pay) pending investigation",
            "Termination of employment or contract for serious violations",
            "Blacklisting from future engagement with the organisation",
            "Referral to law enforcement agencies where criminal acts are involved",
          ],
        },
      ],
      check: [
        {
          prompt: "In a survivor-centred approach, the immediate priority is…",
          options: ["Collecting evidence", "The survivor's safety", "Informing the media"],
          answer: 1,
          explain: "Safety first: the immediate priority is to protect the survivor from further harm.",
        },
        {
          prompt: "Where a criminal act is involved, LHI will…",
          options: ["Handle it internally only", "Refer it to law enforcement agencies", "Ask the survivor to settle with the perpetrator"],
          answer: 1,
          explain: "Criminal acts are referred to law enforcement agencies.",
        },
      ],
    },
    {
      id: "prevention-and-commitment",
      title: "Prevention measures and our commitment",
      summary: "Safe recruitment, training, community awareness, and the pledge to protect, report and act.",
      minutes: 5,
      photo: "teamStrategicPlan",
      blocks: [
        {
          type: "list",
          title: "1. Safe recruitment",
          items: ["Background checks (references, screening)", "Signing of the Code of Conduct", "Clear job descriptions with safeguarding responsibilities"],
        },
        {
          type: "list",
          title: "2. Staff training & awareness",
          items: ["Induction for new staff", "Regular safeguarding and PSEA training", "Continuous refresher sessions", "Safeguarding consultation"],
        },
        {
          type: "list",
          title: "3. Community awareness",
          items: ["Inform beneficiaries of their rights", "Explain what abuse is and how to report", "Use local languages and simple messages"],
        },
        {
          type: "callout",
          tone: "success",
          title: "Key takeaways",
          text: "Safeguarding is everyone's duty. Zero tolerance. Always report. My commitment: I will PROTECT. I will REPORT. I will ACT.",
        },
      ],
      check: [
        {
          prompt: "Which is a safe-recruitment measure?",
          options: ["Background and reference checks", "Hiring without references to save time", "Skipping the Code of Conduct for volunteers"],
          answer: 0,
          explain: "Safe recruitment includes background checks, the Code of Conduct and clear job descriptions.",
        },
      ],
    },
  ],
  exam: [
    { id: "s1", prompt: "What is the main aim of safeguarding?", options: ["To respond to abuse after it happens", "To prevent harm, particularly sexual exploitation, abuse and harassment", "To protect LHI's funding", "To monitor staff attendance"] },
    { id: "s2", prompt: "Who does LHI's safeguarding protect?", options: ["Only children", "Only beneficiaries", "Children, women and girls, vulnerable adults, persons with disabilities, staff, community members, associates and vendors", "Only staff"] },
    { id: "s3", prompt: "A child, under LHI's policy, is anyone under the age of…", options: ["15", "16", "18", "21"] },
    { id: "s4", prompt: "Which principle means no abuse or exploitation is acceptable?", options: ["Do No Harm", "Zero Tolerance", "Confidentiality", "Best Interest of the Child"] },
    { id: "s5", prompt: "You want to photograph a child at a distribution. What must you do first?", options: ["Nothing: photos are allowed at public events", "Obtain proper consent", "Ask a colleague", "Blur the photo later"] },
    { id: "s6", prompt: "A community member reports that a volunteer is exchanging food items for sex. What do you do?", options: ["Investigate the volunteer yourself", "Report immediately through official channels", "Warn the volunteer privately", "Wait for more evidence"] },
    { id: "s7", prompt: "Which of these is sexual exploitation and abuse?", options: ["Exchanging money, jobs or favours for sex", "Delivering training late", "Missing a meeting", "Using a local language"] },
    { id: "s8", prompt: "What is the latest time within which a concern should be reported?", options: ["48 hours", "One week", "Two weeks", "At the end of the project"] },
    { id: "s9", prompt: "Which is an official LHI reporting channel?", options: ["A public social media post", "The toll-free hotline", "A community rumour", "A personal WhatsApp group"] },
    { id: "s10", prompt: "In a survivor-centred approach, survivors are…", options: ["Asked to prove their case publicly", "Given options and involved in decisions, with confidentiality and protection from retaliation", "Moved without consent", "Referred to the perpetrator's family"] },
    { id: "s11", prompt: "Grooming or tricking a child through phones or social media is…", options: ["Digital safeguarding / online abuse", "Neglect", "Acceptable if the child agrees", "Emotional support"] },
    { id: "s12", prompt: "Which is NOT one of the disciplinary measures for breaches?", options: ["Written warning", "Suspension pending investigation", "Referral to law enforcement for criminal acts", "A salary increase"] },
    { id: "s13", prompt: "Which is a key safeguarding prevention measure?", options: ["Safe recruitment with background checks", "Removing suggestion boxes", "Working alone with children", "Sharing beneficiary data widely"] },
    { id: "s14", prompt: "“Do No Harm” means…", options: ["Activities should never put people at risk", "Only doctors are responsible for harm", "Harm is acceptable if outcomes are good", "Reporting is optional"] },
    { id: "s15", prompt: "Complete the LHI safeguarding commitment: “I will PROTECT, I will REPORT, I will …”", options: ["WAIT", "ACT", "IGNORE", "INVESTIGATE ALONE"] },
  ],
};

const childSafeguardingPolicy: Course = {
  id: "child-safeguarding-policy",
  title: "Child Safeguarding Policy Essentials",
  subtitle: "Your responsibilities under LHI's Child Safeguarding Policy",
  description:
    "A guided walkthrough of the LHI Child Safeguarding Policy: who it applies to, what every representative must and must never do, how concerns are reported and investigated, and how safeguarding is built into training and project design.",
  level: "Foundation",
  audience: "Everyone who represents LHI, including trustees, contractors and visitors",
  facilitator: "LHI Safeguarding, Accountability & Gender Unit",
  photo: "pledgeSchool",
  passMark: 100,
  lessons: [
    {
      id: "scope-and-objectives",
      title: "Objectives and scope of the policy",
      summary: "Why the policy exists and who must follow it.",
      minutes: 5,
      photo: "schoolAssembly",
      blocks: [
        {
          type: "p",
          text: "The policy sets out clear responsibilities so that all staff, operations and programmes do no harm to children: they do not expose children to the risk of harm and abuse, and any concerns about children's safety in the communities where LHI works are reported to the appropriate authorities.",
        },
        {
          type: "list",
          title: "The policy covers anybody who represents LHI",
          items: [
            "All staff: permanent, project, volunteers and interns",
            "Contractors and consultants on short-term contracts",
            "Trustees, stakeholders and board members",
            "Partner agencies with a formal relationship involving contact with children",
            "Donors, journalists, celebrities, politicians and other visitors, who must be briefed on the policy",
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Professional and personal life",
          text: "All LHI staff and representatives must act in accordance with this policy in both their professional and their personal lives. Accepting an appointment letter means accepting its requirements.",
        },
      ],
      check: [
        {
          prompt: "Does the Child Safeguarding Policy apply to visiting journalists and donors?",
          options: ["No, only to staff", "Yes: they must be briefed and act in accordance with it", "Only if they stay overnight"],
          answer: 1,
          explain: "Visitors who may come into contact with children must be briefed and act in accordance with the policy.",
        },
      ],
    },
    {
      id: "must-and-must-never",
      title: "What representatives must and must never do",
      summary: "The basic requirements and rules of conduct towards children.",
      minutes: 8,
      photo: "girlsLearning",
      blocks: [
        {
          type: "list",
          title: "All staff and representatives must",
          items: [
            "Report concerns that a child is a survivor of abuse or sexual exploitation immediately, in accordance with local procedures",
            "Undertake induction and training on the policy relevant to their position",
            "Cooperate fully and confidentially in any investigation",
            "Identify, minimise and avoid potential situations of risk for children",
            "Ensure images of children are respectful, that children are adequately clothed and that suggestive poses are avoided",
            "Ensure no image or case history places a child at risk",
          ],
        },
        {
          type: "list",
          title: "Staff and representatives must never",
          items: [
            "Hit or otherwise physically assault or abuse children",
            "Engage in any sexual activity with anyone under 18, regardless of the local age of consent; mistaken belief in age is not a defence",
            "Develop relationships with children that could be deemed exploitative or abusive",
            "Use language, suggestions or advice that is inappropriate, offensive or abusive",
            "Have a child stay overnight at their home, unless necessary and agreed with management for the child's safety",
            "Act in ways intended to shame, humiliate, belittle or degrade children",
            "Discriminate against or favour particular children",
            "Act as a negotiator in a financial settlement between a child victim's family and the perpetrator",
            "Spend excessive time alone with children away from others, including in vehicles, without prior approval",
          ],
        },
      ],
      check: [
        {
          prompt: "A staff member believed a 16-year-old was 19. Is that a defence for sexual activity?",
          options: ["Yes", "No: mistaken belief in the child's age is not a defence", "Only if the local age of consent is 16"],
          answer: 1,
          explain: "Mistaken belief in the age of the child is not a defence.",
        },
        {
          prompt: "A family asks you to help negotiate money from the person who abused their child. You should…",
          options: ["Help to keep the peace", "Refuse: staff must never act as a negotiator in such a settlement, and report the case", "Ask for a share"],
          answer: 1,
          explain: "Staff must never negotiate or assist financial settlements between a victim's family and a perpetrator.",
        },
      ],
    },
    {
      id: "reporting-and-investigation",
      title: "Reporting, response and investigation",
      summary: "The reporting flow, case management and how allegations are substantiated.",
      minutes: 7,
      photo: "caseManagement",
      blocks: [
        {
          type: "steps",
          title: "Safeguarding reporting flow",
          items: [
            "Concern identified",
            "Report to the Safeguarding Officer",
            "Immediate risk assessment",
            "Investigation initiated",
            "Decision and action taken",
          ],
        },
        {
          type: "list",
          title: "LHI will ensure",
          items: [
            "Immediate safety of the survivor",
            "A confidential and survivor-centred response",
            "Referral to appropriate services (health, legal, psychosocial)",
            "Proper documentation of all actions",
            "Follow-up and case closure",
          ],
        },
        {
          type: "steps",
          title: "Substantiating an allegation",
          items: [
            "Investigate: the Safeguarding Director consults the Executive Director, the individual is informed of the allegation, and information is secured.",
            "Collect evidence: carried out by head office; external parties only with the Safeguarding Director's approval.",
            "Report: a timely report shared only with the Executive Director, Board and others with a need to know.",
            "Action: determined with the relevant Director and the Executive Director.",
          ],
        },
      ],
      check: [
        {
          prompt: "Who receives the investigation report?",
          options: ["All staff", "Only the Executive Director, the Board and others with a need to know", "Local media"],
          answer: 1,
          explain: "Reports are disclosed only to those with a need to know, protecting everyone including those later found innocent.",
        },
      ],
    },
    {
      id: "disciplinary-committee",
      title: "The safeguarding disciplinary committee",
      summary: "Who sits on the committee and how decisions are approved.",
      minutes: 5,
      photo: "conference",
      blocks: [
        {
          type: "list",
          title: "Composition",
          items: [
            "Executive Director: Chairperson, final oversight",
            "Safeguarding Director: presents findings, ensures compliance",
            "Human Resource Officer: guides disciplinary procedure",
            "Programme Manager: programme context",
            "M&E Officer: documentation and data integrity",
            "Legal Adviser (if available)",
            "Director, Audit: checks procedures were followed, documented and free from bias",
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Safeguards on the process",
          text: "At least one female member must sit on the committee. Members must have no direct involvement in the case. Decisions are endorsed by the Executive Director, communicated through HR, and documented and stored securely by the Safeguarding Officer.",
        },
      ],
      check: [
        {
          prompt: "Which is a requirement for the disciplinary committee?",
          options: ["At least one female member", "Members must be friends of the accused", "Decisions are announced publicly"],
          answer: 0,
          explain: "At least one female member must be part of the committee to ensure gender sensitivity.",
        },
      ],
    },
    {
      id: "safeguarding-in-programmes",
      title: "Safeguarding in training and programme design",
      summary: "Making every activity safe, inclusive and protective by design.",
      minutes: 5,
      photo: "vslaWomenMeeting",
      blocks: [
        {
          type: "list",
          title: "During training activities",
          items: [
            "Safe, accessible and inclusive training environments, especially for women, children and vulnerable groups",
            "A safe, private and comfortable space for breastfeeding mothers, and childcare support where feasible",
            "Flexible schedules responsive to caregivers",
            "Facilitators and staff adhere to safeguarding principles and the code of conduct",
          ],
        },
        {
          type: "list",
          title: "In project design and budgeting",
          items: [
            "Safeguarding training for staff, volunteers and partners in all projects",
            "Dedicated budget lines for training, IEC materials, feedback mechanisms (hotline, suggestion boxes) and survivor support",
            "Risk assessments for all activities",
            "Monitoring and reporting on safeguarding compliance throughout the project",
          ],
        },
        {
          type: "callout",
          tone: "success",
          title: "Our commitment",
          text: "Safeguarding is not optional but a core programmatic requirement. LHI commits to ensuring all interventions are safe, inclusive and protective by design. The policy is reviewed every two years.",
        },
      ],
      check: [
        {
          prompt: "How often is the safeguarding policy reviewed?",
          options: ["Every 2 years", "Every 10 years", "Never"],
          answer: 0,
          explain: "Monitoring and compliance includes a periodic policy review every two years.",
        },
      ],
    },
  ],
  exam: [
    { id: "c1", prompt: "Who must comply with LHI's Child Safeguarding Policy?", options: ["Only programme staff", "Everyone who represents LHI, including trustees, contractors, volunteers and partners with contact with children", "Only the Safeguarding Unit", "Only staff in Sokoto"] },
    { id: "c2", prompt: "The policy applies to staff…", options: ["Only during working hours", "In both their professional and their personal lives", "Only when travelling", "Only in the office"] },
    { id: "c3", prompt: "Which must staff NEVER do?", options: ["Report concerns immediately", "Spend excessive time alone with children away from others without approval", "Attend safeguarding training", "Use respectful language"] },
    { id: "c4", prompt: "When taking images of children, staff must ensure…", options: ["Children are adequately clothed, images are respectful and suggestive poses are avoided", "Images are as dramatic as possible", "Faces and names are always shown", "Nothing in particular"] },
    { id: "c5", prompt: "What comes immediately after a concern is reported to the Safeguarding Officer?", options: ["Case closure", "An immediate risk assessment", "A press release", "Disciplinary action"] },
    { id: "c6", prompt: "Who may approve involving external parties in an investigation?", options: ["Any staff member", "The Safeguarding Director", "The accused", "The media"] },
    { id: "c7", prompt: "Which is a composition rule for the disciplinary committee?", options: ["Members must have no direct involvement in the case", "The accused chairs the committee", "Only men may sit", "No records are kept"] },
    { id: "c8", prompt: "Which support should training activities provide?", options: ["A private space for breastfeeding mothers", "No breaks", "Fixed schedules regardless of caregivers", "Sessions in isolated places"] },
    { id: "c9", prompt: "What should every project budget include?", options: ["Dedicated safeguarding budget lines", "Nothing for safeguarding", "Only publicity costs", "Only transport"] },
    { id: "c10", prompt: "How often is the policy reviewed?", options: ["Every 2 years", "Every year", "Every 5 years", "Only after an incident"] },
  ],
};

const gbvHumanitarian: Course = {
  id: "gbv-in-humanitarian-settings",
  title: "Gender-Based Violence in Humanitarian Settings",
  subtitle: "Understanding, preventing and responding to GBV in emergencies",
  description:
    "What GBV is, why crises increase the risk, its impact on survivors, families and communities, the international frameworks that guide humanitarian action, how to prevent and mitigate risks across sectors, the response services survivors need, and the roles of humanitarian actors and Local Emergency Management Committees (LEMCs).",
  level: "Foundation",
  audience: "Staff, volunteers, LEMC members, community leaders and humanitarian partners",
  facilitator: "Hadiza Ibrahim Yaro, Director, Safeguarding, Accountability & Gender",
  photo: "activismWomen",
  passMark: 100,
  lessons: [
    {
      id: "understanding-gbv",
      title: "Understanding gender-based violence",
      summary: "Why GBV matters in crises, what it is, and the forms it takes.",
      minutes: 6,
      photo: "activismMarch",
      blocks: [
        {
          type: "p",
          text: "Gender-based violence is widespread in crises because of insecurity, displacement and the breakdown of the systems that normally protect people. Addressing GBV is essential to save lives and protect dignity.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Definition",
          text: "Gender-based violence (GBV) is any harmful act based on gender that results in physical, sexual, psychological or economic harm. Examples include rape, exploitation, early or forced marriage, and denial of resources.",
        },
        {
          type: "list",
          title: "Forms of GBV",
          items: [
            "Physical violence: beating, killing",
            "Sexual violence: rape, exploitation, trafficking",
            "Psychological abuse: intimidation, humiliation",
            "Economic abuse: denial of work or resources",
            "Harmful practices: female genital mutilation (FGM), child marriage",
          ],
        },
      ],
      check: [
        {
          prompt: "Which best defines gender-based violence?",
          options: [
            "Any harmful act based on gender that results in physical, sexual, psychological or economic harm",
            "Only physical fights between men",
            "Any disagreement within a family",
          ],
          answer: 0,
          explain: "GBV covers physical, sexual, psychological and economic harm based on gender.",
        },
        {
          prompt: "Denying a woman access to work or money is an example of…",
          options: ["Economic abuse", "A harmful practice", "Not GBV"],
          answer: 0,
          explain: "Denial of work or resources is economic abuse.",
        },
        {
          prompt: "Child marriage and FGM are classified as…",
          options: ["Psychological abuse", "Harmful practices", "Economic abuse"],
          answer: 1,
          explain: "FGM and child marriage are harmful practices.",
        },
      ],
    },
    {
      id: "gbv-in-crises",
      title: "GBV in humanitarian contexts and its impact",
      summary: "What makes people more vulnerable during emergencies, and how GBV harms individuals, families, communities and society.",
      minutes: 6,
      photo: "hubAerial",
      blocks: [
        {
          type: "list",
          title: "Vulnerability increases because of",
          items: [
            "Displacement and overcrowding",
            "Loss of family and community protection",
            "Poverty and lack of resources",
            "Insecurity and weak law enforcement",
          ],
        },
        {
          type: "list",
          title: "The impact of GBV",
          items: [
            "Individual: trauma, injuries, unwanted pregnancies, sexually transmitted infections and stigma",
            "Family: broken trust and economic burden",
            "Community: fear, exclusion of women and reduced resilience",
            "Society: GBV undermines peace and recovery",
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "Remember",
          text: "GBV is life-threatening and a violation of human rights. Its effects reach far beyond the survivor.",
        },
      ],
      check: [
        {
          prompt: "Which of these increases the risk of GBV in an emergency?",
          options: ["Displacement and overcrowding", "Strong law enforcement", "Stable family networks"],
          answer: 0,
          explain: "Displacement, loss of protection, poverty and insecurity all raise vulnerability.",
        },
        {
          prompt: "At community level, GBV can lead to…",
          options: ["Fear, exclusion of women and reduced resilience", "Higher incomes", "Better coordination"],
          answer: 0,
          explain: "Communities experience fear, exclusion of women and reduced resilience.",
        },
      ],
    },
    {
      id: "frameworks-and-prevention",
      title: "International frameworks, risk mitigation and prevention",
      summary: "The standards that guide humanitarian action on GBV, and how every sector can reduce risk.",
      minutes: 7,
      photo: "communityDialogue",
      blocks: [
        {
          type: "list",
          title: "International frameworks",
          items: [
            "CEDAW: the rights of women",
            "UN Security Council Resolution 1325: Women, Peace and Security",
            "IASC GBV Guidelines: GBV in humanitarian action",
            "Sphere Standards: protection principles",
          ],
        },
        {
          type: "list",
          title: "Risk mitigation and prevention",
          items: [
            "Integrate GBV risk reduction across sectors: WASH, shelter, food and livelihoods",
            "Ensure safe facilities: lighting, separate latrines and safe spaces",
            "Community awareness and engagement",
            "Involve men and boys in prevention",
          ],
        },
        {
          type: "callout",
          tone: "success",
          title: "Case example",
          text: "A safe space for women in an IDP camp led to increased reporting of GBV and stronger peer support among women.",
        },
      ],
      check: [
        {
          prompt: "Which framework focuses on Women, Peace and Security?",
          options: ["UNSCR 1325", "Sphere Standards", "CEDAW"],
          answer: 0,
          explain: "UN Security Council Resolution 1325 is the Women, Peace and Security agenda.",
        },
        {
          prompt: "Which is a practical risk-mitigation measure in a camp?",
          options: ["Good lighting and separate latrines for women and men", "Shared unlit latrines", "Distributions at night in isolated places"],
          answer: 0,
          explain: "Safe facilities with lighting, separate latrines and safe spaces reduce risk.",
        },
        {
          prompt: "Who should be involved in GBV prevention?",
          options: ["Only women", "Everyone, including men and boys", "Only the police"],
          answer: 1,
          explain: "Involving men and boys is a core prevention strategy.",
        },
      ],
    },
    {
      id: "response-services",
      title: "GBV response services and referral pathways",
      summary: "The core services survivors need and why clear referral systems matter.",
      minutes: 6,
      photo: "healthScreening",
      blocks: [
        {
          type: "list",
          title: "Response services",
          items: [
            "Health: clinical management of rape and trauma care",
            "Protection: case management and safe shelters",
            "Psychosocial: counselling and support groups",
            "Referral pathways: clear systems that link survivors to services",
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "A survivor-centred approach",
          text: "Put the survivor's safety, dignity, confidentiality and choices first. Refer with the survivor's consent to the services they want, and never share their information without it.",
        },
      ],
      check: [
        {
          prompt: "Clinical management of rape belongs to which response service?",
          options: ["Health", "Livelihoods", "Education"],
          answer: 0,
          explain: "Clinical management of rape and trauma care are health services.",
        },
        {
          prompt: "What is the purpose of a referral pathway?",
          options: ["To link survivors to health, protection and psychosocial services", "To publish survivors' names", "To replace all services"],
          answer: 0,
          explain: "Referral pathways are clear systems that connect survivors to the support they need.",
        },
      ],
    },
    {
      id: "roles-and-lemcs",
      title: "Roles of humanitarian actors and LEMCs",
      summary: "What organisations and Local Emergency Management Committees can do, the challenges, and recommendations.",
      minutes: 7,
      photo: "communityLeaders",
      blocks: [
        {
          type: "list",
          title: "Role of humanitarian actors",
          items: [
            "Mainstream GBV risk mitigation in all programmes",
            "Train staff on PSEA (Prevention of Sexual Exploitation and Abuse)",
            "Establish safe and confidential reporting channels",
            "Collaborate with government, civil society and traditional leaders",
          ],
        },
        {
          type: "list",
          title: "Role of the Local Emergency Management Committee (LEMC)",
          items: [
            "Awareness creation: educating communities on GBV and how to report",
            "Coordination: linking survivors to health, protection and legal services",
            "Community mobilisation: engaging gatekeepers, leaders, youth and women's groups",
            "Early warning and referrals: identifying risks and guiding survivors to support services",
          ],
        },
        {
          type: "list",
          title: "Challenges in addressing GBV",
          items: [
            "Stigma and cultural barriers",
            "Under-reporting due to fear or shame",
            "Insecurity in conflict zones",
            "Weak coordination among actors",
            "Limited resources and services",
          ],
        },
        {
          type: "list",
          title: "Recommendations",
          items: [
            "Strengthen coordination through the GBV sub-cluster and protection cluster",
            "Increase funding for GBV services",
            "Build the capacity of local actors and LEMCs",
            "Use a survivor-centred approach",
            "Monitoring and accountability",
          ],
        },
        {
          type: "callout",
          tone: "success",
          title: "Key message",
          text: "There is no humanitarian response without protection, and no protection without addressing GBV. Collaboration means stronger protection.",
        },
        {
          type: "steps",
          title: "Group activity (for facilitated sessions)",
          items: [
            "In groups of 4–6, identify common forms of GBV in humanitarian settings in your community.",
            "Discuss the main barriers survivors face in reporting or accessing services.",
            "Agree at least two practical strategies your group could apply to prevent or respond to GBV.",
            "Present your findings in plenary (5 minutes per group).",
          ],
        },
      ],
      check: [
        {
          prompt: "Which is a role of the LEMC?",
          options: ["Early warning and referrals", "Investigating and punishing perpetrators themselves", "Keeping GBV cases secret from services"],
          answer: 0,
          explain: "LEMCs raise awareness, coordinate, mobilise communities, and provide early warning and referrals.",
        },
        {
          prompt: "Why is GBV often under-reported?",
          options: ["Fear and shame", "Too many reporting channels", "Survivors prefer not to receive help"],
          answer: 0,
          explain: "Fear, shame, stigma and cultural barriers keep many survivors silent.",
        },
      ],
    },
  ],
  exam: [
    { id: "g1", prompt: "Gender-based violence is any harmful act based on gender that results in…", options: ["Only physical injury", "Physical, sexual, psychological or economic harm", "Only financial loss", "Only harm to men"] },
    { id: "g2", prompt: "Trafficking and exploitation are forms of…", options: ["Economic abuse", "Sexual violence", "Harmful practices", "Psychological abuse"] },
    { id: "g3", prompt: "Intimidation and humiliation are forms of…", options: ["Psychological abuse", "Physical violence", "Economic abuse", "Harmful practices"] },
    { id: "g4", prompt: "Which is NOT a reason vulnerability to GBV rises in humanitarian settings?", options: ["Displacement and overcrowding", "Loss of family protection", "Strong law enforcement", "Poverty"] },
    { id: "g5", prompt: "At the individual level, GBV can cause…", options: ["Trauma, injuries, unwanted pregnancies, STIs and stigma", "Better health", "Increased income", "No lasting effects"] },
    { id: "g6", prompt: "Which framework protects the rights of women?", options: ["Sphere Standards", "CEDAW", "IASC Guidelines", "UNSCR 1325"] },
    { id: "g7", prompt: "The IASC GBV Guidelines relate to…", options: ["Humanitarian action", "Tax law", "School curricula", "Road safety"] },
    { id: "g8", prompt: "Which is a GBV risk-mitigation measure?", options: ["Remove lighting from camps", "Integrate GBV risk reduction into WASH, shelter, food and livelihoods", "Hold distributions in isolated places", "Exclude men and boys from all activities"] },
    { id: "g9", prompt: "Case management and safe shelters are part of which response service?", options: ["Health", "Protection", "Psychosocial", "Livelihoods"] },
    { id: "g10", prompt: "Counselling and support groups are…", options: ["Psychosocial services", "Legal services", "Health services", "Food assistance"] },
    { id: "g11", prompt: "Humanitarian actors should…", options: ["Handle reports publicly", "Establish safe and confidential reporting channels", "Avoid working with traditional leaders", "Skip PSEA training"] },
    { id: "g12", prompt: "Which is a role of the Local Emergency Management Committee?", options: ["Coordination: linking survivors to health, protection and legal services", "Collecting fees from survivors", "Deciding cases in court", "Publishing survivors' names"] },
    { id: "g13", prompt: "Which is a recognised challenge in addressing GBV?", options: ["Too much funding", "Under-reporting due to fear or shame", "Too few actors", "Survivors refuse all help"] },
    { id: "g14", prompt: "Which recommendation strengthens coordination?", options: ["Working through the GBV sub-cluster and protection cluster", "Each actor working alone", "Ending monitoring", "Reducing funding"] },
    { id: "g15", prompt: "Complete the key message: \"There is no humanitarian response without protection, and no protection without…\"", options: ["More food", "Addressing GBV", "New buildings", "Media coverage"] },
  ],
};

export const COURSES: Course[] = [safeguarding, childSafeguardingPolicy, gbvHumanitarian];

export function getCourse(id: string) {
  return COURSES.find((c) => c.id === id);
}

export function coursePhoto(course: Course | Lesson) {
  return LHI_PHOTOS[course.photo];
}
