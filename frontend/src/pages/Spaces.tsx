import { Link } from 'react-router-dom'

export default function Spaces() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-8 py-20 grid grid-cols-12 gap-10 items-center min-h-[50vh]">
          <div className="col-span-7">
            <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-3">Curated environments</p>
            <h1 className="h-display text-6xl leading-[0.95]">Explore<br/>complete<br/>spaces.</h1>
            <p className="mt-6 text-on-surface-variant text-lg max-w-lg">Every piece, every detail — curated for your environment. Six fully-furnished setups, modular by floor plan, ready to ship.</p>
            <div className="mt-8 flex gap-3">
              <button className="btn-grad text-white font-bold px-6 py-3.5 rounded-xl uppercase tracking-widest-2 text-sm">Browse all spaces</button>
              <button className="border border-outline-variant font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-surface-container">Book a consultation</button>
            </div>
          </div>
          <div className="col-span-5 relative h-80">
            {/* isometric office abstract */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative w-72 h-72 iso">
                <div style={{left:0,top:0,width:'280px',height:'180px',background:'#fcf9f8'}}></div>
                <div style={{left:'30px',top:'30px',width:'80px',height:'50px',background:'#1c1b1b'}}></div>
                <div style={{left:'130px',top:'40px',width:'120px',height:'60px',background:'#b67a64'}}></div>
                <div style={{left:'30px',top:'100px',width:'60px',height:'60px',background:'#ba0a0d'}}></div>
                <div style={{left:'110px',top:'110px',width:'50px',height:'50px',background:'#e2dfde'}}></div>
                <div style={{left:'180px',top:'115px',width:'70px',height:'45px',background:'#5f5e5e'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter chips */}
      <section className="border-b border-outline-variant bg-surface">
        <div className="max-w-screen-2xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button className="chip btn-grad uppercase tracking-widest-2">All</button>
            <button className="chip bg-surface-container-high uppercase tracking-widest-2">Corporate</button>
            <button className="chip bg-surface-container-high uppercase tracking-widest-2">Education</button>
            <button className="chip bg-surface-container-high uppercase tracking-widest-2">Healthcare</button>
            <button className="chip bg-surface-container-high uppercase tracking-widest-2">Tech / Dev</button>
            <button className="chip bg-surface-container-high uppercase tracking-widest-2">Creative</button>
          </div>
          <div className="text-sm text-on-surface-variant"><strong className="text-on-surface">6 spaces</strong> available</div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-screen-2xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-6">
          {/* Card template */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient group">
            <div className="ph-dark h-64 relative overflow-hidden">
              <div className="absolute top-3 left-3 chip btn-grad uppercase tracking-widest-2">Tech / Dev</div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div className="font-black text-xl tracking-tight">DEV SPACE</div>
                <span className="material-symbols-outlined">arrow_outward</span>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-on-surface-variant">Optimized for focus and deep work sessions.</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="chip bg-surface-container-high">Desk</span><span className="chip bg-surface-container-high">Chair</span><span className="chip bg-surface-container-high">Storage</span><span className="chip bg-surface-container-high">Lighting</span>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant">
                <span className="chip bg-surface-container-low">▭ U-shape</span><span className="chip bg-surface-container-low">∟ L-shape</span><span className="chip bg-surface-container-low">+ Cross</span>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div><div className="text-xs text-on-surface-variant">From</div><div className="font-black text-primary text-lg">12,000 MAD</div></div>
                <div className="flex gap-2"><button className="border border-outline-variant text-xs font-semibold px-3 py-2 rounded-lg">Quick view</button><Link to="/products?space=dev-space" className="btn-grad text-white text-xs font-bold px-3 py-2 rounded-lg uppercase tracking-widest-2">Explore</Link></div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient">
            <div className="ph-creative h-64 relative overflow-hidden">
              <div className="absolute top-3 left-3 chip bg-white text-on-surface uppercase tracking-widest-2">Creative</div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div className="font-black text-xl tracking-tight">ART SPACE</div><span className="material-symbols-outlined">arrow_outward</span>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-on-surface-variant">Vibrant, inspiring environments for creators.</p>
              <div className="flex flex-wrap gap-1.5 mt-3"><span className="chip bg-surface-container-high">Desk</span><span className="chip bg-surface-container-high">Stool</span><span className="chip bg-surface-container-high">Easel</span><span className="chip bg-surface-container-high">Lighting</span></div>
              <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant"><span className="chip bg-surface-container-low">∟ L-shape</span><span className="chip bg-surface-container-low">▭ Linear</span></div>
              <div className="mt-5 flex items-center justify-between"><div><div className="text-xs text-on-surface-variant">From</div><div className="font-black text-primary text-lg">9,500 MAD</div></div><div className="flex gap-2"><button className="border border-outline-variant text-xs font-semibold px-3 py-2 rounded-lg">Quick view</button><Link to="/products?space=art-space" className="btn-grad text-white text-xs font-bold px-3 py-2 rounded-lg uppercase tracking-widest-2">Explore</Link></div></div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient">
            <div className="ph-walnut h-64 relative overflow-hidden">
              <div className="absolute top-3 left-3 chip btn-grad uppercase tracking-widest-2">Corporate</div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div className="font-black text-xl tracking-tight">WOOD MODERN</div><span className="material-symbols-outlined">arrow_outward</span>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-on-surface-variant">The timeless elegance of organic materials.</p>
              <div className="flex flex-wrap gap-1.5 mt-3"><span className="chip bg-surface-container-high">Desk</span><span className="chip bg-surface-container-high">Chair</span><span className="chip bg-surface-container-high">Credenza</span><span className="chip bg-surface-container-high">Shelf</span></div>
              <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant"><span className="chip bg-surface-container-low">▭ U-shape</span><span className="chip bg-surface-container-low">+ Cross</span></div>
              <div className="mt-5 flex items-center justify-between"><div><div className="text-xs text-on-surface-variant">From</div><div className="font-black text-primary text-lg">18,200 MAD</div></div><div className="flex gap-2"><button className="border border-outline-variant text-xs font-semibold px-3 py-2 rounded-lg">Quick view</button><Link to="/products?space=wood-modern" className="btn-grad text-white text-xs font-bold px-3 py-2 rounded-lg uppercase tracking-widest-2">Explore</Link></div></div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient">
            <div className="ph-edu h-64 relative overflow-hidden">
              <div className="absolute top-3 left-3 chip bg-white text-on-surface uppercase tracking-widest-2">Education</div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white"><div className="font-black text-xl tracking-tight">SCHOOL / UNIVERSITY</div><span className="material-symbols-outlined">arrow_outward</span></div>
            </div>
            <div className="p-5">
              <p className="text-sm text-on-surface-variant">High-density seating with acoustic dampening.</p>
              <div className="flex flex-wrap gap-1.5 mt-3"><span className="chip bg-surface-container-high">Bench desk</span><span className="chip bg-surface-container-high">Stack chair</span><span className="chip bg-surface-container-high">Lockers</span></div>
              <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant"><span className="chip bg-surface-container-low">▭ Linear</span><span className="chip bg-surface-container-low">▦ Cluster</span></div>
              <div className="mt-5 flex items-center justify-between"><div><div className="text-xs text-on-surface-variant">From</div><div className="font-black text-primary text-lg">6,800 MAD</div></div><div className="flex gap-2"><button className="border border-outline-variant text-xs font-semibold px-3 py-2 rounded-lg">Quick view</button><Link to="/products?space=school-university" className="btn-grad text-white text-xs font-bold px-3 py-2 rounded-lg uppercase tracking-widest-2">Explore</Link></div></div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient">
            <div className="ph-med h-64 relative overflow-hidden">
              <div className="absolute top-3 left-3 chip bg-white text-on-surface uppercase tracking-widest-2">Healthcare</div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white"><div className="font-black text-xl tracking-tight">DOCTOR SUITE</div><span className="material-symbols-outlined">arrow_outward</span></div>
            </div>
            <div className="p-5">
              <p className="text-sm text-on-surface-variant">Antimicrobial surfaces, quiet flow.</p>
              <div className="flex flex-wrap gap-1.5 mt-3"><span className="chip bg-surface-container-high">Console</span><span className="chip bg-surface-container-high">Bench</span><span className="chip bg-surface-container-high">Cabinet</span></div>
              <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant"><span className="chip bg-surface-container-low">∟ L-shape</span><span className="chip bg-surface-container-low">▭ Linear</span></div>
              <div className="mt-5 flex items-center justify-between"><div><div className="text-xs text-on-surface-variant">From</div><div className="font-black text-primary text-lg">11,400 MAD</div></div><div className="flex gap-2"><button className="border border-outline-variant text-xs font-semibold px-3 py-2 rounded-lg">Quick view</button><Link to="/products?space=doctor-suite" className="btn-grad text-white text-xs font-bold px-3 py-2 rounded-lg uppercase tracking-widest-2">Explore</Link></div></div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient">
            <div className="ph-corp h-64 relative overflow-hidden">
              <div className="absolute top-3 left-3 chip bg-white text-on-surface uppercase tracking-widest-2">Commerce</div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white"><div className="font-black text-xl tracking-tight">COMMERCE FLOOR</div><span className="material-symbols-outlined">arrow_outward</span></div>
            </div>
            <div className="p-5">
              <p className="text-sm text-on-surface-variant">Retail-front, hot-desking compatible.</p>
              <div className="flex flex-wrap gap-1.5 mt-3"><span className="chip bg-surface-container-high">Counter</span><span className="chip bg-surface-container-high">Stool</span><span className="chip bg-surface-container-high">POS</span></div>
              <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant"><span className="chip bg-surface-container-low">▭ Island</span><span className="chip bg-surface-container-low">∟ L-shape</span></div>
              <div className="mt-5 flex items-center justify-between"><div><div className="text-xs text-on-surface-variant">From</div><div className="font-black text-primary text-lg">15,900 MAD</div></div><div className="flex gap-2"><button className="border border-outline-variant text-xs font-semibold px-3 py-2 rounded-lg">Quick view</button><Link to="/products?space=commerce-floor" className="btn-grad text-white text-xs font-bold px-3 py-2 rounded-lg uppercase tracking-widest-2">Explore</Link></div></div>
            </div>
          </div>
        </div>

        {/* Layout selector */}
        <div className="mt-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="h-display text-3xl">Choose your layout</h2>
            <span className="text-sm text-on-surface-variant">Click a shape to preview adapted pricing</span>
          </div>
          <div className="grid grid-cols-4 gap-5">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient text-center border-2 border-primary">
              <svg viewBox="0 0 80 60" className="w-full h-24"><path d="M10 50 L10 15 L70 15 L70 50" className="layout-shape active" fill="#ffdad5"/></svg>
              <div className="font-black mt-3">U-Shape</div>
              <div className="text-xs text-on-surface-variant">Ideal for 4-6 people</div>
              <div className="mt-3 text-primary font-bold text-sm">14,200 MAD</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient text-center">
              <svg viewBox="0 0 80 60" className="w-full h-24"><path d="M10 10 L10 50 L70 50" className="layout-shape" fill="none"/></svg>
              <div className="font-black mt-3">L-Shape</div>
              <div className="text-xs text-on-surface-variant">Ideal for 2-3 people</div>
              <div className="mt-3 text-on-surface-variant font-bold text-sm">11,900 MAD</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient text-center">
              <svg viewBox="0 0 80 60" className="w-full h-24"><path d="M40 10 L40 50 M10 30 L70 30" className="layout-shape" fill="none"/></svg>
              <div className="font-black mt-3">+ Cross</div>
              <div className="text-xs text-on-surface-variant">Ideal for 4 people</div>
              <div className="mt-3 text-on-surface-variant font-bold text-sm">12,500 MAD</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient text-center">
              <svg viewBox="0 0 80 60" className="w-full h-24"><rect x="10" y="10" width="60" height="10" className="layout-shape" fill="none"/><rect x="10" y="25" width="60" height="10" className="layout-shape" fill="none"/><rect x="10" y="40" width="60" height="10" className="layout-shape" fill="none"/></svg>
              <div className="font-black mt-3">Call center</div>
              <div className="text-xs text-on-surface-variant">Ideal for 10-24 people</div>
              <div className="mt-3 text-on-surface-variant font-bold text-sm">28,400 MAD</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 crosshatch opacity-30"></div>
        <div className="max-w-screen-2xl mx-auto px-8 py-16 relative flex items-center justify-between gap-12">
          <div>
            <h2 className="h-display text-4xl leading-tight">Can't find your perfect space?<br/><span className="text-primary-fixed">We'll build it.</span></h2>
            <p className="mt-3 text-white/80 max-w-lg">Tell us your floor plan, team size, and aesthetic. Our architects will return a fully-priced bill of materials in 48 hours.</p>
          </div>
          <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl uppercase tracking-widest-2 text-sm hover:bg-white hover:text-primary whitespace-nowrap">Request custom space</button>
        </div>
      </section>

      <style>{`
.iso{transform:rotateX(55deg) rotateZ(-45deg);transform-style:preserve-3d;}
.iso > div{position:absolute;border-radius:6px;}
.layout-shape{stroke:#5c403c;stroke-width:2;fill:#f0eded;}
.layout-shape.active{stroke:#ba0a0d;fill:#ffdad5;}
      `}</style>
    </div>
  )
}
