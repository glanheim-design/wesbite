import { z } from "zod";
import raw from "@/content/catalogue.json";
export const groups = [
  "exterior",
  "interior",
  "structural",
  "bespoke",
] as const;
export type Group = (typeof groups)[number];
export const groupInfo: Record<Group, { title: string; intro: string }> = {
  exterior: {
    title: "Exterior systems",
    intro:
      "The first impression. The lasting protection. Explore façade materials, architectural metalwork and exterior finishes for your project.",
  },
  interior: {
    title: "Interior packages",
    intro:
      "Considered from the inside out. Coordinate joinery, surfaces and architectural finishes as one project-specific material package.",
  },
  structural: {
    title: "Structural materials",
    intro:
      "Project-led sourcing enquiries for selected structural components, subject to engineering, evidence and suitability review.",
  },
  bespoke: {
    title: "Bespoke materials",
    intro:
      "For the details that make a project its own. Explore custom finishes and components developed around your documentation.",
  },
};
export const evidenceStatuses = [
  "NOT YET ASSESSED",
  "DOCUMENTATION REQUESTED",
  "UNDER TECHNICAL REVIEW",
  "EVIDENCE REVIEWED FOR SPECIFIED APPLICATION",
  "FURTHER VERIFICATION REQUIRED",
  "DO NOT OFFER",
] as const;
const https = z
  .url()
  .refine((v) => new URL(v).protocol === "https:", "HTTPS required");
export const productSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    category: z.string(),
    group: z.enum(groups),
    description: z.string(),
    applications: z.array(z.string()),
    finishes: z.array(z.string()),
    materialType: z.string(),
    technicalCharacteristics: z.array(z.string()),
    image: z
      .object({
        src: z
          .string()
          .regex(/^\/images\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp|svg)$/),
        alt: z.string().min(5),
        licence: z.string().min(1),
      })
      .nullable()
      .optional(),
    manufacturer: z.string().nullable(),
    countryOfManufacture: z.string().nullable(),
    composition: z.string().nullable(),
    dimensions: z.string().nullable(),
    leadTime: z.string().nullable(),
    minimumOrderQuantity: z.string().nullable(),
    installationSystem: z.string().nullable(),
    limitations: z.array(z.string()),
    publicationStatus: z.enum(["draft", "enquiry-only", "published"]),
    eligibility: z.enum(["pending", "eligible", "prohibited"]),
    complianceStatus: z.enum(evidenceStatuses),
    technicalDataSheet: https.nullable(),
    testReports: z.array(
      z.object({ url: https, publicPermission: z.boolean() }),
    ),
    applicableStandards: z.array(z.string()),
    evidenceType: z.string().nullable(),
    evidenceIssuer: z.string().nullable(),
    evidenceIssueDate: z.iso.date().nullable(),
    evidenceExpiryDate: z.iso.date().nullable(),
    testReportScope: z.string().nullable(),
    lastReviewed: z.iso.date().nullable(),
    reviewerNotes: z.string().nullable(),
    documentAccess: z.enum(["private", "approved-public"]),
    approvedPublicStatement: z.string().nullable(),
  })
  .superRefine((p, ctx) => {
    if (
      p.publicationStatus !== "draft" &&
      (p.eligibility === "prohibited" || p.complianceStatus === "DO NOT OFFER")
    )
      ctx.addIssue({
        code: "custom",
        message: "Prohibited or do-not-offer products cannot be public",
      });
    if (p.publicationStatus === "published" && p.eligibility !== "eligible")
      ctx.addIssue({
        code: "custom",
        message: "Published products require eligibility review",
      });
    if (
      p.approvedPublicStatement &&
      (!p.lastReviewed ||
        !p.evidenceIssuer ||
        p.complianceStatus !== "EVIDENCE REVIEWED FOR SPECIFIED APPLICATION")
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Public evidence claims require recorded application-specific review",
      });
    if (
      p.testReports.some((r) => r.publicPermission) &&
      p.documentAccess !== "approved-public"
    )
      ctx.addIssue({
        code: "custom",
        message: "Reports require public access permission",
      });
  });
export const catalogueSchema = z.object({
  categories: z.array(
    z.object({
      slug: z.string(),
      group: z.enum(groups),
      name: z.string(),
      description: z.string(),
      items: z.array(z.string()),
      materialType: z.string(),
      finish: z.string(),
      application: z.string(),
      technical: z.string(),
      image: z
        .object({
          src: z
            .string()
            .regex(/^\/images\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp|svg)$/),
          alt: z.string().min(5),
          licence: z.string().min(1),
        })
        .optional(),
    }),
  ),
  products: z.array(productSchema),
});
const parsed = catalogueSchema.parse(raw);
export const categories = parsed.categories;
export const products = parsed.products.filter(
  (p) =>
    p.publicationStatus !== "draft" &&
    p.eligibility !== "prohibited" &&
    p.complianceStatus !== "DO NOT OFFER",
);
export type Product = z.infer<typeof productSchema>;
export const categoryHref = (c: (typeof categories)[number]) =>
  `/materials/${c.group}/${c.slug}`;
export const productHref = (p: Product) =>
  `/materials/${p.group}/${p.category}/${p.slug}`;
export const processSteps = [
  [
    "Project scope review",
    "Drawings, specifications, quantities and programme establish the brief.",
  ],
  [
    "Manufacturer sourcing",
    "Potential supply options are considered against your project requirements.",
  ],
  [
    "Specification & technical review",
    "Material requirements and technical documentation are reviewed against your project specifications.",
  ],
  [
    "Samples & shop drawings",
    "Where agreed, coordinate samples and manufacturer shop drawings for project review.",
  ],
  [
    "Manufacturing & quality control",
    "Agree the production scope and quality checks before manufacture proceeds.",
  ],
  [
    "Delivery coordination",
    "Coordinate delivery requirements and programme milestones under the agreed supply contract.",
  ],
];
