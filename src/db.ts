import Dexie, { type EntityTable } from 'dexie';
import type { Filament, UsageLog } from './types';

// --- Interface Definition ---
export interface DatabaseAPI {
  getFilaments(): Promise<Filament[]>;
  getFilament(id: number): Promise<Filament | undefined>;
  addFilament(data: Omit<Filament, 'id'>): Promise<number>;
  deleteFilament(id: number): Promise<void>;
  getLogs(filamentId: number): Promise<UsageLog[]>;
  addLog(log: Omit<UsageLog, 'id'>, newWeight: number): Promise<void>;
  updateFilamentWeight(id: number, newWeight: number): Promise<void>;
}

// --- 1. Dexie Implementation (Browser / Static) ---
const dexieDb = new Dexie('FilamentTrackerDB') as Dexie & {
  filaments: EntityTable<Filament, 'id'>;
  logs: EntityTable<UsageLog, 'id'>;
};

dexieDb.version(1).stores({
  filaments: '++id, brand, color, material',
  logs: '++id, filamentId, date'
});

const DexieAdapter: DatabaseAPI = {
  async getFilaments() {
    return await dexieDb.filaments.toArray();
  },
  async getFilament(id) {
    return await dexieDb.filaments.get(id);
  },
  async addFilament(data) {
    // Dexie's add returns the key (ID) as a number for auto-increment tables
    return (await dexieDb.filaments.add(data as Filament)) as number;
  },
  async deleteFilament(id) {
    await dexieDb.transaction('rw', dexieDb.filaments, dexieDb.logs, async () => {
      await dexieDb.filaments.delete(id);
      await dexieDb.logs.where('filamentId').equals(id).delete();
    });
  },
  async getLogs(filamentId) {
    return await dexieDb.logs.where('filamentId').equals(filamentId).reverse().sortBy('date');
  },
  async addLog(log, newWeight) {
    await dexieDb.transaction('rw', dexieDb.filaments, dexieDb.logs, async () => {
      await dexieDb.filaments.update(log.filamentId, { weight: newWeight });
      await dexieDb.logs.add(log as UsageLog);
    });
  },
  async updateFilamentWeight(id, newWeight) {
    await dexieDb.filaments.update(id, { weight: newWeight });
  }
};

// --- 2. API Implementation (SQLite / Docker) ---
const API_BASE = '/api';

interface ApiFilament extends Omit<Filament, 'purchaseDate' | 'photo'> {
  purchaseDate: string; // Date comes as string from JSON
  photo?: string; // Base64 string from JSON
}

interface ApiLog extends Omit<UsageLog, 'date'> {
  date: string;
}

const ApiAdapter: DatabaseAPI = {
  async getFilaments() {
    const res = await fetch(`${API_BASE}/filaments`);
    const data: ApiFilament[] = await res.json();
    return data.map((f) => ({
      ...f,
      purchaseDate: new Date(f.purchaseDate),
      photo: f.photo ? b64toBlob(f.photo) : undefined
    }));
  },
  async getFilament(id) {
    const res = await fetch(`${API_BASE}/filaments/${id}`);
    if (!res.ok) return undefined;
    const f: ApiFilament = await res.json();
    return {
      ...f,
      purchaseDate: new Date(f.purchaseDate),
      photo: f.photo ? b64toBlob(f.photo) : undefined
    };
  },
  async addFilament(data) {
    // Convert Blob photo to Base64 string for JSON transport
    let photoStr: string | undefined;
    if (data.photo) {
      photoStr = await blobToB64(data.photo);
    }

    const payload = { ...data, photo: photoStr };
    const res = await fetch(`${API_BASE}/filaments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result.id;
  },
  async deleteFilament(id) {
    await fetch(`${API_BASE}/filaments/${id}`, { method: 'DELETE' });
  },
  async getLogs(filamentId) {
    const res = await fetch(`${API_BASE}/logs/${filamentId}`);
    const data: ApiLog[] = await res.json();
    return data.map((l) => ({
      ...l,
      date: new Date(l.date)
    }));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addLog(log, _newWeight: number) {
    // Server handles weight update in the same transaction
    await fetch(`${API_BASE}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateFilamentWeight(_id: number, _newWeight: number) {
    // Not strictly needed if addLog handles it, but for completeness.
    console.warn("Direct weight update not supported in API yet");
  }
};

// --- Utilities ---
function blobToB64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function b64toBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// --- Export ---
const useSqlite = import.meta.env.VITE_USE_SQLITE === 'true';
export const db = useSqlite ? ApiAdapter : DexieAdapter;
