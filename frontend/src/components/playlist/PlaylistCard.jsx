import { Link } from 'react-router-dom';
import { PlaySquare, Lock } from 'lucide-react';

export default function PlaylistCard({ playlist }) {
  const firstVideo = playlist.videos?.[0];
  const videoCount = playlist.videos?.length || 0;

  return (
    <Link 
      to={`/playlist/${playlist._id}`}
      className="group"
    >
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
          {firstVideo?.thumbnail ? (
            <>
              <img
                src={firstVideo.thumbnail}
                alt={playlist.name}
                width={640}
                height={360}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <PlaySquare size={48} className="mx-auto mb-2" />
                  <p className="font-semibold">{videoCount} videos</p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <PlaySquare size={48} className="mb-2" />
              <p className="text-sm">Empty playlist</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary">
            {playlist.name}
          </h3>
          {playlist.description && (
            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
              {playlist.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
            <span>{videoCount} videos</span>
            {!playlist.isPublic && (
              <>
                <span>•</span>
                <Lock size={14} />
                <span>Private</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}