import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordProtectionProps {
  onUnlock: () => void;
}

const CORRECT_PASSWORD = 'aHHa$2026';

export function PasswordProtection({ onUnlock }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 border border-teal-600 mb-6">
              <Lock className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-3xl font-normal text-gray-900 mb-3">
              Beveiligde Toegang
            </h2>
            <div className="w-16 h-0.5 bg-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">
              De matching functionaliteit is alleen toegankelijk voor geautoriseerde gebruikers
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Wachtwoord
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border focus:outline-none transition-all ${
                    error
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-gray-300 focus:border-teal-600'
                  }`}
                  placeholder="Voer wachtwoord in"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <span className="font-semibold">✗</span>
                  Onjuist wachtwoord
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 hover:bg-teal-700 transition-all font-medium"
            >
              Toegang Verkrijgen
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center font-light">
              Neem contact op met <span className="font-medium text-gray-900">Bart Vandesompele</span> of{' '}
              <span className="font-medium text-gray-900">Filip Clarys</span> voor toegang
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
