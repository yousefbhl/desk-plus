import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="bg-surface dot-grid-bg">
      <section className="max-w-screen-2xl mx-auto px-8 py-20 grid grid-cols-12 gap-16 items-center min-h-[70vh]">
        {/* Left: the apology */}
        <div className="col-span-6 relative">
          <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-3">Error 404</p>
          <h1 className="h-display text-[150px] leading-none tracking-tight">
            <span>This</span><br/>
            <span className="italic font-light">desk is</span><br/>
            <span className="text-primary">empty.</span>
          </h1>
          <p className="mt-8 text-on-surface-variant text-lg max-w-md">The page you're looking for has moved, been retired, or maybe it never existed. Let's get you back to something useful.</p>
          <div className="mt-8 flex items-center gap-3 flex-wrap">
            <Link to="/home" className="btn-grad text-white font-bold px-7 py-3.5 rounded-xl uppercase tracking-widest-2 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">home</span>Back to home
            </Link>
            <Link to="/products" className="border-2 border-on-surface font-bold px-6 py-3 rounded-xl text-sm hover:bg-surface-container">Browse the catalog</Link>
            <Link to="/search" className="font-bold text-sm flex items-center gap-1 hover:text-primary">Or search<span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span></Link>
          </div>

          {/* Suggestions */}
          <div className="mt-12">
            <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mb-3">Maybe you meant —</div>
            <div className="flex flex-wrap gap-2">
              <Link to="/product-detail" className="chip bg-white border border-outline-variant hover:border-primary hover:text-primary">ErgoFlex Pro Mesh</Link>
              <Link to="/spaces" className="chip bg-white border border-outline-variant hover:border-primary hover:text-primary">Wood Modern space</Link>
              <Link to="/styles" className="chip bg-white border border-outline-variant hover:border-primary hover:text-primary">Our Taste</Link>
              <Link to="/account" className="chip bg-white border border-outline-variant hover:border-primary hover:text-primary">My account</Link>
            </div>
          </div>
        </div>

        {/* Right: visual */}
        <div className="col-span-6 relative h-[520px]">
          {/* Floating cards */}
          <div className="absolute top-4 left-12 w-52 ph-walnut rounded-xl shadow-ambient aspect-square tilt-l float" />
          <div className="absolute top-20 right-10 w-44 ph-charcoal rounded-xl shadow-ambient aspect-square tilt-r float-2 grid place-items-center">
            <svg width="60%" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="#ba0a0d" strokeWidth="2"/>
              <line x1="30" y1="30" x2="70" y2="70" stroke="#ba0a0d" strokeWidth="4" strokeLinecap="round"/>
              <line x1="70" y1="30" x2="30" y2="70" stroke="#ba0a0d" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="absolute bottom-12 left-24 w-56 bg-white rounded-xl shadow-ambient p-5">
            <div className="text-xs font-bold uppercase tracking-widest-2 text-primary">Missing</div>
            <div className="font-black text-xl mt-1">URL not found</div>
            <div className="text-xs text-on-surface-variant mt-2 font-mono break-all">/the/page/you/wanted</div>
            <div className="mt-4 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full w-2/3 btn-grad rounded-full" /></div>
          </div>
          <div className="absolute bottom-24 right-4 w-40 ph-cream rounded-xl shadow-ambient aspect-square tilt-l float" />

          {/* Big numeric */}
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-[260px] font-black text-primary/10 leading-none">404</div>
          </div>
        </div>
      </section>

      <style>{`
        .tilt-l{transform:rotate(-6deg);}
        .tilt-r{transform:rotate(4deg);}
        .float{animation:f 6s ease-in-out infinite;}
        @keyframes f{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .float-2{animation:f 8s ease-in-out infinite;animation-delay:-2s;}
        .dot-grid-bg{background-image:radial-gradient(rgba(28,27,27,.08) 1px,transparent 1.5px);background-size:24px 24px;}
      `}</style>
    </div>
  )
}
