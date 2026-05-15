import { Link } from 'react-router-dom'

const LINKS = {
  Company:  [
    { label: 'About Us',   to: '/' },
    { label: 'Careers',    to: '/' },
    { label: 'Blog',       to: '/' },
    { label: 'Press',      to: '/' },
  ],
  Products: [
    { label: 'Chairs',     to: '/products?category=chairs' },
    { label: 'Desks',      to: '/products?category=desks' },
    { label: 'Storage',    to: '/products?category=storage' },
    { label: 'New Arrivals', to: '/products?sort=newest' },
  ],
  Spaces: [
    { label: 'Dev Space',  to: '/spaces' },
    { label: 'Art Space',  to: '/spaces' },
    { label: 'Wood Modern',to: '/spaces' },
    { label: 'Commerce',   to: '/spaces' },
  ],
  Support: [
    { label: 'Contact Us',      to: '/' },
    { label: 'Delivery Info',   to: '/' },
    { label: 'Returns Policy',  to: '/' },
    { label: 'Warranty',        to: '/' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant mt-16">
      <div className="max-w-screen-2xl mx-auto px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg btn-grad grid place-items-center text-white font-black text-sm">D+</div>
              <span className="font-black tracking-tight">DESK+</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
              Craft your perfect workspace. Premium office furniture for teams who demand precision.
            </p>
            <div className="flex gap-3 mt-5">
              {['instagram', 'LinkedIn', 'X'].map((s) => (
                <a key={s} href="#" className="w-8 h-8 rounded-full bg-surface-container-high grid place-items-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>link</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="font-bold text-xs uppercase tracking-widest-2 mb-4">{title}</p>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-outline-variant/60 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant">© 2025 Desk+ Premium Office Furniture. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <a key={l} href="#" className="text-xs text-on-surface-variant hover:text-on-surface">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
