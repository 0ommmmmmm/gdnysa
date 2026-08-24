import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, CalendarDays, Clock, Info, X } from "lucide-react";
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProgramIcon } from "@/components/programs/ProgramIcon";
import { INR, type Program } from "@/data/programs";

interface ProgramModalProps {
  program: Program | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProgramModal({ program, open, onOpenChange }: ProgramModalProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top whenever a different programme is opened
  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [open, program?.id]);

  if (!program) return null;

  const joinNow = () => {
    onOpenChange(false);
    navigate(`/join?program=${encodeURIComponent(program.enrollmentValue)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/[0.60]" />
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 pointer-events-none">
          <DialogPrimitive.Content
            className="pointer-events-auto relative my-auto flex max-h-[85vh] w-full max-w-[900px] flex-col gap-0 rounded-[20px] border border-[#E8E4D9] bg-[#FDFBF5] p-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          >
            <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full border border-[#D8D4C8] bg-[#FFFDF7] p-2 text-[#252525] shadow-sm transition-all hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            <div ref={scrollRef} className="overflow-y-auto overscroll-contain p-6 sm:p-8">

              {/* Header */}
              <div className="flex items-start gap-4 pr-8">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <ProgramIcon icon={program.icon} className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <DialogTitle className="font-serif text-2xl font-bold text-[#252525]">
                    {program.title}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-[#666666]">
                    Starting at{" "}
                    <span className="font-semibold text-primary">
                      {INR(program.startingPrice)}
                    </span>
                  </DialogDescription>
                </div>
              </div>

              {program.tagline && (
                <p className="mt-6 font-serif text-lg italic text-primary">
                  “{program.tagline}”
                </p>
              )}

              <div className="mt-4 space-y-3">
                {program.description.map((para) => (
                  <p key={para} className="text-sm leading-relaxed text-[#4A4A4A]">
                    {para}
                  </p>
                ))}
              </div>

              {/* What you'll experience */}
              {(program.experienceIntro || program.experienceSteps?.length) && (
                <div className="mt-6 rounded-[18px] border border-[#D8D4C8] bg-[#F3F0E7] p-5">
                  <h4 className="font-semibold text-[#252525]">
                    What you'll experience
                    {program.experienceTitle ? ` — ${program.experienceTitle}` : ""}
                  </h4>
                  {program.experienceIntro && (
                    <p className="mt-2 font-medium text-primary">
                      {program.experienceIntro}
                    </p>
                  )}
                  {program.experienceSteps?.length ? (
                    <ul className="mt-3 space-y-2">
                      {program.experienceSteps.map((step) => (
                        <li key={step.label} className="text-sm text-[#4A4A4A]">
                          <span className="font-medium text-[#252525]">
                            {step.label}
                          </span>
                          {step.detail ? ` — ${step.detail}` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {program.experienceNote && (
                    <p className="mt-3 text-sm text-[#666666]">
                      {program.experienceNote}
                    </p>
                  )}
                </div>
              )}

              {/* What you'll get */}
              <div className="mt-6">
                <h4 className="font-semibold text-[#252525]">What you'll get</h4>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-sm text-[#4A4A4A]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plans */}
              {program.plans?.length ? (
                <div className="mt-6">
                  <h4 className="font-semibold text-[#252525]">
                    {program.title} Plans
                  </h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {program.plans.map((plan) => (
                      <div
                        key={plan.name}
                        className="rounded-[18px] border border-[#D8D4C8] bg-[#F3F0E7] p-4 text-center"
                      >
                        {plan.badgeClass && plan.gem && (
                          <span className={plan.badgeClass}>{plan.gem}</span>
                        )}
                        <p className="mt-2 font-medium text-[#252525]">{plan.name}</p>
                        <p className="text-lg font-bold text-primary">
                          {INR(plan.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Schedule */}
              <div className="mt-6 space-y-2 rounded-[18px] border border-[#D8D4C8] bg-[#F3F0E7] p-5">
                <h4 className="font-semibold text-[#252525]">Schedule</h4>
                {program.startDate && (
                  <p className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Starts: {program.startDate}
                  </p>
                )}
                {program.schedule.map((line) => (
                  <p
                    key={line}
                    className="flex items-center gap-2 text-sm text-[#4A4A4A]"
                  >
                    <Clock className="h-4 w-4 text-primary" />
                    {line}
                  </p>
                ))}
                {program.slots?.length ? (
                  <div className="pt-1">
                    <p className="text-sm font-medium text-[#252525]">
                      Available slots
                    </p>
                    <ul className="mt-1 flex flex-wrap gap-2">
                      {program.slots.map((slot) => (
                        <li
                          key={slot}
                          className="rounded-full border border-[#D8D4C8] bg-[#FDFBF5] px-3 py-1 text-xs text-[#4A4A4A]"
                        >
                          {slot}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {program.status && (
                  <p className="flex items-center gap-2 pt-1 text-sm text-[#666666]">
                    <Info className="h-4 w-4 text-primary" />
                    {program.status}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={joinNow}
                  className="flex-1 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  Join Now
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl border border-[#D8D4C8] bg-[#F3F0E7] px-6 py-3 font-medium text-[#252525] transition-all hover:border-primary hover:text-primary sm:w-32"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
