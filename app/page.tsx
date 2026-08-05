"use client";

import { useEffect, useRef, useState } from "react";

const products = [
  ["Billard Club", "billard-club"], ["Mehari Seat", "mehari-seat"],
  ["Sardines Can", "sardines-can"], ["Ferrari F40", "ferrari-f40"],
  ["Nostalgia", "nostalgia"], ["Sunflower", "sunflower"],
  ["Homard", "homard"], ["Kurage", "kurage"],
  ["Le Teckel", "le-teckel-rose"], ["Bunch Tomato", "bunch-tomato"],
  ["Supra MK4", "supra-mk4"], ["Nishikigoi", "nishikigoi"],
] as const;

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
    const move = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY, visible: true });
    window.addEventListener("keydown", escape);
    window.addEventListener("mousemove", move);
    return () => { window.removeEventListener("keydown", escape); window.removeEventListener("mousemove", move); };
  }, []);

  useEffect(() => {
    if (search) window.setTimeout(() => searchInputRef.current?.focus(), 350);
  }, [search]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) entry.target.classList.add("isVisible");
    }, { threshold: 0.24 });
    if (revealRef.current) observer.observe(revealRef.current);
    return () => observer.disconnect();
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
            <span className="introWordmark" />
            <strong>Graphiste et créateur d&apos;Affiches</strong>
          </div>
          <IntroPosterStack />
          <IntroPosterStack second />
        </div>
      )}
      <div className={`tigerCursor ${cursor.visible ? "visible" : ""}`} style={{ transform: `translate3d(${cursor.x - 15}px,${cursor.y - 14}px,0)` }}>
        <img src="/assets/tiger.png" alt="" />
      </div>

      <header className="siteHeader">
        <div className="navBar">
          <button className={`menuButton ${menu ? "open" : ""}`} onClick={() => { setMenu(!menu); setSearch(false); setCart(false); }} aria-label="Menu">
            <span /><span /><span />
          </button>
          <a className="logoLink" href="#top" aria-label="GRIPH accueil"><img src="/assets/logo.png" alt="GRIPH" /></a>
          <div className="navActions">
            <button onClick={() => { setSearch(true); setMenu(false); setCart(false); }} aria-label="Rechercher"><SearchIcon /></button>
            <button onClick={() => { setCart(true); setMenu(false); setSearch(false); }} aria-label="Panier"><BagIcon /><b>0</b></button>
          </div>
        </div>
        <div className="promoStrip">
          <span>LIVRAISON OFFERTE DÈS 35€ D&apos;ACHAT</span>
          <span>COMMANDES EXPÉDIÉES SOUS 24H</span>
          <span>RETOUR GRATUIT</span>
        </div>
      </header>

      <aside className={`menuPanel ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <div className="menuWords"><a href="#selection">AFFICHES</a><a href="#footer">À PROPOS</a></div>
        <img src="/assets/tiger.png" alt="" />
        <div className="socialMenu"><a href="https://www.instagram.com/griph_art/">◎ Instagram</a><a href="https://www.tiktok.com/@griph_art">♪ Tiktok</a><a href="https://fr.pinterest.com/griph_art/">ⓟ Pinterest</a></div>
      </aside>

      <section className="hero" id="top">
        <img className="heroImage" src="/assets/hero.jpg" alt="Salon contemporain décoré d'affiches GRIPH" />
        <div className="heroShade" />
        <div className={`heroFlash ${flash ? "active" : ""}`} />
        <div className="heroCopy">
          <h1><span>GRAPHISTE</span><span>ET CRÉATEUR</span><span>D’AFFICHES</span></h1>
          <p>Découvrez GRIPH : des affiches d&apos;art contemporain<br className="desktopBreak" /> vibrantes, ultra-tendances et enfin abordables. Parce<br className="desktopBreak" /> que votre déco ne devrait jamais être ennuyeuse.</p>
          <a href="#selection">VOIR LE CATALOGUE</a>
        </div>
        <div className="heroArrows"><button onClick={heroFlash} aria-label="Précédent">←</button><button onClick={heroFlash} aria-label="Suivant">→</button></div>
      </section>

      <section className="selection" id="selection">
        <div className="sectionTitle"><h2>La séléction du tigre</h2><a href="#selection">Voir tout</a></div>
        <div className="posterRail" onMouseLeave={() => setActive(11)}>
          {products.map(([name, slug], index) => (
            <a key={slug} href={`#${slug}`} className={`posterItem ${active === index ? "active" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}>
              <img src={`/assets/poster-${index + 1}.png`} alt={name} />
              <div className="posterMeta"><span>{name}</span><small>à partir de 11,90€</small></div>
            </a>
          ))}
        </div>
      </section>

      <section className="featureCards" ref={revealRef}>
        <a className="featureCard aboutCard" href="#footer">
          <strong>À PROPOS</strong>
          <div className="burst b1">✦</div><div className="burst b2">✦</div>
          <img src="/assets/tiger.png" alt="" />
        </a>
        <a className="featureCard catalogueCard" href="#selection"><img src="/assets/catalogue-card.png" alt="GRIPH Catalogue" /></a>
      </section>

      <footer id="footer">
        <div className="footerBrand"><img src="/assets/footer-wordmark.png" alt="GRIPH" /><h2>Graphiste et créateur d&apos;affiche</h2>
          <p>Livraison en France &amp; Europe<br />Expédié sous 48h<br />Envoie protégé en tube rigide<br />Impression en France, Papier 250g satiné<br />Paiement 100% sécurisé</p>
        </div>
        <img className="footerTiger" src="/assets/tiger.png" alt="" />
        <div className="footerLinks"><p><b>Contact</b><br />griph.contact@gmail.com</p><div><a href="https://www.instagram.com/griph_art/">Instagram</a><a href="https://www.tiktok.com/@griph_art">Tiktok</a><a href="https://fr.pinterest.com/griph_art/">Pinterest</a><a href="#">Privacy Policy</a><a href="#">Refund Policy</a><a href="#">Terms of service</a></div><a href="#">2026 GRIPH, made by @currymango</a></div>
      </footer>

      <div className={`modalBackdrop ${search ? "open" : ""}`} onClick={() => setSearch(false)} aria-hidden={!search}>
        <div className="searchBox" onClick={(e) => e.stopPropagation()}><SearchIcon /><input ref={searchInputRef} placeholder="Search..." aria-label="Search..." /></div>
      </div>

      <div className={`drawerBackdrop ${cart ? "open" : ""}`} onClick={() => setCart(false)} />
      <aside className={`cartDrawer ${cart ? "open" : ""}`} aria-hidden={!cart}>
        <div className="cartTop"><h2>Panier</h2><button onClick={() => setCart(false)} aria-label="Fermer">×</button></div>
        <p className="emptyCart">Votre panier est vide</p>
        <div className="cartBottom"><div><span>Livraison</span><span>Offerte dès 35€ d&apos;achat</span></div><div className="total"><b>Total</b><b>0€</b></div><button disabled>Paiement</button></div>
      </aside>
    </main>
  );
}
