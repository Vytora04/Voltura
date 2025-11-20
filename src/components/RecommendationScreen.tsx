import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ThermometerSun, RefrigeratorIcon, Lightbulb, CheckCircle2, TrendingDown, Leaf, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Recommendation {
  id: string;
  icon: React.ComponentType<any>;
  categoryKey: string;
  titleKey: string;
  descKey: string;
  savings: string;
  savingsAmount: number;
  difficultyKey: string;
  color: string;
}

export function RecommendationScreen() {
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  const recommendations: Recommendation[] = [
    {
      id: '1',
      icon: ThermometerSun,
      categoryKey: 'behavior_change',
      titleKey: 'increase_ac_temp',
      descKey: 'increase_ac_temp_desc',
      savings: 'Rp 35.000',
      savingsAmount: 35000,
      difficultyKey: 'easy',
      color: '#0097A7',
    },
    {
      id: '2',
      icon: RefrigeratorIcon,
      categoryKey: 'upgrade_device',
      titleKey: 'replace_refrigerator',
      descKey: 'replace_refrigerator_desc',
      savings: 'Rp 60.000',
      savingsAmount: 60000,
      difficultyKey: 'medium',
      color: '#689F38',
    },
    {
      id: '3',
      icon: Lightbulb,
      categoryKey: 'optimize_habits',
      titleKey: 'use_motion_sensor',
      descKey: 'use_motion_sensor_desc',
      savings: 'Rp 25.000',
      savingsAmount: 25000,
      difficultyKey: 'easy',
      color: '#FFC107',
    },
  ];

  const toggleAction = (id: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedActions(newCompleted);
  };

  const markAllComplete = () => {
    setCompletedActions(new Set(recommendations.map(r => r.id)));
  };

  const totalSavings = recommendations.reduce((sum, rec) => {
    return completedActions.has(rec.id) ? sum + rec.savingsAmount : sum;
  }, 0);

  const potentialSavings = recommendations.reduce((sum, rec) => sum + rec.savingsAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/30 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-40 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #689F38 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #FFC107 0%, transparent 70%)' }}></div>
        <div className="absolute top-10 left-10 opacity-5">
          <Leaf className="w-32 h-32 text-green-600 rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-5">
          <Sparkles className="w-24 h-24 text-yellow-600" />
        </div>
      </div>

      <div className="relative z-10 p-3 sm:p-6 lg:p-8 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3 sm:mb-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border-2 border-yellow-100">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)' }}>
                <TrendingDown className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-gray-900 mb-1">{t('recommendations.header.title').replace('{0}', potentialSavings.toLocaleString('id-ID'))}</h1>
                <p className="text-gray-600 text-sm">{t('recommendations.header.subtitle')}</p>
              </div>
            </div>

            {/* Savings Summary */}
            {completedActions.size > 0 && (
              <Card className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2" style={{ borderColor: '#689F38' }}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: '#689F38' }} />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-700">
                      {t('recommendations.completed').replace('{0}', String(completedActions.size)).replace('{1}', String(recommendations.length))}
                    </p>
                    <p className="text-sm sm:text-base text-gray-900">
                      {t('recommendations.potential')} <span style={{ color: '#689F38' }}>Rp {totalSavings.toLocaleString('id-ID')}{t('recommendations.month')}</span>
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Recommendation Cards */}
          <div className="space-y-3 sm:space-y-4 mb-20 sm:mb-24 lg:mb-28">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              const isCompleted = completedActions.has(rec.id);

              return (
                <Card 
                  key={rec.id} 
                  className={`p-3 sm:p-6 transition-all bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg ${isCompleted ? 'opacity-60 border-gray-200' : 'border-gray-100'}`}
                >
                  <div className="flex items-start gap-2 sm:gap-4">
                    {/* Checkbox */}
                    <div className="pt-0.5 sm:pt-1">
                      <Checkbox
                        id={`action-${rec.id}`}
                        checked={isCompleted}
                        onCheckedChange={() => toggleAction(rec.id)}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                    </div>

                    {/* Icon */}
                    <div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: `${rec.color}20` }}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: rec.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 mb-2">
                        <div className="flex-1">
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full inline-block mb-1.5"
                            style={{ backgroundColor: `${rec.color}20`, color: rec.color }}
                          >
                            {t(rec.categoryKey)}
                          </span>
                          <h3 className={`text-gray-900 mb-0.5 text-sm sm:text-base ${isCompleted ? 'line-through' : ''}`}>
                            {t(rec.titleKey)}
                          </h3>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-500 mb-0.5">{t('recommendations.savings.label')}</p>
                          <p className="text-lg sm:text-2xl" style={{ color: rec.color }}>
                            {rec.savings}
                            <span className="text-xs text-gray-500 ml-1">{t('recommendations.month')}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mb-2.5">
                        {t(rec.descKey)}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{t('recommendations.difficulty')}</span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-md"
                          style={{ 
                            backgroundColor: rec.difficultyKey === 'easy' ? '#E8F5E9' : rec.difficultyKey === 'medium' ? '#FFF3E0' : '#FFEBEE',
                            color: rec.difficultyKey === 'easy' ? '#689F38' : rec.difficultyKey === 'medium' ? '#F57C00' : '#D32F2F'
                          }}
                        >
                          {t(rec.difficultyKey)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Final CTA */}
          <div className="sticky bottom-3 sm:bottom-8">
            <Card className="p-3 sm:p-6 shadow-xl bg-white/90 backdrop-blur-sm border-2 border-green-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #689F38 0%, #558B2F 100%)' }}>
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">{t('recommendations.cta.title')}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {t('recommendations.cta.subtitle')}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={markAllComplete}
                  className="text-white w-full sm:w-auto text-sm shadow-md hover:shadow-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #0097A7 0%, #00838F 100%)' }}
                  disabled={completedActions.size === recommendations.length}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{t('recommendations.cta.button')}</span>
                  <span className="sm:hidden">{t('recommendations.cta.button.short')}</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Footer Copyright */}
          <div className="text-center pt-8 mt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500">{t('sidebar.copyright')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}