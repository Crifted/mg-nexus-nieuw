// src/components/ProfileCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileStats from './ProfileStats';

const ProfileCard = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview'); // Voor Spotify: 'overview', 'tracks', 'albums', 'playlists'
  
  // Helper function to format large numbers
  const formatNumber = (num) => {
    if (!num && num !== 0) return 'Unknown';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Helper functie om seconden om te zetten naar mm:ss formaat
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper functie voor datum weergave
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Custom component for Spotify profiles
  const SpotifyProfileContent = ({ profile }) => {
    return (
      <div className="flex flex-col">
        {/* Header met profielafbeelding en basisinfo */}
        <div className="relative mb-4">
          {profile.image_url && (
            <div className="relative">
              {/* Achtergrondafbeelding met gradient overlay */}
              <div 
                className="w-full h-24 bg-center bg-cover rounded-t-lg"
                style={{ backgroundImage: `url(${profile.image_url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 rounded-t-lg"></div>
              </div>
              
              {/* Profielafbeelding */}
              <div className="absolute -bottom-10 left-4">
                <img 
                  src={profile.image_url} 
                  alt={profile.name} 
                  className="w-20 h-20 rounded-full border-2 border-gray-700"
                />
              </div>
            </div>
          )}
          
          {/* Naam en basisinfo */}
          <div className="mt-12 pl-2">
            <h3 className="text-xl font-bold mb-1">{profile.name}</h3>
            <div className="flex text-sm text-gray-400 space-x-4">
              <span>{profile.type === 'artist' ? 'Artist' : 'User'}</span>
              <span>{formatNumber(profile.followers)} followers</span>
              {profile.popularity && <span>Popularity: {profile.popularity}/100</span>}
            </div>
          </div>
        </div>
        
        {/* Tabs voor verschillende secties */}
        <div className="flex border-b border-gray-600 mb-4">
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'overview' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          
          {profile.top_tracks && (
            <button 
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'tracks' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('tracks')}
            >
              Top Tracks
            </button>
          )}
          
          {profile.albums && (
            <button 
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'albums' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('albums')}
            >
              Albums
            </button>
          )}
          
          {profile.playlists && (
            <button 
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'playlists' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('playlists')}
            >
              Playlists
            </button>
          )}
        </div>
        
        {/* Tab inhoud */}
        <div className="flex-grow">
          {activeTab === 'overview' && (
            <div>
              {profile.monthly_listeners && (
                <p className="text-gray-300 mb-2">
                  <span className="font-medium">Monthly Listeners:</span> {formatNumber(profile.monthly_listeners)}
                </p>
              )}
              
              {/* Genres tonen als ze beschikbaar zijn */}
              {profile.genres && profile.genres.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.genres.map((genre, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-800 text-xs px-2 py-1 rounded-full text-gray-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Preview van top tracks */}
              {profile.top_tracks && profile.top_tracks.length > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Popular Tracks</h4>
                    <button 
                      className="text-xs text-green-500 hover:underline"
                      onClick={() => setActiveTab('tracks')}
                    >
                      View all
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {profile.top_tracks.slice(0, 3).map((track, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded p-2">
                        <div className="flex items-center">
                          <span className="text-gray-500 text-xs w-5 text-center">
                            {index + 1}
                          </span>
                          <div className="ml-2">
                            <div className="text-sm font-medium">{track.name}</div>
                            {track.album && (
                              <div className="text-xs text-gray-500">{track.album}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          {track.duration_ms && (
                            <span>{formatDuration(track.duration_ms)}</span>
                          )}
                          {track.popularity && (
                            <div className="bg-gray-700 rounded-full h-1 w-16">
                              <div 
                                className="bg-green-500 h-1 rounded-full"
                                style={{ width: `${track.popularity}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Preview van albums */}
              {profile.albums && profile.albums.length > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Albums</h4>
                    {profile.albums.length > 2 && (
                      <button 
                        className="text-xs text-green-500 hover:underline"
                        onClick={() => setActiveTab('albums')}
                      >
                        View all
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {profile.albums.slice(0, 2).map((album, index) => (
                      <div key={index} className="bg-gray-800 rounded overflow-hidden">
                        {album.image_url && (
                          <img 
                            src={album.image_url} 
                            alt={album.name}
                            className="w-full aspect-square object-cover"
                          />
                        )}
                        <div className="p-2">
                          <div className="text-sm font-medium truncate">{album.name}</div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{formatDate(album.release_date)}</span>
                            <span>{album.total_tracks} tracks</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Preview van playlists voor gebruikers */}
              {profile.playlists && profile.playlists.length > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Playlists</h4>
                    {profile.playlists.length > 2 && (
                      <button 
                        className="text-xs text-green-500 hover:underline"
                        onClick={() => setActiveTab('playlists')}
                      >
                        View all
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {profile.playlists.slice(0, 2).map((playlist, index) => (
                      <div key={index} className="flex bg-gray-800 rounded overflow-hidden">
                        {playlist.image_url && (
                          <img 
                            src={playlist.image_url} 
                            alt={playlist.name}
                            className="w-12 h-12 object-cover"
                          />
                        )}
                        <div className="p-2">
                          <div className="text-sm font-medium">{playlist.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {playlist.total_tracks} tracks • {formatNumber(playlist.followers)} followers
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Tracks tab */}
          {activeTab === 'tracks' && profile.top_tracks && (
            <div className="space-y-2">
              {profile.top_tracks.map((track, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-gray-800 rounded p-2 hover:bg-gray-700 transition"
                >
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm w-5 text-center">
                      {index + 1}
                    </span>
                    <div className="ml-3">
                      <div className="text-sm font-medium">{track.name}</div>
                      {track.album && (
                        <div className="text-xs text-gray-500">{track.album}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {track.duration_ms && (
                      <span className="text-xs text-gray-500">{formatDuration(track.duration_ms)}</span>
                    )}
                    {track.popularity && (
                      <div className="flex items-center space-x-1">
                        <div className="text-xs text-gray-500">{track.popularity}</div>
                        <div className="bg-gray-700 rounded-full h-1 w-16">
                          <div 
                            className="bg-green-500 h-1 rounded-full"
                            style={{ width: `${track.popularity}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Albums tab */}
          {activeTab === 'albums' && profile.albums && (
            <div className="grid grid-cols-2 gap-3">
              {profile.albums.map((album, index) => (
                <div key={index} className="bg-gray-800 rounded overflow-hidden">
                  {album.image_url && (
                    <img 
                      src={album.image_url} 
                      alt={album.name}
                      className="w-full aspect-square object-cover"
                    />
                  )}
                  <div className="p-2">
                    <div className="text-sm font-medium truncate">{album.name}</div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{formatDate(album.release_date)}</span>
                      <span>{album.total_tracks} tracks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Playlists tab */}
          {activeTab === 'playlists' && profile.playlists && (
            <div className="space-y-2">
              {profile.playlists.map((playlist, index) => (
                <div key={index} className="flex bg-gray-800 rounded overflow-hidden">
                  {playlist.image_url && (
                    <img 
                      src={playlist.image_url} 
                      alt={playlist.name}
                      className="w-16 h-16 object-cover"
                    />
                  )}
                  <div className="p-2 flex-grow">
                    <div className="text-sm font-medium">{playlist.name}</div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{playlist.total_tracks} tracks</span>
                      <span>{formatNumber(playlist.followers)} followers</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Externe link en badges */}
        <div className="mt-4 flex justify-between items-center">
          <a 
            href={profile.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Open on Spotify
          </a>
          
          {profile.simulated && (
            <span className="text-xs text-amber-400">
              * Simulated data
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="bg-gray-700 p-4 rounded-lg border border-gray-600 transition hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <result.platform.icon className="w-6 h-6" style={{color: result.platform.color}} />
        <h3 className="text-xl font-semibold" style={{color: result.platform.color}}>
          {result.platform.name}
        </h3>
      </div>
      
      {result.exists && result.profile ? (
        <>
          {/* Specifieke weergave voor Spotify-profielen */}
          {result.platform.name === 'Spotify' ? (
            <SpotifyProfileContent profile={result.profile} />
          ) : (
            /* Standaard weergave voor alle andere platforms */
            <div>
              <p className="text-gray-300">
                <span className="font-medium">Username:</span> {result.profile.username}
              </p>
              
              {result.profile.name && (
                <p className="text-gray-300">
                  <span className="font-medium">Name:</span> {result.profile.name}
                </p>
              )}
              
              {result.profile.avatar_url && (
                <img 
                  src={result.profile.avatar_url} 
                  alt="avatar" 
                  className="w-16 h-16 rounded-full my-2 border-2 border-gray-600" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              {result.profile.bio && (
                <p className="text-gray-300 text-sm mt-2 italic">
                  "{result.profile.bio.length > 100 ? result.profile.bio.substring(0, 100) + '...' : result.profile.bio}"
                </p>
              )}
              
              {result.profile.followers !== undefined && (
                <p className="text-gray-300">
                  <span className="font-medium">Followers:</span> {formatNumber(result.profile.followers)}
                </p>
              )}
              
              {result.profile.followersApprox !== undefined && (
                <p className="text-gray-300">
                  <span className="font-medium">Followers:</span> {result.profile.followersApprox}
                </p>
              )}
              
              {result.profile.connections !== undefined && (
                <p className="text-gray-300">
                  <span className="font-medium">Connections:</span> {formatNumber(result.profile.connections)}
                </p>
              )}
              
              {result.profile.posts !== undefined && (
                <p className="text-gray-300">
                  <span className="font-medium">Posts:</span> {formatNumber(result.profile.posts)}
                </p>
              )}
              
              {result.profile.public_repos !== undefined && (
                <p className="text-gray-300">
                  <span className="font-medium">Repositories:</span> {formatNumber(result.profile.public_repos)}
                </p>
              )}
              
              {result.profile.created_at && (
                <p className="text-gray-300">
                  <span className="font-medium">Joined:</span> {new Date(result.profile.created_at).toLocaleDateString()}
                </p>
              )}
              
              {/* Platform-specific content */}
              {result.platform.name === 'GitHub' && result.profile.recent_repos && (
                <div className="mt-3 border-t border-gray-600 pt-3">
                  <h4 className="text-sm font-medium mb-2">Recent Repositories</h4>
                  <ul className="space-y-2">
                    {result.profile.recent_repos.map((repo, i) => (
                      <li key={i} className="text-sm">
                        <a 
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {repo.name}
                        </a>
                        {repo.description && (
                          <p className="text-gray-400 text-xs">{repo.description.substring(0, 60)}{repo.description.length > 60 ? '...' : ''}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.platform.name === 'Twitter' && result.profile.recent_tweets && (
                <div className="mt-3 border-t border-gray-600 pt-3">
                  <h4 className="text-sm font-medium mb-2">Recent Tweets</h4>
                  <ul className="space-y-2">
                    {result.profile.recent_tweets.map((tweet, i) => (
                      <li key={i} className="text-xs text-gray-300">
                        <p>"{tweet.text}"</p>
                        <p className="text-gray-500 text-xs mt-1">{tweet.date}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.platform.name === 'Reddit' && result.profile.karma && (
                <div className="mt-2">
                  <p className="text-gray-300">
                    <span className="font-medium">Karma:</span> {formatNumber(result.profile.karma)}
                  </p>
                  {result.profile.link_karma && (
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium">Link Karma:</span> {formatNumber(result.profile.link_karma)}
                    </p>
                  )}
                  {result.profile.comment_karma && (
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium">Comment Karma:</span> {formatNumber(result.profile.comment_karma)}
                    </p>
                  )}
                </div>
              )}

              {result.platform.name === 'TikTok' && result.profile.likes && (
                <div className="mt-2">
                  <p className="text-gray-300">
                    <span className="font-medium">Likes:</span> {formatNumber(result.profile.likes)}
                  </p>
                </div>
              )}
              
              {(result.profile.simulated || result.profile.scraped) && (
                <div className="mt-2 text-xs text-amber-400">
                  {result.profile.simulated && "* Estimated data (no API access)"}
                  {result.profile.scraped && "* Data collected via web analysis"}
                </div>
              )}
              
              {/* Add the ProfileStats component */}
              <ProfileStats profile={result.profile} platform={result.platform} />
              
              <div className="mt-3 flex space-x-2">
                <a 
                  href={result.profile.url || result.profile.external_url || `${result.platform.searchUrl}${result.profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-500 transition"
                >
                  View Profile
                </a>
                
                {result.platform.name === 'GitHub' && (
                  <a 
                    href={`https://github.com/${result.profile.username}?tab=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                  >
                    Repositories
                  </a>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <p className="text-gray-500">Profile not found</p>
          <p className="text-xs text-gray-500 mt-2">
            The username "{result.params?.username}" doesn't appear to exist on {result.platform.name}.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileCard;