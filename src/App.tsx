/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { toCanvas, toBlob } from 'html-to-image';
import { Canvas } from './components/Canvas';
import { Sidebar } from './components/Sidebar';
import { defaultCover, CoverData } from './types';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [coverData, setCoverData] = useState<CoverData>(defaultCover);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDataChange = useCallback((newData: Partial<CoverData>) => {
    setCoverData(prev => ({ ...prev, ...newData }));
  }, []);

  React.useEffect(() => {
    const handleToggle = () => setIsSidebarOpen(prev => !prev);
    window.addEventListener('toggleSidebar', handleToggle);
    return () => window.removeEventListener('toggleSidebar', handleToggle);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    
    setIsDownloading(true);
    try {
      // Small delay to ensure any layout changes are settled
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await toCanvas(canvasRef.current, {
        pixelRatio: 2,
        backgroundColor: '#F8F7F4',
        cacheBust: true,
      });

      if (!canvas) throw new Error('Failed to create canvas');

      // Native toBlob usually handles formats better
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to create blob');
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Check if it's actually webp, otherwise fallback to png name but try to keep webp if possible
        const isWebp = blob.type === 'image/webp';
        link.download = `abswer-cover-${Date.now()}.${isWebp ? 'webp' : 'png'}`;
        
        link.href = url;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }, 'image/webp', 0.95);

    } catch (err) {
      console.error('Failed to download image:', err);
      alert('Export failed. Please try again or use a different browser.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-editorial-bg text-editorial-text font-sans overflow-hidden">
      {/* Editorial Header */}
      <header className="h-16 border-b border-editorial-border flex items-center justify-between px-4 lg:px-8 bg-white shrink-0 z-50">
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 -ml-2 text-editorial-text hover:bg-gray-100 rounded-md"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`h-0.5 bg-current transition-all ${isSidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`h-0.5 bg-current transition-all ${isSidebarOpen ? 'opacity-0' : ''}`}></span>
              <span className={`h-0.5 bg-current transition-all ${isSidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
          <span className="font-serif italic text-xl lg:text-2xl tracking-tighter">Abswer.com</span>
        </div>
        
        <div className="flex items-center gap-3 lg:gap-4">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-3 py-1.5 lg:px-4 lg:py-2 border border-editorial-text text-[9px] lg:text-[10px] uppercase tracking-widest font-bold hover:bg-editorial-text hover:text-white transition-colors disabled:opacity-50"
          >
            {isDownloading ? '...' : 'Export'}
          </button>
          <div className="hidden sm:flex w-8 h-8 rounded-full bg-editorial-text items-center justify-center text-white text-[10px] font-bold">AB</div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Main Preview Area */}
        <div className="flex-1 relative flex flex-col items-center justify-start lg:justify-center p-4 lg:p-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key="canvas-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-4xl origin-top lg:origin-center"
            >
              <Canvas data={coverData} innerRef={canvasRef} />
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-6 text-center text-editorial-muted max-w-md bg-white border border-editorial-border p-3 lg:p-4 shadow-sm flex items-center gap-3 mx-4">
            <ImageIcon className="text-editorial-text shrink-0" size={14} />
            <p className="text-[9px] lg:text-[10px] uppercase tracking-wider leading-relaxed text-left">
              টাইটেল ও বিষয় কোড পরিবর্তন করে হাই-কোয়ালিটি কভার এক্সপোর্ট করুন।
            </p>
          </div>
        </div>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 right-0 z-50 lg:z-0
          w-full sm:w-[320px] lg:w-[320px] 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar 
            data={coverData} 
            onChange={handleDataChange} 
            onDownload={handleDownload}
            onLogoUpload={handleLogoUpload}
            isDownloading={isDownloading}
          />
        </div>
      </main>
    </div>
  );
}
