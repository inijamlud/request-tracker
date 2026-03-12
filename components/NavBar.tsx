"use client";

// components/Navbar.tsx
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
    <nav className="border-b border-accent/20 bg-surface px-10 py-4 flex items-center justify-between sticky top-0 z-10">
      {/* Logo */}
      <Link href="/" className="font-bold text-primary text-lg">
        Trekin.
      </Link>

      {/* Links */}
      <div className="flex gap-1 text-sm font-medium">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg transition ${
              isActive(href)
                ? "bg-accent/20 text-primary font-semibold"
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
        className="bg-primary text-accent text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
      >
        + New Request
      </Link>
    </nav>
  );
}
