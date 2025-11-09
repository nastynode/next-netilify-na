export default function Header() {
  const pages = [
    { label: "Meetings", url: "/" },
    { label: "JFT", url: "/jft" },
    { label: "SPAD", url: "/spad" },
  ];

  return (
    <header className="app-header">
      <nav className="nav-container">
        {pages.map((item) => (
          <a key={item.url} href={item.url} className="nav-link">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
