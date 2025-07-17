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
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">FHIR Patient Manager</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create and manage FHIR Patient resources with a modern, intuitive interface
          </p>
        </div>

        {/* Mode Toggle */}
        <Card className="mb-8 shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">Select Operation Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 justify-center">
              <Button
                variant={mode === 'create' ? 'default' : 'outline'}
                onClick={() => setMode('create')}
                className="flex items-center gap-2 px-6 py-3"
              >
                <UserPlus className="h-4 w-4" />
                Create Patient
              </Button>
              <Button
                variant={mode === 'get' ? 'default' : 'outline'}
                onClick={() => setMode('get')}
                className="flex items-center gap-2 px-6 py-3"
              >
                <Search className="h-4 w-4" />
                Get Patient
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Mode Badge */}
        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            Current Mode: {mode === 'create' ? 'Creating Patient' : 'Retrieving Patient'}
          </Badge>
        </div>

        {/* Mode-specific Forms */}
        <div className="transition-all duration-300 ease-in-out">
          {mode === 'create' ? <CreatePatientForm /> : <GetPatientForm />}
        </div>
      </div>
    </div>
  );
};

export default FHIRPatientApp;