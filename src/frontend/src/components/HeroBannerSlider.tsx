import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const banners = [
  '/assets/generated/hero-banner-1-colorful.dim_1600x600.png',
  '/assets/generated/hero-banner-2-colorful.dim_1600x600.png',
  '/assets/generated/hero-banner-3-colorful.dim_1600x600.png',
];

export default function HeroBannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full aspect-[16/6] md:aspect-[16/5] overflow-hidden rounded-2xl shadow-soft-lg border-2 border-primary/10">
      <div className="absolute inset-0 gradient-overlay-colorful pointer-events-none z-10" />
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      <Button
        variant="secondary"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg z-20 hover:scale-110 transition-transform bg-card/90 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg z-20 hover:scale-110 transition-transform bg-card/90 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40"
        onClick={goToNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all shadow-md ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-primary to-secondary w-8' 
                : 'bg-white/70 hover:bg-white/90 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
