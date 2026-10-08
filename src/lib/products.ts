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
  // Which vehicles the part fits: make -> models, using the names in lib/vehicles.ts. An empty
  // list means every model of that make. Leave `fits` out and the part is universal (it suits
  // any vehicle). Nothing reads this yet: the part finder saves the chosen vehicle in
  // localStorage ("vehicle"), and using the two together is an attendee task.
  fits?: Record<string, string[]>;
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
  {
    id: "item-17",
    title: "Performance Drilled and Grooved Brake Discs (Pair)",
    price: 139.99,
    category: "Brakes",
    image: "/parts-images/brakediscs.webp",
    description:
      "Cross-drilled and slotted front discs that shed heat and gas for firmer, more consistent braking on fast roads and track days. A popular upgrade for hot hatches such as the Ford Focus, VW Golf and Audi A3.",
    rating: 4.7,
    stock: 22,
    fits: { Ford: ["Focus"], Volkswagen: ["Golf"], Audi: ["A3"] },
  },
  {
    id: "item-18",
    title: "Fast Road Performance Brake Pads (Set of 4)",
    price: 64.99,
    category: "Brakes",
    image: "/parts-images/brakepads.webp",
    description:
      "High-friction fast road compound with strong initial bite and excellent fade resistance when driven hard. Pairs with the performance discs for a complete front brake upgrade.",
    rating: 4.6,
    stock: 35,
    fits: { Ford: ["Focus"], Volkswagen: ["Golf"], Audi: ["A3"] },
  },
  {
    id: "item-19",
    title: "High-Temperature Brake Fluid DOT 5.1 (1L)",
    price: 15.99,
    category: "Brakes",
    image: "/parts-images/oil.webp",
    description:
      "High boiling point brake fluid that resists fade under repeated hard stops. Compatible with DOT 4 systems and a sensible upgrade whenever the pads and discs are changed.",
    rating: 4.5,
    stock: 88,
  },
  {
    id: "item-20",
    title: "Front Brake Pads - Ford Focus and Fiesta",
    price: 39.99,
    category: "Brakes",
    image: "/parts-images/brakepads.webp",
    description:
      "Low-dust ceramic front pads matched to the Ford Fiesta and Focus. Supplied with wear indicators and fitting hardware for a quick like-for-like replacement.",
    rating: 4.4,
    stock: 52,
    fits: { Ford: ["Fiesta", "Focus"] },
  },
  {
    id: "item-21",
    title: "Performance Panel Air Filter (Washable)",
    price: 34.99,
    category: "Filters",
    image: "/parts-images/airfilter.webp",
    description:
      "Reusable high-flow cotton gauze panel filter that improves airflow without losing filtration. Wash and re-oil it at service time instead of replacing it.",
    rating: 4.5,
    stock: 61,
  },
  {
    id: "item-22",
    title: "Oil Filter - VW Golf, Polo and Audi A3",
    price: 10.99,
    category: "Filters",
    image: "/parts-images/oilfilter.webp",
    description:
      "Spin-on oil filter with an anti-drain-back valve, picked for popular Volkswagen Group petrol engines found in the Golf, Polo and Audi A3.",
    rating: 4.7,
    stock: 134,
    fits: { Volkswagen: ["Golf", "Polo"], Audi: ["A3"] },
  },
  {
    id: "item-23",
    title: "Iridium Performance Spark Plugs (Set of 4)",
    price: 39.99,
    category: "Engine",
    image: "/parts-images/spark.webp",
    description:
      "Fine-wire iridium plugs for a stable spark, crisp throttle response and long service life. Well suited to tuned and turbocharged engines.",
    rating: 4.8,
    stock: 74,
  },
  {
    id: "item-24",
    title: "Fully Synthetic Racing Oil 5W-40 (5L)",
    price: 49.99,
    category: "Engine",
    image: "/parts-images/oil.webp",
    description:
      "Fully synthetic 5W-40 with strong shear stability for hard driving, track days and uprated engines. Keeps its film strength at high temperatures.",
    rating: 4.7,
    stock: 66,
  },
  {
    id: "item-25",
    title: "High-Flow Fuel Pump - Performance",
    price: 109.99,
    category: "Engine",
    image: "/parts-images/fuelpump.webp",
    description:
      "Uprated in-tank pump with higher flow for modified engines running more power. Direct fit for the standard tank module.",
    rating: 4.5,
    stock: 14,
  },
  {
    id: "item-26",
    title: "Ultra White Headlight Bulbs (Pair)",
    price: 24.99,
    category: "Electrical",
    image: "/parts-images/bulb.webp",
    description:
      "Brighter, whiter light than standard halogen bulbs, with a longer beam for better night-time visibility. Road legal and plug-and-play.",
    rating: 4.4,
    stock: 97,
  },
  {
    id: "item-27",
    title: "AGM Start-Stop Battery 12V 70Ah",
    price: 139.99,
    category: "Electrical",
    image: "/parts-images/battery.webp",
    description:
      "Deep-cycle AGM battery built for vehicles with start-stop systems, such as the Ford Focus, VW Golf and BMW 3 Series. Spill-proof and maintenance free.",
    rating: 4.6,
    stock: 18,
    fits: { Ford: ["Focus"], Volkswagen: ["Golf"], BMW: ["3 Series"] },
  },
  {
    id: "item-28",
    title: "Sport Lowering Springs (Set of 4)",
    price: 149.99,
    category: "Suspension",
    image: "/parts-images/spring.webp",
    description:
      "Progressive-rate springs that lower the ride height for a sharper stance and tighter handling, while keeping everyday comfort. Fits with the standard dampers.",
    rating: 4.5,
    stock: 17,
  },
  {
    id: "item-29",
    title: "Adjustable Sport Coilover Kit",
    price: 449.99,
    category: "Suspension",
    image: "/parts-images/shock.webp",
    description:
      "Height-adjustable coilovers with tuned damping for fast road and track use. Dial in ride height and stiffness to suit the car and the driver.",
    rating: 4.7,
    stock: 9,
  },
  {
    id: "item-30",
    title: "Front Anti-Roll Bar Drop Links (Pair)",
    price: 29.99,
    category: "Suspension",
    image: "/parts-images/shock.webp",
    description:
      "Heavy-duty drop links that reduce body roll and remove clunks from worn bushes. A cheap fix that sharpens turn-in on most hatchbacks.",
    rating: 4.3,
    stock: 80,
  },
  {
    id: "item-31",
    title: "Carbon-Effect Wing Mirror Covers (Pair)",
    price: 27.99,
    category: "Exterior",
    image: "/parts-images/mirror.webp",
    description:
      "Clip-on carbon-effect covers that give your mirrors a sportier look. Quick to fit with no tools and no drilling.",
    rating: 4.2,
    stock: 40,
  },
  {
    id: "item-32",
    title: "Aero Flat Wiper Blades - VW Golf and Polo",
    price: 21.99,
    category: "Exterior",
    image: "/parts-images/wiper.webp",
    description:
      "Flat-blade wipers matched to the Volkswagen Golf and Polo. Streak-free in heavy rain and quiet at speed.",
    rating: 4.5,
    stock: 120,
    fits: { Volkswagen: ["Golf", "Polo"] },
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
