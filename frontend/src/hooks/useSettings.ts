import { useQuery } from '@tanstack/react-query'
import { settingsApi } from '../api'

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })
}
