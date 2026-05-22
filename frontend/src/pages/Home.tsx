import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const [curatorIndex, setCuratorIndex] = useState(0)
  const navigate = useNavigate()
  return (
    <div>
      {/* HERO */}
      <section className="relative hero-grid overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8 pt-16 pb-20 grid grid-cols-12 gap-10 items-center">
          <div className="col-span-7 relative z-10">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest-2 mb-5">
              <span className="chip btn-grad">Spring '25</span>
              <span className="text-on-surface-variant">— Kendo collection now shipping</span>
            </div>
            <h1 className="h-display text-[110px] leading-[0.88] tracking-tight">The workspace,<br/><span className="italic font-light normal-case">considered.</span></h1>
            <p className="mt-6 text-on-surface-variant text-lg max-w-xl leading-relaxed">Premium office furniture from independent Moroccan ateliers. Built for the hours you spend thinking — not the minutes you spend sitting.</p>
            <div className="mt-8 flex items-center gap-4">
              <Link to="/products" className="btn-grad text-white font-bold px-8 py-4 rounded-xl uppercase tracking-widest-2 text-sm flex items-center gap-2">Shop the catalog <span className="material-symbols-outlined">arrow_forward</span></Link>
              <Link to="/spaces" className="font-bold text-sm flex items-center gap-2 hover:text-primary"><span className="w-10 h-10 rounded-full border-2 border-on-surface grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span></span>Tour the spaces</Link>
            </div>
            <div className="mt-12 flex items-center gap-8 text-sm">
              <div><div className="text-3xl font-black">28</div><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Ateliers</div></div>
              <div className="h-10 w-px bg-outline-variant"></div>
              <div><div className="text-3xl font-black">162</div><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Pieces</div></div>
              <div className="h-10 w-px bg-outline-variant"></div>
              <div><div className="text-3xl font-black">4.8 <span className="text-primary">★</span></div><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">2,400+ reviews</div></div>
            </div>
          </div>
          <div className="col-span-5 relative">
            {/* Layered product collage */}
            <div className="relative aspect-square">
              <div className="absolute inset-0 ph-walnut rounded-xl shadow-ambient" style={{ transform: 'rotate(-4deg) translate(-12px,12px)' }}></div>
              <div className="absolute inset-0 ph-mesh-chair rounded-xl shadow-ambient" style={{ transform: 'rotate(3deg) translate(20px,-8px)' }}></div>
              <div className="absolute inset-0 ph-charcoal rounded-xl shadow-ambient" style={{ transform: 'scale(.92)' }}>
                <svg className="absolute inset-0 m-auto" width="55%" viewBox="0 0 200 260" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M40 50 Q40 20 80 20 L130 20 Q170 20 170 60 L170 130 Q170 160 130 160 L80 160 Q40 160 40 130 Z" fill="#2a2828"/>
                  <path d="M105 165 L105 200" />
                  <path d="M70 200 L140 200 L160 240 L50 240 Z" fill="#1c1b1b"/>
                </svg>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs uppercase tracking-widest-2 opacity-70">Featured</div>
                  <div className="font-black text-xl">ErgoFlex Pro</div>
                </div>
              </div>
              {/* Price flag */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-ambient w-44">
                <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant">From</div>
                <div className="text-3xl font-black text-primary">3,490</div>
                <div className="text-xs font-bold">MAD · in stock</div>
              </div>
            </div>
          </div>
        </div>
        {/* Trust marquee */}
        <div className="tag-strip overflow-hidden py-4">
          <div className="marquee whitespace-nowrap font-bold uppercase tracking-widest-2 text-sm">
            <span className="flex items-center gap-4 px-8">Free Casa delivery · ↑ 1,500 MAD <span className="text-primary">●</span> Pay in 3 with CMI <span className="text-primary">●</span> 2-year warranty on every piece <span className="text-primary">●</span> 28 verified Moroccan ateliers <span className="text-primary">●</span> White-glove install on request <span className="text-primary">●</span></span>
            <span className="flex items-center gap-4 px-8">Free Casa delivery · ↑ 1,500 MAD <span className="text-primary">●</span> Pay in 3 with CMI <span className="text-primary">●</span> 2-year warranty on every piece <span className="text-primary">●</span> 28 verified Moroccan ateliers <span className="text-primary">●</span> White-glove install on request <span className="text-primary">●</span></span>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className="max-w-screen-2xl mx-auto px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-2">Shop by category</p>
            <h2 className="h-display text-4xl">Six pieces. One workspace.</h2>
          </div>
          <Link to="/search" className="text-sm font-bold flex items-center gap-2 hover:text-primary">All categories <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></Link>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <Link to="/products?category=desks" className="group">
            <div className="aspect-square rounded-xl ph-walnut relative overflow-hidden"><span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></span></div>
            <div className="mt-3 font-bold text-sm flex items-center justify-between">Desks <span className="text-on-surface-variant text-xs">42</span></div>
          </Link>
          <Link to="/products?category=chairs" className="group">
            <div className="aspect-square rounded-xl ph-mesh-chair relative overflow-hidden"></div>
            <div className="mt-3 font-bold text-sm flex items-center justify-between">Chairs <span className="text-on-surface-variant text-xs">28</span></div>
          </Link>
          <Link to="/products?category=lighting" className="group">
            <div className="aspect-square rounded-xl ph-dark relative overflow-hidden"></div>
            <div className="mt-3 font-bold text-sm flex items-center justify-between">Lighting <span className="text-on-surface-variant text-xs">18</span></div>
          </Link>
          <Link to="/products?category=storage" className="group">
            <div className="aspect-square rounded-xl ph-wood relative overflow-hidden"></div>
            <div className="mt-3 font-bold text-sm flex items-center justify-between">Storage <span className="text-on-surface-variant text-xs">24</span></div>
          </Link>
          <Link to="/products?category=accents" className="group">
            <div className="aspect-square rounded-xl ph-warm relative overflow-hidden"></div>
            <div className="mt-3 font-bold text-sm flex items-center justify-between">Accents <span className="text-on-surface-variant text-xs">22</span></div>
          </Link>
          <Link to="/products?category=textiles" className="group">
            <div className="aspect-square rounded-xl ph-cream relative overflow-hidden"></div>
            <div className="mt-3 font-bold text-sm flex items-center justify-between">Textiles <span className="text-on-surface-variant text-xs">14</span></div>
          </Link>
        </div>
      </section>

      {/* Editorial: Spaces */}
      <section className="bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-8 py-20 grid grid-cols-12 gap-10">
          <div className="col-span-4">
            <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-3">Spaces</p>
            <h2 className="h-display text-5xl leading-tight">Whole rooms,<br/>not just pieces.</h2>
            <p className="mt-5 text-on-surface-variant leading-relaxed">Six fully-furnished setups, modular by floor plan. Tell us your floor plan and team size — we'll return a fully-priced bill of materials in 48 hours.</p>
            <Link to="/spaces" className="mt-7 inline-flex items-center gap-2 font-bold border-b-2 border-primary pb-1 hover:text-primary">Explore the six environments <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></Link>
          </div>
          <div className="col-span-8 grid grid-cols-2 gap-4">
            <Link to="/products?space=wood-modern" className="aspect-[4/5] rounded-xl ph-corp relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-5 left-5 text-white">
                <div className="text-[10px] uppercase tracking-widest-2 opacity-70">01 · Corporate</div>
                <div className="h-display text-3xl mt-1">Wood Modern</div>
              </div>
            </Link>
            <div className="grid grid-rows-2 gap-4">
              <Link to="/products?space=dev-space" className="rounded-xl ph-dark relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-[10px] uppercase tracking-widest-2 opacity-70">02 · Tech</div>
                  <div className="h-display text-2xl mt-1">Dev Space</div>
                </div>
              </Link>
              <Link to="/products?space=art-space" className="rounded-xl ph-creative relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-[10px] uppercase tracking-widest-2 opacity-70">03 · Creative</div>
                  <div className="h-display text-2xl mt-1">Art Space</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-screen-2xl mx-auto px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-2">This week's bench</p>
            <h2 className="h-display text-4xl">Selected by our curator.</h2>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setCuratorIndex(i => Math.max(0, i - 1))} className={`w-10 h-10 grid place-items-center rounded-full border border-outline-variant hover:bg-surface-container${curatorIndex === 0 ? ' opacity-40' : ''}`}><span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span></button>
            <button onClick={() => setCuratorIndex(i => i + 1)} className="w-10 h-10 grid place-items-center rounded-full btn-grad text-white"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span></button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <Link to="/products/ergoflex-pro-mesh" className="group">
            <div className="aspect-square ph-mesh-chair rounded-xl relative overflow-hidden">
              <span className="absolute top-3 left-3 chip btn-grad uppercase tracking-widest-2">Best seller</span>
              <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>favorite</span></button>
            </div>
            <div className="mt-4">
              <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Kendo Studio</div>
              <div className="font-bold mt-1 group-hover:text-primary transition">ErgoFlex Pro Mesh</div>
              <div className="flex items-center justify-between mt-2"><span className="font-black text-primary text-lg">3,490 MAD</span><span className="text-xs text-on-surface-variant">★ 4.8</span></div>
            </div>
          </Link>
          <Link to="/products/aileron-executive-oak" className="group">
            <div className="aspect-square ph-walnut rounded-xl relative overflow-hidden">
              <span className="absolute top-3 left-3 chip bg-white text-on-surface uppercase tracking-widest-2">Limited</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Atelier Bensaïd</div>
              <div className="font-bold mt-1 group-hover:text-primary transition">Aileron Executive Oak</div>
              <div className="flex items-center justify-between mt-2"><span className="font-black text-primary text-lg">4,900 MAD</span><span className="text-xs text-on-surface-variant">★ 4.9</span></div>
            </div>
          </Link>
          <Link to="/products/lumi-task-light" className="group">
            <div className="aspect-square ph-dark rounded-xl relative overflow-hidden">
              <span className="absolute top-3 left-3 chip bg-white text-on-surface uppercase tracking-widest-2">New</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Hacker Lab</div>
              <div className="font-bold mt-1 group-hover:text-primary transition">Lumi Task Light</div>
              <div className="flex items-center justify-between mt-2"><span className="font-black text-primary text-lg">1,290 MAD</span><span className="text-xs text-on-surface-variant">★ 4.6</span></div>
            </div>
          </Link>
          <Link to="/products/linen-task-plus" className="group">
            <div className="aspect-square ph-cream rounded-xl relative overflow-hidden"></div>
            <div className="mt-4">
              <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Coco Souk</div>
              <div className="font-bold mt-1 group-hover:text-primary transition">Linen Task Plus</div>
              <div className="flex items-center justify-between mt-2"><span className="font-black text-primary text-lg">1,890 MAD</span><span className="text-xs text-on-surface-variant">★ 4.5</span></div>
            </div>
          </Link>
        </div>
      </section>

      {/* Style strip */}
      <section className="bg-[#1c1b1b] text-white overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-2">Our taste</p>
              <h2 className="h-display text-5xl">Find the philosophy.</h2>
            </div>
            <Link to="/styles" className="text-sm font-bold flex items-center gap-2 text-white/70 hover:text-white">All seven styles <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></Link>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <Link to="/products?taste=kendo" className="style-tile rounded-xl bg-gradient-to-br from-[#2a2828] to-[#0e0d0d] relative overflow-hidden p-5 flex flex-col justify-end">
              <svg className="absolute right-2 top-2 opacity-30" width="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" stroke="#ba0a0d" strokeWidth="2" fill="none"/><rect x="22" y="14" width="16" height="32" fill="#ba0a0d"/></svg>
              <div className="text-[10px] uppercase tracking-widest-2 text-white/50">01</div>
              <div className="h-display text-2xl">Kendo</div>
              <div className="italic text-white/60 text-xs mt-1">Power · Precision</div>
            </Link>
            <Link to="/products?taste=coco" className="style-tile rounded-xl ph-cream relative overflow-hidden p-5 flex flex-col justify-end">
              <div className="text-[10px] uppercase tracking-widest-2 text-on-surface/60">02</div>
              <div className="h-display text-2xl text-on-surface">Coco</div>
              <div className="italic text-on-surface-variant text-xs mt-1">Warm · Tactile</div>
            </Link>
            <Link to="/products?taste=woody" className="style-tile rounded-xl ph-walnut relative overflow-hidden p-5 flex flex-col justify-end">
              <div className="text-[10px] uppercase tracking-widest-2 text-white/70">03</div>
              <div className="h-display text-2xl">Woody</div>
              <div className="italic text-white/70 text-xs mt-1">Grain · Weight</div>
            </Link>
            <Link to="/products?taste=atelier" className="style-tile rounded-xl ph-warm relative overflow-hidden p-5 flex flex-col justify-end">
              <div className="text-[10px] uppercase tracking-widest-2 text-white/70">04</div>
              <div className="h-display text-2xl">Atelier</div>
              <div className="italic text-white/70 text-xs mt-1">Brass · Hand</div>
            </Link>
            <Link to="/products?taste=hacker" className="style-tile rounded-xl relative overflow-hidden p-5 flex flex-col justify-end" style={{ background: 'linear-gradient(135deg,#5c5c5c,#1c1b1b)' }}>
              <span className="absolute top-3 right-3 chip btn-grad uppercase tracking-widest-2">New</span>
              <div className="text-[10px] uppercase tracking-widest-2 text-white/50">05</div>
              <div className="h-display text-2xl">Hacker</div>
              <div className="italic text-white/60 text-xs mt-1">Cable · Steel</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-screen-2xl mx-auto px-8 py-24 text-center">
        <span className="text-7xl font-black text-primary">"</span>
        <p className="h-display text-3xl max-w-4xl mx-auto leading-tight normal-case font-light italic -mt-6">The chair you don't think about, the desk that makes you want to stay. Five hours in and I forget I'm sitting — Desk+ furniture <strong className="font-black not-italic uppercase">disappears into the work</strong>.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary text-white grid place-items-center font-black">AT</div>
          <div className="text-left">
            <div className="font-bold">Aïcha Talbi</div>
            <div className="text-xs text-on-surface-variant">Founder, Atelier Nord · Casablanca</div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 crosshatch opacity-30"></div>
        <div className="max-w-screen-2xl mx-auto px-8 py-20 grid grid-cols-12 gap-10 items-center relative">
          <div className="col-span-7">
            <p className="text-xs font-bold uppercase tracking-widest-2 text-primary-fixed mb-3">The Workshop Letter</p>
            <h2 className="h-display text-5xl leading-tight">Curated stories.<br/>Two a month. <span className="italic font-light">Never more.</span></h2>
          </div>
          <div className="col-span-5">
            <div className="flex gap-2 bg-white p-2 rounded-xl">
              <input className="flex-1 h-12 px-4 text-on-surface bg-transparent outline-none" placeholder="your@email.com" />
              <button onClick={(e) => { const inp = (e.currentTarget.previousElementSibling as HTMLInputElement); if (inp?.value) { inp.value = ''; alert('Thank you for subscribing!') } }} className="bg-[#1c1b1b] text-white font-bold px-6 rounded-lg uppercase tracking-widest-2 text-sm">Subscribe</button>
            </div>
            <div className="mt-3 text-xs text-white/70">Unsubscribe anytime · No spam · 4,200+ subscribers</div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-grid{background-image:linear-gradient(rgba(186,10,13,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(186,10,13,.04) 1px,transparent 1px);background-size:60px 60px;}
        .marquee{display:flex;gap:4rem;animation:scroll 40s linear infinite;}
        @keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .style-tile{aspect-ratio:3/4;transition:transform .5s;}
        .style-tile:hover{transform:translateY(-6px);}
        .tag-strip{background:#1c1b1b;color:#fff;}
      `}</style>
    </div>
  )
}
