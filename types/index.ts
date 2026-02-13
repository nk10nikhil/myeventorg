/**
 * QR Ticketing System - Type Definitions
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  eventIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SuperAdmin {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  ticketPrice: number;
  maxCapacity: number;
  isActive: boolean;
  qrValidityStart?: Date;
  qrValidityEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  _id: string;
  userId: string;
  eventId: string | Event;
  qrCode: string;
  qrId: string;
  paymentId: string;
  paymentStatus: "pending" | "completed" | "failed";
  amount: number;
  scanStatus: "unused" | "used";
  scannedAt?: Date;
  scannedBy?: string;
  scannedAtGate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Entry {
  _id: string;
  ticketId: string;
  userId: string | User;
  eventId: string;
  entryTime: Date;
  gateName: string;
  scannedBy: string;
  scannedOffline: boolean;
  syncedAt?: Date;
  deviceInfo?: string;
  createdAt: Date;
}

export interface ActivityLog {
  _id: string;
  adminId: string;
  eventId: string;
  action: string;
  targetType: "user" | "ticket" | "event" | "admin";
  targetId: string;
  details: string;
  timestamp: Date;
}

export interface DashboardStats {
  totalRegistered: number;
  totalTickets: number;
  checkedIn: number;
  remaining: number;
}

export interface Analytics {
  eventId: string;
  eventName: string;
  totalUsers: number;
  totalTickets: number;
  checkedIn: number;
  remaining: number;
  revenue: number;
  checkInRate: number;
  hourlyEntries: { [key: string]: number };
}

export interface OfflineScan {
  qrId: string;
  gateName: string;
  scannedAt: string;
  deviceInfo: string;
}
