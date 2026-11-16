import { ArrowLeft, Home, Map, LayoutGrid, MapPin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HOME_ID, LOCATIONS_ID, MAP_ID, MENU_ID, screenPath } from '../data/screens';

interface Props {
  title: string;
  group: string;
}

const iconBtn =
  'flex h-10 w-10 items-center justify-center rounded-full text-parchment/85 transition hover:bg-white/10 hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass';

export default function TopBar({ title, group }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  // location.key is "default" on the first page the visitor landed on.
  const canGoBack = location.key !== 'default';

  return (
    <header className="sticky top-0 z-30 flex h-[var(--bar-h)] items-center gap-1 border-b border-brass/25 bg-wood/90 px-2 backdrop-blur pt-[env(safe-area-inset-top)]">
      <button
        type="button"
        className={iconBtn}
        aria-label="返回上一頁"
        onClick={() => (canGoBack ? navigate(-1) : navigate(screenPath(HOME_ID)))}
      >
        <ArrowLeft size={22} />
      </button>

      <div className="min-w-0 flex-1 px-1 text-center leading-tight">
        <div className="truncate font-display text-[11px] uppercase tracking-[0.2em] text-brass/80">{group}</div>
        <h1 className="truncate font-tc text-sm font-bold text-parchment sm:text-base">{title}</h1>
      </div>

      <nav className="flex items-center" aria-label="快速導覽">
        <Link to={screenPath(HOME_ID)} className={iconBtn} aria-label="首頁 Home Page" title="Home Page">
          <Home size={20} />
        </Link>
        <Link to={screenPath(MAP_ID)} className={iconBtn} aria-label="莊園地圖 Manor Map" title="Manor Map">
          <Map size={20} />
        </Link>
        <Link to={screenPath(MENU_ID)} className={iconBtn} aria-label="主選單 Main Menu" title="Main Menu">
          <LayoutGrid size={20} />
        </Link>
        <Link to={screenPath(LOCATIONS_ID)} className={iconBtn} aria-label="現場調查 Scene Investigation" title="Scene Investigation">
          <MapPin size={20} />
        </Link>
      </nav>
    </header>
  );
}
