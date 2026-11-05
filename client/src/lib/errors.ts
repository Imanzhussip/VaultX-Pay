import { isAxiosError } from 'axios';

export function getErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.') {
  if (isAxiosError(err)) {
    return err.response?.data?.message || err.response?.data?.error || fallback;
  }
  return fallback;
}
