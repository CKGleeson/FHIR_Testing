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
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Retrieve Patient by ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="patientId" className="text-sm font-medium">
                Patient ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID (e.g., patient-123456)"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>Fetching Patient...</>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Fetch Patient
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Patient Summary Card */}
      {patientData && (
        <Card className="shadow-card border-success/20">
          <CardHeader className="bg-gradient-to-r from-success/5 to-primary/5">
            <CardTitle className="flex items-center gap-2 text-success">
              <User className="h-5 w-5" />
              Patient Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {patientData.name?.[0]?.given?.[0]} {patientData.name?.[0]?.family}
                  </h3>
                  <Badge variant="secondary" className="mt-1">
                    ID: {patientData.id}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="capitalize">{patientData.gender}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{patientData.birthDate ? formatDate(patientData.birthDate) : 'Not provided'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{getPhoneNumber(patientData.telecom)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>📧</span>
                  <span>{getEmail(patientData.telecom)}</span>
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{patientData.address?.[0]?.text || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {patientData.meta && (
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(patientData.meta.lastUpdated).toLocaleString()}
                  {' | '}Version: {patientData.meta.versionId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Raw JSON Response */}
      {response && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-primary">FHIR JSON Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono border">
              {response}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GetPatientForm;