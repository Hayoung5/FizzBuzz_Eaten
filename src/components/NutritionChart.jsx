import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts'

const NutritionChart = ({ data }) => {
  const chartData = data.cal_log.map((cal, index) => ({
    day: `${index + 1}일`,
    칼로리: cal,
    탄수화물: data.carbo_log[index],
    단백질: data.protein_log[index],
    지방: data.fat_log[index]
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Legend />
          <Line type="monotone" dataKey="칼로리" stroke="#22c55e" strokeWidth={2} />
          <Line type="monotone" dataKey="탄수화물" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="단백질" stroke="#f59e0b" strokeWidth={2} />
          <Line type="monotone" dataKey="지방" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default NutritionChart