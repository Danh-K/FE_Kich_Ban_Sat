import type {
  ApiErrorCode,
  BookingStatus,
  NotificationPriority,
  NotificationType,
  SessionStatus,
} from "./types";

/**
 * Mot noi duy nhat dich ma ky thuat -> chu tieng Viet nguoi dung doc.
 *
 * Vi sao tap trung o day: cung mot trang thai xuat hien o nhieu man (bang admin, lich cua toi,
 * chuong thong bao). Rai chuoi khap noi thi sua mot cho quen ba cho, va nguoi dung thay
 * "Đã hoàn thành" o man nay, "Hoàn tất" o man kia.
 */

// ---------------------------------------------------------------------------
// Trang thai buoi choi
// ---------------------------------------------------------------------------

export const SESSION_STATUS_LABEL: Record<SessionStatus, string> = {
  OPEN: "Đang mở",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã huỷ",
  // BE giu ten COMPLETED trong DB/enum; nguoi dung cuoi doc "Đã hoàn thành".
  COMPLETED: "Đã hoàn thành",
};

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã huỷ",
  REFUNDED: "Đã hoàn tiền",
};

// ---------------------------------------------------------------------------
// Thong bao
// ---------------------------------------------------------------------------

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  SESSION_CREATED_BY_USER: "Lịch mới chờ duyệt",
  SESSION_READY: "Buổi chơi đã đủ người",
  SESSION_NO_LONGER_READY: "Buổi chơi không còn đủ người",
  NEW_BOOKING: "Có người đặt chỗ",
  SESSION_APPROVED: "Lịch đã được duyệt",
  SESSION_REJECTED: "Lịch bị từ chối",
  SESSION_READY_PLAYER: "Buổi chơi của bạn đã đủ người",
  SESSION_CONFIRMED: "Buổi chơi đã được xác nhận",
  SESSION_CANCELLED: "Buổi chơi đã huỷ",
  SESSION_REMINDER_24H: "Nhắc lịch trước 24 giờ",
  SESSION_REMINDER_2H: "Nhắc lịch trước 2 giờ",
  SESSION_COMPLETED: "Buổi chơi đã hoàn thành",
  POINTS_EARNED: "Bạn vừa nhận điểm",
  TIER_UP: "Bạn vừa lên hạng",
  REVIEW_REQUEST: "Mời bạn đánh giá",
  WAITLIST_SLOT_AVAILABLE: "Có chỗ trống cho bạn",
};

/** Mau vien/nen theo do uu tien — dung chung o chuong va trang thong bao. */
export const NOTIFICATION_PRIORITY_STYLE: Record<NotificationPriority, string> = {
  LOW: "border-white/10 text-white/50",
  NORMAL: "border-white/15 text-white/70",
  HIGH: "border-amber-500/40 text-amber-300",
  URGENT: "border-red-500/50 text-red-300",
};

/** Tu muc nay tro len thi phat am bao va hien noi bat (khop app.notification.admin-sound-priority). */
export function isAttentionPriority(priority: NotificationPriority): boolean {
  return priority === "HIGH" || priority === "URGENT";
}

// ---------------------------------------------------------------------------
// Ma loi
// ---------------------------------------------------------------------------

/**
 * Thong diep du phong khi khong muon hien `message` cua BE.
 * Mac dinh nen dung `error.message` (BE viet sat ngu canh hon); bang nay danh cho cac cho
 * can chu ngan gon hoac khi muon dam bao cau chu.
 */
const ERROR_MESSAGE: Partial<Record<ApiErrorCode, string>> = {
  VALIDATION_ERROR: "Dữ liệu nhập vào chưa hợp lệ",
  INVALID_PHONE_FORMAT: "Số điện thoại không hợp lệ (ví dụ đúng: 0912345678)",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng",
  UNAUTHENTICATED: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này",
  EMAIL_NOT_VERIFIED: "Email chưa được xác thực",
  ACCOUNT_SUSPENDED: "Tài khoản đang bị tạm khoá",
  EMAIL_ALREADY_EXISTS: "Email này đã được đăng ký",
  PHONE_ALREADY_EXISTS: "Số điện thoại này đã được đăng ký",
  OTP_INVALID: "Mã xác nhận không đúng",
  OTP_EXPIRED: "Mã xác nhận đã hết hạn, vui lòng lấy mã mới",
  OTP_TOO_MANY_ATTEMPTS: "Bạn đã nhập sai quá nhiều lần, vui lòng yêu cầu mã mới",
  OTP_COOLDOWN: "Vui lòng đợi thêm trước khi gửi lại mã",
  RATE_LIMITED: "Bạn thao tác quá nhanh, vui lòng thử lại sau",
  SLOT_ALREADY_HELD: "Không còn đủ chỗ trống",
  RESOURCE_NOT_FOUND: "Không tìm thấy dữ liệu",
  INTERNAL_ERROR: "Đã có lỗi xảy ra, vui lòng thử lại sau",
};

export function errorMessageFor(code: string, fallback: string): string {
  return ERROR_MESSAGE[code as ApiErrorCode] ?? fallback;
}

/** "2026-08-09T14:53:34Z" -> "5 phút trước" / "hôm qua" — dung cho danh sach thong bao. */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const diffSeconds = Math.floor((now.getTime() - new Date(iso).getTime()) / 1000);
  if (diffSeconds < 60) return "vừa xong";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} phút trước`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} giờ trước`;
  if (diffSeconds < 172800) return "hôm qua";
  if (diffSeconds < 2592000) return `${Math.floor(diffSeconds / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}
