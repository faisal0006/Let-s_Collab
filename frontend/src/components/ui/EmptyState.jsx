import React from 'react';

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  iconSize = 80,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {icon && (
        <div className="text-muted-foreground mb-4" style={{ fontSize: iconSize }}>
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-2xl font-semibold mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-base text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
