"use client";

import { useEffect, useRef, useState } from "react";

const products = [
  ["Night Swim", "night-swim", "Maya Kline"], ["Back Alley", "back-alley", "Noah Park"],
  ["Lucky Sardine", "lucky-sardine", "Studio Pêche"], ["Redline", "redline", "Lucas Ferri"],
  ["After School", "after-school", "Nina Vale"], ["Sun Ritual", "sun-ritual", "Ari Bloom"],
  ["Blue Lobster", "blue-lobster", "Maison Crabe"], ["Jelly Drift", "jelly-drift", "Yoko Mori"],
  ["Long Dog", "long-dog", "Camille Rose"], ["Tomato Club", "tomato-club", "Bodega Lab"],
  ["Midnight Run", "midnight-run", "Kaito Ishii"], ["Koi Study 02", "koi-study-02", "Hana Sato"],
  ["Soft Static", "soft-static", "Milo Arden"], ["Acid Bloom", "acid-bloom", "Lena Sanz"],
  ["Poolside Ghost", "poolside-ghost", "Theo Sun"], ["Signal Fire", "signal-fire", "Rae Ito"],
] as const;

const deckAssets = [
  ...Array.from({ length: 12 }, (_, index) => `/assets/poster-${index + 1}.png`),
  "/assets/intro-12.png", "/assets/intro-13.png", "/assets/intro-14.png", "/assets/intro-15.png",
];

function SearchIcon() {
  return <span className="searchIcon" aria-hidden="true" />;
}

function BagIcon() {
  return <span className="bagIcon" aria-hidden="true"><i /></span>;
}

function IntroPosterStack({ second = false }: { second?: boolean }) {
  return (
    <div className={`posterWipe ${second ? "wipeTwo" : "wipeOne"}`}>
      {Array.from({ length: 15 }, (_, index) => (
        <img key={index} className={`introPoster introPoster${index + 1}`} src={`/assets/intro-${index + 1}.png`} alt="" />
      ))}
    </div>
  );
}

export default function Home() {
  const [intro, setIntro] = useState(true);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [cart, setCart] = useState(false);
  const [flash, setFlash] = useState(false);
  const [active, setActive] = useState(11);
  const [cursor, setCursor] = useState({ x: -80, y: -80, visible: false });
  const revealRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.classList.add("introLocked");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setIntro(false);
      document.body.classList.remove("introLocked");
    }, reduced ? 80 : 2720);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("introLocked");
    };
  }, []);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenu(false); setSearch(false); setCart(false); }
    };
    const move = (event: MouseEvent) => {
      setCursor({ x: event.clientX, y: event.clientY, visible: true });
      document.body.classList.add("customCursorActive");
    };
    window.addEventListener("keydown", escape);
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("customCursorActive");
    };
  }, []);

  useEffect(() => {
    if (search) window.setTimeout(() => searchInputRef.current?.focus(), 350);
  }, [search]);

  useEffect(() => {
    const target = revealRef.current;
    if (!target) return;
    const reveal = () => target.classList.add("isVisible");
    const checkVisible = () => {
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewportHeight * 0.85 && rect.bottom > 0) reveal();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reveal();
    }, { threshold: 0.24 });
    observer.observe(target);
    // Fallback in case IntersectionObserver doesn't fire in this environment.
    window.addEventListener("scroll", checkVisible, { passive: true });
    window.addEventListener("resize", checkVisible);
    checkVisible();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisible);
      window.removeEventListener("resize", checkVisible);
    };
  }, []);

  const heroFlash = () => {
    setFlash(true);
    window.setTimeout(() => setFlash(false), 650);
  };

  return (
    <main>
      {intro && (
        <div className="introOverlay" aria-hidden="true">
          <div className="introIdentity">
            <span className="introWordmark">PLY/FORM</span>
            <strong>Artist-made decks. Built to be ridden.</strong>
          </div>
          <IntroPosterStack />
          <IntroPosterStack second />
        </div>
      )}
      <div className={`mascotCursor ${cursor.visible ? "visible" : ""}`} style={{ transform: `translate3d(${cursor.x - 15}px,${cursor.y - 14}px,0)` }}>
        <img src="/assets/raccoon.png" alt="" />
      </div>

      <header className="siteHeader">
        <div className="navBar">
          <button className={`menuButton ${menu ? "open" : ""}`} onClick={() => { setMenu(!menu); setSearch(false); setCart(false); }} aria-label="Menu">
            <span /><span /><span />
          </button>
          <a className="logoLink" href="#top" aria-label="PLY/FORM home"><span className="navWordmark">PLY/FORM</span></a>
          <div className="navActions">
            <button onClick={() => { setSearch(true); setMenu(false); setCart(false); }} aria-label="Rechercher"><SearchIcon /></button>
            <button onClick={() => { setCart(true); setMenu(false); setSearch(false); }} aria-label="Panier"><BagIcon /><b>0</b></button>
          </div>
        </div>
        <div className="promoStrip">
          <span>FREE SHIPPING ON ORDERS OVER €80</span>
          <span>NUMBERED ARTIST EDITIONS</span>
          <span>30-DAY RETURNS</span>
        </div>
      </header>

      <aside className={`menuPanel ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <div className="menuWords"><a href="#selection">DECKS</a><a href="#footer">ARTISTS</a></div>
        <img src="/assets/raccoon.png" alt="" />
        <div className="socialMenu"><a href="#">◎ Instagram</a><a href="#">♪ Tiktok</a><a href="#">ⓟ Pinterest</a></div>
      </aside>

      <section className="hero" id="top">
        <img className="heroImage" src="/assets/skate-hero.png" alt="PLY/FORM artist skateboard gallery" />
        <div className="heroShade" />
        <div className={`heroFlash ${flash ? "active" : ""}`} />
        <div className="heroCopy">
          <h1><span>ART</span><span>UNDER</span><span>YOUR FEET</span></h1>
          <p>Limited skateboard decks created with independent artists.<br className="desktopBreak" /> Canadian maple, screen-ready color and numbered editions.<br className="desktopBreak" /> Hang it on the wall—or take it to the street.</p>
          <a href="#selection">SHOP THE DROP</a>
        </div>
        <div className="heroArrows"><button onClick={heroFlash} aria-label="Précédent">←</button><button onClick={heroFlash} aria-label="Suivant">→</button></div>
      </section>

      <section className="selection" id="selection">
        <div className="sectionTitle"><h2>The raccoon&apos;s latest drop</h2><a href="#selection">View all decks</a></div>
        <div className="posterRail" onMouseLeave={() => setActive(11)}>
          {products.map(([name, slug, artist], index) => (
            <a key={slug} href={`#${slug}`} className={`posterItem ${active === index ? "active" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}>
              <div className="deckShape"><img src={deckAssets[index]} alt={`${name} skateboard deck by ${artist}`} /></div>
              <div className="posterMeta"><span>{name}</span><small>{artist} · €89.00</small></div>
            </a>
          ))}
        </div>
      </section>

      <section className="featureCards" ref={revealRef}>
        <a className="featureCard aboutCard" href="#footer">
          <strong>THE ARTISTS</strong>
          <div className="burst b1">✦</div><div className="burst b2">✦</div>
          <img src="/assets/raccoon.png" alt="" />
        </a>
        <a className="featureCard catalogueCard" href="#selection"><div className="featuredDeck"><img src="/assets/poster-5.png" alt="After School limited skateboard deck" /></div><div className="dropCopy"><small>DROP 04 / 100 MADE</small><strong>AFTER SCHOOL</strong><span>BY NINA VALE →</span></div></a>
      </section>

      <footer id="footer">
        <div className="footerBrand"><div className="footerWordmark">PLY/FORM</div><h2>Artist-made skateboard decks</h2>
          <p>7-ply Canadian maple<br />Numbered artist editions<br />Pressed and printed in Europe<br />Deck only — 8.25&quot; standard width<br />Secure worldwide shipping</p>
        </div>
        <img className="footerMascot" src="/assets/raccoon.png" alt="" />
        <div className="footerLinks"><p><b>Studio</b><br />studio@plyform.co</p><div><a href="#">Instagram</a><a href="#">Tiktok</a><a href="#">Pinterest</a><a href="#">Shipping</a><a href="#">Returns</a><a href="#">Terms</a></div><a href="#">2026 PLY/FORM — RIDE THE ART</a></div>
      </footer>

      <div className={`modalBackdrop ${search ? "open" : ""}`} onClick={() => setSearch(false)} aria-hidden={!search}>
        <div className="searchBox" onClick={(e) => e.stopPropagation()}><SearchIcon /><input ref={searchInputRef} placeholder="Search decks or artists..." aria-label="Search decks or artists" /></div>
      </div>

      <div className={`drawerBackdrop ${cart ? "open" : ""}`} onClick={() => setCart(false)} />
      <aside className={`cartDrawer ${cart ? "open" : ""}`} aria-hidden={!cart}>
        <div className="cartTop"><h2>Your bag</h2><button onClick={() => setCart(false)} aria-label="Close">×</button></div>
        <p className="emptyCart">No decks in your bag yet</p>
        <div className="cartBottom"><div><span>Shipping</span><span>Free over €80</span></div><div className="total"><b>Total</b><b>€0</b></div><button disabled>Checkout</button></div>
      </aside>
    </main>
  );
}
