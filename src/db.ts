import Dexie, { type EntityTable } from 'dexie';
import type { Filament, UsageLog } from './types';

const db = new Dexie('FilamentTrackerDB') as Dexie & {
  filaments: EntityTable<Filament, 'id'>;
  logs: EntityTable<UsageLog, 'id'>;
};

// Schema declaration
db.version(1).stores({
  filaments: '++id, brand, color, material',
  logs: '++id, filamentId, date'
});

export { db };
