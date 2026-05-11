import { useEffect, useState, useCallback } from "react";
import {
  CurrencyCode,
  DEFAULT_CURRENCY,
  formatMoney,
  formatMoneyShort,
  getCurrency,
  getCurrencyInfo,
  onCurrencyChange,
  setCurrency as persistCurrency,
} from "@/lib/storageService";

export function useCurrency() {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    setCurrencyState(getCurrency());
    return onCurrencyChange((c) => setCurrencyState(c));
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    persistCurrency(c);
    setCurrencyState(c);
  }, []);

  return {
    currency,
    info: getCurrencyInfo(currency),
    setCurrency,
    format: (n: number) => formatMoney(n, currency),
    formatShort: (n: number) => formatMoneyShort(n, currency),
  };
}
