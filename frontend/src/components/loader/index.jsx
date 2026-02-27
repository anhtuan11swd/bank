import "./index.css";

/**
 * Component Loader - Hiển thị spinner loading
 * Dùng cho AuthGuard và React Suspense fallback
 */
const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner" />
    </div>
  );
};

export default Loader;
