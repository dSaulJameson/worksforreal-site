'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

const disciplines = ['AI', 'Cloud infrastructure', 'Data rooms', 'Software', 'Automation', 'Strategy'];

const clients = [
  ['Atlassian', '/clients/atlassian.svg'],
  ['U.S. DoD', '/clients/dod.svg'],
  ['Beacon Hill', '/clients/beacon-hill.png'],
  ['Capital Group', '/clients/capital-group.png'],
  ['Postmates', '/clients/postmates.png'],
  ['TEKsystems', '/clients/teksystems.png'],
  ['Nutrien', '/clients/nutrien.png'],
  ['Otsuka', '/clients/otsuka.png'],
  ['Allied World', '/clients/allied-world.png'],
  ['Augment Risk', '/clients/augment-risk.png'],
  ['Startup CPG', '/clients/startup-cpg.png', 'supplied-logo'],
  ['Index Fresh', '/clients/index-fresh.png', 'supplied-logo'],
  ['The Cannabis Chamber of Commerce', '/clients/cannabis-chamber.png', 'supplied-logo'],
  ['Chako’s Social', '/clients/chakos-social.png', 'supplied-logo'],
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
    copy: 'A production recommendation and bidding-optimization engine for a national auction marketplace, designed around real-time financial decisions and more than $300M in annual business.',
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
    title: 'Content, audiences, and paid media. Connected.',
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
    title: 'White-label delivery',
    copy: 'Your brand, your relationship, your room. We operate as the senior delivery bench your client never needs to know was external.',
  },
  {
    number: '02',
    title: 'Joint delivery',
    copy: 'We join the calls, carry the technical work, and make the plan real while you continue leading the strategy and relationship.',
  },
  {
    number: '03',
    title: 'Direct delivery',
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
    const subject = encodeURIComponent(`Execution Associates inquiry: ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nWhat needs to be executed:\n${problem}`);
    window.location.href = `mailto:info@execution.associates?subject=${subject}&body=${body}`;
  }

  return (
    <main>
      <section className="hero" id="top">
        <header className="hero-header">
          <details className="site-menu">
            <summary aria-label="Open navigation"><span /><span /></summary>
            <nav aria-label="Primary navigation">
              <a href="#approach">Our approach</a>
              <a href="#capabilities">Capabilities</a>
              <a href="#about">The founders</a>
              <a href="#work">Proof</a>
              <a href="#partners">For strategists</a>
              <a href="#leverage">Retain a team</a>
              <a href="#contact">Start a project</a>
            </nav>
          </details>
          <a className="brand-lockup brand-lockup-light" href="#top" aria-label="Execution Associates home">
            <img src="/execution-associates-white.png" alt="Execution Associates" width={6000} height={1774} />
          </a>
          <a className="header-cta" href="#contact">Put us on it <span>↗</span></a>
        </header>

        <div className="hero-rule hero-rule-one" aria-hidden="true" />
        <div className="hero-rule hero-rule-two" aria-hidden="true" />

        <div className="hero-content">
          <p className="eyebrow"><span>Strategy</span><i /><span>Engineering</span><i /><span>Throughput</span></p>
          <h1>
            <span className="cycling-stage"><span className={`cycling-word ${disciplines[activeWord].length > 14 ? 'cycling-word-long' : ''}`} key={disciplines[activeWord]}>{disciplines[activeWord]}</span></span>
            <span className="executed">Executed.</span>
          </h1>
          <p className="hero-copy">Senior technical partners. From strategy to shipped software, AI, and infrastructure.</p>
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
                  {clients.map(([name, src, className]) => <img key={`${copy}-${name}`} className={className} src={src} alt={copy === 0 ? `${name} logo` : ''} />)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-proof"><strong>$1B+</strong><span>processed by systems we shipped</span></div>
      </section>

      <section className="approach section-pad" id="approach">
        <div className="approach-intro">
          <h2>We don’t stop at strategy.<br /><em>We execute.</em></h2>
          <div className="approach-copy">
            <p>Start with what you have. We’ll help define the rest and get it done.</p>
            <p>AI, cloud infrastructure, data, software, automation, product, or the strategy connecting it all. Whatever it is, we execute.</p>
          </div>
        </div>
        <div className="capabilities" id="capabilities">
        <div className="section-heading-row">
          <h2>The whole team.<br /><em>On demand.</em></h2>
          <p>Senior technical operators stay close to the question, the architecture, and the release. Bring a defined build or a problem that still needs shaping.</p>
        </div>
        <div className="capability-list">
          {capabilities.map(([number, title, copy]) => (
            <article className="capability-row" key={number}>
              <span>{number}</span><h3>{title}</h3><p>{copy}</p><b aria-hidden="true">↗</b>
            </article>
          ))}
        </div>
        </div>
      </section>

      <section className="about section-pad" id="about">
        <div className="section-kicker light"><span>The founders</span></div>
        <div className="about-intro">
          <h2>Software depth.<br />Machine-learning depth.<br /><em>One accountable team.</em></h2>
          <p>Execution Associates brings together two complementary builders. Stephan goes deepest on software and systems. Saul goes deepest on ML and data. Both can carry a hard technical problem from strategy through production.</p>
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

      <section className="work section-pad" id="work">
        <div className="section-kicker light"><span>Selected proof</span></div>
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
        <div className="partner-opening">
          <h2><span>For strategists,</span><span>advisors + agencies.</span></h2>
        </div>
        <div className="partners-head">
          <p className="partner-audience">You bring the strategy.<br /><span>We bring the engineers.</span></p>
          <div>
            <h3>Technical execution<br /><em>that keeps clients happy.</em></h3>
            <p>You can see the move and own the client relationship. We provide the senior technical bench to build it. Bring us into the room as your client-facing technical team, or keep us quietly behind your brand.</p>
          </div>
        </div>
        <div className="partner-promise"><strong>Visible or invisible. Your call.</strong><p>Our job is to execute the strategy, protect the relationship, and keep your client happy.</p></div>
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

      <section className="leverage section-pad" id="leverage">
        <div className="section-kicker leverage-kicker"><span>An alternative to one more hire</span></div>
        <div className="leverage-head">
          <h2>Don&apos;t hire one role.<br /><em>Retain a team.</em></h2>
          <p>A single senior technical hire can cost a couple hundred thousand dollars a year once salary, recruiting, benefits, and overhead land. For less than half of that, you can put an entire bench of senior technical experience behind the work.</p>
        </div>
        <div className="leverage-compare">
          <article className="hire-card">
            <p>One senior hire</p>
            <strong>~$200K<span>+</span></strong>
            <h3>One person.<br />One discipline.<br />Fixed capacity.</h3>
            <ul><li>Months to recruit</li><li>Salary, benefits + overhead</li><li>One skill set at a time</li></ul>
          </article>
          <article className="team-card">
            <p>Execution Associates retainer</p>
            <strong>&lt;$100K<span>/ year</span></strong>
            <h3>Senior software, ML, cloud, data, and strategy, matched to the work.</h3>
            <ul><li>Access to the right senior mix</li><li>Capacity that flexes with the work</li><li>Execution without another org chart</li></ul>
          </article>
        </div>
        <div className="leverage-foot"><p>More range. Less fixed cost. No single-hire bottleneck.</p><a href="#contact">Retain the team <span>↗</span></a></div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="section-kicker light"><span>Put us on it</span></div>
        <div className="contact-grid">
          <div className="contact-pitch">
            <h2>What needs<br />executing?</h2>
            <p>You do not need a polished brief. Tell us what needs to move, what keeps getting stuck, or which client promise needs a serious delivery team behind it.</p>
            <a href="https://tidycal.com/dsauljameson/15-minute-meeting">Book 15 minutes <span>↗</span></a>
            <a className="email-link" href="mailto:info@execution.associates">info@execution.associates</a>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <label>Name<input name="name" required autoComplete="name" /></label>
            <label>Work email<input name="email" type="email" required autoComplete="email" /></label>
            <label>Company<input name="company" autoComplete="organization" /></label>
            <label>What needs to be executed?<textarea name="problem" required rows={5} placeholder="The goal, the current reality, and what is getting in the way." /></label>
            <button type="submit">Send it to the team <span>↗</span></button>
            <p>This opens a message to info@execution.associates in your email app.</p>
          </form>
        </div>
      </section>

      <footer>
        <a className="brand-lockup brand-lockup-light" href="#top"><img src="/execution-associates-white.png" alt="Execution Associates" width={6000} height={1774} /></a>
        <p>Strategy, systems, and software. Executed.</p>
        <div><a href="mailto:info@execution.associates">Email</a><a href="https://www.linkedin.com/in/fitzpatrickstephan/">Stephan</a><a href="https://www.linkedin.com/in/dsauljameson/">Saul</a></div>
        <span>© 2026 Execution Associates</span>
      </footer>
    </main>
  );
}
