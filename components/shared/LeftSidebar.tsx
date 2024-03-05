"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
      <section className=''>
        <div className="leftsidebar space-y-8">
          <div className='flex w-full flex-1 flex-col gap-6 px-4 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 delay-50 duration-200'>
            <p className="text-light-3 text-center text-small-medium lg:text-base-medium">Shuffle Rooms</p>
            {sidebarLinks.map((link) => {
              const isActive = (pathname.includes(link.route) && link.route.length > 1) ||
                pathname === link.route;

              return (
                <Link
                  href={link.route}
                  key={link.label}
                  className={`leftsidebar_link ${isActive && "bg-primary-500"} hover:bg-primary-600 delay-50 duration-200`}
                >
                  <Image 
                    src={link.imgURL}
                    alt={link.label}
                    width={28}
                    height={28} />

                  <p className='text-light-1 hidden mt-1 text-sembody-medium lg:inline'>{link.label}</p>
                </Link>
                );
              })}
          </div>
        </div>
      </section>
  );
};

export default LeftSidebar;
