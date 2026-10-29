import { catalogueProducts, type CatalogueProduct } from "@/lib/products";
import type { packageOptions } from "@/lib/enquiry-schema";

type MaterialPackage = (typeof packageOptions)[number];
export type ProjectCollection = {
  id: string;
  name: string;
  headline: string;
  intro: string;
  image: string;
  packages: {
    name: string;
    description: string;
    collections: string[];
    materials: MaterialPackage[];
  }[];
};

export const projectCollections: ProjectCollection[] = [
  {
    id: "commercial",
    name: "Commercial",
    headline: "A coherent material story.\nAt a commercial scale.",
    intro:
      "Consider office, hospitality and shared-space materials as connected packages. Bring the glazing, joinery, circulation and finish schedules together around your design, trade interfaces and programme.",
    image: "/images/commercial-curtain-wall.png",
    packages: [
      {
        name: "Building envelope & arrival",
        description:
          "Curtain-wall and architectural glazing scope, entrance doors, guarding interfaces and lobby finishes. Start with elevations, opening schedules and the project’s technical requirements.",
        collections: [
          "windows-doors",
          "entrance-interior-doors",
          "railings-staircases",
          "tiles",
        ],
        materials: [
          "Architectural aluminium",
          "Glazing and partitions",
          "Doors and hardware",
          "Architectural metalwork",
          "Stone / porcelain",
        ],
      },
      {
        name: "Office & workplace fit-out",
        description:
          "Interior glazed openings, staff kitchen cabinetry, storage, wall finishes, ceiling requirements and floor selections, coordinated against the space plan and services.",
        collections: [
          "windows-doors",
          "entrance-interior-doors",
          "kitchens",
          "wardrobes",
          "wall-panels",
          "tiles",
        ],
        materials: [
          "Glazing and partitions",
          "Doors and hardware",
          "Joinery",
          "Wall and ceiling finishes",
          "Flooring and tiling",
        ],
      },
      {
        name: "Hospitality & shared spaces",
        description:
          "Joinery, vanities, storage, stairs and balustrade references with a connected wall and floor palette. Confirm use, traffic, maintenance and technical requirements with the project team.",
        collections: [
          "kitchens",
          "vanities",
          "wardrobes",
          "walk-in-closets",
          "railings-staircases",
          "wall-panels",
          "tiles",
          "timber-flooring",
        ],
        materials: [
          "Joinery",
          "Bathroom finishes",
          "Architectural metalwork",
          "Wall and ceiling finishes",
          "Flooring and tiling",
        ],
      },
    ],
  },
  {
    id: "residential",
    name: "Residential",
    headline: "A home, considered\nfrom every angle.",
    intro:
      "Connect the first impression with the spaces you live in. Coordinate windows, doors, kitchens, bathrooms, storage and finishes as a considered material package for your home or residential development.",
    image: "/images/products/kitchens/p02-21.webp",
    packages: [
      {
        name: "Envelope & entrance",
        description:
          "Window and door configurations, entrance designs, stair and balcony guarding references. Resolve opening sizes, structural interfaces and intended exposure before selection.",
        collections: [
          "windows-doors",
          "entrance-interior-doors",
          "railings-staircases",
        ],
        materials: [
          "Architectural aluminium",
          "Doors and hardware",
          "Glazing and partitions",
          "Architectural metalwork",
        ],
      },
      {
        name: "Kitchen, bathroom & storage",
        description:
          "Kitchen cabinetry, vanity designs, wardrobes and dressing spaces, aligned with appliances, service positions, finished dimensions and the way each room is used.",
        collections: ["kitchens", "vanities", "wardrobes", "walk-in-closets"],
        materials: ["Joinery", "Bathroom finishes"],
      },
      {
        name: "Interior finish palette",
        description:
          "Wall panels, tiles, timber flooring and interior doors with coordinated stairs and balustrade details. Plan transitions, set-outs and finished levels as one material story.",
        collections: [
          "wall-panels",
          "tiles",
          "timber-flooring",
          "entrance-interior-doors",
          "railings-staircases",
        ],
        materials: [
          "Wall and ceiling finishes",
          "Flooring and tiling",
          "Doors and hardware",
          "Architectural metalwork",
        ],
      },
    ],
  },
  {
    id: "fit-out",
    name: "Fit-out",
    headline: "Resolve the space.\nConnect the details.",
    intro:
      "Bring interior openings, joinery and the finish palette into one trade-aware brief. Establish scope boundaries, coordinate service interfaces and programme the material supply around the works on site.",
    image: "/images/materials/commercial-fitout.webp",
    packages: [
      {
        name: "Interior openings & circulation",
        description:
          "Interior door designs, slim-frame glazed openings, staircase and balustrade references. Coordinate clear openings, floor levels, supports and adjoining finishes.",
        collections: [
          "entrance-interior-doors",
          "windows-doors",
          "railings-staircases",
        ],
        materials: [
          "Doors and hardware",
          "Glazing and partitions",
          "Architectural metalwork",
        ],
      },
      {
        name: "Joinery & amenities",
        description:
          "Kitchen and tea-point cabinetry, vanity selections and storage layouts, coordinated with appliances, plumbing, power and wall support requirements.",
        collections: ["kitchens", "vanities", "wardrobes", "walk-in-closets"],
        materials: ["Joinery", "Bathroom finishes"],
      },
      {
        name: "Walls, ceilings & floors",
        description:
          "Panel finishes, tile and timber floor references, with ceiling scope reviewed alongside the material palette. Confirm substrates, movement allowances, set-outs and transitions.",
        collections: ["wall-panels", "tiles", "timber-flooring"],
        materials: [
          "Wall and ceiling finishes",
          "Flooring and tiling",
          "Stone / porcelain",
        ],
      },
    ],
  },
  {
    id: "exterior",
    name: "Exterior",
    headline: "The first impression.\nThe lasting detail.",
    intro:
      "Explore the openings, entrance designs and guarding references that shape the outside of a building. Exposure, weathering, structural interfaces and application-specific evidence form part of the project review.",
    image: "/images/products/windows-doors/bifold-window.jpeg",
    packages: [
      {
        name: "Architectural openings",
        description:
          "Window and door configurations considered with frame finishes, glazing requirements, opening schedules and the interfaces with the building envelope.",
        collections: ["windows-doors", "entrance-interior-doors"],
        materials: [
          "Architectural aluminium",
          "Glazing and partitions",
          "Doors and hardware",
        ],
      },
      {
        name: "Entrance & guarding details",
        description:
          "Entrance doors and balcony or balustrade design references. Confirm the intended location, exposure, loads, fixings and required technical evidence before specifying a system.",
        collections: ["entrance-interior-doors", "railings-staircases"],
        materials: [
          "Doors and hardware",
          "Architectural metalwork",
          "Glazing and partitions",
        ],
      },
      {
        name: "Commercial façade coordination",
        description:
          "A project-specific curtain-wall and façade supply enquiry based on your elevations, system brief and technical requirements. This is a scope-review service rather than a coded catalogue system.",
        collections: ["windows-doors"],
        materials: [
          "Exterior façade",
          "Architectural aluminium",
          "Glazing and partitions",
        ],
      },
    ],
  },
  {
    id: "interior",
    name: "Interior",
    headline: "A quieter palette.\nA more considered space.",
    intro:
      "Connect cabinetry, interior doors, storage, surfaces and circulation details. Develop a material palette that respects proportion, daily use and the interfaces between the trades that bring it together.",
    image: "/images/products/wall-panels/wall-panel-interior.png",
    packages: [
      {
        name: "Living spaces & storage",
        description:
          "Kitchen designs, fitted wardrobes and walk-in storage, coordinated with room layouts, service positions and the dimensions of the finished space.",
        collections: ["kitchens", "wardrobes", "walk-in-closets"],
        materials: ["Joinery"],
      },
      {
        name: "Bathroom & surface palette",
        description:
          "Vanity designs, tile and panel selections, considered with plumbing positions, substrates and finish transitions. Confirm wet-area applications and material inclusions for the selected product.",
        collections: ["vanities", "tiles", "wall-panels", "timber-flooring"],
        materials: [
          "Bathroom finishes",
          "Stone / porcelain",
          "Wall and ceiling finishes",
          "Flooring and tiling",
        ],
      },
      {
        name: "Doors, stairs & final details",
        description:
          "Interior door and glazed-opening designs, staircase references and balustrade details, coordinated with levels, supports, clearances and adjoining finishes.",
        collections: [
          "entrance-interior-doors",
          "windows-doors",
          "railings-staircases",
        ],
        materials: [
          "Doors and hardware",
          "Glazing and partitions",
          "Architectural metalwork",
        ],
      },
    ],
  },
];

const interiorFamilies = new Set([
  "kitchens",
  "vanities",
  "wardrobes",
  "walk-in-closets",
  "wall-panels",
  "tiles",
  "timber-flooring",
]);
function isInteriorDoor(product: CatalogueProduct) {
  return (
    product.collection === "entrance-interior-doors" &&
    !/entrance|front|wrought iron/i.test(product.category)
  );
}
function isInteriorGlazing(product: CatalogueProduct) {
  return (
    product.collection === "windows-doors" &&
    /interior|slim.frame/i.test(product.category)
  );
}
function isInteriorRailing(product: CatalogueProduct) {
  return (
    product.collection === "railings-staircases" &&
    !/balcony|terrace|deck|outdoor|exterior/i.test(
      `${product.category} ${product.name}`,
    )
  );
}
function isExteriorRailing(product: CatalogueProduct) {
  const description = `${product.category} ${product.name}`;
  return (
    product.collection === "railings-staircases" &&
    /balcony|balustrade|post.and.glass|cable railing|spigot|base.channel|standoff|clamp/i.test(
      description,
    ) &&
    !/stair|interior|internal/i.test(description)
  );
}

/** Context is an enquiry starting point, not evidence of application suitability. */
export function productsForContext(id: string): CatalogueProduct[] {
  if (!projectCollections.some((collection) => collection.id === id)) return [];
  return catalogueProducts.filter((product) => {
    if (id === "residential") return true;
    if (id === "commercial") {
      if (product.collection === "windows-doors")
        return !/sunroom|wrought iron/i.test(product.category);
      if (product.collection === "entrance-interior-doors")
        return !/wrought iron/i.test(product.category);
      return (
        interiorFamilies.has(product.collection) ||
        product.collection === "railings-staircases"
      );
    }
    if (id === "exterior") {
      if (product.collection === "windows-doors")
        return !isInteriorGlazing(product);
      if (product.collection === "entrance-interior-doors")
        return !isInteriorDoor(product);
      return isExteriorRailing(product);
    }
    return (
      interiorFamilies.has(product.collection) ||
      isInteriorDoor(product) ||
      isInteriorGlazing(product) ||
      isInteriorRailing(product)
    );
  });
}
