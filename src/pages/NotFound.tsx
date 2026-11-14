import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-6 text-center font-tc">
      <p className="font-display text-sm uppercase tracking-[0.3em] text-brass">Case file not found</p>
      <h1 className="text-2xl font-bold">找不到這份檔案</h1>
      <p className="text-parchment/70">這個頁面不存在，或線索還沒解鎖。</p>
      <Link to="/" className="mt-2 rounded-full bg-gradient-to-r from-wine-dark to-wine-light px-6 py-3 font-display tracking-wider text-white">
        HOME PAGE
      </Link>
    </main>
  );
}
