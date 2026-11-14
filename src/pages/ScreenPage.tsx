import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ActionPanel from '../components/ActionPanel';
import { BudgetCards, BudgetOverlay } from '../components/Budget';
import Lightbox from '../components/Lightbox';
import { QuestionsCards, QuestionsOverlay } from '../components/Questions';
import Stage from '../components/Stage';
import TopBar from '../components/TopBar';
import { getScreen, HOME_ID } from '../data/screens';
import NotFound from './NotFound';

export default function ScreenPage() {
  const params = useParams();
  const id = params.id ?? HOME_ID;
  const screen = getScreen(id);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setZoom(false);
    window.scrollTo(0, 0);
    if (screen) document.title = `${screen.title}｜The Blackwood Manor Case`;
    // Warm the cache for the screens this one links to, so navigation feels instant.
    screen?.hotspots.forEach((h) => {
      const t = h.to && getScreen(h.to);
      if (t) new Image().src = t.image;
    });
  }, [screen]);

  if (params.id === HOME_ID) return <Navigate to="/" replace />;
  if (!screen || screen.hidden) return <NotFound />;

  const overlay = screen.special === 'questions' ? <QuestionsOverlay /> : screen.special === 'budget' ? <BudgetOverlay /> : undefined;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <TopBar title={screen.title} group={screen.group} />
      <main className="flex flex-1 flex-col wide:items-center wide:justify-center">
        <Stage key={screen.id} screen={screen} onZoom={() => setZoom(true)} overlay={overlay} />
        {screen.special === 'questions' && <QuestionsCards />}
        {screen.special === 'budget' && <BudgetCards />}
        <ActionPanel hotspots={screen.hotspots} />
      </main>
      {zoom && <Lightbox src={screen.image} alt={screen.title} onClose={() => setZoom(false)} />}
    </div>
  );
}
