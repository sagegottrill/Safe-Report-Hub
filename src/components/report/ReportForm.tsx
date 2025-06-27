import { GiFemale, GiRunningNinja, GiFoodChain, GiWaterDrop, GiFamilyHouse, GiHealthNormal } from 'react-icons/gi';
import { FaUser } from 'react-icons/fa';

const CATEGORY_OPTIONS = [
  // ...existing options...
  {
    value: 'education_issues',
    label: t('Education Issues'),
    description: t('Problems with schools, teachers, or access to education.'),
    icon: <FaUser className="inline mr-1" />,
  },
  {
    value: 'borehole_issues',
    label: t('Borehole Issues'),
    description: t('Problems with water supply, boreholes, or community water points.'),
    icon: <GiWaterDrop className="inline mr-1" />,
  },
]; 