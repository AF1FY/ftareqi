export default function PerformanceCard({ isDark }: { isDark: boolean }) {
  return (
    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-900/30 relative overflow-hidden group border border-blue-500">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/15 transition-colors duration-500"></div>
      
      <div className="relative z-10">
        <h3 className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-6">
          Performance
        </h3>
        
        <div className="space-y-6">
          <div>
            <p className="text-3xl font-bold">1,245</p>
            <p className="text-sm text-blue-200 font-medium">Total Trips Completed</p>
          </div>
          
          <div className="w-full h-px bg-white/20"></div>
          
          <div>
            <p className="text-3xl font-bold">98%</p>
            <p className="text-sm text-blue-200 font-medium">Acceptance Rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
