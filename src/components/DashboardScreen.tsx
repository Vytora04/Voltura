import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, TrendingUp, Leaf, Zap, User, TrendingDown, Battery, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ProfileData } from './ProfileDialog';
import { useLanguage } from '../contexts/LanguageContext';

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

interface DashboardScreenProps {
  onNavigateToRecommendations: () => void;
  onEditProfile?: () => void;
  profileData?: ProfileData;
  setupData?: SetupData | null;
}

export function DashboardScreen({ onNavigateToRecommendations, onEditProfile, profileData, setupData }: DashboardScreenProps) {
  const { t } = useLanguage();

  // Calculate total kWh from devices
  const calculateTotalKwh = () => {
    if (!setupData?.devices || setupData.devices.length === 0) return 750; // Default value
    
    const totalKwh = setupData.devices.reduce((total, device) => {
      const watt = parseFloat(device.watt) || 0;
      const hours = parseFloat(device.hours) || 0;
      // kWh = (Watt × Hours per day × 30 days) / 1000
      const deviceKwh = (watt * hours * 30) / 1000;
      return total + deviceKwh;
    }, 0);
    
    return Math.round(totalKwh);
  };

  // Calculate carbon footprint: kWh × 0.82 kg CO2/kWh
  const calculateCarbonFootprint = () => {
    const totalKwh = calculateTotalKwh();
    return Math.round(totalKwh * 0.82);
  };

  // Calculate bill estimate from kWh
  const calculateBillEstimate = () => {
    const totalKwh = calculateTotalKwh();
    // Parse kwhPrice properly - remove only commas and currency symbols, keep decimals
    const kwhPrice = parseFloat(setupData?.kwhPrice?.replace(/[^0-9.]/g, '') || '1444');
    return Math.round(totalKwh * kwhPrice);
  };

  // Count total devices
  const totalDevices = setupData?.devices?.length || 0;

  const totalKwh = calculateTotalKwh();
  const carbonFootprint = calculateCarbonFootprint();
  const billEstimate = calculateBillEstimate();

  // Calculate device data from actual user input for pie chart
  const deviceData = (() => {
    if (!setupData?.devices || setupData.devices.length === 0) {
      // Fallback mock data if no devices
      return [
        { name: t('dashboard.device.ac'), value: 45, color: '#0097A7' },
        { name: t('dashboard.device.fridge'), value: 25, color: '#689F38' },
        { name: t('dashboard.device.lights'), value: 15, color: '#FFC107' },
        { name: t('dashboard.device.others'), value: 15, color: '#E0E0E0' },
      ];
    }

    // Color palette for devices
    const colors = ['#0097A7', '#689F38', '#FFC107', '#FF5722', '#9C27B0', '#3F51B5', '#00BCD4', '#4CAF50', '#FFEB3B', '#FF9800'];
    
    // Calculate kWh and percentage for each device
    const devicesWithKwh = setupData.devices.map((device, index) => {
      const watt = parseFloat(device.watt) || 0;
      const hours = parseFloat(device.hours) || 0;
      const deviceKwh = (watt * hours * 30) / 1000;
      
      return {
        name: device.name,
        kwh: deviceKwh,
        color: colors[index % colors.length]
      };
    });

    const total = devicesWithKwh.reduce((sum, d) => sum + d.kwh, 0);
    
    // Convert to percentage and format for pie chart
    return devicesWithKwh.map(device => ({
      name: device.name,
      value: total > 0 ? Math.round((device.kwh / total) * 100) : 0,
      kwh: Math.round(device.kwh),
      color: device.color
    }));
  })();

  // Mock data for daily consumption (last 7 days)
  const dailyConsumptionData = [
    { day: t('dashboard.day.mon'), kwh: 24.5 },
    { day: t('dashboard.day.tue'), kwh: 23.2 },
    { day: t('dashboard.day.wed'), kwh: 25.8 },
    { day: t('dashboard.day.thu'), kwh: 22.5 },
    { day: t('dashboard.day.fri'), kwh: 26.3 },
    { day: t('dashboard.day.sat'), kwh: 28.1 },
    { day: t('dashboard.day.sun'), kwh: 26.5 },
  ];

  // Mock data for peak hours consumption (24 hours)
  const peakHoursData = [
    { hour: '00', kwh: 2.1 },
    { hour: '03', kwh: 1.8 },
    { hour: '06', kwh: 3.5 },
    { hour: '09', kwh: 5.2 },
    { hour: '12', kwh: 6.8 },
    { hour: '15', kwh: 8.5 },
    { hour: '18', kwh: 7.2 },
    { hour: '21', kwh: 4.3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/30 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #689F38 0%, transparent 70%)' }}></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #0097A7 0%, transparent 70%)' }}></div>
      </div>

      <div className="relative z-10 p-3 sm:p-6 lg:p-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border-2 border-green-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #689F38 0%, #558B2F 100%)' }}>
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-gray-900">
                    {profileData?.name ? t('dashboard.welcome').replace('{name}', profileData.name) : t('dashboard.title')}
                  </h1>
                  <p className="text-gray-600 text-sm">{t('dashboard.subtitle')}</p>
                </div>
              </div>
              {onEditProfile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEditProfile}
                  className="w-10 h-10 rounded-full border-2 hover:border-green-500 hover:bg-green-50 transition-all flex-shrink-0"
                  style={{ borderColor: '#689F38' }}
                >
                  <User className="w-5 h-5" style={{ color: '#689F38' }} />
                </Button>
              )}
            </div>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Left Column - Stacked Cards */}
            <div className="col-span-1 flex flex-col gap-3 sm:gap-4 lg:gap-6">
              {/* Total kWh Usage (Upper Card) */}
              <Card className="p-4 sm:p-5 bg-white/80 backdrop-blur-sm border-2 border-cyan-100 hover:shadow-lg transition-all flex-1">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E0F7FA' }}>
                    <Zap className="w-5 h-5" style={{ color: '#0097A7' }} />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('dashboard.totalKwhUsage')}</p>
                <p className="text-2xl sm:text-3xl mb-1" style={{ color: '#0097A7' }}>{totalKwh} kWh</p>
                <p className="text-xs text-gray-500">{t('dashboard.thisMonth')}</p>
              </Card>

              {/* End of Month Bill Estimate (Lower Card) */}
              <Card className="p-4 sm:p-5 bg-white/80 backdrop-blur-sm border-2 border-yellow-100 hover:shadow-lg transition-all flex-1">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: '#FFF9E6' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: '#FFC107' }} />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('dashboard.billEstimate')}</p>
                <p className="text-2xl sm:text-3xl mb-1" style={{ color: '#FFC107' }}>Rp {billEstimate.toLocaleString()}</p>
                <p className="text-xs text-gray-500">+12% {t('dashboard.fromLastMonth')}</p>
              </Card>
            </div>

            {/* Middle - Consumption Donut Chart */}
            <Card className="p-4 sm:p-6 col-span-1 sm:col-span-2 bg-white/80 backdrop-blur-sm border-2 border-gray-100 hover:shadow-lg transition-all">
              <div className="mb-3 sm:mb-4">
                <h3 className="text-gray-900 mb-1 text-sm sm:text-base">{t('dashboard.breakdown')}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{t('dashboard.breakdownDesc')}</p>
              </div>
              <div className="h-52 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `${value}%`}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E0E0E0', fontSize: '12px' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconSize={10}
                      wrapperStyle={{ fontSize: '11px' }}
                      formatter={(value, entry: any) => `${value} (${entry.payload.value}%)`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Right Column - Stacked Cards */}
            <div className="col-span-1 flex flex-col gap-3 sm:gap-4 lg:gap-6">
              {/* Carbon Footprint (Upper Card) */}
              <Card className="p-4 sm:p-5 bg-white/80 backdrop-blur-sm border-2 border-green-100 hover:shadow-lg transition-all flex-1">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                    <Leaf className="w-5 h-5" style={{ color: '#689F38' }} />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('dashboard.carbonFootprint')}</p>
                <p className="text-2xl sm:text-3xl mb-1" style={{ color: '#689F38' }}>{carbonFootprint} kg</p>
                <p className="text-xs text-gray-500">{t('dashboard.co2Generated')}</p>
              </Card>

              {/* Total Devices (Lower Card) */}
              <Card className="p-4 sm:p-5 bg-white/80 backdrop-blur-sm border-2 border-green-100 hover:shadow-lg transition-all flex-1">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                    <Battery className="w-5 h-5" style={{ color: '#689F38' }} />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('dashboard.totalDevices')}</p>
                <p className="text-2xl sm:text-3xl mb-1" style={{ color: '#689F38' }}>{totalDevices}</p>
                <p className="text-xs text-gray-500">{t('dashboard.connectedDevices')}</p>
              </Card>
            </div>

            {/* Widget 4: Anomaly Alert */}
            <Card className="p-4 sm:p-6 col-span-1 sm:col-span-2 lg:col-span-4 border-2" style={{ borderColor: '#FFC107', backgroundColor: '#FFFBF0' }}>
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFC107' }}>
                  <AlertTriangle className="w-6 h-6 text-gray-900" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-gray-900 mb-1 text-sm sm:text-base">{t('dashboard.anomalyDetected')}</h3>
                  <p className="text-gray-700 mb-3 sm:mb-4 text-xs sm:text-sm">
                    {t('dashboard.anomalyDesc').replace('{percent}', '15%').replace('{days}', '3')}
                  </p>
                  <Button
                    onClick={onNavigateToRecommendations}
                    style={{ backgroundColor: '#0097A7' }}
                    className="text-white w-full sm:w-auto text-sm"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {t('dashboard.viewRecommendations')}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Additional Stats Cards */}
            <Card className="p-4 sm:p-6 col-span-1 sm:col-span-2 bg-white/80 backdrop-blur-sm border-2 border-cyan-100 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #0097A7 0%, #00838F 100%)' }}>
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 text-sm sm:text-base">{t('dashboard.dailyConsumption')}</h3>
                  <p className="text-xs text-gray-600">{t('dashboard.last7Days')}</p>
                </div>
              </div>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyConsumptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 11, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value} kWh`, t('dashboard.consumption')]}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E0E0E0', fontSize: '12px' }}
                    />
                    <Bar dataKey="kwh" fill="#0097A7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-gray-200">
                <span className="text-gray-500">{t('dashboard.target')}: 22 kWh/hari</span>
                <span style={{ color: '#FFC107' }}>{t('dashboard.average')}: 25.3 kWh</span>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 col-span-1 sm:col-span-2 bg-white/80 backdrop-blur-sm border-2 border-green-100 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #689F38 0%, #558B2F 100%)' }}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 text-sm sm:text-base">{t('dashboard.peakHours')}</h3>
                  <p className="text-xs text-gray-600">{t('dashboard.consumptionPer3Hours')}</p>
                </div>
              </div>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 11, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      label={{ value: t('dashboard.hour'), position: 'insideBottom', offset: -5, fontSize: 10, fill: '#999' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#666' }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value} kWh`, t('dashboard.consumption')]}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E0E0E0', fontSize: '12px' }}
                    />
                    <Bar dataKey="kwh" fill="#689F38" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-gray-200">
                <span className="text-gray-500">{t('dashboard.peak')}: 15:00</span>
                <span style={{ color: '#689F38' }}>8.5 kWh {t('dashboard.highest')}</span>
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