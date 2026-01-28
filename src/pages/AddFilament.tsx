import Dexie, { type Table } from 'dexie';

export interface Filament {
  id?: number;
  brand: string;
  material: string;
  color: string;
  weight: number;
  remainingWeight: number;
  diameter: number;
  nozzleTemp?: number;
  bedTemp?: number;
}

export interface UsageLog {
  id?: number;
  filamentId: number;
  amountUsed: number;
  date: string;
  printName: string;
}

export class FilamentDatabase extends Dexie {
  filaments!: Table<Filament>;
  usageLogs!: Table<UsageLog>;

  constructor() {
    super('filament-tracker');
    this.version(1).stores({
      filaments: '++id, brand, material, color',
      usageLogs: '++id, filamentId, date'
    });
  }
}

export const db = new FilamentDatabase();
