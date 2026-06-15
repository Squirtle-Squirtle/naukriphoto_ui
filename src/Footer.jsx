// Footer.jsx
function Footer() {
  // Automatically gets the current year dynamically
  const currentYear = new Date().getFullYear();

  return (
    <footer style={footerStyle}>
      <p>&copy; {currentYear} Naukri Photo. All rights reserved.</p>
      <div style={{ display: 'flex', gap: '15px' }}>
        <a href="#privacy" style={{ color: '#aaa' }}>Privacy Policy</a>
        <a href="#terms" style={{ color: '#aaa' }}>Terms of Use</a>
      </div>
    </footer>
  );
}

const footerStyle = {
  backgroundColor: '#111111',
  color: '#ffffff',
  textAlign: 'center',
  padding: '20px',
  position: 'relative',
  bottom: 0,
  width: '100%',
  marginTop: 'auto' // Pushes footer to the bottom if content is short
};

export default Footer;
