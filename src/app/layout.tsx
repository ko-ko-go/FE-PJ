import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import NextAuthProvider from "@/providers/NextAuthProvider";
import MuiThemeProvider from "@/providers/MuiThemeProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Poseidon — Premium Massage & Spa Booking",
  description: "Book your luxury massage and spa experience at Poseidon.",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nextAuthSession = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} bg-slate-50 text-slate-800`}>
        <NextAuthProvider session={nextAuthSession}>
          <MuiThemeProvider>
            <Navbar />
            {children}
          </MuiThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
