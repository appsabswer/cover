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
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDataChange = useCallback((newData: Partial<CoverData>) => {
    setCoverData(prev => ({ ...prev, ...newData }));
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
      
      const blob = await toBlob(canvasRef.current, {
        pixelRatio: 2,
        backgroundColor: '#F8F7F4',
        cacheBust: true,
        type: 'image/webp',
        quality: 0.95
      });

      if (!blob) throw new Error('Failed to create image');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // If the browser doesn't support webp, toBlob might return a png
      // We can check the blob type
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

    } catch (err) {
      console.error('Failed to download image:', err);
      // Fallback
      try {
        const pngBlob = await toBlob(canvasRef.current!, {
          pixelRatio: 2,
          backgroundColor: '#F8F7F4',
        });
        if (pngBlob) {
          const url = URL.createObjectURL(pngBlob);
          const link = document.createElement('a');
          link.download = `abswer-cover-${Date.now()}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 100);
        }
      } catch (e) {
        console.error('Fallback failed too', e);
        alert('Export failed. Please try again or use a different browser.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-editorial-bg text-editorial-text font-sans overflow-hidden">
      {/* Editorial Header */}
      <header className="h-16 border-b border-editorial-border flex items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-6">
          <span className="font-serif italic text-2xl tracking-tighter">Abswer.com</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2 border border-editorial-text text-[10px] uppercase tracking-widest font-bold hover:bg-editorial-text hover:text-white transition-colors disabled:opacity-50"
          >
            {isDownloading ? 'Processing...' : 'Export Design'}
          </button>
          <div className="w-8 h-8 rounded-full bg-editorial-text flex items-center justify-center text-white text-[10px] font-bold">AB</div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden flex-col lg:flex-row">
        {/* Main Preview Area */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
          {/* Project header removed */}
          
          
          <AnimatePresence mode="wait">
            <motion.div
              key="canvas-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl"
            >
              <Canvas data={coverData} innerRef={canvasRef} />
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-8 text-center text-editorial-muted max-w-md bg-white border border-editorial-border p-4 shadow-sm flex items-center gap-3">
            <ImageIcon className="text-editorial-text shrink-0" size={16} />
            <p className="text-[10px] uppercase tracking-wider leading-relaxed">
              আপনার কভার টাইটেল, বিষয় কোড এবং অন্যান্য তথ্য পরিবর্তন করুন। এক্সপোর্ট বাটনে ক্লিক করে হাই-কোয়ালিটি কভারটি সেভ করুন।
            </p>
          </div>
          
          <div className="absolute bottom-6 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-editorial-text"></div>
            <div className="w-2 h-2 rounded-full bg-editorial-border"></div>
            <div className="w-2 h-2 rounded-full bg-editorial-border"></div>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar 
          data={coverData} 
          onChange={handleDataChange} 
          onDownload={handleDownload}
          onLogoUpload={handleLogoUpload}
          isDownloading={isDownloading}
        />
      </main>
    </div>
  );
}
