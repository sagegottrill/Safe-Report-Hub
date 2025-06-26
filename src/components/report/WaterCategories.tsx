import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { 
  Droplets, 
  Wrench, 
  AlertTriangle, 
  MapPin, 
  Clock,
  Users,
  Building,
  Zap
} from 'lucide-react';

interface WaterCategoriesProps {
  onCategorySelect: (category: string) => void;
  onBack: () => void;
}

const WaterCategories: React.FC<WaterCategoriesProps> = ({ onCategorySelect, onBack }) => {
  const { t } = useTranslation();

  const waterCategories = [
    {
      id: 'broken_borehole',
      title: t('waterBrokenBorehole'),
      description: 'Non-functioning or damaged boreholes',
      icon: <Wrench className="h-6 w-6 text-red-500" />,
      urgency: 'high',
      requiresMaintenance: true,
      affectsPopulation: 'large'
    },
    {
      id: 'no_water_supply',
      title: t('waterNoSupply'),
      description: 'Complete lack of water supply',
      icon: <Droplets className="h-6 w-6 text-orange-500" />,
      urgency: 'critical',
      requiresMaintenance: true,
      affectsPopulation: 'entire'
    },
    {
      id: 'contaminated_water',
      title: t('waterContaminated'),
      description: 'Water quality and contamination issues',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      urgency: 'high',
      requiresMaintenance: false,
      affectsPopulation: 'large'
    },
    {
      id: 'water_scarcity',
      title: t('waterScarcity'),
      description: 'Long distances to water sources',
      icon: <MapPin className="h-6 w-6 text-blue-500" />,
      urgency: 'medium',
      requiresMaintenance: false,
      affectsPopulation: 'medium'
    },
    {
      id: 'infrastructure_damage',
      title: t('waterInfrastructureDamage'),
      description: 'Damage to water infrastructure',
      icon: <Building className="h-6 w-6 text-purple-500" />,
      urgency: 'high',
      requiresMaintenance: true,
      affectsPopulation: 'large'
    },
    {
      id: 'system_failure',
      title: t('waterSystemFailure'),
      description: 'Complete system breakdown',
      icon: <Zap className="h-6 w-6 text-red-500" />,
      urgency: 'critical',
      requiresMaintenance: true,
      affectsPopulation: 'entire'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPopulationBadge = (population: string) => {
    const config = {
      entire: { label: 'Entire Community', color: 'bg-red-100 text-red-800' },
      large: { label: 'Large Population', color: 'bg-orange-100 text-orange-800' },
      medium: { label: 'Medium Population', color: 'bg-yellow-100 text-yellow-800' },
      small: { label: 'Small Population', color: 'bg-green-100 text-green-800' }
    };
    return config[population] || config.medium;
  };

  return (
    <div className="space-y-6">
      {/* Header with community focus */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Droplets className="h-5 w-5 text-cyan-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-cyan-800">Water & Infrastructure Reporting</h3>
            <p className="text-sm text-cyan-700 mt-1">
              Report water infrastructure issues, access challenges, and quality problems. 
              Help improve community water access and maintenance.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                Location Tracking
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Response Timeline
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Community Impact
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <span>←</span>
        <span>Back to Sector Selection</span>
      </button>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {waterCategories.map((category) => {
          const populationConfig = getPopulationBadge(category.affectsPopulation);
          return (
            <Card 
              key={category.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-l-cyan-500"
              onClick={() => onCategorySelect(category.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {category.icon}
                    <div>
                      <CardTitle className="text-base">{category.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getUrgencyColor(category.urgency)}>
                    {category.urgency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge className={populationConfig.color}>
                      {populationConfig.label}
                    </Badge>
                    {category.requiresMaintenance && (
                      <Badge variant="secondary" className="text-xs">
                        Maintenance Required
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.requiresMaintenance ? 'Requires maintenance team' : 'Information gathering'}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WaterCategories; 