import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, AlertTriangle, Users, Home, Utensils, Activity } from 'lucide-react';

interface HumanitarianCategoriesProps {
  onCategorySelect: (category: string) => void;
}

const HumanitarianCategories: React.FC<HumanitarianCategoriesProps> = ({ onCategorySelect }) => {
  const categories = [
    {
      id: 'food_insecurity',
      title: 'Food Insecurity',
      description: 'Lack of access to sufficient, safe, and nutritious food',
      icon: <Utensils className="h-6 w-6" />,
      urgency: 'high',
      examples: ['Hunger crisis', 'Food shortage', 'Malnutrition', 'Famine conditions']
    },
    {
      id: 'shelter_issues',
      title: 'Shelter Issues',
      description: 'Problems with housing, displacement, or living conditions',
      icon: <Home className="h-6 w-6" />,
      urgency: 'high',
      examples: ['Homelessness', 'Displacement', 'Poor housing', 'Eviction threats']
    },
    {
      id: 'health_emergencies',
      title: 'Health Emergencies',
      description: 'Medical crises, disease outbreaks, or healthcare access issues',
      icon: <Activity className="h-6 w-6" />,
      urgency: 'critical',
      examples: ['Disease outbreak', 'Medical emergency', 'Healthcare access', 'Sanitation crisis']
    },
    {
      id: 'forced_displacement',
      title: 'Forced Displacement',
      description: 'People forced to leave their homes due to conflict or disaster',
      icon: <Users className="h-6 w-6" />,
      urgency: 'critical',
      examples: ['Conflict displacement', 'Natural disaster', 'Eviction', 'Refugee crisis']
    },
    {
      id: 'economic_crisis',
      title: 'Economic Crisis',
      description: 'Financial hardship, unemployment, or economic instability',
      icon: <AlertTriangle className="h-6 w-6" />,
      urgency: 'medium',
      examples: ['Unemployment', 'Poverty', 'Economic hardship', 'Financial crisis']
    },
    {
      id: 'environmental_disaster',
      title: 'Environmental Disaster',
      description: 'Natural disasters, climate-related issues, or environmental damage',
      icon: <Heart className="h-6 w-6" />,
      urgency: 'high',
      examples: ['Flooding', 'Drought', 'Landslide', 'Environmental pollution']
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Humanitarian Crisis Categories</h2>
        <p className="text-gray-600">
          Select the type of humanitarian issue you're reporting. All reports are handled with urgency and care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-300"
            onClick={() => onCategorySelect(category.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
                <Badge className={getUrgencyColor(category.urgency)}>
                  {category.urgency}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{category.description}</p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Examples:</p>
                <div className="flex flex-wrap gap-1">
                  {category.examples.map((example, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onCategorySelect(category.id);
                }}
              >
                Report {category.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Heart className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800 mb-1">Humanitarian Response</h3>
            <p className="text-sm text-green-700">
              Your report will be prioritized based on urgency and impact. Critical issues receive immediate attention 
              and coordination with humanitarian agencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumanitarianCategories; 