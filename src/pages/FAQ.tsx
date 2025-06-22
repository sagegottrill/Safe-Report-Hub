import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, AlertTriangle, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const faqData = [
  {
    category: "General Info",
    items: [
      {
        q: "What is Safe Report Hub?",
        a: "Safe Report Hub is a digital platform for safe, anonymous reporting of humanitarian incidents. It connects people in need with trusted support teams.",
        icon: <HelpCircle className="h-5 w-5 text-blue-500 mr-2 inline" />,
      },
    ],
  },
  {
    category: "Privacy & Safety",
    items: [
      {
        q: "Is my report really anonymous?",
        a: "Yes. You can submit a report without providing your name or contact. Only authorized responders can access your report, and your identity is never shared.",
        icon: <ShieldCheck className="h-5 w-5 text-green-500 mr-2 inline" />,
      },
    ],
  },
  {
    category: "Reporting Process",
    items: [
      {
        q: "What happens after I submit a report?",
        a: "Your report is reviewed by trained humanitarian staff. If you provided contact details, they may reach out for more information or to offer support.",
        icon: <HelpCircle className="h-5 w-5 text-blue-500 mr-2 inline" />,
      },
      {
        q: "Can I report on someone else's behalf?",
        a: "Yes. You can report incidents affecting others, especially if they are unable or afraid to report themselves.",
        icon: <HelpCircle className="h-5 w-5 text-blue-500 mr-2 inline" />,
      },
      {
        q: "Who receives my report?",
        a: "Only authorized humanitarian responders and support staff can access your report. Your information is never shared with third parties.",
        icon: <ShieldCheck className="h-5 w-5 text-green-500 mr-2 inline" />,
      },
    ],
  },
  {
    category: "Emergencies",
    items: [
      {
        q: "How can I get help in an emergency?",
        a: "If you or someone you know is in immediate danger, please use the emergency contacts below or reach out to local authorities.",
        icon: <AlertTriangle className="h-5 w-5 text-red-500 mr-2 inline" />,
      },
      {
        q: "What if I don't have internet?",
        a: "If you're offline, your report will be saved on your device and sent automatically when you reconnect to the internet.",
        icon: <WifiOff className="h-5 w-5 text-yellow-500 mr-2 inline" />,
      },
    ],
  },
];

const emergencyContacts = [
  { label: "Women's Helpline (Nigeria)", value: '0803 123 4567' },
  { label: 'WhatsApp Support', value: '+234 901 234 5678', link: 'https://wa.me/2349012345678' },
  { label: 'Visit', value: 'www.humanityaid.ng', link: 'https://www.humanityaid.ng' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center scroll-mt-24 py-8 px-2 md:px-0"
      aria-label="Help and FAQ"
      role="region"
    >
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Back to Home"
      >
        ← Back to Home
      </button>
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100 mb-8">
          <div className="flex flex-col items-center gap-2 mb-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 tracking-tight">Help & FAQ</h1>
            <div className="text-base md:text-lg text-blue-600 font-medium text-center">
              Your safety matters. Here's how we keep your experience simple and secure.
            </div>
          </div>
          {/* FAQ Categories */}
          {faqData.map((cat, catIdx) => (
            <div key={cat.category} className="mb-6">
              <h2 className="text-lg md:text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
                {cat.category === 'General Info' && <HelpCircle className="h-5 w-5 text-blue-400" />}
                {cat.category === 'Privacy & Safety' && <ShieldCheck className="h-5 w-5 text-green-400" />}
                {cat.category === 'Reporting Process' && <HelpCircle className="h-5 w-5 text-blue-400" />}
                {cat.category === 'Emergencies' && <AlertTriangle className="h-5 w-5 text-red-400" />}
                {cat.category}
              </h2>
              <div className="space-y-2">
                {cat.items.map((item, idx) => {
                  const id = `${cat.category}-${idx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={id} className="rounded-lg bg-gray-50 border transition-all duration-300 shadow-sm">
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${id}`}
                        onClick={() => handleAccordion(id)}
                      >
                        <span className="flex items-center">{item.icon}{item.q}</span>
                        <svg className={`h-5 w-5 ml-2 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : 'text-blue-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      <div
                        id={`faq-panel-${id}`}
                        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 py-2 px-4' : 'max-h-0 py-0 px-4'}`}
                        style={{
                          opacity: isOpen ? 1 : 0,
                          pointerEvents: isOpen ? 'auto' : 'none',
                        }}
                        aria-hidden={!isOpen}
                      >
                        <div className="text-gray-700 text-base md:text-lg leading-relaxed">{item.a}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {/* Emergency Help Box */}
          <div className="mt-10 bg-gradient-to-br from-red-50 to-blue-100 border-l-4 border-blue-400 rounded-xl p-6 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-7 w-7 text-red-500" />
              <span className="text-lg md:text-xl font-semibold text-red-700">Need help right now?</span>
            </div>
            <ul className="text-gray-700 text-base md:text-lg space-y-1 mb-2">
              {emergencyContacts.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.link ? (
                    <a href={c.link} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">{c.label}: {c.value}</a>
                  ) : (
                    <span>{c.label}: {c.value}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="text-xs md:text-sm text-gray-500 mt-2">If your device is offline, your report will be saved and sent once internet is restored.</div>
          </div>
          <div className="mt-8 text-center text-blue-900 font-medium text-base md:text-lg">
            This platform was built with love, safety, and dignity in mind — so every voice can be heard.
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 