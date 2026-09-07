'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

const disciplines = ['AI', 'Cloud infrastructure', 'Data', 'Software', 'Automation', 'Strategy'];

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
  ['01', 'Strategy', 'Technical diligence, product definition, architecture, roadmaps, and operating plans grounded in what can actually ship.'],
  ['02', 'AI + machine learning', 'Agents, forecasting, recommendation, optimization, and applied AI built around a measurable business result.'],
  ['03', 'Software + products', 'Customer products, internal tools, websites, APIs, and full-stack platforms made for real operations.'],
  ['04', 'Cloud + infrastructure', 'Architecture, infrastructure, delivery pipelines, observability, modernization, and the hard work between environments.'],
  ['05', 'Data + automation', 'Data platforms, analytics, integrations, and workflows that replace drag with dependable throughput.'],
  ['06', 'Secure execution', 'Access boundaries, isolated agents, short-lived credentials, review gates, documentation, and clean handoff.'],
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
    title: 'Content, audiences, and paid media—connected.',
    copy: 'A production platform combining content planning, multi-channel publishing, saved audiences, reach estimates, post promotion, and campaign controls in one operating product.',
    tags: ['Full stack', 'Workflow', 'Growth'],
  },
  {
    number: '04',
    label: 'Secure AI / Engineering',
    metric: '0 trust',
    title: 'Coding agents without permanent access.',
    copy: 'AI coding agents connected to engineering workflows through isolated workspaces, controlled repositories, short-lived credentials, and human review gates.',
    tags: ['Secure AI', 'Cloud', 'Developer tools'],
  },
];

const partnerModes = [
  {
    number: '01',
    title: 'Quietly behind you',
    copy: 'Your brand, your relationship, your room. We operate as the senior delivery bench your client never needs to know was external.',
  },
  {
    number: '02',
    title: 'Side by side',
    copy: 'We join the calls, carry the technical work, and make the plan real while you continue leading the strategy and relationship.',
  },
  {
    number: '03',
    title: 'Out in front',
    copy: 'Hand us the outcome. We can shape the strategy, run delivery, face the client, and stay accountable through launch and beyond.',
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
    const subject = encodeURIComponent(`Execution Department inquiry — ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nWhat needs to be executed:\n${problem}`);
    window.location.href = `mailto:info@worksforreal.com?subject=${subject}&body=${body}`;
  }

  return (
    <main>
      <section className="hero" id="top">
        <header className="hero-header">
          <details className="site-menu">
            <summary aria-label="Open navigation"><span /><span /></summary>
            <nav aria-label="Primary navigation">
              <a href="#department"><span>01</span>The department</a>
              <a href="#about"><span>02</span>Department heads</a>
              <a href="#capabilities"><span>03</span>Capabilities</a>
              <a href="#leverage"><span>04</span>Retain a department</a>
              <a href="#work"><span>05</span>Proof</a>
              <a href="#partners"><span>06</span>Your execution department</a>
              <a href="#contact"><span>07</span>Start a project</a>
            </nav>
          </details>
          <a className="brand-lockup brand-lockup-light" href="#top" aria-label="Execution Department home">
            <img src="/execution-department-logo.png" alt="Execution Department" />
          </a>
          <a className="header-cta" href="#contact">Put us on it <span>↗</span></a>
        </header>

        <div className="hero-rule hero-rule-one" aria-hidden="true" />
        <div className="hero-rule hero-rule-two" aria-hidden="true" />

        <div className="hero-content">
          <p className="eyebrow"><span>Strategy</span><i /><span>Engineering</span><i /><span>Throughput</span></p>
          <h1>
            <span className="cycling-stage"><span className="cycling-word" key={disciplines[activeWord]}>{disciplines[activeWord]}</span></span>
            <span className="executed">Executed.</span>
          </h1>
          <p className="hero-copy">Bring us the strategy. Bring us the problem. Or ask us to shape both. We turn ambitious work into shipped, working systems.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="https://tidycal.com/dsauljameson/15-minute-meeting">Put us on it <span>↗</span></a>
            <a className="button button-secondary" href="#work">See the proof <span>↓</span></a>
          </div>
        </div>

        <div className="hero-trust" aria-label="Selected clients">
          <p>Trusted to execute for</p>
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
        <div className="hero-proof"><strong>$1B+</strong><span>processed by systems we shipped</span></div>
      </section>

      <section className="department section-pad" id="department">
        <div className="section-kicker"><span>01</span><span>The department</span></div>
        <div className="department-intro">
          <h2>We do strategy.<br />We do execution.<br /><em>We do both.</em></h2>
          <div className="department-copy">
            <p>Sometimes the plan is clear and you need throughput. Sometimes the problem is clear and the plan is not. We meet the work wherever it is.</p>
            <p>AI, cloud infrastructure, data, software, automation, product, or the strategy connecting it all—whatever it is, we execute.</p>
          </div>
        </div>
        <div className="execution-loop" aria-label="How we execute">
          <div><span>01</span><strong>Define</strong><p>Turn the ambition into the right work.</p></div>
          <div><span>02</span><strong>Build</strong><p>Put senior hands directly on the problem.</p></div>
          <div><span>03</span><strong>Ship</strong><p>Get it into the business, not just the deck.</p></div>
          <div><span>04</span><strong>Own</strong><p>Stay accountable until the outcome is real.</p></div>
        </div>
      </section>

      <section className="about section-pad" id="about">
        <div className="section-kicker light"><span>02</span><span>Department heads</span></div>
        <div className="about-intro">
          <h2>Software depth.<br />Machine-learning depth.<br /><em>One accountable team.</em></h2>
          <p>Execution Department brings together two complementary builders. Stephan goes deepest on software and systems. Saul goes deepest on ML and data. Both can carry a hard technical problem from strategy through production.</p>
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
        <div className="section-kicker"><span>03</span><span>What we execute</span></div>
        <div className="section-heading-row">
          <h2>The whole department.<br /><em>On demand.</em></h2>
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

      <section className="leverage section-pad" id="leverage">
        <div className="section-kicker leverage-kicker"><span>04</span><span>An alternative to one more hire</span></div>
        <div className="leverage-head">
          <h2>Don&apos;t hire one role.<br /><em>Retain a department.</em></h2>
          <p>A single senior technical hire can cost a couple hundred thousand dollars a year once salary, recruiting, benefits, and overhead land. For less than half of that, you can put an entire bench of senior technical experience behind the work.</p>
        </div>
        <div className="leverage-compare">
          <article className="hire-card">
            <p>One senior hire</p>
            <strong>~$200K<span>+</span></strong>
            <h3>One person.<br />One discipline.<br />Fixed capacity.</h3>
            <ul><li>Months to recruit</li><li>Salary, benefits + overhead</li><li>One skill set at a time</li></ul>
          </article>
          <article className="department-card">
            <p>Execution Department retainer</p>
            <strong>&lt;$100K<span>/ year</span></strong>
            <h3>Senior software, ML, cloud, data, and strategy—matched to the work.</h3>
            <ul><li>Access to the right senior mix</li><li>Capacity that flexes with the work</li><li>Execution without another org chart</li></ul>
          </article>
        </div>
        <div className="leverage-foot"><p>More range. Less fixed cost. No single-hire bottleneck.</p><a href="#contact">Retain the department <span>↗</span></a></div>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-kicker light"><span>05</span><span>Selected proof</span></div>
        <div className="section-heading-row">
          <h2>Not proposed.<br /><em>Executed.</em></h2>
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

      <section className="partners section-pad" id="partners">
        <div className="section-kicker light"><span>06</span><span>For people with something to move</span></div>
        <div className="partners-head">
          <p className="partner-audience">Product. Leadership.<br /><span>Sales. Marketing.<br />Strategy. AI.</span></p>
          <div>
            <h2>We want to be your<br /><em>Execution Department.</em></h2>
            <p>Whether you are a CEO, a product leader, in sales or marketing, a strategist, an advisor, an agency, or building in AI—we are the technical partner and throughput behind the work. Client-facing when you want us. Invisible when you don&apos;t.</p>
          </div>
        </div>
        <div className="superstar-line"><span>Our job:</span><strong>Make you look like a superstar.</strong></div>
        <div className="partner-grid">
          {partnerModes.map((mode) => (
            <article key={mode.number}>
              <span>{mode.number}</span>
              <h3>{mode.title}</h3>
              <p>{mode.copy}</p>
            </article>
          ))}
        </div>
        <div className="partner-footer">
          <div><span>YOUR CLIENT</span><strong>Your lead stays intact.</strong></div>
          <div><span>OUR BENCH</span><strong>Senior builders, on demand.</strong></div>
          <div><span>ONE OUTCOME</span><strong>Delivered without drama.</strong></div>
          <a href="#contact">Expand your delivery capacity <span>↗</span></a>
        </div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="section-kicker light"><span>07</span><span>Put us on it</span></div>
        <div className="contact-grid">
          <div className="contact-pitch">
            <h2>What needs<br />executing?</h2>
            <p>You do not need a polished brief. Tell us what needs to move, what keeps getting stuck, or which client promise needs a serious delivery team behind it.</p>
            <a href="https://tidycal.com/dsauljameson/15-minute-meeting">Book 15 minutes <span>↗</span></a>
            <a className="email-link" href="mailto:info@worksforreal.com">info@worksforreal.com</a>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <label>Name<input name="name" required autoComplete="name" /></label>
            <label>Work email<input name="email" type="email" required autoComplete="email" /></label>
            <label>Company<input name="company" autoComplete="organization" /></label>
            <label>What needs to be executed?<textarea name="problem" required rows={5} placeholder="The goal, the current reality, and what is getting in the way." /></label>
            <button type="submit">Send it to the department <span>↗</span></button>
            <p>This opens a message to info@worksforreal.com in your email app.</p>
          </form>
        </div>
      </section>

      <footer>
        <a className="brand-lockup brand-lockup-light" href="#top"><img src="/execution-department-logo.png" alt="Execution Department" /></a>
        <p>Strategy, systems, and software. Executed.</p>
        <div><a href="mailto:info@worksforreal.com">Email</a><a href="https://www.linkedin.com/in/fitzpatrickstephan/">Stephan</a><a href="https://www.linkedin.com/in/dsauljameson/">Saul</a></div>
        <span>© 2026 Execution Department</span>
      </footer>
    </main>
  );
}
