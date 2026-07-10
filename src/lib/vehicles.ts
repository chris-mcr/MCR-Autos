// Static make → models map used by the vehicle part-finder.
// Single source of truth (mirrors products.ts). Attendees can extend this.
export const vehicles: Record<string, string[]> = {
  Audi: ["A1", "A3", "A4", "Q3", "Q5"],
  BMW: ["1 Series", "2 Series", "3 Series", "X1", "X3"],
  Ford: ["Fiesta", "Focus", "Puma", "Kuga", "Mondeo"],
  Nissan: ["Micra", "Juke", "Qashqai", "Leaf", "X-Trail"],
  Toyota: ["Yaris", "Corolla", "C-HR", "RAV4", "Prius"],
  Vauxhall: ["Corsa", "Astra", "Mokka", "Insignia", "Grandland"],
  Volkswagen: ["Polo", "Golf", "Passat", "T-Roc", "Tiguan"],
};

export const makes = Object.keys(vehicles);

export function modelsFor(make: string): string[] {
  return vehicles[make] ?? [];
}
