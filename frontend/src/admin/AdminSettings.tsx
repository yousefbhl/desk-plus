import { FormEvent, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AppSettings } from '../types'
import { useAdminSettings, useUpdateAdminSettings } from '../hooks/useAdmin'
import { useToastStore } from '../store/toastStore'

const DEFAULT_SETTINGS: AppSettings = {
  brand_name: 'Souk',
  primary_color: '#00C853',
  secondary_surface: '#050505',
  facebook_url: 'https://facebook.com/souk',
  instagram_name: '@souk',
  instagram_url: 'https://instagram.com/souk',
  tiktok_url: 'https://tiktok.com/@souk',
  support_email: 'support@souk.ma',
  sales_email: 'sales@souk.ma',
  phone: '+212 5XX-XXXXXX',
  dark_luxury_theme: true,
  promo_banner: true,
  customer_reviews: true,
  guest_checkout: false,
}

function Field({
  label,
  icon,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  icon?: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-on-surface-variant">{label}</span>
      <div className="mt-2 h-11 rounded-xl border border-outline-variant bg-white shadow-sm flex items-center gap-2 px-3 focus-within:border-primary">
        {icon && <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  )
}

function Toggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="rounded-xl border border-outline-variant p-4 flex items-center gap-4 cursor-pointer bg-white">
      <span className="flex-1">
        <span className="block font-bold">{title}</span>
        <span className="block text-sm text-on-surface-variant mt-1 leading-relaxed">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span className={`w-10 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-[#00C853]' : 'bg-surface-container-high'}`}>
        <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </span>
    </label>
  )
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-xl shadow-soft overflow-hidden">
      <div className="p-6 border-b border-outline-variant">
        <h2 className="h-display text-lg">{title}</h2>
        <p className="text-sm text-on-surface-variant mt-2">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </section>
  )
}

export default function AdminSettings() {
  const { data, isLoading } = useAdminSettings()
  const updateSettings = useUpdateAdminSettings()
  const showToast = useToastStore((s) => s.show)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    if (data) setSettings({ ...DEFAULT_SETTINGS, ...data })
  }, [data])

  const setValue = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    updateSettings.mutate(settings, {
      onSuccess: (saved) => {
        setSettings({ ...DEFAULT_SETTINGS, ...saved })
        showToast('Settings saved.', 'success')
      },
      onError: () => showToast('Could not save settings.', 'error'),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h-display text-3xl">Settings</h1>
          <p className="text-sm text-on-surface-variant mt-1">Change storefront names, social links, contact details, and display toggles.</p>
        </div>
        <button
          type="submit"
          disabled={updateSettings.isPending}
          className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2 disabled:opacity-60"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
          {updateSettings.isPending ? 'Saving' : 'Save'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Identite de la marque" subtitle="Nom, couleurs, et elements principaux affiches sur la vitrine.">
          <div className="space-y-4">
            <Field label="Nom de la marque" value={settings.brand_name} onChange={(value) => setValue('brand_name', value)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Couleur principale" icon="palette" value={settings.primary_color} onChange={(value) => setValue('primary_color', value)} />
              <Field label="Surface secondaire" icon="tune" value={settings.secondary_surface} onChange={(value) => setValue('secondary_surface', value)} />
            </div>
          </div>
        </Card>

        <Card title="Reseaux sociaux" subtitle="Liens et noms affiches dans la vitrine publique.">
          <div className="space-y-4">
            <Field label="Facebook" icon="language" value={settings.facebook_url ?? ''} onChange={(value) => setValue('facebook_url', value)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nom Instagram" icon="alternate_email" value={settings.instagram_name ?? ''} onChange={(value) => setValue('instagram_name', value)} />
              <Field label="Instagram" icon="language" value={settings.instagram_url ?? ''} onChange={(value) => setValue('instagram_url', value)} />
            </div>
            <Field label="TikTok" icon="language" value={settings.tiktok_url ?? ''} onChange={(value) => setValue('tiktok_url', value)} />
          </div>
        </Card>

        <Card title="Parametres de contact" subtitle="Details de support principal affiches aux clients.">
          <div className="space-y-4">
            <Field label="E-mail de support" value={settings.support_email} onChange={(value) => setValue('support_email', value)} type="email" />
            <Field label="E-mail des ventes" value={settings.sales_email} onChange={(value) => setValue('sales_email', value)} type="email" />
            <Field label="Telephone" icon="call" value={settings.phone} onChange={(value) => setValue('phone', value)} />
          </div>
        </Card>

        <Card title="Controles de la vitrine" subtitle="Ces bascules persistent via le point de terminaison des parametres admin.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toggle title="Theme sombre de luxe" description="Forcer le mode sombre premium dans l'administration." checked={settings.dark_luxury_theme} onChange={(value) => setValue('dark_luxury_theme', value)} />
            <Toggle title="Banniere promo" description="Afficher les promotions en direct sur la page d'accueil." checked={settings.promo_banner} onChange={(value) => setValue('promo_banner', value)} />
            <Toggle title="Avis clients" description="Afficher les avis valides publiquement." checked={settings.customer_reviews} onChange={(value) => setValue('customer_reviews', value)} />
            <Toggle title="Paiement invite" description="Autoriser le paiement sans inscription." checked={settings.guest_checkout} onChange={(value) => setValue('guest_checkout', value)} />
          </div>
        </Card>
      </div>
    </form>
  )
}
