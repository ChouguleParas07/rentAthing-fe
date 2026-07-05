import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import { CircleUser, UserRoundKey, Menu, X, Sparkles, UserRoundPen, LayoutDashboard, LogOut } from "lucide-react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/authSlice";

const navLinks = [
  { to: ROUTES.HOME, label: "Home" },
  { to: ROUTES.PRODUCTS, label: "Products" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="relative bg-amber-50 shadow-sm overflow-hidden">
      <div className="h-16 px-6 flex justify-between items-center relative z-10">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="group flex items-center gap-1 text-2xl font-bold text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-md"
        >
          <span>
            Stash
            <span className="text-lime-600 inline-block transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
              ly
            </span>
          </span>
          <Sparkles
            aria-hidden="true"
            className="w-4 h-4 text-amber-400 opacity-0 -translate-y-1 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group relative py-1 text-green-700 font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-md"
            >
              {item.label}
              <span className="absolute left-1/2 -bottom-0.5 h-2px w-0 -translate-x-1/2 bg-lime-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                to={ROUTES.DASHBOARD}
                className="group relative py-1 text-green-700 font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-md flex items-center gap-1"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
                <span className="absolute left-1/2 -bottom-0.5 h-2px w-0 -translate-x-1/2 bg-lime-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to={ROUTES.PROFILE}
                className="group relative py-1 text-green-700 font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-md"
              >
                <div className=" flex">
                  <UserRoundPen strokeWidth={3} />
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-full"
              >
                <div className="group relative overflow-hidden bg-gray-100 hover:bg-red-50 px-4 py-1.5 text-gray-700 hover:text-red-600 flex gap-1 font-bold font-mono items-center rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0">
                  <LogOut className="w-4 h-4 relative" />
                  <span className="relative">Logout</span>
                </div>
              </button>
            </>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-full"
            >
              <div className="group relative overflow-hidden bg-green-700 px-4 py-1.5 text-white flex gap-1 font-bold font-mono items-center rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-400/40 active:translate-y-0">
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />
                <UserRoundKey className="w-4 h-4 relative" />
                <span className="relative">Login</span>
              </div>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-md p-1"
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-64" : "max-h-0"
          }`}
      >
        <div className="flex flex-col gap-4 px-6 pb-5">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="text-green-700 font-extrabold"
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} onClick={() => setOpen(false)} className="text-green-700 font-extrabold flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to={ROUTES.PROFILE} onClick={() => setOpen(false)} className="w-fit">
                <div className="bg-green-700 text-white px-3 py-1 font-bold font-mono rounded-full flex items-center gap-1">
                  <CircleUser className="w-4 h-4" /> profile
                </div>
              </Link>
              <button onClick={() => { setOpen(false); handleLogout(); }} className="w-fit text-left">
                <div className="bg-gray-100 text-gray-700 px-4 py-1.5 flex gap-1 font-bold font-mono items-center rounded-full">
                  <LogOut className="w-4 h-4" /> Logout
                </div>
              </button>
            </>
          ) : (
            <Link to={ROUTES.LOGIN} onClick={() => setOpen(false)} className="w-fit">
              <div className="bg-green-700 px-4 py-1.5 text-white flex gap-1 font-bold font-mono items-center rounded-full">
                <UserRoundKey className="w-4 h-4" /> Login
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Animated wave divider — the stash "filling up" signature */}
      <div className="stashly-wave-wrap absolute inset-x-0 bottom-0 h-3 overflow-hidden" aria-hidden="true">
        <svg
          className="stashly-wave stashly-wave-back"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ width: "200%", height: "100%" }}
        >
          <path
            d="M0,30 Q60,18 120,30 T240,30 T360,30 T480,30 T600,30 T720,30 T840,30 T960,30 T1080,30 T1200,30 T1320,30 T1440,30 L1440,60 L0,60 Z"
            fill="url(#stashlyWaveGradBack)"
          />
          <defs>
            <linearGradient id="stashlyWaveGradBack" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="50%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="stashly-wave stashly-wave-front"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ width: "200%", height: "100%" }}
        >
          <path
            d="M0,30 Q45,8 90,30 T180,30 T270,30 T360,30 T450,30 T540,30 T630,30 T720,30 T810,30 T900,30 T990,30 T1080,30 T1170,30 T1260,30 T1350,30 T1440,30 L1440,60 L0,60 Z"
            fill="url(#stashlyWaveGradFront)"
          />
          <defs>
            <linearGradient id="stashlyWaveGradFront" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#65a30d" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style>{`
        .stashly-wave { position: absolute; bottom: 0; left: 0; }
        .stashly-wave-back { opacity: 0.45; animation: stashly-flow 14s linear infinite; }
        .stashly-wave-front { opacity: 0.6; animation: stashly-flow 7s linear infinite reverse; }
        @keyframes stashly-flow {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .stashly-wave-back, .stashly-wave-front { animation: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;