// src/App.js
import React, { useState, useEffect, useContext } from 'react';
import { 
  Search, 
  Network, 
  Linkedin, 
  Twitter, 
  Github, 
  Instagram,
  Users,
  AlertCircle,
  Moon,
  Sun,
  Palette,
  Music,
  MessageCircle,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from './components/ProfileCard';
import { ThemeContext } from './context/ThemeContext';

// API configuration
const API_URL = 'http://localhost:5000/api';

// Platform definitions
const PLATFORMS = [
  { 
    name: 'LinkedIn', 
    icon: Linkedin, 
    color: '#0077B5',
    apiEndpoint: 'linkedin',
    searchUrl: 'https://www.linkedin.com/in/'
  },
  { 
    name: 'Twitter', 
    icon: Twitter, 
    color: '#1DA1F2',
    apiEndpoint: 'twitter',
    searchUrl: 'https://twitter.com/'
  },
  { 
    name: 'GitHub', 
    icon: Github, 
    color: '#333',
    apiEndpoint: 'github',
    searchUrl: 'https://github.com/'
  },
  { 
    name: 'Instagram', 
    icon: Instagram, 
    color: '#E1306C',
    apiEndpoint: 'instagram',
    searchUrl: 'https://www.instagram.com/'
  },
  { 
    name: 'Reddit', 
    icon: MessageCircle, 
    color: '#FF4500',
    apiEndpoint: 'reddit',
    searchUrl: 'https://www.reddit.com/user/'
  },
  { 
    name: 'TikTok', 
    icon: Video, 
    color: '#000000',
    apiEndpoint: 'tiktok',
    searchUrl: 'https://www.tiktok.com/@'
  },
  { 
    name: 'Spotify', 
    icon: Music, 
    color: '#1DB954',
    apiEndpoint: 'spotify',
    searchUrl: 'https://open.spotify.com/artist/'
  }
];

// Helper function to format numbers
const formatNumber = (num) => {
  if (!num && num !== 0) return 'Unknown';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const App = () => {
  const { theme, toggleTheme, currentTheme } = useContext(ThemeContext);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'unknown', 'online', 'offline'
  const [searchHistory, setSearchHistory] = useState([]);

  // Check if API is online when component mounts
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus('offline');
      }
    };

    checkApiStatus();
    
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse search history from localStorage");
      }
    }
  }, []);

  const performSearch = async () => {
    if (!searchTerm) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      // Determine which platforms to search
      const platformsToSearch = selectedPlatforms.length > 0 
        ? PLATFORMS.filter(p => selectedPlatforms.includes(p.name))
        : PLATFORMS;
      
      const platformParams = platformsToSearch.map(p => p.apiEndpoint).join(',');
      
      // Using the unified search endpoint
      const response = await fetch(`${API_URL}/search/${searchTerm}?platforms=${platformParams}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Format results for display
      const formattedResults = Object.entries(data).map(([key, value]) => {
        const platform = PLATFORMS.find(p => p.apiEndpoint === key);
        
        return {
          platform,
          exists: value.exists,
          profile: value.exists ? value.profile : null,
          params: { username: searchTerm }
        };
      });
      
      setSearchResults(formattedResults);
      
      // Update search history
      const newHistory = [...searchHistory];
      // Remove existing entry if present
      const existingIndex = newHistory.findIndex(item => item.term === searchTerm);
      if (existingIndex !== -1) {
        newHistory.splice(existingIndex, 1);
      }
      // Add to beginning of array
      newHistory.unshift({ 
        term: searchTerm, 
        timestamp: new Date().toISOString(),
        platforms: platformsToSearch.map(p => p.name)
      });
      // Keep only last 10 searches
      if (newHistory.length > 10) {
        newHistory.pop();
      }
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
    } catch (error) {
      console.error('Search error:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setError('Cannot connect to the API server. Make sure the backend is running.');
        setApiStatus('offline');
      } else {
        setError(`Failed to search profiles: ${error.message}`);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'search':
        return (
          <div className="transition duration-300 ease-in-out">
            {apiStatus === 'offline' && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start"
              >
                <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-semibold">API Server Offline</h3>
                  <p className="text-gray-300">
                    The backend API server appears to be offline. Make sure it's running at {API_URL}.
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Refresh Page
                  </button>
                </div>
              </motion.div>
            )}
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <div className="relative flex-grow">
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search username across platforms"
                    className="w-full px-4 py-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition"
                    list="search-history"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  
                  {/* Datalist for search history */}
                  <datalist id="search-history">
                    {searchHistory.map((item, index) => (
                      <option key={index} value={item.term} />
                    ))}
                  </datalist>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  {PLATFORMS.map((platform) => (
                    <motion.button
                      key={platform.name}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedPlatforms(prev => 
                          prev.includes(platform.name)
                            ? prev.filter(p => p !== platform.name)
                            : [...prev, platform.name]
                        );
                      }}
                      className={`p-2 rounded-lg transition duration-300 ${
                        selectedPlatforms.includes(platform.name)
                          ? 'text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      style={{
                        backgroundColor: selectedPlatforms.includes(platform.name) 
                          ? platform.color 
                          : undefined
                      }}
                    >
                      <platform.icon className="w-5 h-5" />
                    </motion.button>
                  ))}
                </div>
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSearching || !searchTerm || apiStatus === 'offline'}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-0"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </motion.button>
              </div>
            </form>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-red-800/60 border border-red-700 text-white rounded-lg"
              >
                {error}
              </motion.div>
            )}
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: currentTheme.primary}}>Search Results</h2>
              
              {isSearching ? (
                <div className="text-center py-12">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"
                  />
                  <p className="mt-4 text-gray-400">Fetching results...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="max-w-2xl mx-auto bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4" style={{color: currentTheme.primary}}>Welcome to MG Nexus Identity Tracker</h3>
                    <p className="text-gray-300 mb-6">
                      Discover digital identities across multiple platforms with a single search.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                      {PLATFORMS.map((platform) => (
                        <div key={platform.name} className="text-center p-3 rounded-lg bg-gray-700">
                          <platform.icon className="mx-auto w-8 h-8 mb-2" style={{color: platform.color}} />
                          <p className="text-sm">{platform.name}</p>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-gray-400 text-sm">
                      Enter a username in the search box above to begin tracking across these platforms.
                    </p>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-gray-700 rounded-lg">
                        <Search className="w-5 h-5 mx-auto mb-2" style={{color: currentTheme.primary}} />
                        <p className="font-medium mb-1">Search Identities</p>
                        <p className="text-gray-400">Find profiles across platforms</p>
                      </div>
                      
                      <div className="p-3 bg-gray-700 rounded-lg">
                        <Network className="w-5 h-5 mx-auto mb-2" style={{color: currentTheme.primary}} />
                        <p className="font-medium mb-1">Analyze Connections</p>
                        <p className="text-gray-400">Discover digital footprints</p>
                      </div>
                      
                      <div className="p-3 bg-gray-700 rounded-lg">
                        <Users className="w-5 h-5 mx-auto mb-2" style={{color: currentTheme.primary}} />
                        <p className="font-medium mb-1">Monitor Changes</p>
                        <p className="text-gray-400">Track profile updates</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((result, index) => (
                    <ProfileCard key={index} result={result} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'monitor':
        return (
          <div className="p-6 bg-gray-800/50 rounded-lg transition duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-4" style={{color: currentTheme.primary}}>Monitor</h2>
            <p className="text-gray-300 mb-4">Track the online presence and engagement metrics of profiles you're monitoring.</p>
            
            {searchHistory.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-200 mt-6 mb-3">Recent Searches</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchHistory.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium">{item.term}</h4>
                          <p className="text-sm text-gray-400">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSearchTerm(item.term);
                            setSelectedPlatforms(item.platforms);
                            setActiveTab('search');
                            setTimeout(() => performSearch(), 100);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-500"
                        >
                          Search Again
                        </motion.button>
                      </div>
                      <div className="flex mt-3">
                        {item.platforms.map((platform) => {
                          const platformObj = PLATFORMS.find(p => p.name === platform);
                          if (!platformObj) return null;
                          
                          const Icon = platformObj.icon;
                          return (
                            <div 
                              key={platform} 
                              className="mr-2" 
                              style={{color: platformObj.color}}
                            >
                              <Icon size={16} />
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent searches to display.</p>
              </div>
            )}
          </div>
        );
      case 'network':
        return (
          <div className="p-6 bg-gray-800/50 rounded-lg transition duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-4" style={{color: currentTheme.primary}}>Network Analysis</h2>
            <p className="text-gray-300 mb-6">Overview of digital footprint across platforms.</p>
            
            {searchResults.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Platform Engagement Chart */}
                  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-medium mb-4">Platform Engagement</h3>
                    <div className="space-y-4">
                      {searchResults.filter(result => result.exists).map((result, index) => {
                        // Calculate engagement score based on metrics
                        let engagementScore = 0;
                        
                        if (result.profile) {
                          if (result.profile.followers) {
                            // Add more weight to platforms with more followers
                            if (result.profile.followers < 1000) engagementScore = 20;
                            else if (result.profile.followers < 10000) engagementScore = 40;
                            else if (result.profile.followers < 100000) engagementScore = 60;
                            else engagementScore = 80;
                          }
                          
                          // Adjust based on other metrics
                          if (result.platform.name === 'GitHub' && result.profile.public_repos > 20) {
                            engagementScore += 20;
                          }
                          
                          if (result.platform.name === 'Twitter' && result.profile.tweets > 1000) {
                            engagementScore += 15;
                          }
                          
                          if (result.platform.name === 'TikTok' && result.profile.likes > 10000) {
                            engagementScore += 25;
                          }
                          
                          // Cap at 100
                          engagementScore = Math.min(engagementScore, 100);
                        }
                        
                        return (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="flex items-center text-sm">
                                <result.platform.icon className="w-4 h-4 mr-2" style={{color: result.platform.color}} />
                                {result.platform.name}
                              </span>
                              <span className="text-sm font-medium">{engagementScore}%</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <motion.div 
                                className="h-2 rounded-full"
                                style={{backgroundColor: result.platform.color, width: `${engagementScore}%`}}
                                initial={{ width: 0 }}
                                animate={{ width: `${engagementScore}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Audience Distribution */}
                  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-medium mb-4">Audience Distribution</h3>
                    <div className="h-64 flex items-end justify-around">
                      {searchResults.filter(result => result.exists && result.profile && result.profile.followers).map((result, index) => {
                        // Calculate relative height based on followers
                        const maxFollowers = Math.max(...searchResults
                          .filter(r => r.exists && r.profile && r.profile.followers)
                          .map(r => r.profile.followers));
                        
                        const heightPercentage = (result.profile.followers / maxFollowers) * 100;
                        
                        return (
                          <div key={index} className="flex flex-col items-center">
                            <motion.div 
                              className="w-16 rounded-t-lg mb-2"
                              style={{
                                backgroundColor: result.platform.color,
                                height: `${heightPercentage}%`,
                                minHeight: '10%'
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPercentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                            <result.platform.icon className="w-5 h-5" style={{color: result.platform.color}} />
                            <p className="text-xs mt-1">{formatNumber(result.profile.followers)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Overall Reach Analysis */}
                <div className="mt-6 bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-medium mb-4">Overall Reach Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-sm text-gray-400 mb-1">Total Followers</h4>
                      <p className="text-2xl font-bold">
                        {formatNumber(
                          searchResults
                            .filter(result => result.exists && result.profile && result.profile.followers)
                            .reduce((sum, result) => sum + result.profile.followers, 0)
                        )}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-sm text-gray-400 mb-1">Platforms Used</h4>
                      <p className="text-2xl font-bold">
                        {searchResults.filter(result => result.exists).length}/{PLATFORMS.length}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-800 rounded-lg">    
                      <h4 className="text-sm text-gray-400 mb-1">Digital Presence Score</h4>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          (searchResults.filter(result => result.exists).length / PLATFORMS.length) * 100
                        )}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Search for a profile first to see network analysis.</p>
              </div>
            )}
          </div>
        );
      case 'timeline':
        return (
          <div className="p-6 bg-gray-800/50 rounded-lg transition duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-4" style={{color: currentTheme.primary}}>Timeline</h2>
            <p className="text-gray-300">View activity across social platforms in chronological order.</p>
            
            <div className="mt-8 text-center py-8 text-gray-500">
              <p>Timeline functionality coming soon.</p>
              <p className="text-sm mt-2">This will display social media activities of tracked profiles in a chronological timeline.</p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 bg-gray-800/50 rounded-lg transition duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-4" style={{color: currentTheme.primary}}>Profile</h2>
            <p className="text-gray-300 mb-6">Manage your account and application preferences.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <h3 className="text-lg font-medium mb-3">Application Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2 text-gray-300">
                      <input type="checkbox" className="rounded bg-gray-600 border-gray-500 text-blue-500" />
                      <span>Enable desktop notifications</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2 text-gray-300">
                      <input type="checkbox" className="rounded bg-gray-600 border-gray-500 text-blue-500" />
                      <span>Dark mode (always on)</span>
                    </label>
                  </div>
                  
                  <div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        localStorage.removeItem('searchHistory');
                        setSearchHistory([]);
                      }}
                      className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-sm"
                    >
                      Clear Search History
                    </motion.button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <h3 className="text-lg font-medium mb-3">API Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">API URL</label>
                    <input 
                      type="text" 
                      value={API_URL}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.reload()}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
                    >
                      Reconnect to API
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <header className="flex flex-col md:flex-row md:justify-between items-center mb-12">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Network className="w-12 h-12" style={{color: currentTheme.primary}} />
            <h1 className="text-4xl font-bold tracking-tight">
              MG Nexus <span style={{color: currentTheme.primary}}>Identity Tracker</span>
            </h1>
          </div>
          <div className="flex items-center">
            <nav className="mr-4">
              <ul className="flex space-x-2">
                {['search', 'monitor', 'timeline', 'network', 'profile'].map((tab) => (
                  <li key={tab}>
                    <motion.button 
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded transition duration-300 ${
                        activeTab === tab ? 'bg-blue-600 text-white' : `${currentTheme.secondary} text-gray-300 hover:bg-gray-600`
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="relative">
              <button 
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                <Palette size={20} />
              </button>
              
              {showThemeSelector && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                  <button 
                    onClick={() => {
                      toggleTheme('dark'); 
                      setShowThemeSelector(false);
                    }}
                    className="flex items-center w-full p-2 rounded hover:bg-gray-700"
                  >
                    <Moon size={16} className="mr-2" />
                    <span>Dark Theme</span>
                  </button>
                  <button 
                    onClick={() => {
                      toggleTheme('light'); 
                      setShowThemeSelector(false);
                    }}
                    className="flex items-center w-full p-2 rounded hover:bg-gray-700"
                  >
                    <Sun size={16} className="mr-2" />
                    <span>Light Theme</span>
                  </button>
                  <button 
                    onClick={() => {
                      toggleTheme('modern'); 
                      setShowThemeSelector(false);
                    }}
                    className="flex items-center w-full p-2 rounded hover:bg-gray-700"
                  >
                    <Palette size={16} className="mr-2" />
                    <span>Modern Theme</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;