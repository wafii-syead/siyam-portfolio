'use client';
import Image from 'next/image';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { animate, stagger } from 'motion';
import { motion, MotionConfig, AnimatePresence } from 'motion/react';
import { identity, socialLinks, navigation, services, projects, featuredStory, playground, processSteps, faqs, optionalSections, additionalFacebookPage, type Project } from '@/lib/content';
import { Asterisk, Icon, Smile } from './icons';
import { ContactForm } from './contact-form';

function External({ href, children, className = '', ...rest }: React.ComponentProps<'a'>) { return <a {...rest} href={href} className={className} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> (opens in a new tab)</span></a>; }
function Wordmark() { return <span className="wordmark">SHARIYAR<br/>SIYAM<Asterisk /></span>; }
function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) { return <div className="section-label"><span>{number} /</span>{children}</div>; }

export default function Portfolio({ contactEnabled, year }: { contactEnabled: boolean; year: number }) {
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState('');
  const [filter, setFilter] = useState('All');
  const [service, setService] = useState('');
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const shown = projects.filter(p => filter === 'All' || p.category === filter);
  const currentProject = galleryIndex === null ? null : projects[galleryIndex];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem('siyam-reduce-motion'); } catch { /* Preferences are optional. */ }
      setReduced(saved === null ? media.matches : saved === 'true');
    };
    sync(); setMounted(true); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.reduced = String(reduced);
    return () => { delete document.documentElement.dataset.reduced; };
  }, [reduced]);
  useEffect(() => {
    const syncVisibility = () => { document.documentElement.dataset.pageHidden = String(document.hidden); };
    syncVisibility(); document.addEventListener('visibilitychange', syncVisibility);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      (entry.target as HTMLElement).dataset.offscreen = String(!entry.isIntersecting);
    }));
    document.querySelectorAll('[data-continuous]').forEach(el => observer.observe(el));
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', syncVisibility); delete document.documentElement.dataset.pageHidden; };
  }, []);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--progress', `${height > 0 ? scrollY / height : 0}`);
      setScrolled(scrollY > 450); ticking = false;
    };
    const scroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    update(); addEventListener('scroll', scroll, { passive: true }); addEventListener('resize', scroll);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-15% 0px -65% 0px' });
    navigation.forEach(name => { const el = document.getElementById(name.toLowerCase()); if (el) observer.observe(el); });
    return () => { removeEventListener('scroll', scroll); removeEventListener('resize', scroll); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (!mounted || reduced) return;
    const animations: { stop: () => void }[] = [];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      el.dataset.revealed = 'true';
      animations.push(animate(el, { opacity: [0.3, 1], y: [20, 0] }, { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }));
      observer.unobserve(el);
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    animations.push(animate('.hero-line', { opacity: [0.7, 1], y: [18, 0] }, { duration: 0.6, delay: stagger(0.09) }));
    return () => { observer.disconnect(); animations.forEach(a => a.stop()); document.querySelectorAll<HTMLElement>('.reveal, .hero-line').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; }); };
  }, [mounted, reduced]);
  useEffect(() => {
    const dialog = galleryRef.current;
    if (galleryIndex !== null && dialog && !dialog.open) dialog.showModal();
    if (galleryIndex === null && dialog?.open) dialog.close();
  }, [galleryIndex]);

  function toggleMotion() { const value = !reduced; setReduced(value); try { localStorage.setItem('siyam-reduce-motion', String(value)); } catch { /* No persistence needed. */ } }
  function selectService(id: string) {
    setService(id);
    if (contactEnabled) setTimeout(() => document.getElementById('contact-service')?.focus({ preventScroll: true }), 500);
  }
  function pointer(event: MouseEvent<HTMLElement>) {
    if (reduced || !matchMedia('(pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width - 0.5) * 10}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - 0.5) * 10}px`);
  }
  function resetPointer(event: MouseEvent<HTMLElement>) { event.currentTarget.style.setProperty('--pointer-x', '0px'); event.currentTarget.style.setProperty('--pointer-y', '0px'); }
  function openGallery(project: Project, target: HTMLElement) { returnFocus.current = target; setGalleryIndex(projects.findIndex(p => p.id === project.id)); }
  function closeGallery() { setGalleryIndex(null); galleryRef.current?.close(); returnFocus.current?.focus(); }
  function closeMenu() { menuRef.current?.close(); }

  return <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
    <a href="#main" className="skip-link">Skip to content</a>
    <div className="scroll-progress" aria-hidden="true" />
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="logo-link" aria-label="Shariyar Siyam, back to top"><Wordmark /></a>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <a key={item} className={active === item.toLowerCase() ? 'active' : ''} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav>
        <div className="header-actions"><button className="motion-toggle" aria-pressed={reduced} onClick={toggleMotion} title="Reduce animation"><span className={`motion-dot ${reduced ? 'off' : ''}`} />Reduce motion</button><a href="#contact" className="button dark header-cta">Let’s work together<Icon /></a><button className="menu-toggle icon-button" aria-label="Open navigation" aria-haspopup="dialog" onClick={() => menuRef.current?.showModal()}><Icon name="menu" /></button></div>
      </div>
    </header>
    <dialog className="mobile-menu" ref={menuRef} aria-labelledby="menu-title"><div className="mobile-menu-head"><span id="menu-title"><Wordmark /></span><button className="icon-button" autoFocus aria-label="Close navigation" onClick={closeMenu}><Icon name="close" /></button></div><nav aria-label="Mobile navigation">{navigation.map((item, i) => <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu}><span>0{i + 1}</span>{item}<Icon name="diagonal" /></a>)}</nav><p>Good ideas start with a conversation.</p><a className="button dark" href="#contact" onClick={closeMenu}>Let’s talk<Icon /></a></dialog>
    <noscript><nav className="no-js-nav">{navigation.map(item => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav></noscript>
    <main id="main">
      <section className="hero container" id="top">
        <div className="hero-copy"><p className="eyebrow hero-eyebrow"><span className="tiny-star">✳</span> GRAPHIC DESIGNER · UI/UX DESIGNER · CANVA EXPERT</p><h1><span className="hero-line">I DESIGN BRANDS</span><span className="hero-line">& <span className="accent handwritten-underline">DIGITAL</span></span><span className="hero-line accent">EXPERIENCES</span><span className="hero-line">THAT STAND OUT.</span></h1><p className="hero-description">{identity.bio}</p><div className="hero-buttons"><a className="button dark magnetic" href="#work" onMouseMove={pointer} onMouseLeave={resetPointer}>View my work<Icon /></a><a className="text-link" href="#contact">Let’s talk<Icon name="diagonal" /></a></div></div>
        <div className="hero-art" onMouseMove={pointer} onMouseLeave={resetPointer} data-continuous>
          <div className="brush" aria-hidden="true" />
          <svg className="crown sketch" viewBox="0 0 150 90" aria-hidden="true"><path d="m10 65 7-49 35 35L72 7l18 46 46-27-17 53L10 65Z" /></svg>
          <div className="portrait-frame"><Image src="/images/portrait.webp" alt="Shariyar Siyam, smiling against an orange background" width={611} height={610} priority sizes="(max-width: 700px) 85vw, (max-width: 1024px) 44vw, 500px" /><div className="portrait-caption"><span>A LITTLE BOLD.<br/>A LOT OF PURPOSE.</span><Icon name="spark" /></div></div>
          <div className="name-sticker float"><span>HELLO, I’M</span><strong>SIYAM.</strong><svg viewBox="0 0 130 25" className="sketch" aria-hidden="true"><path d="M4 15Q65-6 125 10M13 22l105-5" /></svg></div>
          <Smile className="hero-smile float" /><Asterisk className="hero-star float" />
          <svg className="hero-scribble sketch" viewBox="0 0 150 120" aria-hidden="true"><path d="m8 80 96-63L22 99l113-68L56 111l85-43" /></svg>
          <span className="handwritten portrait-note">a face behind the pixels</span>
        </div>
        <div className="hero-bottom"><span>BRAND THINKING. DIGITAL FEELING.</span><a href="#work">A SCROLL THROUGH MY WORLD<Icon name="down" /></a></div>
      </section>
      <div className={`discipline-ribbon ${paused ? 'is-paused' : ''}`} data-continuous>
        <div className="ribbon-viewport"><div className="ribbon-track">{[0, 1].map(n => <span key={n} aria-hidden={n === 1}>{['GRAPHIC DESIGN', 'UI/UX DESIGN', 'BRAND IDENTITY', 'CANVA TEMPLATES', 'SOCIAL MEDIA DESIGN'].map(t => <span key={t}>{t}<Asterisk /></span>)}</span>)}</div></div>
        <button onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume scrolling ribbon' : 'Pause scrolling ribbon'} aria-pressed={paused} className="ribbon-control"><Icon name={paused ? 'resume' : 'pause'} /></button>
      </div>

      <section id="work" className="work-section section dark-section">
        <div className="container"><SectionLabel number="01">SELECTED WORK</SectionLabel><div className="section-heading reveal"><h2>GOOD IDEAS.<br/><span className="yellow">REAL DESIGN.</span></h2><div><p>Brand identities, digital interfaces, and visuals with something to say.</p><External href={socialLinks[0].url} className="text-link light">View more on Behance<Icon name="diagonal" /></External></div></div>
        <div className="project-filters" role="group" aria-label="Filter projects">{categories.map(c => <button key={c} onClick={() => setFilter(c)} aria-pressed={c === filter}>{c}{c === 'All' && <span>{projects.length.toString().padStart(2, '0')}</span>}</button>)}</div><p className="sr-only" aria-live="polite">Showing {shown.length} {filter === 'All' ? '' : filter} projects.</p>
        <motion.div layout className={`project-grid ${filter !== 'All' ? 'filtered' : ''}`}><AnimatePresence initial={false} mode="popLayout">{shown.map((project, i) => <motion.article layout key={project.id} initial={{ opacity: 1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: reduced ? 0 : 0.25 }} className={`project-card ${project.className || ''}`}><div className="project-image"><External href={project.url} aria-label={`View ${project.title} on Behance`}><Image src={project.image} alt={project.alt} width={808} height={632} sizes="(max-width: 700px) 92vw, 55vw" loading="lazy" /><span className="project-view"><Icon name="diagonal" /></span></External><button className="preview-button" onClick={event => openGallery(project, event.currentTarget)} aria-label={`Preview ${project.title}`}>Quick look<Icon name="plus" /></button></div><div className="project-meta"><span>{project.category}</span><span>{(projects.indexOf(project) + 1).toString().padStart(2, '0')}</span></div><h3><External href={project.url}>{project.title}<Icon name="diagonal" /></External></h3></motion.article>)}</AnimatePresence></motion.div>
        </div>
      </section>

      <section id="services" className="services-section section container"><SectionLabel number="02">WHAT I CAN HELP WITH</SectionLabel><div className="section-heading reveal"><h2>BIG PICTURE.<br/><span className="accent">SMALL DETAILS.</span></h2><p>From a new identity to the next post.<br/>Thoughtful design, made for your world.</p></div><div className="services-grid">{services.map((s, i) => <article key={s.id} className="service-card reveal"><div className="service-top"><Icon name={s.icon} /><span>0{i + 1}</span></div><h3>{s.title}</h3><p>{s.description}</p><span className="service-tags">{s.tags}</span><a href="#contact" onClick={() => selectService(s.id)} className="service-action" aria-label={`Discuss ${s.title}`}>Discuss this service<Icon /></a></article>)}</div></section>

      <section id="about" className="about-section section dark-section"><div className="container about-grid"><div className="about-poster reveal"><div className="tape" aria-hidden="true" /><Image src="/images/raytas.webp" alt="Raytas Studio Meet the Designer poster featuring Rs Siyam" width={1080} height={1080} sizes="(max-width: 700px) 88vw, 40vw" /><span className="poster-sticker">DESIGN WITH PURPOSE.<br/>MAKE IT FEEL HUMAN. <Asterisk /></span></div><div className="about-copy reveal"><SectionLabel number="03">THE PERSON BEHIND THE WORK</SectionLabel><h2>CLARITY.<br/>CREATIVITY.<br/><span className="yellow">A LITTLE CHARACTER.</span></h2><p className="about-lead">Designing with clarity, creativity, and purpose.</p><p>I’m Shariyar, a Graphic Designer at <External href={identity.employer.url}>Raytas.co</External>, UI/UX Designer, and Canva Expert. My work brings brand visuals, digital interfaces, and editable content together.</p><p>I care about the way design looks, the story it tells, and how people use it.</p><div className="strengths">{['Visual Storytelling', 'Usable Interfaces', 'Editable Templates', 'Brand Consistency'].map(s => <span key={s}><Icon name="check" />{s}</span>)}</div><div className="experience"><span className="experience-label">EXPERIENCE & CAPABILITIES</span><External href={identity.employer.url}>Graphic Designer at Raytas.co<Icon name="diagonal" /></External><span>UI/UX Design <span aria-hidden="true">/</span> Canva expertise</span></div></div></div></section>

      <section className="story-section section container" aria-labelledby="story-title"><SectionLabel number="04">A CLOSER LOOK</SectionLabel><div className="story-grid"><div className="story-copy reveal"><span className="pill-label">{featuredStory.label}</span><h2 id="story-title">TYPE WITH<br/><span className="accent">ATTITUDE.</span></h2><p className="story-intro">{featuredStory.overview}</p><dl className="story-details"><div><dt>THE EXPLORATION</dt><dd>{featuredStory.objective}</dd></div><div><dt>DESIGN DIRECTION</dt><dd>{featuredStory.direction}</dd></div><div><dt>THE OUTPUT</dt><dd>{featuredStory.deliverables}</dd></div></dl><div className="tool-tags">{featuredStory.tools.map(t => <span key={t}>{t}</span>)}</div><External href={featuredStory.url} className="button dark">Explore the original project<Icon name="diagonal" /></External></div><div className="story-visual reveal"><div className="story-image-wrap"><Image src="/images/posters.webp" alt="Cover of the experimental typographic vintage poster design collection" width={808} height={632} sizes="(max-width: 700px) 90vw, 50vw" /><button onClick={e => openGallery(projects[5], e.currentTarget)} className="button cream">View artwork<Icon name="plus" /></button></div><span className="handwritten">old-school texture. new energy.</span><Asterisk className="story-star" /></div></div></section>

      <section className="canva-section section" aria-labelledby="canva-title"><div className="container canva-grid"><div className="canva-copy reveal"><SectionLabel number="05">MADE TO BE YOURS</SectionLabel><h2 id="canva-title">GOOD DESIGN.<br/>YOUR <span className="outlined">NEXT EDIT.</span></h2><p>Canva templates that give your content a consistent starting point. Update the message, change the image, and keep the visual identity intact.</p><ul className="canva-points"><li><Icon name="check" />Editable text and images</li><li><Icon name="check" />Reusable layouts</li><li><Icon name="check" />Consistent brand styling</li></ul><a className="button dark" href="#contact" onClick={() => selectService('canva')}>Let’s talk templates<Icon /></a></div><div className="template-demo reveal" aria-label="Illustrative template system diagram, not client work"><div className="demo-topbar"><span><i /><i /><i /></span>YOUR BRAND, YOUR WAY<Icon name="layers" /></div><div className="demo-body"><div className="demo-tools"><span className="selected">T</span><Icon name="grid" /><Icon name="layers" /><Icon name="spark" /></div><div className="demo-canvas"><span className="demo-label">YOUR BRAND</span><div className="editable-headline">MAKE<br/>IT<br/><span>YOURS.</span><i /><i /><i /><i /></div><div className="demo-swoosh" aria-hidden="true">✳</div><span className="demo-bottom">A LAYOUT. ENDLESS POSSIBILITIES.</span></div></div><div className="demo-caption"><span>Illustrative template system · not client work</span><div className="color-chips" aria-hidden="true"><i /><i /><i /></div></div></div></div></section>

      <section id="process" className="process-section section container"><SectionLabel number="06">HOW WE’LL WORK TOGETHER</SectionLabel><div className="section-heading reveal"><h2>FROM “WHAT IF”<br/>TO <span className="accent">“THAT’S IT.”</span></h2><p>A proposed process that keeps us aligned,<br/>from the first conversation to the final files.</p></div><ol className="process-grid">{processSteps.map((step, i) => <li key={step.title} className="reveal"><span className="step-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>

      {playground.length > 1 && <section className="playground-section dark-section section"><div className="container"><div className="section-heading reveal"><div><SectionLabel number="07">ROOM TO PLAY</SectionLabel><h2>SMALL CANVAS.<br/><span className="yellow">BIG PERSONALITY.</span></h2></div><p>A little more from my creative world.<br/>Social posts and campaign visuals.</p></div><div className="playground-grid">{playground.map((p, i) => <External href={p.url} key={p.title} className={`playground-card reveal play-${i}`}><div><Image src={p.image} alt={p.title} width={808} height={632} sizes="(max-width: 700px) 88vw, 45vw" /><span className="playground-badge"><Icon name="diagonal" /></span></div><h3>{p.title}</h3></External>)}</div></div></section>}

      <section className="faq-section section container"><div className="faq-intro reveal"><SectionLabel number="08">BEFORE WE BEGIN</SectionLabel><h2>A FEW<br/>GOOD <span className="accent">QUESTIONS.</span></h2><p>Have something else in mind?<br/><a className="text-link" href="#contact">Let’s have a conversation<Icon name="diagonal" /></a></p><Smile className="faq-smile" /></div><div className="faq-list">{faqs.map((f, i) => <details className="faq-item" key={f.question}><summary><span className="faq-number">0{i + 1}</span><span>{f.question}</span><Icon name="plus" /></summary><div className="faq-answer"><p>{f.answer}</p></div></details>)}</div></section>

      {optionalSections.testimonials.length > 0 && <section className="section container"><h2>Kind words.</h2><div className="testimonial-grid">{optionalSections.testimonials.map(t => <figure key={t.name}><blockquote>{t.quote}</blockquote><figcaption>{t.name} · {t.role}</figcaption></figure>)}</div></section>}
      {optionalSections.insights.length > 0 && <section className="section container"><h2>Design notes.</h2>{optionalSections.insights.map(a => <article key={a.url}><h3><External href={a.url}>{a.title}</External></h3><p>{a.summary}</p></article>)}</section>}

      <section id="contact" className="contact-section section"><div className={`container contact-grid ${contactEnabled ? 'with-form' : ''}`}><div className="contact-copy reveal"><SectionLabel number="09">LET’S START SOMETHING</SectionLabel><h2>LET’S MAKE<br/>SOMETHING<br/><span>WORTH NOTICING.</span></h2><p>A new brand, a fresh interface, or the next great idea.<br/>Tell me what you have in mind.</p><div className="contact-main-links"><External href={socialLinks[3].url} className="button dark">Let’s talk on Facebook<Icon name="diagonal" /></External><External href={socialLinks[2].url} className="text-link">Message on Instagram<Icon name="diagonal" /></External></div><div className="social-links">{socialLinks.map(s => <External key={s.name} href={s.url}>{s.name}<Icon name="diagonal" /></External>)}{additionalFacebookPage.enabled && <External href={additionalFacebookPage.url}>{additionalFacebookPage.label}<Icon name="diagonal" /></External>}</div></div>{contactEnabled ? <ContactForm service={service} onServiceChange={setService} /> : <div className="contact-art" aria-hidden="true"><Asterisk /><span className="handwritten">let’s make<br/>good things<br/>happen.</span><svg viewBox="0 0 200 100" className="sketch"><path d="M7 13q28 88 163 38m-37-24 44 24-31 34" /></svg></div>}</div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="footer-main"><a href="#top" aria-label="Shariyar Siyam, back to top"><Wordmark /></a><p>Brand visuals. Digital experiences.<br/>A little more character.</p><nav aria-label="Footer navigation">{navigation.map(n => <a href={`#${n.toLowerCase()}`} key={n}>{n}</a>)}</nav><a className="footer-top" href="#top">Back to top<Icon name="up" /></a></div><div className="footer-bottom"><span>© {year} Shariyar Siyam. All rights reserved.</span><div>{socialLinks.map(s => <External key={s.name} href={s.url}>{s.name}</External>)}</div><span>MADE WITH PURPOSE <Asterisk /></span></div></div></footer>
    <a href="#top" className={`floating-top ${scrolled ? 'visible' : ''}`} aria-label="Back to top" tabIndex={scrolled ? 0 : -1}><Icon name="up" /></a>
    <dialog className="gallery-dialog" ref={galleryRef} aria-labelledby="gallery-title" onCancel={e => { e.preventDefault(); closeGallery(); }} onClose={() => { setGalleryIndex(null); returnFocus.current?.focus(); }} onClick={e => { if (e.target === e.currentTarget) closeGallery(); }} onKeyDown={e => { if (galleryIndex === null) return; if (e.key === 'ArrowRight') { e.preventDefault(); setGalleryIndex((galleryIndex + 1) % projects.length); } if (e.key === 'ArrowLeft') { e.preventDefault(); setGalleryIndex((galleryIndex - 1 + projects.length) % projects.length); } }}>
      {currentProject && <div className="gallery-content"><div className="gallery-toolbar"><span>{currentProject.category} / {(galleryIndex! + 1).toString().padStart(2, '0')} OF {projects.length.toString().padStart(2, '0')}</span><button className="icon-button" onClick={closeGallery} aria-label="Close artwork preview" autoFocus><Icon name="close" /></button></div><AnimatePresence mode="wait"><motion.div key={currentProject.id} initial={{ opacity: reduced ? 1 : 0.5 }} animate={{ opacity: 1 }} exit={{ opacity: reduced ? 1 : 0.5 }} transition={{ duration: reduced ? 0 : 0.15 }} className="gallery-art"><Image src={currentProject.image} alt={currentProject.alt} width={808} height={632} sizes="90vw" /></motion.div></AnimatePresence><div className="gallery-bottom"><div><h2 id="gallery-title">{currentProject.title}</h2><External href={currentProject.url} className="text-link">See full project on Behance<Icon name="diagonal" /></External></div><div className="gallery-controls"><button className="icon-button" onClick={() => setGalleryIndex((galleryIndex! - 1 + projects.length) % projects.length)} aria-label="Previous artwork"><Icon className="rotate-180" /></button><button className="icon-button" onClick={() => setGalleryIndex((galleryIndex! + 1) % projects.length)} aria-label="Next artwork"><Icon /></button></div></div></div>}
    </dialog>
  </MotionConfig>;
}
