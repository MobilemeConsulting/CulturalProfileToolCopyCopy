import { ExternalLink } from 'lucide-react';

// Links naar de AHHA-website. Openen in een nieuw tabblad, zodat een
// half ingevulde vragenlijst niet verloren gaat.
const NAV_LINKS = [
  { label: 'Home', href: 'https://www.ahha.vlaanderen/' },
  { label: 'Team', href: 'https://www.ahha.vlaanderen/team-van-ahha/' },
  { label: 'Contact', href: 'https://www.ahha.vlaanderen/contacteer-vrijblijvend-ahha/' },
];

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
          <nav className="flex items-center gap-3 sm:gap-4 lg:gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-teal-600 transition-colors"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
