"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";

type Service = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
};

type Barber = {
  id: string;
  name: string;
  specialty: string;
  initials: string;
};

type BookingDate = {
  value: string;
  weekday: string;
  day: string;
  month: string;
};

type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
};

const services: Service[] = [
  {
    id: "northside-cut",
    name: "The Northside Cut",
    description: "A considered cut, finished with a hot towel and the details done right.",
    duration: "40 min",
    price: 35,
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    description: "A precise shape-up and clean lines, tailored to your face and style.",
    duration: "30 min",
    price: 25,
  },
  {
    id: "cut-and-beard",
    name: "Cut & Beard",
    description: "A fresh haircut and a carefully finished beard.",
    duration: "60 min",
    price: 55,
  },
];

const barbers: Barber[] = [
  {
    id: "marcus-reed",
    name: "Marcus Reed",
    specialty: "Classic cuts & scissor work",
    initials: "MR",
  },
  {
    id: "elliot-james",
    name: "Elliot James",
    specialty: "Fades & modern texture",
    initials: "EJ",
  },
  {
    id: "andre-brooks",
    name: "Andre Brooks",
    specialty: "Beard work & hot towel shaves",
    initials: "AB",
  },
];

const demoDates: BookingDate[] = [
  { value: "2026-11-17", weekday: "Tue", day: "17", month: "Nov" },
  { value: "2026-11-18", weekday: "Wed", day: "18", month: "Nov" },
  { value: "2026-11-19", weekday: "Thu", day: "19", month: "Nov" },
  { value: "2026-11-20", weekday: "Fri", day: "20", month: "Nov" },
  { value: "2026-11-21", weekday: "Sat", day: "21", month: "Nov" },
  { value: "2026-11-24", weekday: "Tue", day: "24", month: "Nov" },
];

const demoTimes = ["9:00 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

const stepLabels = ["Service", "Barber", "Date", "Time", "Your details", "Review"];

function ArrowIcon({ back = false }: { back?: boolean }) {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      {back ? (
        <path
          d="M13.5 8h-10m4 4-4-4 4-4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      ) : (
        <path
          d="M2.5 8h10m-4-4 4 4-4 4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path
        d="m3.5 8 3 3 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden border border-white/15 bg-[#1a1a1a] font-display text-2xl font-bold leading-none text-[#eee9df]">
      <span className="relative z-10">N</span>
      <span aria-hidden="true" className="absolute -bottom-2 -right-1 h-5 w-5 rotate-45 bg-[#9f2924]" />
    </span>
  );
}

function PrimaryButton({
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-3 bg-[#9f2924] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#fffaf2] transition-colors hover:bg-[#b83730] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eee9df] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#9f2924] ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

function DemoNotice() {
  return (
    <div
      className="flex gap-3 border border-[#9f2924]/40 bg-[#9f2924]/10 p-4 text-xs leading-5 text-[#d8c8bd]"
      role="note"
    >
      <span aria-hidden="true" className="font-display text-lg font-bold text-[#c66a62]">
        i
      </span>
      <p>
        <strong className="font-semibold text-[#eee9df]">Demo booking flow.</strong>{" "}
        Dates and times shown are examples, not live availability. No real appointment
        will be created.
      </p>
    </div>
  );
}

function StepProgress({
  currentStep,
  onStepSelect,
}: {
  currentStep: number;
  onStepSelect: (step: number) => void;
}) {
  return (
    <nav aria-label="Booking steps" className="mb-8">
      <ol className="grid grid-cols-6 gap-2 sm:gap-3">
        {stepLabels.map((label, index) => {
          const step = index + 1;
          const isComplete = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <li className="min-w-0" key={label}>
              <button
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${label}${isComplete ? ", completed. Go back to this step." : isCurrent ? ", current step." : ""}`}
                className="group flex w-full flex-col items-start gap-2 text-left disabled:cursor-default"
                disabled={!isComplete}
                onClick={() => onStepSelect(step)}
                type="button"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center border text-[10px] font-bold ${
                    isCurrent
                      ? "border-[#9f2924] bg-[#9f2924] text-white"
                      : isComplete
                        ? "border-[#9f2924] text-[#c66a62] group-hover:bg-[#9f2924]/15"
                        : "border-white/15 text-[#77736d]"
                  }`}
                >
                  {isComplete ? <CheckIcon /> : `0${step}`}
                </span>
                <span
                  className={`hidden truncate text-[9px] font-bold uppercase tracking-[0.1em] sm:block ${
                    isCurrent ? "text-[#eee9df]" : "text-[#77736d]"
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p aria-live="polite" className="mt-4 text-xs text-[#aaa59c] sm:hidden">
        Step {currentStep} of {stepLabels.length} · {stepLabels[currentStep - 1]}
      </p>
      <div
        aria-hidden="true"
        className="mt-3 h-px bg-white/10"
      >
        <div
          className="h-px bg-[#9f2924] transition-[width]"
          style={{ width: `${(currentStep / stepLabels.length) * 100}%` }}
        />
      </div>
    </nav>
  );
}

function StepHeading({ eyebrow, title, description }: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#c66a62]">
        {eyebrow}
      </p>
      <h1 className="font-display text-4xl font-semibold uppercase leading-[0.9] text-[#eee9df] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-xs leading-6 text-[#aaa59c] sm:text-sm">
        {description}
      </p>
    </div>
  );
}

function BookingSummary({
  service,
  barber,
  date,
  time,
  customer,
  compact = false,
}: {
  service: Service | undefined;
  barber: Barber | undefined;
  date: BookingDate | undefined;
  time: string;
  customer: CustomerDetails;
  compact?: boolean;
}) {
  const rows = [
    ["Service", service?.name],
    ["Barber", barber?.name],
    ["Date", date ? `${date.weekday}, ${date.month} ${date.day}, 2026` : undefined],
    ["Time", time || undefined],
  ];

  return (
    <section
      aria-label="Your appointment summary"
      className={`border border-white/10 bg-[#1a1a1a] ${compact ? "p-4" : "p-5 sm:p-6"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold uppercase text-[#eee9df]">
          Your visit
        </h2>
        <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#c66a62]">
          Demo
        </span>
      </div>
      <dl className={`mt-4 ${compact ? "grid grid-cols-2 gap-x-3 gap-y-3" : "space-y-4"}`}>
        {rows.map(([label, value]) => (
          <div className={compact ? "min-w-0" : "border-b border-white/10 pb-3"} key={label}>
            <dt className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#77736d]">
              {label}
            </dt>
            <dd className="mt-1 truncate text-xs font-medium text-[#eee9df]">
              {value ?? <span className="text-[#77736d]">Not selected</span>}
            </dd>
          </div>
        ))}
      </dl>
      {!compact && customer.name && (
        <div className="mt-4 border-b border-white/10 pb-3">
          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#77736d]">
            Guest
          </p>
          <p className="mt-1 truncate text-xs font-medium text-[#eee9df]">{customer.name}</p>
        </div>
      )}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#aaa59c]">
          Estimated total
        </span>
        <span className="font-display text-2xl font-semibold text-[#c66a62]">
          {service ? `$${service.price}` : "—"}
        </span>
      </div>
      <p className="mt-3 text-[9px] leading-4 text-[#77736d]">
        Sample details only. This is not a confirmed appointment.
      </p>
    </section>
  );
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    phone: "",
    email: "",
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectedService = services.find((service) => service.id === serviceId);
  const selectedBarber = barbers.find((barber) => barber.id === barberId);
  const selectedDate = demoDates.find((date) => date.value === dateValue);

  function updateCustomer(field: keyof CustomerDetails, value: string) {
    setCustomer((previous) => ({ ...previous, [field]: value }));
  }

  function handleCustomerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setCurrentStep(6);
  }

  function startOver() {
    setCurrentStep(1);
    setServiceId("");
    setBarberId("");
    setDateValue("");
    setTime("");
    setCustomer({ name: "", phone: "", email: "" });
    setIsConfirmed(false);
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <Link
            aria-label="NorthSide Barber home"
            className="inline-flex items-center gap-3"
            href="/"
          >
            <BrandMark />
            <span className="flex flex-col font-display text-xl font-bold uppercase leading-[0.8] tracking-[0.04em] text-[#eee9df]">
              NorthSide
              <span className="mt-1.5 text-[9px] font-semibold tracking-[0.3em] text-[#aaa59c]">
                Barber Co.
              </span>
            </span>
          </Link>
          <Link
            className="inline-flex min-h-10 items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#aaa59c] transition-colors hover:text-[#eee9df] focus-visible:outline-2 focus-visible:outline-[#eee9df]"
            href="/"
          >
            <ArrowIcon back />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#c66a62]">
              North Portland · Est. 2018
            </p>
            <p className="font-display text-3xl font-semibold uppercase leading-none text-[#eee9df] sm:text-4xl">
              Make time for a good cut.
            </p>
          </div>

          <DemoNotice />

          {isConfirmed ? (
            <section
              aria-labelledby="confirmation-title"
              className="mx-auto mt-8 max-w-2xl border border-white/10 bg-[#1a1a1a] p-6 text-center sm:mt-12 sm:p-10"
              role="status"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center border border-[#9f2924] text-[#c66a62]">
                <CheckIcon />
              </span>
              <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.22em] text-[#c66a62]">
                Frontend demonstration
              </p>
              <h1
                className="mt-2 font-display text-4xl font-semibold uppercase leading-[0.9] text-[#eee9df] sm:text-5xl"
                id="confirmation-title"
              >
                Your demo is complete.
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#aaa59c]">
                Your selections are shown below as a preview. No appointment was
                booked, sent, or saved.
              </p>
              <div className="mt-8 text-left">
                <BookingSummary
                  barber={selectedBarber}
                  customer={customer}
                  date={selectedDate}
                  service={selectedService}
                  time={time}
                />
              </div>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <PrimaryButton onClick={startOver}>Start another demo</PrimaryButton>
                <Link
                  className="inline-flex min-h-12 items-center justify-center border border-white/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#eee9df] transition-colors hover:border-white/35 focus-visible:outline-2 focus-visible:outline-[#eee9df]"
                  href="/"
                >
                  Return home
                </Link>
              </div>
            </section>
          ) : (
            <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
              <section
                aria-label={`Booking step ${currentStep}: ${stepLabels[currentStep - 1]}`}
                className="min-w-0"
              >
                <StepProgress
                  currentStep={currentStep}
                  onStepSelect={setCurrentStep}
                />

                <div className="mb-5 md:hidden">
                  <BookingSummary
                    barber={selectedBarber}
                    compact
                    customer={customer}
                    date={selectedDate}
                    service={selectedService}
                    time={time}
                  />
                </div>

                {currentStep === 1 && (
                  <div>
                    <StepHeading
                      description="Choose the service you have in mind. Prices and durations are examples for this demo."
                      eyebrow="Step 01 · Choose a service"
                      title="What can we do for you?"
                    />
                    <fieldset className="space-y-3">
                      <legend className="sr-only">Choose a service</legend>
                      {services.map((service) => {
                        const selected = service.id === serviceId;
                        return (
                          <button
                            aria-pressed={selected}
                            className={`flex w-full items-start justify-between gap-4 border p-4 text-left transition-colors sm:p-5 ${
                              selected
                                ? "border-[#9f2924] bg-[#9f2924]/10"
                                : "border-white/10 bg-[#1a1a1a] hover:border-white/25"
                            }`}
                            key={service.id}
                            onClick={() => setServiceId(service.id)}
                            type="button"
                          >
                            <span className="flex min-w-0 gap-3 sm:gap-4">
                              <span
                                aria-hidden="true"
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${
                                  selected
                                    ? "border-[#9f2924] bg-[#9f2924] text-white"
                                    : "border-white/25 text-transparent"
                                }`}
                              >
                                <CheckIcon />
                              </span>
                              <span className="min-w-0">
                                <span className="block font-display text-2xl font-semibold uppercase leading-none text-[#eee9df]">
                                  {service.name}
                                </span>
                                <span className="mt-2 block text-[11px] leading-5 text-[#aaa59c]">
                                  {service.description}
                                </span>
                                <span className="mt-3 block text-[9px] font-bold uppercase tracking-[0.12em] text-[#77736d]">
                                  {service.duration}
                                </span>
                              </span>
                            </span>
                            <span className="shrink-0 font-display text-2xl font-semibold text-[#c66a62]">
                              ${service.price}
                            </span>
                          </button>
                        );
                      })}
                    </fieldset>
                    <div className="mt-7 flex justify-end">
                      <PrimaryButton
                        disabled={!serviceId}
                        onClick={() => setCurrentStep(2)}
                      >
                        Choose a barber <ArrowIcon />
                      </PrimaryButton>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <StepHeading
                      description="Pick the barber you would like to see."
                      eyebrow="Step 02 · Choose a barber"
                      title="Who would you like to see?"
                    />
                    <fieldset className="grid gap-3 sm:grid-cols-3">
                      <legend className="sr-only">Choose a barber</legend>
                      {barbers.map((barber) => {
                        const selected = barber.id === barberId;
                        return (
                          <button
                            aria-pressed={selected}
                            className={`flex min-h-48 flex-col items-start border p-4 text-left transition-colors sm:p-5 ${
                              selected
                                ? "border-[#9f2924] bg-[#9f2924]/10"
                                : "border-white/10 bg-[#1a1a1a] hover:border-white/25"
                            }`}
                            key={barber.id}
                            onClick={() => setBarberId(barber.id)}
                            type="button"
                          >
                            <span
                              aria-hidden="true"
                              className={`flex h-12 w-12 items-center justify-center border font-display text-xl font-semibold ${
                                selected
                                  ? "border-[#9f2924] text-[#c66a62]"
                                  : "border-white/15 text-[#aaa59c]"
                              }`}
                            >
                              {barber.initials}
                            </span>
                            <span className="mt-5 font-display text-2xl font-semibold uppercase leading-none text-[#eee9df]">
                              {barber.name}
                            </span>
                            <span className="mt-2 text-[10px] leading-5 text-[#aaa59c]">
                              {barber.specialty}
                            </span>
                          </button>
                        );
                      })}
                    </fieldset>
                    <div className="mt-7 flex items-center justify-between gap-3">
                      <button
                        className="inline-flex min-h-12 items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa59c] hover:text-[#eee9df]"
                        onClick={() => setCurrentStep(1)}
                        type="button"
                      >
                        <ArrowIcon back /> Back
                      </button>
                      <PrimaryButton
                        disabled={!barberId}
                        onClick={() => setCurrentStep(3)}
                      >
                        Choose a date <ArrowIcon />
                      </PrimaryButton>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <StepHeading
                      description="Select a sample date to continue. These dates are for demonstration only."
                      eyebrow="Step 03 · Choose a date"
                      title="When works for you?"
                    />
                    <fieldset>
                      <legend className="mb-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#aaa59c]">
                        Sample dates · November 2026
                      </legend>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {demoDates.map((date) => {
                          const selected = date.value === dateValue;
                          return (
                            <button
                              aria-pressed={selected}
                              className={`flex min-h-24 flex-col items-center justify-center gap-1 border transition-colors ${
                                selected
                                  ? "border-[#9f2924] bg-[#9f2924]/10"
                                  : "border-white/10 bg-[#1a1a1a] hover:border-white/25"
                              }`}
                              key={date.value}
                              onClick={() => {
                                setDateValue(date.value);
                                setTime("");
                              }}
                              type="button"
                            >
                              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#aaa59c]">
                                {date.weekday}
                              </span>
                              <span className="font-display text-3xl font-semibold leading-none text-[#eee9df]">
                                {date.day}
                              </span>
                              <span className="text-[9px] uppercase tracking-[0.12em] text-[#77736d]">
                                {date.month}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                    <p className="mt-4 text-[10px] leading-5 text-[#77736d]">
                      Sample dates only. This calendar is not connected to the shop’s schedule.
                    </p>
                    <div className="mt-7 flex items-center justify-between gap-3">
                      <button
                        className="inline-flex min-h-12 items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa59c] hover:text-[#eee9df]"
                        onClick={() => setCurrentStep(2)}
                        type="button"
                      >
                        <ArrowIcon back /> Back
                      </button>
                      <PrimaryButton
                        disabled={!dateValue}
                        onClick={() => setCurrentStep(4)}
                      >
                        Choose a time <ArrowIcon />
                      </PrimaryButton>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div>
                    <StepHeading
                      description="Choose a sample time for your visit. Times shown do not reflect live availability."
                      eyebrow="Step 04 · Choose a time"
                      title="Pick your time."
                    />
                    <p className="mb-4 text-xs text-[#aaa59c]">
                      {selectedDate
                        ? `${selectedDate.weekday}, ${selectedDate.month} ${selectedDate.day}, 2026`
                        : "Selected sample date"}
                    </p>
                    <fieldset>
                      <legend className="sr-only">Choose a sample appointment time</legend>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {demoTimes.map((slot) => {
                          const selected = slot === time;
                          return (
                            <button
                              aria-pressed={selected}
                              className={`flex min-h-14 items-center justify-center gap-2 border px-3 text-xs font-semibold transition-colors ${
                                selected
                                  ? "border-[#9f2924] bg-[#9f2924]/10 text-[#eee9df]"
                                  : "border-white/10 bg-[#1a1a1a] text-[#aaa59c] hover:border-white/25 hover:text-[#eee9df]"
                              }`}
                              key={slot}
                              onClick={() => setTime(slot)}
                              type="button"
                            >
                              {selected && <CheckIcon />}
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                    <p className="mt-4 text-[10px] leading-5 text-[#77736d]">
                      These are fictional sample slots and are not bookable.
                    </p>
                    <div className="mt-7 flex items-center justify-between gap-3">
                      <button
                        className="inline-flex min-h-12 items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa59c] hover:text-[#eee9df]"
                        onClick={() => setCurrentStep(3)}
                        type="button"
                      >
                        <ArrowIcon back /> Back
                      </button>
                      <PrimaryButton
                        disabled={!time}
                        onClick={() => setCurrentStep(5)}
                      >
                        Your details <ArrowIcon />
                      </PrimaryButton>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div>
                    <StepHeading
                      description="Add your contact details to preview the final booking summary. No information is sent or saved."
                      eyebrow="Step 05 · Your details"
                      title="Who are we expecting?"
                    />
                    <form
                      className="space-y-4"
                      onSubmit={handleCustomerSubmit}
                    >
                      <div>
                        <label
                          className="mb-2 block text-[9px] font-bold uppercase tracking-[0.16em] text-[#aaa59c]"
                          htmlFor="customer-name"
                        >
                          Full name <span className="text-[#c66a62]">*</span>
                        </label>
                        <input
                          autoComplete="name"
                          className="min-h-12 w-full border border-white/15 bg-[#1a1a1a] px-4 text-sm text-[#eee9df] outline-none placeholder:text-[#77736d] focus:border-[#9f2924]"
                          id="customer-name"
                          maxLength={100}
                          onChange={(event) => updateCustomer("name", event.target.value)}
                          placeholder="Your name"
                          required
                          value={customer.name}
                        />
                      </div>
                      <div>
                        <label
                          className="mb-2 block text-[9px] font-bold uppercase tracking-[0.16em] text-[#aaa59c]"
                          htmlFor="customer-phone"
                        >
                          Phone number <span className="text-[#c66a62]">*</span>
                        </label>
                        <input
                          autoComplete="tel"
                          className="min-h-12 w-full border border-white/15 bg-[#1a1a1a] px-4 text-sm text-[#eee9df] outline-none placeholder:text-[#77736d] focus:border-[#9f2924]"
                          id="customer-phone"
                          maxLength={30}
                          onChange={(event) => updateCustomer("phone", event.target.value)}
                          placeholder="(503) 555-0123"
                          required
                          type="tel"
                          value={customer.phone}
                        />
                      </div>
                      <div>
                        <label
                          className="mb-2 block text-[9px] font-bold uppercase tracking-[0.16em] text-[#aaa59c]"
                          htmlFor="customer-email"
                        >
                          Email address <span className="text-[#c66a62]">*</span>
                        </label>
                        <input
                          autoComplete="email"
                          className="min-h-12 w-full border border-white/15 bg-[#1a1a1a] px-4 text-sm text-[#eee9df] outline-none placeholder:text-[#77736d] focus:border-[#9f2924]"
                          id="customer-email"
                          maxLength={254}
                          onChange={(event) => updateCustomer("email", event.target.value)}
                          placeholder="you@example.com"
                          required
                          type="email"
                          value={customer.email}
                        />
                      </div>
                      <p className="text-[10px] leading-5 text-[#77736d]">
                        Required fields are used only to display your demo summary.
                      </p>
                      <div className="flex items-center justify-between gap-3 pt-2">
                        <button
                          className="inline-flex min-h-12 items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa59c] hover:text-[#eee9df]"
                          onClick={() => setCurrentStep(4)}
                          type="button"
                        >
                          <ArrowIcon back /> Back
                        </button>
                        <PrimaryButton type="submit">
                          Review booking <ArrowIcon />
                        </PrimaryButton>
                      </div>
                    </form>
                  </div>
                )}

                {currentStep === 6 && (
                  <div>
                    <StepHeading
                      description="Check your selections before completing this frontend demonstration."
                      eyebrow="Step 06 · Review"
                      title="Looking good?"
                    />
                    <div className="divide-y divide-white/10 border-y border-white/10">
                      {[
                        {
                          label: "Service",
                          value: selectedService?.name,
                          detail: selectedService
                            ? `${selectedService.duration} · $${selectedService.price}`
                            : "",
                          step: 1,
                        },
                        {
                          label: "Barber",
                          value: selectedBarber?.name,
                          detail: selectedBarber?.specialty ?? "",
                          step: 2,
                        },
                        {
                          label: "Date & time",
                          value: selectedDate
                            ? `${selectedDate.weekday}, ${selectedDate.month} ${selectedDate.day}, 2026`
                            : "",
                          detail: time,
                          step: 3,
                        },
                        {
                          label: "Your details",
                          value: customer.name,
                          detail: `${customer.phone} · ${customer.email}`,
                          step: 5,
                        },
                      ].map((item) => (
                        <div
                          className="flex items-start justify-between gap-4 py-4"
                          key={item.label}
                        >
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#77736d]">
                              {item.label}
                            </p>
                            <p className="mt-1 text-sm font-medium text-[#eee9df]">
                              {item.value}
                            </p>
                            <p className="mt-1 break-all text-[10px] text-[#aaa59c]">
                              {item.detail}
                            </p>
                          </div>
                          <button
                            className="shrink-0 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#c66a62] hover:text-[#eee9df]"
                            onClick={() => setCurrentStep(item.step)}
                            type="button"
                          >
                            Edit
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 border-l-2 border-[#9f2924] bg-[#1a1a1a] p-4 text-xs leading-5 text-[#aaa59c]">
                      This is a frontend demo only. Selecting confirm will not
                      reserve a time, contact the barbershop, or store your details.
                    </p>
                    <div className="mt-7 flex items-center justify-between gap-3">
                      <button
                        className="inline-flex min-h-12 items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa59c] hover:text-[#eee9df]"
                        onClick={() => setCurrentStep(5)}
                        type="button"
                      >
                        <ArrowIcon back /> Back
                      </button>
                      <PrimaryButton onClick={() => setIsConfirmed(true)}>
                        Confirm demo <CheckIcon />
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </section>

              <aside className="hidden md:block">
                <div className="sticky top-6">
                  <BookingSummary
                    barber={selectedBarber}
                    customer={customer}
                    date={selectedDate}
                    service={selectedService}
                    time={time}
                  />
                  <p className="mt-4 text-[10px] leading-5 text-[#77736d]">
                    Questions about the shop?{" "}
                    <a className="text-[#c66a62] underline underline-offset-2" href="tel:+15035550148">
                      Give us a call
                    </a>
                    .
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <footer className="mt-8 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-[9px] uppercase tracking-[0.12em] text-[#77736d] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>NorthSide Barber Co. · Fictional demo</span>
          <Link className="hover:text-[#eee9df]" href="/">
            Back to NorthSide Barber
          </Link>
        </div>
      </footer>
    </div>
  );
}
