import { useEffect, useRef, useState } from "react";
import { useLoader } from "../context/LoaderContext";

function LoadingBar() {
  const { isLoading } = useLoader();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const active = useRef(false);

  useEffect(() => {
    if (isLoading) {
      active.current = true;
      setVisible(true);
      setProgress(8);
      // Estimated activity, not a measured API percentage. Never finish early.
      const interval = window.setInterval(() => {
        setProgress(value => Math.min(92, value + (92 - value) * 0.12));
      }, 350);
      return () => window.clearInterval(interval);
    }

    if (!active.current) return;
    setProgress(100);
    const timeout = window.setTimeout(() => {
      active.current = false;
      setVisible(false);
      setProgress(0);
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [isLoading]);

  return (
    <div
      className={`global-loading-bar api-progress-bar${visible ? " is-visible" : ""}`}
      role={visible ? "progressbar" : undefined}
      aria-label={visible ? (isLoading ? "Loading data" : "Request finished") : undefined}
      aria-hidden={!visible}
    >
      <div
        className="api-progress-fill"
        style={{ transform: `scaleX(${progress / 100})`, transition: visible ? undefined : "none" }}
      />
    </div>
  );
}

export default LoadingBar;
