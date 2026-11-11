import { Component, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { generateRomanticShareUrl } from '../../utils/encode';

// ─── Safe QR ──────────────────────────────────────────────────────────────────
// QR codes have a hard capacity limit. Beyond it qrcode.react throws during
// render, so we pick an error-correction level based on the URL length and hide
// the code entirely when even the lowest level can't fit it.
function qrLevelFor(length) {
  if (length <= 1100) return 'H';
  if (length <= 1500) return 'Q';
  if (length <= 2100) return 'M';
  if (length <= 2800) return 'L';
  return null;
}

class QrBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function QrFallback() {
  return (
    <div className="w-[172px] h-[172px] rounded-2xl bg-romantic-50 border border-romantic-100 flex flex-col items-center justify-center gap-2 px-4 text-center">
      <span className="text-3xl" aria-hidden="true">🔗</span>
      <p className="text-[11px] text-romantic-muted leading-snug">
        This story link is too long for a QR code — use Copy or WhatsApp instead.
      </p>
    </div>
  );
}

/**
 * Share sheet for a romantic story.
 * Shows a QR code, copy link, WhatsApp and the native share sheet (if any).
 */
export default function RomanticShareModal({ isOpen, onClose, config }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function',
    );
  }, []);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  const result = useMemo(() => {
    if (!isOpen || !config) return null;
    try {
      return generateRomanticShareUrl(config);
    } catch {
      return null;
    }
  }, [isOpen, config]);

  const shareUrl = result?.url || '';
  const photosOmitted = result?.photosOmitted ?? false;
  const qrLevel = qrLevelFor(shareUrl.length);

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const el = document.createElement('textarea');
      el.value = shareUrl;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      try {
        document.execCommand('copy');
      } catch {
        // ignore
      }
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent(
      `💌 I made a romantic birthday story for you. Open it here: ${shareUrl}`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;
    try {
      await navigator.share({
        title: 'A romantic birthday story 💌',
        text: 'I made something special for you.',
        url: shareUrl,
      });
    } catch {
      // user dismissed the sheet — nothing to do
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Share your romantic story"
          >
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-2 bg-gradient-to-r from-romantic-400 via-romantic-500 to-purple-500" />

              <div className="p-6 space-y-5">
                <div className="text-center">
                  <div className="text-4xl mb-1" aria-hidden="true">💌</div>
                  <h2 className="text-xl font-bold text-gray-800 font-display">
                    Share the Story
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Send this link to make their day unforgettable ✨
                  </p>
                </div>

                {shareUrl ? (
                  <div className="flex justify-center">
                    {qrLevel ? (
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                        <QrBoundary
                          key={`${qrLevel}-${shareUrl.length}`}
                          fallback={<QrFallback />}
                        >
                          <QRCodeSVG
                            value={shareUrl}
                            size={148}
                            level={qrLevel}
                            fgColor="#1e1e2e"
                            bgColor="#f9fafb"
                            includeMargin={false}
                          />
                        </QrBoundary>
                      </div>
                    ) : (
                      <QrFallback />
                    )}
                  </div>
                ) : (
                  <p className="text-center text-xs text-red-500">
                    Could not generate a link for this story.
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 truncate font-mono">
                    {shareUrl || 'Generating link…'}
                  </div>
                  <button
                    onClick={handleCopy}
                    disabled={!shareUrl}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      copied
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-romantic-500 hover:bg-romantic-600 text-white'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleWhatsApp}
                    disabled={!shareUrl}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-green-400 text-green-600 text-sm font-semibold hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    <span aria-hidden="true">📱</span> WhatsApp
                  </button>

                  {canNativeShare ? (
                    <button
                      onClick={handleNativeShare}
                      disabled={!shareUrl}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-romantic-300 text-romantic-600 text-sm font-semibold hover:bg-romantic-50 transition-colors disabled:opacity-50"
                    >
                      <span aria-hidden="true">📤</span> Share
                    </button>
                  ) : (
                    <button
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Done ✓
                    </button>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>📌 Photos:</strong>{' '}
                    {photosOmitted
                      ? 'this story has a lot of photos, so they stay on this device. The full story text, captions and reasons travel in the link.'
                      : 'the text, reasons, letter and photos all travel inside the link.'}
                  </p>
                </div>

                {canNativeShare && (
                  <button
                    onClick={onClose}
                    className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
