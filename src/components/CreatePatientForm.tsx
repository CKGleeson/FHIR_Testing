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
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Patient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={patientData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={patientData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender <span className="text-destructive">*</span>
                </Label>
                <Select value={patientData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="birthDate" className="text-sm font-medium">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={patientData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                value={patientData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                value={patientData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full address"
                required
              />
            </div>

            {/* Optional Fields */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Optional Fields</h3>
              
              {patientData.optionalFields.map((field, index) => (
                <div key={field.key} className="flex items-center gap-2 mb-3">
                  <div className="flex-1">
                    <Label htmlFor={`optional-${field.key}`} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    <Input
                      id={`optional-${field.key}`}
                      value={field.value}
                      onChange={(e) => handleOptionalFieldChange(index, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOptionalField(index)}
                    className="mt-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {availableOptionalFields.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <Select onValueChange={addOptionalField}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Add optional field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOptionalFields.map(option => (
                        <SelectItem key={option.key} value={option.key}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="secondary" className="text-xs">
                    {availableOptionalFields.length} available
                  </Badge>
                </div>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Create Patient
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Response Display */}
      {response && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-success">Patient Created Successfully</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
              {response}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreatePatientForm;