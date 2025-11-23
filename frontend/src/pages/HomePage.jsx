import React from 'react';
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
} from 'lucide-react';
import { useThemeMode } from '../hooks/useThemeMode';

function HomePage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  const features = [
    {
      icon: Paintbrush,
      color: 'text-primary',
      title: 'Drawing Tools',
      description: 'Complete set of drawing tools including pen, shapes, text, and more for creative expression',
    },
    {
      icon: Zap,
      color: 'text-yellow-600',
      title: 'Real-Time Sync',
      description: 'See changes instantly as your team collaborates. Every stroke appears in real-time',
    },
    {
      icon: Lock,
      color: 'text-green-600',
      title: 'Secure & Private',
      description: 'Control permissions with viewer, editor, and owner roles. Your data stays protected',
    },
    {
      icon: Users,
      color: 'text-purple-600',
      title: 'Team Collaboration',
      description: 'Invite unlimited collaborators and work together seamlessly on any project',
    },
    {
      icon: Cloud,
      color: 'text-blue-600',
      title: 'Auto-Save',
      description: 'Never lose your work. Everything is automatically saved and synced to the cloud',
    },
    {
      icon: Laptop,
      color: 'text-red-600',
      title: 'Works Everywhere',
      description: 'Access your whiteboards from any device - desktop, tablet, or mobile',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary">
              Let's Collab 🎨
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="py-16 md:py-24 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6">
            Collaborate in Real-Time on Digital Whiteboards
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Create, share, and collaborate on whiteboards with your team. Perfect for brainstorming, design, and project planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 text-lg bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-lg bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-semibold"
            >
              View Demo
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <h3 className="text-4xl font-bold text-center mb-12">
            Everything You Need to Collaborate
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-[340px] flex flex-col items-center justify-start"
                >
                  <div className="flex items-center justify-center h-14 mb-4">
                    <Icon size={48} className={feature.color} />
                  </div>
                  <h4 className="text-xl font-semibold mb-4 h-8 flex items-center justify-center">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center bg-secondary rounded-2xl text-secondary-foreground mb-16">
          <h3 className="text-4xl font-bold mb-4">
            Ready to Start Collaborating?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of teams already using Let's Collab
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 text-lg bg-white text-secondary rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
