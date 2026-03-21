import "./globals.css";
import localFont from "next/font/local";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FanGaoDIWA",
};

const myFont = localFont({
    src: './../../public/fonts/Regular.ttf'
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={myFont.className}>
            <body>
                {children}
            </body>
        </html>
    );
}
