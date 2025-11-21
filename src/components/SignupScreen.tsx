import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, AlertCircle, Leaf, Zap, CheckCircle2, TrendingUp, Clock, Loader2 } from 'lucide-react';
import volturaIcon from '/voltura-logo.png';
import { useLanguage } from '../contexts/LanguageContext';

export interface SignupData {
  name: string;
  email: string;
  company: string;
  phone: string;
  password: string;
}

interface SignupScreenProps {
  onSignup: (data: SignupData) => void;
  onNavigateToLogin: () => void;
  authError?: string;
  isLoading?: boolean;
}

export function SignupScreen({ onSignup, onNavigateToLogin, authError, isLoading }: SignupScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.company || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError(t('signup.error.fill'));
      return;
    }

    if (!formData.email.includes('@')) {
      setError(t('signup.error.email'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('signup.error.password'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('signup.error.match'));
      return;
    }

    // Submit
    const { confirmPassword, ...signupData } = formData;
    onSignup(signupData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #689F38 0%, transparent 70%)' }}></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #0097A7 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-10 right-1/3 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #FFC107 0%, transparent 70%)' }}></div>
        
        {/* Leaf Pattern */}
        <div className="absolute top-16 left-16 opacity-10">
          <Leaf className="w-28 h-28 text-green-600 -rotate-12" />
        </div>
        <div className="absolute bottom-24 right-16 opacity-10">
          <Leaf className="w-24 h-24 text-green-600 rotate-45" />
        </div>
        <div className="absolute top-2/3 left-10 opacity-10">
          <Leaf className="w-20 h-20 text-green-600" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-6 lg:p-8 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-cyan-50 to-green-50 p-2 rounded-xl shadow-sm">
                  <img src={volturaIcon} alt="Voltura" className="w-16 h-16" />
                </div>
                <div>
                  <span className="text-5xl" style={{ color: '#689F38' }}>Voltura</span>
                  <p className="text-sm" style={{ color: '#0097A7' }}>See the Savings</p>
                </div>
              </div>
              
              <h2 className="text-4xl text-gray-900 mb-3">
                {t('signup.hero.title').split('\\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h2>
              <p className="text-lg text-gray-600">{t('signup.hero.subtitle')}</p>
            </div>

            {/* Benefit Cards */}
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm border-2 border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#689F38' }}>
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{t('signup.benefit1.title')}</h3>
                    <p className="text-sm text-gray-600">{t('signup.benefit1.desc')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-cyan-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0097A7' }}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{t('signup.benefit2.title')}</h3>
                    <p className="text-sm text-gray-600">{t('signup.benefit2.desc')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-yellow-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFC107' }}>
                    <Clock className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{t('signup.benefit3.title')}</h3>
                    <p className="text-sm text-gray-600">{t('signup.benefit3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl mb-1" style={{ color: '#689F38' }}>2K+</div>
                <div className="text-xs text-gray-600">{t('signup.stats.users')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1" style={{ color: '#0097A7' }}>30%</div>
                <div className="text-xs text-gray-600">{t('signup.stats.savings')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1" style={{ color: '#689F38' }}>500T</div>
                <div className="text-xs text-gray-600">{t('signup.stats.co2')}</div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Mobile Header */}
            <div className="text-center mb-6 lg:hidden">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-cyan-50 to-green-50 p-2 rounded-lg shadow-sm">
                  <img src={volturaIcon} alt="Voltura" className="w-14 h-14" />
                </div>
                <span className="text-4xl" style={{ color: '#689F38' }}>Voltura</span>
              </div>
              <h1 className="text-gray-900 mb-2">{t('signup.title')}</h1>
              <p className="text-gray-600 text-sm">{t('signup.subtitle')}</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-gray-900 mb-2">{t('signup.title')}</h1>
              <p className="text-gray-600">{t('signup.subtitle')}</p>
            </div>

            {/* Signup Form */}
            <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-green-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {authError && (
                  <Alert variant="destructive" className="bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="name" className="text-sm font-medium" style={{ color: '#0097A7' }}>{t('signup.name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder={t('signup.placeholder.name')}
                    className="mt-1.5 border-2 bg-white rounded-xl focus-visible:ring-1"
                    style={{ borderColor: 'rgba(0, 151, 167, 0.3)', '--tw-ring-color': 'rgba(0, 151, 167, 0.5)' } as React.CSSProperties}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#0097A7' }}>{t('signup.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder={t('signup.placeholder.email')}
                    className="mt-1.5 border-2 bg-white rounded-xl focus-visible:ring-1"
                    style={{ borderColor: 'rgba(0, 151, 167, 0.3)', '--tw-ring-color': 'rgba(0, 151, 167, 0.5)' } as React.CSSProperties}
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-medium" style={{ color: '#0097A7' }}>{t('signup.company')}</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder={t('signup.placeholder.company')}
                    className="mt-1.5 border-2 bg-white rounded-xl focus-visible:ring-1"
                    style={{ borderColor: 'rgba(0, 151, 167, 0.3)', '--tw-ring-color': 'rgba(0, 151, 167, 0.5)' } as React.CSSProperties}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium" style={{ color: '#0097A7' }}>{t('signup.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder={t('signup.placeholder.phone')}
                    className="mt-1.5 border-2 bg-white rounded-xl focus-visible:ring-1"
                    style={{ borderColor: 'rgba(0, 151, 167, 0.3)', '--tw-ring-color': 'rgba(0, 151, 167, 0.5)' } as React.CSSProperties}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#0097A7' }}>{t('signup.password')}</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder={t('signup.placeholder.password')}
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

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium" style={{ color: '#0097A7' }}>{t('signup.confirmPassword')}</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder={t('signup.placeholder.confirmPassword')}
                      className="pr-10 border-2 bg-white rounded-xl focus-visible:ring-1"
                      style={{ borderColor: 'rgba(0, 151, 167, 0.3)', '--tw-ring-color': 'rgba(0, 151, 167, 0.5)' } as React.CSSProperties}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #689F38 0%, #558B2F 100%)' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('signup.loading')}
                    </>
                  ) : (
                    <>
                      <Leaf className="w-4 h-4 mr-2" />
                      {t('signup.button')}
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">{t('signup.hasAccount')}</span>
                </div>
              </div>

              {/* Login Link */}
              <Button
                type="button"
                variant="outline"
                onClick={onNavigateToLogin}
                className="w-full border-2 hover:border-cyan-500 hover:bg-cyan-50 transition-all"
                style={{ borderColor: '#0097A7', color: '#0097A7' }}
              >
                <Zap className="w-4 h-4 mr-2" />
                {t('signup.loginLink')}
              </Button>
            </Card>

            {/* Footer */}
            <div className="text-center mt-6 text-xs text-gray-500">
              <p>© 2025 Voltura - Platform Energi Berkelanjutan Indonesia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}