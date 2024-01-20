import { Inter } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      
      <><link rel="icon" href="/favicon.ico" sizes="any" /><html lang='en'>
      <body className={inter.className}>
        <Topbar />

        <main className='flex flex-row'>
          <LeftSidebar />
          <section className='main-container'>
            <div className='w-full max-w-6xl'>{children}</div>
          </section>
          <RightSidebar />
          {/* @ts-ignore */}
        </main>
      </body>
    </html></>
    
  );
}
