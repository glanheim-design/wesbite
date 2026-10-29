import { z } from "zod";
export const packageOptions = [
  "Exterior façade",
  "Brick slip / cladding",
  "Architectural aluminium",
  "Stone / porcelain",
  "Joinery",
  "Wall and ceiling finishes",
  "Flooring and tiling",
  "Bathroom finishes",
  "Doors and hardware",
  "Glazing and partitions",
  "Architectural metalwork",
  "Structural materials",
  "Mixed package",
  "Other",
] as const;
export const pricingOptions = [
  "Early budget estimate",
  "Tender pricing",
  "Value engineering",
  "Procurement comparison",
  "Confirmed purchase requirement",
] as const;
const text = (max = 200) => z.string().trim().max(max);
const date = text(10).refine(
  (v) =>
    !v ||
    (/^\d{4}-\d{2}-\d{2}$/.test(v) &&
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v),
  "Enter a valid date",
);
const sharedLink = text(2000).refine((v) => {
  if (!v) return true;
  try {
    const u = new URL(v);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      u.hostname.includes(".") &&
      !["localhost", "127.0.0.1"].includes(u.hostname)
    );
  } catch {
    return false;
  }
}, "Use a secure HTTPS sharing link without a password in the URL");
export const enquirySchema = z
  .object({
    submissionId: z.uuid(),
    startedAt: z.number().int().positive(),
    website: text(200).refine((v) => v === "", "Spam check failed"),
    fullName: text(120).min(2, "Enter your full name"),
    company: text(160),
    position: text(120),
    email: z.email("Enter a valid work email").max(254),
    phone: text(50),
    companyWebsite: text(300).refine(
      (v) => !v || /^https?:\/\/[^\s]+$/.test(v),
      "Use a full website URL",
    ),
    projectName: text(),
    projectLocation: text(),
    projectType: text(80),
    projectStage: text(80),
    tenderDate: date,
    deliveryDate: date,
    packages: z
      .array(z.enum(packageOptions))
      .min(1, "Choose at least one material package")
      .max(14),
    selectedProduct: text(12000),
    selectedCategory: text(1000),
    pricingPurpose: z.enum(pricingOptions, {
      error: "Select a pricing purpose",
    }),
    measurementMethod: z
      .enum(["Review supplied drawings", "Enter measurements", "Both"])
      .default("Review supplied drawings"),
    measurements: text(6000).default(""),
    items: z
      .array(
        z
          .object({
            id: z
              .string()
              .regex(/^[a-z0-9-]+$/)
              .max(180),
            quantity: text(60),
            measurements: text(1200),
            notes: text(1200),
          })
          .strict(),
      )
      .max(40)
      .default([]),
    scope: text(6000).min(20, "Describe your scope in at least 20 characters"),
    quantity: text(30).refine(
      (v) => !v || (/^\d+(\.\d+)?$/.test(v) && Number(v) > 0),
      "Enter a quantity greater than zero",
    ),
    unit: text(30),
    packageValue: text(100),
    targetRate: text(100),
    supplierQuote: text(1000),
    alternatives: z.enum(["Yes", "No", "Discuss"]),
    deliveryRequirements: text(1500),
    documentLink: sharedLink,
    drawingRevision: text(150),
    documentDescription: text(1500),
    authority: z.literal(true, {
      error: "Confirm you are authorised to share the project information",
    }),
    privacy: z.literal(true, {
      error: "Acknowledge the privacy policy and enquiry terms",
    }),
  })
  .strict();
export type Enquiry = z.infer<typeof enquirySchema>;
export const stepFields: (keyof Enquiry)[][] = [
  ["fullName", "company", "position", "email", "phone", "companyWebsite"],
  [
    "projectName",
    "projectLocation",
    "projectType",
    "projectStage",
    "tenderDate",
    "deliveryDate",
  ],
  ["packages", "selectedProduct", "selectedCategory"],
  [
    "pricingPurpose",
    "scope",
    "measurementMethod",
    "measurements",
    "quantity",
    "unit",
    "packageValue",
    "targetRate",
    "supplierQuote",
    "alternatives",
    "deliveryRequirements",
  ],
  ["documentLink", "drawingRevision", "documentDescription", "authority"],
  ["privacy"],
];
export const labels: Record<string, string> = {
  fullName: "Full name",
  company: "Company",
  position: "Position",
  email: "Email address",
  phone: "Phone",
  companyWebsite: "Company website",
  projectName: "Project name",
  projectLocation: "Project location",
  projectType: "Project type",
  projectStage: "Project stage",
  tenderDate: "Tender closing date",
  deliveryDate: "Required delivery date",
  packages: "Material packages",
  selectedProduct: "Selected products and references",
  selectedCategory: "Selected category",
  pricingPurpose: "Pricing purpose",
  scope: "Scope description",
  measurementMethod: "How should measurements be provided?",
  measurements: "Measurements and dimension notes",
  items: "Product schedule",
  quantity: "Approximate quantity",
  unit: "Unit",
  packageValue: "Estimated package value",
  targetRate: "Target supply rate",
  supplierQuote: "Existing Australian supplier quotation / reference",
  alternatives: "Can alternatives be considered?",
  deliveryRequirements: "Delivery requirements",
  documentLink: "Link to project documents",
  drawingRevision: "Drawing revision / issue date",
  documentDescription: "Document description",
  authority: "Authority to share",
  privacy: "Privacy acknowledgement",
};
