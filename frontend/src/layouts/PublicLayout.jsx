import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useThemeMode } from '../hooks/useThemeMode';

function PublicLayout({ children, showAuth = true }) {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <>
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1
              className="text-2xl font-bold text-primary cursor-pointer"
              onClick={() => navigate('/')}
            >
              Let's Collab 🎨
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {showAuth && (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 font-semibold transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-semibold transition-opacity"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}

export default PublicLayout;
