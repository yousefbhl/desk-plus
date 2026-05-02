import { useQuery } from '@tanstack/react-query'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../api/api'
import StatCard from '../components/ui/StatCard'

type Stats = {
  total_users: number
  total_sales: number
  monthly: Array<{ month: number; revenue: number }>
}

async function fetchStats(): Promise<Stats> {
  const { data } = await api.get('/api/admin/stats')
  return data
}

export default function Dashboard() {
  const { data } = useQuery({ queryKey: ['stats'], queryFn: fetchStats })

  return (
    <section>
      <h2>Admin Dashboard</h2>
      <div className="grid">
        <StatCard label="Total Users" value={data?.total_users ?? 0} />
        <StatCard label="Total Sales" value={`$${Number(data?.total_sales ?? 0).toFixed(2)}`} />
      </div>
      <div className="panel" style={{ height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data?.monthly ?? []}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#0a7" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
