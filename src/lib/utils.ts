import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast as _toast, ToasterProps } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: Share sonner toast package with core.
const defaultToastOptions = {
  position: "top-right" as ToasterProps["position"],
  richColors: true,
};

export const toast = {
  error: (message: string, options = {}) =>
    _toast.error(message, { ...defaultToastOptions, ...options }),
  warning: (message: string, options = {}) =>
    _toast.warning(message, { ...defaultToastOptions, ...options }),
  success: (message: string, options = {}) =>
    _toast.success(message, { ...defaultToastOptions, ...options }),
  info: (message: string, options = {}) =>
    _toast.info(message, { ...defaultToastOptions, ...options }),
};

export const formatCurrency = (value?: number) => {
  if (value === undefined) {
    return "NA";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
};
