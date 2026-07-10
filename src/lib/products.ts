export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  // Path under /public (e.g. "/parts-images/brakepads.webp"). Swap the file
  // or repoint this to change a product photo — no code changes needed.
  image: string;
  description: string;
  rating: number;
  stock: number;
}

export const categories = [
  "All",
  "Brakes",
  "Filters",
  "Engine",
  "Electrical",
  "Suspension",
  "Exterior",
];

export const products: Product[] = [
  {
    id: "item-1",
    title: "Front Brake Pads (Set of 4)",
    price: 42.99,
    category: "Brakes",
    image: "/parts-images/brakepads.webp",
    description:
      "Ceramic front brake pads engineered for low dust and quiet, fade-free stopping. Includes wear indicators and fitting shims. Suitable for a wide range of makes and models.",
    rating: 4.7,
    stock: 64,
  },
  {
    id: "item-2",
    title: "Brake Discs (Pair)",
    price: 89.99,
    category: "Brakes",
    image: "/parts-images/brakediscs.webp",
    description:
      "Vented and anti-corrosion coated brake discs for even heat dissipation and long service life. Precision machined for smooth, vibration-free braking.",
    rating: 4.6,
    stock: 38,
  },
  {
    id: "item-3",
    title: "Oil Filter",
    price: 8.99,
    category: "Filters",
    image: "/parts-images/oilfilter.webp",
    description:
      "High-flow spin-on oil filter with an anti-drain-back valve to protect your engine on cold starts. Traps contaminants down to 20 microns.",
    rating: 4.8,
    stock: 210,
  },
  {
    id: "item-4",
    title: "Air Filter",
    price: 14.99,
    category: "Filters",
    image: "/parts-images/airfilter.webp",
    description:
      "Pleated panel air filter that maximises airflow while blocking dust and debris. Helps maintain fuel economy and engine performance.",
    rating: 4.5,
    stock: 143,
  },
  {
    id: "item-5",
    title: "Cabin Pollen Filter",
    price: 12.49,
    category: "Filters",
    image: "/parts-images/pollenfilter.webp",
    description:
      "Activated-carbon cabin filter that removes pollen, dust and odours for cleaner air inside your vehicle. Quick and easy to fit.",
    rating: 4.4,
    stock: 176,
  },
  {
    id: "item-6",
    title: "Spark Plugs (Set of 4)",
    price: 24.99,
    category: "Engine",
    image: "/parts-images/spark.webp",
    description:
      "Iridium spark plugs for reliable ignition, smoother idling and improved fuel efficiency. Long service life and pre-gapped for easy installation.",
    rating: 4.9,
    stock: 98,
  },
  {
    id: "item-7",
    title: "Timing Belt Kit",
    price: 74.99,
    category: "Engine",
    image: "/parts-images/belt.webp",
    description:
      "Complete timing belt kit including belt and tensioner. Reinforced construction for accurate valve timing and dependable, long-term performance.",
    rating: 4.6,
    stock: 27,
  },
  {
    id: "item-8",
    title: "Engine Oil 5W-30 (5L)",
    price: 34.99,
    category: "Engine",
    image: "/parts-images/oil.webp",
    description:
      "Fully synthetic 5W-30 engine oil for excellent wear protection and cold-start flow. Meets leading manufacturer specifications.",
    rating: 4.8,
    stock: 120,
  },
  {
    id: "item-9",
    title: "Car Battery 12V 60Ah",
    price: 89.99,
    category: "Electrical",
    image: "/parts-images/battery.webp",
    description:
      "Maintenance-free 12V 60Ah battery with high cold-cranking amps for confident starting in all conditions. Fitted with carry handle and 4-year guarantee.",
    rating: 4.7,
    stock: 41,
  },
  {
    id: "item-10",
    title: "Alternator",
    price: 149.99,
    category: "Electrical",
    image: "/parts-images/alternator.webp",
    description:
      "Remanufactured alternator tested to OE standards for consistent charging output. Direct replacement fit with a 2-year warranty.",
    rating: 4.5,
    stock: 19,
  },
  {
    id: "item-11",
    title: "Headlight Bulbs (Pair)",
    price: 19.99,
    category: "Electrical",
    image: "/parts-images/bulb.webp",
    description:
      "H7 halogen headlight bulbs with up to 30% brighter output for improved night-time visibility. Sold as a matched pair.",
    rating: 4.4,
    stock: 156,
  },
  {
    id: "item-12",
    title: "Front Shock Absorber",
    price: 64.99,
    category: "Suspension",
    image: "/parts-images/shock.webp",
    description:
      "Gas-charged front shock absorber for controlled damping, improved handling and a comfortable ride. Corrosion-resistant finish.",
    rating: 4.6,
    stock: 33,
  },
  {
    id: "item-13",
    title: "Coil Spring",
    price: 39.99,
    category: "Suspension",
    image: "/parts-images/spring.webp",
    description:
      "Cold-wound coil spring built to OE ride height and load ratings. Powder-coated to resist corrosion and stone chips.",
    rating: 4.3,
    stock: 58,
  },
  {
    id: "item-14",
    title: "Wiper Blades (Pair)",
    price: 16.99,
    category: "Exterior",
    image: "/parts-images/wiper.webp",
    description:
      "Aerodynamic flat wiper blades for streak-free, all-weather clearing. Tool-free fitting with multi-adaptor connectors.",
    rating: 4.5,
    stock: 189,
  },
  {
    id: "item-15",
    title: "Wing Mirror Glass",
    price: 22.99,
    category: "Exterior",
    image: "/parts-images/mirror.webp",
    description:
      "Replacement wing mirror glass with backing plate and heated element connectors. Clip-on fitment for a fast, secure repair.",
    rating: 4.2,
    stock: 72,
  },
  {
    id: "item-16",
    title: "Fuel Pump",
    price: 79.99,
    category: "Engine",
    image: "/parts-images/fuelpump.webp",
    description:
      "In-tank electric fuel pump delivering steady pressure and flow for smooth running. Tested for reliability and long service life.",
    rating: 4.6,
    stock: 24,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
