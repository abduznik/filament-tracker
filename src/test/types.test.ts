import { describe, it, expect } from 'vitest';
import type { Filament, UsageLog } from '../types';

describe('Types', () => {
  it('Filament interface has required fields', () => {
    const filament: Filament = {
      brand: 'TestBrand',
      color: 'Red',
      material: 'PLA',
      weight: 1000,
      initialWeight: 1000,
      cost: 25.99,
      purchaseDate: new Date(),
    };
    expect(filament.brand).toBe('TestBrand');
    expect(filament.color).toBe('Red');
    expect(filament.material).toBe('PLA');
    expect(filament.weight).toBe(1000);
    expect(filament.initialWeight).toBe(1000);
    expect(filament.cost).toBe(25.99);
  });

  it('UsageLog interface has required fields', () => {
    const log: UsageLog = {
      filamentId: 1,
      changeAmount: -50,
      date: new Date(),
    };
    expect(log.filamentId).toBe(1);
    expect(log.changeAmount).toBe(-50);
  });

  it('Filament supports optional fields', () => {
    const filament: Filament = {
      brand: 'TestBrand',
      color: 'Blue',
      material: 'PETG',
      weight: 500,
      initialWeight: 1000,
      cost: 30,
      purchaseDate: new Date(),
      id: 1,
      photo: new Blob(),
      deleted: 0,
      totalSpent: 30,
    };
    expect(filament.id).toBe(1);
    expect(filament.deleted).toBe(0);
    expect(filament.totalSpent).toBe(30);
  });
});
