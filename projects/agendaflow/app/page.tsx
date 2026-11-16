import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Service = {
  name: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  imageAlt: string;
};

type Barber = {
  name: string;
  specialty: string;
  description: string;
  initials: string;
};

const services: Service[] = [
  {
    name: "The Northside Cut",
    description: "A considered cut, finished with a hot towel and the details done right.",
    duration: "40 min",
    price: "$35",
    image: "/images/haircut.jpg",
    imageAlt: "A fresh skin fade haircut with a clean finish",
  },
  {
    name: "Beard Trim",
    description: "A precise shape-up and clean lines, tailored to your face and style.",
    duration: "30 min",
    price: "$25",
    image: "/images/beard-trim.jpg",
    imageAlt: "A barber carefully shaping a client's beard",
  },
  {
    name: "Cut & Beard",
    description: "The full reset: a fresh haircut and a carefully finished beard.",
    duration: "60 min",
    price: "$55",
    image: "/images/haircut-beard.jpg",
    imageAlt: "A client with a classic haircut and a neatly shaped beard",
  },
];

const barbers: Barber[] = [
  {
    name: "Marcus Reed",
    specialty: "Classic cuts & scissor work",
    description:
      "A detail-first craftsman who believes the best cut is the one that feels like you.",
    initials: "MR",
  },
  {
    name: "Elliot James",
    specialty: "Fades & modern texture",
    description:
      "Clean blends, thoughtful shape, and a fresh perspective on everyday styles.",
    initials: "EJ",
  },
  {
    name: "Andre Brooks",
    specialty: "Beard work & hot towel shaves",
    description:
      "Traditional barbering with an easygoing chair and an eye for the finishing touch.",
    initials: "AB",
  },
];

const hours = [
  ["Monday", "Closed"],
  ["Tuesday – Friday", "9:00 AM – 7:00 PM"],
  ["Saturday", "9:00 AM – 5:00 PM"],
  ["Sunday", "10:00 AM – 3:00 PM"],
];

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 16 16"
    >
      {diagonal ? (
        <path
          d="M4 12 12 4M5 4h7v7"
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

function Brand() {
  return (
    <a
      aria-label="NorthSide Barber home"
      className="group inline-flex items-center gap-3 text-[#eee9df]"
      href="#home"
    >
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden border border-white/15 bg-[#1a1a1a] font-display text-2xl font-bold leading-none">
        <span className="relative z-10">N</span>
        <span
          aria-hidden="true"
          className="absolute -bottom-2 -right-1 h-5 w-5 rotate-45 bg-[#9f2924]"
        />
      </span>
      <span className="flex flex-col font-display text-[22px] font-bold uppercase leading-[0.8] tracking-[0.04em]">
        NorthSide
        <span className="mt-1.5 text-[10px] font-semibold tracking-[0.3em] text-[#aaa59c]">
          Barber Co.
        </span>
      </span>
    </a>
  );
}

function BookingLink({
  children = "Book an Appointment",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center gap-3 bg-[#9f2924] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#fffaf2] transition-colors hover:bg-[#b83730] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eee9df] ${className}`}
      href="/agendar"
    >
      {children}
      <ArrowIcon diagonal />
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#c66a62]">
          {eyebrow}
        </p>
        <h2 className="font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[0.015em] text-[#eee9df] sm:text-6xl md:text-7xl">
          {title}
        </h2>
      </div>
      {description && (
        <p className="max-w-sm text-sm leading-7 text-[#aaa59c]">
          {description}
        </p>
      )}
    </div>
  );
}

function SiteHeader() {
  const links = [
    ["Home", "#home"],
    ["Services", "#services"],
    ["Barbers", "#barbers"],
    ["About", "#about"],
  ];

  return (
    <header className="relative z-20 border-b border-white/10 bg-[#111111]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 py-4 sm:px-8 lg:flex-nowrap lg:px-12">
        <Brand />
        <nav
          aria-label="Main navigation"
          className="order-3 flex w-full items-center gap-6 overflow-x-auto pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa59c] sm:gap-8 lg:order-2 lg:w-auto lg:pb-0"
        >
          {links.map(([label, href]) => (
            <a
              className="shrink-0 transition-colors hover:text-[#eee9df] focus-visible:outline-2 focus-visible:outline-[#eee9df]"
              href={href}
              key={label}
            >
              {label}
            </a>
          ))}
        </nav>
        <BookingLink className="min-h-10 px-3 text-[9px] sm:px-5 sm:text-[10px]" />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-white/10"
      id="home"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-0 h-[34rem] w-[34rem] rounded-full border border-white/[0.04] sm:right-0"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-12 lg:py-24">
        <div className="relative z-10">
          <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#c66a62]">
            <span className="h-px w-8 bg-[#9f2924]" />
            A neighborhood barbershop · North Portland
          </p>
          <h1
            className="max-w-3xl font-display text-[clamp(4.5rem,12vw,9rem)] font-semibold uppercase leading-[0.76] tracking-[-0.035em] text-[#eee9df]"
            id="hero-title"
          >
            Good cuts.
            <br />
            <span className="text-[#9f2924]">Better</span>
            <br />
            company.
          </h1>
          <p className="mt-8 max-w-md text-sm leading-7 text-[#aaa59c] sm:text-base">
            Take a seat, slow down, and leave feeling like yourself. Thoughtful
            cuts, proper shaves, and good conversation—right here in the
            neighborhood.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <BookingLink />
            <a
              className="inline-flex min-h-12 items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#eee9df] transition-colors hover:text-[#c66a62]"
              href="#services"
            >
              Explore services <ArrowIcon />
            </a>
          </div>
          <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.15em] text-[#aaa59c]">
            <span className="font-display text-2xl font-semibold text-[#eee9df]">
              01
            </span>
            <span className="h-px w-10 bg-[#9f2924]" />
            <span>Good people. Better hair.</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -inset-3 translate-x-3 translate-y-3 border border-[#9f2924]/55" />
          <figure className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
            <Image
              alt="A barber carefully finishing a client's beard in a dark barbershop"
              className="object-cover object-top"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              src="/images/barber-chair.jpg"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-transparent to-[#111111]/5"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-7">
              <span className="font-display text-3xl font-semibold uppercase leading-none text-[#eee9df] sm:text-4xl">
                The NorthSide
                <br />
                experience
              </span>
              <span className="border border-white/35 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#eee9df]">
                Est. 2018
              </span>
            </figcaption>
          </figure>
          <div className="absolute -right-2 -top-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-[#1a1a1a] p-3 text-center sm:-right-7 sm:-top-7 sm:h-24 sm:w-24">
            <span className="font-display text-xs font-semibold uppercase leading-tight tracking-[0.1em] text-[#eee9df]">
              Made for
              <br />
              the
              <br />
              neighborhood
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section
      aria-labelledby="services-title"
      className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      id="services"
    >
      <SectionHeading
        description="No fuss, no guesswork. Choose your service, pick a time, and we’ll take it from there."
        eyebrow="The menu"
        title="The good stuff."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service, index) => (
          <article
            className="group border border-white/10 bg-[#1a1a1a] transition-colors hover:border-[#9f2924]/70"
            key={service.name}
          >
            <div className="relative aspect-[1.45] overflow-hidden bg-[#242321]">
              <Image
                alt={service.imageAlt}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 30vw, 380px"
                src={service.image}
              />
              <span className="absolute left-4 top-4 bg-[#111111]/85 px-3 py-1.5 font-display text-sm font-semibold tracking-[0.12em] text-[#eee9df]">
                0{index + 1}
              </span>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-3xl font-semibold uppercase leading-none text-[#eee9df]">
                  {service.name}
                </h3>
                <span className="shrink-0 font-display text-2xl font-semibold text-[#c66a62]">
                  {service.price}
                </span>
              </div>
              <p className="mt-4 min-h-12 text-xs leading-6 text-[#aaa59c]">
                {service.description}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#aaa59c]">
                  {service.duration}
                </span>
                <Link
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#eee9df] hover:text-[#c66a62]"
                  href="/agendar"
                >
                  Book this service <ArrowIcon diagonal />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-5 text-xs text-[#77736d]">
        Service prices are for this fictional demonstration barbershop.
      </p>
    </section>
  );
}

function Barbers() {
  return (
    <section
      aria-labelledby="barbers-title"
      className="border-y border-white/10 bg-[#1a1a1a]"
      id="barbers"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <SectionHeading
          description="Three chairs, three points of view, and one shared belief: a great cut starts with listening."
          eyebrow="The people behind the chair"
          title="Meet your barbers."
        />
        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {barbers.map((barber, index) => (
            <article className="bg-[#1a1a1a] p-6 sm:p-8" key={barber.name}>
              <div className="relative mb-7 flex aspect-[1.2] items-end overflow-hidden border border-white/10 bg-[radial-gradient(ellipse_at_55%_30%,rgba(159,41,36,0.36),transparent_58%),linear-gradient(145deg,#282522,#111111_70%)] p-5">
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-2 font-display text-[clamp(7rem,15vw,12rem)] font-bold leading-none text-white/[0.035]"
                >
                  {barber.initials}
                </span>
                <span className="relative z-10 font-display text-6xl font-semibold uppercase leading-none tracking-[-0.03em] text-[#eee9df]">
                  {barber.initials}
                </span>
                <span className="absolute right-5 top-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#c66a62]">
                  Barber 0{index + 1}
                </span>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c66a62]">
                {barber.specialty}
              </p>
              <h3 className="mt-2 font-display text-4xl font-semibold uppercase leading-none text-[#eee9df]">
                {barber.name}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[#aaa59c]">
                {barber.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section
      aria-labelledby="about-title"
      className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12 lg:py-28"
      id="about"
    >
      <div className="relative flex min-h-72 flex-col justify-between overflow-hidden border border-white/10 bg-[#1a1a1a] p-7 sm:p-10">
        <span
          aria-hidden="true"
          className="absolute -right-8 -top-20 font-display text-[20rem] font-bold leading-none text-[#9f2924]/10"
        >
          N
        </span>
        <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-[#c66a62]">
          North Portland, Oregon
        </p>
        <p className="relative max-w-xs font-display text-4xl font-medium uppercase leading-[0.95] text-[#eee9df] sm:text-5xl">
          Good work.
          <br />
          No rush.
          <br />
          Always welcome.
        </p>
        <p className="relative text-[10px] uppercase tracking-[0.18em] text-[#aaa59c]">
          A neighborhood barbershop
        </p>
      </div>
      <div className="self-center">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#c66a62]">
          A little about us
        </p>
        <h2
          className="font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[0.015em] text-[#eee9df] sm:text-6xl"
          id="about-title"
        >
          More than a
          <br />
          <span className="text-[#9f2924]">quick trim.</span>
        </h2>
        <p className="mt-7 max-w-xl text-sm leading-7 text-[#aaa59c]">
          NorthSide is a fictional neighborhood barbershop built around the
          simple things: a considered cut, a comfortable chair, and the kind of
          conversation that makes you want to stay a little longer. We pair
          time-honored barbering with a relaxed, modern point of view.
        </p>
        <a
          className="mt-7 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#eee9df] transition-colors hover:text-[#c66a62]"
          href="#hours"
        >
          Come by and say hello <ArrowIcon />
        </a>
      </div>
    </section>
  );
}

function OpeningHours() {
  return (
    <section
      aria-labelledby="hours-title"
      className="border-y border-white/10 bg-[#1a1a1a]"
      id="hours"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-24 lg:px-12">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#c66a62]">
            Plan your visit
          </p>
          <h2
            className="font-display text-5xl font-semibold uppercase leading-[0.9] text-[#eee9df] sm:text-6xl"
            id="hours-title"
          >
            Hours at
            <br />
            the shop.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#aaa59c]">
            Walk-ins are welcome when a chair is free. Booking ahead is the
            easiest way to get the time you want.
          </p>
        </div>
        <dl className="border-t border-white/15">
          {hours.map(([day, time]) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 py-4"
              key={day}
            >
              <dt className="text-sm font-medium text-[#eee9df]">{day}</dt>
              <dd
                className={`text-xs ${time === "Closed" ? "text-[#77736d]" : "text-[#aaa59c]"}`}
              >
                {time}
              </dd>
            </div>
          ))}
          <p className="pt-4 text-[10px] uppercase tracking-[0.14em] text-[#77736d]">
            All times Pacific · Demonstration hours
          </p>
        </dl>
      </div>
    </section>
  );
}

function SiteFooter() {
  const links = [
    ["Home", "#home"],
    ["Services", "#services"],
    ["Barbers", "#barbers"],
    ["About", "#about"],
    ["Opening hours", "#hours"],
  ];

  return (
    <footer className="bg-[#111111]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr] lg:px-12 lg:py-16">
        <div>
          <Brand />
          <p className="mt-5 max-w-xs text-xs leading-6 text-[#aaa59c]">
            Good cuts, good company, and a little more time for yourself.
          </p>
          <p className="mt-4 text-[9px] uppercase tracking-[0.14em] text-[#77736d]">
            Fictional demonstration barbershop
          </p>
        </div>
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-[0.1em] text-[#eee9df]">
            Explore
          </h2>
          <ul className="space-y-3">
            {links.map(([label, href]) => (
              <li key={label}>
                <a
                  className="text-xs text-[#aaa59c] transition-colors hover:text-[#eee9df]"
                  href={href}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-[0.1em] text-[#eee9df]">
            Find us
          </h2>
          <address className="space-y-3 text-xs not-italic leading-6 text-[#aaa59c]">
            <p>North Portland, Oregon</p>
            <a className="block hover:text-[#eee9df]" href="tel:+15035550148">
              (503) 555-0148
            </a>
            <a
              className="block hover:text-[#eee9df]"
              href="mailto:hello@northsidebarber.example"
            >
              hello@northsidebarber.example
            </a>
          </address>
        </div>
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-[0.1em] text-[#eee9df]">
            Shop hours
          </h2>
          <ul className="space-y-3 text-xs text-[#aaa59c]">
            <li>Mon · Closed</li>
            <li>Tue–Fri · 9 AM–7 PM</li>
            <li>Sat · 9 AM–5 PM</li>
            <li>Sun · 10 AM–3 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-[9px] uppercase tracking-[0.12em] text-[#77736d] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>NorthSide Barber Co.</span>
          <span>Made for the neighborhood.</span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <a
        className="sr-only z-50 bg-[#eee9df] p-3 text-[#111111] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Services />
        <Barbers />
        <About />
        <OpeningHours />
        <section className="bg-[#9f2924]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
                Your chair is waiting
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold uppercase leading-none text-[#fffaf2] sm:text-5xl">
                Make a little time for yourself.
              </h2>
            </div>
            <BookingLink className="w-fit bg-[#111111] hover:bg-[#242321]" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
