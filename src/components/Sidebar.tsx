import React, { useRef } from 'react';
import { CoverData } from '../types';
import { Download, Layout, Palette, Type } from 'lucide-react';

interface SidebarProps {
  data: CoverData;
  onChange: (data: Partial<CoverData>) => void;
  onDownload: () => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDownloading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ data, onChange, onDownload, onLogoUpload, isDownloading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    onChange({ [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value });
  };

  return (
    <aside className="w-full lg:w-[320px] border-l border-editorial-border bg-white flex flex-col h-full overflow-hidden shadow-2xl lg:shadow-none">
      <div className="flex-1 overflow-y-auto">
        {/* Mobile Header with Close Button */}
        <div className="lg:hidden p-4 border-b border-editorial-border flex items-center justify-between bg-editorial-bg/10">
          <span className="font-serif italic font-bold">Settings</span>
          <button 
            onClick={() => (window as any).dispatchEvent(new CustomEvent('toggleSidebar'))}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <Download size={20} className="rotate-45" /> {/* Using an icon as a placeholder for X if X is not available, but let's use a simple div */}
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 lg:p-6 border-b border-editorial-border">
          <h3 className="font-serif italic text-lg tracking-tighter mb-6 flex items-center gap-2">
             <Type size={16} className="opacity-60" />
             Typography & Content
          </h3>
          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-editorial-muted">Main Title</label>
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={handleChange}
                className="w-full border border-editorial-border p-3 text-xs focus:outline-none focus:border-editorial-text bg-editorial-bg/20 font-medium"
                placeholder="আস-সীরাহ..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-editorial-muted">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={data.subtitle}
                onChange={handleChange}
                className="w-full border border-editorial-border p-3 text-xs focus:outline-none focus:border-editorial-text bg-editorial-bg/20 font-medium"
                placeholder="প্রশ্ন ও সমাধান"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-editorial-muted">Department</label>
              <input
                type="text"
                name="department"
                value={data.department}
                onChange={handleChange}
                className="w-full border border-editorial-border p-3 text-xs focus:outline-none focus:border-editorial-text bg-editorial-bg/20 font-medium tracking-wide"
                placeholder="Enter department..."
              />
            </div>
          </div>
        </div>


        {/* Font Sizes Section */}
        <div className="p-6 border-b border-editorial-border">
          <h3 className="font-serif italic text-lg tracking-tighter mb-6 flex items-center gap-2">
             <Layout size={16} className="opacity-60" />
             Font Sizes
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Title', key: 'fontSizeTitle', min: 10, max: 150 },
              { label: 'Subtitle', key: 'fontSizeSubtitle', min: 10, max: 200 },
              { label: 'Department', key: 'fontSizeDept', min: 10, max: 100 },
              { label: 'Website', key: 'fontSizeWebsite', min: 8, max: 48 },
            ].map((item) => (
              <div key={item.key} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-editorial-muted">{item.label}</label>
                  <span className="text-[10px] font-mono">{data[item.key as keyof CoverData]}px</span>
                </div>
                <input
                  type="range"
                  name={item.key}
                  min={item.min}
                  max={item.max}
                  value={data[item.key as keyof CoverData] as number}
                  onChange={(e) => onChange({ [item.key]: parseInt(e.target.value) })}
                  className="w-full accent-editorial-text cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Appearance Section */}
        <div className="p-6">
          <h3 className="font-serif italic text-lg tracking-tighter mb-6 flex items-center gap-2">
             <Palette size={16} className="opacity-60" />
             Aesthetics
          </h3>
          
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
             {[
               { theme: '#1A1A1A', accent: '#706F6C', label: 'Ebony' },
               { theme: '#0A2558', accent: '#C5A059', label: 'Navy Gold' },
               { theme: '#1B4D3E', accent: '#A89F91', label: 'Forest' },
               { theme: '#4A0E0E', accent: '#D4AF37', label: 'Royal Maroon' },
             ].map((preset) => (
               <button
                 key={preset.label}
                 onClick={() => onChange({ themeColor: preset.theme, accentColor: preset.accent })}
                 className={`shrink-0 p-1 border-2 transition-all ${data.themeColor === preset.theme ? 'border-editorial-text bg-editorial-accent' : 'border-transparent'}`}
               >
                 <div className="flex gap-1">
                   <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: preset.theme }} />
                   <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: preset.accent }} />
                 </div>
               </button>
             ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-editorial-muted">Primary</label>
              <div className="flex gap-2">
                 <input
                  type="color"
                  name="themeColor"
                  value={data.themeColor}
                  onChange={handleChange}
                  className="w-8 h-8 rounded-none cursor-pointer border border-editorial-border p-0.5"
                />
                <input
                  type="text"
                  name="themeColor"
                  value={data.themeColor}
                  onChange={handleChange}
                  className="flex-1 min-w-0 border border-editorial-border px-2 py-1 text-[10px] focus:outline-none font-mono"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-editorial-muted">Secondary</label>
              <div className="flex gap-2">
                 <input
                  type="color"
                  name="accentColor"
                  value={data.accentColor}
                  onChange={handleChange}
                  className="w-8 h-8 rounded-none cursor-pointer border border-editorial-border p-0.5"
                />
                <input
                  type="text"
                  name="accentColor"
                  value={data.accentColor}
                  onChange={handleChange}
                  className="flex-1 min-w-0 border border-editorial-border px-2 py-1 text-[10px] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 shrink-0 mt-auto border-t border-editorial-border bg-white">
        <button 
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full bg-editorial-text text-white py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 ring-offset-2 focus:ring-2 focus:ring-editorial-text"
        >
          {isDownloading ? 'Processing Design...' : 'Export Final Cover (.webp)'}
        </button>
      </div>
    </aside>
  );
};
