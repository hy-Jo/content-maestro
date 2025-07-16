'use client'

import { useState } from 'react'

export default function PhotoApp() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'profile' | 'search'>('welcome')

  const StatusBar = () => (
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
  )

  const TabBar = ({ activeTab }: { activeTab?: string }) => (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around py-3">
      <button 
        className="flex flex-col items-center space-y-1"
        onClick={() => setCurrentScreen('profile')}
      >
        <div className={`w-5 h-5 ${activeTab === 'profile' ? 'bg-black' : 'bg-gray-600'} rounded`}></div>
      </button>
      <button 
        className="flex flex-col items-center space-y-1"
        onClick={() => setCurrentScreen('search')}
      >
        <div className={`w-5 h-5 ${activeTab === 'search' ? 'bg-black' : 'bg-gray-600'} rounded`}></div>
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
  )

  const WelcomeScreen = () => (
    <div className="relative h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-blue-200 overflow-hidden">
      <StatusBar />
      
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg"></div>
            <h1 className="text-5xl font-light text-gray-800" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              photo
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 mt-20">
            <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
            <div>
              <p className="text-sm font-bold">Pawel Czerwinski</p>
              <p className="text-xs text-gray-600">@pawel_czerwinski</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <button 
              className="flex-1 h-12 border border-black bg-transparent text-black rounded"
              onClick={() => setCurrentScreen('profile')}
            >
              log in
            </button>
            <button 
              className="flex-1 h-12 bg-black text-white rounded"
              onClick={() => setCurrentScreen('profile')}
            >
              register
            </button>
          </div>
          
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-black rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )

  const ProfileScreen = () => (
    <div className="h-screen bg-white relative">
      <StatusBar />
      
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
      
      <TabBar activeTab="profile" />
    </div>
  )

  const SearchScreen = () => (
    <div className="h-screen bg-white relative">
      <StatusBar />
      
      <div className="p-6 space-y-6">
        <h1 className="text-4xl font-light" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          Search
        </h1>
        
        <div className="relative">
          <input 
            placeholder="Search all photos"
            className="w-full h-12 border border-black pl-4 rounded"
          />
          <div className="absolute right-3 top-3 w-5 h-5 bg-gray-400 rounded"></div>
        </div>
      </div>
      
      <TabBar activeTab="search" />
    </div>
  )

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />
      case 'profile':
        return <ProfileScreen />
      case 'search':
        return <SearchScreen />
      default:
        return <WelcomeScreen />
    }
  }

  return (
    <div className="mx-auto max-w-md bg-white min-h-screen" style={{ boxShadow: '0 0 50px rgba(0, 0, 0, 0.1)' }}>
      {renderScreen()}
    </div>
  )
} 