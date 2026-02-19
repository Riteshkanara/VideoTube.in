import { optimizeCloudinaryUrl } from '../../utils/cloudinaryImage.js'

export default function Avatar({ src, alt, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 min-w-[32px] min-h-[32px]',
    md: 'w-10 h-10 min-w-[40px] min-h-[40px]',
    lg: 'w-16 h-16 min-w-[64px] min-h-[64px]',
    xl: 'w-24 h-24 min-w-[96px] min-h-[96px]',
  };

  return (
    <div 
      className={`
        ${sizes[size]}
        rounded-full 
        overflow-hidden 
        bg-gray-700 
        flex-shrink-0
        border-2 
        border-gray-600
        relative
      `}
      style={{ 
        width: size === 'sm' ? '32px' : size === 'md' ? '40px' : size === 'lg' ? '64px' : '96px',
        height: size === 'sm' ? '32px' : size === 'md' ? '40px' : size === 'lg' ? '64px' : '96px',
        minWidth: size === 'sm' ? '32px' : size === 'md' ? '40px' : size === 'lg' ? '64px' : '96px',
        minHeight: size === 'sm' ? '32px' : size === 'md' ? '40px' : size === 'lg' ? '64px' : '96px',
      }}
    >
      {src ? (
        <img 
          src={ optimizeCloudinaryUrl(src, 150)} 
          alt={alt || 'Avatar'} 
          width={100}
          height={100}
          className="w-full h-full object-cover"
          style={{
            objectFit: 'cover',
            display: 'block',
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#374151;color:#9CA3AF;font-weight:600;">${(alt?.charAt(0) || '?').toUpperCase()}</div>`;
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white bg-gray-700 font-semibold">
          {(alt?.charAt(0) || '?').toUpperCase()}
        </div>
      )}
    </div>
  );
}