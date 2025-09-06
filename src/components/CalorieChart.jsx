import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts'

const CalorieChart = ({ data }) => {
  const chartData = data.cal_log.map((cal, index) => ({
    day: `${index + 1}일`,
    섭취량: cal,
    권장량: data.reco_cal
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Bar dataKey="섭취량" fill="#22c55e" />
          <ReferenceLine y={data.reco_cal} stroke="#ef4444" strokeDasharray="5 5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CalorieChart