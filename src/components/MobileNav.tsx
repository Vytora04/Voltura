import { LayoutDashboard, Lightbulb, FileText, RotateCcw, LogOut, Menu, Settings, Leaf } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
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
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import volturaIcon from 'figma:asset/5e8dd4db2f6b512f177d18615fbae5e3203c67f4.png';

interface MobileNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onReset: () => void;
  onLogout: () => void;
  userName: string;
}

export function MobileNav({ currentScreen, onNavigate, onReset, onLogout, userName }: MobileNavProps) {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    onReset();
  };

  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    setOpen(false);
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-3 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img src={volturaIcon} className="w-8 h-8" alt="Voltura Logo" />
          <div>
            <span className="text-sm" style={{ color: '#0097A7' }}>Voltura</span>
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="py-4 border-b border-gray-200 mb-4">
                <div className="flex items-center gap-3">
                  <img src={volturaIcon} className="w-10 h-10" alt="Voltura Logo" />
                  <div>
                    <span className="text-xl block" style={{ color: '#0097A7' }}>Voltura</span>
                    <span className="text-xs" style={{ color: '#689F38' }}>See the Savings</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={isActive ? { backgroundColor: '#0097A7' } : {}}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{t(item.labelKey)}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                {/* User Info */}
                {userName && (
                  <div className="px-4 py-2 mx-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">{t('sidebar.loggedInAs')}</p>
                    <p className="text-sm text-gray-900 truncate">{userName}</p>
                  </div>
                )}
                
                <button
                  onClick={() => setShowResetDialog(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>{t('sidebar.resetData')}</span>
                </button>
                
                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('sidebar.logout')}</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
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
                setOpen(false);
                onLogout();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('sidebar.logoutDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}