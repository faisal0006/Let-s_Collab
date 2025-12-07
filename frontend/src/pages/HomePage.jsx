import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CollaborationVisual from '../components/home/CollaborationVisual';
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
import { ProfileDropdown } from '../components/ui/ProfileDropdown';
import toast from 'react-hot-toast';

function HomePage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const [user, setUser] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setUserMenuAnchor(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

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
                  <div className="relative">
                    <button
                      onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                      className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
                      title="Profile"
                    >
                      <UserCircle size={20} />
                    </button>
                    <ProfileDropdown
                      user={user}
                      onLogout={handleLogout}
                      onUserUpdate={handleUserUpdate}
                      anchor={userMenuAnchor}
                      onClose={() => setUserMenuAnchor(null)}
                    />
                  </div>
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
        <section className="relative overflow-hidden pt-20 md:pt-32 pb-32">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(to_bottom,white,transparent)] -z-10"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            
            <h2 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Collaborate in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Real-Time</span> on Digital Whiteboards
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Create, share, and collaborate on whiteboards with your team. Perfect for brainstorming, design, and project planning.
            </p>
            
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-8 py-4 text-lg bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 font-semibold flex items-center gap-2 hover:-translate-y-1"
                  >
                    Get Started Free <ArrowRight size={20} />
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 text-lg bg-card border border-border text-foreground rounded-full hover:bg-accent transition-all font-semibold hover:-translate-y-1"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 text-lg bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 font-semibold flex items-center gap-2 mx-auto hover:-translate-y-1"
                >
                  Go to Your Whiteboards <ArrowRight size={20} />
                </button>
              )}
            </div>

            {/* Interactive Whiteboard Preview */}
            <div className="mt-20 relative mx-auto max-w-6xl aspect-[16/9] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
               <CollaborationVisual />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          <div className="absolute -left-40 top-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -right-40 bottom-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Collaborate
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Powerful features designed to help your team work together seamlessly, no matter where they are.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group bg-card border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                        <Icon size={28} />
                      </div>
                      <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <footer className="py-8 border-t border-border bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6" />
              <span className="font-bold text-lg">Let's Collab</span>
            </div>
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Let's Collab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
