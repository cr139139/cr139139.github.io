// Shared: inline SVG icons and BibTeX modal

(function () {
  function Icon({ name, size = 18 }) {
    const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
    if (name === "mail") return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>;
    if (name === "github") return <svg {...p}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>;
    if (name === "linkedin") return <svg {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
    if (name === "scholar") return <svg {...p}><path d="M12 3L2 9l10 6 10-6-10-6z"/><path d="M6 10v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>;
    if (name === "external") return <svg {...p}><path d="M10 14L21 3M21 3h-6M21 3v6M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>;
    return null;
  }

  function PaperThumb({ paper }) {
    const [failed, setFailed] = React.useState(false);
    const seed = (paper.id || paper.title).split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
    // blue + coral variants only (no orange/amber)
    const palette = paper.kind === "project"
      ? [[340, 55, 58], [350, 50, 62], [330, 48, 56]]   // coral family
      : [[215, 60, 48], [220, 55, 42], [208, 50, 55]];  // blue family
    const [h, s, l] = palette[Math.abs(seed) % palette.length];
    const h2 = (h + 20) % 360;

    if (paper.thumb && !failed) {
      return (
        <img
          src={paper.thumb}
          alt={paper.teaserAlt || paper.title}
          className="item-thumb-img"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      );
    }
    const initials = (paper.id || "")
      .split(/[-_]/).map((s) => s[0]).join("").slice(0, 3).toUpperCase();

    return (
      <div className="item-thumb-ph" aria-label={paper.teaserAlt || paper.title}>
        <svg viewBox="0 0 88 66" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`pg-${paper.id}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor={`hsl(${h} ${s}% ${l}%)`} />
              <stop offset="1" stopColor={`hsl(${h2} ${s}% ${Math.max(28, l - 14)}%)`} />
            </linearGradient>
          </defs>
          <rect width="88" height="66" fill={`url(#pg-${paper.id})`} />
          <circle cx={20 + (Math.abs(seed) % 48)} cy={40} r="14" fill="rgba(255,255,255,0.14)" />
        </svg>
        <span className="item-thumb-initials">{initials}</span>
      </div>
    );
  }

  function BibTexModal({ paper, onClose }) {
    const [copied, setCopied] = React.useState(false);
    const textRef = React.useRef(null);

    React.useEffect(() => {
      const onKey = (e) => e.key === "Escape" && onClose();
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const copy = async () => {
      try {
        await navigator.clipboard.writeText(paper.bibtex);
        setCopied(true); setTimeout(() => setCopied(false), 1600);
      } catch {
        if (textRef.current) {
          textRef.current.select(); document.execCommand("copy");
          setCopied(true); setTimeout(() => setCopied(false), 1600);
        }
      }
    };

    return ReactDOM.createPortal(
      <div className="bib-backdrop" onClick={onClose}>
        <div className="bib-modal" onClick={(e) => e.stopPropagation()}>
          <div className="bib-head">
            <div>
              <div className="bib-eyebrow">BibTeX</div>
              <div className="bib-title">{paper.title}</div>
            </div>
            <button className="bib-close" onClick={onClose} aria-label="Close">×</button>
          </div>
          <textarea ref={textRef} className="bib-text" value={paper.bibtex} readOnly spellCheck="false" />
          <div className="bib-actions">
            <button className="bib-copy" onClick={copy}>{copied ? "✓ Copied" : "Copy to clipboard"}</button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  Object.assign(window, { Icon, PaperThumb, BibTexModal });
})();
