"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";

import { heroChildSlides, type HeroSlideItem } from "@/data/african-fulfillment-images";
import { SiteHeader } from "@/components/site-header";
import { isUnoptimized } from "@/lib/image";

interface HeroSliderProps {
  slides?: HeroSlideItem[];
}

export function HeroSlider({ slides = heroChildSlides }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setTimeout(() => {
      goToNext();
    }, 6500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, totalSlides, goToNext]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setTouchStartX(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrev();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  return (
    <div className="w-full">
      <div
        id="hero-slider-container"
        role="region"
        aria-roledescription="carousel"
        aria-label="Life Helpers Initiative Hero Stage"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full min-h-[680px] sm:min-h-[740px] lg:min-h-[820px] rounded-none shadow-2xl flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 focus:outline-none"
      >
        {/* ========================================================================= */}
        {/* FULL BLEED CINEMATIC PHOTOGRAPHY BACKGROUND SLIDES */}
        {/* ========================================================================= */}
        <div
          id="hero-cinematic-background"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none z-0 overflow-hidden"
        >
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={`bg-${slide.id}`}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  unoptimized={isUnoptimized(slide.src)}
                  fill
                  priority={index === 0}
                  referrerPolicy="no-referrer"
                  className={`object-cover object-center transition-transform duration-[8000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                  sizes="(max-width: 1440px) 100vw, 1440px"
                />
              </div>
            );
          })}

          {/* Cinematic Dual Gradient Overlays matching the reference image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(235,22,28,0.22),transparent_60%)] pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* TOP MENU BAR INSIDE HERO SECTION ON TOP */}
        {/* ========================================================================= */}
        <div className="relative z-30 w-full mb-6 min-h-[76px] sm:min-h-[88px]">
          <SiteHeader insideHero={true} />
        </div>

        {/* ========================================================================= */}
        {/* TOP INTERNAL BAR: Brand badge & Slide Progress Indicator */}
        {/* ========================================================================= */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="inline-flex min-w-0 items-center gap-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 px-3.5 py-1.5 text-xs text-white/90">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate font-semibold text-white">Life Helpers Initiative</span>
            <span className="hidden text-white/60 sm:inline">·</span>
            <span className="hidden text-white/80 sm:inline">{currentSlide.tag}</span>
          </div>

          {/* Slide Navigation Dots & Play/Pause */}
          <div className="flex shrink-0 items-center gap-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 px-3 py-1.5">
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero slides">
              {slides.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={`dot-${slide.id}`}
                    role="tab"
                    id={`hero-slide-tab-${idx}`}
                    aria-selected={isActive}
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => goToSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive ? "w-6 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  >
                    <span className="sr-only">Slide {idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-3 w-px bg-white/20 mx-1" />

            <button
              type="button"
              aria-label="Previous slide"
              onClick={goToPrev}
              className="text-white/70 hover:text-white p-0.5 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              onClick={() => setIsPaused(!isPaused)}
              className="text-white/70 hover:text-white p-0.5 transition-colors"
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </button>

            <button
              type="button"
              aria-label="Next slide"
              onClick={goToNext}
              className="text-white/70 hover:text-white p-0.5 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN HERO LOWER GRID: Headline/CTAs on Left, Stacked Card on Right */}
        {/* ========================================================================= */}
        <div className="relative z-10 mt-auto pt-16 sm:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          {/* Left Column: Bold Display Headline, Description, Dual Pill CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Display Headline */}
            <h1
              key={`headline-${currentSlide.id}`}
              className="font-serif-display text-white text-[36px] sm:text-[48px] md:text-[58px] lg:text-[66px] xl:text-[72px] leading-[1.04] tracking-tight font-medium max-w-2xl animate-fade-blur-in"
            >
              <span>{currentSlide.prefix} </span>
              <span className="text-white underline decoration-primary decoration-4 underline-offset-8">
                {currentSlide.highlight}
              </span>
              <span> {currentSlide.suffix}</span>
            </h1>

            {/* Subtitle / Body Description */}
            <p
              key={`body-${currentSlide.id}`}
              className="mt-4 sm:mt-5 max-w-xl text-white/85 text-sm sm:text-base md:text-lg leading-relaxed animate-fade-blur-in font-normal"
            >
              {currentSlide.body}
            </p>

            {/* Dual CTA Buttons with Circular Arrow Badges (matching reference design) */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Primary "Donate Now" Pill with White Circular Arrow */}
              <Link
                href={currentSlide.primaryCta.href}
                id="hero-primary-cta"
                className="group inline-flex items-center gap-3 rounded-full bg-primary pl-6 pr-2 py-2 text-white font-semibold text-sm shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              >
                <span>{currentSlide.primaryCta.label}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>

              {/* Secondary pill, when the slide has a second button */}
              {currentSlide.secondaryCta.label && currentSlide.secondaryCta.href && (
                <Link
                  href={currentSlide.secondaryCta.href}
                  id="hero-secondary-cta"
                  className="group inline-flex items-center gap-3 rounded-full bg-white pl-6 pr-2 py-2 text-slate-900 font-semibold text-sm shadow-xl hover:bg-white/95 hover:scale-105 transition-all duration-300"
                >
                  <span>{currentSlide.secondaryCta.label}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Stacked Campaign Spotlight Card (matching reference design) */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Background Stacked Card Layer 1 (top back tab) */}
              <div className="absolute -top-3 inset-x-4 h-full rounded-2xl bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/20 pointer-events-none" />

              {/* Background Stacked Card Layer 2 (middle back tab) */}
              <div className="absolute -top-1.5 inset-x-2 h-full rounded-2xl bg-white/40 dark:bg-white/20 backdrop-blur-md border border-white/30 pointer-events-none" />

              {/* Main Front Card */}
              <div className="relative rounded-2xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl border border-white/50 flex items-center justify-between gap-3 sm:gap-4 transition-all">
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  {/* Thumbnail Image */}
                  <div className="relative w-20 sm:w-24 aspect-[4/3] rounded-xl overflow-hidden shrink-0 shadow-sm bg-slate-200">
                    <Image
                      src={currentSlide.src}
                      alt={currentSlide.alt}
                      unoptimized={isUnoptimized(currentSlide.src)}
                      fill
                      sizes="96px"
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </div>

                  {/* Campaign Details */}
                  <div className="min-w-0">
                    <h4 className="font-serif-display font-medium text-sm sm:text-base leading-tight text-slate-900 dark:text-white line-clamp-2">
                      {currentSlide.caption || "A Journey Towards Equality and Strength"}
                    </h4>
                    <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="truncate">Active campaign · {currentSlide.tag}</span>
                    </p>
                  </div>
                </div>

                {/* Arrow Action Button */}
                <Link
                  href="/programs"
                  aria-label="View active campaign"
                  className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-md hover:scale-110 hover:bg-primary/90 transition-all"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

