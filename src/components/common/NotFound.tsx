import { Link } from "react-router-dom";

import { ROUTES } from "@/routes/routes";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        to={ROUTES.HOME}
        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Go home
      </Link>
    </div>
  );
};

export default NotFound;
