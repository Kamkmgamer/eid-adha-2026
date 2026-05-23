import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import './LoadingScreen.css'

interface LoadingScreenProps {
  onComplete: () => void
}

/** Inline sheep SVG — Lucide has no sheep icon */
function SheepIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Body — fluffy wool */}
      <ellipse cx="24" cy="26" rx="14" ry="10" fill="currentColor" opacity="0.15" stroke="currentColor" />
      <circle cx="16" cy="22" r="4" fill="currentColor" opacity="0.2" stroke="currentColor" />
      <circle cx="24" cy="20" r="4.5" fill="currentColor" opacity="0.2" stroke="currentColor" />
      <circle cx="32" cy="22" r="4" fill="currentColor" opacity="0.2" stroke="currentColor" />
      <circle cx="20" cy="18" r="3.5" fill="currentColor" opacity="0.2" stroke="currentColor" />
      <circle cx="28" cy="18" r="3.5" fill="currentColor" opacity="0.2" stroke="currentColor" />
      {/* Head */}
      <ellipse cx="36" cy="20" rx="5" ry="4.5" fill="currentColor" opacity="0.1" stroke="currentColor" />
      <circle cx="38" cy="19" r="1" fill="currentColor" />
      {/* Ears */}
      <ellipse cx="40" cy="17" rx="2.5" ry="1.5" stroke="currentColor" transform="rotate(-20 40 17)" />
      {/* Legs */}
      <line x1="18" y1="34" x2="18" y2="42" />
      <line x1="24" y1="35" x2="24" y2="42" />
      <line x1="30" y1="34" x2="30" y2="42" />
    </svg>
  )
}

function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const duration = 5000
    const interval = 50
    const step = (interval / duration) * 100
    let current = 0

    const timer = setInterval(() => {
      current += step
      if (current >= 100) {
        current = 100
        clearInterval(timer)
        setProgress(100)
        // Start exit animation
        setTimeout(() => {
          setExiting(true)
          setTimeout(onComplete, 800)
        }, 300)
        return
      }
      setProgress(current)
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className={`loading-screen${exiting ? ' loading-exit' : ''}`}>
      {/* Decorative corner patterns */}
      <div className="loading-corner loading-corner--tl">
        <svg viewBox="0 0 100 100">
          <path d="M0,0 L100,0 L100,10 Q50,10 50,50 Q50,10 10,10 L10,100 L0,100 Z" />
          <path d="M20,0 L30,0 L30,5 Q60,5 60,30 L55,30 Q55,10 25,10 L20,10 Z" opacity="0.5" />
        </svg>
      </div>
      <div className="loading-corner loading-corner--tr">
        <svg viewBox="0 0 100 100">
          <path d="M0,0 L100,0 L100,10 Q50,10 50,50 Q50,10 10,10 L10,100 L0,100 Z" />
          <path d="M20,0 L30,0 L30,5 Q60,5 60,30 L55,30 Q55,10 25,10 L20,10 Z" opacity="0.5" />
        </svg>
      </div>
      <div className="loading-corner loading-corner--bl">
        <svg viewBox="0 0 100 100">
          <path d="M0,0 L100,0 L100,10 Q50,10 50,50 Q50,10 10,10 L10,100 L0,100 Z" />
        </svg>
      </div>
      <div className="loading-corner loading-corner--br">
        <svg viewBox="0 0 100 100">
          <path d="M0,0 L100,0 L100,10 Q50,10 50,50 Q50,10 10,10 L10,100 L0,100 Z" />
        </svg>
      </div>

      {/* Twinkling stars — using Lucide Star */}
      <div className="loading-stars">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="loading-star">
            <Star size={i % 3 === 0 ? 10 : i % 3 === 1 ? 8 : 12} fill="currentColor" />
          </span>
        ))}
      </div>

      {/* Central ornament */}
      <div className="loading-ornament">
        <div className="ornament-ring-outer" />
        <div className="ornament-ring" />
        <div className="ornament-ring-inner" />
        <div className="loading-crescent">
          <svg viewBox="0 0 64 64">
            <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28c6.2 0 11.9-2.02 16.54-5.44C42.76 57.72 38 53.3 38 44c0-11.046 8.954-20 20-20 1.38 0 2.73.14 4.03.4C58.7 13.04 46.48 4 32 4z" />
            {/* Star */}
            <path d="M48 8l1.8 3.6L54 13l-4.2 1.4L48 18l-1.8-3.6L42 13l4.2-1.4z" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <div className="loading-text">
        <div className="loading-bismillah">بسم الله الرحمن الرحيم</div>
        <div className="loading-subtitle">عيد أضحى مبارك</div>
      </div>

      {/* Progress */}
      <div className="loading-progress">
        <div
          className="loading-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sheep parade — SVG icons instead of emoji */}
      <div className="loading-sheep-parade">
        <span className="loading-sheep-item"><SheepIcon /></span>
        <span className="loading-sheep-item loading-sheep-item--flipped"><SheepIcon /></span>
        <span className="loading-sheep-item"><SheepIcon /></span>
        <span className="loading-sheep-item loading-sheep-item--flipped"><SheepIcon /></span>
        <span className="loading-sheep-item"><SheepIcon /></span>
      </div>
    </div>
  )
}

export default LoadingScreen
