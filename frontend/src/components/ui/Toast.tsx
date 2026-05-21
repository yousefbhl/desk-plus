import { useUiStore } from '../../store/uiStore'

export default function ToastContainer() {
  const { toast, clearToast } = useUiStore()

  if (!toast) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[260px] max-w-[360px]
          ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-800' : toast.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
          {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
        </span>
        <span className="flex-1">{toast.message}</span>
        <button
          onClick={clearToast}
          className="opacity-70 hover:opacity-100 ml-1"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
        </button>
      </div>
    </div>
  )
}
