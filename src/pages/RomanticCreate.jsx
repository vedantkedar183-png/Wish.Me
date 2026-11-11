import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import DarkModeToggle from '../components/ui/DarkModeToggle';

import { validatePhotoFile } from '../utils/validation';
import { surpriseConfig } from '../data/surpriseConfig';

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'wishora_romantic_data';
const MAX_PHOTOS = 6;
const MAX_REASONS = 8;
const PRESET_ICONS = ['🎭', '🧲', '🍳', '🛡️', '🔭', '🎧', '🧩', '🌊', '⭐', '💖', '✨', '🌸'];

const DEFAULT_REASONS = [
  'Your dramatic storytelling that turns grocery trips into epic adventures',
  'That magnetic energy — people gravitate toward you without even realizing',
  'The way you dance in the kitchen when you think nobody is watching',
  'Your calm in the storm — an anchor for everyone around you',
];

/**
 * Compress an image file using an offscreen canvas to keep localStorage
 * storage within browser quotas.
 */
function compressImage(file, maxWidth = 900, maxHeight = 1100, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function generatePhotoId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

// ─── StepCard Component ───────────────────────────────────────────────────────
function StepCard({ icon, title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-pink-100/80 dark:border-gray-700/60"
    >
      <div className="mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 text-sm md:text-base">
          <span className="text-xl" aria-hidden="true">{icon}</span>
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-400 dark:text-gray-400 mt-1 ml-7">
            {description}
          </p>
        )}
      </div>
      {children}
    </motion.div>
  );
}

// ─── Main RomanticCreate Component ───────────────────────────────────────────
export default function RomanticCreate() {
  const navigate = useNavigate();

  // Load existing saved data from localStorage if available
  const [initialData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore parse errors
    }
    return null;
  });

  // ── Form State ──────────────────────────────────────────────────────────────
  const [name, setName] = useState(initialData?.name || '');
  const [age, setAge] = useState(initialData?.age ? String(initialData.age) : '');
  const [birthdayDate, setBirthdayDate] = useState(initialData?.birthdayDate || '');
  const [yourName, setYourName] = useState(initialData?.yourName || '');
  const [message, setMessage] = useState(initialData?.message || '');

  // Reasons list (user can add/remove up to 8)
  const [reasons, setReasons] = useState(() => {
    if (Array.isArray(initialData?.reasons) && initialData.reasons.length > 0) {
      return initialData.reasons.map((r) => (typeof r === 'string' ? r : r.text || ''));
    }
    return DEFAULT_REASONS;
  });

  // Photos list (up to 6)
  const [photos, setPhotos] = useState(() => {
    if (Array.isArray(initialData?.photos) && initialData.photos.length > 0) {
      return initialData.photos.map((p, idx) => ({
        id: `p-${idx}-${generatePhotoId()}`,
        src: typeof p === 'string' ? p : p.src,
        caption: typeof p === 'object' ? p.caption || '' : '',
      }));
    }
    return [];
  });

  const [errors, setErrors] = useState({});
  const [photoError, setPhotoError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // ── Photo Upload Handlers ───────────────────────────────────────────────────
  const handlePhotoFile = useCallback(
    async (file) => {
      if (!file) return;
      if (photos.length >= MAX_PHOTOS) {
        setPhotoError(`Maximum ${MAX_PHOTOS} photos allowed.`);
        return;
      }
      const err = validatePhotoFile(file);
      if (err) {
        setPhotoError(err);
        return;
      }
      setPhotoError('');

      try {
        const compressedBase64 = await compressImage(file);
        if (!compressedBase64) {
          setPhotoError('Could not process this image file.');
          return;
        }

        setPhotos((prev) => {
          if (prev.length >= MAX_PHOTOS) return prev;
          return [
            ...prev,
            {
              id: generatePhotoId(),
              src: compressedBase64,
              caption: '',
            },
          ];
        });
      } catch {
        setPhotoError('Failed to read image.');
      }
    },
    [photos.length],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files || []);
      const remainingSlots = MAX_PHOTOS - photos.length;
      files.slice(0, remainingSlots).forEach(handlePhotoFile);
    },
    [handlePhotoFile, photos.length],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_PHOTOS - photos.length;
    files.slice(0, remainingSlots).forEach(handlePhotoFile);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoError('');
  };

  const updatePhotoCaption = (index, newCaption) => {
    setPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, caption: newCaption } : photo)),
    );
  };

  // ── Reasons Handlers ────────────────────────────────────────────────────────
  const handleReasonChange = (index, value) => {
    setReasons((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addReason = () => {
    if (reasons.length >= MAX_REASONS) return;
    setReasons((prev) => [...prev, '']);
  };

  const removeReason = (index) => {
    if (reasons.length <= 1) return;
    setReasons((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Pre-fill with sample story ──────────────────────────────────────────────
  const handleFillSample = () => {
    setName(surpriseConfig.person.name);
    setAge(String(surpriseConfig.person.age));
    setBirthdayDate(surpriseConfig.person.birthdayDate);
    setYourName(surpriseConfig.person.yourName);
    setMessage(surpriseConfig.letter.paragraphs.join('\n\n'));
    setReasons(surpriseConfig.reasons.cards.map((c) => c.text));
    setErrors({});
  };

  // ── Clear field error helper ────────────────────────────────────────────────
  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // ── Validation & Submit ─────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Please enter the recipient's name.";
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!age || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 130) {
      newErrors.age = 'Please enter a valid age (e.g. 25).';
    }

    if (!birthdayDate.trim()) {
      newErrors.birthdayDate = 'Please enter their birthday date.';
    }

    if (!yourName.trim()) {
      newErrors.yourName = 'Please enter your name.';
    } else if (yourName.trim().length < 2) {
      newErrors.yourName = 'Your name must be at least 2 characters long.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    setSubmitError('');

    const romanticData = {
      name: name.trim(),
      age: Number(age),
      birthdayDate: birthdayDate.trim(),
      yourName: yourName.trim(),
      photos: photos.map((p) => ({
        src: p.src,
        caption: p.caption?.trim() || '',
      })),
      message: message.trim(),
      reasons: reasons.map((r) => r.trim()).filter(Boolean),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(romanticData));
    } catch (err) {
      console.warn('[Wishora] Failed to save romantic data:', err);
      // Do not navigate on failure — otherwise the next page falls back to the
      // default sample story and it looks like the button did nothing.
      setSubmitError(
        'Your browser storage is full, so this story could not be saved. Remove a few photos (or clear site data) and try again.',
      );
      return;
    }

    try {
      sessionStorage.setItem('wishora_romantic_preview', '1');
    } catch {
      // Non-fatal: the navigation state below is the primary hand-off.
    }

    navigate('/romantic', { state: { preview: true } });
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50/40 to-purple-50/30 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-pink-500 transition-colors text-sm"
            >
              ← Back to Home
            </button>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <button
                type="button"
                onClick={handleFillSample}
                className="text-xs px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 hover:bg-pink-200 transition-colors"
                title="Fill with sample romantic story data"
              >
                ✨ Fill Sample
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-3xl" aria-hidden="true">💌</span>
            <span className="text-2xl font-bold font-display text-gray-800 dark:text-white">
              Wishora Romantic
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-gray-800 dark:text-white">
            Craft a Romantic Birthday Story 💖
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs sm:text-sm md:text-base max-w-lg mx-auto">
            Design an enchanting, slide-by-slide journey with your own memories, special reasons, and love letter.
          </p>
        </motion.header>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* ── 1. Personal Details ────────────────────────────────────────── */}
          <StepCard
            icon="✍️"
            title="The Special Person"
            description="Details about who this romantic surprise is for and who it is from"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="name"
                  label="Recipient's Name"
                  required
                  placeholder="e.g. Sarah, Priya, Maya…"
                  value={name}
                  maxLength={50}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError('name');
                  }}
                  error={errors.name}
                  autoComplete="off"
                />

                <Input
                  id="age"
                  label="Their Age"
                  required
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 25"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    clearError('age');
                  }}
                  error={errors.age}
                  hint="Used in the reveal and finale chapter"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="birthdayDate"
                  label="Birthday Date"
                  required
                  placeholder="e.g. October 26, 2026"
                  value={birthdayDate}
                  maxLength={50}
                  onChange={(e) => {
                    setBirthdayDate(e.target.value);
                    clearError('birthdayDate');
                  }}
                  error={errors.birthdayDate}
                  hint="Displayed on their celebration card"
                />

                <Input
                  id="yourName"
                  label="Your Name (From)"
                  required
                  placeholder="e.g. Alex, Sam, Dev…"
                  value={yourName}
                  maxLength={50}
                  onChange={(e) => {
                    setYourName(e.target.value);
                    clearError('yourName');
                  }}
                  error={errors.yourName}
                  hint="Signed on the love letter and finale"
                />
              </div>
            </div>
          </StepCard>

          {/* ── 2. Photo Memories Gallery ─────────────────────────────────── */}
          <StepCard
            icon="📸"
            title={`Polaroid Scrapbook Photos (up to ${MAX_PHOTOS}, optional)`}
            description="Displayed as nostalgic polaroids in the Memories Gallery slide"
          >
            {/* Grid of uploaded photos */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {photos.map((photo, i) => (
                  <div key={photo.id} className="relative group flex flex-col gap-1.5">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-pink-800 shadow-sm bg-pink-50">
                      <img
                        src={photo.src}
                        alt={photo.caption || `Memory ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        aria-label={`Remove memory ${i + 1}`}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold shadow-md transition-colors flex items-center justify-center opacity-90 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={photo.caption}
                      maxLength={40}
                      onChange={(e) => updatePhotoCaption(i, e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone when under max */}
            {photos.length < MAX_PHOTOS && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload memories — drag and drop or click"
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()
                }
                className={clsx(
                  'border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer',
                  'transition-all duration-200 select-none',
                  isDragging
                    ? 'border-pink-400 bg-pink-50 dark:bg-pink-950/30 scale-[1.01]'
                    : 'border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-700 hover:bg-pink-50/50 dark:hover:bg-pink-950/20',
                )}
              >
                <div className="text-3xl mb-1.5" aria-hidden="true">
                  {isDragging ? '📂' : photos.length > 0 ? '➕' : '📷'}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-sm">
                  {isDragging
                    ? 'Drop photos here!'
                    : photos.length > 0
                      ? `Add more photos (${photos.length}/${MAX_PHOTOS})`
                      : 'Drag & drop photos or click to browse'}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-[11px] mt-0.5">
                  JPG, PNG, WebP · Max 5 MB each · Auto-optimized for instant loading
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              className="sr-only"
              onChange={handleFileInput}
              tabIndex={-1}
              aria-hidden="true"
            />

            {photoError && (
              <p role="alert" className="text-xs text-red-500 mt-2 flex items-start gap-1">
                <span aria-hidden="true">⚠️</span> {photoError}
              </p>
            )}
          </StepCard>

          {/* ── 3. Reasons They're Special ─────────────────────────────────── */}
          <StepCard
            icon="💎"
            title="Reasons They're Special"
            description={`Add between 1 and ${MAX_REASONS} reasons. These appear sequentially with glowing cards in the story.`}
          >
            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {reasons.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="w-9 h-9 shrink-0 rounded-xl bg-pink-100/70 dark:bg-pink-950/50 flex items-center justify-center text-lg shadow-sm"
                      aria-hidden="true"
                    >
                      {PRESET_ICONS[index % PRESET_ICONS.length]}
                    </span>

                    <input
                      type="text"
                      value={reason}
                      maxLength={120}
                      placeholder={`Reason #${index + 1} (e.g. How you see possibility everywhere...)`}
                      onChange={(e) => handleReasonChange(index, e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 bg-white dark:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    {reasons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReason(index)}
                        aria-label={`Remove reason #${index + 1}`}
                        className="w-9 h-9 shrink-0 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center text-sm font-semibold"
                      >
                        ✕
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {reasons.length} of {MAX_REASONS} reasons
                </span>

                {reasons.length < MAX_REASONS && (
                  <button
                    type="button"
                    onClick={addReason}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 py-1 px-3 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-colors"
                  >
                    <span>➕</span> Add Reason
                  </button>
                )}
              </div>
            </div>
          </StepCard>

          {/* ── 4. Personal Love Letter ────────────────────────────────────── */}
          <StepCard
            icon="💌"
            title="The Love Letter"
            description="Typewritten on vintage lined stationery during Slide 5"
          >
            <div className="space-y-3">
              <Textarea
                id="message"
                label="Love Letter Content"
                placeholder={
                  "Write from the depths of your heart... 💕\n\nTip: Separate your message with blank lines (double Enter) to create paragraphs that typewriter-animate one by one."
                }
                value={message}
                maxLength={1200}
                rows={6}
                onChange={(e) => {
                  setMessage(e.target.value);
                  clearError('message');
                }}
                error={errors.message}
                hint="Paragraphs will be revealed sequentially on parchment paper."
              />
            </div>
          </StepCard>

          {/* ── Actions / Submit ──────────────────────────────────────────── */}
          <div className="space-y-3 pb-8 safe-bottom">
            {submitError && (
              <p
                role="alert"
                className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3"
              >
                ⚠️ {submitError}
              </p>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="shadow-xl shadow-pink-500/25 text-base font-semibold"
            >
              Unwrap Romantic Story ✨
            </Button>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              Your customized story is saved locally — you can revisit and re-edit at any time.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
