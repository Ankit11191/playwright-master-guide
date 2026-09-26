import React from 'react';
import { Smartphone, Download, X, CheckCircle, WifiOff, ExternalLink } from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => Promise<boolean>;
  isInstallable: boolean;
  isInstalled: boolean;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable,
  isInstalled,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Install on Android OS
              </h3>
              <p className="text-xs text-slate-500">Standalone Offline Application</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isInstalled ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-950">App Already Installed!</h4>
            <p className="text-xs text-emerald-800">
              You are running Playwright 50 Master Guide as a standalone Android app. All 50 questions, answers, and code snippets are available offline.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-600 leading-relaxed">
              Install this app directly onto your Android device home screen and app drawer. It runs like a native Android APK with zero browser address bar and works 100% offline.
            </p>

            {isInstallable && (
              <button
                onClick={async () => {
                  const success = await onInstall();
                  if (success) onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>1-Tap Install to Android Home Screen</span>
              </button>
            )}

            {/* Manual Android Instructions */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block">
                How to install on any Android browser:
              </span>
              <ol className="space-y-2 list-decimal list-inside text-slate-700">
                <li>
                  Open this link in <strong className="text-slate-900">Chrome</strong>, <strong className="text-slate-900">Samsung Internet</strong>, or <strong className="text-slate-900">Edge</strong>.
                </li>
                <li>
                  Tap the <strong className="text-slate-900">Three Dots Menu (⋮)</strong> at the top right of the browser.
                </li>
                <li>
                  Select <strong className="text-emerald-700">"Install app"</strong> or <strong className="text-emerald-700">"Add to Home screen"</strong>.
                </li>
                <li>
                  Tap <strong className="text-slate-900">"Install"</strong> to confirm. The Playwright icon will appear on your Android home screen!
                </li>
              </ol>
            </div>

            {/* Offline Highlight */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-100 p-2.5 rounded-lg">
              <WifiOff className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full read-only offline support. Works during commutes or flights without internet.</span>
            </div>
          </>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
