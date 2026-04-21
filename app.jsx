// Ho Jin Choi — minimalist portfolio app

(function () {
  const D = window.SITE_DATA;
  const { Icon, PaperThumb, BibTexModal } = window;

  // Group items by year, preserving order within each year
  function groupByYear(items) {
    const map = new Map();
    for (const it of items) {
      if (!map.has(it.year)) map.set(it.year, []);
      map.get(it.year).push(it);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }

  function RenderBio({ bio }) {
    return (
      <p className="bio">
        {bio.map((seg, i) => {
          if (typeof seg === "string") return <React.Fragment key={i}>{seg} </React.Fragment>;
          return <a key={i} href={seg.url} target="_blank" rel="noreferrer">{seg.text}</a>;
        })}
      </p>
    );
  }

  function Item({ it, expand }) {
    const [open, setOpen] = React.useState(false);
    const [showBib, setShowBib] = React.useState(false);

    return (
      <article className="item" id={`item-${it.id}`}>
        <div className="item-thumb"><PaperThumb paper={it} /></div>
        <div className="item-body">
          <h3 className="item-title">{it.title}</h3>
          <p className="item-authors">
            {it.authors.map((a, i) => (
              <React.Fragment key={i}>
                <span className={a.includes("Choi") && (a.startsWith("H.") || a.startsWith("Ho")) ? "item-me" : ""}>{a}</span>
                {i < it.authors.length - 1 && ", "}
              </React.Fragment>
            ))}
          </p>
          <p className="item-venue">
            <span className={`kind-tag kind-${it.kind}`}>{it.kind}</span>
            <span className="badge">{it.badge}</span>
            {it.year && <> · {it.year}</>}
          </p>
          <div className="item-links">
            {it.abstract && expand && (
              <button onClick={() => setOpen(!open)}>{open ? "hide abstract" : "abstract"}</button>
            )}
            {it.links.map((l, i) => (
              <React.Fragment key={i}>
                {(i > 0 || (it.abstract && expand)) && <span className="sep">·</span>}
                <a href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
              </React.Fragment>
            ))}
            {it.bibtex && (
              <>
                <span className="sep">·</span>
                <button onClick={() => setShowBib(true)}>bibtex</button>
              </>
            )}
          </div>
          {open && it.abstract && <p className="item-abstract">{it.abstract}</p>}
        </div>
        {showBib && <BibTexModal paper={it} onClose={() => setShowBib(false)} />}
      </article>
    );
  }

  function ThemeToggle({ theme, setTheme }) {
    const cycle = () => setTheme(theme === "auto" ? "light" : theme === "light" ? "dark" : "auto");
    const label = theme === "auto" ? "auto" : theme;
    const icon = theme === "dark" ? "☾" : theme === "light" ? "☀" : "◐";
    return (
      <button className="theme-toggle" onClick={cycle} title={`theme: ${label}`}>
        <span>{icon}</span><span>{label}</span>
      </button>
    );
  }

  function App() {
    const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
      "font": "sans",
      "expandAbstracts": true,
      "groupBy": "year"
    }/*EDITMODE-END*/;

    const [font, setFont] = React.useState(TWEAK_DEFAULTS.font);
    const [expandAbstracts, setExpandAbstracts] = React.useState(TWEAK_DEFAULTS.expandAbstracts);
    const [groupBy, setGroupBy] = React.useState(TWEAK_DEFAULTS.groupBy);
    const [theme, setTheme] = React.useState(() => localStorage.getItem("hjc-theme") || "auto");
    const [tweaksOpen, setTweaksOpen] = React.useState(false);

    React.useEffect(() => {
      localStorage.setItem("hjc-theme", theme);
      if (theme === "auto") document.documentElement.removeAttribute("data-theme");
      else document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    React.useEffect(() => {
      const onMsg = (e) => {
        const d = e.data || {};
        if (d.type === "__activate_edit_mode") setTweaksOpen(true);
        if (d.type === "__deactivate_edit_mode") setTweaksOpen(false);
      };
      window.addEventListener("message", onMsg);
      window.parent.postMessage({ type: "__edit_mode_available" }, "*");
      return () => window.removeEventListener("message", onMsg);
    }, []);

    const persist = (edits) => window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*");
    const update = {
      font: (v) => { setFont(v); persist({ font: v }); },
      expand: (v) => { setExpandAbstracts(v); persist({ expandAbstracts: v }); },
      group: (v) => { setGroupBy(v); persist({ groupBy: v }); },
    };

    const grouped = groupByYear(D.items);

    return (
      <div className={`site font-${font}`}>
        <div className="topbar">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        <main className="inner">
          {/* HEADER */}
          <section className="hero">
            <div className="avatar-col">
              <img src={window.HEADSHOT_SRC || "assets/headshot.jpg"} alt={D.name} className="avatar" />
              <div className="contact-icons">
                <a href={`mailto:${D.contact.email}`} title={D.contact.email} aria-label="Email"><Icon name="mail" /></a>
                <a href={D.contact.githubUrl} target="_blank" rel="noreferrer" title="GitHub" aria-label="GitHub"><Icon name="github" /></a>
                <a href={D.contact.linkedinUrl} target="_blank" rel="noreferrer" title="LinkedIn" aria-label="LinkedIn"><Icon name="linkedin" /></a>
              </div>
            </div>
            <div className="hero-main">
              <h1>{D.name}</h1>
              <p className="role">{D.role} <span className="accent">·</span> {D.affiliation}</p>
              <RenderBio bio={D.bio} />
              <div className="status">
                <span className="status-dot" />
                <span>{D.status}</span>
              </div>
            </div>
          </section>

          {/* PUBLICATIONS & PROJECTS */}
          <section className="section">
            <h2 className="section-title">
              Publications & Projects
              <span className="count">({D.items.length})</span>
            </h2>
            {groupBy === "year" ? (
              grouped.map(([year, items]) => (
                <div className="year-group" key={year}>
                  <div className="year-head">{year}</div>
                  {items.map((it) => <Item key={it.id} it={it} expand={expandAbstracts} />)}
                </div>
              ))
            ) : (
              <div className="year-group">
                {D.items.map((it) => <Item key={it.id} it={it} expand={expandAbstracts} />)}
              </div>
            )}
          </section>

          {/* NEWS */}
          <section className="section">
            <h2 className="section-title">News</h2>
            <ul className="news-list">
              {D.news.map((n, i) => (
                <li key={i}>
                  <span className="news-date">{n.date}</span>
                  <span>{n.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <footer className="foot">
            <span>© {new Date().getFullYear()} {D.name}</span>
            <span>Advised by <a href={D.advisorUrl} target="_blank" rel="noreferrer">{D.advisor}</a> · <a href={D.labUrl} target="_blank" rel="noreferrer">{D.lab}</a></span>
          </footer>
        </main>

        {tweaksOpen && (
          <div className="tweaks">
            <div className="tweaks-head">
              <strong>Tweaks</strong>
              <button className="tweaks-close" onClick={() => setTweaksOpen(false)}>×</button>
            </div>
            <TweakGroup label="Font" value={font} onChange={update.font} options={[
              { v: "sans", l: "Sans" },
              { v: "serif", l: "Serif" },
              { v: "mixed", l: "Plex" },
            ]} />
            <TweakGroup label="Abstracts" value={expandAbstracts ? "on" : "off"}
              onChange={(v) => update.expand(v === "on")} options={[
              { v: "on", l: "Expandable" },
              { v: "off", l: "Hidden" },
            ]} />
            <TweakGroup label="Group by" value={groupBy} onChange={update.group} options={[
              { v: "year", l: "Year" },
              { v: "none", l: "None" },
            ]} />
            <div className="tweaks-hint">Changes persist across refreshes.</div>
          </div>
        )}
      </div>
    );
  }

  function TweakGroup({ label, value, options, onChange }) {
    return (
      <div className="tweak-group">
        <div className="tweak-label">{label}</div>
        <div className="tweak-options">
          {options.map((o) => (
            <button key={o.v} className={`tweak-opt ${value === o.v ? "is-on" : ""}`} onClick={() => onChange(o.v)}>
              {o.l}
            </button>
          ))}
        </div>
      </div>
    );
  }

  window.App = App;
})();
