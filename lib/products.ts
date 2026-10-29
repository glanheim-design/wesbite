import { z } from "zod";
import raw from "@/content/products.json";
export const phaseInfo = {
  enclose: {
    number: "01",
    name: "The building envelope",
    short: "Enclose",
    intro:
      "Resolve opening sizes, frame finishes and the interfaces with adjoining construction before manufacture.",
    items: [
      "Opening schedules",
      "Frame and leaf selections",
      "Glazing and hardware",
    ],
  },
  "fit-out": {
    number: "02",
    name: "Joinery & living spaces",
    short: "Fit out",
    intro:
      "Coordinate kitchens, wardrobes and vanities with service positions, appliances and the dimensions of the finished space.",
    items: [
      "Joinery layouts",
      "Service positions",
      "Samples and shop drawings",
    ],
  },
  finish: {
    number: "03",
    name: "Surfaces & final details",
    short: "Finish",
    intro:
      "Connect the material palette through wall panels, tiles and timber flooring. Consider substrates, set-outs, transitions and finished levels.",
    items: [
      "Finish schedules",
      "Substrates and set-outs",
      "Levels and transitions",
    ],
  },
} as const;
export type ProductPhase = keyof typeof phaseInfo;
export const productCollections = [
  {
    id: "windows-doors",
    name: "Aluminium windows & doors",
    intro:
      "Frame the outlook. Explore opening configurations and architectural glazing for a considered building envelope.",
    image: "/images/products/windows-doors/bifold-window.jpeg",
    phase: "enclose",
    materialPackage: "Architectural aluminium",
  },
  {
    id: "entrance-interior-doors",
    name: "Entrance & interior doors",
    intro:
      "A confident arrival. A quieter transition. Explore door designs for the entrance and the spaces beyond.",
    image: "/images/products/entrance-interior-doors/an-p001-pivot-door.jpeg",
    phase: "enclose",
    materialPackage: "Doors and hardware",
  },
  {
    id: "kitchens",
    name: "Kitchen cabinetry",
    intro:
      "Considered from every angle. Explore kitchen layouts, cabinetry and storage, shaped around the way a space is used.",
    image: "/images/products/kitchens/p02-21.webp",
    phase: "fit-out",
    materialPackage: "Joinery",
  },
  {
    id: "vanities",
    name: "Bathroom vanities",
    intro:
      "Calm spaces, carefully resolved. Explore vanity designs that bring storage, proportion and everyday function together.",
    image: "/images/products/vanities/p04-x54-clean.webp",
    phase: "fit-out",
    materialPackage: "Bathroom finishes",
  },
  {
    id: "wardrobes",
    name: "Wardrobes",
    intro:
      "A place for everything. Explore fitted wardrobe designs and a considered approach to everyday storage.",
    image: "/images/products/wardrobes/p02-x31-clean.webp",
    phase: "fit-out",
    materialPackage: "Joinery",
  },
  {
    id: "walk-in-closets",
    name: "Walk-in wardrobes",
    intro:
      "Make room for the everyday. Explore dressing spaces, open storage and walk-in wardrobe configurations.",
    image: "/images/products/walk-in-closets/clean-p03-01.webp",
    phase: "fit-out",
    materialPackage: "Joinery",
  },
  {
    id: "wall-panels",
    name: "Wall panels",
    intro:
      "Texture with purpose. Explore wall finishes and surface palettes that bring depth and continuity to an interior.",
    image: "/images/products/wall-panels/wall-panel-interior.png",
    phase: "finish",
    materialPackage: "Wall and ceiling finishes",
  },
  {
    id: "tiles",
    name: "Tiles & surfaces",
    intro:
      "A continuous material story. Explore tile patterns and surface options for project-specific selection.",
    image: "/images/products/tiles/tile-interior-study.jpeg",
    phase: "finish",
    materialPackage: "Stone / porcelain",
  },
  {
    id: "railings-staircases",
    name: "Staircases & balustrades",
    intro:
      "Connect every level. Explore staircase designs, balustrades, handrails and the details that bring a project together.",
    image: "/images/products/railings-staircases/overview-p01-01.jpeg",
    phase: "fit-out",
    materialPackage: "Architectural metalwork",
  },
  {
    id: "timber-flooring",
    name: "Timber flooring",
    intro:
      "Warmth underfoot. Explore timber floor appearances and coordinate the finish with your interior palette.",
    image: "/images/products/timber-flooring/clean-p01.webp",
    phase: "finish",
    materialPackage: "Flooring and tiling",
  },
] as const;
export const catalogueProductSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  collection: z.string(),
  category: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(20),
  code: z.string().nullable(),
  image: z
    .string()
    .regex(/^\/images\/products\/[a-zA-Z0-9/_.-]+\.(webp|jpeg|jpg|png)$/),
  gallery: z.array(z.string()),
  phase: z.enum(["enclose", "fit-out", "finish"]),
  sourcePage: z.number().int().positive(),
  alternativeCodes: z.array(z.string()).optional(),
  variant: z.string().optional(),
  galleryContext: z.string().optional(),
  publicationStatus: z.literal("enquiry-only"),
});
export type CatalogueProduct = z.infer<typeof catalogueProductSchema>;
export const catalogueProducts: CatalogueProduct[] = z
  .array(catalogueProductSchema)
  .parse(raw);
export const productHref = (p: CatalogueProduct) =>
  `/products/${p.collection}/${p.slug}`;
export function selectionFromQuery(value: string | null) {
  const wanted = new Set((value || "").split(",").slice(0, 40));
  return catalogueProducts.filter((p) => wanted.has(p.id));
}
export function selectionSummary(rows: CatalogueProduct[]) {
  return rows
    .map(
      (p) =>
        `${productCollections.find((c) => c.id === p.collection)?.name}: ${p.name} — ${[p.code, ...(p.alternativeCodes || [])].filter(Boolean).join(" / ") || "Design reference"}${p.variant ? ` (${p.variant})` : ""} [${p.id}]`,
    )
    .join("\n");
}
