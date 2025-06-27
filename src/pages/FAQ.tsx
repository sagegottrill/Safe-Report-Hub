import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, AlertTriangle, WifiOff, ArrowLeft, Shield, Lock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TrustIndicator, SecurityBadge, OfficialStamp, PrivacyNotice } from '@/components/ui/trust-indicators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const faqData = [
  {
    category: "General Information",
    items: [
      {
        q: "What is BICTDA Report Hub?",
        a: "BICTDA Report Hub is a digital platform for safe reporting of humanitarian incidents. It connects people in need with trusted support teams and organizations.",
        icon: <HelpCircle className="h-5 w-5 text-nigerian-blue mr-2 inline" />,
      },
      {
        q: "Is this an official government platform?",
        a: "No, this platform is not affiliated with any government. It is designed to help users report incidents and get support from trusted organizations.",
        icon: <Shield className="h-5 w-5 text-nigerian-green mr-2 inline" />,
      },
    ],
  },
  {
    category: "Privacy & Security",
    items: [
      {
        q: "Is my report really anonymous?",
        a: "No. Reports are linked to your registered account for follow-up and support. Your information is handled with care and is not shared without your consent.",
        icon: <Lock className="h-5 w-5 text-nigerian-green mr-2 inline" />,
      },
      {
        q: "How is my data protected?",
        a: "Your information is stored securely and only accessible to authorized support staff. We follow strict data protection practices.",
        icon: <ShieldCheck className="h-5 w-5 text-nigerian-green mr-2 inline" />,
      },
    ],
  },
  {
    category: "Reporting Process",
    items: [
      {
        q: "What happens after I submit a report?",
        a: "Your report is reviewed by trained support staff. If you provided contact details, they may reach out for more information or to offer support. You'll receive a unique case ID for tracking.",
        icon: <HelpCircle className="h-5 w-5 text-nigerian-blue mr-2 inline" />,
      },
      {
        q: "Can I report on someone else's behalf?",
        a: "Yes. You can report incidents affecting others, especially if they are unable or afraid to report themselves.",
        icon: <Users className="h-5 w-5 text-nigerian-blue mr-2 inline" />,
      },
      {
        q: "Who receives my report?",
        a: "Only authorized support staff can access your report. Your information is never shared with third parties without your explicit consent.",
        icon: <ShieldCheck className="h-5 w-5 text-nigerian-green mr-2 inline" />,
      },
      {
        q: "How long does it take to get a response?",
        a: "Emergency reports are reviewed as quickly as possible. Standard reports are typically reviewed within 24-48 hours. You can track your report status using your unique case ID.",
        icon: <HelpCircle className="h-5 w-5 text-nigerian-blue mr-2 inline" />,
      },
    ],
  },
  {
    category: "Emergency Support",
    items: [
      {
        q: "How can I get help in an emergency?",
        a: "If you or someone you know is in immediate danger, please use the emergency contacts below or reach out to local authorities immediately. This platform is for reporting, not emergency response.",
        icon: <AlertTriangle className="h-5 w-5 text-danger mr-2 inline" />,
      },
      {
        q: "What if I don't have internet?",
        a: "If you're offline, your report will be saved on your device and sent automatically when you reconnect to the internet.",
        icon: <WifiOff className="h-5 w-5 text-warning mr-2 inline" />,
      },
    ],
  },
];

const emergencyContacts = [
  { label: "Emergency Helpline (Nigeria)", value: '112' },
  { label: "Women's Helpline", value: '0803 123 4567' },
  { 
    label: 'WhatsApp Support', 
    value: '+234 814 308 4473', 
    link: 'https://wa.me/2348143084473?text=Hello.%20What%20do%20you%20want%20to%20report',
    isWhatsApp: true
  },
  {
    label: "📧 General Support",
    value: "Contact@bictdareport.com",
    link: "mailto:Contact@bictdareport.com",
  },
  {
    label: "🧑‍💼 Project Coordinator",
    value: "Kabirwanori@bictdareport.com",
    link: "mailto:Kabirwanori@bictdareport.com",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Official Header */}
        <div className="bg-white rounded-xl shadow-official border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-nigerian-green p-3 rounded-full shadow-official">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text">Help & FAQ</h1>
                <p className="text-text-light mt-1">Support Center</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="btn-official-outline flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TrustIndicator type="security" size="md">
              Secure Platform
            </TrustIndicator>
            <TrustIndicator type="privacy" size="md">
              Privacy Focused
            </TrustIndicator>
          </div>
        </div>

        {/* Privacy Notice */}
        <PrivacyNotice>
          Your safety and privacy are our top priority. All reports are handled with care and confidentiality by our support team.
        </PrivacyNotice>

        {/* FAQ Content */}
        <Card className="card-official">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text mb-2">Frequently Asked Questions</h2>
              <p className="text-text-light">Your safety matters. Here's how we keep your experience simple and secure.</p>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-8">
              {faqData.map((cat, catIdx) => (
                <div key={cat.category} className="space-y-4">
                  <h3 className="text-xl font-semibold text-text flex items-center gap-2 border-b border-gray-200 pb-2">
                    {cat.category === 'General Information' && <HelpCircle className="h-5 w-5 text-nigerian-blue" />}
                    {cat.category === 'Privacy & Security' && <Shield className="h-5 w-5 text-nigerian-green" />}
                    {cat.category === 'Reporting Process' && <HelpCircle className="h-5 w-5 text-nigerian-blue" />}
                    {cat.category === 'Emergency Support' && <AlertTriangle className="h-5 w-5 text-danger" />}
                    {cat.category}
                  </h3>
                  <div className="space-y-3">
                    {cat.items.map((item, idx) => {
                      const id = `${cat.category}-${idx}`;
                      const isOpen = openIndex === id;
                      return (
                        <div key={id} className="border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-sm">
                          <button
                            className="w-full flex items-center justify-between px-4 py-4 text-left font-medium text-text focus:outline-none focus:ring-2 focus:ring-nigerian-green rounded-lg"
                            aria-expanded={isOpen}
                            aria-controls={`faq-panel-${id}`}
                            onClick={() => handleAccordion(id)}
                          >
                            <span className="flex items-center text-sm md:text-base">{item.icon}{item.q}</span>
                            <svg 
                              className={`h-5 w-5 ml-2 transition-transform ${isOpen ? 'rotate-180 text-nigerian-green' : 'text-text-light'}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div
                            id={`faq-panel-${id}`}
                            className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 py-4 px-4' : 'max-h-0 py-0 px-4'}`}
                            style={{
                              opacity: isOpen ? 1 : 0,
                              pointerEvents: isOpen ? 'auto' : 'none',
                            }}
                            aria-hidden={!isOpen}
                          >
                            <div className="text-text-light text-sm md:text-base leading-relaxed">{item.a}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Help Box */}
        <Card className="card-official border-l-4 border-l-danger bg-danger/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <AlertTriangle className="h-6 w-6" />
              Need help right now?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-text mb-2">Emergency Contacts</h4>
                <ul className="space-y-2 text-sm">
                  {emergencyContacts.slice(0, 3).map((contact) => (
                    <li key={contact.label} className="flex items-center gap-2">
                      {contact.isWhatsApp ? (
                        <a 
                          href={contact.link} 
                          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          WhatsApp Support
                        </a>
                      ) : contact.link ? (
                        <a 
                          href={contact.link} 
                          className="text-nigerian-blue underline hover:text-nigerian-blue/80" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {contact.label}: {contact.value}
                        </a>
                      ) : (
                        <span className="text-text">{contact.label}: {contact.value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-text mb-2">Additional Support</h4>
                <ul className="space-y-2 text-sm">
                  {emergencyContacts.slice(3).map((contact) => (
                    <li key={contact.label} className="flex items-center gap-2">
                      {contact.link ? (
                        <a 
                          href={contact.link} 
                          className="text-nigerian-blue underline hover:text-nigerian-blue/80" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {contact.label}: {contact.value}
                        </a>
                      ) : (
                        <span className="text-text">{contact.label}: {contact.value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-text-light">
                <strong>Offline Support:</strong> If your device is offline, your report will be saved and sent automatically when you reconnect to the internet.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center py-6">
          <p className="text-text font-medium">
            This platform was built with love, safety, and dignity in mind — so every voice can be heard.
          </p>
          <SecurityBadge className="mt-3">Government Protected</SecurityBadge>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 