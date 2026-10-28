export const collectionArtwork: Record<string, { src: string; alt: string }> = {
  exterior: {
    src: "/images/facade.webp",
    alt: "Conceptual façade showing stone, brick and architectural aluminium",
  },
  interior: {
    src: "/images/interior.webp",
    alt: "Conceptual commercial interior with stone surfaces and timber joinery",
  },
  structural: {
    src: "/images/architecture.webp",
    alt: "Conceptual architectural structure and deep stone reveals",
  },
  bespoke: {
    src: "/images/workshop.webp",
    alt: "Conceptual review bench with timber samples, stone and drawings",
  },
};

export function getCategoryArtwork(category: {
  group: string;
  image?: { src: string; alt: string };
}) {
  return category.image || collectionArtwork[category.group];
}
