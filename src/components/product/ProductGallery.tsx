"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductColor } from "./ProductInfo";

interface ProductGalleryProps {
  images?: string[];
  className?: string;
  colorVariants?: Record<string, string[]>;
}

const ProductGallery = ({
  images = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
  ],
  className,
  colorVariants = {
    "Preto": [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691229-a3d2c61b2502?w=800&q=80",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80",
    ],
    "Branco": [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    ],
    "Azul": [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
      "https://images.unsplash.com/photo-1578587018543-1d16f3c8f086?w=800&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80",
    ],
    "Vermelho": [
      "https://images.unsplash.com/photo-1542827474-255e98ec2b42?w=800&q=80",
      "https://images.unsplash.com/photo-1542827474-48884df92058?w=800&q=80",
      "https://images.unsplash.com/photo-1551489446-2f67fb4a0275?w=800&q=80",
      "https://images.unsplash.com/photo-1552860118-92d1cdb52921?w=800&q=80",
    ],
    "Verde": [
      "https://images.unsplash.com/photo-1606299620033-a6926b893459?w=800&q=80",
      "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=800&q=80",
      "https://images.unsplash.com/photo-1611911813383-67769b37a149?w=800&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80",
    ],
  },
}: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedImages, setDisplayedImages] = useState(images);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  
  // Get the selected color from context
  const { selectedColor } = useProductColor();

  // Update images when color changes
  useEffect(() => {
    if (selectedColor && colorVariants[selectedColor]) {
      setDisplayedImages(colorVariants[selectedColor]);
      setSelectedImage(0); // Reset to first image when color changes
      setIsLoading(true);
    } else {
      setDisplayedImages(images);
    }
  }, [selectedColor, colorVariants, images]);

  // Handle mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  // Handle touch move for mobile zoom
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isZoomed || e.touches.length === 0) return;

    const touch = e.touches[0];
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - left) / width) * 100;
    const y = ((touch.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  // Navigate to next/previous image
  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  // Scroll thumbnail into view when selected
  useEffect(() => {
    if (thumbnailsRef.current) {
      const selectedThumb = thumbnailsRef.current.children[selectedImage] as HTMLElement;
      if (selectedThumb) {
        selectedThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedImage]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Main Image Container */}
      <motion.div
        className={cn(
          "group relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-background/80 to-muted transition-all duration-300",
          isZoomed && "cursor-zoom-out",
          !isZoomed && "cursor-zoom-in",
          isFullScreen && "fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
        )}
        onClick={() => isFullScreen ? null : setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={() => isZoomed && setIsZoomed(false)}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20 backdrop-blur-sm z-10">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="absolute right-3 top-3 z-10 flex gap-2 rounded-full bg-background/50 p-1 backdrop-blur-md transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className="rounded-full p-2 text-foreground hover:bg-muted transition-colors"
            aria-label={isZoomed ? "Desativar zoom" : "Ativar zoom"}
          >
            {isZoomed ? (
              <ZoomOut className="h-4 w-4" />
            ) : (
              <ZoomIn className="h-4 w-4" />
            )}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreen(!isFullScreen);
            }}
            className="rounded-full p-2 text-foreground hover:bg-muted transition-colors"
            aria-label={isFullScreen ? "Fechar tela cheia" : "Abrir em tela cheia"}
          >
            <Expand className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <motion.button 
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            navigateImage('prev');
          }}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/50 p-2 text-foreground shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
          aria-label="Imagem anterior"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        
        <motion.button 
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            navigateImage('next');
          }}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/50 p-2 text-foreground shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
          aria-label="Próxima imagem"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>

        {/* Image Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedColor || 'default'}-${selectedImage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative h-full w-full"
          >
            <Image
              src={displayedImages[selectedImage]}
              alt={`Imagem do produto ${selectedImage + 1}${selectedColor ? ` na cor ${selectedColor}` : ''}`}
              fill
              className={cn(
                "object-cover transition-all duration-300",
                isZoomed ? "scale-150" : "scale-100",
                isFullScreen ? "object-contain" : "object-cover",
              )}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    }
                  : undefined
              }
              sizes={isFullScreen ? "100vw" : "(max-width: 768px) 100vw, 40vw"}
              priority
              onLoad={() => setIsLoading(false)}
              quality={90}
            />
          </motion.div>
        </AnimatePresence>

        {/* Image number indicator */}
        <div className="absolute bottom-3 left-3 rounded-full bg-background/50 px-2 py-1 text-xs font-medium backdrop-blur-md">
          {selectedImage + 1}/{displayedImages.length}
        </div>

        {/* Close button for fullscreen mode */}
        {isFullScreen && (
          <motion.button 
            onClick={() => setIsFullScreen(false)}
            className="absolute right-5 top-5 z-10 rounded-full bg-background/50 p-2 text-foreground hover:bg-background transition-colors"
            aria-label="Fechar tela cheia"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}
      </motion.div>

      {/* Thumbnails */}
      <div 
        ref={thumbnailsRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x"
      >
        {displayedImages.map((image, index) => (
          <motion.button
            key={`${selectedColor || 'default'}-${index}`}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all snap-center",
              selectedImage === index
                ? "border-primary ring-2 ring-primary ring-offset-2 shadow-lg"
                : "border-border hover:border-primary/50 opacity-70 hover:opacity-100",
            )}
            aria-label={`Ver imagem do produto ${index + 1}${selectedColor ? ` na cor ${selectedColor}` : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={selectedImage === index ? { scale: 1.05 } : { scale: 1 }}
          >
            <Image
              src={image}
              alt={`Miniatura do produto ${index + 1}${selectedColor ? ` na cor ${selectedColor}` : ''}`}
              fill
              className="object-cover"
              sizes="80px"
            />
            {selectedImage === index && (
              <motion.div 
                className="absolute inset-0 bg-primary/10 ring-1 ring-inset ring-primary/20"
                layoutId="selectedThumbnail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Color indicator */}
      {selectedColor && (
        <motion.div 
          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary self-start flex items-center gap-1.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ 
              backgroundColor: 
                selectedColor === "Preto" ? "#000" :
                selectedColor === "Branco" ? "#fff" :
                selectedColor === "Azul" ? "#0066FF" :
                selectedColor === "Vermelho" ? "#FF0000" :
                selectedColor === "Verde" ? "#00A651" :
                "#ccc",
              border: selectedColor === "Branco" ? "1px solid #ddd" : "none"
            }} 
          />
          Cor: {selectedColor}
        </motion.div>
      )}
    </div>
  );
};

export default ProductGallery;
