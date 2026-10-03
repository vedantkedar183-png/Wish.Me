/**
 * Minimal page wrapper that ensures full viewport height and consistent base styling.
 */
export default function PageWrapper({ children, className = '' }) {
  return (
    <div className={`min-h-screen ${className}`}>
      {children}
    </div>
  );
}
