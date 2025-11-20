import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, AlertCircle, Leaf, Zap, TrendingDown, Loader2 } from 'lucide-react';
import volturaIcon from 'figma:asset/5e8dd4db2f6b512f177d18615fbae5e3203c67f4.png';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToSignup: () => void;
  loginError?: string;
  isLoading?: boolean;
}

export function LoginScreen({ onLogin, onNavigateToSignup, loginError, isLoading }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError(t('login.error.fill'));
      return;
    }

    if (!email.includes('@')) {
      setError(t('login.error.email'));
      return;
    }

    onLogin(email, password);
  };

  const { language } = useLanguage();
  
  // Use loginError from props if available, otherwise use local error
  const displayError = loginError || error;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #689F38 0%, transparent 70%)' }}></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #0097A7 0%, transparent 70%)' }}></div>
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #FFC107 0%, transparent 70%)' }}></div>
        
        {/* Leaf Pattern */}
        <div className="absolute top-10 left-10 opacity-10">
          <Leaf className="w-24 h-24 text-green-600" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10">
          <Leaf className="w-32 h-32 text-green-600 rotate-45" />
        </div>
        <div className="absolute top-1/3 right-10 opacity-10">
          <Leaf className="w-20 h-20 text-green-600 -rotate-12" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Branding & Features */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-cyan-50 to-green-50 p-2 rounded-xl shadow-sm">
                  <img src={volturaIcon} alt="Voltura" className="w-16 h-16" />
                </div>
                <div>
                  <span className="text-5xl" style={{ color: '#0097A7' }}>Voltura</span>
                  <p className="text-sm" style={{ color: '#689F38' }}>See the Savings</p>
                </div>
              </div>
              
              <h2 className="text-4xl text-gray-900 mb-3">
                {t('login.hero.title').split('\\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h2>
              <p className="text-lg text-gray-600">{t('login.hero.subtitle')}</p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm border-2 border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#689F38' }}>
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{t('login.feature1.title')}</h3>
                    <p className="text-sm text-gray-600">{t('login.feature1.desc')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-cyan-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0097A7' }}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{t('login.feature2.title')}</h3>
                    <p className="text-sm text-gray-600">{t('login.feature2.desc')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#689F38' }}>
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{t('login.feature3.title')}</h3>
                    <p className="text-sm text-gray-600">{t('login.feature3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Mobile Header */}
            <div className="text-center mb-6 lg:hidden">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-cyan-50 to-green-50 p-2 rounded-lg shadow-sm">
                  <img src={volturaIcon} alt="Voltura" className="w-14 h-14" />
                </div>
                <span className="text-4xl" style={{ color: '#0097A7' }}>Voltura</span>
              </div>
              <h1 className="text-gray-900 mb-2">{t('login.title')}</h1>
              <p className="text-gray-600 text-sm">{t('login.subtitle')}</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-gray-900 mb-2">{t('login.title')}</h1>
              <p className="text-gray-600">{t('login.subtitle')}</p>
            </div>

            {/* Login Form */}
            <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-green-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                {displayError && (
                  <Alert variant="destructive" className="bg-red-50">
                    <AlertCircle className="h-4 h-4" />
                    <AlertDescription>{displayError}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#0097A7' }}>{t('login.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('login.placeholder.email')}
                    className="mt-1.5 border-2 bg-white rounded-xl focus-visible:ring-1"
                    style={{ borderColor: 'rgba(0, 151, 167, 0.3)', '--tw-ring-color': 'rgba(0, 151, 167, 0.5)' } as React.CSSProperties}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#0097A7' }}>{t('login.password')}</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('login.placeholder.password')}
                      className="pr-10 border-2 bg-white rounded-xl focus-visible:ring-1"
                      style={{ borderColor: 'rgba(0, 151, 167, 0.3)', '--tw-ring-color': 'rgba(0, 151, 167, 0.5)' } as React.CSSProperties}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #0097A7 0%, #00838F 100%)' }}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                  {t('login.button')}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">{t('login.noAccount')}</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <Button
                type="button"
                variant="outline"
                onClick={onNavigateToSignup}
                className="w-full border-2 hover:border-green-500 hover:bg-green-50 transition-all"
                style={{ borderColor: '#689F38', color: '#689F38' }}
              >
                <Leaf className="w-4 h-4 mr-2" />
                {t('login.signupLink')}
              </Button>
            </Card>

            {/* Footer */}
            <div className="text-center mt-6 text-xs text-gray-500">
              <p>{t('login.footer')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}