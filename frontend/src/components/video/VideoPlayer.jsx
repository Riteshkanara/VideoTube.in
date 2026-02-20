export default function VideoPlayer({ src, thumbnail }) {
  

  if (!src) {
    return <div className="aspect-video bg-black rounded-lg" />;
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        key={src}
        src={src}
        poster={thumbnail}
        controls
        controlsList="nodownload"
        className="w-full h-full object-contain"
        preload="metadata"
        onError={(e) => {
          console.error('❌ Video error:', e);
          console.error('Failed URL:', src);
        }}
        
      >
        Your browser doesn't support HTML5 video.
      </video>
    </div>
  );
}