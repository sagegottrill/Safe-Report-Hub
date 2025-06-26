import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { 
  GraduationCap, 
  Building, 
  Users, 
  BookOpen, 
  School,
  Shield,
  AlertTriangle,
  Wifi,
  Droplets,
  Users2
} from 'lucide-react';

interface EducationCategoriesProps {
  onCategorySelect: (category: string) => void;
  onBack: () => void;
}

const EducationCategories: React.FC<EducationCategoriesProps> = ({ onCategorySelect, onBack }) => {
  const { t } = useTranslation();

  const educationCategories = [
    {
      id: 'school_safety',
      title: t('educationSchoolSafety'),
      description: 'Bullying, harassment, and security threats',
      icon: <Shield className="h-6 w-6 text-red-500" />,
      urgency: 'high',
      stakeholders: ['student', 'parent', 'teacher'],
      subcategories: ['bullying', 'harassment', 'security_threats']
    },
    {
      id: 'infrastructure',
      title: t('educationInfrastructure'),
      description: 'Dilapidated buildings, lack of facilities',
      icon: <Building className="h-6 w-6 text-orange-500" />,
      urgency: 'medium',
      stakeholders: ['teacher', 'parent', 'community'],
      subcategories: ['dilapidated_classrooms', 'no_toilets', 'overcrowding', 'no_clean_water', 'poor_technology']
    },
    {
      id: 'teacher_conduct',
      title: t('educationTeacherConduct'),
      description: 'Teacher misconduct and absenteeism',
      icon: <Users className="h-6 w-6 text-blue-500" />,
      urgency: 'high',
      stakeholders: ['student', 'parent'],
      subcategories: ['misconduct', 'absenteeism', 'lack_qualifications']
    },
    {
      id: 'curriculum',
      title: t('educationCurriculum'),
      description: 'Curriculum and teaching quality issues',
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      urgency: 'medium',
      stakeholders: ['teacher', 'parent', 'student'],
      subcategories: ['inadequate_materials', 'outdated_curriculum', 'poor_ict', 'poor_teaching']
    },
    {
      id: 'access_exclusion',
      title: t('educationAccess'),
      description: 'Access barriers and discrimination',
      icon: <School className="h-6 w-6 text-purple-500" />,
      urgency: 'high',
      stakeholders: ['parent', 'community'],
      subcategories: ['out_of_school', 'discrimination']
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStakeholderIcons = (stakeholders: string[]) => {
    const icons = {
      student: <GraduationCap className="h-4 w-4" />,
      parent: <Users2 className="h-4 w-4" />,
      teacher: <Users className="h-4 w-4" />,
      community: <School className="h-4 w-4" />
    };
    return stakeholders.map(s => icons[s]).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      {/* Header with stakeholder information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <GraduationCap className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800">Educational Reporting</h3>
            <p className="text-sm text-blue-700 mt-1">
              Report educational challenges, safety issues, and infrastructure problems. 
              Choose your role for tailored reporting options.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Safe Reporting
              </Badge>
              <Badge variant="outline" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Anonymous Options
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Building className="h-3 w-3 mr-1" />
                Infrastructure Focus
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
        {educationCategories.map((category) => (
          <Card 
            key={category.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-l-blue-500"
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
                  {category.stakeholders.map((stakeholder) => (
                    <Badge key={stakeholder} variant="secondary" className="text-xs">
                      {stakeholder}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  {category.subcategories.length} subcategories available
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EducationCategories; 