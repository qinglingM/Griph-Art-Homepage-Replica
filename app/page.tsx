"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS, formatPrice, type Product } from "./products";
import { useCart } from "./useCart";

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
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState(false);
  const [flash, setFlash] = useState(false);
  const [active, setActive] = useState(11);
  const [toast, setToast] = useState("");
  const [ordered, setOrdered] = useState(false);
  const [cursor, setCursor] = useState({ x: -80, y: -80, visible: false });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef(0);

  const bag = useCart();
  const { add: addToCart } = bag;

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

  const closeSearch = useCallback(() => { setSearch(false); setQuery(""); }, []);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenu(false); setSearch(false); setQuery(""); setCart(false); }
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

  // Any open overlay locks background scrolling.
  useEffect(() => {
    const locked = menu || search || cart;
    document.body.classList.toggle("overlayLocked", locked);
    return () => document.body.classList.remove("overlayLocked");
  }, [menu, search, cart]);

  useEffect(() => {
    const target = revealRef.current;
    if (!target) return;
    let revealed = false;
    let poll = 0;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      target.classList.add("isVisible");
      if (poll) window.clearInterval(poll);
    };
    const checkVisible = () => {
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewportHeight * 0.9 && rect.bottom > 0) reveal();
    };
    // Hide only now that the reveal machinery is guaranteed to be installed.
    target.classList.add("preReveal");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reveal();
    }, { threshold: 0.2 });
    observer.observe(target);
    window.addEventListener("scroll", checkVisible, { passive: true });
    window.addEventListener("resize", checkVisible);
    poll = window.setInterval(checkVisible, 300);
    checkVisible();
    // Hard stop: the content is never allowed to stay hidden.
    const failsafe = window.setTimeout(reveal, 6000);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisible);
      window.removeEventListener("resize", checkVisible);
      window.clearInterval(poll);
      window.clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2200);
  }, []);

  const addProduct = useCallback((product: Product) => {
    addToCart(product);
    setOrdered(false);
    notify(`${product.name} added to your bag`);
  }, [addToCart, notify]);

  const focusDeck = useCallback((index: number) => {
    setActive(index);
    const rail = railRef.current;
    const item = rail?.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  const step = useCallback((direction: number) => {
    setFlash(true);
    window.setTimeout(() => setFlash(false), 650);
    const next = (active + direction + PRODUCTS.length) % PRODUCTS.length;
    focusDeck(next);
  }, [active, focusDeck]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(term) || product.artist.toLowerCase().includes(term),
    );
  }, [query]);

  const featured = PRODUCTS[4];

  const checkout = () => {
    if (!bag.count) return;
    bag.clear();
    setOrdered(true);
    notify("Order placed — thanks for riding the art");
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
          <button className={`menuButton ${menu ? "open" : ""}`} onClick={() => { setMenu(!menu); closeSearch(); setCart(false); }} aria-label="Menu" aria-expanded={menu}>
            <span /><span /><span />
          </button>
          <a className="logoLink" href="#top" aria-label="PLY/FORM home"><span className="navWordmark">PLY/FORM</span></a>
          <div className="navActions">
            <button onClick={() => { setSearch(true); setMenu(false); setCart(false); }} aria-label="Search"><SearchIcon /></button>
            <button onClick={() => { setCart(true); setMenu(false); closeSearch(); }} aria-label={`Bag, ${bag.count} items`}><BagIcon /><b>{bag.count}</b></button>
          </div>
        </div>
        <div className="promoStrip">
          <span>FREE SHIPPING ON ORDERS OVER €80</span>
          <span>NUMBERED ARTIST EDITIONS</span>
          <span>30-DAY RETURNS</span>
        </div>
      </header>

      <aside className={`menuPanel ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <div className="menuWords">
          <a href="#selection" onClick={() => setMenu(false)}>DECKS</a>
          <a href="#footer" onClick={() => setMenu(false)}>ARTISTS</a>
        </div>
        <img src="/assets/raccoon.png" alt="" />
        <div className="socialMenu">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">◎ Instagram</a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer">♪ Tiktok</a>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer">ⓟ Pinterest</a>
        </div>
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
        <div className="heroArrows">
          <button onClick={() => step(-1)} aria-label="Previous deck">←</button>
          <button onClick={() => step(1)} aria-label="Next deck">→</button>
        </div>
      </section>

      <section className="selection" id="selection">
        <div className="sectionTitle"><h2>The raccoon&apos;s latest drop</h2><a href="#footer">View all decks</a></div>
        <div className="posterRail" ref={railRef}>
          {PRODUCTS.map((product, index) => (
            <article
              key={product.slug}
              id={product.slug}
              className={`posterItem ${active === index ? "active" : ""}`}
              onMouseEnter={() => setActive(index)}
            >
              <div className="deckShape"><img src={product.image} alt={`${product.name} skateboard deck by ${product.artist}`} /></div>
              <div className="posterMeta">
                <span>{product.name}</span>
                <small>{product.artist} · {formatPrice(product.price)}</small>
                <button className="addButton" onClick={() => addProduct(product)}>ADD TO BAG</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="featureCards" ref={revealRef}>
        <a className="featureCard aboutCard" href="#footer">
          <strong>THE ARTISTS</strong>
          <div className="burst b1">✦</div><div className="burst b2">✦</div>
          <img src="/assets/raccoon.png" alt="" />
        </a>
        <button className="featureCard catalogueCard" onClick={() => addProduct(featured)}>
          <div className="featuredDeck"><img src={featured.image} alt={`${featured.name} limited skateboard deck`} /></div>
          <div className="dropCopy">
            <small>DROP 04 / 100 MADE</small>
            <strong>{featured.name.toUpperCase()}</strong>
            <span>BY {featured.artist.toUpperCase()} →</span>
          </div>
        </button>
      </section>

      <footer id="footer">
        <div className="footerBrand"><div className="footerWordmark">PLY/FORM</div><h2>Artist-made skateboard decks</h2>
          <p>7-ply Canadian maple<br />Numbered artist editions<br />Pressed and printed in Europe<br />Deck only — 8.25&quot; standard width<br />Secure worldwide shipping</p>
        </div>
        <img className="footerMascot" src="/assets/raccoon.png" alt="" />
        <div className="footerLinks">
          <p><b>Studio</b><br />studio@plyform.co</p>
          <div>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">Tiktok</a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a>
            <a href="#selection">Shipping</a>
            <a href="#selection">Returns</a>
            <a href="#selection">Terms</a>
          </div>
          <a href="#top">2026 PLY/FORM — RIDE THE ART</a>
        </div>
      </footer>

      <div className={`modalBackdrop ${search ? "open" : ""}`} onClick={closeSearch} aria-hidden={!search}>
        <div className="searchPanel" onClick={(e) => e.stopPropagation()}>
          <div className="searchBox">
            <SearchIcon />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search decks or artists..."
              aria-label="Search decks or artists"
            />
          </div>
          {query.trim() && (
            <div className="searchResults">
              {results.length === 0 && <p className="searchEmpty">No decks match “{query.trim()}”</p>}
              {results.map((product) => (
                <button key={product.slug} className="searchResult" onClick={() => { addProduct(product); closeSearch(); }}>
                  <img src={product.image} alt="" />
                  <span><b>{product.name}</b><small>{product.artist}</small></span>
                  <em>{formatPrice(product.price)}</em>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`drawerBackdrop ${cart ? "open" : ""}`} onClick={() => setCart(false)} />
      <aside className={`cartDrawer ${cart ? "open" : ""}`} aria-hidden={!cart}>
        <div className="cartTop"><h2>Your bag</h2><button onClick={() => setCart(false)} aria-label="Close">×</button></div>
        {bag.lines.length === 0 ? (
          <p className="emptyCart">{ordered ? "Order placed — thanks for riding the art" : "No decks in your bag yet"}</p>
        ) : (
          <div className="cartLines">
            {bag.lines.map((line) => (
              <div className="cartLine" key={line.slug}>
                <img src={line.image} alt="" />
                <div className="cartLineInfo">
                  <b>{line.name}</b>
                  <small>{line.artist}</small>
                  <div className="qtyControls">
                    <button onClick={() => bag.setQty(line.slug, line.qty - 1)} aria-label={`Decrease ${line.name}`}>−</button>
                    <span>{line.qty}</span>
                    <button onClick={() => bag.setQty(line.slug, line.qty + 1)} aria-label={`Increase ${line.name}`}>+</button>
                    <button className="removeLine" onClick={() => bag.remove(line.slug)}>Remove</button>
                  </div>
                </div>
                <em>{formatPrice(line.price * line.qty)}</em>
              </div>
            ))}
          </div>
        )}
        <div className="cartBottom">
          <div><span>Shipping</span><span>{bag.shipping === 0 ? "Free over €80" : formatPrice(bag.shipping)}</span></div>
          <div className="total"><b>Total</b><b>{formatPrice(bag.total)}</b></div>
          <button disabled={bag.count === 0} onClick={checkout}>Checkout</button>
        </div>
      </aside>

      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </main>
  );
}
