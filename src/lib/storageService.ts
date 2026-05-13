// Offline storage for My Driving Diary.
// Uses Capacitor Preferences on Android/iOS and localStorage in the browser.

import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

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
  currency: "myDrivingDiary_currency",
} as const;

export type CurrencyCode = "USD" | "EUR" | "GBP" | "IDR" | "JPY" | "INR" | "AUD" | "CAD";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
  decimals: number;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", label: "US Dollar", locale: "en-US", decimals: 2 },
  { code: "EUR", symbol: "€", label: "Euro", locale: "de-DE", decimals: 2 },
  { code: "GBP", symbol: "£", label: "British Pound", locale: "en-GB", decimals: 2 },
  { code: "IDR", symbol: "Rp", label: "Indonesian Rupiah", locale: "id-ID", decimals: 0 },
  { code: "JPY", symbol: "¥", label: "Japanese Yen", locale: "ja-JP", decimals: 0 },
  { code: "INR", symbol: "₹", label: "Indian Rupee", locale: "en-IN", decimals: 2 },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", locale: "en-AU", decimals: 2 },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar", locale: "en-CA", decimals: 2 },
];

export const DEFAULT_CURRENCY: CurrencyCode = "USD";
const CURRENCY_EVENT = "myDrivingDiary:currencyChanged";
const isBrowser = () => typeof window !== "undefined";
const isNative = () => isBrowser() && Capacitor.isNativePlatform();
const memory: Partial<Record<(typeof KEYS)[keyof typeof KEYS], string>> = {};

export const initStorage = async () => {
  const keys = Object.values(KEYS);
  if (isNative()) {
    await Promise.all(
      keys.map(async (key) => {
        const { value } = await Preferences.get({ key });
        if (value != null) memory[key] = value;
      }),
    );
    return;
  }

  if (!isBrowser()) return;
  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value != null) memory[key] = value;
  });
};

export const getCurrency = (): CurrencyCode => {
  if (!isBrowser()) return DEFAULT_CURRENCY;
  const v = localStorage.getItem(KEYS.currency) as CurrencyCode | null;
  return v && CURRENCIES.some((c) => c.code === v) ? v : DEFAULT_CURRENCY;
};

export const setCurrency = (code: CurrencyCode) => {
  if (!isBrowser()) return;
  memory[KEYS.currency] = code;
  void persist(KEYS.currency, code);
  window.dispatchEvent(new CustomEvent(CURRENCY_EVENT, { detail: code }));
};

export const getCurrencyInfo = (code?: CurrencyCode): CurrencyInfo => {
  const c = code ?? getCurrency();
  return CURRENCIES.find((x) => x.code === c) ?? CURRENCIES[0];
};

export const formatMoney = (amount: number, code?: CurrencyCode): string => {
  const info = getCurrencyInfo(code);
  try {
    return new Intl.NumberFormat(info.locale, {
      style: "currency",
      currency: info.code,
      maximumFractionDigits: info.decimals,
      minimumFractionDigits: 0,
    }).format(amount || 0);
  } catch {
    return `${info.symbol} ${(amount || 0).toLocaleString()}`;
  }
};

export const formatMoneyShort = (amount: number, code?: CurrencyCode): string => {
  const info = getCurrencyInfo(code);
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${info.symbol}${(amount / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${info.symbol}${(amount / 1_000).toFixed(0)}k`;
  return formatMoney(amount, info.code);
};

export const onCurrencyChange = (cb: (code: CurrencyCode) => void) => {
  if (!isBrowser()) return () => {};
  const handler = (e: Event) => cb(((e as CustomEvent).detail as CurrencyCode) ?? getCurrency());
  window.addEventListener(CURRENCY_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CURRENCY_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

function read<T>(key: string): T[] {
  try {
    const raw = memory[key as keyof typeof memory];
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  const payload = JSON.stringify(value);
  memory[key as keyof typeof memory] = payload;
  void persist(key, payload);
}

async function persist(key: string, value: string) {
  if (isNative()) {
    await Preferences.set({ key, value });
    return;
  }
  if (isBrowser()) localStorage.setItem(key, value);
}

async function removePersisted(key: string) {
  delete memory[key as keyof typeof memory];
  if (isNative()) {
    await Preferences.remove({ key });
    return;
  }
  if (isBrowser()) localStorage.removeItem(key);
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
  void removePersisted(KEYS.drives);
  void removePersisted(KEYS.fuels);
  void removePersisted(KEYS.services);
};

export const APP_VERSION = "1.0.0";
