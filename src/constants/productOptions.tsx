export type ProductType = "shirt" | "pants" | "shoes";

export const COLOR_OPTIONS: Record<ProductType, string[]> = {
  shirt: [
    "BLACK",
    "WHITE",
    "GRAY",
    "NAVY",
    "RED",
    "BLUE",
    "GREEN",
    "CREAM",
    "BROWN",
  ],
  pants: [
    "BLACK",
    "GRAY",
    "NAVY",
    "BLUE",
    "BEIGE",
    "BROWN",
  ],
  shoes: [
    "BLACK",
    "WHITE",
    "GRAY",
    "NAVY",
    "BROWN",
    "BLUE",
    "RED",
  ],
};
