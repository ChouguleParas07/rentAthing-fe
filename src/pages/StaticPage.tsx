import { useLocation } from "react-router-dom";

export const StaticPage = () => {
  const location = useLocation();
  const title = location.pathname.substring(1).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-[60vh] bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🚧</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-500 text-lg">
          This page is currently under construction. We are working hard to bring you the best experience possible. Please check back later!
        </p>
      </div>
    </div>
  );
};

export default StaticPage;
