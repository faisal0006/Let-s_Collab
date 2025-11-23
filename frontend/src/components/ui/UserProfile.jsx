import React from 'react';
import { User, Mail, AtSign } from 'lucide-react';

export function UserProfile({ user }) {
  if (!user) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold truncate">{user.name || 'User'}</h3>
          <p className="text-sm text-muted-foreground">Profile</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div className="flex items-start gap-3">
          <User size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
            <p className="text-sm font-medium truncate">{user.name || '-'}</p>
          </div>
        </div>

        {/* Username */}
        {user.username && (
          <div className="flex items-start gap-3">
            <AtSign size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Username</p>
              <p className="text-sm font-medium truncate">@{user.username}</p>
            </div>
          </div>
        )}

        {/* Email */}
        <div className="flex items-start gap-3">
          <Mail size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
            <p className="text-sm font-medium truncate">{user.email || '-'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
        </p>
      </div>
    </div>
  );
}
