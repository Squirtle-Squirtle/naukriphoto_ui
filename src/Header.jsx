// Header.jsx
function Header() {
  return (
    <header style={headerStyle}>
      <div style={{ fontWeight: 'bold', fontSize: '24px' }}>Naukri Photo</div>
      <nav>
        <ul style={navLinksStyle}>
          <li><a href="#home" style={linkStyle}>Home</a></li>
          <li><a href="#about" style={linkStyle}>Exam</a></li>
          <li><a href="#services" style={linkStyle}>Common</a></li>
          <li><a href="#contact" style={linkStyle}>SupportUs</a></li>
        </ul>
      </nav>
    </header>
  );
}

// Inline styling objects for quick setup
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 40px',
  backgroundColor: '#1a1a1a',
  color: '#ffffff'
};

const navLinksStyle = {
  display: 'flex',
  gap: '20px',
  listStyle: 'none',
  margin: 0,
  padding: 0
};

const linkStyle = {
  color: '#ffffff',
  textDecoration: 'none'
};

export default Header;
