import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Button from './ui/Button';
import ThemeCard from './ThemeCard';
import PreviewModal from './PreviewModal';
import TemplateGallery from './TemplateGallery';

import { themes, MUSIC_OPTIONS, OCCASIONS } from '../utils/themes';
import { templates } from '../data/templates';
import {
  validateForm,
  validatePhotoFile,
  validateFromName,
  MAX_MESSAGE_LENGTH,
} from '../utils/validation';

import { useBirthday } from '../context/BirthdayContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const THEME_LIST = Object.values(themes);
const MAX_PHOTOS = 6;

function generatePhotoId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepCard({ icon, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100/80 dark:border-gray-700/50"
    >
      <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 mb-4 text-sm md:text-base">
        <span className="text-xl" aria-hidden="true">{icon}</span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreatorForm() {
  const navigate = useNavigate();
  const { formData, updateForm, savePhoto, getPhoto } = useBirthday();

  // ── Form state (initialised from persisted context) ──────────────────────
  const [occasion, setOccasion] = useState(formData.occasion || 'birthday');
  const [name, setName] = useState(formData.name || '');
  const [message, setMessage] = useState(formData.message || '');
  const [fromName, setFromName] = useState(formData.fromName || '');
  const [theme, setTheme] = useState(formData.theme || 'romantic');
  const [music, setMusic] = useState(formData.music || 'none');
  const [selectedTemplate, setSelectedTemplate] = useState(formData.template || null);

  // ── Multi-photo state ───────────────────────────────────────────────────
  const [photoPreviews, setPhotoPreviews] = useState(() => {
    // Load existing photos from context
    const previews = [];
    if (formData.photoIds?.length) {
      formData.photoIds.forEach((id) => {
        const photo = getPhoto(id);
        if (photo) previews.push({ id, src: photo });
      });
    } else if (formData.photoId) {
      const photo = getPhoto(formData.photoId);
      if (photo) previews.push({ id: formData.photoId, src: photo });
    }
    return previews;
  });

  const [errors, setErrors] = useState({});
  const [photoError, setPhotoError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(!formData.name); // Show on first visit

  const fileInputRef = useRef(null);

  // ── Template selection ────────────────────────────────────────────────────
  const handleTemplateSelect = useCallback((template) => {
    setSelectedTemplate(template.id);
    setTheme(template.theme);
    setMessage(template.suggestedMessage);
    setShowTemplates(false);
  }, []);

  const handleTemplateSkip = useCallback(() => {
    setShowTemplates(false);
  }, []);

  // ── Multi-photo handling ──────────────────────────────────────────────────
  const handlePhotoFile = useCallback(
    (file) => {
      if (!file) return;
      if (photoPreviews.length >= MAX_PHOTOS) {
        setPhotoError(`Maximum ${MAX_PHOTOS} photos allowed.`);
        return;
      }
      const err = validatePhotoFile(file);
      if (err) {
        setPhotoError(err);
        return;
      }
      setPhotoError('');

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        const id = generatePhotoId();
        const saved = savePhoto(base64, id);
        if (!saved) {
          setPhotoError(
            'Could not save photo (storage full?). The page will still work — photo will be a placeholder.',
          );
        }
        setPhotoPreviews((prev) => [...prev, { id, src: base64 }]);
      };
      reader.onerror = () => setPhotoError('Failed to read the image file.');
      reader.readAsDataURL(file);
    },
    [savePhoto, photoPreviews.length],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files || []);
      files.slice(0, MAX_PHOTOS - photoPreviews.length).forEach(handlePhotoFile);
    },
    [handlePhotoFile, photoPreviews.length],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    files.slice(0, MAX_PHOTOS - photoPreviews.length).forEach(handlePhotoFile);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index) => {
    setPhotoPreviews((prev) => {
      const removed = prev[index];
      // Remove from localStorage
      if (removed?.id) {
        try { localStorage.removeItem(`wishora_photo_${removed.id}`); } catch {}
      }
      return prev.filter((_, i) => i !== index);
    });
    setPhotoError('');
  };

  // ── Shared state sync helper ──────────────────────────────────────────────
  const collectFormData = () => ({
    name: name.trim(),
    message: message.trim(),
    fromName: fromName.trim(),
    occasion,
    theme,
    music,
    photoId: photoPreviews[0]?.id || null,
    photoIds: photoPreviews.map((p) => p.id),
    template: selectedTemplate,
  });

  // ── Validation & submission ───────────────────────────────────────────────
  const handleSubmit = (e) => {
    e?.preventDefault();
    const values = collectFormData();
    const errs = validateForm(values);

    if (validateFromName && !errs.fromName) {
      const fromNameErr = validateFromName(values.fromName);
      if (fromNameErr) errs.fromName = fromNameErr;
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      const firstErrKey = Object.keys(errs)[0];
      document.getElementById(firstErrKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    updateForm(values);
    navigate('/surprise');
  };

  const handlePreview = () => {
    updateForm(collectFormData());
    setShowPreview(true);
  };

  const clearError = (field) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const selectedTheme = themes[theme] ?? themes.romantic;
  const occasionList = Array.isArray(OCCASIONS) ? OCCASIONS : Object.values(OCCASIONS || {});
  const currentOccasion =
    occasionList.find(
      (o) =>
        o.id === occasion ||
        (o.id === 'just_because' && occasion === 'just-because') ||
        (o.id === 'just-because' && occasion === 'just_because'),
    ) || occasionList[0] || { id: 'birthday', name: 'Birthday', emoji: '🎂' };


  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Live Preview Floating Badge ─────────────────────────────── */}
      <div className="fixed top-4 right-4 z-40">
        <motion.div
          key={`${theme}-${occasion}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border border-gray-200/80 dark:border-gray-700/80 text-xs font-medium text-gray-700 dark:text-gray-200"
        >
          <span
            className="w-3.5 h-3.5 rounded-full shadow-inner ring-1 ring-white/50 inline-block shrink-0"
            style={{
              background:
                selectedTheme.previewGradient || selectedTheme.glowColorHex || '#ec4899',
            }}
            title={`Theme: ${selectedTheme.name}`}
          />
          <span
            className="text-base leading-none select-none"
            role="img"
            aria-label={currentOccasion.name || 'Occasion'}
          >
            {currentOccasion.emoji || '🎂'}
          </span>
          <span className="hidden sm:inline font-semibold text-xs text-gray-800 dark:text-gray-100">
            {currentOccasion.name || currentOccasion.label || 'Birthday'}
          </span>
        </motion.div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30 py-8 px-4 transition-colors duration-300">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 hover:text-pink-500 transition-colors text-sm"
            >
              ← Back to Home
            </button>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-3xl" aria-hidden="true">🎂</span>
              <span className="text-2xl font-bold font-display text-gray-800 dark:text-white">Wishora</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-gray-800 dark:text-white">
              Create a Personalized Surprise ✨
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs sm:text-sm md:text-base">
              Fill in the details below to craft a magical moment
            </p>
          </motion.header>

          {/* ── Template Gallery (shown on first visit) ────────────────── */}
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StepCard icon="💡" title="Start with a Template (optional)">
                  <TemplateGallery
                    templates={templates}
                    onSelect={handleTemplateSelect}
                    onSkip={handleTemplateSkip}
                  />
                </StepCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show "Choose Template" button if templates were dismissed */}
          {!showTemplates && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowTemplates(true)}
              className="w-full text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500 hover:text-pink-500 transition-colors py-1"
            >
              💡 Browse greeting card templates
            </motion.button>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* ── 1. Photo Upload (Multi-photo) ─────────────────────────── */}
            <StepCard icon="📸" title={`Upload Photos (up to ${MAX_PHOTOS}, optional)`}>
              {/* Photo previews grid */}
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {photoPreviews.map((photo, i) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.src}
                        alt={`Photo ${i + 1}`}
                        className="w-full aspect-square rounded-2xl object-cover border-2 border-pink-200 dark:border-pink-800 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        aria-label={`Remove photo ${i + 1}`}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold shadow-md transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload zone (show if under max) */}
              {photoPreviews.length < MAX_PHOTOS && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload photos — drag and drop or click"
                  onKeyDown={(e) =>
                    (e.key === 'Enter' || e.key === ' ') &&
                    fileInputRef.current?.click()
                  }
                  className={clsx(
                    'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer',
                    'transition-all duration-200 select-none',
                    isDragging
                      ? 'border-pink-400 bg-pink-50 dark:bg-pink-950/30 scale-[1.01]'
                      : 'border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-700 hover:bg-pink-50/60 dark:hover:bg-pink-950/20',
                  )}
                >
                  <div className="text-4xl mb-2" aria-hidden="true">
                    {isDragging ? '📂' : photoPreviews.length > 0 ? '➕' : '📸'}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                    {isDragging
                      ? 'Drop it here!'
                      : photoPreviews.length > 0
                        ? `Add more photos (${photoPreviews.length}/${MAX_PHOTOS})`
                        : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    JPG, PNG, WebP, GIF · Max 5 MB each
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

            {/* ── 2. Choose Occasion ────────────────────────────────────── */}
            <StepCard icon="🎉" title="Choose Occasion">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {occasionList.map((occ) => {
                  const isSelected =
                    occasion === occ.id ||
                    (occ.id === 'just_because' && occasion === 'just-because') ||
                    (occ.id === 'just-because' && occasion === 'just_because');
                  return (
                    <motion.button
                      key={occ.id}
                      type="button"
                      onClick={() => setOccasion(occ.id)}
                      whileHover={{ scale: isSelected ? 1.04 : 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={clsx(
                        'relative rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer text-center',
                        'border-2 transition-all duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2',
                        isSelected
                          ? 'border-pink-500 bg-pink-50/70 dark:bg-pink-950/40 shadow-lg shadow-pink-500/20 scale-[1.02]'
                          : 'border-gray-200/80 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/40 hover:border-pink-200 dark:hover:border-pink-800 hover:bg-pink-50/30 dark:hover:bg-pink-950/20'
                      )}
                      aria-label={`Select ${occ.name || occ.label} occasion`}
                      aria-pressed={isSelected}
                    >
                      <span className="text-3xl sm:text-4xl drop-shadow-sm select-none" aria-hidden="true">
                        {occ.emoji}
                      </span>
                      <span
                        className={clsx(
                          'text-xs sm:text-sm font-semibold leading-tight',
                          isSelected
                            ? 'text-pink-600 dark:text-pink-400'
                            : 'text-gray-700 dark:text-gray-200'
                        )}
                      >
                        {occ.name || occ.label}
                      </span>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-5 h-5 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-md"
                          aria-hidden="true"
                        >
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </StepCard>

            {/* ── 3. Personal Details ─────────────────────────────────────── */}
            <StepCard icon="✍️" title="Personal Details">
              <div className="space-y-4">
                <Input
                  id="name"
                  label="Recipient's Name"
                  required
                  placeholder="e.g. Sarah, Rohan, Mum…"
                  value={name}
                  maxLength={50}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError('name');
                  }}
                  error={errors.name}
                  autoComplete="off"
                />

                <Textarea
                  id="message"
                  label="Your Personal Message"
                  required
                  placeholder={'Write something from the heart… 💕\n\ne.g. Wishing you a day as beautiful as you are! May this year bring you endless joy, laughter, and everything your heart desires.'}
                  value={message}
                  maxLength={MAX_MESSAGE_LENGTH}
                  rows={5}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    clearError('message');
                  }}
                  error={errors.message}
                />

                <Input
                  id="fromName"
                  label="From"
                  placeholder="Your name (optional)"
                  value={fromName}
                  maxLength={30}
                  onChange={(e) => {
                    setFromName(e.target.value);
                    clearError('fromName');
                  }}
                  error={errors.fromName}
                  hint="Who is this surprise from?"
                />
              </div>
            </StepCard>

            {/* ── 4. Theme Selection ─────────────────────────────────────── */}
            <StepCard icon="🎨" title="Choose a Theme">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                {THEME_LIST.map((t) => (
                  <ThemeCard
                    key={t.id}
                    theme={t}
                    isSelected={theme === t.id}
                    onSelect={setTheme}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                Selected:{' '}
                <strong className="text-gray-600 dark:text-gray-300">{selectedTheme.name}</strong>
              </p>
            </StepCard>

            {/* ── 5. Music ───────────────────────────────────────────────── */}
            <StepCard icon="🎵" title="Background Music (optional)">
              <Select
                label="Select a track"
                options={MUSIC_OPTIONS}
                value={music}
                onChange={(e) => setMusic(e.target.value)}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
                Music plays automatically when the birthday page opens.
                Browsers may require a tap/click first — a mute/unmute button
                is always visible on the birthday page.
              </p>
            </StepCard>

            {/* ── Actions ────────────────────────────────────────────────── */}
            <div className="space-y-3 pb-8 safe-bottom">
              <Button
                type="button"
                variant="outline"
                fullWidth
                size="lg"
                onClick={handlePreview}
              >
                👁️ Preview Birthday Page
              </Button>

              <Button
                type="submit"
                fullWidth
                size="lg"
                className="shadow-xl shadow-pink-500/25"
              >
                Create Surprise! ✨
              </Button>

              <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                Your progress is auto-saved — you can safely refresh this page.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* ── Preview Modal ──────────────────────────────────────────────── */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={() => {
          setShowPreview(false);
          handleSubmit();
        }}
        previewData={collectFormData()}
      />
    </>
  );
}
