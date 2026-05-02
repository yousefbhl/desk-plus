import { lazy, Suspense } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

export default function SplineHero() {
  return (
    <Suspense fallback={<div className="panel">Loading hero scene...</div>}>
      <div className="panel">
        <Spline scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode" />
      </div>
    </Suspense>
  )
}
