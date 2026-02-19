// Logo.jsx - Eye-catching, professional logo component
// Place this in: src/components/common/Logo.jsx

export default function Logo({ variant = 'default', size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl',
    xl: 'w-16 h-16 text-2xl',
  };

  // Animated gradient logo
  if (variant === 'animated') {
    return (
      <div className={`${sizes[size]} relative group cursor-pointer`}>
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
        
        {/* Main logo container */}
        <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all duration-300">
          {/* Play icon with gradient */}
          <div className="relative">
            <svg 
              className="w-5 h-5 text-white drop-shadow-lg" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
            
            {/* Small sparkle effect */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </div>
      </div>
    );
  }

  // Gradient text logo
  if (variant === 'text') {
    return (
      <div className="flex items-center gap-3 group cursor-pointer">
        {/* Icon */}
        <div className={`${sizes[size]} relative`}>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
            <svg className="w-5 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        {/* Text */}
        <div className="flex flex-col ">
          <span className="text-2xl mt-5 font-black leading-none bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            VideoTube
          </span>
          <span className="text-[10px] font-medium text-gray-500 tracking-wider uppercase">
            
          </span>
        </div>
      </div>
    );
  }

  // Premium 3D logo
  if (variant === 'premium') {
    return (
      <div className={`${sizes[size]} relative group cursor-pointer`}>
        {/* Glow layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-red-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur-lg opacity-75" />
        
        {/* Main container with 3D effect */}
        <div className="relative h-full">
          {/* Shadow layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-pink-900 rounded-2xl transform translate-y-0.5 translate-x-0.5" />
          
          {/* Main layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-all duration-300">
            {/* Inner glow */}
            <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
            
            {/* Play icon */}
            <svg 
              className="relative w-5 h-5 text-white drop-shadow-lg z-10" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Minimal clean logo
  if (variant === 'minimal') {
    return (
      <div className={`${sizes[size]} relative group cursor-pointer`}>
        <div className="relative bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all border border-red-400/30">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    );
  }

  // Neon glow logo
  if (variant === 'neon') {
    return (
      <div className={`${sizes[size]} relative group cursor-pointer`}>
        {/* Multiple glow layers for neon effect */}
        <div className="absolute inset-0 bg-red-600 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
        <div className="absolute inset-0 bg-pink-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" />
        <div className="absolute inset-0 bg-red-500 rounded-2xl blur-lg opacity-80" />
        
        {/* Main logo */}
        <div className="relative bg-gradient-to-br from-red-600 via-pink-600 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-red-400/50 transform group-hover:scale-110 transition-all duration-300">
          <svg className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    );
  }

  // Default modern logo
  return (
    <div className={`${sizes[size]} relative group cursor-pointer`}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
      
      {/* Main container */}
      <div className="relative bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>
  );
}

// Usage Examples:
// <Logo variant="default" size="md" />
// <Logo variant="animated" size="lg" />
// <Logo variant="text" size="md" />
//<Logo variant="premium" size="lg" />
// <Logo variant="minimal" size="sm" />
//<Logo variant="neon" size="xl" />