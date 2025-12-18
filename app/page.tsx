"use client";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

// --------------------------- RESPONSIVE CONFIG ---------------------------
const responsiveConfig = {
	incense: {
		mobile: {
			width: "w-28",
			height: "h-[28rem]",
			holderWidth: "60%",
			holderTop: "85%",
			holderLeft: "70%",
		},
		tablet: {
			width: "md:w-32",
			height: "md:h-[32rem]",
			holderWidth: "192px",
			holderTop: "432px",
			holderLeft: "224px",
		},
		desktop: {
			width: "lg:w-36",
			height: "lg:h-[36rem]",
			holderWidth: "224px",
			holderTop: "480px",
			holderLeft: "256px",
		},
	},
	bags: {
		mobile: {
			container: "top-[32mm]",
			maxWidth: "max-w-md",
			left: "w-[48%]",
			center: "w-[42%]",
			right: "w-[48%]",
		},
		tablet: {
			container: "md:bottom-[13mm]",
			maxWidth: "md:max-w-4xl",
			left: "md:w-[34%]",
			center: "md:w-[34%]",
			right: "md:w-[34%]",
		},
		desktop: {
			container: "lg:top-[50mm]",
			maxWidth: "lg:max-w-5xl",
			left: "lg:w-[32%]",
			center: "lg:w-[30%]",
			right: "lg:w-[32%]",
		},
	},
	podium: {
		mobile: {
			height: "h-[24vh]",
			backgroundSize: "bg-[length:180%]",
			backgroundPosition: "bg-[center_top_25mm]",
		},
		tablet: {
			height: "md:h-[40vh]",
			backgroundSize: "md:bg-[length:90%]",
			backgroundPosition: "md:bg-[50% -155%]",
		},
		desktop: {
			height: "lg:h-[35vh]",
			backgroundSize: "lg:bg-[length:100%]",
			backgroundPosition: "lg:bg-[50% -180%]",
		},
	},
};

// --------------------------- DATA ---------------------------
const featuresData = [
	{
		id: 1,
		icon: "/images/icons/sun.svg",
		title: "Soothing Fragrance",
		subtitle: "LONG-LASTING SCENT",
	},
	{
		id: 2,
		icon: "/images/icons/award.svg",
		title: "100% Natural",
		subtitle: "USE OF NATURAL INGREDIENTS",
	},
	{
		id: 3,
		icon: "/images/icons/zap.svg",
		title: "Low Smoke",
		subtitle: "MINIMAL SMOKE, MAXIMUM SERENITY",
	},
];

// --------------------------- APP ---------------------------
export default function App() {
	return <HomePage />;
}

// --------------------------- HOMEPAGE ---------------------------
// Use an isomorphic layout effect to avoid SSR warnings in Next.js
const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;

function HomePage() {
	// Hide the page BEFORE GSAP initializes (prevents refresh glitch)
	useEffect(() => {
		document.documentElement.classList.add("gsap-init");
	}, []);

	const heroRef = useRef<HTMLDivElement | null>(null);
	const bgImgRef = useRef<HTMLImageElement | null>(null);
	const bagLeft = useRef<HTMLImageElement | null>(null);
	const bagCenter = useRef<HTMLImageElement | null>(null);
	const bagRight = useRef<HTMLImageElement | null>(null);

	const [isMobile, setIsMobile] = useState(false);
	const [bgReady, setBgReady] = useState(false);

	const mainProductImg = "/images/product/product-main.png";
	const incenseSticksImg = "/images/product/incense-sticks.png";
	const bag1 = "/images/product/product-bag-1.png";
	const bag2 = "/images/product/product-bag-2.png";
	const bag3 = "/images/product/product-bag-3.png";
	const incenseHolderImg = "/images/product/Holder.png";
	const podiumBaseImg = "/images/product/podium-base.png";
	const bgImgSrc = "/images/backgrounds/forest-bg.jpg";

	// Wait for background image to load — avoid using bgImgRef.current in deps
	useEffect(() => {
		const img = bgImgRef.current;
		if (!img) return;

		if (img.complete && img.naturalHeight) {
			setBgReady(true);
			return;
		}

		const onLoad = () => setBgReady(true);
		const onError = () => {
			// Set ready even on error to prevent animation hang
			setBgReady(true);
		};
		img.addEventListener("load", onLoad);
		img.addEventListener("error", onError);
		return () => {
			img.removeEventListener("load", onLoad);
			img.removeEventListener("error", onError);
		};
	}, []); // intentionally empty deps - ref shouldn't be in deps

	// Resize handler (kept very small and safe)
	useEffect(() => {
		let t: ReturnType<typeof setTimeout>;
		const onResize = () => {
			clearTimeout(t);
			t = setTimeout(() => {
				// Recompute isMobile and keep bgReady as-is (no layout change)
				setIsMobile(window.innerWidth < 768);
			}, 120);
		};

		window.addEventListener("resize", onResize);
		return () => {
			clearTimeout(t);
			window.removeEventListener("resize", onResize);
		};
	}, []);

	// GSAP Timeline — use isomorphic layout effect to avoid SSR warnings
	useIsomorphicLayoutEffect(() => {
		if (typeof window === "undefined") return;
		if (!bgReady) return;
		if (!heroRef.current || !bgImgRef.current) return;

		setIsMobile(window.innerWidth < 768);

		const ctx = gsap.context(() => {
			// ------------------ BG Size Calculations ------------------
			const containerH =
				heroRef.current?.getBoundingClientRect().height || window.innerHeight;
			const imgRect = bgImgRef.current?.getBoundingClientRect() || {
				height: 0,
			};
			const imgDisplayedH = imgRect.height || 0;
			const deltaPx = Math.max(0, imgDisplayedH - containerH);
			const maxMovePercent =
				imgDisplayedH > 0 ? (deltaPx / imgDisplayedH) * 100 : 0;

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
			ScrollTrigger.addEventListener("refresh", () => {
				document.documentElement.classList.remove("gsap-init");
				window.scrollTo(0, 0);
			});

			// bgReady) return;
			if (!heroRef.current || !bgImgRef.current) return;

			setIsMobile(window.innerWidth < 768);

// ------------------ Scroll Indicator ------------------
// Hide scroll indicator when headline appears
heroTL.to(
	".scroll-indicator",
	{ opacity: 0, duration: 0.6 },
	0.2,
);

			// ------------------ Leaves Slide In After Black Screen ------------------
			heroTL.from(
				".leaf-1",
				{
					opacity: 0,
					x: 150, // slides IN from right
					duration: 1.4,
					ease: "power3.out",
				},
				">+=0.2",
			);

			heroTL.from(
				".leaf-2",
				{
					opacity: 0,
					x: 200, // from far right
					y: -40, // slightly downward angle
					duration: 1.3,
					ease: "power3.out",
				},
				"<+=0.15",
			);

			heroTL.from(
				".leaf-3",
				{
					opacity: 0,
					x: -180, // from left
					duration: 1.4,
					ease: "power3.out",
				},
				"<+=0.15",
			);

			heroTL.from(
				".leaf-4",
				{
					opacity: 0,
					x: -260, // large left slide
					y: 80, // diagonal upward
					duration: 1.6,
					ease: "power3.out",
				},
				"<+=0.2",
			);

			heroTL.from(
				".leaf-5",
				{
					opacity: 0,
					x: 160, // from right
					duration: 1.3,
					ease: "power3.out",
				},
				"<+=0.15",
			);

			heroTL.from(
				".leaf-6",
				{
					opacity: 0,
					x: -150, // from left
					y: -60, // from top-left
					duration: 1.4,
					ease: "power3.out",
				},
				"<+=0.15",
			);

			heroTL.from(
				".leaf-7",
				{
					opacity: 0,
					x: 120, // from right
					y: 90, // from below
					duration: 1.5,
					ease: "power3.out",
				},
				"<+=0.2",
			);	

			// ------------------ Headline ------------------
			heroTL
				.fromTo(
					".hero-headline",
					{ opacity: 0, y: 40 },
					{ opacity: 1, y: 0, duration: 1.0 },
					0.2,
				)
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
				"-=0.3",
			);

			// ------------------ SECOND LEAF MOTION (subtle but visible) ------------------
			heroTL.add(() => {
				gsap.to(".leaf-1", {
					x: "+=20", // small right shift
					y: "+=10", // small downward shift
					rotation: "+=5",
					duration: 1.2,
					ease: "power2.out",
				});

				gsap.to(".leaf-2", {
					x: "-=25", // small left shift
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
				"+=0.6",
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
				"+=1.2",
			);

			// ------------------ Incense small reposition ------------------
			heroTL.to(
				".incense-container",
				{
					rotation: 10,
					xPercent: -22,
					x: 60,
					y: 20,
					scale: 1.2,
					duration: 1.0,
				},
				"+=0.2",
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
				const toVars = {
					opacity: 1,
					scale: 1,
					y: 0,
					xPercent: 2,
					duration: 0.8,
					ease: "power2.out",
				};
				heroTL.fromTo(`.feature-${f.id}`, fromVars, toVars, "+=0.5");

				if (f.id === 3) {
					heroTL.to(".incense", { rotation: 340, duration: 1 }, "<");
				}

				heroTL.to(
					`.feature-${f.id}`,
					{ opacity: 0, y: -20, duration: 0.6 },
					"+=1",
				);
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
					isDesktop: "(min-width: 768px)",
				},
				(ctx) => {
					const { isMobile, isDesktop } = ctx.conditions!;

					// MOBILE VERSION
					if (isMobile) {
						heroTL.to(
							".incense-container",
							{
								xPercent: -45,
								yPercent: 37,
								rotation: 0,
								scale: 0.8,
								duration: 1.4,
								ease: "power3.out",
							},
							"+=0.2",
						);

						heroTL.to(
							".incense",
							{
								rotation: 356,
								scale: 0.8,
								duration: 1.4,
								ease: "power3.out",
							},
							"<",
						);
					}

					// DESKTOP VERSION (kept EXACTLY like you originally had it)
					if (isDesktop) {
						heroTL.to(
							".incense-container",
							{
								rotation: 0,
								xPercent: -15,
								yPercent: 10,
								scale: 1.2,
								duration: 1.4,
								ease: "power3.out",
							},
							"+=0.2",
						);

						heroTL.to(
							".incense",
							{
								rotation: 355,
								scale: 0.8,
								duration: 1.4,
								ease: "power3.out",
							},
							"<",
						);
					}
				},
			);

			// ------------------ Podium + CTA + Bags ------------------
			heroTL.fromTo(
				".podium-bg",
				{ opacity: 0, scaleY: 0.5, transformOrigin: "bottom" },
				{ opacity: 1, scaleY: 1, duration: 0.8, ease: "power2.out" },
				"+=0.2",
			);

			heroTL.to(".incense-holder", { opacity: 1, duration: 0.5 }, "<");

			// ------------------ CTA Final (responsive) ------------------
			const mm2 = gsap.matchMedia();
			mm2.add(
				{
					isMobile: "(max-width: 767px)",
					isDesktop: "(min-width: 768px)",
				},
				(ctx) => {
					const { isMobile, isDesktop } = ctx.conditions!;

					if (isMobile) {
						heroTL.fromTo(
							".cta-final",
							{ opacity: 0, y: -230 },
							{ opacity: 1, y: -190, duration: 1.0 },
							"-=1.4",
						);
					}

					if (isDesktop) {
						heroTL.fromTo(
							".cta-final",
							{ opacity: 0, y: -230 },
							{ opacity: 1, y: -290, duration: 1.0 },
							"-=1.4",
						);
					}
				},
			);

			heroTL.fromTo(
				bagLeft.current,
				{ x: -150, opacity: 0, scale: 0.8 },
				{
					x: 40,
					y: 20,
					opacity: 1,
					scale: 1,
					duration: 1.2,
					ease: "power3.out",
				},
				"+=0.2",
			);
			heroTL.fromTo(
				bagRight.current,
				{ x: 150, opacity: 0, scale: 0.8 },
				{
					x: -40,
					y: 20,
					opacity: 1,
					scale: 1,
					duration: 1.2,
					ease: "power3.out",
				},
				"<",
			);
			heroTL.fromTo(
				bagCenter.current,
				{ y: 50, opacity: 0, scale: 0.7 },
				{
					y: 0,
					opacity: 1,
					scale: 1.1,
					duration: 1.4,
					ease: "elastic.out(1,0.5)",
				},
				"<",
			);

// ------------------ Background Scroll Sync ------------------
const totalDuration = heroTL.duration();

// Reduce movement on mobile instead of disabling it
const bgMove = isMobile ? maxMovePercent * 0.35 : maxMovePercent;

if (bgImgRef.current) {
  heroTL.to(
    bgImgRef.current,
    {
      yPercent: -bgMove,
      ease: "none",
      duration: totalDuration,
    },
    0 // IMPORTANT: start at beginning of timeline
  );
}
ScrollTrigger.config({
  ignoreMobileResize: true,
});


		});

		return () => ctx.revert();
	}, [bgReady, isMobile]); // keep dependencies sensible

	// --------------------------- CONTENT ---------------------------
	const heroContent = (
		<div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
			<div className="absolute inset-0 flex flex-col items-center justify-center">
{/* SCROLL INDICATOR */}
<div className="scroll-indicator fixed top-[20%] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
  <span
    className="text-[12px] tracking-[0.3em] text-white/80"
    style={{ fontFamily: '"Afacad", sans-serif' }}
  >
    SCROLL
  </span>

  <div className="w-[2px] h-10 bg-white/70 relative overflow-hidden">
    <span className="absolute top-0 left-0 w-full h-4 bg-white animate-scrollLine" />
  </div>
</div>

				{/* Headline */}
				<div className="hero-headline absolute text-center px-4">
					<h1
						className="font-serif font-normal leading-snug text-[34px] md:text-[95px] md:leading-tight"
						style={{ fontFamily: '"Sangkala", sans-serif' }}
					>
						Fragrance That Elevates
						<br />
						The Divine Moment
					</h1>

					<p
						className="mt-4 text-[15px] md:text-[25px] text-green-200 leading-relaxed md:leading-normal md:mt-6"
						style={{ fontFamily: '"Afacad", sans-serif' }}
					>
						Rooted in tradition, perfected through craftsmanship
						<br />
						Rolet incense awakens the senses with purity, serenity, and the
						soulful rhythm of divine fragrance.
					</p>
				</div>

				{/* Product */}
				<img
					src={mainProductImg}
					alt=""
					role="presentation"
					className="product-main absolute w-[280px] md:w-[400px]"
					style={{ transform: "rotate(-20deg)", zIndex: 30 }}
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
							className={`incense ${responsiveConfig.incense.mobile.width} ${responsiveConfig.incense.mobile.height} ${responsiveConfig.incense.tablet.width} ${responsiveConfig.incense.tablet.height} ${responsiveConfig.incense.desktop.width} ${responsiveConfig.incense.desktop.height} object-contain`}
							style={{ transform: "translateY(1rem)", zIndex: 20 }}
						/>

						{/* 🕯️ Holder */}
						<img
							src={incenseHolderImg}
							alt="Incense Holder"
							className="incense-holder absolute opacity-0"
							style={{
								zIndex: 12,
								width: responsiveConfig.incense.mobile.holderWidth,
								top: responsiveConfig.incense.mobile.holderTop,
								left: responsiveConfig.incense.mobile.holderLeft,
							}}
						/>
					</div>

					{/* DESKTOP OVERRIDES - styles already applied via inline style */}
				</div>

				{/* Features */}
				{featuresData.map((f) => (
					<div
						key={f.id}
						className={`feature-${f.id} feature absolute opacity-0 z-20 flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-6 w-full`}
					>
						<img
							src={f.icon}
							alt={f.title}
							loading="lazy"
							className="w-16 h-16 md:w-20 md:h-20 object-contain"
						/>

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
					<p
						className="mb-4 text-green-200 text-[18px] md:text-[32px]"
						style={{ fontFamily: '"Afacad", sans-serif' }}
					>
						Unveil a world of refined aromas crafted to awaken the senses and
						elevate your everyday rituals.
					</p>
					<Link href="/products" className="inline-block">
						<button className="px-8 py-3 bg-white text-black font-semibold tracking-wider rounded-[25px] shadow-lg hover:bg-gray-100 transition-colors">
							EXPLORE NOW
						</button>
					</Link>
				</div>

				{/* Bottom Showcase */}
				<div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center">
					{/* Bags Row */}
					<div
						className={`relative z-10 flex justify-center items-end w-full ${responsiveConfig.bags.mobile.maxWidth} ${responsiveConfig.bags.tablet.maxWidth} ${responsiveConfig.bags.desktop.maxWidth} ${responsiveConfig.bags.mobile.container} ${responsiveConfig.bags.tablet.container} ${responsiveConfig.bags.desktop.container}`}
					>
						<img
							ref={bagLeft}
							src={bag2}
							alt="Product Bag Left"
							loading="lazy"
							className={`${responsiveConfig.bags.mobile.left} ${responsiveConfig.bags.tablet.left} ${responsiveConfig.bags.desktop.left} object-contain opacity-0`}
						/>
						<img
							ref={bagCenter}
							src={bag1}
							alt="Product Bag Center"
							loading="lazy"
							className={`${responsiveConfig.bags.mobile.center} ${responsiveConfig.bags.tablet.center} ${responsiveConfig.bags.desktop.center} object-contain -mx-4 relative z-20 opacity-0`}
						/>
						<img
							ref={bagRight}
							src={bag3}
							alt="Product Bag Right"
							loading="lazy"
							className={`${responsiveConfig.bags.mobile.right} ${responsiveConfig.bags.tablet.right} ${responsiveConfig.bags.desktop.right} object-contain opacity-0`}
						/>
					</div>

					{/* Podium - keep 2mm gap below bags across all screens */}
					<div
						className={`podium-bg w-full mt-[2mm] ${responsiveConfig.podium.mobile.height} ${responsiveConfig.podium.tablet.height} ${responsiveConfig.podium.desktop.height} bg-no-repeat opacity-0 ${responsiveConfig.podium.mobile.backgroundSize} ${responsiveConfig.podium.tablet.backgroundSize} ${responsiveConfig.podium.desktop.backgroundSize} ${responsiveConfig.podium.mobile.backgroundPosition} ${responsiveConfig.podium.tablet.backgroundPosition} ${responsiveConfig.podium.desktop.backgroundPosition}`}
						style={{
							backgroundImage: `url(${podiumBaseImg})`,
							zIndex: -10,
							transformOrigin: "50% 100%",
						}}
					/>
				</div>
			</div>
		</div>
	);

	// --------------------------- RENDER ---------------------------
	return (
		<div className="min-h-[300vh] font-['Inter']">
			{/* WEBSITE LOADER */}
{!bgReady && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <span
        className="text-xs tracking-[0.3em] text-white/70"
        style={{ fontFamily: '"Afacad", sans-serif' }}
      >
        LOADING
      </span>
    </div>
  </div>
)}

			<section
				ref={heroRef}
				className="relative w-full overflow-hidden"
				style={{ height: "100svh" }}
			>
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
					<img
						src="/Leaves-04.png"
						alt="Decorative leaf 1"
						className="leaf leaf-1"
					/>
					<img
						src="/Leaves-05.png"
						alt="Decorative leaf 2"
						className="leaf leaf-2"
					/>
					<img
						src="/Leaves-03.png"
						alt="Decorative leaf 3"
						className="leaf leaf-3"
					/>
					<img
						src="/Leaves-02.png"
						alt="Decorative leaf 4"
						className="leaf leaf-4"
					/>
					<img
						src="/Leaves-04.png"
						alt="Decorative leaf 5"
						className="leaf leaf-5"
					/>
					<img
						src="/Leaves-03.png"
						alt="Decorative leaf 6"
						className="leaf leaf-6"
					/>
					<img
						src="/Leaves-04.png"
						alt="Decorative leaf 7"
						className="leaf leaf-7"
					/>
				</div>
				{heroContent}
			</section>
		</div>
	);
}
