import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Heart, UserPlus, Search } from 'lucide-react';
import CreatePatientForm from './CreatePatientForm';
import GetPatientForm from './GetPatientForm';

type Mode = 'create' | 'get';

const FHIRPatientApp = () => {
  const [mode, setMode] = useState<Mode>('create');

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-medical-mint/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-medical-cyan/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-40"></div>
              <div className="relative p-4 rounded-2xl bg-gradient-primary shadow-glow">
                <Heart className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                FHIR Patient Manager
              </h1>
              <div className="w-32 h-1 bg-gradient-primary rounded-full mx-auto mt-2"></div>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Create and manage FHIR Patient resources with Apple-inspired design and healthcare precision
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="p-2 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/20">
            <div className="flex gap-2">
              <Button
                variant={mode === 'create' ? 'default' : 'ghost'}
                onClick={() => setMode('create')}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  mode === 'create' 
                    ? 'bg-gradient-primary text-white shadow-medical hover:shadow-glow' 
                    : 'text-foreground hover:bg-medical-light/50'
                }`}
              >
                <UserPlus className="h-5 w-5" />
                Create Patient
              </Button>
              <Button
                variant={mode === 'get' ? 'default' : 'ghost'}
                onClick={() => setMode('get')}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  mode === 'get' 
                    ? 'bg-gradient-primary text-white shadow-medical hover:shadow-glow' 
                    : 'text-foreground hover:bg-medical-light/50'
                }`}
              >
                <Search className="h-5 w-5" />
                Get Patient
              </Button>
            </div>
          </div>
        </div>

        {/* Current Mode Indicator */}
        <div className="flex justify-center mb-8">
          <div className="px-6 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${mode === 'create' ? 'bg-medical-green' : 'bg-medical-cyan'} animate-pulse`}></div>
              <span className="text-sm font-medium text-foreground">
                {mode === 'create' ? 'Creating New Patient' : 'Retrieving Patient Data'}
              </span>
            </div>
          </div>
        </div>

        {/* Mode-specific Forms */}
        <div className="transition-all duration-500 ease-out transform">
          {mode === 'create' ? <CreatePatientForm /> : <GetPatientForm />}
        </div>
      </div>
    </div>
  );
};

export default FHIRPatientApp;