import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const EMPTY_ARR: any[] = []

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function isNil(value: any): value is null | undefined {
  return value === null || value === undefined
}

export function isNull(value: any): value is null {
  return value === null
}

export function isUndefined(value: any): value is undefined {
  return value === undefined
}
