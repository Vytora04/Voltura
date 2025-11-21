import { LayoutDashboard, Lightbulb, FileText, RotateCcw, LogOut, Leaf, Zap, Settings } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { useLanguage } from '../contexts/LanguageContext';
import volturaIcon from '/voltura-logo.png';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isSetupComplete: boolean;
  onReset: () => void;
  onLogout: () => void;
  userName: string;
}

export function Sidebar({ currentScreen, onNavigate, isSetupComplete, onReset, onLogout, userName }: SidebarProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { t } = useLanguage();
  
  const navItems = [
    { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard },
    { id: 'setup', labelKey: 'sidebar.setup', icon: Settings },
    { id: 'recommendations', labelKey: 'sidebar.recommendations', icon: Lightbulb },
    { id: 'reports', labelKey: 'sidebar.reports', icon: FileText },
  ];

  const handleResetConfirm = () => {
    setShowResetDialog(false);
    onReset();
  };

  return (
    <div className="hidden lg:flex w-64 h-screen bg-gradient-to-b from-white via-emerald-50/30 to-teal-50/50 border-r-2 border-green-100 flex-col fixed left-0 top-0 shadow-sm">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <Leaf className="w-full h-full text-green-600 rotate-12" />
      </div>
      <div className="absolute bottom-20 left-4 w-20 h-20 opacity-5 pointer-events-none">
        <Leaf className="w-full h-full text-green-600 -rotate-45" />
      </div>

      {/* Logo/Brand */}
      <div className="p-6 border-b border-green-100 relative z-10">
        <div className="flex items-center gap-3">
          <img src={volturaIcon} className="w-12 h-12" alt="Voltura Logo" />
          <div>
            <span className="text-xl block" style={{ color: '#0097A7' }}>Voltura</span>
            <span className="text-xs" style={{ color: '#689F38' }}>See the Savings</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 relative z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          const isDisabled = !isSetupComplete && item.id !== 'setup';
          
          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onNavigate(item.id)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-200 ${
                isActive 
                  ? 'text-white shadow-lg scale-105' 
                  : isDisabled 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-white/60 hover:shadow-sm'
              }`}
              style={isActive ? { background: 'linear-gradient(135deg, #0097A7 0%, #00838F 100%)' } : {}}
            >
              <Icon className="w-5 h-5" />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t-2 border-green-100 space-y-3 relative z-10 bg-white/40 backdrop-blur-sm">
        {/* User Info */}
        {userName && (
          <div className="px-4 py-3 rounded-xl shadow-sm" style={{ background: 'linear-gradient(135deg, #689F38 0%, #558B2F 100%)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-3.5 h-3.5 text-white/80" />
              <p className="text-xs text-white/80">{t('sidebar.loggedInAs')}</p>
            </div>
            <p className="text-sm text-white truncate">{userName}</p>
          </div>
        )}
        
        <button
          onClick={() => setShowResetDialog(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white/60 hover:shadow-sm transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-sm">{t('sidebar.resetData')}</span>
        </button>
        
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">{t('sidebar.logout')}</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('sidebar.resetDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('sidebar.resetDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('sidebar.resetDialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetConfirm}
              className="text-white"
              style={{ backgroundColor: '#0097A7' }}
            >
              {t('sidebar.resetDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('sidebar.logoutDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('sidebar.logoutDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('sidebar.logoutDialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowLogoutDialog(false);
                onLogout();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('sidebar.logoutDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}