/**
 * Seed questions and answers for /faq and the About page (Admin → FAQs).
 */
export interface FaqItem {
  id: string;
  category: "organization" | "programs" | "donations";
  question: string;
  answer: string;
  tags?: string[];
  featured?: boolean;
}

export const FAQ_DATA: FaqItem[] = [
  // 1. ORGANIZATION
  {
    id: "org-1",
    category: "organization",
    question: "What is Life Helpers Initiative (LHI) and what is its mission?",
    answer:
      "Life Helpers Initiative (LHI) is a Nigerian non-governmental, not-for-profit organisation founded on 1 October 2004 as the Beulah Project, supporting children at the orphanage in Sokoto, and registered with the Corporate Affairs Commission as CAC/IT/25232 in September 2007. Our vision is a more fulfilled life for everyone; our mission is to be a leading non-governmental organisation working to maximise all opportunities to empower marginalised people.",
    tags: ["mission", "about", "registration", "mandate"],
    featured: true,
  },
  {
    id: "org-2",
    category: "organization",
    question: "Where is LHI headquartered and in which Nigerian states does it operate?",
    answer:
      "Our headquarters is at the Goshen Development Center, Tamaje Gagi, Old Airport Area, Eastern Bypass Road, Sokoto. LHI works across 11 states: Sokoto, Adamawa, Bauchi, Borno, Ebonyi, the FCT, Katsina, Kebbi, Plateau, Yobe and Zamfara. See the contact page for every office address.",
    tags: ["headquarters", "sokoto", "locations", "coverage"],
    featured: true,
  },
  {
    id: "org-3",
    category: "organization",
    question: "Is Life Helpers Initiative legally registered and compliant with Nigerian regulators?",
    answer:
      "Yes. LHI is registered with the Corporate Affairs Commission (CAC/IT/25232, September 2007). Registration, tax and accountability documents are available to partners through the Partner & Bidder Portal.",
    tags: ["cac", "legal", "scuml", "compliance"],
  },
  {
    id: "org-4",
    category: "organization",
    question: "How is LHI governed and are your financial audits publicly accessible?",
    answer:
      "LHI is governed by a Board of Trustees and led by a management team headed by the National Executive Director. Our annual report is published on the Impact page, and compliance documents for due diligence are available through the Partner & Bidder Portal.",
    tags: ["governance", "board", "audit", "accountability"],
  },
  {
    id: "org-5",
    category: "organization",
    question: "What safeguarding and ethical standards does LHI enforce?",
    answer:
      "LHI has zero tolerance for sexual exploitation, abuse and harassment. Our safeguarding and PSEA policies apply to all staff, volunteers, interns, consultants, vendors and partners, who are trained and sign our code of conduct. Anyone can take our free safeguarding courses in the Humanitarian Training centre, and concerns can be raised confidentially at psea@lhinigeria.org.",
    tags: ["safeguarding", "psea", "ethics", "child-protection"],
  },

  // 2. PROGRAMS & OPERATIONS
  {
    id: "prog-1",
    category: "programs",
    question: "What are LHI's key core thematic programmatic areas?",
    answer:
      "LHI works in six thematic areas:\n1. Health: MNCH, nutrition, WASH, immunisation, malaria, SRH, HIV/AIDS and TB.\n2. Education: early child development, formal and non-formal education, education governance and complementary services.\n3. Livelihoods: technical and vocational training, savings and loan associations, entrepreneurship, financial literacy and multi-purpose cash assistance.\n4. Food Security: agriculture, small ruminants and aquaculture, food supplies and climate adaptation.\n5. Protection: violence against women and girls, and child protection.\n6. Social Inclusion: governance, peacebuilding and high-level advocacy.",
    tags: ["thematic areas", "thematic", "health", "education", "protection", "livelihoods"],
    featured: true,
  },
  {
    id: "prog-2",
    category: "programs",
    question: "What is the NIDAKE Pad Social Enterprise?",
    answer:
      "NIDAKE is LHI's locally made reusable sanitary pad, produced at the Goshen Development Centre, Tamaje Bye Pass, Sokoto (\"For you, for me, for every woman\"). It gives girls and women a washable, affordable option. For orders, call 0706 650 3228 or email nidakesanipad@gmail.com.",
    tags: ["nidake", "menstrual-health", "sanitary-pads", "girls", "enterprise"],
    featured: true,
  },
  {
    id: "prog-3",
    category: "programs",
    question: "How does LHI ensure community ownership and cultural sensitivity?",
    answer:
      "We work through community structures: traditional and religious leaders, Community-Based Management Committees, facility management committees, savings groups and women's and youth groups. For example, the Gidan Arziki hub in Batagarawa is run with a 20-member Facility Management Committee, and ABEP trained 164 CBMC members to support learners.",
    tags: ["community", "traditional-leaders", "sustainability", "co-design"],
  },
  {
    id: "prog-4",
    category: "programs",
    question: "How does LHI respond to rapid humanitarian emergencies and IDP crises?",
    answer:
      "LHI has delivered emergency responses with partners such as UNOCHA, IRC, ECHO and UNICEF, including multi-sector assistance, nutrition and dignity kits for displaced people. We coordinate with the State Emergency Management Agency and humanitarian clusters, and our education programme includes a crisis modifier for emergency radio learning.",
    tags: ["humanitarian", "emergency", "idp", "flooding", "relief"],
  },
  {
    id: "prog-5",
    category: "programs",
    question: "How can other organizations, agencies, or corporations partner with LHI?",
    answer:
      "LHI works with UN agencies, bilateral donors, international NGOs, government and the private sector. Visit the Partner & Bidder Portal for our compliance documents and to submit a consortium expression of interest, or email official@lhinigeria.org.",
    tags: ["partnerships", "un-agencies", "csr", "collaboration"],
  },

  // 3. DONATIONS & FINANCIAL TRANSPARENCY
  {
    id: "don-1",
    category: "donations",
    question: "How are donations utilized and what percentage goes directly to beneficiaries?",
    answer:
      "Donations fund LHI's programmes and the systems that keep them accountable. You can choose where your gift goes on the donation page, and our annual report describes our work each year. For questions about a specific gift, email official@lhinigeria.org.",
    tags: ["transparency", "allocation", "percentages", "stewardship"],
    featured: true,
  },
  {
    id: "don-2",
    category: "donations",
    question: "What payment methods are accepted for online and offline donations?",
    answer:
      "We offer multiple convenient and secure donation channels:\n1. Secure Online Card Payments: Powered by Stripe, accepting Visa, Mastercard, Verve, and American Express with 256-bit SSL encryption.\n2. Direct Bank Transfers: Dedicated bank accounts for domestic Nigerian Naira (NGN) transfers and domiciliary accounts for international wires (USD, GBP, EUR).\n3. Recurring Monthly Contributions: Automated recurring donations that can be modified or canceled anytime.",
    tags: ["payment-methods", "stripe", "cards", "bank-transfer"],
    featured: true,
  },
  {
    id: "don-3",
    category: "donations",
    question: "Can I donate in foreign currencies (USD, GBP, EUR) as well as Nigerian Naira (NGN)?",
    answer:
      "Yes. Our donation platform supports multi-currency transactions. You can select Nigerian Naira (NGN), US Dollars (USD), British Pounds (GBP), or Euros (EUR). The platform automatically converts and processes your transaction securely using real-time competitive exchange rates.",
    tags: ["currencies", "naira", "usd", "gbp", "eur", "international"],
  },
  {
    id: "don-4",
    category: "donations",
    question: "Will I receive a donation receipt and tax acknowledgment?",
    answer:
      "Yes. Immediately after a successful online contribution, an official digital receipt is automatically generated and emailed to you. For bank wire transfers, our finance desk issues an official signed acknowledgment letter and receipt within 24 to 48 hours of confirmation.",
    tags: ["receipt", "tax", "acknowledgment", "documentation"],
  },
  {
    id: "don-5",
    category: "donations",
    question: "Can I designate my donation to a specific cause or emergency appeal?",
    answer:
      "Yes. When donating, you can select specific allocations such as 'Where Needed Most', 'Health & Nutrition', 'Girl-Child Education', 'NIDAKE Menstrual Hygiene Kits', or 'Emergency Rapid Response'. 100% of your designated contribution goes directly to the selected program area.",
    tags: ["designation", "earmarked", "nidake", "emergency-appeal"],
  },
  {
    id: "don-6",
    category: "donations",
    question: "How do I set up recurring monthly donations or corporate gift matching?",
    answer:
      "On the donation page, choose the monthly option to give every month. For corporate giving or partnerships, contact us at official@lhinigeria.org.",
    tags: ["monthly", "recurring", "corporate-giving", "sponsorship"],
  },
];
