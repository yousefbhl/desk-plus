import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useCartStore } from '../store/cartStore'
import type { Product } from '../types'

/* ── Fallback product cards (used while API loads or if empty) ── */
const FALLBACK_PRODUCTS = [
  { id: 1, slug: 'aileron-executive-oak', name: 'Aileron Executive Oak', category: 'Atelier Bensaïd · Desk', price: 4900, rating: '4.9', reviews: 142, badge: 'Best seller', badgeClass: 'btn-grad', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=85&auto=format&fit=crop' },
  { id: 2, slug: 'ergoflex-pro-mesh', name: 'ErgoFlex Pro Mesh', category: 'Kendo Studio · Chair', price: 3490, rating: '4.8', reviews: 98, badge: 'Limited', badgeClass: 'bg-white text-on-surface', image: 'https://images.unsplash.com/photo-1505843490701-5be5d1b31f8f?w=900&q=85&auto=format&fit=crop' },
  { id: 3, slug: 'lumi-task-light', name: 'Lumi Task Light', category: 'Hacker Lab · Lighting', price: 1290, rating: '4.6', reviews: 64, badge: 'New', badgeClass: 'bg-white text-on-surface', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=85&auto=format&fit=crop' },
  { id: 4, slug: 'tetra-walnut-shelf', name: 'Tetra Walnut Shelf', category: 'Coco Souk · Storage', price: 2690, rating: '4.7', reviews: 41, badge: '', badgeClass: '', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=900&q=85&auto=format&fit=crop' },
]

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [emailValue, setEmailValue] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const navigate = useNavigate()
  const itemCount = useCartStore((s) => s.itemCount())

  /* ── Live search → navigates to the catalog with the query ── */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchVal.trim()
    if (q) navigate(`/products?search=${encodeURIComponent(q)}`)
  }

  /* ── Reveal-on-scroll ── */
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  /* ── Real products from API ── */
  const { data } = useProducts({ per_page: 4, is_featured: 1 })
  const apiProducts: Product[] = data?.data ?? []

  const PH_CLASSES = ['ph-walnut', 'ph-mesh-chair', 'ph-charcoal', 'ph-wood']

  const cards =
    apiProducts.length >= 4
      ? apiProducts.slice(0, 4).map((p, i) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: (p.category?.name ?? 'Product'),
          price: p.price,
          rating: p.avg_rating?.toFixed(1) ?? '—',
          reviews: p.review_count ?? 0,
          badge: i === 0 ? 'Best seller' : '',
          badgeClass: i === 0 ? 'btn-grad' : '',
          image: p.images?.[0]?.url ?? FALLBACK_PRODUCTS[i].image,
          ph: PH_CLASSES[i],
        }))
      : FALLBACK_PRODUCTS.map((p, i) => ({ ...p, ph: PH_CLASSES[i] }))

  const handleSubscribe = () => {
    if (emailValue.trim()) {
      setEmailValue('')
      alert('Thank you for subscribing!')
    }
  }

  return (
    <div ref={containerRef}>
      {/* ============ EDITORIAL HERO ============ */}
      <section className="hero">
        <div className="hero-img"></div>
        <div className="hero-grain"></div>

        {/* Masthead */}
        <div className="absolute top-0 left-0 right-0 z-10 text-white">
          <div className="px-8 pt-6 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg btn-grad grid place-items-center text-white font-black text-sm">D+</div>
              <span className="font-black tracking-tight text-lg">DESK+</span>
            </div>
            <div className="hidden md:flex items-center gap-8 small-caps text-white/80">
              <Link className="hover:text-white" to="/products">Catalog</Link>
              <Link className="hover:text-white" to="/spaces">Spaces</Link>
              <Link className="hover:text-white" to="/styles">Styles</Link>
            </div>
            <div className="flex items-center gap-3">
              {/* Clean, no-background live search */}
              <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 border-b border-white/30 focus-within:border-white transition-colors pb-1">
                <button type="submit" className="grid place-items-center text-white/70 hover:text-white transition" aria-label="Search">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
                </button>
                <input
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search the catalog…"
                  className="bg-transparent border-0 outline-none text-white placeholder-white/50 text-sm w-36 focus:w-52 transition-all"
                  aria-label="Search the catalog"
                />
              </form>
              <Link to="/account" className="w-9 h-9 grid place-items-center rounded-full hover:bg-white/10 transition"><span className="material-symbols-outlined text-white" style={{ fontSize: 20 }}>person</span></Link>
              <Link to="/cart" className="w-9 h-9 grid place-items-center rounded-full hover:bg-white/10 transition relative"><span className="material-symbols-outlined text-white" style={{ fontSize: 20 }}>shopping_cart</span>{itemCount > 0 && (<span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold grid place-items-center leading-none">{itemCount > 9 ? '9+' : itemCount}</span>)}</Link>
            </div>
          </div>
          <div className="px-8"><div className="masthead-rule"></div></div>
          <div className="px-8 py-2.5 flex items-center justify-between small-caps text-white/65">
            <span>Issue Nº 04 · Spring '26</span>
            <span>Casablanca — Marrakech — Tangier</span>
            <span>Volume one</span>
          </div>
        </div>

        {/* Hero composition */}
        <div className="absolute inset-0 z-[5] grid place-items-end">
          <div className="w-full px-8 pb-16">
            <div className="max-w-screen-2xl mx-auto grid grid-cols-12 gap-8 items-end text-white">
              {/* LEFT: Headline */}
              <div className="col-span-12 md:col-span-8">
                <p className="small-caps text-white/70 mb-5">A workspace journal</p>
                <h1 className="font-display font-light leading-[0.86] tracking-tight" style={{ fontSize: 'clamp(64px,11vw,180px)' }}>
                  The desk,<br /><span className="italic-display">considered.</span>
                </h1>
                <p className="mt-8 max-w-xl text-white/80 text-lg leading-relaxed">
                  Furniture for people who notice. Sourced from twenty-eight Moroccan ateliers, finished by hand, delivered to your room.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link to="/products" className="btn-grad text-white font-bold px-7 py-4 rounded-xl small-caps text-xs flex items-center gap-2">Open the catalog <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></Link>
                  <Link to="/spaces" className="text-white border-b border-white/40 hover:border-white pb-1 small-caps text-xs">Tour the six spaces</Link>
                </div>
              </div>

              {/* RIGHT: Editorial caption + cover credit */}
              <div className="col-span-12 md:col-span-4 md:pl-10 md:border-l md:border-white/20">
                <div className="small-caps text-primary mb-3">On the cover</div>
                <div className="font-display text-2xl leading-snug mb-3">Aileron Executive in walnut — Atelier Bensaïd, Casablanca.</div>
                <div className="text-white/65 text-sm leading-relaxed mb-6">Mortise-and-tenon, three coats of linseed, twelve weeks from log to delivery. <Link to="/products" className="underline underline-offset-4 text-white hover:text-primary">Read the piece →</Link></div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15">
                  <div>
                    <div className="font-display text-3xl tick">28</div>
                    <div className="small-caps text-white/60 mt-1 text-[10px]">Ateliers</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl tick">162</div>
                    <div className="small-caps text-white/60 mt-1 text-[10px]">Pieces</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl tick">4.8</div>
                    <div className="small-caps text-white/60 mt-1 text-[10px]">Avg rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 small-caps text-white/60 z-10 flex flex-col items-center gap-1">
          <span>Begin</span>
          <span className="material-symbols-outlined animate-bounce" style={{ fontSize: 18 }}>expand_more</span>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="bg-[#1c1b1b] text-white overflow-hidden py-5 border-y border-white/5">
        <div className="marquee whitespace-nowrap font-bold uppercase tracking-widest-2 text-sm">
          <span className="flex items-center gap-4 px-8">Free Casa delivery · ↑ 1,500 MAD <span className="text-primary">●</span> Pay in 3 with CMI <span className="text-primary">●</span> 2-year warranty <span className="text-primary">●</span> 28 verified Moroccan ateliers <span className="text-primary">●</span> White-glove install <span className="text-primary">●</span></span>
          <span className="flex items-center gap-4 px-8">Free Casa delivery · ↑ 1,500 MAD <span className="text-primary">●</span> Pay in 3 with CMI <span className="text-primary">●</span> 2-year warranty <span className="text-primary">●</span> 28 verified Moroccan ateliers <span className="text-primary">●</span> White-glove install <span className="text-primary">●</span></span>
        </div>
      </section>

      {/* ============ CHAPTER 01 — FROM THE ATELIER ============ */}
      <section className="bg-surface py-28">
        <div className="max-w-screen-2xl mx-auto px-8">
          {/* chapter head */}
          <div className="grid grid-cols-12 gap-10 items-end mb-14">
            <div className="col-span-12 md:col-span-7 reveal">
              <p className="small-caps text-primary mb-4">Chapter 01 — From the atelier</p>
              <h2 className="font-display text-7xl leading-[0.92] tracking-tight">The hand that made it.<br /><span className="italic-display font-light text-on-surface-variant">The room it found.</span></h2>
            </div>
            <div className="col-span-12 md:col-span-5 reveal d2">
              <p className="text-on-surface-variant text-lg leading-relaxed">Every Desk+ piece is built in a Moroccan workshop, by people whose names we know. We visit. We oil the wood ourselves before it ships. Then we deliver it — and stay until it's right.</p>
            </div>
          </div>

          {/* Split screen: workshop / finished */}
          <div className="grid grid-cols-12 gap-6 mb-20">
            {/* left: workshop hero (tall) */}
            <figure className="col-span-12 md:col-span-7 reveal">
              <div className="atelier-img rounded-xl ring-soft" style={{ aspectRatio: '4/5', backgroundImage: "url('https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=1800&q=85&auto=format&fit=crop')" }}></div>
              <figcaption className="mt-5 flex items-start justify-between gap-8">
                <div>
                  <div className="small-caps text-primary">In the workshop</div>
                  <div className="font-display text-2xl mt-1">Atelier Bensaïd · Casablanca</div>
                </div>
                <div className="text-sm text-on-surface-variant max-w-xs text-right">Walnut, planed by hand. The studio smells of linseed and sawdust by Tuesday afternoon.</div>
              </figcaption>
            </figure>

            {/* right: two stacked details */}
            <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
              <figure className="reveal d1">
                <div className="atelier-img rounded-xl ring-soft" style={{ aspectRatio: '4/3', backgroundImage: "url('https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=85&auto=format&fit=crop')" }}></div>
                <figcaption className="mt-4">
                  <div className="small-caps text-primary">Detail</div>
                  <div className="font-display text-xl mt-1">Mortise and tenon. No fasteners visible.</div>
                </figcaption>
              </figure>
              <figure className="reveal d2">
                <div className="atelier-img rounded-xl ring-soft" style={{ aspectRatio: '4/3', backgroundImage: "url('https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=85&auto=format&fit=crop')" }}></div>
                <figcaption className="mt-4">
                  <div className="small-caps text-primary">In place</div>
                  <div className="font-display text-xl mt-1">Apt. 4B · Anfa — Aileron Executive, walnut.</div>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Process ticks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-10 border-t border-outline-variant reveal">
            <div>
              <div className="font-display text-5xl text-primary tick">01</div>
              <div className="font-bold mt-3">Sourced</div>
              <div className="text-sm text-on-surface-variant mt-1 leading-relaxed">FSC walnut and oak, sawn in the Middle Atlas.</div>
            </div>
            <div>
              <div className="font-display text-5xl text-primary tick">02</div>
              <div className="font-bold mt-3">Joined</div>
              <div className="text-sm text-on-surface-variant mt-1 leading-relaxed">Mortise and tenon, no fasteners on show.</div>
            </div>
            <div>
              <div className="font-display text-5xl text-primary tick">03</div>
              <div className="font-bold mt-3">Finished</div>
              <div className="text-sm text-on-surface-variant mt-1 leading-relaxed">Three coats of linseed, rubbed between.</div>
            </div>
            <div>
              <div className="font-display text-5xl text-primary tick">04</div>
              <div className="font-bold mt-3">Delivered</div>
              <div className="text-sm text-on-surface-variant mt-1 leading-relaxed">White-glove install, packaging removed.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CHAPTER 02 — STYLE STRIP ============ */}
      <section className="bg-surface-container-low py-28">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-12 gap-10 items-end mb-12">
            <div className="col-span-12 md:col-span-7 reveal">
              <p className="small-caps text-primary mb-4">Chapter 02 — Our four tastes</p>
              <h2 className="font-display text-7xl leading-[0.92] tracking-tight">Pick a <span className="italic-display font-light">temperament.</span></h2>
            </div>
            <div className="col-span-12 md:col-span-5 reveal d2">
              <p className="text-on-surface-variant text-lg leading-relaxed">Four house styles. Each one is a complete language — wood, light, hardware, posture. Most rooms find themselves in one.</p>
              <Link to="/styles" className="mt-4 inline-flex items-center gap-2 font-bold border-b-2 border-primary pb-1 hover:text-primary">See all four <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <Link to="/styles" className="style-card lift reveal ph-mesh-chair" style={{ backgroundImage: "url('https://www.kendomobiliario.com/wp-content/uploads/2024/05/p_rak_desk_2.jpg?w=900&q=85&auto=format&fit=crop')" }}>
              <div className="absolute top-4 left-4 small-caps text-white/80">01 / Kendo</div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="font-display text-3xl leading-tight">Kendo</div>
                <div className="text-xs text-white/70 mt-1">Mesh, alloy, ergonomic posture.</div>
              </div>
            </Link>
            <Link to="/styles" className="style-card lift reveal d1 ph-cream" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&q=85&auto=format&fit=crop')" }}>
              <div className="absolute top-4 left-4 small-caps text-white/80">02 / Coco</div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="font-display text-3xl leading-tight">Coco</div>
                <div className="text-xs text-white/70 mt-1">Linen, rattan, soft cream.</div>
              </div>
            </Link>
            <Link to="/styles" className="style-card lift reveal d2 ph-walnut" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=900&q=85&auto=format&fit=crop')" }}>
              <div className="absolute top-4 left-4 small-caps text-white/80">03 / Woody</div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="font-display text-3xl leading-tight">Woody</div>
                <div className="text-xs text-white/70 mt-1">Walnut, oak, oil, leather.</div>
              </div>
            </Link>
            <Link to="/styles" className="style-card lift reveal d3 ph-charcoal" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1575318634028-6a0cfcb60c59?w=900&q=85&auto=format&fit=crop')" }}>
              <div className="absolute top-4 left-4 small-caps text-white/80">04 / Hacker</div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="font-display text-3xl leading-tight">Hacker</div>
                <div className="text-xs text-white/70 mt-1">Matte black, cable runs, focus.</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CHAPTER 03 — CURATOR'S PICKS ============ */}
      <section className="max-w-screen-2xl mx-auto px-8 py-28">
        <div className="flex items-end justify-between mb-10 reveal">
          <div>
            <p className="small-caps text-primary mb-4">Chapter 03 — This week's bench</p>
            <h2 className="font-display text-6xl leading-[0.95]">Curator's <span className="italic-display font-light">picks.</span></h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/products" className="small-caps text-xs border-b-2 border-primary pb-1 font-bold hover:text-primary">All 162 pieces →</Link>
            <div className="flex gap-1">
              <button className="w-11 h-11 grid place-items-center rounded-full border border-outline-variant hover:bg-surface-container"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="w-11 h-11 grid place-items-center rounded-full btn-grad text-white"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <Link key={card.id} to={`/products/${card.slug}`} className={`lift group reveal${i === 1 ? ' d1' : i === 2 ? ' d2' : i === 3 ? ' d3' : ''}`}>
              <div className={`aspect-square rounded-xl overflow-hidden ring-soft relative bg-cover bg-center ${card.ph}`} style={card.image ? { backgroundImage: `url('${card.image}')` } : undefined}>
                {card.badge && (
                  <span className={`absolute top-3 left-3 chip ${card.badgeClass} small-caps text-[10px]`}>{card.badge}</span>
                )}
                <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 grid place-items-center opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.preventDefault()}><span className="material-symbols-outlined" style={{ fontSize: 18 }}>favorite</span></button>
              </div>
              <div className="mt-4">
                <div className="small-caps text-on-surface-variant text-[10px]">{card.category}</div>
                <div className="font-display text-xl mt-1 group-hover:text-primary transition">{card.name}</div>
                <div className="flex items-center justify-between mt-2"><span className="font-black text-primary">{card.price.toLocaleString()} MAD</span><span className="text-xs text-on-surface-variant">★ {card.rating} · {card.reviews} reviews</span></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ CHAPTER 04 — SPACES MOSAIC ============ */}
      <section className="bg-[#1c1b1b] text-white py-28">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-12 gap-10 items-end mb-12">
            <div className="col-span-12 md:col-span-7 reveal">
              <p className="small-caps text-primary mb-4">Chapter 04 — Whole rooms</p>
              <h2 className="font-display text-7xl leading-[0.92] tracking-tight">Not just pieces.<br /><span className="italic-display font-light text-white/70">Environments.</span></h2>
            </div>
            <div className="col-span-12 md:col-span-5 reveal d2">
              <p className="text-white/70 text-lg leading-relaxed">Six fully-furnished setups, modular by floor plan. Tell us your room — we'll return a bill of materials in 48 hours.</p>
              <Link to="/spaces" className="mt-4 inline-flex items-center gap-2 font-bold border-b-2 border-primary pb-1 hover:text-primary">Explore the six environments <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></Link>
            </div>
          </div>

          <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[680px]">
            <Link to="/spaces" className="col-span-7 row-span-2 rounded-xl overflow-hidden relative bg-cover bg-center group reveal" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=85&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="small-caps text-white/65 mb-3">01 · Corporate</div>
                <div className="font-display text-6xl leading-tight">Wood Modern</div>
                <div className="italic-display font-display text-white/75 mt-3 text-xl">Walnut, brass, leather. For the considered office.</div>
              </div>
            </Link>
            <Link to="/spaces" className="col-span-5 rounded-xl overflow-hidden relative bg-cover bg-center group reveal d1" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400&q=85&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="small-caps text-white/65 mb-1">02 · Tech</div>
                <div className="font-display text-3xl">Dev Space</div>
              </div>
            </Link>
            <Link to="/spaces" className="col-span-3 rounded-xl overflow-hidden relative bg-cover bg-center group reveal d2" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=900&q=85&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="small-caps text-white/65 mb-1">03 · Creative</div>
                <div className="font-display text-2xl">Art Space</div>
              </div>
            </Link>
            <Link to="/spaces" className="col-span-2 rounded-xl overflow-hidden relative bg-cover bg-center group reveal d3" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=85&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="small-caps text-white/65 mb-1">04 · Edu</div>
                <div className="font-display text-xl">School</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CHAPTER 05 — PULL QUOTE ============ */}
      <section className="bg-surface py-32 px-8 reveal">
        <div className="max-w-4xl mx-auto text-center">
          <p className="small-caps text-primary mb-6">Read between the wood grain</p>
          <div className="quote-rule"></div>
          <blockquote className="font-display text-5xl md:text-6xl leading-[1.05] font-light tracking-tight">
            <span className="italic-display text-primary font-normal">"</span>The chair you don't think about. The desk that makes you want to stay. Five hours in and I forget I'm sitting — Desk+ furniture <em className="italic-display">disappears into the work.</em><span className="italic-display text-primary font-normal">"</span>
          </blockquote>
          <div className="mt-10 inline-flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-on-surface grid place-items-center font-display text-sm">AW</div>
            <div className="text-left">
              <div className="font-bold">Aya Wakil</div>
              <div className="small-caps text-on-surface-variant text-[10px] mt-0.5">Founder, Atelier Nord · Casablanca</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 crosshatch opacity-30"></div>
        <div className="max-w-screen-2xl mx-auto px-8 py-24 grid grid-cols-12 gap-10 items-center relative">
          <div className="col-span-12 md:col-span-7 reveal">
            <p className="small-caps text-white/80 mb-3">The Workshop Letter</p>
            <h2 className="font-display text-6xl leading-tight">Curated stories.<br />Two a month. <span className="italic-display font-light">Never more.</span></h2>
          </div>
          <div className="col-span-12 md:col-span-5 reveal d2">
            <div className="flex gap-2 bg-white p-2 rounded-xl">
              <input className="flex-1 h-12 px-4 text-on-surface bg-transparent outline-none" placeholder="your@email.com" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} />
              <button onClick={handleSubscribe} className="bg-[#1c1b1b] text-white font-bold px-6 rounded-lg small-caps text-xs">Subscribe</button>
            </div>
            <div className="mt-3 text-xs text-white/70">Unsubscribe anytime · No spam · 4,200+ subscribers</div>
          </div>
        </div>
      </section>
    </div>
  )
}
