export type Product = {
  name: string;
  slug: string;
  artist: string;
  price: number;
  image: string;
};

const images = [
  ...Array.from({ length: 12 }, (_, index) => `/assets/poster-${index + 1}.png`),
  "/assets/intro-12.png",
  "/assets/intro-13.png",
  "/assets/intro-14.png",
  "/assets/intro-15.png",
];

const catalogue: Array<[string, string, string]> = [
  ["Night Swim", "night-swim", "Maya Kline"],
  ["Back Alley", "back-alley", "Noah Park"],
  ["Lucky Sardine", "lucky-sardine", "Studio Pêche"],
  ["Redline", "redline", "Lucas Ferri"],
  ["After School", "after-school", "Nina Vale"],
  ["Sun Ritual", "sun-ritual", "Ari Bloom"],
  ["Blue Lobster", "blue-lobster", "Maison Crabe"],
  ["Jelly Drift", "jelly-drift", "Yoko Mori"],
  ["Long Dog", "long-dog", "Camille Rose"],
  ["Tomato Club", "tomato-club", "Bodega Lab"],
  ["Midnight Run", "midnight-run", "Kaito Ishii"],
  ["Koi Study 02", "koi-study-02", "Hana Sato"],
  ["Soft Static", "soft-static", "Milo Arden"],
  ["Acid Bloom", "acid-bloom", "Lena Sanz"],
  ["Poolside Ghost", "poolside-ghost", "Theo Sun"],
  ["Signal Fire", "signal-fire", "Rae Ito"],
];

export const PRODUCTS: Product[] = catalogue.map(([name, slug, artist], index) => ({
  name,
  slug,
  artist,
  price: 89,
  image: images[index],
}));

export const FREE_SHIPPING_THRESHOLD = 80;
export const SHIPPING_FEE = 6.9;

export const formatPrice = (value: number) =>
  `€${value.toFixed(2).replace(/\.00$/, "")}`;
