"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RiHeartLine,
  RiMenuLine,
  RiUserLine,
  RiCloseLine,
  RiSearchLine,
  RiShoppingBagLine,
} from "react-icons/ri";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const shopUrl = "https://shop.rolet.store";

  return (
    <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      {/* MAIN NAV BAR */}
      <div className="pointer-events-auto flex items-center justify-between px-6 lg:px-70 py-6 text-white">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo/rolet-logo.webp"
            alt="Rolet"
            width={130}
            height={34}
            priority
            className="object-contain"
          />
        </Link>

        {/* CENTER MENU (DESKTOP) */}
        <ul
          className="hidden lg:flex items-center space-x-10 font-medium text-[18px] py-[15px] tracking-[0.07em] leading-[1.3]"style={{ fontFamily: '"Afacad", sans-serif' }}>
          <li>
            <Link
              href="https://rolet.store/"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="https://shop.rolet.store/about-us"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              Rolet Inception
            </Link>
          </li>
          <li>
            <Link
              href="https://shop.rolet.store/collections"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              href="https://shop.rolet.store/blogs"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              href="http://shop.rolet.store/contact-us"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              Contact Us
            </Link>
          </li>
        </ul>

        {/* ICONS (DESKTOP) */}
        <div className="hidden lg:flex items-center space-x-5 text-[20px]">
          <a
            href={shopUrl}
            className="cursor-pointer hover:opacity-70 transition"
            aria-label="Shop"
          >
            <RiSearchLine />
          </a>
          <a
            href={shopUrl}
            className="cursor-pointer hover:opacity-70 transition"
            aria-label="Shop"
          >
            <RiHeartLine />
          </a>
          <a
            href={shopUrl}
            className="cursor-pointer hover:opacity-70 transition"
            aria-label="Shop"
          >
            <RiShoppingBagLine />
          </a>
          <a
            href={shopUrl}
            className="cursor-pointer hover:opacity-70 transition"
            aria-label="Shop"
          >
            <RiUserLine />
          </a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden text-white"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <RiMenuLine className="text-[26px]" />
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 bg-black text-white z-[200] pointer-events-auto">
          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between px-6 py-6">
            <Image
              src="/images/logo/rolet-logo.webp"
              alt="Rolet"
              width={173}
              height={34}
              priority
              className="w-[140px] md:w-[173px] object-contain"
            />
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <RiCloseLine className="text-[26px] text-white" />
            </button>
          </div>

          {/* MOBILE LINKS */}
          <ul className="flex flex-col items-center space-y-8 mt-10 font-medium text-[18px] tracking-[0.07em] leading-[1.3]">
            <li>
              <Link href="https://rolet.store/" onClick={() => setOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="https://shop.rolet.store/about-us" onClick={() => setOpen(false)}>
                Rolet Inception
              </Link>
            </li>
            <li>
              <Link href="https://shop.rolet.store/collections" onClick={() => setOpen(false)}>
                Products
              </Link>
            </li>
            <li>
              <Link href="https://shop.rolet.store/blogs" onClick={() => setOpen(false)}>
                Blogs
              </Link>
            </li>
            <li>
              <Link href="http://shop.rolet.store/contact-us" onClick={() => setOpen(false)}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
