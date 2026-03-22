import "./globals.css";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/authOptions';
import NextAuthProvider from '@/providers/NextAuthProvider';

export const metadata: Metadata = {
    title: "FanGaoDIWA",
};

const myFont = localFont({
    src: './../../public/fonts/Regular.ttf'
});

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const nextAuthSession = await getServerSession(authOptions)

    return (
        <html lang="en" className={myFont.className}>
            <body>
                <NextAuthProvider session={nextAuthSession}>
                    {children}
                </NextAuthProvider>
            </body>
        </html>
    );
}
