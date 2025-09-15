import type { BookingDto } from '../api/types';

export interface Booking {
  id: string; // Reservation number
  status: number;
  courseName: string;
  courseImage?: string;
  date: string; // e.g., "2025.07.07 (월)"
  time: string; // e.g., "07:05"
  courseLayout: string;
  conditions: number;
  greenFee: number;
  caddyFee?: number;
  cartFee?: number;
  totalAmount?: number;
  paymentMethod?: string;
  cancellationDeadline: string;
  bookerName: string;
  bookerPhone: string;
  dto?: BookingDto;
}
