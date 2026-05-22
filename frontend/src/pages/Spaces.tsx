import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUiStore } from '../store/uiStore'

const SPACE_CATEGORIES = ['All', 'Corporate', 'Education', 'Healthcare', 'Tech / Dev', 'Creative'] as const

const SPACES = [
  { name: 'DEV SPACE', category: 'Tech / Dev', bg: 'ph-dark', slug: 'dev-space', price: '12,000', desc: 'Optimized for focus and deep work sessions.', chips: ['Desk', 'Chair', 'Storage', 'Lighting'], layouts: ['▭ U-shape', '∟ L-shape', '+ Cross'] },
  { name: 'ART SPACE', category: 'Creative', bg: 'ph-creative', slug: 'art-space', price: '9,500', desc: 'Vibrant, inspiring environments for creators.', chips: ['Desk', 'Stool', 'Easel', 'Lighting'], layouts: ['∟ L-shape', '▭ Linear'] },
  { name: 'WOOD MODERN', category: 'Corporate', bg: 'ph-walnut', slug: 'wood-modern', price: '18,200', desc: 'The timeless elegance of organic materials.', chips: ['Desk', 'Chair', 'Credenza', 'Shelf'], layouts: ['▭ U-shape', '+ Cross'] },
  { name: 'SCHOOL / UNIVERSITY', category: 'Education', bg: 'ph-edu', slug: 'school-university', price: '6,800', desc: 'High-density seating with acoustic dampening.', chips: ['Bench desk', 'Stack chair', 'Lockers'], layouts: ['▭ Linear', '▦ Cluster'] },
  { name: 'DOCTOR SUITE', category: 'Healthcare', bg: 'ph-med', slug: 'doctor-suite', price: '11,400', desc: 'Antimicrobial surfaces, quiet flow.', chips: ['Console', 'Bench', 'Cabinet'], layouts: ['∟ L-shape', '▭ Linear'] },
  { name: 'COMMERCE FLOOR', category: 'Corporate', bg: 'ph-corp', slug: 'commerce-floor', price: '15,900', desc: 'Retail-front, hot-desking compatible.', chips: ['Counter', 'Stool', 'POS'], layouts: ['▭ Island', '∟ L-shape'] },
] as const

export default function Spaces() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [selectedLayout, setSelectedLayout] = useState(0)
  const navigate = useNavigate()
  const { showToast } = useUiStore()

  const filteredSpaces = activeCategory === 'All' ? SPACES : SPACES.filter(s => s.category === activeCategory)
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
              <button onClick={() => { const grid = document.getElementById('spaces-grid'); grid?.scrollIntoView({ behavior: 'smooth' }) }} className="btn-grad text-white font-bold px-6 py-3.5 rounded-xl uppercase tracking-widest-2 text-sm">Browse all spaces</button>
              <button onClick={() => showToast('Consultation booking coming soon', 'info')} className="border border-outline-variant font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-surface-container">Book a consultation</button>
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
            {SPACE_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`chip ${activeCategory === cat ? 'btn-grad' : 'bg-surface-container-high'} uppercase tracking-widest-2`}>{cat}</button>
            ))}
          </div>
          <div className="text-sm text-on-surface-variant"><strong className="text-on-surface">{filteredSpaces.length} spaces</strong> available</div>
        </div>
      </section>

      {/* Grid */}
      <section id="spaces-grid" className="max-w-screen-2xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-6">
          {filteredSpaces.map((space) => (
            <div key={space.slug} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient group">
              <div className={`${space.bg} h-64 relative overflow-hidden`}>
                <div className="absolute top-3 left-3 chip btn-grad uppercase tracking-widest-2">{space.category}</div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="font-black text-xl tracking-tight">{space.name}</div>
                  <span className="material-symbols-outlined">arrow_outward</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-on-surface-variant">{space.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">{space.chips.map(c => <span key={c} className="chip bg-surface-container-high">{c}</span>)}</div>
                <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant">{space.layouts.map(l => <span key={l} className="chip bg-surface-container-low">{l}</span>)}</div>
                <div className="mt-5 flex items-center justify-between">
                  <div><div className="text-xs text-on-surface-variant">From</div><div className="font-black text-primary text-lg">{space.price} MAD</div></div>
                  <div className="flex gap-2"><button onClick={() => showToast(`Quick view: ${space.name}`, 'info')} className="border border-outline-variant text-xs font-semibold px-3 py-2 rounded-lg">Quick view</button><Link to={`/products?space=${space.slug}`} className="btn-grad text-white text-xs font-bold px-3 py-2 rounded-lg uppercase tracking-widest-2">Explore</Link></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Layout selector */}
        <div className="mt-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="h-display text-3xl">Choose your layout</h2>
            <span className="text-sm text-on-surface-variant">Click a shape to preview adapted pricing</span>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {[
              { svg: <path d="M10 50 L10 15 L70 15 L70 50" className={`layout-shape${selectedLayout === 0 ? ' active' : ''}`} fill={selectedLayout === 0 ? '#ffdad5' : 'none'}/>, name: 'U-Shape', people: '4-6', price: '14,200' },
              { svg: <path d="M10 10 L10 50 L70 50" className={`layout-shape${selectedLayout === 1 ? ' active' : ''}`} fill={selectedLayout === 1 ? '#ffdad5' : 'none'}/>, name: 'L-Shape', people: '2-3', price: '11,900' },
              { svg: <path d="M40 10 L40 50 M10 30 L70 30" className={`layout-shape${selectedLayout === 2 ? ' active' : ''}`} fill={selectedLayout === 2 ? '#ffdad5' : 'none'}/>, name: '+ Cross', people: '4', price: '12,500' },
              { svg: <><rect x="10" y="10" width="60" height="10" className={`layout-shape${selectedLayout === 3 ? ' active' : ''}`} fill={selectedLayout === 3 ? '#ffdad5' : 'none'}/><rect x="10" y="25" width="60" height="10" className={`layout-shape${selectedLayout === 3 ? ' active' : ''}`} fill={selectedLayout === 3 ? '#ffdad5' : 'none'}/><rect x="10" y="40" width="60" height="10" className={`layout-shape${selectedLayout === 3 ? ' active' : ''}`} fill={selectedLayout === 3 ? '#ffdad5' : 'none'}/></>, name: 'Call center', people: '10-24', price: '28,400' },
            ].map((layout, i) => (
              <div key={i} onClick={() => setSelectedLayout(i)} className={`bg-surface-container-lowest rounded-xl p-6 shadow-ambient text-center cursor-pointer ${selectedLayout === i ? 'border-2 border-primary' : ''}`}>
                <svg viewBox="0 0 80 60" className="w-full h-24">{layout.svg}</svg>
                <div className="font-black mt-3">{layout.name}</div>
                <div className="text-xs text-on-surface-variant">Ideal for {layout.people} people</div>
                <div className={`mt-3 font-bold text-sm ${selectedLayout === i ? 'text-primary' : 'text-on-surface-variant'}`}>{layout.price} MAD</div>
              </div>
            ))}
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
          <button onClick={() => showToast('Custom space request form coming soon', 'info')} className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl uppercase tracking-widest-2 text-sm hover:bg-white hover:text-primary whitespace-nowrap">Request custom space</button>
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
