import { useState } from "react";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/BalaSuryaPrakashv",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    color: "#e2e8f0",
    bg: "rgba(226,232,240,0.08)",
    border: "rgba(226,232,240,0.18)",
  },
  {
    name: "LeetCode",
    url: "https://leetcode.com/u/I80FDhTee6/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H19.7a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
    color: "#ffa116",
    bg: "rgba(255,161,22,0.08)",
    border: "rgba(255,161,22,0.25)",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/v-bala-surya-prakash",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "#0a66c2",
    bg: "rgba(10,102,194,0.10)",
    border: "rgba(10,102,194,0.30)",
  },
  {
    name: "Email",
    url: "mailto:vbalasuryaprakash@gmail.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30" height="30">
        <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75L35 40h7c1.657 0 3-1.343 3-3V16.2z"/>
        <path fill="#1e88e5" d="M3 16.2l3.614 1.71L13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z"/>
        <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"/>
        <path fill="#c62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859C9.132 8.301 8.228 8 7.298 8 4.924 8 3 9.924 3 12.298z"/>
        <path fill="#fbc02d" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341C38.868 8.301 39.772 8 40.702 8 43.076 8 45 9.924 45 12.298z"/>
      </svg>
    ),
    color: "#EA4335",
    bg: "rgba(234,67,53,0.08)",
    border: "rgba(234,67,53,0.25)",
  },
];

export default function SocialLinks() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <div style={styles.dividerLine} />
        <span style={styles.headerLabel}>Connect With Me</span>
        <div style={styles.dividerLine} />
      </div>

      <p style={styles.subtext}>
        Let's collaborate — reach out through any platform below.
      </p>

      <div style={styles.grid}>
        {socialLinks.map((link) => {
          const isHovered = hovered === link.name;
          return (
            <a
              key={link.name}
              href={link.url}
              target={link.name === "Email" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              onMouseEnter={() => setHovered(link.name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...styles.card,
                background: isHovered ? link.bg : "rgba(255,255,255,0.03)",
                border: `1px solid ${isHovered ? link.border : "rgba(255,255,255,0.08)"}`,
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isHovered
                  ? `0 8px 32px ${link.bg}, 0 0 0 1px ${link.border}`
                  : "none",
              }}
            >
              {/* Icon — always colored */}
              <div
                style={{
                  ...styles.iconBubble,
                  background: link.bg,
                  border: `1px solid ${link.border}`,
                  color: link.color,
                }}
              >
                {link.icon}
              </div>

              {/* Name only, no handle text */}
              <div style={styles.textGroup}>
                <span style={styles.platformName}>{link.name}</span>
              </div>

              {/* Arrow */}
              <div
                style={{
                  ...styles.arrow,
                  color: isHovered ? link.color : "rgba(255,255,255,0.2)",
                  transform: isHovered ? "translateX(4px)" : "translateX(0)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "40px 24px 48px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "12px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)",
  },
  headerLabel: {
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(167,139,250,0.8)",
    whiteSpace: "nowrap",
  },
  subtext: {
    textAlign: "center",
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    marginBottom: "32px",
    marginTop: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "14px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "18px 20px",
    borderRadius: "14px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    backdropFilter: "blur(8px)",
  },
  iconBubble: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.25s ease",
  },
  textGroup: {
    flex: 1,
    minWidth: 0,
  },
  platformName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.88)",
    letterSpacing: "0.01em",
  },
  arrow: {
    flexShrink: 0,
    transition: "all 0.2s ease",
  },
};
