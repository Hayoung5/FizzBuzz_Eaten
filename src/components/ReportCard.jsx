const ReportCard = ({ report }) => {
  const ratioLabels = ['칼로리', '단백질', '당분', '탄수화물', '나트륨']
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-3">식사 패턴 분석</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          {report.meal_pattern}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-3">가공식품 & 간식 비율</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          {report.processed_snack_ratio}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-3">권장량 대비 섭취 비율</h3>
        <div className="space-y-2">
          {ratioLabels.map((label, index) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className={`h-2 rounded-full ${
                      report.ratio[index] > 100 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(report.ratio[index], 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{report.ratio[index]}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReportCard