import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { generateShareUrl } from '../utils/encode';

/**
 * Share modal — displays a QR code, copyable link, and WhatsApp button.
 *
 * Receives the birthday `data` object directly (avoids context coupling when
 * data was decoded from a URL query param instead of localStorage).
 */
export default function ShareModal({ isOpen, onClose, data }) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      try {
        const url = generateShareUrl(data);
        setShareUrl(url ?? '');
        setQrError(!url);
      } catch {
        setQrError(true);
      }
    }
  }, [isOpen, data]);

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback for HTTP or restricted contexts
      const el = document.createElement('textarea');
      el.value = shareUrl;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getWhatsAppMessage = () => {
    switch (data?.occasion) {
      case 'anniversary':
        return '💍 I made a special anniversary surprise for you!';
      case 'friendship':
        return '🤝 I made something special for an amazing friend!';
      case 'justBecause':
      case 'just_because':
        return '💝 Someone made a special surprise for you!';
      case 'birthday':
      default:
        return '🎂 I made a special birthday surprise for you!';
    }
  };

  const handleWhatsApp = () => {
    const messageLead = getWhatsAppMessage();
    const text = encodeURIComponent(
      `${messageLead}\nOpen this link to see it: ${shareUrl}`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Share your surprise"
          >
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header gradient strip */}
              <div className="h-2 bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500" />

              <div className="p-6 space-y-5">
                {/* Title */}
                <div className="text-center">
                  <div className="text-4xl mb-1">🔗</div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Share this Surprise!
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Send the link to make their day magical ✨
                  </p>
                </div>

                {/* QR Code */}
                {!qrError && shareUrl && (
                  <div className="flex justify-center">
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                      <QRCodeSVG
                        value={shareUrl}
                        size={148}
                        level="H"
                        fgColor="#1e1e2e"
                        bgColor="#f9fafb"
                        includeMargin={false}
                      />
                    </div>
                  </div>
                )}

                {/* Copyable URL */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 truncate font-mono">
                      {shareUrl || 'Generating link…'}
                    </div>
                    <button
                      onClick={handleCopy}
                      disabled={!shareUrl}
                      className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        copied
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-pink-500 hover:bg-pink-600 text-white'
                      }`}
                    >
                      {copied ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Share actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleWhatsApp}
                    disabled={!shareUrl}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-green-400 text-green-600 text-sm font-semibold hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    <span>📱</span> WhatsApp
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Done ✓
                  </button>
                </div>

                {/* Sharing note */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>📌 Note about photos:</strong> Name, message & theme
                    travel in the link and work on any device. However, the
                    uploaded photo is stored on <em>this device only</em> — so
                    it may not appear for the recipient unless you&apos;re on the
                    same device. Everything else will look perfect! 🎉
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
