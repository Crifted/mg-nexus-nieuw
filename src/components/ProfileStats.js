// src/components/ProfileStats.js
import React from 'react';
import { motion } from 'framer-motion';

const ProfileStats = ({ profile, platform }) => {
  // Calculate engagement score based on followers and other metrics
  const calculateEngagementScore = () => {
    let score = 0;
    
    if (profile.followers) {
      // Add points based on followers
      if (profile.followers < 1000) score += 10;
      else if (profile.followers < 10000) score += 30;
      else if (profile.followers < 100000) score += 50;
      else score += 70;
    }
    
    // Add points for additional profile completeness
    if (profile.name) score += 5;
    if (profile.bio) score += 10;
    if (profile.avatar_url) score += 5;
    
    // Platform specific bonuses
    if (platform.name === 'GitHub' && profile.public_repos) {
      score += Math.min(profile.public_repos * 2, 20); // Up to 20 points for repositories
    }
    
    return Math.min(score, 100); // Cap at 100
  };

  const engagementScore = calculateEngagementScore();
  
  return (
    <div className="mt-4 border-t border-gray-600 pt-3">
      <h4 className="text-lg font-medium mb-2">Profile Analysis</h4>
      
      <div className="space-y-2">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Engagement Score</span>
            <span className="text-sm font-medium">{engagementScore}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <motion.div 
              className="h-2 rounded-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${engagementScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        
        {profile.followers !== undefined && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Audience Size</span>
              <span className="text-sm font-medium">
                {profile.followers > 100000 ? 'Very Large' : 
                 profile.followers > 10000 ? 'Large' :
                 profile.followers > 1000 ? 'Medium' : 'Small'}
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <motion.div 
                className="h-2 rounded-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ 
                  width: profile.followers > 100000 ? '100%' : 
                         profile.followers > 10000 ? '75%' :
                         profile.followers > 1000 ? '50%' : '25%'
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
        
        {platform.name === 'GitHub' && profile.public_repos && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Activity Level</span>
              <span className="text-sm font-medium">
                {profile.public_repos > 50 ? 'Very Active' : 
                 profile.public_repos > 20 ? 'Active' :
                 profile.public_repos > 5 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <motion.div 
                className="h-2 rounded-full bg-purple-500"
                initial={{ width: 0 }}
                animate={{ 
                  width: profile.public_repos > 50 ? '100%' : 
                         profile.public_repos > 20 ? '75%' :
                         profile.public_repos > 5 ? '50%' : '25%'
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileStats;