import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  const checkFirebaseConfig = () => {
    const config = {
      apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: !!import.meta.env.VITE_FIREBASE_APP_ID
    };

    const isConfigured = Object.values(config).every(Boolean);
    
    setDebugInfo({
      firebase: {
        configured: isConfigured,
        config
      },
      timestamp: new Date().toISOString()
    });
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-red-500 hover:bg-red-600"
        size="sm"
      >
        Debug
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Debug Panel
            <Button onClick={() => setIsOpen(false)} size="sm" variant="outline">
              Close
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkFirebaseConfig} className="w-full">
            Check Firebase Config
          </Button>
          
          {debugInfo.firebase && (
            <div className="space-y-2">
              <h3 className="font-semibold">Firebase Configuration</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Configured:</span>
                  <Badge variant={debugInfo.firebase.configured ? "default" : "destructive"}>
                    {debugInfo.firebase.configured ? "✅ Yes" : "❌ No"}
                  </Badge>
                </div>
                {Object.entries(debugInfo.firebase.config).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span>{key}:</span>
                    <Badge variant={value ? "default" : "destructive"}>
                      {value ? "✅" : "❌"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {debugInfo.timestamp && (
            <div className="text-xs text-gray-500">
              Last checked: {debugInfo.timestamp}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPanel; 