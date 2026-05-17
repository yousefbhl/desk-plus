import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi, catalogApi } from '../api'
import ProductCard from '../components/ui/ProductCard'
import { ProductGridSkeleton } from '../components/ui/Skeleton'
import type { Space, Taste , Product } from '../types'

const TRUST_ITEMS = [
  { icon: 'local_shipping', label: 'Free Delivery',    sub: 'Orders above 5,000 MAD' },
  { icon: 'verified',       label: '2-Year Warranty',  sub: 'On all products' },
  { icon: 'architecture',   label: 'Custom Spaces',    sub: 'Tailored to your team' },
  { icon: 'inventory_2',    label: '500+ Products',    sub: 'Updated weekly' },
]

const SPACE_PH: Record<string, string> = {
  dev: 'ph-dark', art: 'ph-creative', wood: 'ph-walnut', school: 'ph-edu',
  doctor: 'ph-med', commerce: 'ph-corp',
}

function getSpacePh(slug: string) {
  for (const [k, v] of Object.entries(SPACE_PH)) {
    if (slug.includes(k)) return v
  }
  return 'ph-warm'
}

export default function Home() {
  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.featured(),
  })

  const { data: newArrivals, isLoading: loadingNew } = useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => productsApi.newArrivals(),
  })
  
  const { data: spaces } = useQuery({
    queryKey: ['spaces'],
    queryFn: () => catalogApi.spaces().then((r) => r.data),
  })

  const { data: tastes } = useQuery({
    queryKey: ['tastes'],
    queryFn: () => catalogApi.tastes().then((r) => r.data),
  })

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-surface-container-low min-h-[88vh] flex items-center">
        <div className="dot-grid absolute inset-0 opacity-60 pointer-events-none" />
        <div className="max-w-screen-2xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
          <div className="space-y-8 z-10 animate-fade-up">
            <div className="chip bg-primary text-white uppercase">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>auto_awesome</span>
              New collection 2025
            </div>
            <h1 className="h-display text-7xl xl:text-8xl leading-none text-on-surface">
              CRAFT YOUR<br/>
              <span className="text-primary">PERFECT</span><br/>
              WORKSPACE
            </h1>
            <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed">
              Modern, modular office solutions for teams who value architectural precision and high-performance ergonomics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-grad px-8 py-4 rounded-xl font-bold text-sm shadow-ambient-lg">
                Shop New Arrivals →
              </Link>
              <Link to="/spaces" className="px-8 py-4 rounded-xl font-bold text-sm border-2 border-outline/30 hover:bg-surface-container-high transition-colors">
                Explore Spaces
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative w-full aspect-square max-w-lg ph-mesh-chair rounded-3xl shadow-ambient-lg flex items-center justify-center">
              {/* Chair SVG illustration */}
              <svg width="55%" viewBox="0 0 200 260" fill="none" stroke="#1c1b1b" strokeWidth="2.5" strokeLinejoin="round" className="drop-shadow-xl">
                <path d="M40 50 Q40 20 80 20 L130 20 Q170 20 170 60 L170 130 Q170 160 130 160 L80 160 Q40 160 40 130 Z" fill="#2a2828" />
                <path d="M65 50 L65 145" stroke="#5f5e5e" strokeWidth="1.5" />
                <path d="M105 165 L105 200" />
                <path d="M70 200 L140 200 L160 240 L50 240 Z" fill="#1c1b1b" />
                <circle cx="105" cy="245" r="6" fill="#1c1b1b" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-surface-container-highest py-8 border-y border-outline-variant/40">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>{t.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest-2">{t.label}</p>
                  <p className="text-xs text-on-surface-variant">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-2">Handpicked for you</p>
              <h2 className="h-display text-4xl">TOP SELLING PRODUCTS</h2>
            </div>
            <Link to="/products" className="text-sm font-semibold border-b-2 border-primary pb-0.5 hover:text-primary transition-colors">
              View All →
            </Link>
          </div>
          {loadingFeatured ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(featured ?? []).slice(0, 4).map((p: Product, i: number) => (
                <ProductCard key={p.id} product={p} badge={i === 0 ? 'Best Seller' : undefined} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SPACES ── */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-2">Curated Environments</p>
              <h2 className="h-display text-4xl">EXPLORE COMPLETE SPACES</h2>
            </div>
            <Link to="/spaces" className="text-sm font-semibold border-b-2 border-primary pb-0.5">View Gallery</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {((spaces as Space[]) ?? []).slice(0, 3).map((s) => (
              <Link
                key={s.id}
                to={`/spaces`}
                className="group relative overflow-hidden rounded-xl h-[480px] bg-surface-container"
              >
                {s.cover_image ? (
                  <img src={s.cover_image} alt={s.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className={`absolute inset-0 ${getSpacePh(s.slug)} transition-transform duration-700 group-hover:scale-110`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{s.name}</h3>
                  <p className="text-white/70 text-sm mb-5 line-clamp-2">{s.description}</p>
                  <span className="bg-white text-on-surface px-5 py-2 rounded-lg font-bold text-sm inline-block group-hover:bg-primary group-hover:text-white transition-colors">
                    Explore Setup
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="w-full bg-primary py-16 px-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest-2 mb-2">Limited time</p>
            <h2 className="h-display text-4xl text-white">UP TO 30% OFF SELECTED ITEMS</h2>
          </div>
          <Link to="/products?sale=1" className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-surface transition-colors whitespace-nowrap">
            Shop the Sale →
          </Link>
        </div>
      </section>

      {/* ── TASTES / STYLES ── */}
      {((tastes as Taste[]) ?? []).length > 0 && (
        <section className="py-24 bg-surface">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-2">Design Philosophy</p>
              <h2 className="h-display text-4xl">OUR TASTE (STYLES)</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {((tastes as Taste[]) ?? []).map((t) => (
                <Link
                  key={t.id}
                  to={`/styles`}
                  className="group p-5 rounded-xl border-2 border-outline-variant hover:border-primary transition-all text-center bg-surface-container-lowest"
                >
                  <div
                    className="w-10 h-10 rounded-lg mx-auto mb-3 grid place-items-center"
                    style={{ background: t.color_hex ?? '#ba0a0d' }}
                  >
                    <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>palette</span>
                  </div>
                  <p className="font-bold text-sm group-hover:text-primary transition-colors">{t.name}</p>
                  {t.description && (
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{t.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEW ARRIVALS ── */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-2">Just In</p>
              <h2 className="h-display text-4xl">NEW ARRIVALS</h2>
            </div>
            <Link to="/products?sort=newest" className="text-sm font-semibold border-b-2 border-primary pb-0.5">View All →</Link>
          </div>
          {loadingNew ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(newArrivals ?? []).slice(0, 4).map((p: Product) => (
                <ProductCard key={p.id} product={p} badge="New" />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/products?sort=newest" className="btn-grad inline-block px-8 py-3.5 rounded-xl font-bold text-sm">
              Shop New Arrivals →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
