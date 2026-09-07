import { useEffect, useRef, useState } from 'react';
import { Moon, Sun, Play, Pause, Volume2, VolumeX, Heart } from 'lucide-react';
import { useAudio } from './hooks/useAudio';
import { reflections as cards } from './data/reflections';

function AlcheMindMark({ label = false }: { label?: boolean }) {
  return <span className="brand-lockup">
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M39 14.3A18 18 0 1 0 41.4 30" />
      <path d="M11.5 27.5c5.2-6 19.6-8.6 25-1.2" />
      <circle cx="31.8" cy="18.2" r="2.8" />
    </svg>
    {label && <span>The AlcheMind Studio</span>}
  </span>;
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [dark, setDark] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const audio = useAudio();
  useEffect(() => () => clearTimeout(timer.current), []);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 950;
    timer.current = setTimeout(() => {
      setIndex(previous => (previous + 1 + Math.floor(Math.random() * (cards.length - 1))) % cards.length);
      setSpinning(false);
    }, delay);
  }

  return <div className={`app-shell ${dark ? 'night' : ''}`}>
    <div className="sky" aria-hidden="true" /><div className="atmosphere" aria-hidden="true" />
    <header className="topbar">
      <a href="#main" className="mini-brand" aria-label="Intuition Spinner home"><AlcheMindMark /></a>
      <div className="title-block"><h1>Intuition Spinner</h1><p>A small pause. A little clarity.</p></div>
      <button className="round-icon theme-toggle" onClick={() => setDark(value => !value)} aria-label={dark ? 'Use light theme' : 'Use dark theme'}>{dark ? <Sun size={20} /> : <Moon size={20} />}</button>
    </header>

    <main id="main" className="ritual">
      <section className="spinner-zone" aria-label="Spin for a reflection">
        <div className={`inner-portal ${spinning ? 'is-listening' : ''}`}>
          <span className="portal-aura" aria-hidden="true" />
          <button className="portal-button" onClick={spin} disabled={spinning} aria-label={spinning ? 'Listening for guidance' : 'Spin for guidance'}>
            <span className="portal-ring ring-outer" aria-hidden="true"><i /></span>
            <span className="portal-ring ring-middle" aria-hidden="true" />
            <span className="portal-ring ring-inner" aria-hidden="true" />
            <span className="portal-center" aria-hidden="true" />
            <span className="portal-copy">
              <span className="spin-label">{spinning ? 'LISTEN' : 'SPIN'}</span>
              <span className="spin-note">return to yourself</span>
            </span>
          </button>
        </div>
      </section>

      <section className="reading-zone" aria-label="Your reflection">
        <article className={`reflection-card ${spinning ? 'card-turning' : ''}`} aria-live="polite" aria-busy={spinning}>
          <div className="card-kicker">A QUIET INVITATION</div>
          <div className="reflection-copy"><h2>{cards[index][0]}</h2><p className="question">{cards[index][1]}</p><span className="soft-line" /><p className="whisper">{cards[index][2]}</p></div>
          <p className="permission">Take what speaks to you. Leave the rest.</p>
        </article>
        <div className="sound-panel">
          <button className="round-icon" onClick={audio.togglePlay} aria-label={audio.isPlaying ? 'Pause music' : 'Play music'}>{audio.isPlaying ? <Pause size={18} /> : <Play size={18} />}</button>
          <div className="track-control"><label htmlFor="track">A little background company</label><select id="track" value={audio.currentTrack.id} onChange={event => audio.changeTrack(event.target.value)}>{audio.tracks.map(track => <option key={track.id} value={track.id}>{track.name}</option>)}</select></div>
          <button className="round-icon" onClick={audio.toggleMute} aria-label={audio.isMuted ? 'Unmute music' : 'Mute music'}>{audio.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
          <input type="range" aria-label="Music volume" min="0" max="1" step="0.05" value={audio.volume} onChange={event => audio.adjustVolume(Number(event.target.value) - audio.volume)} />
        </div>
        {audio.error && <p className="audio-error" role="status">{audio.error}</p>}
      </section>
    </main>
    <footer className="footer">
      <span className="made-by">A peaceful space made with <Heart className="love-heart" size={16} fill="currentColor" aria-hidden="true" /><span className="sr-only">love</span></span>
      <span className="copyright">© 2025 The AlcheMind Studio</span>
    </footer>
  </div>;
}
