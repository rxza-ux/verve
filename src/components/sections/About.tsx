'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);

  // Stats counter state
  const [counts, setCounts] = useState({ events: 0, partners: 0, cities: 0 });

  // Splits text into clean word elements with explicit inline styles for spacing
  // Bypasses Tailwind compile/cache quirks by using inline marginRight styles
  const splitText = (text: string, trackingClass: 'tight' | 'normal' = 'normal') => {
    return text.split(' ').map((word, i) => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const isHighlighted = ['cultural', 'moment', 'ours'].includes(cleanWord.toLowerCase());

      return (
        <span
          key={i}
          className="inline-block overflow-hidden py-0.5"
          style={{
            marginRight: '0.38em',
            perspective: '400px'
          }}
        >
          <span
            className="about-word inline-block origin-bottom"
            style={{
              fontStyle: isHighlighted ? 'italic' : 'normal',
              color: isHighlighted ? 'var(--color-primary)' : 'inherit',
              fontWeight: isHighlighted ? '400' : 'inherit',
              letterSpacing: trackingClass === 'tight' ? '-0.02em' : '-0.01em',
            }}
          >
            {word}
          </span>
        </span>
      );
    });
  };

  // Left column animation (eyebrow + heading words)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = container.querySelectorAll('.about-word');
    const label = container.querySelector('.section-label');

    // Initialize 3D hidden states on client mount
    words.forEach((word) => {
      const htmlEl = word as HTMLElement;
      htmlEl.style.opacity = '0';
      htmlEl.style.transform = 'translateY(110%) rotateX(-65deg)';
      htmlEl.style.filter = 'blur(4px)';
    });

    if (label) {
      const htmlLabel = label as HTMLElement;
      htmlLabel.style.opacity = '0';
      htmlLabel.style.transform = 'translateY(20px)';
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 1. Reveal eyebrow label
            anime({
              targets: label,
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 500,
              easing: 'easeOutQuad',
            });

            // 2. 3D flip-up staggered reveal wave on words
            anime({
              targets: words,
              opacity: {
                value: [0, 1],
                duration: 400,
                easing: 'linear',
              },
              translateY: {
                value: ['110%', '0%'],
                duration: 800,
                easing: 'cubicBezier(0.25, 1, 0.5, 1)',
              },
              rotateX: {
                value: [-65, 0],
                duration: 750,
                easing: 'cubicBezier(0.25, 1, 0.5, 1)',
              },
              filter: {
                value: ['blur(4px)', 'blur(0px)'],
                duration: 600,
                easing: 'easeOutQuad',
              },
              delay: anime.stagger(15, { start: 100 }),
            });

            observer.unobserve(container);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Right column animation (paragraphs + stats)
  useEffect(() => {
    const rightCol = rightTextRef.current;
    if (!rightCol) return;

    const paragraphs = rightCol.querySelectorAll('.about-paragraph');
    const statCards = rightCol.querySelectorAll('.stat-card');

    // Initialize hidden states
    paragraphs.forEach((p) => {
      const el = p as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px) translateX(-10px)';
      el.style.filter = 'blur(6px)';
    });

    statCards.forEach((card) => {
      const el = card as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px) scale(0.95)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Staggered paragraph reveal — smart slide + blur dissolve
            anime({
              targets: Array.from(paragraphs),
              opacity: {
                value: [0, 1],
                duration: 700,
                easing: 'linear',
              },
              translateY: {
                value: [40, 0],
                duration: 900,
                easing: 'cubicBezier(0.25, 1, 0.5, 1)',
              },
              translateX: {
                value: [-10, 0],
                duration: 900,
                easing: 'cubicBezier(0.25, 1, 0.5, 1)',
              },
              filter: {
                value: ['blur(6px)', 'blur(0px)'],
                duration: 800,
                easing: 'easeOutQuad',
              },
              delay: anime.stagger(200, { start: 200 }),
            });

            // Staggered glassmorphism stat card reveal
            anime({
              targets: Array.from(statCards),
              opacity: {
                value: [0, 1],
                duration: 600,
                easing: 'linear',
              },
              translateY: {
                value: [30, 0],
                duration: 800,
                easing: 'cubicBezier(0.25, 1, 0.5, 1)',
              },
              scale: {
                value: [0.95, 1],
                duration: 800,
                easing: 'cubicBezier(0.25, 1, 0.5, 1)',
              },
              delay: anime.stagger(150, { start: 600 }),
            });

            // Count-up stats animation
            const counters = { events: 0, partners: 0, cities: 0 };
            anime({
              targets: counters,
              events: 200,
              partners: 50,
              cities: 12,
              round: 1,
              easing: 'easeOutExpo',
              duration: 2500,
              delay: 800,
              update: () => {
                setCounts({
                  events: counters.events,
                  partners: counters.partners,
                  cities: counters.cities
                });
              }
            });

            observer.unobserve(rightCol);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );

    observer.observe(rightCol);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden border-b border-white/10">

      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-verve relative z-10">
        <div ref={containerRef} className="about-grid grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column (5 Columns) */}
          <div className="about-left lg:col-span-5 flex flex-col items-start">
            <div className="section-label text-eyebrow text-secondary tracking-[0.2em] font-semibold bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
              Who we are
            </div>

            <h2 className="section-title text-display-sm md:text-display-md text-primary font-bold mt-8 leading-tight flex flex-wrap">
              {splitText("We believe every event should feel like a cultural moment.", "tight")}
            </h2>
          </div>

          {/* Right Column (7 Columns) */}
          <div ref={rightTextRef} className="about-right lg:col-span-7 flex flex-col justify-center">

            <p className="about-paragraph about-text text-xl md:text-2xl text-neutral-300 font-light tracking-wide leading-relaxed flex flex-wrap mb-10">
              {splitText("VERSE was born from a simple frustration — events that looked the same, felt the same, and were forgotten the same. We decided to change that.", "normal")}
            </p>

            <p className="about-paragraph about-text text-body-lg text-secondary leading-relaxed flex flex-wrap mb-16 lg:mb-20">
              {splitText("We're a collective of designers, producers, and strategists who obsess over every detail. From the first concept sketch to the last light cue, we build experiences that are bold, immersive, and unmistakably ours.", "normal")}
            </p>

            {/* Stats in Glassmorphism Cards */}
            <div className="about-stats grid grid-cols-3 gap-3 sm:gap-4 w-full pt-12 border-t border-white/[.06]">

              {/* Card 1 — Events */}
              <div className="stat-card group relative rounded-xl overflow-hidden transition-all duration-500 hover:translate-y-[-2px]"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                {/* Top accent gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
                />
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)' }}
                />
                <div className="relative z-10 flex flex-col items-center text-center py-8 md:py-10 px-4">
                  <div className="flex items-baseline">
                    <span className="stat-number text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold text-white tracking-tight">
                      {counts.events}
                    </span>
                    <span className="text-white/30 text-xl font-semibold ml-0.5">+</span>
                  </div>
                  <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.15em] text-white/40 font-medium mt-3">
                    Events Produced
                  </span>
                </div>
              </div>

              {/* Card 2 — Partners */}
              <div className="stat-card group relative rounded-xl overflow-hidden transition-all duration-500 hover:translate-y-[-2px]"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)' }}
                />
                <div className="relative z-10 flex flex-col items-center text-center py-8 md:py-10 px-4">
                  <div className="flex items-baseline">
                    <span className="stat-number text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold text-white tracking-tight">
                      {counts.partners}
                    </span>
                    <span className="text-white/30 text-xl font-semibold ml-0.5">+</span>
                  </div>
                  <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.15em] text-white/40 font-medium mt-3">
                    Brand Partners
                  </span>
                </div>
              </div>

              {/* Card 3 — Cities */}
              <div className="stat-card group relative rounded-xl overflow-hidden transition-all duration-500 hover:translate-y-[-2px]"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)' }}
                />
                <div className="relative z-10 flex flex-col items-center text-center py-8 md:py-10 px-4">
                  <span className="stat-number text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold text-white tracking-tight">
                    {counts.cities}
                  </span>
                  <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.15em] text-white/40 font-medium mt-3">
                    Cities Worldwide
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
