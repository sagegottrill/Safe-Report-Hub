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
    <div className="min-h-screen bg-[#f9fafb] font-sans px-4 py-6 pb-24 flex flex-col items-center">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-nigerian-green to-emerald-500 text-white rounded-3xl shadow-lg px-6 pt-4 pb-3 mb-6 w-full max-w-md flex flex-col items-center">
        <div className="bg-white/20 p-2 rounded-full shadow mb-2 flex items-center justify-center">
          <HelpCircle className="h-7 w-7 text-white" />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xl font-extrabold leading-tight tracking-wide">Help & FAQ</span>
          <span className="text-base font-normal leading-tight">Support Center</span>
        </div>
      </div>

      {/* Trust Indicators and Privacy Notice */}
      <div className="w-full max-w-md mb-6">
        <div className="flex flex-col md:flex-row gap-3 mb-2">
          <TrustIndicator type="security" size="md">Secure Platform</TrustIndicator>
          <TrustIndicator type="privacy" size="md">Privacy Focused</TrustIndicator>
        </div>
        <PrivacyNotice>
          Your safety and privacy are our top priority. All reports are handled with care and confidentiality by our support team.
        </PrivacyNotice>
      </div>

      {/* FAQ Content Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-md mb-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1b4332] mb-2">Frequently Asked Questions</h2>
          <p className="text-slate-500">Your safety matters. Here's how we keep your experience simple and secure.</p>
        </div>
        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqData.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1b4332] flex items-center gap-2 border-b border-gray-200 pb-2">
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
                    <div key={id} className="border border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-md bg-[#f9fafb]">
                      <button
                        className="w-full flex items-center justify-between px-4 py-4 text-left font-medium text-[#1b4332] focus:outline-none focus:ring-2 focus:ring-nigerian-green rounded-2xl"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${id}`}
                        onClick={() => handleAccordion(id)}
                      >
                        <span className="flex items-center text-base">{item.icon}{item.q}</span>
                        <svg 
                          className={`h-5 w-5 ml-2 transition-transform ${isOpen ? 'rotate-180 text-nigerian-green' : 'text-slate-400'}`} 
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
                      >
                        <p className="text-slate-600 text-base">{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-8 mb-2 w-full fixed bottom-0 left-0 bg-[#f9fafb] py-3 z-40">
        © 2025 BICTDA Report - All rights reserved.
      </div>
    </div>
  );
};

export default FAQ; 