import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, AlertTriangle, WifiOff, ArrowLeft, Shield, Lock, Users, Phone, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  emerald: '#2ecc71',
  mint: '#e8f5e9',
  forest: '#1b4332',
  sage: '#a8cbaa',
  jade: '#00a676',
  slate: '#2c3e50',
  gray: '#e0e0e0',
  white: '#fff',
  bg: '#f9fafb',
};

const faqData = [
  {
    category: "General Information",
    items: [
      {
        q: "What is BICTDA Report Hub?",
        a: "BICTDA Report Hub is a digital platform for safe reporting of humanitarian incidents. It connects people in need with trusted support teams and organizations.",
        icon: <HelpCircle className="h-4 w-4 text-[#1b4332] mr-2" />,
      },
      {
        q: "Is this an official government platform?",
        a: "No, this platform is not affiliated with any government. It is designed to help users report incidents and get support from trusted organizations.",
        icon: <Shield className="h-4 w-4 text-[#1b4332] mr-2" />,
      },
    ],
  },
  {
    category: "Privacy & Security",
    items: [
      {
        q: "Is my report really anonymous?",
        a: "No. Reports are linked to your registered account for follow-up and support. Your information is handled with care and is not shared without your consent.",
        icon: <Lock className="h-4 w-4 text-[#1b4332] mr-2" />,
      },
      {
        q: "How is my data protected?",
        a: "Your information is stored securely and only accessible to authorized support staff. We follow strict data protection practices.",
        icon: <ShieldCheck className="h-4 w-4 text-[#1b4332] mr-2" />,
      },
    ],
  },
  {
    category: "Reporting Process",
    items: [
      {
        q: "What happens after I submit a report?",
        a: "Your report is reviewed by trained support staff. If you provided contact details, they may reach out for more information or to offer support. You'll receive a unique case ID for tracking.",
        icon: <HelpCircle className="h-4 w-4 text-[#1b4332] mr-2" />,
      },
      {
        q: "Can I report on someone else's behalf?",
        a: "Yes. You can report incidents affecting others, especially if they are unable or afraid to report themselves.",
        icon: <Users className="h-4 w-4 text-[#1b4332] mr-2" />,
      },
      {
        q: "Who receives my report?",
        a: "Only authorized support staff can access your report. Your information is never shared with third parties without your explicit consent.",
        icon: <ShieldCheck className="h-4 w-4 text-[#1b4332] mr-2" />,
      },
      {
        q: "How long does it take to get a response?",
        a: "Emergency reports are reviewed as quickly as possible. Standard reports are typically reviewed within 24-48 hours. You can track your report status using your unique case ID.",
        icon: <HelpCircle className="h-4 w-4 text-[#1b4332] mr-2" />,
      },
    ],
  },
  {
    category: "Emergency Support",
    items: [
      {
        q: "How can I get help in an emergency?",
        a: "If you or someone you know is in immediate danger, please use the emergency contacts below or reach out to local authorities immediately. This platform is for reporting, not emergency response.",
        icon: <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />,
      },
      {
        q: "What if I don't have internet?",
        a: "If you're offline, your report will be saved on your device and sent automatically when you reconnect to the internet.",
        icon: <WifiOff className="h-4 w-4 text-orange-600 mr-2" />,
      },
    ],
  },
];

const emergencyContacts = [
  { label: "Emergency Helpline (Nigeria)", value: '112', icon: <Phone className="h-4 w-4" /> },
  { label: "Women's Helpline", value: '0803 123 4567', icon: <Phone className="h-4 w-4" /> },
  { label: 'WhatsApp Support', value: '+234 901 234 5678', link: 'https://wa.me/2349012345678', icon: <Phone className="h-4 w-4" /> },
  { label: 'Visit Official Website', value: 'www.humanityaid.ng', link: 'https://www.humanityaid.ng', icon: <Globe className="h-4 w-4" /> },
  {
    label: "General Support",
    value: "Contact@bictdareport.com",
    link: "mailto:Contact@bictdareport.com",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    label: "Project Coordinator",
    value: "Kabirwanori@bictdareport.com",
    link: "mailto:Kabirwanori@bictdareport.com",
    icon: <Mail className="h-4 w-4" />,
  },
];

const MobileFAQ = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans px-4 py-6 pb-24">
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-[#2ecc71] flex items-center justify-center shadow-lg">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#1b4332] mb-1">
              Help & FAQ
            </h1>
            <p className="text-xs text-[#1b4332] font-semibold">Support Center</p>
            <p className="text-xs text-[#1b4332]">Get Answers</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#1b4332] font-medium bg-[#e8f5e9] px-3 py-2 rounded-2xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      {/* Privacy Notice Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#e8f5e9] flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-[#2ecc71]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#1b4332] mb-2">Your Privacy Matters</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your safety and privacy are our top priority. All reports are handled with care and confidentiality by our support team.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-[#1b4332] mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-600">Your safety matters. Here's how we keep your experience simple and secure.</p>
        </div>

        <div className="space-y-4">
          {faqData.map((cat, catIdx) => (
            <div key={cat.category}>
              {/* Category Header */}
              <div className="bg-[#f9fafb] rounded-2xl p-4 mb-3 border border-[#e0e0e0]">
                <h3 className="text-sm font-bold text-[#1b4332] flex items-center gap-2">
                  {cat.category === 'General Information' && <HelpCircle className="h-4 w-4 text-[#2ecc71]" />}
                  {cat.category === 'Privacy & Security' && <Shield className="h-4 w-4 text-[#2ecc71]" />}
                  {cat.category === 'Reporting Process' && <HelpCircle className="h-4 w-4 text-[#2ecc71]" />}
                  {cat.category === 'Emergency Support' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  {cat.category}
                </h3>
              </div>

              {/* FAQ Items */}
              <div className="space-y-3">
                {cat.items.map((item, idx) => {
                  const id = `${cat.category}-${idx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={id} className="bg-[#f9fafb] rounded-2xl border border-[#e0e0e0] overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between px-4 py-4 text-left focus:outline-none transition-colors"
                        onClick={() => handleAccordion(id)}
                      >
                        <span className="flex items-start text-sm font-semibold text-[#1b4332] leading-tight">
                          {item.icon}
                          <span className="flex-1">{item.q}</span>
                        </span>
                        <svg 
                          className={`h-5 w-5 ml-3 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#2ecc71]' : 'text-slate-400'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <div className="text-sm text-slate-600 leading-relaxed bg-white rounded-xl p-3 border border-[#e0e0e0]">
                            {item.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Help Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#1b4332] text-lg mb-1">Need help right now?</h3>
            <p className="text-sm text-slate-600">Emergency contacts and support options</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-[#1b4332] mb-3">Emergency Contacts</h4>
            <div className="space-y-3">
              {emergencyContacts.slice(0, 3).map((contact) => (
                <div key={contact.label} className="bg-[#f9fafb] rounded-2xl p-3 border border-[#e0e0e0]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <div className="text-red-600">{contact.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#1b4332]">{contact.label}</div>
                      {contact.link ? (
                        <a 
                          href={contact.link} 
                          className="text-sm text-[#2ecc71] underline font-medium" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <div className="text-sm text-slate-600 font-medium">{contact.value}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#1b4332] mb-3">Additional Support</h4>
            <div className="space-y-3">
              {emergencyContacts.slice(3).map((contact) => (
                <div key={contact.label} className="bg-[#f9fafb] rounded-2xl p-3 border border-[#e0e0e0]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                      <div className="text-[#2ecc71]">{contact.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#1b4332]">{contact.label}</div>
                      {contact.link ? (
                        <a 
                          href={contact.link} 
                          className="text-sm text-[#2ecc71] underline font-medium" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <div className="text-sm text-slate-600 font-medium">{contact.value}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-orange-50 rounded-2xl p-4 border border-orange-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <WifiOff className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-sm text-orange-800 font-medium">
              <strong>Offline Support:</strong> If your device is offline, your report will be saved and sent automatically when you reconnect to the internet.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Message Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="text-center">
          <p className="text-sm text-slate-600 font-medium mb-3">
            This platform was built with love, safety, and dignity in mind — so every voice can be heard.
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-[#2ecc71]" />
            </div>
            <span className="text-xs text-[#1b4332] font-semibold">Secure Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFAQ; 