import Image from "next/image";
import Wheel from '@/components/Wheel';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="my-8">
        <h1 className="text-heading3-bold text-light-1">Welcome to Seispace Shuffle</h1>
      </div>
      

      <div className="mt-14 p-8 rounded-3xl bg-primary-600">
      <Wheel/>
      </div>
    </main>
  );
}
