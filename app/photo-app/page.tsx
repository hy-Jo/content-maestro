export default function PhotoApp() {
  return (
    <div className="mx-auto max-w-md bg-white min-h-screen" style={{ boxShadow: '0 0 50px rgba(0, 0, 0, 0.1)' }}>
      <div className="h-screen bg-white relative">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-4 py-2 bg-white">
          <span className="text-sm font-semibold">9:27</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-2 border border-black rounded-sm">
              <div className="w-3 h-1 bg-black rounded-sm ml-0.5 mt-0.5"></div>
            </div>
            <div className="w-3 h-3 rounded-full border border-black"></div>
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-black"></div>
              <div className="w-1 h-2 bg-black"></div>
              <div className="w-1 h-1 bg-black"></div>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="p-6 space-y-6 pb-20">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full"></div>
            
            <div>
              <h2 className="text-4xl font-light mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Jane
              </h2>
              <p className="text-sm font-black">San francisco, ca</p>
            </div>
            
            <div className="space-y-2">
              <button className="w-full h-12 bg-black text-white rounded">
                follow jane
              </button>
              <button className="w-full h-12 border border-black bg-transparent text-black rounded">
                message
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="aspect-[3/4] bg-gradient-to-br from-purple-400 to-pink-400 rounded"></div>
            <div className="aspect-[3/5] bg-gradient-to-br from-blue-400 to-teal-400 rounded"></div>
            <div className="aspect-[3/5] bg-gradient-to-br from-green-400 to-blue-400 rounded"></div>
            <div className="aspect-[3/4] bg-gradient-to-br from-orange-400 to-red-400 rounded"></div>
            <div className="aspect-[3/5] bg-gradient-to-br from-pink-400 to-purple-400 rounded"></div>
            <div className="aspect-[3/4] bg-gradient-to-br from-yellow-400 to-orange-400 rounded"></div>
          </div>
          
          <button className="w-full h-12 border border-black bg-transparent text-black rounded">
            see more
          </button>
        </div>
        
        {/* Tab Bar */}
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around py-3">
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 bg-black rounded"></div>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 bg-gray-600 rounded"></div>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-12 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded"></div>
            </div>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 bg-gray-600 rounded"></div>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 bg-gray-600 rounded"></div>
          </button>
        </div>
      </div>
    </div>
  )
} 