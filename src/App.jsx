import { useEffect, useRef, useState } from 'react'
import './App.css'

const scenes = [
  'letter',
  'password',
  'secret',
  'song',
  'menu',
  'different',
  'reasons',
  'texts',
  'gifts',
  'memories',
  'promise',
]
const songSceneIndex = scenes.indexOf('song')
const passcode = '7826'

const pageNames = {
  letter: 'Intro',
  password: 'Password',
  secret: 'Message',
  menu: 'Map',
  different: 'Why you',
  reasons: 'Reasons',
  texts: 'Love text',
  gifts: 'Gifts',
  memories: 'Photos',
  song: 'Song',
  promise: 'Final',
}

const gifts = [
  {
    title: 'The truth',
    message: 'I did not plan to feel this much. Then you happened, and everything became softer.',
  },
  {
    title: 'The reason',
    message: 'You are not like anyone I knew before. You feel rare in a way I do not want to waste.',
  },
  {
    title: 'The answer',
    message: 'Yes, Malak. I love you. Quietly, loudly, and in all the tiny ways between.',
  },
]

const reasons = [
  'You make normal moments feel like something I want to remember.',
  'Your way of being soft, funny, and real stays in my head.',
  'With you, I do not feel like I have to pretend to be less myself.',
  'You are the kind of person my heart noticed before I knew what to call it.',
]

const loveNotes = [
  {
    title: 'When I miss you',
    message:
      'I start looking for you in every little thing: songs, places, jokes, quiet moments, and even the WhatsApp wallpaper.',
  },
  {
    title: 'When I see you',
    message: 'My day changes shape. Everything feels a little warmer, like the world remembered how to smile.',
  },
  {
    title: 'What I mean',
    message: 'I love you, Malak. Not as a simple sentence, but as something I keep choosing inside me.',
  },
]

const memories = [
  {
    title: 'A little dream of us',
    caption:
      'This is not a real memory, but I love it because it feels like a sweet little dream of us in another timeline.',
    image: '/assets/photos/memory-childhood.jpeg',
  },
  {
    title: 'Our silly little face',
    caption:
      'I love this because it is us being light, close, and completely unserious in the best way.',
    image: '/assets/photos/memory-silly-selfie-2.jpeg',
    position: 'center 34%',
  },
  {
    title: 'Right Where I Belong',
    caption:
      'I love this picture because every time I look at it, I remember how happy I am to have you standing beside me.',
    image: '/assets/photos/memory-mirror.jpeg',
  },
  {
    title: 'The Sound of Us',
    caption:
      'The jokes, the laughing, and the way we can turn an ordinary moment into something I want to replay again and again.',
    video: '/assets/videos/our-jokes-and-laughing.mp4',
  },
  {
    title: 'My Favorite Sunshine',
    caption:
      'This smile has its own sunlight. I swear it can make a normal day feel softer.',
    image: '/assets/photos/memory-yellow-smile.jpeg',
  },
]

const albumScatter = [
  { tilt: '-4deg', shift: '-7px' },
  { tilt: '3deg', shift: '8px' },
  { tilt: '-2deg', shift: '-5px' },
  { tilt: '4deg', shift: '6px' },
  { tilt: '-5deg', shift: '-8px' },
]

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function PixelHeart({ className = '' }) {
  return <span className={`pixel-heart ${className}`} aria-hidden="true" />
}

function MusicControl({ playing, onToggle, className = '' }) {
  return (
    <button
      type="button"
      className={`global-music-control ${className}`.trim()}
      onClick={onToggle}
      aria-label={playing ? 'Pause song' : 'Play song'}
      title={playing ? 'Pause song' : 'Play song'}
    >
      <span
        className={`music-heart-icon ${playing ? 'is-whole' : 'is-broken'}`}
        aria-hidden="true"
      >
        {playing ? '♥' : '💔'}
      </span>
    </button>
  )
}

function CoupleSprites() {
  return (
    <div className="couple" aria-hidden="true">
      <div className="sprite sprite-boy">
        <span className="hair" />
        <span className="face" />
        <span className="body" />
        <span className="legs" />
      </div>
      <div className="sprite sprite-girl">
        <span className="hair" />
        <span className="face" />
        <span className="dress" />
        <span className="legs" />
      </div>
      <PixelHeart className="between" />
    </div>
  )
}

function SceneShell({ children, scene, onBack, onNext, nextLabel = 'Next' }) {
  const pageNumber = scenes.indexOf(scene) + 1

  return (
    <main className="app-shell">
      <section className={`game-card scene-${scene}`} aria-live="polite">
        <div className="sky-layer" />
        <div className="stars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="cloud cloud-one" aria-hidden="true" />
        <div className="cloud cloud-two" aria-hidden="true" />
        <div className="cloud cloud-three" aria-hidden="true" />
        <div className="hud">
          <div className="lives" aria-label="three hearts">
            <PixelHeart />
            <PixelHeart />
            <PixelHeart />
          </div>
          <div className="hud-meta">
            <span>{pageNames[scene]}</span>
            <span>
              {pageNumber}/{scenes.length}
            </span>
          </div>
        </div>
        <div className="scene-content">{children}</div>
        <nav className="scene-nav" aria-label="Story controls">
          <button type="button" className="icon-button" onClick={onBack} disabled={!onBack}>
            <span aria-hidden="true">‹</span>
            <span className="sr-only">Back</span>
          </button>
          {onNext ? (
            <button type="button" className="primary-button" onClick={onNext}>
              {nextLabel}
            </button>
          ) : null}
        </nav>
      </section>
    </main>
  )
}

function LetterScene({ onNext }) {
  return (
    <SceneShell scene="letter" onNext={onNext} nextLabel="Open" />
  )
}

function PasswordScene({ onBack, onUnlock }) {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('Guess the password')

  function pressKey(key) {
    if (status === 'Unlocked') return

    const nextValue = key === 'clear' ? '' : `${input}${key}`.slice(0, passcode.length)
    setInput(nextValue)
    if (nextValue.length === passcode.length) {
      if (nextValue === passcode) {
        setStatus('Unlocked')
        window.setTimeout(onUnlock, 420)
      } else {
        setStatus('Try the love code')
        window.setTimeout(() => setInput(''), 260)
      }
    }
  }

  return (
    <SceneShell scene="password" onBack={onBack}>
      <div className="password-box pop-in">
        <h2>{status}</h2>
        <div className="pass-display" aria-label="password digits">
          {Array.from({ length: passcode.length }, (_, index) => (
            <span key={index}>{input[index] ? '♥' : '☆'}</span>
          ))}
        </div>
        <div className="keypad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', '♥'].map((key) => (
            <button
              key={key}
              type="button"
              className={key === 'clear' ? 'key key-clear' : 'key'}
              onClick={() => pressKey(key === '♥' ? '3' : key)}
            >
              {key === 'clear' ? '×' : key}
            </button>
          ))}
        </div>
        <p className="hint">Hint: our first confession</p>
      </div>
    </SceneShell>
  )
}

function SecretScene({ onBack, onNext }) {
  return (
    <SceneShell scene="secret" onBack={onBack} onNext={onNext} nextLabel="Continue">
      <div className="secret-scene pop-in">
        <div className="pixel-window">
          <div className="window-bar">
            <span>Unlocked message</span>
            <div>
              <i />
              <i />
              <i />
            </div>
          </div>
          <h2>For Malak</h2>
          <p>
            Because you are not like anyone I knew before, I did not want to tell you in an
            ordinary way.
          </p>
          <p>
            So I made you a tiny world, just to say the thing my heart keeps choosing.
          </p>
        </div>
      </div>
    </SceneShell>
  )
}

function MenuScene({ onBack, onNext }) {
  return (
    <SceneShell scene="menu" onBack={onBack} onNext={onNext} nextLabel="Begin">
      <div className="title-screen pop-in">
        <CoupleSprites />
        <h2>For You, Malak</h2>
        <p>This little game has pages for why you are different, love notes, photos, gifts, and the final thing I need to say.</p>
        <div className="mini-map" aria-label="Story pages">
          {['Why', 'Reasons', 'Texts', 'Gifts', 'Pics', 'Final'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}

function DifferentScene({ onBack, onNext }) {
  return (
    <SceneShell scene="different" onBack={onBack} onNext={onNext} nextLabel="Reasons">
      <div className="different-scene pop-in">
        <div className="pixel-window">
          <div className="window-bar">
            <span>Special file</span>
            <div>
              <i />
              <i />
              <i />
            </div>
          </div>
          <h2>You are not anyone else</h2>
          <p>
            Before you, I thought I would not love again, and that my passion had vanished.
            Then you came into my life, and suddenly the small things had meaning.
          </p>
          <p>
            You are different, Malak. Not because you try to be, but because being you is
            already something rare.
          </p>
        </div>
      </div>
    </SceneShell>
  )
}

function ReasonsScene({ onBack, onNext }) {
  return (
    <SceneShell scene="reasons" onBack={onBack} onNext={onNext} nextLabel="Texts">
      <div className="reasons-scene">
        <h2>Things I love</h2>
        <div className="reason-list">
          {reasons.map((reason, index) => (
            <article className="reason-card" key={reason}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{reason}</p>
            </article>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}

function TextsScene({ onBack, onNext }) {
  const [noteIndex, setNoteIndex] = useState(0)
  const note = loveNotes[noteIndex]
  const isLastNote = noteIndex === loveNotes.length - 1
  const isFirstNote = noteIndex === 0
  const goToPreviousNote = () => {
    if (isFirstNote) {
      onBack()
      return
    }
    setNoteIndex((index) => index - 1)
  }
  const goToNextNote = () => {
    if (isLastNote) {
      onNext()
      return
    }
    setNoteIndex((index) => index + 1)
  }

  return (
    <SceneShell scene="texts" onBack={goToPreviousNote} onNext={goToNextNote} nextLabel={isLastNote ? 'Gifts' : 'Next'}>
      <div className="texts-scene">
        <h2>Romantic texts</h2>
        <article className="phone-message pop-in">
          <div className="message-header">To Malak</div>
          <h3>{note.title}</h3>
          <p>{note.message}</p>
        </article>
        <div className="note-dots" aria-label="Choose romantic text">
          {loveNotes.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={noteIndex === index ? 'active' : ''}
              onClick={() => setNoteIndex(index)}
              aria-label={item.title}
            />
          ))}
        </div>
      </div>
    </SceneShell>
  )
}

function GiftsScene({ onBack, onNext }) {
  const [openGift, setOpenGift] = useState(0)
  const isFirstGift = openGift === 0
  const isLastGift = openGift === gifts.length - 1
  const goToPreviousGift = () => {
    if (isFirstGift) {
      onBack()
      return
    }
    setOpenGift((index) => index - 1)
  }
  const goToNextGift = () => {
    if (isLastGift) {
      onNext()
      return
    }
    setOpenGift((index) => index + 1)
  }

  return (
    <SceneShell scene="gifts" onBack={goToPreviousGift} onNext={goToNextGift} nextLabel={isLastGift ? 'Photos' : 'Next'}>
      <div className="gift-scene">
        <h2>Choose a gift</h2>
        <div className="gift-row">
          {gifts.map((gift, index) => (
            <button
              key={gift.title}
              type="button"
              className={`gift ${openGift === index ? 'selected' : ''}`}
              onClick={() => setOpenGift(index)}
              aria-label={gift.title}
            >
              <span className="gift-lid" />
              <span className="gift-box" />
            </button>
          ))}
        </div>
        <article className="message-card">
          <h3>{gifts[openGift].title}</h3>
          <p>{gifts[openGift].message}</p>
        </article>
      </div>
    </SceneShell>
  )
}

function MemoriesScene({
  onBack,
  onNext,
  onVideoPlay,
  onVideoAudioChange,
  onVideoStop,
  playing,
  onTogglePlayback,
}) {
  const [videoMuted, setVideoMuted] = useState(true)
  const goBackFromAlbum = () => {
    onVideoStop()
    onBack()
  }
  const goForwardFromAlbum = () => {
    onVideoStop()
    onNext()
  }

  return (
    <SceneShell
      scene="memories"
      onBack={goBackFromAlbum}
      onNext={goForwardFromAlbum}
      nextLabel="Final"
    >
      <div className="memories-scene">
        <MusicControl
          playing={playing}
          onToggle={onTogglePlayback}
          className="album-music-control"
        />
        <h2 className="album-title">
          <span>The</span>{' '}
          <span>Beginning</span>{' '}
          <span>of Our</span>{' '}
          <span>Album</span>
        </h2>
        <div className="photo-stack">
          {memories.map((memory, index) => (
            <article
              className="polaroid"
              key={memory.title}
              style={{
                '--tilt': memory.video ? '0deg' : albumScatter[index].tilt,
                '--shift': albumScatter[index].shift,
              }}
            >
              {memory.video ? (
                <video
                  className="memory-photo memory-video"
                  src={memory.video}
                  poster="/assets/videos/our-jokes-and-laughing-poster.jpg"
                  controls
                  playsInline
                  muted={videoMuted}
                  preload="metadata"
                  aria-label={memory.title}
                  onLoadedMetadata={(event) => {
                    event.currentTarget.volume = 1
                  }}
                  onPlay={onVideoPlay}
                  onVolumeChange={(event) => {
                    setVideoMuted(event.currentTarget.muted || event.currentTarget.volume === 0)
                    onVideoAudioChange(event)
                  }}
                  onPause={onVideoStop}
                  onEnded={onVideoStop}
                />
              ) : (
                <img
                  className="memory-photo"
                  src={memory.image}
                  alt={memory.title}
                  style={memory.position ? { objectPosition: memory.position } : undefined}
                />
              )}
              <h3>{memory.title}</h3>
              <p>{memory.caption}</p>
            </article>
          ))}
        </div>
        <p className="album-intro">
          Our story is still at its beginning. I cannot wait for us to make memories
          together and fill this album, one beautiful moment at a time.
        </p>
      </div>
    </SceneShell>
  )
}

function SongScene({ onBack, onNext, playing, currentTime, duration, onTogglePlayback, onSeek }) {
  const [coverOpen, setCoverOpen] = useState(false)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    if (!coverOpen) return undefined

    function closeOnEscape(event) {
      if (event.key === 'Escape') setCoverOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [coverOpen])

  return (
    <SceneShell scene="song" onBack={onBack} onNext={onNext} nextLabel="Enter world">
      <div className={`song-scene${coverOpen ? ' cover-open' : ''}`}>
        <p className="song-instruction">
          Press play, enter our little world, and let this song carry everything my heart
          wants to tell you.
        </p>
        <div className="player-window pop-in">
          <div className="window-bar">
            <span>Now playing</span>
            <div>
              <i />
              <i />
              <i />
            </div>
          </div>
          <button
            type="button"
            className="album-art-button"
            onClick={() => setCoverOpen(true)}
            aria-label="Open song poster"
            aria-expanded={coverOpen}
            title="View poster"
          >
            <img
              className="album-art"
              src="/assets/music/song-cover.png"
              alt="Men Gheir Kalam cover made for Malak"
            />
          </button>
          <div className="track-copy">
            <h2>Men Gheir Kalam</h2>
            <p>TUL8TE</p>
          </div>
          <button type="button" className="play-button" onClick={onTogglePlayback}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <div className="track-progress">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onInput={onSeek}
              aria-label="Song position"
              style={{ '--progress': `${progress}%` }}
            />
            <div className="track-time" aria-live="off">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        {coverOpen ? (
          <div
            className="cover-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Song poster preview"
            onClick={() => setCoverOpen(false)}
          >
            <button
              type="button"
              className="cover-lightbox-close"
              onPointerDown={(event) => {
                event.stopPropagation()
                setCoverOpen(false)
              }}
              onClick={(event) => {
                event.stopPropagation()
                setCoverOpen(false)
              }}
              aria-label="Close poster"
              title="Close"
              autoFocus
            >
              ×
            </button>
            <img
              src="/assets/music/song-cover.png"
              alt="Men Gheir Kalam cover made for Malak, enlarged"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        ) : null}
      </div>
    </SceneShell>
  )
}

function PromiseScene({ onBack }) {
  return (
    <SceneShell scene="promise" onBack={onBack}>
      <div className="promise-scene pop-in">
        <CoupleSprites />
        <h2>I love you, Malak</h2>
        <div className="promise-message">
          <div className="promise-message-label">
            <PixelHeart />
            <span>A message from my heart</span>
            <PixelHeart />
          </div>
          <p>
            Five years ago, when we first talked, I loved you even then. Life and things
            beyond our control took us in different directions, but what I felt for you
            always stayed somewhere inside me.
          </p>
          <p>
            Now, after all this time, I have fallen in love with you again. And if life
            brings us back to each other a hundred times, I know my heart will choose you
            every single time.
          </p>
          <p>
            I love you not because of one moment, one photo, or one perfect day. I love you
            because being close to you feels like finding a place my heart has always
            recognized.
          </p>
        </div>
        <p className="signature">
          <span aria-hidden="true">♥</span>
          Made with love by Omar.
          <span aria-hidden="true">♥</span>
        </p>
      </div>
    </SceneShell>
  )
}

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const audioRef = useRef(null)
  const videoAudioActiveRef = useRef(false)
  const resumeSongAfterVideoRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const scene = scenes[sceneIndex]
  const showMusicControl = sceneIndex > songSceneIndex
  const goNext = () => setSceneIndex((index) => Math.min(index + 1, scenes.length - 1))
  const goBack = sceneIndex > 0 ? () => setSceneIndex((index) => Math.max(index - 1, 0)) : undefined

  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
      return
    }

    audio.pause()
    setPlaying(false)
  }

  function seekTrack(event) {
    const audio = audioRef.current
    if (!audio) return
    const nextTime = Number(event.target.value)
    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  function pauseSongForVideo() {
    const audio = audioRef.current
    if (!audio) return

    if (!videoAudioActiveRef.current) {
      resumeSongAfterVideoRef.current = playing || !audio.paused
      videoAudioActiveRef.current = true
    }

    audio.pause()
  }

  function handleVideoPlay(event) {
    if (!event.currentTarget.muted && event.currentTarget.volume > 0) {
      pauseSongForVideo()
    }
  }

  function handleVideoAudioChange(event) {
    if (event.currentTarget.muted || event.currentTarget.volume === 0) {
      restoreSongAfterVideo()
      return
    }

    pauseSongForVideo()
  }

  async function restoreSongAfterVideo() {
    const audio = audioRef.current
    if (!audio || !videoAudioActiveRef.current) return

    videoAudioActiveRef.current = false
    audio.volume = 1

    if (!resumeSongAfterVideoRef.current) return

    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  let activeScene

  switch (scene) {
    case 'letter':
      activeScene = <LetterScene onNext={goNext} />
      break
    case 'password':
      activeScene = <PasswordScene onBack={goBack} onUnlock={goNext} />
      break
    case 'secret':
      activeScene = <SecretScene onBack={goBack} onNext={goNext} />
      break
    case 'song':
      activeScene = (
        <SongScene
          onBack={goBack}
          onNext={goNext}
          playing={playing}
          currentTime={currentTime}
          duration={duration}
          onTogglePlayback={togglePlayback}
          onSeek={seekTrack}
        />
      )
      break
    case 'menu':
      activeScene = <MenuScene onBack={goBack} onNext={goNext} />
      break
    case 'different':
      activeScene = <DifferentScene onBack={goBack} onNext={goNext} />
      break
    case 'reasons':
      activeScene = <ReasonsScene onBack={goBack} onNext={goNext} />
      break
    case 'texts':
      activeScene = <TextsScene onBack={goBack} onNext={goNext} />
      break
    case 'gifts':
      activeScene = <GiftsScene onBack={goBack} onNext={goNext} />
      break
    case 'memories':
      activeScene = (
        <MemoriesScene
          onBack={goBack}
          onNext={goNext}
          onVideoPlay={handleVideoPlay}
          onVideoAudioChange={handleVideoAudioChange}
          onVideoStop={restoreSongAfterVideo}
          playing={playing}
          onTogglePlayback={togglePlayback}
        />
      )
      break
    case 'promise':
      activeScene = <PromiseScene onBack={goBack} />
      break
    default:
      activeScene = null
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/music/men-gheir-kalam.mp3"
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {activeScene}
      {showMusicControl && scene !== 'memories' ? (
        <MusicControl playing={playing} onToggle={togglePlayback} />
      ) : null}
    </>
  )
}
