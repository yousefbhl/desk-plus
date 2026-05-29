import { useState } from 'react'
import { Link } from 'react-router-dom'

const QUIZ_QUESTIONS = [
  { q: 'What best describes your work?', options: [{ label: 'Deep focus', desc: 'Writing, coding, analysis', bg: 'ph-dark' }, { label: 'Meetings & calls', desc: 'Client-facing, conferences', bg: 'ph-corp' }, { label: 'Creative making', desc: 'Design, art, prototyping', bg: 'ph-creative' }] },
  { q: 'Which palette feels right?', options: [{ label: 'Earth & wood', desc: 'Warm browns, brass', bg: 'ph-walnut' }, { label: 'All white', desc: 'Cream, bone, fog', bg: '' }, { label: 'Black & accent', desc: 'Charcoal + signal red', bg: 'ph-dark' }] },
  { q: 'Pick a vibe word.', options: [{ label: 'Minimal', desc: 'Less is more', bg: 'ph-charcoal' }, { label: 'Warm', desc: 'Inviting, cozy', bg: 'ph-warm' }, { label: 'Industrial', desc: 'Raw, honest', bg: 'ph-wood' }] },
] as const

export default function Styles() {
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  return (
    <div>
      {/* Hero */}
      <section className="bg-surface">
        <div className="max-w-screen-2xl mx-auto px-8 py-20 text-center">
          <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-3">Our taste</p>
          <h1 className="h-display text-7xl wipe">Seven philosophies.<br/><span className="italic font-light normal-case tracking-tight">one perfect workspace.</span></h1>
          <div className="w-20 h-[3px] bg-primary mx-auto mt-8"></div>
          <p className="mt-6 italic text-on-surface-variant max-w-xl mx-auto">From Japanese minimalism to industrial hacker aesthetics — find the DNA of your space.</p>
        </div>
      </section>

      {/* Featured: KENDO */}
      <section className="max-w-screen-2xl mx-auto px-8 pb-12">
        <div className="grid grid-cols-12 rounded-xl overflow-hidden shadow-ambient bg-surface-container-lowest">
          <div className="col-span-7 ph-charcoal relative min-h-[480px]">
            <div className="absolute inset-0 bgimg ph-charcoal bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&q=85&auto=format&fit=crop')" }}></div>
              <div className="absolute inset-0 bg-black/30"></div>
            {/* Asian-inspired motif */}
            <svg className="absolute inset-0 m-auto w-2/3 opacity-90" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="78" stroke="#ba0a0d" strokeWidth="3"/>
              <path d="M50 80 L150 80 M50 120 L150 120" stroke="#fff" strokeWidth="2"/>
              <rect x="85" y="60" width="30" height="80" fill="#ba0a0d"/>
            </svg>
            <div className="absolute top-6 left-6 chip btn-grad uppercase tracking-widest-2">Featured</div>
          </div>
          <div className="col-span-5 p-12 flex flex-col justify-center">
            <div className="text-xs text-primary font-bold uppercase tracking-widest-2">01 / Featured</div>
            <h2 className="h-display text-6xl mt-4 leading-none">Kendo</h2>
            <p className="italic text-on-surface-variant mt-3 text-lg">Power. Precision. Structure.</p>
            <p className="mt-6 text-on-surface-variant leading-relaxed">A study in restraint — black-on-black surfaces, a single red accent, and the discipline of Japanese spatial geometry. Built for thinkers who consider the room a tool.</p>
            <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>crop_din</span> Geometric forms</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>contrast</span> High contrast</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>brightness_3</span> Matte surfaces</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>format_paint</span> Single accent</div>
            </div>
            <div className="mt-8 flex gap-3">
              <Link to="/products?taste=kendo" className="btn-grad text-white font-bold px-6 py-3.5 rounded-xl uppercase tracking-widest-2 text-sm">Shop Kendo Collection</Link>
              <Link to="/products?taste=kendo" className="border border-outline-variant font-semibold px-5 py-3.5 rounded-xl text-sm">View all 24 products</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Style grid */}
      <section className="max-w-screen-2xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Coco */}
          <Link to="/products?taste=coco" className="style-card relative rounded-xl overflow-hidden block group">
            <div className="absolute inset-0 ph-cream bgimg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=85&auto=format&fit=crop')" }}></div>
            <div className="absolute inset-0 overlay"></div>
            <div className="relative h-full p-6 flex flex-col justify-end text-white">
              <div className="italic text-white/80 text-xs uppercase tracking-widest-2">02 · Soft</div>
              <div className="h-display text-3xl">Coco</div>
              <div className="italic text-white/80">Warm. Tactile. Cocooning.</div>
              <span className="mt-4 self-start chip btn-grad font-bold uppercase tracking-widest-2 opacity-0 group-hover:opacity-100 transition">Explore →</span>
            </div>
          </Link>
          {/* Woody */}
          <Link to="/products?taste=woody" className="style-card relative rounded-xl overflow-hidden block group">
            <div className="absolute inset-0 ph-walnut bgimg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=85&auto=format&fit=crop')" }}></div>
            <div className="absolute inset-0 overlay"></div>
            <div className="relative h-full p-6 flex flex-col justify-end text-white">
              <div className="italic text-white/80 text-xs uppercase tracking-widest-2">03 · Organic</div>
              <div className="h-display text-3xl">Woody</div>
              <div className="italic text-white/80">Grain. Weight. Honesty.</div>
              <span className="mt-4 self-start chip btn-grad font-bold uppercase tracking-widest-2 opacity-0 group-hover:opacity-100 transition">Explore →</span>
            </div>
          </Link>
          {/* White */}
          <Link to="/products?taste=white" className="style-card relative rounded-xl overflow-hidden block group">
            <div className="absolute inset-0 bgimg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85&auto=format&fit=crop')" }}></div>
            <div className="absolute inset-0 overlay" style={{background:'linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.45))'}}></div>
            <div className="relative h-full p-6 flex flex-col justify-end text-white">
              <div className="italic text-white/80 text-xs uppercase tracking-widest-2">04 · Pure</div>
              <div className="h-display text-3xl drop-shadow">White</div>
              <div className="italic text-white/80">Light. Air. Quiet.</div>
              <span className="mt-4 self-start chip btn-grad font-bold uppercase tracking-widest-2 opacity-0 group-hover:opacity-100 transition">Explore →</span>
            </div>
          </Link>
          {/* Hacker */}
          <Link to="/products?taste=hacker" className="style-card relative rounded-xl overflow-hidden block group">
            <div className="absolute inset-0 ph-dark bgimg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547082299-de196ea013d6?w=900&q=85&auto=format&fit=crop')" }}></div>
            <div className="absolute inset-0 overlay"></div>
            <div className="absolute top-4 right-4 chip btn-grad uppercase tracking-widest-2 z-10">New</div>
            <div className="relative h-full p-6 flex flex-col justify-end text-white">
              <div className="italic text-white/80 text-xs uppercase tracking-widest-2">05 · Industrial</div>
              <div className="h-display text-3xl">Hacker</div>
              <div className="italic text-white/80">Cable. Steel. Glow.</div>
              <span className="mt-4 self-start chip btn-grad font-bold uppercase tracking-widest-2 opacity-0 group-hover:opacity-100 transition">Explore →</span>
            </div>
          </Link>
          {/* Economie */}
          <Link to="/products?taste=economie" className="style-card relative rounded-xl overflow-hidden block group">
            <div className="absolute inset-0 ph-wood bgimg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542330952-bffc55e812b2?w=900&q=85&auto=format&fit=crop')" }}></div>
            <div className="absolute inset-0 overlay"></div>
            <div className="relative h-full p-6 flex flex-col justify-end text-white">
              <div className="italic text-white/80 text-xs uppercase tracking-widest-2">06 · Honest</div>
              <div className="h-display text-3xl">Économie</div>
              <div className="italic text-white/80">Function. Frame. Form.</div>
              <span className="mt-4 self-start chip btn-grad font-bold uppercase tracking-widest-2 opacity-0 group-hover:opacity-100 transition">Explore →</span>
            </div>
          </Link>
          {/* Atelier */}
          <Link to="/products?taste=atelier" className="style-card relative rounded-xl overflow-hidden block group">
            <div className="absolute inset-0 ph-warm bgimg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=900&q=85&auto=format&fit=crop')" }}></div>
            <div className="absolute inset-0 overlay"></div>
            <div className="relative h-full p-6 flex flex-col justify-end text-white">
              <div className="italic text-white/80 text-xs uppercase tracking-widest-2">07 · Artisan</div>
              <div className="h-display text-3xl">Atelier</div>
              <div className="italic text-white/80">Patina. Brass. Hand.</div>
              <span className="mt-4 self-start chip btn-grad font-bold uppercase tracking-widest-2 opacity-0 group-hover:opacity-100 transition">Explore →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Quiz */}
      <section className="bg-surface-container-low mt-12">
        <div className="max-w-screen-2xl mx-auto px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-3">Quiz</p>
            <h2 className="h-display text-4xl">Not sure which style is you?</h2>
            <p className="text-on-surface-variant mt-2">Three quick questions. We'll match you to a taste.</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-ambient max-w-4xl mx-auto">
            {quizStep < QUIZ_QUESTIONS.length ? (
              <>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest-2 mb-2"><span className="text-primary">Question {quizStep + 1} of {QUIZ_QUESTIONS.length}</span><span className="text-on-surface-variant">— {QUIZ_QUESTIONS[quizStep].q}</span></div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-8"><div className="h-full btn-grad" style={{ width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}></div></div>
                <div className="grid grid-cols-3 gap-4">
                  {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                    <button key={i} onClick={() => setQuizAnswers(prev => { const next = [...prev]; next[quizStep] = i; return next })} className={`rounded-xl overflow-hidden group ${quizAnswers[quizStep] === i ? 'ring-2 ring-primary' : ''}`}>
                      <div className={`aspect-[4/3] ${opt.bg}`} style={!opt.bg ? { background: 'linear-gradient(135deg,#fff,#e5e2e1)' } : undefined}></div>
                      <div className="bg-surface-container-lowest p-3 text-left"><div className="font-bold text-sm">{opt.label}</div><div className="text-xs text-on-surface-variant">{opt.desc}</div></div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setQuizStep(s => Math.max(0, s - 1))} className={`text-sm font-semibold text-on-surface-variant ${quizStep === 0 ? 'opacity-40' : ''}`}>← Back</button>
                  <button onClick={() => { if (quizAnswers[quizStep] != null) setQuizStep(s => s + 1) }} className={`btn-grad text-white font-bold px-6 py-3 rounded-xl uppercase tracking-widest-2 text-sm ${quizAnswers[quizStep] == null ? 'opacity-50' : ''}`}>{quizStep === QUIZ_QUESTIONS.length - 1 ? 'See result' : 'Next →'}</button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 48 }}>auto_awesome</span>
                <h3 className="h-display text-2xl mt-3">Your match: <span className="text-primary">{['Kendo', 'Coco', 'Woody'][quizAnswers[0] ?? 0]}</span></h3>
                <p className="text-on-surface-variant mt-2">Based on your answers, this style matches your workspace philosophy.</p>
                <div className="mt-5 flex justify-center gap-3">
                  <Link to={`/products?taste=${['kendo', 'coco', 'woody'][quizAnswers[0] ?? 0]}`} className="btn-grad text-white font-bold px-6 py-3 rounded-xl uppercase tracking-widest-2 text-sm">Shop this style</Link>
                  <button onClick={() => { setQuizStep(0); setQuizAnswers([]) }} className="border border-outline-variant font-semibold px-5 py-3 rounded-xl text-sm">Retake quiz</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Side drawer preview */}
      <section className="max-w-screen-2xl mx-auto px-8 py-16">
        <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mb-3">Style drawer (preview)</div>
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-ambient grid grid-cols-12 gap-8 items-center">
          <div className="col-span-4 ph-walnut aspect-square rounded-xl bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594620302200-9a762244a156?w=900&q=85&auto=format&fit=crop')" }}></div>
          <div className="col-span-5">
            <div className="text-xs font-bold uppercase tracking-widest-2 text-primary">Woody</div>
            <h3 className="h-display text-4xl mt-2">Grain. Weight. Honesty.</h3>
            <p className="text-on-surface-variant mt-3">Solid timber and visible joinery. Woody is for studios that want their workspace to age — and to look better doing it.</p>
            <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>forest</span> Solid hardwood</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>handyman</span> Visible joinery</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>water_drop</span> Hand-rubbed oil</div>
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>eco</span> FSC certified</div>
            </div>
          </div>
          <div className="col-span-3 flex flex-col gap-3">
            <Link to="/products?taste=woody" className="btn-grad text-white font-bold py-3 rounded-xl uppercase tracking-widest-2 text-sm text-center">Shop this style</Link>
            <Link to="/products?taste=woody" className="border border-outline-variant font-semibold py-3 rounded-xl text-sm text-center">View all 18 products</Link>
          </div>
        </div>
      </section>

      <style>{`
@keyframes wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
.wipe{animation:wipe 1.2s cubic-bezier(.65,.05,.36,1) both;}
.style-card{aspect-ratio:1/1.05;}
.style-card .overlay{background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.75));}
.style-card:hover img,.style-card:hover .ph,.style-card:hover .ph-walnut,.style-card:hover .ph-charcoal,.style-card:hover .ph-creative,.style-card:hover .ph-corp,.style-card:hover .ph-cream,.style-card:hover .ph-wood,.style-card:hover .ph-warm{transform:scale(1.06);}
.style-card .bgimg{transition:transform .8s cubic-bezier(.2,.7,.2,1);}
      `}</style>
    </div>
  )
}
