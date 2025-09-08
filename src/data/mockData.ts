import { User, Ambulance, EmergencyCall, Patient, Trip, DriverInspection, ParamedicInspection } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@ams.com',
    role: 'admin',
    phone: '+1234567890',
    active: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Dispatcher',
    email: 'dispatcher@ams.com',
    role: 'dispatcher',
    phone: '+1234567891',
    active: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Mike Driver',
    email: 'driver@ams.com',
    role: 'driver',
    phone: '+1234567892',
    active: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Dr. Lisa Paramedic',
    email: 'paramedic@ams.com',
    role: 'paramedic',
    phone: '+1234567893',
    active: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockAmbulances: Ambulance[] = [
  {
    id: 'amb-1',
    vehicleNumber: 'AMB-001',
    licenseNumber: 'ABC123',
    model: 'Mercedes Sprinter',
    year: 2022,
    status: 'available',
    location: { lat: 40.7128, lng: -74.0060 },
    assignedDriverId: '3',
    assignedParamedicId: '4',
    lastMaintenance: '2024-07-15',
    nextMaintenance: '2024-10-15',
    insuranceExpiry: '2025-03-20',
    equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit']
  },
  {
    id: 'amb-2',
    vehicleNumber: 'AMB-002',
    licenseNumber: 'DEF456',
    model: 'Ford Transit',
    year: 2021,
    status: 'en_route',
    location: { lat: 40.7589, lng: -73.9851 },
    assignedDriverId: '3',
    lastMaintenance: '2024-06-20',
    nextMaintenance: '2024-09-20',
    insuranceExpiry: '2025-01-15',
    equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit', 'Ventilator']
  },
  {
    id: 'amb-3',
    vehicleNumber: 'AMB-003',
    licenseNumber: 'GHI789',
    model: 'Chevrolet Express',
    year: 2020,
    status: 'maintenance',
    location: { lat: 40.7282, lng: -73.7949 },
    lastMaintenance: '2024-08-01',
    nextMaintenance: '2024-11-01',
    insuranceExpiry: '2024-12-30',
    equipment: ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit']
  }
];

export const mockEmergencyCalls: EmergencyCall[] = [
  {
    id: 'call-1',
    callerName: 'Emergency Caller',
    callerPhone: '+1555123456',
    location: {
      lat: 40.7505,
      lng: -73.9934,
      address: '123 Main St, New York, NY 10001'
    },
    priority: 'critical',
    status: 'assigned',
    description: 'Cardiac arrest - 65 year old male',
    assignedAmbulanceId: 'amb-2',
    dispatcherId: '2',
    createdAt: '2024-08-28T10:30:00Z',
    patientId: 'patient-1',
    requestSource: 'phone_call',
    requesterType: 'individual'
  },
  {
    id: 'call-2',
    callerName: 'Jane Smith',
    callerPhone: '+1555654321',
    location: {
      lat: 40.7831,
      lng: -73.9712,
      address: '456 Broadway, New York, NY 10013'
    },
    priority: 'high',
    status: 'pending',
    description: 'Car accident with injuries',
    dispatcherId: '2',
    createdAt: '2024-08-28T11:15:00Z',
    requestSource: 'phone_call',
    requesterType: 'individual'
  },
  {
    id: 'call-3',
    callerName: 'Dr. Anderson',
    callerPhone: '+1555987654',
    location: {
      lat: 40.7614,
      lng: -73.9776,
      address: '789 Hospital Ave, New York, NY 10019'
    },
    priority: 'medium',
    status: 'completed',
    description: 'Non-emergency patient transfer',
    assignedAmbulanceId: 'amb-1',
    dispatcherId: '2',
    createdAt: '2024-08-28T09:00:00Z',
    responseTime: 8,
    patientId: 'patient-2',
    requestSource: 'system',
    requesterType: 'hospital',
    requesterDetails: {
      organizationName: 'General Hospital',
      departmentName: 'Emergency Department',
      contactPerson: 'Dr. Anderson',
      referenceNumber: 'GH-2024-0829-001'
    }
  },
  {
    id: 'call-4',
    callerName: 'Sunset Nursing Home',
    callerPhone: '+1555456789',
    location: {
      lat: 40.7282,
      lng: -73.7949,
      address: '321 Care Ave, Queens, NY 11368'
    },
    priority: 'medium',
    status: 'pending',
    description: 'Elderly patient with breathing difficulties',
    dispatcherId: '2',
    createdAt: '2024-08-29T08:45:00Z',
    requestSource: 'web_portal',
    requesterType: 'nursing_home',
    requesterDetails: {
      organizationName: 'Sunset Nursing Home',
      departmentName: 'Medical Unit',
      contactPerson: 'Nurse Margaret',
      referenceNumber: 'SNH-2024-0829-003'
    }
  },
  {
    id: 'call-5',
    callerName: 'City Clinic',
    callerPhone: '+1555321654',
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: '555 Health St, New York, NY 10024'
    },
    priority: 'high',
    status: 'assigned',
    description: 'Patient needs immediate transport to specialized facility',
    assignedAmbulanceId: 'amb-1',
    dispatcherId: '2',
    createdAt: '2024-08-29T09:15:00Z',
    requestSource: 'system',
    requesterType: 'clinic',
    requesterDetails: {
      organizationName: 'City Medical Clinic',
      departmentName: 'Urgent Care',
      contactPerson: 'Dr. Martinez',
      referenceNumber: 'CMC-2024-0829-007'
    }
  },
  {
    id: 'call-6',
    callerName: 'John Rodriguez',
    callerPhone: '+1555789123',
    location: {
      lat: 40.7831,
      lng: -73.9712,
      address: '678 Park Ave, New York, NY 10021'
    },
    priority: 'low',
    status: 'pending',
    description: 'Non-emergency medical transport',
    dispatcherId: '2',
    createdAt: '2024-08-29T10:00:00Z',
    requestSource: 'mobile_app',
    requesterType: 'individual'
  }
];

export const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    name: 'Robert Johnson',
    age: 65,
    gender: 'male',
    phone: '+1555111222',
    medicalCondition: 'Cardiac arrest',
    allergies: ['Penicillin'],
    medications: ['Aspirin', 'Metoprolol'],
    emergencyContact: {
      name: 'Mary Johnson',
      phone: '+1555333444',
      relation: 'Wife'
    },
    pickupLocation: {
      lat: 40.7505,
      lng: -73.9934,
      address: '123 Main St, New York, NY 10001'
    },
    destination: {
      lat: 40.7794,
      lng: -73.9632,
      address: '1234 Hospital Dr, New York, NY 10021',
      hospitalName: 'NYC General Hospital'
    }
  },
  {
    id: 'patient-2',
    name: 'Alice Brown',
    age: 45,
    gender: 'female',
    phone: '+1555555666',
    medicalCondition: 'Post-surgery transfer',
    allergies: [],
    medications: ['Ibuprofen'],
    emergencyContact: {
      name: 'Tom Brown',
      phone: '+1555777888',
      relation: 'Husband'
    },
    pickupLocation: {
      lat: 40.7614,
      lng: -73.9776,
      address: '789 Hospital Ave, New York, NY 10019'
    },
    destination: {
      lat: 40.7282,
      lng: -73.7949,
      address: '456 Recovery Center, Queens, NY 11368',
      hospitalName: 'Queens Recovery Center'
    }
  }
];

export const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    callId: 'call-1',
    ambulanceId: 'amb-2',
    patientId: 'patient-1',
    startTime: '2024-08-28T10:35:00Z',
    distance: 5.2,
    cost: 450.00,
    status: 'active'
  },
  {
    id: 'trip-2',
    callId: 'call-3',
    ambulanceId: 'amb-1',
    patientId: 'patient-2',
    startTime: '2024-08-28T09:05:00Z',
    endTime: '2024-08-28T09:45:00Z',
    distance: 12.8,
    cost: 280.00,
    status: 'completed'
  }
];

export const mockDriverInspections: DriverInspection[] = [
  {
    id: 'driver-insp-001',
    driverId: '3',
    ambulanceId: 'amb-1',
    date: '2024-08-29',
    shift: 'morning',
    vehicleInspection: [
      { name: 'Engine Oil Level', category: 'engine', condition: 'good', needsAttention: false, notes: '' },
      { name: 'Brake Fluid', category: 'fluids', condition: 'fair', needsAttention: true, notes: 'Level slightly low' },
      { name: 'Tire Pressure', category: 'tires', condition: 'excellent', needsAttention: false, notes: '' },
      { name: 'Emergency Lights', category: 'lights', condition: 'good', needsAttention: false, notes: '' }
    ],
    mileage: 85420,
    fuelLevel: 75,
    overallStatus: 'needs_attention',
    additionalNotes: 'Brake fluid needs topping up before next shift',
    submittedAt: '2024-08-29T08:00:00Z'
  }
];

export const mockParamedicInspections: ParamedicInspection[] = [
  {
    id: 'med-insp-001',
    paramedicId: '4',
    ambulanceId: 'amb-1',
    date: '2024-08-29',
    shift: 'morning',
    medicalEquipment: [
      { name: 'Defibrillator/AED', category: 'life_support', isWorking: true, needsReplacement: false, notes: 'Battery at 85%' },
      { name: 'Epinephrine Auto-Injector', category: 'medication', isWorking: true, needsReplacement: true, expiryDate: '2024-09-15', notes: 'Expires soon' },
      { name: 'ECG Monitor', category: 'monitoring', isWorking: true, needsReplacement: false, notes: '' },
      { name: 'Oxygen Tank (Primary)', category: 'life_support', isWorking: true, needsReplacement: false, notes: '95% full' }
    ],
    overallStatus: 'needs_attention',
    additionalNotes: 'Need to order new epinephrine auto-injectors',
    submittedAt: '2024-08-29T08:15:00Z'
  }
];