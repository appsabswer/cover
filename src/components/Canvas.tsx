import React from 'react';
import { CoverData } from '../types';
import { BookOpen } from 'lucide-react';

interface CanvasProps {
  data: CoverData;
  innerRef: React.RefObject<HTMLDivElement | null>;
}

export const Canvas: React.FC<CanvasProps> = ({ data, innerRef }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 32; // padding
        const targetWidth = 960;
        const newScale = Math.min(1, containerWidth / targetWidth);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="flex items-center justify-center bg-gray-200/40 p-4 min-h-[300px] lg:min-h-[500px] lg:p-12 overflow-hidden">
      <div 
        className="relative shrink-0 origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        <div 
          ref={innerRef}
          id="cover-canvas"
          className="relative bg-white w-[960px] h-[540px] flex flex-col items-center justify-center text-center !font-sans overflow-hidden"
          style={{ 
            fontFamily: "'Kohinoor Bangla', sans-serif"
          }}
        >
          {/* Background Waves */}
          {/* Top-Right Large Curve */}
          <div className="absolute -top-5 -right-5 w-[15%] h-[25%] pointer-events-none overflow-hidden">
            <div 
              className="w-full h-full rounded-bl-[100%] opacity-90" 
              style={{ backgroundColor: data.accentColor }}
            />
          </div>
          <div className="absolute -top-8 -right-8 w-[15%] h-[25%] pointer-events-none opacity-30 transform translate-x-2 -translate-y-2">
             <div 
              className="w-full h-full rounded-bl-[100%] border-[10px]" 
              style={{ borderColor: data.accentColor }}
            />
          </div>

          {/* Bottom-Left Large Curve */}
          <div className="absolute -bottom-10 -left-10 w-[15%] h-[25%] pointer-events-none overflow-hidden">
            <div 
              className="w-full h-full rounded-tr-[100%] opacity-90" 
              style={{ backgroundColor: data.accentColor }}
            />
          </div>

          {/* Dots Pattern */}
          {data.showDots && (
            <>
              {/* Top-Left Green Dots */}
              <div className="absolute top-10 left-10 grid grid-cols-4 gap-3">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.accentColor }} />
                ))}
              </div>
              {/* Bottom-Right Grey Dots */}
              <div className="absolute bottom-[20%] right-10 grid grid-cols-2 gap-4 opacity-10">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-black shrink-0" />
                ))}
              </div>
            </>
          )}

        {/* Main Content */}
        <div className="relative z-10 w-full px-20 flex flex-col items-center">
          {/* Title Group */}
          <div className="flex flex-col items-center mb-10 group">
            <h1 
              className="font-black mb-1 relative z-10 tracking-tight leading-tight flex items-center justify-center gap-4 flex-wrap"
              style={{ color: data.themeColor, fontSize: `${data.fontSizeTitle}px` }}
            >
              {data.title}
            </h1>
            <div 
              className="w-1/2 h-1.5 rounded-full opacity-30 mt-[-4px]" 
              style={{ backgroundColor: data.accentColor }} 
            />
            
            <div className="relative mt-4">
              <h2 
                className="font-black leading-none relative z-10"
                style={{ color: data.themeColor, fontSize: `${data.fontSizeSubtitle}px` }}
              >
                {data.subtitle}
              </h2>
              {/* Stylized Underline for Subtitle */}
              <svg className="absolute -bottom-4 left-0 w-full h-4 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke={data.accentColor} strokeWidth="3" />
              </svg>
            </div>
          </div>

          {/* Footer Branding (No Logo) */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full flex items-center justify-center gap-6">
               <div className="h-[1px] bg-gray-300 flex-1 max-w-[100px]"></div>
               <div className="relative group">
                 <div className="font-bold tracking-tight text-center relative z-10 px-6 py-2" style={{ color: data.themeColor, fontSize: `${data.fontSizeDept}px` }}>
                   {data.department}
                 </div>
                 {/* Shaded Background for Department */}
                 <div className="absolute inset-0 bg-gray-100 -skew-x-12 -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                 <div className="absolute -bottom-1 left-0 w-full h-[2px]" style={{ backgroundColor: data.accentColor }}></div>
               </div>
               <div className="h-[1px] bg-gray-300 flex-1 max-w-[100px]"></div>
            </div>
          </div>
        </div>

        {/* Website Pill (Sticky to Bottom Right) */}
        <div className="absolute bottom-10 right-14">
           <div className="border-[2px] rounded-md bg-white/80 backdrop-blur-sm shadow-sm font-black tracking-tighter leading-none p-1" style={{ borderColor: data.accentColor, color: data.themeColor, fontSize: `${data.fontSizeWebsite}px` }}>
             {data.website}
           </div>
        </div>
      </div>
    </div>
  );
};
