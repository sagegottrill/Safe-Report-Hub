import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Heart, 
  AlertTriangle, 
  Users, 
  Lock,
  Eye,
  Phone,
  MessageCircle
} from 'lucide-react';

interface GBVCategoriesProps {
  onCategorySelect: (category: string) => void;
  onBack: () => void;
}

const GBVCategories: React.FC<GBVCategoriesProps> = ({ onCategorySelect, onBack }) => {
  const { t } = useTranslation();

  const gbvCategories = [
    {
      id: 'rape_sexual_assault',
      title: t('gbvRapeSexualAssault'),
      description: 'Sexual violence and assault incidents',
      icon: <Shield className="h-6 w-6 text-red-500" />,
      urgency: 'critical',
      supportAvailable: true,
      emergencyResponse: true
    },
    {
      id: 'domestic_violence',
      title: t('gbvDomesticViolence'),
      description: 'Violence within domestic relationships',
      icon: <Heart className="h-6 w-6 text-pink-500" />,
      urgency: 'high',
      supportAvailable: true,
      emergencyResponse: true
    },
    {
      id: 'child_marriage',
      title: t('gbvChildMarriage'),
      description: 'Child and forced marriage cases',
      icon: <Users className="h-6 w-6 text-orange-500" />,
      urgency: 'high',
      supportAvailable: true,
      emergencyResponse: false
    },
    {
      id: 'fgm',
      title: t('gbvFGM'),
      description: 'Female Genital Mutilation cases',
      icon: <AlertTriangle className="h-6 w-6 text-purple-500" />,
      urgency: 'critical',
      supportAvailable: true,
      emergencyResponse: true
    },
    {
      id: 'sexual_harassment',
      title: t('gbvSexualHarassment'),
      description: 'Sexual harassment and unwanted advances',
      icon: <Eye className="h-6 w-6 text-yellow-500" />,
      urgency: 'medium',
      supportAvailable: true,
      emergencyResponse: false
    },
    {
      id: 'human_trafficking',
      title: t('gbvHumanTrafficking'),
      description: 'Human trafficking and exploitation',
      icon: <Lock className="h-6 w-6 text-gray-500" />,
      urgency: 'critical',
      supportAvailable: true,
      emergencyResponse: true
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with safety information */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Safety First</h3>
            <p className="text-sm text-red-700 mt-1">
              Your safety is our priority. You can report anonymously and access immediate support.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Anonymous Reporting
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Phone className="h-3 w-3 mr-1" />
                24/7 Support
              </Badge>
              <Badge variant="outline" className="text-xs">
                <MessageCircle className="h-3 w-3 mr-1" />
                Secure Communication
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
        {gbvCategories.map((category) => (
          <Card 
            key={category.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-l-red-500"
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
              <div className="flex flex-wrap gap-1">
                {category.supportAvailable && (
                  <Badge variant="secondary" className="text-xs">
                    Support Available
                  </Badge>
                )}
                {category.emergencyResponse && (
                  <Badge variant="destructive" className="text-xs">
                    Emergency Response
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GBVCategories; 