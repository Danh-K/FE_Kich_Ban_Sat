"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BookingResponse, Script, SessionWithCapacity } from "@/lib/types";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { secondsUntil } from "./countdown";
import { StepHeader } from "./StepHeader";
import { Step1SessionSelect } from "./Step1SessionSelect";
import { Step2QuantitySelect } from "./Step2QuantitySelect";
import { Step3Confirm } from "./Step3Confirm";
import { Step4Payment } from "./Step4Payment";
import { ExpiredModal } from "./ExpiredModal";

type Step = 1 | 2 | 3 | 4;

interface BookingFlowProps {
  script: Script;
  sessions: SessionWithCapacity[];
  initialSessionId?: string;
}

function resolveInitialSessionId(
  sessions: SessionWithCapacity[],
  initialSessionId: string | undefined
): string | undefined {
  if (!initialSessionId) return undefined;
  const session = sessions.find((s) => s.id === initialSessionId);
  if (!session) return undefined;
  if (session.bookedSlots >= session.maxPlayers) return undefined;
  return session.id;
}

const STEP_TRANSITION = { duration: 0.2, ease: "easeInOut" as const };

export function BookingFlow({ script, sessions, initialSessionId }: BookingFlowProps) {
  const { user, token, isAuthenticated } = useAuth();
  const resolvedInitialId = resolveInitialSessionId(sessions, initialSessionId);

  const [step, setStep] = useState<Step>(resolvedInitialId ? 2 : 1);
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(
    resolvedInitialId
  );
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdError, setHoldError] = useState<string | null>(null);

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) ?? null;
  const expired = secondsLeft === 0 && step !== 4;

  // Dem nguoc thuc te dua tren booking.expiresAt tu BE, khong con gia lap thoi luong co dinh tren FE.
  useEffect(() => {
    if (!booking) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSecondsLeft(secondsUntil(booking.expiresAt));
    const interval = setInterval(() => {
      setSecondsLeft(secondsUntil(booking.expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [booking]);

  function handleSelectSession(sessionId: string) {
    if (sessionId !== selectedSessionId) {
      setBooking(null);
      setSecondsLeft(null);
      setHoldError(null);
    }
    setSelectedSessionId(sessionId);
    setStep(2);
  }

  async function handleHoldQuantity(quantity: number, voucherCode: string | null) {
    if (!selectedSession || !user) return;
    setIsHolding(true);
    setHoldError(null);
    try {
      const response = await api.post<BookingResponse>(
        "/api/bookings",
        { userId: user.id, sessionId: selectedSession.id, quantity, voucherCode },
        token
      );
      setBooking(response);
    } catch (err) {
      setHoldError(err instanceof ApiError ? err.message : "Không giữ được chỗ, vui lòng thử lại");
    } finally {
      setIsHolding(false);
    }
  }

  function handleContinueToConfirm() {
    if (booking) setStep(3);
  }

  function handleContinueToPayment() {
    setStep(4);
  }

  function handleBackToSessions() {
    setStep(1);
  }

  function handleBackToQuantity() {
    setStep(2);
  }

  function handleReset() {
    setStep(1);
    setSelectedSessionId(undefined);
    setBooking(null);
    setSecondsLeft(null);
    setHoldError(null);
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-24 md:pt-28">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-red-600">
          ĐẶT LỊCH
        </p>
        <h1 className="mt-2 font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0] md:text-3xl">
          {script.title}
        </h1>

        <div className="mt-8">
          <StepHeader step={step} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={STEP_TRANSITION}
            >
              <Step1SessionSelect sessions={sessions} onSelect={handleSelectSession} />
            </motion.div>
          )}

          {step === 2 && selectedSession && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={STEP_TRANSITION}
            >
              <Step2QuantitySelect
                session={selectedSession}
                basePrice={script.basePrice}
                heldQuantity={booking?.sessionSlotIds.length ?? null}
                secondsLeft={secondsLeft}
                isHolding={isHolding}
                holdError={holdError}
                isAuthenticated={isAuthenticated}
                onHold={handleHoldQuantity}
                onContinue={handleContinueToConfirm}
                onBack={handleBackToSessions}
              />
            </motion.div>
          )}

          {step === 3 && selectedSession && booking && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={STEP_TRANSITION}
            >
              <Step3Confirm
                script={script}
                session={selectedSession}
                booking={booking}
                secondsLeft={secondsLeft}
                onContinue={handleContinueToPayment}
                onBack={handleBackToQuantity}
              />
            </motion.div>
          )}

          {step === 4 && booking && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={STEP_TRANSITION}
            >
              <Step4Payment bookingId={booking.id} amount={booking.totalAmount} secondsLeft={secondsLeft} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {expired && <ExpiredModal onReset={handleReset} />}
    </div>
  );
}
