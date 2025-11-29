import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paintbrush,
  Zap,
  Lock,
  Users,
  Cloud,
  Laptop,
  Sun,
  Moon,
  ArrowRight,
  UserCircle,
} from 'lucide-react';
import { useThemeMode } from '../hooks/useThemeMode';
import Logo from '../components/Logo';

function HomePage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const features = [
    {
      icon: Paintbrush,
      title: 'Drawing Tools',
      description: 'Complete set of drawing tools including pen, shapes, text, and more for creative expression.',
    },
    {
      icon: Zap,
      title: 'Real-Time Sync',
      description: 'See changes instantly as your team collaborates. Every stroke appears in real-time.',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Control permissions with viewer, editor, and owner roles. Your data stays protected.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite unlimited collaborators and work together seamlessly on any project.',
    },
    {
      icon: Cloud,
      title: 'Auto-Save',
      description: 'Never lose your work. Everything is automatically saved and synced to the cloud.',
    },
    {
      icon: Laptop,
      title: 'Works Everywhere',
      description: 'Access your whiteboards from any device - desktop, tablet, or mobile.',
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Logo className="w-10 h-10" />
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Let's Collab
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {user ? (
                <>
                  <span className="hidden sm:inline text-sm text-muted-foreground">
                    Welcome, {user.name || user.username || user.email}
                  </span>
                  <button
                    onClick={() => navigate('/profile')}
                    className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    title="Profile"
                  >
                    <UserCircle size={20} />
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                  >
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 md:pt-24 pb-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              Collaborate in <span className="text-primary">Real-Time</span> on Digital Whiteboards
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Create, share, and collaborate on whiteboards with your team. Perfect for brainstorming, design, and project planning.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 text-lg bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 font-semibold flex items-center gap-2"
                >
                  Get Started Free <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 text-lg bg-card border border-border text-foreground rounded-full hover:bg-accent transition-colors font-semibold"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 text-lg bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 font-semibold flex items-center gap-2 mx-auto"
              >
                Go to Your Whiteboards <ArrowRight size={20} />
              </button>
            )}

            {/* Abstract decoration */}
            <div className="mt-16 relative mx-auto max-w-5xl">
              <div className="aspect-[16/9] bg-card rounded-xl border border-border shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-bold text-4xl">
                  Interactive Whiteboard Preview
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Collaborate
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to help your team work together seamlessly, no matter where they are.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group bg-card border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="relative rounded-3xl overflow-hidden bg-secondary px-6 py-20 text-center sm:px-12 lg:px-20">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-6">
                  Ready to Start Collaborating?
                </h3>
                <p className="text-lg text-secondary-foreground/80 mb-10">
                  Join thousands of teams already using Let's Collab to bring their ideas to life.
                </p>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-10 py-4 text-lg bg-background text-foreground rounded-full hover:bg-accent transition-all shadow-lg font-bold"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Let's Collab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
