import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/shared/Topbar";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Seispace",
  description: "Sei R2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <head><link rel="icon" href="/favicon.ico" sizes="any" /></head><html lang='fr'>
      <body className={inter.className}>
        <Topbar />

        <main className='flex flex-row'>

          <section className='main-container'>
            <div className='w-full max-w-6xl'>{children}</div>
          </section>
          {/* @ts-ignore */}

        </main>
      </body>
    </html>
    </>
  );
}
