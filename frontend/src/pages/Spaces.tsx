import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { catalogApi } from '../api'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import type { Space } from '../types'

const PH: Record<string, string> = { dev: 'ph-dark', art: 'ph-creative', wood: 'ph-walnut', school: 'ph-edu', doctor: 'ph-med', commerce: 'ph-corp' }
const getph = (slug: string) => Object.entries(PH).find(([k]) => slug.includes(k))?.[1] ?? 'ph-warm'

export default function Spaces() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const { addItem } = useCartStore()
  const { show }    = useToastStore()

  const { data: spaces, isLoading } = useQuery({
    queryKey: ['spaces', 'all'],
    queryFn: () => catalogApi.spaces().then((r) => r.data),
  })

  const handleAddProduct = async (productId: number) => {
    try { await addItem(productId); show('Added to cart!', 'success') }
    catch { show('Sign in to add to cart', 'error') }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-screen-2xl mx-auto px-8">
          <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-3">Complete Environments</p>
          <h1 className="h-display text-6xl mb-6">EXPLORE COMPLETE SPACES</h1>
          <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
            Every piece, every detail — curated for your environment. From dev studios to executive offices.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-screen-2xl mx-auto px-8 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((n) => <div key={n} className="skeleton aspect-[4/5] rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {((spaces as Space[]) ?? []).map((s) => (
              <div key={s.id}>
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient card-hover">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    {s.cover_image
                      ? <img src={s.cover_image} alt={s.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      : <div className={`w-full h-full ${getph(s.slug)}`} />
                    }
                    {s.layout_type && (
                      <span className="absolute top-3 right-3 chip bg-surface-container-lowest/90 text-on-surface backdrop-blur-sm uppercase text-[10px]">
                        {s.layout_type.replace('-', ' ')}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="h-display text-xl mb-2">{s.name}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 mb-4">{s.description}</p>
                    {s.total_price && (
                      <p className="font-black text-primary mb-4">From {s.total_price.toLocaleString()} MAD</p>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                        className="flex-1 btn-grad py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                      >
                        {expanded === s.id ? 'Close' : 'Explore Space'}
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                          {expanded === s.id ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded === s.id && s.products && (
                  <div className="mt-2 bg-surface-container-lowest rounded-xl shadow-ambient p-6 animate-fade-up">
                    <p className="text-xs font-bold uppercase tracking-widest-2 mb-4">Included Products</p>
                    <div className="space-y-3">
                      {s.products.map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-4 py-2 border-b border-outline-variant/40 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-container" />
                            <div>
                              <p className="text-sm font-medium">{p.name}</p>
                              <p className="text-xs text-on-surface-variant">{p.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <p className="text-sm font-bold">{p.price.toLocaleString()} MAD</p>
                            <button
                              onClick={() => handleAddProduct(p.id)}
                              className="btn-grad w-8 h-8 rounded-lg grid place-items-center"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 px-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="h-display text-4xl text-white mb-2">CAN'T FIND YOUR PERFECT SPACE?</h2>
            <p className="text-white/70">We'll design a custom workspace tailored to your team's exact needs.</p>
          </div>
          <Link to="/products" className="bg-white text-primary font-bold px-8 py-4 rounded-xl whitespace-nowrap hover:bg-surface transition-colors">
            Request Custom Space →
          </Link>
        </div>
      </section>
    </div>
  )
}
