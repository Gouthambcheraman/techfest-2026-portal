import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Zap } from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Feedback', to: '/feedback' },
];

export function Navbar() {
  const { user, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const navigate = useNavigate();

  async function logout() {
    setLogoutError('');
    try {
      await api.post('/auth/logout');
      setUser(null);
      setMenuOpen(false);
      navigate('/');
    } catch (error) {
      setLogoutError(getErrorMessage(error, 'Could not log out. Please try again.'));
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="TechFest home">
          <span className="brand-mark"><Zap size={19} fill="currentColor" /></span>
          <span>techfest<span className="brand-period">.</span></span>
        </Link>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav className={`nav-content${menuOpen ? ' nav-content-open' : ''}`} aria-label="Main navigation">
          <div className="nav-links">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={closeMenu} className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="nav-account">
            {user ? (
              <>
                <span className="nav-user" title={user.email}>{user.name}</span>
                <button className="nav-login nav-logout" type="button" onClick={logout}>
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <Link className="nav-login" to="/login" onClick={closeMenu}>Login <span aria-hidden="true">↗</span></Link>
            )}
          </div>
          {logoutError && <p className="nav-error" role="alert">{logoutError}</p>}
        </nav>
      </div>
    </header>
  );
}
