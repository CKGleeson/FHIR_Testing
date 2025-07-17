import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, User, Calendar, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientResponse {
  resourceType: string;
  id: string;
  meta?: {
    versionId: string;
    lastUpdated: string;
  };
  name?: Array<{
    use: string;
    family: string;
    given: string[];
  }>;
  gender?: string;
  birthDate?: string;
  telecom?: Array<{
    system: string;
    value: string;
    use: string;
  }>;
  address?: Array<{
    use: string;
    text: string;
  }>;
}

const GetPatientForm = () => {
  const { toast } = useToast();
  const [patientId, setPatientId] = useState('');
  const [response, setResponse] = useState<string>('');
  const [patientData, setPatientData] = useState<PatientResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a Patient ID.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResponse('');
    setPatientData(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock patient data based on ID
      const mockPatient: PatientResponse = {
        resourceType: 'Patient',
        id: patientId,
        meta: {
          versionId: '1',
          lastUpdated: new Date().toISOString(),
        },
        name: [
          {
            use: 'official',
            family: 'Doe',
            given: ['John'],
          },
        ],
        gender: 'male',
        birthDate: '1980-01-15',
        telecom: [
          {
            system: 'phone',
            value: '+1-555-123-4567',
            use: 'home',
          },
          {
            system: 'email',
            value: 'john.doe@email.com',
            use: 'home',
          },
        ],
        address: [
          {
            use: 'home',
            text: '123 Main Street, Anytown, ST 12345',
          },
        ],
      };

      setPatientData(mockPatient);
      setResponse(JSON.stringify(mockPatient, null, 2));
      
      toast({
        title: 'Patient Retrieved',
        description: `Successfully retrieved patient data for ID: ${patientId}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to retrieve patient. Please check the ID and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPhoneNumber = (telecom?: Array<{ system: string; value: string; use: string }>) => {
    return telecom?.find(t => t.system === 'phone')?.value || 'Not provided';
  };

  const getEmail = (telecom?: Array<{ system: string; value: string; use: string }>) => {
    return telecom?.find(t => t.system === 'email')?.value || 'Not provided';
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-card p-8 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-primary shadow-glow">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Retrieve Patient</h2>
              <p className="text-muted-foreground">Search for an existing FHIR Patient resource</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="patientId" className="text-sm font-medium text-foreground">
                Patient ID <span className="text-error">*</span>
              </Label>
              <Input
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID (e.g., patient-123456)"
                className="mt-2 rounded-xl border-muted bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary/20"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-4 rounded-xl bg-gradient-primary text-white font-semibold shadow-medical hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Fetching Patient...
                </div>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Fetch Patient
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Patient Summary Card */}
      {patientData && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-medical-green/10 to-medical-cyan/10 p-8 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-medical-green shadow-md">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-medical-green">Patient Summary</h3>
                <p className="text-muted-foreground">FHIR Patient resource details</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-card p-6 rounded-2xl border border-muted/30">
                  <h4 className="font-bold text-xl text-foreground mb-1">
                    {patientData.name?.[0]?.given?.[0]} {patientData.name?.[0]?.family}
                  </h4>
                  <Badge variant="secondary" className="bg-medical-light/60 text-medical-blue border-medical-blue/20">
                    ID: {patientData.id}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-medical-light/30 border border-medical-blue/20">
                    <div className="p-2 rounded-lg bg-medical-blue/10">
                      <User className="h-5 w-5 text-medical-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize text-foreground">{patientData.gender}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-medical-light/30 border border-medical-blue/20">
                    <div className="p-2 rounded-lg bg-medical-blue/10">
                      <Calendar className="h-5 w-5 text-medical-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium text-foreground">{patientData.birthDate ? formatDate(patientData.birthDate) : 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-medical-mint/50 border border-medical-cyan/20">
                  <div className="p-2 rounded-lg bg-medical-cyan/10">
                    <Phone className="h-5 w-5 text-medical-cyan" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{getPhoneNumber(patientData.telecom)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-medical-mint/50 border border-medical-cyan/20">
                  <div className="p-2 rounded-lg bg-medical-cyan/10">
                    <span className="text-lg">📧</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{getEmail(patientData.telecom)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-medical-mint/50 border border-medical-cyan/20">
                  <div className="p-2 rounded-lg bg-medical-cyan/10">
                    <MapPin className="h-5 w-5 text-medical-cyan" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium text-foreground">{patientData.address?.[0]?.text || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {patientData.meta && (
              <div className="mt-8 pt-6 border-t border-muted/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Last updated: {new Date(patientData.meta.lastUpdated).toLocaleString()}</span>
                  <span>•</span>
                  <span>Version: {patientData.meta.versionId}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Raw JSON Response */}
      {response && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-medical-cyan/10 p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary shadow-md">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">FHIR JSON Response</h3>
                <p className="text-muted-foreground">Raw patient data in FHIR format</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="rounded-2xl bg-muted/30 border border-muted/50 p-6 overflow-hidden">
              <pre className="text-sm font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
                {response}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetPatientForm;