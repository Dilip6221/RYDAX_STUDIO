import { useLoader } from "../context/LoaderContext";

const GlobalLoader = () => {
  const { isLoading, loadingText } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="global-loader-overlay" role="status" aria-live="polite">
      <div className="global-loader-card">
        <div className="global-loader-spinner" aria-hidden="true">
          <div className="global-loader-spinner-core" />
        </div>
        <div className="global-loader-brand">RYDAX - Car Detailing Studio</div>
        <p className="global-loader-text">{loadingText}</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
