import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NorthSide Barber Co. | Good Cuts, Better Company",
  description:
    "A neighborhood barbershop in North Portland for thoughtful cuts, proper shaves, and good conversation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#111111] font-sans text-[#eee9df]">
        {children}
      </body>
    </html>
  );
}
