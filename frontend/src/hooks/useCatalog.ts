import { useQuery } from '@tanstack/react-query'
import { catalogApi } from '../api'
import type { Category, Taste, Space } from '../types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => catalogApi.categories().then((r) => (r.data?.data ?? r.data) as Category[]),
  })
}

export function useTastes() {
  return useQuery({
    queryKey: ['tastes'],
    queryFn: () => catalogApi.tastes().then((r) => (r.data?.data ?? r.data) as Taste[]),
  })
}

export function useSpaces(featured?: boolean) {
  return useQuery({
    queryKey: ['spaces', { featured }],
    queryFn: () => catalogApi.spaces(featured).then((r) => (r.data?.data ?? r.data) as Space[]),
  })
}

export function useSpace(slug: string) {
  return useQuery({
    queryKey: ['space', slug],
    queryFn: () => catalogApi.showSpace(slug).then((r) => (r.data?.data ?? r.data) as Space),
    enabled: !!slug,
  })
}
