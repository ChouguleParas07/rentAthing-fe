import AppRoutes from "./routes/AppRoutes";
import { useProfile } from "./hooks/auth/useProfile";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

const App = () => {
  const { isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-green-700 font-medium tracking-wide">Loading Stashly...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default App;