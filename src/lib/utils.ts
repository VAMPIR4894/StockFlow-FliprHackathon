
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a number as Indian Rupees
export function formatIndianRupees(amount: number, options: { compact?: boolean } = {}) {
  const { compact = false } = options;
  
  if (compact) {
    if (amount >= 1_00_00_00_000) {
      return `₹${(amount / 1_00_00_00_000).toFixed(2)} Lakh Cr`;
    } else if (amount >= 1_00_00_000) {
      return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
    } else if (amount >= 1_00_000) {
      return `₹${(amount / 1_00_000).toFixed(2)} Lakh`;
    } else {
      return `₹${amount.toFixed(2)}`;
    }
  }
  
  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })}`;
}

// Convert USD to INR
export function usdToInr(usdAmount: number) {
  const conversionRate = 85;
  return usdAmount * conversionRate;
}
