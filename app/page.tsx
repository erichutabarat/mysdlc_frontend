"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from './page.module.css';
import features from "@/component/feature_list";
import steps from "@/component/step_list";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.root}>

      {/* ── HEADER ── */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>M</span>
            <span className={styles.logoText}>MySDLC</span>
          </Link>

          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
            <Link href="#features" className={styles.navLink} onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="#how" className={styles.navLink} onClick={() => setMenuOpen(false)}>How It Works</Link>
            <Link href="#about" className={styles.navLink} onClick={() => setMenuOpen(false)}>About</Link>
          </nav>

          <div className={styles.headerAuth}>
            <Link href="/login" className={`${styles.btn} ${styles.btnGhost}`}>Log In</Link>
            <Link href="/register" className={`${styles.btn} ${styles.btnPrimary}`}>Get Started</Link>
          </div>

          <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroGridBg} aria-hidden />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Software Development Lifecycle Platform</div>
          <h1 className={styles.heroTitle}>
            Build Software<br />
            <span className={styles.heroTitleAccent}>The Right Way.</span>
          </h1>
          <p className={styles.heroSub}>
            MySDLC guides developers, students, and small teams through the entire
            software lifecycle — from initial planning to post-deployment maintenance —
            with structured methodology templates and intelligent workflow management.
          </p>
          <div className={styles.heroActions}>
            <Link href="/register" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>Start a Project →</Link>
            <Link href="#how" className={`${styles.btn} ${styles.btnOutline} ${styles.btnLg}`}>See How It Works</Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>3+</span>
              <span className={styles.statLabel}>SDLC Frameworks</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>6</span>
              <span className={styles.statLabel}>Dev Phases Tracked</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>∞</span>
              <span className={styles.statLabel}>Custom Workflows</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden>
          <div className={`${styles.phaseCard} ${styles.phaseCard1}`}>
            <span className={`${styles.phaseDot} ${styles.phaseDotDone}`} />
            Planning
            <span className={styles.phaseBadge}>Done</span>
          </div>
          <div className={`${styles.phaseCard} ${styles.phaseCard2}`}>
            <span className={`${styles.phaseDot} ${styles.phaseDotActive}`} />
            Design
            <span className={`${styles.phaseBadge} ${styles.phaseBadgeActive}`}>Active</span>
          </div>
          <div className={`${styles.phaseCard} ${styles.phaseCard3}`}>
            <span className={`${styles.phaseDot} ${styles.phaseDotLocked}`} />
            Implementation
            <span className={`${styles.phaseBadge} ${styles.phaseBadgeLocked}`}>Locked</span>
          </div>
          <div className={`${styles.phaseCard} ${styles.phaseCard4}`}>
            <span className={`${styles.phaseDot} ${styles.phaseDotLocked}`} />
            Testing
            <span className={`${styles.phaseBadge} ${styles.phaseBadgeLocked}`}>Locked</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressBarFill} />
          </div>
          <div className={styles.heroVisualLabel}>Project: Final Year Thesis · Agile</div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={`${styles.section} ${styles.features}`} id="features">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Core Features</p>
            <h2 className={styles.sectionTitle}>Everything Your Project Needs</h2>
            <p className={styles.sectionSub}>Purpose-built for developers who want structure without enterprise bloat.</p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((f) => (
              <div className={styles.featureCard} key={f.title}>
                <div className={styles.featureCardIcon}>{f.icon}</div>
                <h3 className={styles.featureCardTitle}>{f.title}</h3>
                <p className={styles.featureCardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={`${styles.section} ${styles.how}`} id="how">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Process</p>
            <h2 className={styles.sectionTitle}>How MySDLC Works</h2>
            <p className={styles.sectionSub}>From project initialization to deployment — every step is guided.</p>
          </div>
          <div className={styles.howSteps}>
            {steps.map((s, i) => (
              <div className={styles.howStep} key={s.num}>
                <div className={styles.howStepNum}>{s.num}</div>
                <h3 className={styles.howStepLabel}>{s.label}</h3>
                <p className={styles.howStepSub}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className={`${styles.section} ${styles.about}`} id="about">
        <div className={`${styles.sectionInner} ${styles.aboutInner}`}>
          <div className={styles.aboutText}>
            <p className={styles.sectionEyebrow}>About MySDLC</p>
            <h2 className={styles.sectionTitle}>Built for Builders</h2>
            <p className={styles.aboutBody}>
              MySDLC was built for the developers who know that shipping good software is
              a process, not a sprint. Whether you're a CS student managing your final
              year project, a freelancer tracking a client deliverable, or a small team
              that needs structure without the overhead of enterprise tooling — MySDLC
              meets you where you are.
            </p>
            <p className={styles.aboutBody}>
              We believe the best code comes from disciplined process. MySDLC enforces
              that discipline with methodology-aware templates, phase gate controls, and
              documentation requirements baked into every project.
            </p>
            <Link href="/register" className={`${styles.btn} ${styles.btnPrimary}`}>Start Building →</Link>
          </div>
          <div className={styles.aboutVisual}>
            <div className={styles.methodologyCard}>
              <div className={styles.methodologyCardLabel}>Agile</div>
              <div className={styles.methodologyCardPhases}>
                {["Backlog", "Sprint 1", "Sprint 2", "Review", "Deploy"].map(p => (
                  <div className={styles.methodologyCardPhase} key={p}>{p}</div>
                ))}
              </div>
            </div>
            <div className={`${styles.methodologyCard} ${styles.methodologyCardOffset}`}>
              <div className={styles.methodologyCardLabel}>Waterfall</div>
              <div className={styles.methodologyCardPhases}>
                {["Requirements", "Design", "Implementation", "Testing", "Maintenance"].map(p => (
                  <div className={styles.methodologyCardPhase} key={p}>{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to ship with structure?</h2>
          <p className={styles.ctaSub}>Create your first project in under 2 minutes. No credit card required.</p>
          <div className={styles.ctaActions}>
            <Link href="/register" className={`${styles.btn} ${styles.btnWhite} ${styles.btnLg}`}>Create Free Account</Link>
            <Link href="/login" className={`${styles.btn} ${styles.btnOutlineWhite} ${styles.btnLg}`}>Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMark}>M</span>
              <span className={styles.logoText}>MySDLC</span>
            </Link>
            <p className={styles.footerTagline}>Structure your software. Ship with confidence.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Product</p>
              <Link href="#features" className={styles.footerLink}>Features</Link>
              <Link href="#how" className={styles.footerLink}>How It Works</Link>
              <Link href="#about" className={styles.footerLink}>About</Link>
            </div>
            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Account</p>
              <Link href="/login" className={styles.footerLink}>Log In</Link>
              <Link href="/register" className={styles.footerLink}>Register</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} MySDLC. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}