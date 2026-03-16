import { useSyncExternalStore } from "react";
import { getApiLoaderSnapshot, subscribeApiLoader } from "../utils/apiLoader";

function ApiLoaderOverlay() {
  const isLoading = useSyncExternalStore(subscribeApiLoader, getApiLoaderSnapshot);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="api-loader-overlay" role="status" aria-live="polite" aria-label="Loading">
      <div className="api-loader-spinner" />
      <span className="api-loader-text">Loading...</span>
    </div>
  );
}

export default ApiLoaderOverlay;
