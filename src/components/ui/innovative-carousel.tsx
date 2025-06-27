"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
  image?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface InnovativeCarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplayDelay?: number;
  showProgress?: boolean;
  className?: string;
  height?: string;
  onSlideChange?: (index: number) => void;
}

export const InnovativeCarousel: React.FC<InnovativeCarouselProps> = ({
  items,
  autoplay = true,
  autoplayDelay = 5000,
  showProgress = true,
  className,
  height = "h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]",
  onSlideChange,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = items.length;

  const goToSlide = useCallback((index: number) => {
    if (index < 0) {
      index = totalSlides - 1;
    } else if (index >= totalSlides) {
      index = 0;
    }
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    onSlideChange?.(index);
    
    setTimeout(() => setIsTransitioning(false), 300);
  }, [totalSlides, onSlideChange]);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const startAutoplay = useCallback(() => {
    if (!autoplay || isPaused) return;

    autoplayRef.current = setTimeout(() => {
      nextSlide();
    }, autoplayDelay);
  }, [autoplay, isPaused, autoplayDelay, nextSlide]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startProgress = useCallback(() => {
    if (!showProgress || isPaused) return;

    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 100 / (autoplayDelay / 50);
      });
    }, 50);
  }, [showProgress, isPaused, autoplayDelay]);

  const stopProgress = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    startProgress();

    return () => {
      stopAutoplay();
      stopProgress();
    };
  }, [currentSlide, startAutoplay, startProgress, stopAutoplay, stopProgress]);

  const handleMouseLeave = () => {
    if (isDragging) {
      handleTouchEnd();
    } else {
      setIsPaused(false);
      startAutoplay();
      startProgress();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  // Touch/Mouse Events for Swipe
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragOffset(0);
    setIsPaused(true);
    stopAutoplay();
    stopProgress();
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - dragStartX;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setDragOffset(0);
    setIsPaused(false);
    startAutoplay();
    startProgress();
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-xl sm:rounded-2xl cursor-grab active:cursor-grabbing",
        height,
        className
      )}
      onMouseEnter={() => {
        setIsPaused(true);
        stopAutoplay();
        stopProgress();
      }}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-label="Carousel"
    >
      {/* Slides Container */}
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-300 ease-out",
          isDragging && "transition-none"
        )}
        style={{
          transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "absolute top-0 left-0 w-full h-full",
              isTransitioning && "transition-all duration-300"
            )}
            style={{
              left: `${index * 100}%`,
            }}
          >
            {item.content}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {showProgress && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-xs px-4">
          <div className="flex space-x-2 mb-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className="h-1 flex-1 rounded-full transition-all duration-300 bg-white/30"
              >
                {index === currentSlide && (
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-30 bg-black/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Swipe Indicator */}
      <div className="absolute top-1/2 left-4 z-30 bg-black/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
        ← Kaydır
      </div>
      <div className="absolute top-1/2 right-4 z-30 bg-black/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
        Kaydır →
      </div>
    </div>
  );
};

// Pre-built slide content component for common use cases
interface SlideContentProps {
  image?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  overlay?: boolean;
  className?: string;
}

export const SlideContent: React.FC<SlideContentProps> = ({
  image,
  title,
  description,
  buttonText,
  buttonLink,
  overlay = true,
  className,
}) => {
  const content = (
    <div className={cn("relative w-full h-full", className)}>
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      
      {overlay && (
        <div className="absolute inset-0 bg-black/25">
          <div className="absolute inset-0 bg-green-900/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        </div>
      )}

      {(title || description || buttonText) && (
        <div className="relative z-30 h-full flex flex-col justify-center p-4 sm:p-6 lg:p-12">
          <div className="text-center md:text-left">
            {title && (
              <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-white/75 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto md:mx-0">
                {description}
              </p>
            )}
            {buttonText && buttonLink && (
              <a
                href={buttonLink}
                className="inline-block w-fit mx-auto md:mx-0 rounded-md rounded-tr-xl rounded-bl-xl py-2 sm:py-3 px-4 sm:px-6 font-medium text-white opacity-75 transition duration-300 hover:opacity-100 bg-green-500 text-sm sm:text-base"
              >
                {buttonText}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return content;
}; 