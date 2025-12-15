'use client';
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import Link from "next/link";
import type { SVGProps } from "react";

// --------------------------- ICONS ---------------------------
const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const ShoppingCartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.6 12.3c.7 2 2.7 3.7 4.7 3.7h8" />
    <path d="M17 6H3" />
    <path d="M18 13.5L20 7" />
  </svg>
);

const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);


// --------------------------- DATA ---------------------------
const featuresData = [
  { id: 1, icon: "/images/icons/sun.svg", title: "Soothing Fragrance", subtitle: "LONG-LASTING SCENT" },
  { id: 2, icon: "/images/icons/award.svg", title: "100% Natural", subtitle: "USE OF NATURAL INGREDIENTS" },
  { id: 3, icon: "/images/icons/zap.svg", title: "Low Smoke", subtitle: "MINIMAL SMOKE, MAXIMUM SERENITY" },
];

// --------------------------- APP ---------------------------
export default function App() {
  return <HomePage />;
}

// --------------------------- HOMEPAGE ---------------------------
// Use an isomorphic layout effect to avoid SSR warnings in Next.js
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function HomePage() {
  // Hide the page BEFORE GSAP initializes (prevents refresh glitch)
useEffect(() => {
  document.documentElement.classList.add("gsap-init");
}, []);

  const heroRef = useRef(null);
  const bgImgRef = useRef(null);
  const bagLeft = useRef(null);
  const bagCenter = useRef(null);
  const bagRight = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [bgReady, setBgReady] = useState(false);

  const mainProductImg = '/images/product/product-main.png';
  const incenseSticksImg = '/images/product/incense-sticks.png';
  const bag1 = '/images/product/product-bag-1.png';
  const bag2 = '/images/product/product-bag-2.png';
  const bag3 = '/images/product/product-bag-3.png';
  const incenseHolderImg = '/images/product/Holder.png';
  const podiumBaseImg = '/images/product/podium-base.png';
  const bgImgSrc = "/images/backgrounds/forest-bg.jpg";

  // Load GSAP (safe: keeps original approach but sets gsapLoaded when available)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (typeof window.gsap === 'undefined') {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      s.onload = () => {
        const st = document.createElement('script');
        st.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
        st.onload = () => {
          if (window.gsap && window.ScrollTrigger) {
            try {
              window.gsap.registerPlugin(window.ScrollTrigger);
            } catch (e) {
              /* already registered or safe-fail */
            }
            setGsapLoaded(true);
          }
        };
        document.head.appendChild(st);
      };
      document.head.appendChild(s);
    } else {
      // If GSAP already present, ensure plugin is registered
      if (window.gsap && typeof window.ScrollTrigger !== 'undefined' && !window.gsap.ScrollTrigger) {
        try {
          window.gsap.registerPlugin(window.ScrollTrigger);
        } catch (e) {
          /* no-op */
        }
      }
      setGsapLoaded(true);
    }
  }, []);

  // Wait for background image to load — avoid using bgImgRef.current in deps
  useEffect(() => {
    const img = bgImgRef.current;
    if (!img) return;

    if (img.complete && img.naturalHeight) {
      setBgReady(true);
      return;
    }

    const onLoad = () => setBgReady(true);
    img.addEventListener('load', onLoad);
    return () => img.removeEventListener('load', onLoad);
  }, []); // intentionally empty deps - ref shouldn't be in deps

  // Resize handler (kept very small and safe)
  useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        // Recompute isMobile and keep bgReady as-is (no layout change)
        setIsMobile(window.innerWidth < 768);
      }, 120);
    };

    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // GSAP Timeline — use isomorphic layout effect to avoid SSR warnings
  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!gsapLoaded || !bgReady) return;
    if (!heroRef.current || !bgImgRef.current) return;

    setIsMobile(window.innerWidth < 768);

    const gsap = window.gsap;
    if (!gsap) return;

    const ctx = gsap.context(() => {

      // ------------------ BG Size Calculations ------------------
      const containerH = heroRef.current?.getBoundingClientRect().height || window.innerHeight;
      const imgRect = bgImgRef.current?.getBoundingClientRect() || { height: 0 };
      const imgDisplayedH = imgRect.height || 0;
      const deltaPx = Math.max(0, imgDisplayedH - containerH);
      const maxMovePercent = imgDisplayedH > 0 ? (deltaPx / imgDisplayedH) * 100 : 0;

      // ------------------ Main Timeline ------------------
const heroTL = gsap.timeline({
  scrollTrigger: {
    trigger: heroRef.current,
    start: "top top",
    end: "bottom+=4500",
    scrub: 1.2,
    pin: true,
    markers: false,
  },
});

// ------------------ Anti-glitch + force scroll top ------------------
window.history.scrollRestoration = "manual";
window.ScrollTrigger.addEventListener("refresh", () => {
  document.documentElement.classList.remove("gsap-init");
  window.scrollTo(0, 0);
});


      // ------------------ Background Intro ------------------
      heroTL.fromTo(
        bgImgRef.current,
        { filter: "blur(8px) brightness(0.35)", autoAlpha: 0 },
        { filter: "blur(3px) brightness(0.9)", autoAlpha: 1, duration: 1.5, ease: "power2.out" },
        0
      );

      // ------------------ Leaves Slide In After Black Screen ------------------
heroTL.from(
  ".leaf-1",
  {
    opacity: 0,
    x: 150,   // slides IN from right
    duration: 1.4,
    ease: "power3.out",
  },
  ">+=0.2"
);

heroTL.from(
  ".leaf-2",
  {
    opacity: 0,
    x: 200,   // from far right
    y: -40,   // slightly downward angle
    duration: 1.3,
    ease: "power3.out",
  },
  "<+=0.15"
);

heroTL.from(
  ".leaf-3",
  {
    opacity: 0,
    x: -180,  // from left
    duration: 1.4,
    ease: "power3.out",
  },
  "<+=0.15"
);

heroTL.from(
  ".leaf-4",
  {
    opacity: 0,
    x: -260,  // large left slide
    y: 80,    // diagonal upward
    duration: 1.6,
    ease: "power3.out",
  },
  "<+=0.2"
);

heroTL.from(
  ".leaf-5",
  {
    opacity: 0,
    x: 160,   // from right
    duration: 1.3,
    ease: "power3.out",
  },
  "<+=0.15"
);

heroTL.from(
  ".leaf-6",
  {
    opacity: 0,
    x: -150,  // from left
    y: -60,   // from top-left
    duration: 1.4,
    ease: "power3.out",
  },
  "<+=0.15"
);

heroTL.from(
  ".leaf-7",
  {
    opacity: 0,
    x: 120,   // from right
    y: 90,    // from below
    duration: 1.5,
    ease: "power3.out",
  },
  "<+=0.2"
);

      
      // ------------------ Headline ------------------
      heroTL
        .fromTo(".hero-headline", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.0 }, 0.2)
        .to(".hero-headline", { opacity: 0, y: -50, duration: 1.0 }, "+=2.0");

      // ------------------ Product Enter Motion ------------------
      heroTL.fromTo(
        ".product-main",
        {
          y: 250,
          opacity: 0,
          scale: 0.9,
          rotation: 0,
          transformOrigin: "center center",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1.05,
          rotation: -20,
          duration: 2,
          ease: "power3.out",
        },
        "-=0.3"
      );

// ------------------ SECOND LEAF MOTION (subtle but visible) ------------------
heroTL.add(() => {

  gsap.to(".leaf-1", {
    x: "+=20",    // small right shift
    y: "+=10",    // small downward shift
    rotation: "+=5",
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.to(".leaf-2", {
    x: "-=25",    // small left shift
    y: "+=15",
    rotation: "-=5",
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.to(".leaf-3", {
    x: "+=30",
    y: "-=10",
    rotation: "+=6",
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.to(".leaf-4", {
    x: "-=20",
    y: "+=25",
    rotation: "+=3",
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.to(".leaf-5", {
    x: "+=25",
    y: "+=18",
    rotation: "+=4",
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.to(".leaf-6", {
    x: "-=28",
    y: "-=15",
    rotation: "-=4",
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.to(".leaf-7", {
    x: "+=22",
    y: "+=12",
    rotation: "+=5",
    duration: 1.2,
    ease: "power2.out",
  });

});
      
      // ------------------ Incense Enter ------------------
      heroTL.fromTo(
        ".incense-container",
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" },
        "+=0.6"
      );
      heroTL.set(".incense", { rotation: 350 }, "<");

      // ------------------ Product Exit (curved) ------------------
      heroTL.to(
        ".product-main",
        {
          duration: 2.4,
          ease: "power3.inOut",
          keyframes: [
            { y: 500, x: 120, rotation: -15, scale: 1.15 },
            { y: 1000, x: 180, rotation: -10, scale: 1.2 },
          ],
        },
        "+=1.2"
      );

      // ------------------ Incense small reposition ------------------
      heroTL.to(
        ".incense-container",
        { rotation: 10, xPercent: -22, x: 60, y: 20, scale: 1.2, duration: 1.0 },
        "+=0.2"
      );

// ------------------ THIRD LEAF MOTION (before feature list) ------------------
heroTL.add(() => {

  gsap.to(".leaf-1", {
    x: "-=15",
    y: "+=8",
    rotation: "-=4",
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.to(".leaf-2", {
    x: "+=20",
    y: "-=10",
    rotation: "+=5",
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.to(".leaf-3", {
    x: "-=18",
    y: "+=12",
    rotation: "-=3",
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.to(".leaf-4", {
    x: "+=22",
    y: "+=20",
    rotation: "+=4",
    duration: 1.3,
    ease: "power2.out",
  });

  gsap.to(".leaf-5", {
    x: "-=16",
    y: "-=8",
    rotation: "+=5",
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.to(".leaf-6", {
    x: "+=14",
    y: "+=10",
    rotation: "-=4",
    duration: 1.3,
    ease: "power2.out",
  });

  gsap.to(".leaf-7", {
    x: "-=12",
    y: "+=14",
    rotation: "+=3",
    duration: 1.2,
    ease: "power2.out",
  });

});


      // ------------------ Features ------------------
      featuresData.forEach((f) => {
        const fromVars = { opacity: 0, scale: 0.92, y: 20, x: 0 };
        const toVars = { opacity: 1, scale: 1, y: 0, xPercent: 2, duration: 0.8, ease: "power2.out" };
        heroTL.fromTo(`.feature-${f.id}`, fromVars, toVars, "+=0.5");

        if (f.id === 3) {
          heroTL.to(".incense", { rotation: 340, duration: 1,}, "<");
        }

        heroTL.to(`.feature-${f.id}`, { opacity: 0, y: -20, duration: 0.6 }, "+=1");
      });

// ------------------ FOURTH LEAF MOTION (before CTA) ------------------
heroTL.add(() => {

  gsap.to(".leaf-1", {
    x: "+=12",
    y: "-=10",
    rotation: "+=4",
    duration: 1.3,
    ease: "power2.out",
  });

  gsap.to(".leaf-2", {
    x: "-=18",
    y: "+=8",
    rotation: "-=3",
    duration: 1.3,
    ease: "power2.out",
  });

  gsap.to(".leaf-3", {
    x: "+=20",
    y: "+=10",
    rotation: "+=5",
    duration: 1.4,
    ease: "power2.out",
  });

  gsap.to(".leaf-4", {
    x: "-=15",
    y: "-=20",
    rotation: "+=2",
    duration: 1.5,
    ease: "power2.out",
  });

  gsap.to(".leaf-5", {
    x: "+=14",
    y: "+=12",
    rotation: "-=4",
    duration: 1.3,
    ease: "power2.out",
  });

  gsap.to(".leaf-6", {
    x: "-=22",
    y: "-=14",
    rotation: "+=3",
    duration: 1.4,
    ease: "power2.out",
  });

  gsap.to(".leaf-7", {
    x: "+=16",
    y: "+=10",
    rotation: "-=3",
    duration: 1.3,
    ease: "power2.out",
  });

});

      // ------------------ Incense final desktop exit ------------------
      const mm = gsap.matchMedia();

mm.add(
  {
    // mobile
    isMobile: "(max-width: 767px)",
    // desktop
    isDesktop: "(min-width: 768px)"
  },
  (ctx) => {
    const { isMobile, isDesktop } = ctx.conditions;

    // MOBILE VERSION 
    if (isMobile) {
      heroTL.to(
        ".incense-container",
        {
          xPercent: -40,
          yPercent: 32,
          rotation: 0,
          scale: 0.8,  
          duration: 1.4,
          ease: "power3.out",
        },
        "+=0.2"
      );

      heroTL.to(
        ".incense",
        {
          rotation: 365,
          scale: 0.8,
          duration: 1.4,
          ease: "power3.out",
        },
        "<"
      );
    }

    // DESKTOP VERSION (kept EXACTLY like you originally had it)
    if (isDesktop) {
      heroTL.to(
        ".incense-container",
        {
          rotation: 0,
          xPercent: -14,
          yPercent: 20,
          scale: 1.2,
          duration: 1.4,
          ease: "power3.out",
        },
        "+=0.2"
      );

      heroTL.to(
        ".incense",
        {
          rotation: 355,
          scale: 0.8,
          duration: 1.4,
          ease: "power3.out",
        },
        "<"
      );
    }
  }
);


      // ------------------ Podium + CTA + Bags ------------------
      heroTL.fromTo(
        ".podium-bg",
        { opacity: 0, scaleY: 0.5, transformOrigin: "bottom" },
        { opacity: 1, scaleY: 1, duration: 0.8, ease: "power2.out" },
        "+=0.2"
      );

      heroTL.to(".incense-holder", { opacity: 1, duration: 0.5 }, "<");

      heroTL.fromTo(
        ".cta-final",
        { opacity: 0, y: -230 },
        { opacity: 1, y: -320, duration: 1.0 },
        "-=1.4"
      );

      heroTL.fromTo(bagLeft.current, { x: -150, opacity: 0, scale: 0.8 }, { x: 40, y: 20, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "+=0.2");
      heroTL.fromTo(bagRight.current, { x: 150, opacity: 0, scale: 0.8 }, { x: -40, y: 20, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "<");
      heroTL.fromTo(bagCenter.current, { y: 50, opacity: 0, scale: 0.7 }, { y: 0, opacity: 1, scale: 1.1, duration: 1.4, ease: "elastic.out(1,0.5)" }, "<");

      // ------------------ Background Scroll Sync ------------------
      const totalDuration = heroTL.duration();

      // Instead of creating a nested gsap.context (which caused leak), ensure DOM exists then animate
      const mobile = window.innerWidth < 768;
      if (!mobile && bgImgRef.current) {
        heroTL.to(
          bgImgRef.current,
          { yPercent: -maxMovePercent, ease: "none", duration: totalDuration },
          0
        );
      }
    });

    return () => ctx.revert();
  }, [gsapLoaded, bgReady, isMobile]); // keep dependencies sensible

  // --------------------------- CONTENT ---------------------------
  const heroContent = (
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
      <div className="absolute inset-0 flex flex-col items-center justify-center">

        {/* Headline */}
        <div className="hero-headline absolute text-center px-4">
          <h1
            className="font-serif font-normal leading-snug text-[34px] md:text-[95px] md:leading-tight"
            style={{ fontFamily: '"Sangkala", sans-serif' }}
          >
            Fragrance That Elevates<br />The Divine Moment
          </h1>

          <p
            className="mt-4 text-[16px] md:text-[25px] text-green-200 leading-relaxed md:leading-normal md:mt-6"
            style={{ fontFamily: '"Afacad", sans-serif' }}
          >
            Rooted in tradition, perfected through craftsmanship<br />
            Rolet incense awakens the senses with purity, serenity, and the soulful rhythm of divine fragrance.
          </p>
        </div>

        {/* Product */}
        <img
          src={mainProductImg}
          alt=""
          role="presentation"
          className="product-main absolute w-[280px] md:w-[400px]"
          style={{ transform: 'rotate(-20deg)', zIndex: 30 }}
        />

        {/* Incense & Holder */}
<div
  className="incense-container absolute opacity-0 flex flex-col items-center justify-center"
  style={{ width: "100%", zIndex: 15 }}
>
  <div className="relative flex flex-col items-center justify-center">

    {/* 🔥 Incense Stick */}
    <img
      src={incenseSticksImg}
      alt="Incense sticks"
      className="incense w-28 md:w-32 h-[28rem] md:h-[32rem] object-contain"
      style={{ transform: "translateY(1rem)", zIndex: 20 }}
    />

    {/* 🕯️ Holder */}
    <img
      src={incenseHolderImg}
      alt="Incense Holder"
      className="incense-holder absolute opacity-0"
      style={{
        zIndex: 12,
        width: "60%",
        top: "85%",
        left: "70%",
      }}
    />
  </div>

  {/* DESKTOP OVERRIDES */}
  <style jsx>{`
    @media (min-width: 768px) {
      .incense-holder {
        width: "60%",
        top: "85%",
        left: "70%",
      }
    }
  `}</style>
</div>


        {/* Features */}
        {featuresData.map((f) => (
          <div
            key={f.id}
            className={`feature-${f.id} feature absolute opacity-0 z-20 flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-6 w-full`}
          >
            <img src={f.icon} alt={f.title} loading="lazy" className="w-16 h-16 md:w-20 md:h-20 object-contain" />

            <div className="text-center md:text-left px-4 md:px-0">
              <p
                className="font-serif leading-snug font-normal text-[26px] md:text-[60px] md:leading-[1.2]"
                style={{ fontFamily: '"Sangkala", sans-serif' }}
              >
                {f.title}
              </p>
              <p
                className="text-green-200 tracking-wide text-[14px] md:text-[25px] md:mt-2"
                style={{ fontFamily: '"Afacad", sans-serif' }}
              >
                {f.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="cta-final absolute opacity-0 flex flex-col items-center justify-center">
          <p className="mb-4 text-green-200 text-[22px] md:text-[32px]" style={{ fontFamily: '"Afacad", sans-serif' }}>
            Unveil a world of refined aromas crafted to awaken the senses and elevate your everyday rituals.
          </p>
          <Link href="/your-link" className="inline-block">
              <button className="px-8 py-3 bg-white text-black font-semibold tracking-wider rounded-[25px] shadow-lg hover:bg-gray-100 transition-colors">EXPLORE NOW</button>
          </Link>
        </div>

        {/* Bottom Showcase */}
<div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center pb-24">

  {/* Bags Row */}
  <div
    className="
      relative z-10 flex justify-center items-end w-full max-w-4xl
      bottom-[12%]           /* mobile */
      md:bottom-[13mm]         /* desktop */
    "
  >
    <img
      ref={bagLeft}
      src={bag2}
      alt="Product Bag Left"
      loading="lazy"
      className="w-[48%] md:w-[34%] object-contain opacity-0"
    />
    <img
      ref={bagCenter}
      src={bag1}
      alt="Product Bag Center"
      loading="lazy"
      className="w-[52%] md:w-[34%] object-contain -mx-4 relative z-20 opacity-0"
    />
    <img
      ref={bagRight}
      src={bag3}
      alt="Product Bag Right"
      loading="lazy"
      className="w-[48%] md:w-[34%] object-contain opacity-0"
    />
  </div>

  {/* Podium */}
  <div className="podium-bg absolute bottom-0 w-full h-[32vh] md:h-[40vh] bg-no-repeat opacity-0 bg-[length:180%] bg-[center_top_45mm] md:bg-[length:90%] md:bg-[50% -155%]" style={{backgroundImage: `url(${podiumBaseImg})`, zIndex: -10, transformOrigin: "50% 100%"}}/></div>
      </div>
    </div>
  );

  // --------------------------- RENDER ---------------------------
  return (
    <div className="min-h-[300vh] font-['Inter']">
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <div className="hero-bg absolute inset-0 overflow-hidden pointer-events-none">
          <img
            ref={bgImgRef}
            src={bgImgSrc}
            alt="Forest background"
            className="hero-bg-img absolute left-1/2 -translate-x-1/2"
            style={{ width: '100%', height: 'auto', filter: 'blur(3px) brightness(0.8)', transformOrigin: 'top center' }}
          />
        </div>
        {/* Floating Leaves */}
        <div className="leaves-wrapper pointer-events-none absolute inset-0 overflow-visible">
          <img src="/Leaves-04.png" className="leaf leaf-1" />
          <img src="/Leaves-05.png" className="leaf leaf-2" />
          <img src="/Leaves-03.png" className="leaf leaf-3" />
          <img src="/Leaves-02.png" className="leaf leaf-4" />
          <img src="/Leaves-04.png" className="leaf leaf-5" />
          <img src="/Leaves-03.png" className="leaf leaf-6" />
          <img src="/Leaves-04.png" className="leaf leaf-7" />
        </div>
        {heroContent}
      </section>
    </div>
  );
}
