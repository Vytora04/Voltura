import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setLanguage(newLang);
    console.log('Language changed to:', newLang);
  };

  return (
    <div className="fixed top-4 right-4 z-[9999]" style={{ marginRight: 'calc(100vw - 100%)' }}>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="bg-white/90 backdrop-blur-sm border-2 hover:border-cyan-400 hover:bg-cyan-50 shadow-lg transition-all"
        style={{ borderColor: '#0097A7' }}
      >
        <Globe className="w-4 h-4 mr-2" style={{ color: '#0097A7' }} />
        <span style={{ color: '#0097A7' }}>{language === 'id' ? 'EN' : 'ID'}</span>
      </Button>
    </div>
  );
}