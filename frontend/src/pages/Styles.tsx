import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { catalogApi } from '../api'
import type { Taste } from '../types'

const PH_BY_NAME: Record<string, string> = {
  kendo: 'ph-dark', coco: 'ph-cream', woody: 'ph-walnut', white: 'ph', hacker: 'ph-charcoal', cool: 'ph-mesh', economie: 'ph-corp'
}

export default function Styles() {
  const [selected, setSelected] = useState<Taste | null>(null)

  const { data: tastes, isLoading } = useQuery({
    queryKey: ['tastes'],
    queryFn: () => catalogApi.tastes().then((r) => r.data),
  })

  const list = (tastes as Taste[]) ?? []

  const getPh = (name: string) =>
    PH_BY_NAME[name.toLowerCase()] ?? PH_BY_NAME[Object.keys(PH_BY_NAME).find((k) => name.toLowerCase().includes(k)) ?? ''] ?? 'ph-warm'

  return (
    <div>
      {/* Hero */}
      <section className="py-24 text-center bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-8">
          <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-4">Design Philosophy</p>
          <h1 className="h-display text-7xl mb-4">OUR TASTE</h1>
          <div className="w-20 h-0.5 bg-primary mx-auto mb-6" />
          <p className="text-xl text-on-surface-variant max-w-xl mx-auto leading-relaxed italic">
            Seven design philosophies. One perfect workspace.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-screen-2xl mx-auto px-8 py-20">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((n) => <div key={n} className="skeleton aspect-square rounded-xl" />)}
          </div>
        ) : (
          <>
            {/* Featured (first one) */}
            {list[0] && (
              <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-ambient mb-10">
                <div className={`h-80 lg:h-auto ${getPh(list[0].name)}`} />
                <div className="bg-surface-container-lowest p-12 flex flex-col justify-center">
                  <span className="chip bg-primary/10 text-primary mb-4 w-fit">Featured</span>
                  <h2 className="h-display text-5xl mb-4">{list[0].name.toUpperCase()}</h2>
                  <p className="text-on-surface-variant leading-relaxed mb-6">{list[0].description}</p>
                  <Link to={`/products?taste_id=${list[0].id}`} className="btn-grad inline-block px-8 py-3.5 rounded-xl font-bold text-sm w-fit">
                    Shop {list[0].name} Collection →
                  </Link>
                </div>
              </div>
            )}

            {/* Remaining cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {list.slice(1).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(selected?.id === t.id ? null : t)}
                  className={`group relative rounded-xl overflow-hidden aspect-square transition-all ${selected?.id === t.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  <div className={`absolute inset-0 ${getPh(t.name)} transition-transform duration-700 group-hover:scale-110`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-black text-xl text-white uppercase">{t.name}</p>
                    {t.description && <p className="text-white/70 text-xs mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">{t.description}</p>}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 p-4">
                    <span className="bg-white text-on-surface text-xs font-bold px-4 py-2 rounded-lg block text-center">Explore</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="mt-8 bg-surface-container-lowest rounded-2xl shadow-ambient p-8 animate-fade-up flex flex-col md:flex-row gap-8 items-start">
                <div className={`w-32 h-32 rounded-xl shrink-0 ${getPh(selected.name)}`} />
                <div className="flex-1">
                  <h3 className="h-display text-3xl mb-2">{selected.name.toUpperCase()}</h3>
                  <p className="text-on-surface-variant leading-relaxed mb-5">{selected.description ?? 'A curated design style for your workspace.'}</p>
                  <div className="flex gap-3">
                    <Link to={`/products?taste_id=${selected.id}`} className="btn-grad px-6 py-2.5 rounded-xl font-bold text-sm">
                      Shop This Style
                    </Link>
                    <button onClick={() => setSelected(null)} className="px-6 py-2.5 rounded-xl font-bold text-sm border-2 border-outline-variant hover:bg-surface-container-high transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
