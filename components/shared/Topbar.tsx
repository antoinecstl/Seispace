"use client"
import Image from "next/image";
import Link from "next/link";

function Topbar() {

  return (
    <nav className='topbar'>
        <Link href='/' className='flex items-center gap-4'>
            <Image src='/target.svg' alt='logo' width={32} height={32} />
            <p className='text-heading3-bold text-light-1'>Seispace</p>
        </Link>

        <div className='flex items-center gap-1'>
            <div className='block ml-2'>
                <Link href='https://twitter.com/SeiSpaceHub'>
                    <Image src='/target.svg' alt='logo' width={32} height={32} />
                </Link>
            </div>
        </div>
    </nav>
  );
}

export default Topbar;
