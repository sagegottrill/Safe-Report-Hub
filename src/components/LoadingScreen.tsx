import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';

interface LoadingScreenProps {
  onDeviceDetected: (isMobile: boolean) => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onDeviceDetected }) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if we're on mobile
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || 
                   window.innerWidth <= 768;
    setIsMobile(mobile);

    const detectDevice = () => {
      const steps = [
        { delay: 400, text: 'Initializing...' },
        { delay: 800, text: 'Detecting device...' },
        { delay: 1200, text: mobile ? 'Loading mobile interface...' : 'Loading web interface...' },
        { delay: 1600, text: 'Preparing components...' },
        { delay: 2000, text: 'Almost ready...' }
      ];

      let currentStep = 0;
      
      const runSteps = () => {
        if (currentStep < steps.length) {
          setLoadingStep(currentStep);
          setTimeout(() => {
            currentStep++;
            runSteps();
          }, steps[currentStep].delay);
        } else {
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
              onDeviceDetected(mobile);
            }, 400);
          }, 400);
        }
      };

      runSteps();
    };

    detectDevice();
  }, [onDeviceDetected]);

  const loadingSteps = [
    'Initializing...',
    'Detecting device...',
    'Loading interface...',
    'Preparing components...',
    'Almost ready...'
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1b4332] via-[#2ecc71] to-[#27ae60] flex items-center justify-center z-50">
      {/* Main Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-sm mx-auto">
        {/* Shield Icon with 3D Effect - Mobile Optimized */}
        <div className="relative mb-6 md:mb-8">
          <div className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} mx-auto relative`}>
            {/* 3D Shadow */}
            <div className="absolute inset-0 bg-[#0f2e1f] rounded-3xl transform translate-y-1 md:translate-y-2 blur-sm"></div>
            
            {/* Main Shield */}
            <div className="relative bg-gradient-to-br from-[#2ecc71] to-[#27ae60] rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/20 transform hover:scale-105 transition-all duration-500">
              <Shield className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-white drop-shadow-lg`} />
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2ecc71]/30 to-[#27ae60]/30 rounded-3xl blur-xl animate-pulse"></div>
          </div>
        </div>

        {/* Title - Mobile Optimized */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
            BICTDA
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-medium drop-shadow-md">
            Safety Support Report
          </p>
          <p className="text-xs md:text-sm lg:text-base text-white/70 mt-2 drop-shadow-sm">
            Official Government Platform
          </p>
        </div>

        {/* Loading Steps - Mobile Optimized */}
        <div className="max-w-xs md:max-w-md mx-auto mb-6 md:mb-8">
          <div className="space-y-2 md:space-y-3">
            {loadingSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-500 ${
                  index <= loadingStep
                    ? 'bg-white/20 backdrop-blur-sm border border-white/30'
                    : 'bg-white/10'
                }`}
              >
                <span className={`text-xs md:text-sm lg:text-base font-medium transition-all duration-300 ${
                  index <= loadingStep ? 'text-white' : 'text-white/50'
                }`}>
                  {step}
                </span>
                {index < loadingStep && (
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" />
                )}
                {index === loadingStep && (
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar - Mobile Optimized */}
        <div className="max-w-xs md:max-w-md mx-auto mb-6 md:mb-8">
          <div className="bg-white/20 rounded-full h-1.5 md:h-2 overflow-hidden backdrop-blur-sm">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Loading Animation - Mobile Optimized */}
        {!isComplete && (
          <div className="flex items-center justify-center space-x-1.5 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}

        {/* Completion Message - Mobile Optimized */}
        {isComplete && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-center space-x-2 text-white">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg font-semibold">Ready!</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Elements - Mobile Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 md:top-20 left-16 md:left-20 w-3 h-3 md:w-4 md:h-4 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 md:top-40 right-24 md:right-32 w-4 h-4 md:w-6 md:h-6 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-24 md:bottom-32 left-24 md:left-32 w-2 h-2 md:w-3 md:h-3 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-16 md:bottom-20 right-16 md:right-20 w-3 h-3 md:w-5 md:h-5 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen; 