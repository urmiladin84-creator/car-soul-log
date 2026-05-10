// LocalStorage-backed offline storage for My Driving Diary

export type Purpose = "Commute" | "Road Trip" | "Family Trip" | "Night Drive" | "Work" | "Errands" | "Other";

export interface Drive {
  id: string;
  date: string; // ISO yyyy-mm-dd
  start: string;
  destination: string;
  distance: number; // km
  duration?: string;
  purpose: Purpose;
  mood: string; // emoji
  notes?: string;
  photo?: string; // base64 data URL
  createdAt: number;
}

export interface Fuel {
  id: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  total: number;
  fuelType: string;
  createdAt: number;
}

export interface Service {
  id: string;
  date: string;
  odometer: number;
  serviceType: string;
  workshop: string;
  cost: number;
  notes?: string;
  createdAt: number;
}

const KEYS = {
  drives: "myDrivingDiary_drives",
  fuels: "myDrivingDiary_fuels",
  services: "myDrivingDiary_services",
  settings: "myDrivingDiary_settings",
} as const;

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Drives
export const getDrives = (): Drive[] => read<Drive>(KEYS.drives);
export const saveDrives = (d: Drive[]) => write(KEYS.drives, d);
export const addDrive = (d: Omit<Drive, "id" | "createdAt">): Drive => {
  const item: Drive = { ...d, id: uid(), createdAt: Date.now() };
  const all = [item, ...getDrives()];
  saveDrives(all);
  return item;
};
export const updateDrive = (id: string, patch: Partial<Drive>) => {
  const all = getDrives().map((d) => (d.id === id ? { ...d, ...patch } : d));
  saveDrives(all);
};
export const deleteDrive = (id: string) => {
  saveDrives(getDrives().filter((d) => d.id !== id));
};

// Fuels
export const getFuels = (): Fuel[] => read<Fuel>(KEYS.fuels);
export const saveFuels = (f: Fuel[]) => write(KEYS.fuels, f);
export const addFuel = (f: Omit<Fuel, "id" | "createdAt" | "total"> & { total?: number }): Fuel => {
  const total = f.total ?? +(f.liters * f.pricePerLiter).toFixed(2);
  const item: Fuel = { ...f, total, id: uid(), createdAt: Date.now() };
  saveFuels([item, ...getFuels()]);
  return item;
};

// Services
export const getServices = (): Service[] => read<Service>(KEYS.services);
export const saveServices = (s: Service[]) => write(KEYS.services, s);
export const addService = (s: Omit<Service, "id" | "createdAt">): Service => {
  const item: Service = { ...s, id: uid(), createdAt: Date.now() };
  saveServices([item, ...getServices()]);
  return item;
};

// Bulk
export const exportAll = () => ({
  drives: getDrives(),
  fuels: getFuels(),
  services: getServices(),
  exportedAt: new Date().toISOString(),
  version: 1,
});

export const importAll = (data: { drives?: Drive[]; fuels?: Fuel[]; services?: Service[] }) => {
  if (data.drives) saveDrives(data.drives);
  if (data.fuels) saveFuels(data.fuels);
  if (data.services) saveServices(data.services);
};

export const resetAll = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.drives);
  localStorage.removeItem(KEYS.fuels);
  localStorage.removeItem(KEYS.services);
};

export const APP_VERSION = "1.0.0";
