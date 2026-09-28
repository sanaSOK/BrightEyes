'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Glasses } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const activeImage = images[selectedIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* Main Preview */}
      <div className="relative h-96 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-inner">
        {activeImage && !imageError[selectedIndex] ? (
          <Image
            src={activeImage}
            alt={`${title} view ${selectedIndex + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            onError={() => setImageError((prev) => ({ ...prev, [selectedIndex]: true }))}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-600">
            <Glasses className="h-16 w-16 mb-2" />
            <span className="text-xs uppercase font-medium">Optics High-Res View</span>
          </div>
        )}
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border transition-all',
                selectedIndex === idx
                  ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                  : 'border-slate-800 opacity-70 hover:opacity-100'
              )}
            >
              {!imageError[idx] ? (
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover object-center"
                  onError={() => setImageError((prev) => ({ ...prev, [idx]: true }))}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-600">
                  <Glasses className="h-6 w-6" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
