import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  Layout, 
  Mail, 
  Users, 
  Zap, 
  Database,
  Paintbrush,
  Share2,
  ArrowRight,
  Shield,
  GitBranch,
  Server,
  Lock
} from 'lucide-react';

const CollaborationVisual = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      icon: UserCheck,
      title: "User Login",
      subtitle: "Authentication",
      tech: ["JWT", "Passport.js", "OAuth"],
      color: "from-[hsl(195,45%,45%)] to-[hsl(195,45%,55%)]",
      iconColor: "text-[hsl(195,45%,45%)]",
      bgColor: "bg-[hsl(195,45%,45%)]/10"
    },
    {
      id: 2,
      icon: Layout,
      title: "Create Board",
      subtitle: "API Request",
      tech: ["React", "Express", "Prisma"],
      color: "from-[hsl(35,50%,50%)] to-[hsl(35,50%,60%)]",
      iconColor: "text-[hsl(35,50%,55%)]",
      bgColor: "bg-[hsl(35,50%,55%)]/10"
    },
    {
      id: 3,
      icon: Share2,
      title: "Invite Users",
      subtitle: "Collaboration",
      tech: ["Email", "Roles", "Permissions"],
      color: "from-[hsl(195,45%,50%)] to-[hsl(195,45%,60%)]",
      iconColor: "text-[hsl(195,45%,50%)]",
      bgColor: "bg-[hsl(195,45%,50%)]/10"
    },
    {
      id: 4,
      icon: Zap,
      title: "Socket.IO",
      subtitle: "Real-time Sync",
      tech: ["WebSocket", "Live Cursors", "Events"],
      color: "from-[hsl(35,50%,45%)] to-[hsl(35,50%,60%)]",
      iconColor: "text-[hsl(35,50%,55%)]",
      bgColor: "bg-[hsl(35,50%,55%)]/10"
    },
    {
      id: 5,
      icon: Paintbrush,
      title: "Collaborate",
      subtitle: "Excalidraw",
      tech: ["Drawing", "Shapes", "Text"],
      color: "from-[hsl(195,45%,45%)] to-[hsl(195,45%,55%)]",
      iconColor: "text-[hsl(195,45%,50%)]",
      bgColor: "bg-[hsl(195,45%,50%)]/10"
    },
    {
      id: 6,
      icon: Database,
      title: "Store in DB",
      subtitle: "MySQL",
      tech: ["Prisma ORM", "Auto-save", "Sync"],
      color: "from-[hsl(35,50%,50%)] to-[hsl(35,50%,60%)]",
      iconColor: "text-[hsl(35,50%,55%)]",
      bgColor: "bg-[hsl(35,50%,55%)]/10"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full h-full bg-background relative overflow-hidden rounded-xl border border-border/50">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] text-primary"></div>
      </div>

      {/* Main Content - Full Width Horizontal Flow */}
      <div className="relative h-full flex items-center justify-center px-4 md:px-8 py-8">
        <div className="w-full max-w-[95%] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 items-start">
            
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Node */}
                <div className="relative flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ 
                      opacity: 1, 
                      scale: activeStep === index ? 1.05 : 1,
                      y: 0
                    }}
                    transition={{ 
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    className="relative group w-full"
                  >
                    {/* Glow effect when active */}
                    {activeStep === index && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0, 0.3]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl blur-2xl`}
                      />
                    )}

                    {/* Step Card */}
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={`relative ${step.bgColor} backdrop-blur-sm border-2 ${
                        activeStep === index 
                          ? 'border-primary shadow-xl shadow-primary/20' 
                          : 'border-border/50 shadow-md'
                      } rounded-2xl p-4 md:p-5 transition-all duration-300 bg-card/80 min-h-[200px] md:min-h-[220px] flex flex-col`}
                    >
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -left-3 w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                        <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                      </div>

                      {/* Icon */}
                      <motion.div
                        animate={activeStep === index ? { 
                          rotate: [0, 3, -3, 0],
                          scale: [1, 1.08, 1]
                        } : {}}
                        transition={{ 
                          duration: 0.6,
                          repeat: activeStep === index ? Infinity : 0,
                          repeatDelay: 1.5
                        }}
                        className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-3 shadow-lg mx-auto relative`}
                      >
                        {React.createElement(step.icon, {
                          className: "w-7 h-7 md:w-9 md:h-9 text-white",
                          strokeWidth: 2
                        })}
                        
                        {/* Pulsing ring when active */}
                        {activeStep === index && (
                          <motion.div
                            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-xl`}
                          />
                        )}
                      </motion.div>

                      {/* Title */}
                      <h4 className="text-sm md:text-base font-bold text-foreground text-center mb-1.5">
                        {step.title}
                      </h4>

                      {/* Subtitle */}
                      <p className="text-xs text-muted-foreground text-center mb-3 font-medium">
                        {step.subtitle}
                      </p>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-1.5 justify-center mt-auto">
                        {step.tech.map((tech, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.15 + i * 0.08 }}
                            className={`text-[10px] px-2 py-1 rounded-md font-semibold ${
                              index % 2 === 0 
                                ? 'bg-primary/15 text-primary border border-primary/30' 
                                : 'bg-secondary/15 text-secondary border border-secondary/30'
                            }`}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>

                      {/* Active indicator dot */}
                      {activeStep === index && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-primary rounded-full shadow-lg"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      {/* Floating particles when active */}
                      {activeStep === index && (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, x: 0, y: 0 }}
                              animate={{ 
                                scale: [0, 1, 0],
                                x: [0, (Math.random() - 0.5) * 50],
                                y: [0, -20 - Math.random() * 30],
                                opacity: [0, 0.8, 0]
                              }}
                              transition={{ 
                                duration: 1.5,
                                delay: i * 0.3,
                                repeat: Infinity,
                                repeatDelay: 1
                              }}
                              className={`absolute top-1/4 left-1/2 w-1.5 h-1.5 bg-gradient-to-br ${step.color} rounded-full`}
                            />
                          ))}
                        </>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Arrow Connector (desktop only, between cards) */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scaleX: 1,
                      }}
                      transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                      className="hidden lg:flex absolute -right-8 top-1/2 -translate-y-1/2 items-center justify-center w-16 z-10"
                    >
                      {/* Flowing data line */}
                      <div className="relative w-full h-0.5">
                        <div className={`absolute inset-0 ${activeStep === index ? 'bg-primary' : 'bg-border'} rounded-full transition-colors duration-500`} />
                        <motion.div
                          animate={{
                            x: [-10, 70],
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: index * 0.2,
                            ease: "linear"
                          }}
                          className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 ${activeStep === index ? 'bg-primary' : 'bg-muted-foreground'} rounded-full shadow-md`}
                        />
                      </div>
                      <ArrowRight className={`w-4 h-4 -ml-1 ${activeStep === index ? 'text-primary' : 'text-muted-foreground'} transition-colors duration-500`} />
                    </motion.div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-card/90 backdrop-blur-md border border-border/50 rounded-full px-6 py-2.5 shadow-xl">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-secondary rounded-full shadow-lg shadow-secondary/50"
          />
          <span className="text-xs font-semibold text-foreground">
            Live Architecture
          </span>
        </div>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs text-muted-foreground font-medium">
          {steps[activeStep].title}
        </span>
      </div>

      {/* Tech Stack Legend - Top Right */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-md border border-border/50 rounded-xl p-3 shadow-lg max-w-[180px] hidden md:block">
        <h5 className="text-xs font-bold text-foreground mb-2.5 flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-primary" />
          Tech Stack
        </h5>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
            <span>Node.js + Express</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span>React + Vite</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
            <span>Socket.IO</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span>MySQL + Prisma</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default CollaborationVisual;
