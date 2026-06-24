import { ExternalLink } from 'lucide-react';

export function AhhaHeader() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          {/* Logo & Brand - Simpel zoals echte AHHA */}
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-normal text-black tracking-tight">AHHA</h2>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-sm text-gray-700 hover:text-teal-600 transition-colors">
              Home
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-teal-600 transition-colors">
              Team
            </a>
            <a
              href="https://www.ahha.vlaanderen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-teal-600 transition-colors"
            >
              <span>Contact</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
