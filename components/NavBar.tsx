"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/requests", label: "Requests" },
  { href: "/activity", label: "Activity" },
];

export default function Navbar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-6">
      <nav className="w-full max-w-6xl bg-surface/30 backdrop-blur-md border border-accent/15 rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg shadow-primary/5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-accent text-xs font-bold">
            T
          </span>
          <span className="font-semibold text-primary text-sm hidden sm:block">
            Trekin.
          </span>
        </Link>

        {/* Links */}
        <div className="flex gap-1 text-sm font-medium">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
                isActive(href)
                  ? "bg-primary text-accent font-semibold"
                  : "text-primary/50 hover:text-primary hover:bg-accent/10"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/requests/new"
          className="bg-primary text-accent text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          + New
        </Link>
      </nav>
    </div>
  );
}
