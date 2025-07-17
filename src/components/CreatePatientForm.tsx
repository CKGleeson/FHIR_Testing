import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OptionalField {
  key: string;
  label: string;
  value: string;
}

interface PatientData {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  phone: string;
  address: string;
  optionalFields: OptionalField[];
}

const optionalFieldOptions = [
  { key: 'email', label: 'Email' },
  { key: 'maritalStatus', label: 'Marital Status' },
  { key: 'language', label: 'Language' },
  { key: 'birthPlace', label: 'Birth Place' },
];

const CreatePatientForm = () => {
  const { toast } = useToast();
  const [patientData, setPatientData] = useState<PatientData>({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    phone: '',
    address: '',
    optionalFields: [],
  });
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const availableOptionalFields = optionalFieldOptions.filter(
    option => !patientData.optionalFields.some(field => field.key === option.key)
  );

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionalFieldChange = (index: number, value: string) => {
    setPatientData(prev => ({
      ...prev,
      optionalFields: prev.optionalFields.map((field, i) =>
        i === index ? { ...field, value } : field
      ),
    }));
  };

  const addOptionalField = (fieldKey: string) => {
    const fieldOption = optionalFieldOptions.find(option => option.key === fieldKey);
    if (fieldOption) {
      setPatientData(prev => ({
        ...prev,
        optionalFields: [...prev.optionalFields, { ...fieldOption, value: '' }],
      }));
    }
  };

  const removeOptionalField = (index: number) => {
    setPatientData(prev => ({
      ...prev,
      optionalFields: prev.optionalFields.filter((_, i) => i !== index),
    }));
  };

  const generateFHIRResource = (): any => {
    const resource: any = {
      resourceType: 'Patient',
      name: [
        {
          use: 'official',
          family: patientData.lastName,
          given: [patientData.firstName],
        },
      ],
      gender: patientData.gender,
      birthDate: patientData.birthDate,
      telecom: [
        {
          system: 'phone',
          value: patientData.phone,
          use: 'home',
        },
      ],
      address: [
        {
          use: 'home',
          text: patientData.address,
        },
      ],
    };

    // Add optional fields
    patientData.optionalFields.forEach(field => {
      switch (field.key) {
        case 'email':
          resource.telecom.push({
            system: 'email',
            value: field.value,
            use: 'home',
          });
          break;
        case 'maritalStatus':
          resource.maritalStatus = {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-MaritalStatus',
                code: field.value,
                display: field.value,
              },
            ],
          };
          break;
        case 'language':
          resource.communication = [
            {
              language: {
                coding: [
                  {
                    system: 'urn:ietf:bcp:47',
                    code: field.value,
                    display: field.value,
                  },
                ],
              },
            },
          ];
          break;
        case 'birthPlace':
          resource.extension = [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/patient-birthPlace',
              valueAddress: {
                text: field.value,
              },
            },
          ];
          break;
      }
    });

    return resource;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!patientData.firstName || !patientData.lastName || !patientData.gender || 
        !patientData.birthDate || !patientData.phone || !patientData.address) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const fhirResource = generateFHIRResource();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockResponse = {
        resourceType: 'Patient',
        id: `patient-${Date.now()}`,
        meta: {
          versionId: '1',
          lastUpdated: new Date().toISOString(),
        },
        ...fhirResource,
      };

      setResponse(JSON.stringify(mockResponse, null, 2));
      toast({
        title: 'Patient Created',
        description: `Patient ${patientData.firstName} ${patientData.lastName} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create patient. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-card p-8 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-primary shadow-glow">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Create New Patient</h2>
              <p className="text-muted-foreground">Enter patient information to create a FHIR resource</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Required Fields */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-error rounded-full"></span>
                Required Information
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name <span className="text-error">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={patientData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      className="mt-2 rounded-xl border-muted bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name <span className="text-error">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={patientData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      className="mt-2 rounded-xl border-muted bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="gender" className="text-sm font-medium text-foreground">
                      Gender <span className="text-error">*</span>
                    </Label>
                    <Select value={patientData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="mt-2 rounded-xl border-muted bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-muted bg-white/95 backdrop-blur-xl">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="birthDate" className="text-sm font-medium text-foreground">
                      Date of Birth <span className="text-error">*</span>
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={patientData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="mt-2 rounded-xl border-muted bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={patientData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-2 rounded-xl border-muted bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-foreground">
                    Address <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={patientData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter full address"
                    className="mt-2 rounded-xl border-muted bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="border-t border-muted/30 pt-8">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-medical-cyan rounded-full"></span>
                Optional Information
              </h3>
              
              {patientData.optionalFields.map((field, index) => (
                <div key={field.key} className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    <Label htmlFor={`optional-${field.key}`} className="text-sm font-medium text-foreground">
                      {field.label}
                    </Label>
                    <Input
                      id={`optional-${field.key}`}
                      value={field.value}
                      onChange={(e) => handleOptionalFieldChange(index, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="mt-2 rounded-xl border-muted bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOptionalField(index)}
                    className="mt-7 rounded-xl border-muted hover:bg-error/10 hover:border-error/30"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {availableOptionalFields.length > 0 && (
                <div className="flex items-center gap-3 mt-6">
                  <Select onValueChange={addOptionalField}>
                    <SelectTrigger className="w-60 rounded-xl border-muted bg-white/50 backdrop-blur-sm">
                      <SelectValue placeholder="Add optional field" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-muted bg-white/95 backdrop-blur-xl">
                      {availableOptionalFields.map(option => (
                        <SelectItem key={option.key} value={option.key}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="secondary" className="text-xs bg-medical-light/50 text-medical-blue border-medical-blue/20">
                    {availableOptionalFields.length} available
                  </Badge>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-4 rounded-xl bg-gradient-primary text-white font-semibold shadow-medical hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Create Patient
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-medical-green/10 to-medical-cyan/10 p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-medical-green shadow-md">
                <Send className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-medical-green">Patient Created Successfully</h3>
                <p className="text-muted-foreground">FHIR Patient resource has been generated</p>
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

export default CreatePatientForm;