import type { Reference } from "@/lib/learn";

// Official and public sources used by the Learn lessons. Facts were checked in September 2026.
export const REF = {
  irdTaxChart: {
    title: "Tax rates chart, Y/A 2025/26",
    publisher: "Inland Revenue Department",
    url: "https://www.ird.gov.lk/en/publications/SitePages/tax_chart_2526.aspx?menuid=1404",
  },
  irdNotice2026: {
    title: "Notice SEC/PN/IT/2026/02: Inland Revenue (Amendment) Act No. 11 of 2026",
    publisher: "Inland Revenue Department",
    url: "https://www.ird.gov.lk/en/Lists/Latest%20News%20%20Notices/Attachments/794/SEC_PN_IT_2026-02_E.pdf",
  },
  irdTaxCalendar2026: {
    title: "Tax Calendar 2026",
    publisher: "Inland Revenue Department",
    url: "https://www.ird.gov.lk/en/publications/Tax%20Calendar_Documents/Tax_Calendar_2026_E.pdf",
  },
  irdVat: {
    title: "Value Added Tax (VAT)",
    publisher: "Inland Revenue Department",
    url: "https://www.ird.gov.lk/en/type%20of%20taxes/sitepages/value%20added%20tax%20(vat).aspx",
  },
  irdSscl: {
    title: "Social Security Contribution Levy (SSCL)",
    publisher: "Inland Revenue Department",
    url: "https://www.ird.gov.lk/en/Type%20of%20Taxes/SitePages/Social%20Security%20Contribution%20Levy%20(SSCL).aspx",
  },
  irdCgt: {
    title: "Capital Gain Tax (CGT)",
    publisher: "Inland Revenue Department",
    url: "https://www.ird.gov.lk/en/type%20of%20taxes/sitepages/capital%20gain%20tax%20(cgt).aspx?menuid=1207",
  },
  cseT2: {
    title: "Media release: T+2 settlement cycle for equity trades (June 2024)",
    publisher: "Colombo Stock Exchange",
    url: "https://cdn.cse.lk/cms-internal/news/TeRv6MrQKrefnEjt_13Jun2024095140GMT_1718272300469.pdf",
  },
  secGuide: {
    title: "Guide to Invest",
    publisher: "Securities and Exchange Commission of Sri Lanka",
    url: "https://www.sec.gov.lk/guide-to-invest/",
  },
  cbslDepositInsurance: {
    title: "Deposit Insurance FAQ",
    publisher: "Central Bank of Sri Lanka",
    url: "https://www.cbsl.gov.lk/en/faq/deposit-insurance",
  },
  cbslGovSecurities: {
    title: "Government Debt Securities FAQ",
    publisher: "Central Bank of Sri Lanka",
    url: "https://www.cbsl.gov.lk/en/faq/government-debt-securities",
  },
  investorGovCompound: {
    title: "Compound interest calculator",
    publisher: "Investor.gov (U.S. SEC)",
    url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator",
  },
  stampDuty: {
    title: "Stamp duty charges vary based on how the property is acquired",
    publisher: "LankaPropertyWeb (Attorney-at-Law interview)",
    url: "https://www.lankapropertyweb.com/property-news/stamp-duty-charges-vary-based-on-how-the-property-is-acquired-in-sri-lanka-says-saminda-jayasekara-attorney-at-law/",
  },
  landRestrictionsAct: {
    title: "Land (Restrictions on Alienation) Act",
    publisher: "Laws of Sri Lanka",
    url: "https://www.srilankalaw.lk/revised-statutes/alphabetical-list-of-statutes/1567-land-restrictions-on-alienation-act.html",
  },
  condoForeigners: {
    title: "Laws relaxed: foreigners can now purchase condominium properties",
    publisher: "F J & G de Saram (law firm)",
    url: "https://www.fjgdesaram.com/news-insights/laws-relaxed-foreigners-can-now-purchase-condominium-properties-in-sri-lanka",
  },
  companiesAct: {
    title: "Companies Act No. 7 of 2007",
    publisher: "Parliament of Sri Lanka",
    url: "https://www.parliament.lk/uploads/acts/gbills/english/3776.pdf",
  },
  slfrsSmes: {
    title: "SLFRS for SMEs: illustrative financial statements",
    publisher: "CA Sri Lanka",
    url: "https://www.casrilanka.com/casl/images/stories/content/publications/publications/accounting_standards/sri_lanka_accounting_standard_for_smes/slfrs_for_smes_illustrative_fs.pdf",
  },
} satisfies Record<string, Reference>;
