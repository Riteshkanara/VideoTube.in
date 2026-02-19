import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/formatDate';
import { formatDuration } from '../../utils/formatDuration';
import { formatViews } from '../../utils/formatViews';
import {  optimizeCloudinaryUrl } from '../../utils/cloudinaryImage.js'

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video._id}`} className="group block animate-fade-in">
      <div className="space-y-3">
        {/* Thumbnail with Hover Effect */}
        <div className="relative aspect-video bg-gradient-to-br from-dark-secondary to-dark-tertiary rounded-2xl overflow-hidden border border-gray-800 group-hover:border-gray-700 transition-all duration-300 group-hover:shadow-card-hover card-shine">
          <img
            src={optimizeCloudinaryUrl(video.thumbnail, 640)}
            alt={video.title}
            width={640}
            height={360}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIGZpbGw9IiMxQTFBMUEiLz48cGF0aCBkPSJNNTUwIDI4NUw3MzAgNDM1TDU1MCA1ODVWMjg1WiIgZmlsbD0iI0ZGMDAwMCIvPjwvc3ZnPg==';
            }}
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/90 backdrop-blur-sm rounded-lg text-xs font-bold">
              {formatDuration(video.duration)}
            </div>
          )}
          
          {/* Play Icon on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
            <Avatar 
              src={video.owner?.avatar} 
              alt={video.owner?.fullName} 
              size="md" 
            />
          </div>
          
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-semibold line-clamp-2 text-white group-hover:text-primary transition-colors duration-300 leading-snug">
              {video.title}
            </h3>
            
            <p className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200">
              {video.owner?.fullName}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {formatViews(video?.views || 0)} views
              </span>
              <span>•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}