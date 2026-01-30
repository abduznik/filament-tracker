export interface Filament {
  id?: number;
  brand: string;
  color: string;
  material: string; // PLA, PETG, ABS, etc.
  weight: number; // Current weight in grams
  initialWeight: number; // Initial weight in grams
  cost: number; // Cost in USD
  purchaseDate: Date;
  photo?: Blob; // Stored as a Blob in IndexedDB
  deleted?: number; // 0 for active, 1 for deleted
  totalSpent?: number; // Calculated field
}

export interface UsageLog {
  id?: number;
  filamentId: number;
  changeAmount: number; // Negative for usage, positive for restock
  date: Date;
  note?: string;
}
