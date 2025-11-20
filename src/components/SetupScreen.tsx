import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, Zap, Leaf, Clock, Plug, Check, ChevronRight, Sparkles, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ProfileData } from './ProfileDialog';

// PLN Tariff Structure (2025 - Periode Triwulan IV)
const PLN_TARIFFS = [
  // R-1/TR (Residential)
  { tier: 'R-1/TR', capacity: '900 VA', price: 1352.00, labelId: 'R-1/TR - 900 VA (Rp 1.352/kWh)', labelEn: 'R-1/TR - 900 VA (Rp 1,352/kWh)' },
  { tier: 'R-1/TR', capacity: '1300 VA', price: 1444.70, labelId: 'R-1/TR - 1.300 VA (Rp 1.445/kWh)', labelEn: 'R-1/TR - 1,300 VA (Rp 1,445/kWh)' },
  { tier: 'R-1/TR', capacity: '2200 VA', price: 1444.70, labelId: 'R-1/TR - 2.200 VA (Rp 1.445/kWh)', labelEn: 'R-1/TR - 2,200 VA (Rp 1,445/kWh)' },
  { tier: 'R-1/TR', capacity: '3500-5500 VA', price: 1699.53, labelId: 'R-1/TR - 3.500-5.500 VA (Rp 1.700/kWh)', labelEn: 'R-1/TR - 3,500-5,500 VA (Rp 1,700/kWh)' },
  
  // R-2/TR (Residential - Higher Tier)
  { tier: 'R-2/TR', capacity: '6600 VA+', price: 1699.53, labelId: 'R-2/TR - 6.600 VA ke atas (Rp 1.700/kWh)', labelEn: 'R-2/TR - 6,600 VA and above (Rp 1,700/kWh)' },
  
  // R-3/TR (Residential - Premium)
  { tier: 'R-3/TR', capacity: '6600 VA+', price: 1699.53, labelId: 'R-3/TR - 6.600 VA ke atas (Rp 1.700/kWh)', labelEn: 'R-3/TR - 6,600 VA and above (Rp 1,700/kWh)' },
  
  // B-2/TR (Business - Small)
  { tier: 'B-2/TR', capacity: '6600 VA+', price: 1444.70, labelId: 'B-2/TR - Bisnis Kecil 6.600 VA+ (Rp 1.445/kWh)', labelEn: 'B-2/TR - Small Business 6,600 VA+ (Rp 1,445/kWh)' },
  
  // P-1/TR (Government)
  { tier: 'P-1/TR', capacity: '6600 VA+', price: 1699.53, labelId: 'P-1/TR - Pemerintah 6.600 VA+ (Rp 1.700/kWh)', labelEn: 'P-1/TR - Government 6,600 VA+ (Rp 1,700/kWh)' },
];

interface Device {
  id: string;
  name: string;
  watt: string;
  hours: string;
}

interface SetupData {
  powerCategory: string;
  kwhPrice: string;
  monthlyBill: string;
  devices: Device[];
}

interface SetupScreenProps {
  onComplete: (data: SetupData) => void;
  existingData?: SetupData | null;
}

export function SetupScreen({ onComplete, existingData }: SetupScreenProps) {
  // Default to 2200 VA tariff or existing data
  const defaultTariff = PLN_TARIFFS.find(t => t.capacity === '2200 VA');
  const [selectedTariffIndex, setSelectedTariffIndex] = useState<number>(() => {
    if (existingData?.powerCategory) {
      const index = PLN_TARIFFS.findIndex(t => t.capacity === existingData.powerCategory);
      return index !== -1 ? index : 2;
    }
    return 2; // Index of 2200 VA
  });
  const [powerCategory, setPowerCategory] = useState(existingData?.powerCategory || defaultTariff?.capacity || '2200 VA');
  const [kwhPrice, setKwhPrice] = useState(existingData?.kwhPrice || defaultTariff?.price.toString() || '1444.70');
  const [monthlyBill, setMonthlyBill] = useState(existingData?.monthlyBill || '650000');
  
  const [devices, setDevices] = useState<Device[]>(existingData?.devices || [
    { id: '1', name: 'AC', watt: '750', hours: '8' },
    { id: '2', name: 'TV', watt: '150', hours: '6' },
  ]);

  // Handle tariff selection - updates both capacity and price
  const handleTariffChange = (index: string) => {
    const idx = parseInt(index);
    const selectedTariff = PLN_TARIFFS[idx];
    if (selectedTariff) {
      setSelectedTariffIndex(idx);
      setPowerCategory(selectedTariff.capacity);
      setKwhPrice(selectedTariff.price.toString());
    }
  };

  const addDevice = () => {
    setDevices([
      ...devices,
      { id: Date.now().toString(), name: '', watt: '', hours: '' }
    ]);
  };

  const removeDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  const updateDevice = (id: string, field: keyof Device, value: string) => {
    setDevices(devices.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const handleSubmit = () => {
    const data: SetupData = {
      powerCategory,
      kwhPrice,
      monthlyBill,
      devices
    };
    onComplete(data);
    
    // Scroll to top of page after submission
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #689F38 0%, transparent 70%)' }}></div>
        <div className="absolute top-1/2 -left-60 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #0097A7 0%, transparent 70%)' }}></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #FFC107 0%, transparent 70%)' }}></div>
        
        {/* Floating Leaves */}
        <div className="absolute top-20 left-[5%] opacity-10 animate-pulse">
          <Leaf className="w-20 h-20 text-green-600 -rotate-12" />
        </div>
        <div className="absolute top-40 right-[10%] opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-16 h-16 text-yellow-600" />
        </div>
        <div className="absolute bottom-40 left-[15%] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>
          <Zap className="w-24 h-24 text-cyan-600 rotate-12" />
        </div>
        <div className="absolute bottom-32 right-[8%] opacity-10 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Leaf className="w-28 h-28 text-green-600 rotate-45" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 py-16">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-gray-900 mb-3">{t('setup.header.title')}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('setup.header.subtitle')}
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 shadow-md backdrop-blur-sm" style={{ borderColor: '#0097A7', backgroundColor: 'rgba(0, 151, 167, 0.1)', color: '#0097A7' }}>
                  1
                </div>
                <span className="text-sm text-gray-700 hidden sm:inline">{t('setup.progress.profile')}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 shadow-md backdrop-blur-sm" style={{ borderColor: '#689F38', backgroundColor: 'rgba(104, 159, 56, 0.1)', color: '#689F38' }}>
                  2
                </div>
                <span className="text-sm text-gray-700 hidden sm:inline">{t('setup.progress.devices')}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 shadow-md backdrop-blur-sm" style={{ borderColor: '#FFC107', backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#FFC107' }}>
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-700 hidden sm:inline">{t('setup.progress.done')}</span>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="space-y-6">
            {/* Section 1: Profil Listrik */}
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-cyan-50/80 to-white/90 backdrop-blur-sm shadow-2xl border relative overflow-hidden" style={{ borderColor: '#B2EBF2' }}>
              {/* Section Number Badge */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg backdrop-blur-sm" style={{ borderColor: '#0097A7', backgroundColor: 'rgba(0, 151, 167, 0.1)' }}>
                <span className="text-xl" style={{ color: '#0097A7' }}>1</span>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-5 pointer-events-none">
                <Zap className="w-full h-full text-cyan-600 rotate-12" />
              </div>
              <div className="absolute -top-5 -left-5 w-32 h-32 opacity-5 pointer-events-none">
                <Leaf className="w-full h-full text-green-600 -rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #0097A7 0%, #00838F 100%)' }}>
                    <Plug className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-gray-900 text-xl sm:text-2xl">{t('setup.section1.title')}</h2>
                    <p className="text-sm text-gray-600">{t('setup.section1.subtitle')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <Label htmlFor="tariffSelector" className="text-sm mb-2 flex items-center gap-2" style={{ color: '#0097A7' }}>
                      <Plug className="w-4 h-4" style={{ color: '#0097A7' }} />
                      <span className="font-medium">{t('setup.section1.powerCategory')}</span>
                    </Label>
                    <Select
                      value={selectedTariffIndex.toString()}
                      onValueChange={handleTariffChange}
                    >
                      <SelectTrigger className="mt-1.5 border-2 bg-white rounded-xl focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30 h-12 text-base" style={{ borderColor: '#0097A7' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLN_TARIFFS.map((tariff, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {language === 'id' ? tariff.labelId : tariff.labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1.5">{t('setup.section1.powerCategory.hint')}</p>
                  </div>

                  <div className="sm:col-span-1">
                    <Label htmlFor="monthlyBill" className="text-sm mb-2 flex items-center gap-2" style={{ color: '#0097A7' }}>
                      <span className="font-medium">📊 {t('setup.section1.monthlyBill')}</span>
                    </Label>
                    <Input
                      id="monthlyBill"
                      type="text"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(e.target.value)}
                      placeholder="650000"
                      className="mt-1.5 border-2 bg-white rounded-xl focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30 h-12 text-base"
                      style={{ borderColor: '#0097A7' }}
                    />
                    <p className="text-xs text-gray-500 mt-1.5">{t('setup.section1.monthlyBill.hint')}</p>
                  </div>
                </div>
                
                {/* Display selected values */}
                <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border-2" style={{ borderColor: '#B2EBF2' }}>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">{t('setup.section1.selectedCapacity')}:</p>
                      <p className="font-semibold" style={{ color: '#0097A7' }}>{powerCategory}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t('setup.section1.selectedPrice')}:</p>
                      <p className="font-semibold" style={{ color: '#0097A7' }}>Rp {parseFloat(kwhPrice).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 2: Perangkat Elektronik */}
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-green-50/80 to-white/90 backdrop-blur-sm shadow-2xl border relative overflow-hidden" style={{ borderColor: '#C5E1A5' }}>
              {/* Section Number Badge */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg backdrop-blur-sm" style={{ borderColor: '#689F38', backgroundColor: 'rgba(104, 159, 56, 0.1)' }}>
                <span className="text-xl" style={{ color: '#689F38' }}>2</span>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 opacity-5 pointer-events-none">
                <Leaf className="w-full h-full text-green-600 -rotate-45" />
              </div>
              <div className="absolute top-10 -right-10 w-36 h-36 opacity-5 pointer-events-none">
                <Zap className="w-full h-full text-green-600" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #689F38 0%, #558B2F 100%)' }}>
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-gray-900 text-xl sm:text-2xl">{t('setup.section2.title')}</h2>
                    <p className="text-sm text-gray-600">{t('setup.section2.subtitle')}</p>
                  </div>
                </div>

                {/* Device Cards */}
                <div className="space-y-4">
                  {devices.map((device, index) => {
                    // Calculate monthly consumption
                    const watt = parseFloat(device.watt) || 0;
                    const hours = parseFloat(device.hours) || 0;
                    const monthlyKwh = (watt * hours * 30) / 1000; // Convert to kWh per month

                    return (
                      <div key={device.id} className="bg-gradient-to-br from-teal-50/60 to-cyan-50/40 rounded-2xl shadow-md hover:shadow-lg transition-all border p-5 sm:p-6 relative backdrop-blur-sm" style={{ borderColor: '#B2EBF2' }}>
                        {/* Delete Button - Top Right */}
                        {devices.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDevice(device.id)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 hover:bg-red-50 h-9 w-9 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Device Title */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E0F7FA' }}>
                            <Zap className="w-4 h-4" style={{ color: '#0097A7' }} />
                          </div>
                          <h3 className="text-lg" style={{ color: '#0097A7' }}>{t('setup.device.title')} {index + 1}</h3>
                        </div>

                        {/* Input Fields Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label className="text-sm mb-2 block font-medium" style={{ color: '#00838F' }}>{t('setup.device.name')}</Label>
                            <Input
                              type="text"
                              value={device.name}
                              onChange={(e) => updateDevice(device.id, 'name', e.target.value)}
                              placeholder={t('setup.device.placeholder.name')}
                              className="border-2 bg-white rounded-xl focus-visible:border-cyan-600 focus-visible:ring-cyan-500/30 h-11 text-base"
                              style={{ borderColor: '#0097A7' }}
                            />
                          </div>
                          <div>
                            <Label className="text-sm mb-2 block font-medium" style={{ color: '#00838F' }}>{t('setup.device.watt')}</Label>
                            <Input
                              type="text"
                              value={device.watt}
                              onChange={(e) => updateDevice(device.id, 'watt', e.target.value)}
                              placeholder={t('setup.device.placeholder.watt')}
                              className="border-2 bg-white rounded-xl focus-visible:border-cyan-600 focus-visible:ring-cyan-500/30 h-11 text-base"
                              style={{ borderColor: '#0097A7' }}
                            />
                          </div>
                          <div>
                            <Label className="text-sm mb-2 block font-medium" style={{ color: '#00838F' }}>{t('setup.device.hours')}</Label>
                            <Input
                              type="text"
                              value={device.hours}
                              onChange={(e) => updateDevice(device.id, 'hours', e.target.value)}
                              placeholder={t('setup.device.placeholder.hours')}
                              className="border-2 bg-white rounded-xl focus-visible:border-cyan-600 focus-visible:ring-cyan-500/30 h-11 text-base"
                              style={{ borderColor: '#0097A7' }}
                            />
                          </div>
                        </div>

                        {/* Monthly Consumption Display */}
                        <div className="pt-3 border-t-2 rounded-lg px-3 py-2" style={{ borderColor: '#B2EBF2', backgroundColor: '#E0F7FA' }}>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" style={{ color: '#0097A7' }} />
                            <p className="text-sm font-medium" style={{ color: '#00838F' }}>
                              {t('setup.device.consumption')}: <span className="font-semibold" style={{ color: '#0097A7' }}>{monthlyKwh.toFixed(1)} kWh/bulan</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Device Button */}
                  <Button
                    variant="outline"
                    onClick={addDevice}
                    className="w-full border border-gray-300/40 hover:border-cyan-400 hover:shadow-md bg-transparent py-6 text-base transition-all rounded-xl"
                    style={{ color: '#0097A7' }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {t('setup.addDevice')}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                className="w-full py-7 text-gray-900 hover:shadow-2xl hover:scale-[1.02] transition-all text-lg sm:text-xl backdrop-blur-sm group"
                style={{ background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 160, 0, 0.25) 100%)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 193, 7, 0.85) 0%, rgba(255, 160, 0, 0.85) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 160, 0, 0.25) 100%)';
                }}
              >
                <Sparkles className="w-6 h-6 mr-3" />
                {t('setup.submit')}
              </Button>
              <p className="text-center text-xs text-gray-500 mt-4">
                🔐 {t('setup.secure')}
              </p>
              
              {/* Footer Copyright */}
              <div className="text-center pt-6 mt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">{t('sidebar.copyright')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}