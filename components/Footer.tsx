import Link from "next/link";

const popularRoutes = [
  "Toronto → Ottawa",
  "Vancouver → Kelowna",
  "Calgary → Edmonton",
  "Toronto → Hamilton",
  "Montreal → Ottawa",
  "Kitchener → Toronto",
  "Barrie → Toronto",
];

const majorCities = [
  "Toronto", "Vancouver", "Montreal", "Calgary",
  "Ottawa", "Hamilton", "London", "Kitchener",
  "Winnipeg", "Halifax", "Barrie", "Kelowna",
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-white font-bold text-lg">Loop</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Canada&apos;s trusted rideshare and carpool platform. Move, Deliver,
              Connect — all with Loop.
            </p>
            <div className="flex gap-3">
              {[
                { label: "f", href: "#", title: "Facebook" },
                { label: "in", href: "#", title: "Instagram" },
                { label: "𝕏", href: "#", title: "X / Twitter" },
                { label: "li", href: "#", title: "LinkedIn" },
              ].map(({ label, href, title }) => (
                <a
                  key={title}
                  href={href}
                  title={title}
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors text-gray-400 hover:text-white text-xs font-bold"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "Blog", "Contact", "Careers"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {["How It Works", "Drive With Us", "Safety", "Package Delivery", "Loop Coins"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Popular Routes</h4>
            <ul className="space-y-2 text-sm">
              {popularRoutes.map((route) => (
                <li key={route}>
                  <Link href="#" className="hover:text-white transition-colors">
                    {route}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Major Cities</h4>
            <ul className="space-y-2 text-sm">
              {majorCities.slice(0, 8).map((city) => (
                <li key={city}>
                  <Link href="#" className="hover:text-white transition-colors">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Loop Rideshare. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            {["Terms of Service", "Privacy Policy", "Delete Account"].map((item) => (
              <Link key={item} href="#" className="hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
