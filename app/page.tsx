'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

const disciplines = ['AI', 'Software', 'Cloud Infrastructure', 'Data', 'DevOps', 'Cybersecurity', 'Automation'];

const clients = [
  ['Atlassian', '/clients/atlassian.svg'],
  ['U.S. Department of Defense', '/clients/dod.svg'],
  ['Beacon Hill', '/clients/beacon-hill.png'],
  ['Capital Group', '/clients/capital-group.png'],
  ['Postmates', '/clients/postmates.png'],
  ['TEKsystems', '/clients/teksystems.png'],
  ['Nutrien', '/clients/nutrien.png'],
  ['Otsuka', '/clients/otsuka.png'],
  ['Allied World', '/clients/allied-world.png'],
  ['Augment Risk', '/clients/augment-risk.png'],
];

const capabilities = [
  ['01', 'AI strategy + implementation', 'Find the use case worth doing. Design the operating model. Build the product, agents, and integrations that make it useful.'],
  ['02', 'Software + product engineering', 'Customer products, internal tools, websites, APIs, and full-stack platforms engineered for real operations and long-term ownership.'],
  ['03', 'Data + machine learning', 'Forecasting, recommendation, optimization, analytics, and decision systems measured against the business result—not model theater.'],
  ['04', 'Cloud + DevOps', 'Architecture, infrastructure, delivery pipelines, observability, and modernization that let teams ship without creating the next emergency.'],
  ['05', 'Automation + integration', 'Workflows, voice agents, CRMs, back-office systems, and stubborn tools connected into one accountable operating system.'],
  ['06', 'Cybersecurity + secure AI', 'Access boundaries, isolated agents, short-lived credentials, review gates, and pragmatic security designed into the way people work.'],
  ['07', 'Growth systems', 'Content, media, campaigns, landing pages, attribution, and automation built as a connected acquisition product.'],
  ['08', 'Strategy + execution', 'Technical diligence, launch plans, fractional leadership, and senior decision support that stays close to the work.'],
];

const projects = [
  {
    number: '01',
    label: 'Applied ML / Optimization',
    metric: '$300M',
    title: 'Bidding intelligence built into the transaction.',
    copy: 'A production recommendation and bidding-optimization engine for a national auction marketplace—designed around real-time financial decisions and more than $300M in annual business.',
    tags: ['Recommendation', 'Optimization', 'Production ML'],
  },
  {
    number: '02',
    label: 'Forecasting / Decision systems',
    metric: '3 years',
    title: 'Forecasts that beat the market.',
    copy: 'A Bayesian supply-and-demand forecasting system for a leading avocado supplier, delivering commercially useful predictions through volatile markets for three consecutive years.',
    tags: ['Bayesian ML', 'Forecasting', 'CPG'],
  },
  {
    number: '03',
    label: 'Software / Growth systems',
    metric: '1 system',
    title: 'Content, audiences, and paid media—finally connected.',
    copy: 'A production platform combining content planning, multi-channel publishing, saved audiences, reach estimates, post promotion, and campaign controls in one operating product.',
    tags: ['Full stack', 'Workflow', 'Growth'],
  },
  {
    number: '04',
    label: 'Secure AI / Engineering',
    metric: '0 trust',
    title: 'Coding agents without permanent access.',
    copy: 'Codex and Claude connected to engineering workflows through isolated workspaces, controlled repositories, short-lived credentials, and human review gates.',
    tags: ['Secure AI', 'Cloud', 'Developer tools'],
  },
];

export default function Home() {
  const [activeWord, setActiveWord] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveWord((current) => (current + 1) % disciplines.length), 1800);
    return () => window.clearInterval(timer);
  }, []);

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const name = String(values.get('name') || 'New contact');
    const email = String(values.get('email') || '');
    const company = String(values.get('company') || '');
    const problem = String(values.get('problem') || '');
    const subject = encodeURIComponent(`Works for Real inquiry — ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nWhat needs to work:\n${problem}`);
    window.location.href = `mailto:info@worksforreal.com?subject=${subject}&body=${body}`;
  }

  return (
    <main>
      <section className="hero" id="top">
        <header className="hero-header">
          <details className="site-menu">
            <summary aria-label="Open navigation"><span /><span /></summary>
            <nav aria-label="Primary navigation">
              <a href="#work"><span>01</span>Work</a>
              <a href="#capabilities"><span>02</span>Capabilities</a>
              <a href="#about"><span>03</span>About</a>
              <a href="#contact"><span>04</span>Contact</a>
            </nav>
          </details>
          <a className="wordmark" href="#top" aria-label="Works for Real home">
            <span>WORKS</span><span className="wordmark-muted">FOR REAL</span><span className="wordmark-period">.</span>
          </a>
        </header>

        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

        <div className="hero-content">
          <p className="eyebrow"><span>Strategy</span><i /><span>Engineering</span><i /><span>Execution</span></p>
          <h1>
            <span className="cycling-stage"><span className="cycling-word" key={disciplines[activeWord]}>{disciplines[activeWord]}</span></span>
            <span className="hero-rest">that</span>
            <span className="wordmark hero-statement-logo" aria-label="Works for Real"><span>WORKS</span><span className="wordmark-muted">FOR REAL</span><span className="wordmark-period">.</span></span>
          </h1>
          <p className="hero-copy">Not demos. Not decks. AI, systems, and software built into the business. Accountable to what changes.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="https://tidycal.com/dsauljameson/15-minute-meeting">Tell us what needs to work <span>↗</span></a>
            <a className="button button-secondary" href="#work">See the proof <span>↓</span></a>
          </div>
        </div>

        <div className="hero-trust" aria-label="Selected clients">
          <p>Trusted by</p>
          <div className="logo-marquee">
            <div className="logo-track">
              {[0, 1].map((copy) => (
                <div className="logo-set" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
                  {clients.map(([name, src]) => <img key={`${copy}-${name}`} src={src} alt={copy === 0 ? `${name} logo` : ''} />)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-proof">
          <strong>$1B+</strong><span>processed by shipped systems</span>
        </div>
      </section>

      <section className="thesis section-pad">
        <div className="section-kicker"><span>00</span><span>The standard</span></div>
        <div className="thesis-grid">
          <h2>Real is a higher bar.</h2>
          <div className="thesis-copy">
            <p>A prototype proves something can exist. Real work survives contact with customers, employees, legacy systems, security reviews, budgets, and Monday morning.</p>
            <p>We combine software architecture, production machine learning, AI implementation, and operating judgment so what gets launched keeps working.</p>
          </div>
        </div>
        <div className="real-checks">
          <div><span>01</span><strong>Used</strong><p>Fits the people and workflow it was built for.</p></div>
          <div><span>02</span><strong>Reliable</strong><p>Observed, secured, documented, and owned.</p></div>
          <div><span>03</span><strong>Measurable</strong><p>Connected to an outcome the business cares about.</p></div>
          <div><span>04</span><strong>Adaptable</strong><p>Built to change when the real world does.</p></div>
        </div>
      </section>

      <section className="about section-pad" id="about">
        <div className="section-kicker"><span>01</span><span>The cofounders</span></div>
        <div className="about-intro">
          <h2>Software depth.<br />Machine-learning depth.<br /><em>One accountable team.</em></h2>
          <p>Works for Real brings together two complementary builders. Stephan goes deepest on software and systems. Saul goes deepest on ML and data. Both can carry a hard technical problem from strategy through production.</p>
        </div>
        <div className="founder-grid">
          <article className="founder-card founder-stephan">
            <div className="founder-image"><img src="/founders/stephan-portrait.jpg" alt="Stephan Fitzpatrick speaking to a technology audience" /></div>
            <div className="founder-details">
              <p className="founder-role">Cofounder / Software + systems</p>
              <h3>Stephan Fitzpatrick</h3>
              <p>Software architect and AI strategist with more than a decade across software, data engineering, cloud, DevOps, cybersecurity, and AI-native products. Stephan turns complex technical terrain into systems teams can actually operate.</p>
              <div className="founder-tags"><span>Software architecture</span><span>Cloud + DevOps</span><span>Secure AI</span></div>
              <a href="https://www.linkedin.com/in/fitzpatrickstephan/">LinkedIn ↗</a>
            </div>
          </article>
          <article className="founder-card founder-saul">
            <div className="founder-image"><img src="/founders/saul.png" alt="D. Saul Jameson, machine learning engineer and cofounder" /></div>
            <div className="founder-details">
              <p className="founder-role">Cofounder / ML + outcomes</p>
              <h3>D. Saul Jameson</h3>
              <p>Machine learning engineer and technical operator with nine-plus years shipping forecasting, optimization, analytics, automation, and AI systems. Saul&apos;s deployed models have supported more than $1B in commercial activity.</p>
              <div className="founder-tags"><span>Production ML</span><span>Forecasting</span><span>Optimization</span></div>
              <a href="https://www.linkedin.com/in/dsauljameson/">LinkedIn ↗</a>
            </div>
          </article>
        </div>
      </section>

      <section className="capabilities section-pad" id="capabilities">
        <div className="section-kicker light"><span>02</span><span>What we make work</span></div>
        <div className="section-heading-row">
          <h2>From the model layer<br />to the cloud invoice.</h2>
          <p>Two senior technical founders stay close to the question, the architecture, and the release. Bring a defined build or a problem that still needs shaping.</p>
        </div>
        <div className="capability-list">
          {capabilities.map(([number, title, copy]) => (
            <article className="capability-row" key={number}>
              <span>{number}</span><h3>{title}</h3><p>{copy}</p><b aria-hidden="true">↗</b>
            </article>
          ))}
        </div>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-kicker"><span>03</span><span>Selected proof</span></div>
        <div className="section-heading-row dark-heading">
          <h2>Built into the business.<br /><em>Measured by what changes.</em></h2>
          <p>Representative work across machine learning, software products, operational systems, and secure AI.</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project" key={project.number}>
              <div className="project-index"><span>{project.number}</span><p>{project.label}</p></div>
              <div className="project-metric">{project.metric}</div>
              <div className="project-story"><h3>{project.title}</h3><p>{project.copy}</p><div>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="contact-glow" aria-hidden="true" />
        <div className="section-kicker light"><span>04</span><span>Start with the problem</span></div>
        <div className="contact-grid">
          <div className="contact-pitch">
            <h2>What needs<br />to work?</h2>
            <p>You do not need a polished brief. Tell us what is stuck, expensive, manual, risky, or newly possible. We will tell you the most useful next step.</p>
            <a href="https://tidycal.com/dsauljameson/15-minute-meeting">Book 15 minutes <span>↗</span></a>
            <a className="email-link" href="mailto:info@worksforreal.com">info@worksforreal.com</a>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <label>Name<input name="name" required autoComplete="name" /></label>
            <label>Work email<input name="email" type="email" required autoComplete="email" /></label>
            <label>Company<input name="company" autoComplete="organization" /></label>
            <label>What should change?<textarea name="problem" required rows={5} placeholder="What exists today, what outcome do you need, and what is getting in the way?" /></label>
            <button type="submit">Send the problem <span>↗</span></button>
            <p>This opens a message to info@worksforreal.com in your email app.</p>
          </form>
        </div>
      </section>

      <footer>
        <a className="wordmark" href="#top"><span>WORKS</span><span className="wordmark-muted">FOR REAL</span><span className="wordmark-period">.</span></a>
        <p>AI, systems, and software that work in the real world.</p>
        <div><a href="mailto:info@worksforreal.com">Email</a><a href="https://www.linkedin.com/in/fitzpatrickstephan/">Stephan</a><a href="https://www.linkedin.com/in/dsauljameson/">Saul</a></div>
        <span>© 2026 Works for Real</span>
      </footer>
    </main>
  );
}
