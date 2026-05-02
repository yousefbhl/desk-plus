import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { fetchProduct } from '../api/products'

export default function ProductDetail() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(String(id)),
  })

  if (isLoading) {
    return <p>Loading product...</p>
  }

  return (
    <article>
      <h1>{data?.name ?? 'Product'}</h1>
      <p>{data?.description}</p>
      <strong>${Number(data?.price ?? 0).toFixed(2)}</strong>
    </article>
  )
}
