import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-[#030810] border-t border-gray-200 dark:border-white/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.svg"
              alt="RideLink YVR"
              className="h-8 w-auto rounded-md opacity-80"
            />
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
            {["Privacy", "Terms", "Safety", "Contact"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-gray-400 transition-colors">{l}</a>
            ))}
          </div>

          {/* Book CTA */}
          <Link
            href="/book"
            className="bg-[#d4af37] hover:bg-[#c9a227] text-black text-sm font-bold px-5 py-2.5 rounded-lg uppercase tracking-wide transition-all"
          >
            Book a Ride
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-600">
          <span>© 2026 RideLink. All rights reserved.</span>
          <span>FIFA World Cup 2026™ - We got you!</span>
        </div>
      </div>
    </footer>
  );
}