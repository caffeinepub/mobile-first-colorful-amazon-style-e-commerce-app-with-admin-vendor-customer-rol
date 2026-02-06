import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Sparkles, Package } from 'lucide-react';
import PrimaryCtaButton from './buttons/PrimaryCtaButton';
import { StoreCategory } from '../backend';
import { getStoreCategorySlug } from '../constants/storeCategories';

interface BannerSlide {
  title: string;
  subtitle: string;
  gradient: string;
  category: StoreCategory;
  icon: typeof ShoppingBag;
  backgroundImage: string;
}

const slides: BannerSlide[] = [
  {
    title: 'Trending Fashion Store',
    subtitle: 'Up to 40% OFF',
    gradient: 'from-purple-600/90 via-pink-600/90 to-rose-600/90',
    category: StoreCategory.clothStore,
    icon: ShoppingBag,
    backgroundImage: '/assets/generated/banner-cloth-store-photo.dim_1600x600.png',
  },
  {
    title: 'Beauty & Cosmetic Deals',
    subtitle: 'Best Prices',
    gradient: 'from-pink-600/90 via-rose-600/90 to-red-600/90',
    category: StoreCategory.cosmeticStore,
    icon: Sparkles,
    backgroundImage: '/assets/generated/banner-cosmetic-store-photo.dim_1600x600.png',
  },
  {
    title: 'Daily Needs Grocery',
    subtitle: 'Fast Delivery',
    gradient: 'from-green-600/90 via-emerald-600/90 to-teal-600/90',
    category: StoreCategory.groceryStore,
    icon: Package,
    backgroundImage: '/assets/generated/banner-grocery-store-photo.dim_1600x600.png',
  },
];

export default function HeroBannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const startAutoSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    startAutoSlide();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    startAutoSlide();
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    startAutoSlide();
  };

  const handleShopNow = (category: StoreCategory) => {
    const slug = getStoreCategorySlug(category);
    navigate({ to: `/store-category/${slug}` });
  };

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div 
      className="relative w-full h-[200px] overflow-hidden rounded-2xl shadow-soft-lg"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 relative"
            >
              {/* Background Image */}
              <img
                src={slide.backgroundImage}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient Overlay for readability */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 text-white z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white/30">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold drop-shadow-lg leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-lg font-bold drop-shadow-md">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
                <PrimaryCtaButton
                  onClick={() => handleShopNow(slide.category)}
                  className="w-fit px-8 py-3 text-base font-extrabold rounded-full shadow-soft-lg"
                >
                  Shop Now
                </PrimaryCtaButton>
              </div>

              {/* Decorative Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 z-[5]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all shadow-md ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
