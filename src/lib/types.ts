export type SessionStatus = "OPEN" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type BookingStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";

/**
 * Ma loi BE tra ve trong truong `code`. Day la hop dong BE <-> FE:
 * bat theo ma nay, khong bao gio so sanh `message`.
 * Xem bang day du o docs/03-backend.md § 2.
 */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_PHONE_FORMAT"
  | "INVALID_CREDENTIALS"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "EMAIL_NOT_VERIFIED"
  | "ACCOUNT_SUSPENDED"
  | "EMAIL_ALREADY_EXISTS"
  | "PHONE_ALREADY_EXISTS"
  | "OTP_INVALID"
  | "OTP_EXPIRED"
  | "OTP_TOO_MANY_ATTEMPTS"
  | "OTP_COOLDOWN"
  | "RATE_LIMITED"
  | "SLOT_ALREADY_HELD"
  | "INSUFFICIENT_PLAYERS"
  | "RESOURCE_NOT_FOUND"
  | "CONSTRAINT_VIOLATION"
  | "INTERNAL_ERROR";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface RegisterResponse {
  /** Email DA CHUAN HOA — phai dung gia tri nay cho buoc nhap OTP, khong dung chuoi nguoi dung go. */
  email: string;
  maskedDestination: string;
  otpExpiresInSeconds: number;
  resendAfterSeconds: number;
  message: string;
}

export interface AvailabilityResponse {
  available: boolean;
  reason: string | null;
}

// ---------------------------------------------------------------------------
// Thong bao
// ---------------------------------------------------------------------------

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type NotificationType =
  | "SESSION_CREATED_BY_USER"
  | "SESSION_READY"
  | "SESSION_NO_LONGER_READY"
  | "NEW_BOOKING"
  | "SESSION_APPROVED"
  | "SESSION_REJECTED"
  | "SESSION_READY_PLAYER"
  | "SESSION_CONFIRMED"
  | "SESSION_CANCELLED"
  | "SESSION_REMINDER_24H"
  | "SESSION_REMINDER_2H"
  | "SESSION_COMPLETED"
  | "POINTS_EARNED"
  | "TIER_UP"
  | "REVIEW_REQUEST"
  | "WAITLIST_SLOT_AVAILABLE";

export interface AppNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string | null;
  payload: Record<string, unknown>;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export interface UnreadCount {
  count: number;
  highPriorityCount: number;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  zaloEnabled: boolean;
  mutedTypes: NotificationType[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Script {
  id: string;
  slug: string;
  title: string;
  minAge: number;
  genre: string;
  difficultyStar: number;
  playerCount: number;
  maleCount: number | null;
  femaleCount: number | null;
  durationText: string;
  basePrice: number;
  npcPrice: number | null;
  description: string;
  categories: Category[];
  coverImageUrl: string | null;
}

export interface ScriptImage {
  id: string;
  imageUrl: string;
  isCover: boolean;
}

export interface Store {
  id: string;
  name: string;
  province: string | null;
  district: string | null;
  street: string | null;
  phone: string | null;
}

export type StoreBranch = Store;

export interface Session {
  id: string;
  script: Script;
  startTime: string;
  minPlayers: number;
  maxPlayers: number;
  status: SessionStatus;
}

/** Session lam giau them so cho da giu (khong co san tu BE, tinh tu GET /sessions/{id}/slots). */
export interface SessionWithCapacity extends Session {
  bookedSlots: number;
}

export type SlotStatus = "AVAILABLE" | "HOLDING" | "BOOKED";

export interface SessionSlot {
  id: string;
  status: SlotStatus;
}

export interface BookingResponse {
  id: string;
  sessionId: string;
  status: BookingStatus;
  discountAmount: number;
  totalAmount: number;
  expiresAt: string;
  sessionSlotIds: string[];
}

export interface Booking {
  id: string;
  session: Session;
  discountAmount: number;
  status: BookingStatus;
  totalAmount: number;
  expiresAt: string | null;
  createdAt: string;
}

export type DiscountType = "PERCENT" | "AMOUNT";

export interface Voucher {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number;
  usageLimit: number | null;
  usedCount: number;
  validFrom: string | null;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

export interface VoucherPreview {
  code: string;
  orderAmount: number;
  discountAmount: number;
  finalAmount: number;
}

export interface Review {
  id: string;
  scriptId: string;
  scriptTitle: string;
  userName: string;
  rating: number;
  comment: string | null;
  verified: boolean;
  createdAt: string;
}

export interface PlayHistoryEntry {
  id: string;
  scriptId: string;
  scriptTitle: string;
  datePlayed: string;
  dmName: string | null;
  rating: number | null;
  comment: string | null;
  ratedAt: string | null;
}

export type LeaderboardPeriod = "week" | "month" | "all";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  casesSolved: number;
  hardestScriptTitle: string | null;
  score: number;
  isCurrentUser: boolean;
}

export interface AdminStats {
  todayPlayers: number;
  openSessionsCount: number;
  pendingBookingsCount: number;
  fillRatePercent: number;
}

export interface PlayerCountPoint {
  date: string;
  playerCount: number;
}

export interface AdminSessionSummary {
  id: string;
  scriptTitle: string;
  startTime: string;
  dmName: string | null;
  bookedSlots: number;
  totalSlots: number;
  status: SessionStatus;
}

export interface AdminBookingDetail {
  id: string;
  status: BookingStatus;
  player: { name: string; phone: string | null; email: string };
  quantity: number;
  payment: { amount: number; transactionId: string | null; gateway: string; verified: boolean } | null;
  timeline: { label: string; timestamp: string }[];
}

export type UserRole = "PLAYER" | "DM" | "ADMIN";

export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

export interface AdminBookingNotification {
  bookingId: string;
  sessionId: string;
  scriptTitle: string;
  sessionStartTime: string;
  playerName: string;
  quantity: number;
  totalAmount: number;
  createdAt: string;
}

export interface SessionCreatedEvent {
  sessionId: string;
  scriptId: string;
  startTime: string;
  minPlayers: number;
  maxPlayers: number;
  status: SessionStatus;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
