export type UserRole = 'admin' | 'dispatcher' | 'driver' | 'paramedic';

export type AmbulanceStatus = 'available' | 'assigned' | 'en_route' | 'at_scene' | 'transporting' | 'at_hospital' | 'maintenance';

export type EmergencyPriority = 'critical' | 'high' | 'medium' | 'low';

export type CallStatus = 'pending' | 'assigned' | 'en_route' | 'at_scene' | 'transporting' | 'completed' | 'cancelled';

export type RequestSource = 'phone_call' | 'system' | 'mobile_app' | 'web_portal';

export type RequesterType = 'individual' | 'hospital' | 'clinic' | 'nursing_home' | 'emergency_services';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  active: boolean;
  createdAt: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  licenseNumber: string;
  model: string;
  year: number;
  status: AmbulanceStatus;
  location: {
    lat: number;
    lng: number;
  };
  assignedDriverId?: string;
  assignedParamedicId?: string;
  lastMaintenance: string;
  nextMaintenance: string;
  insuranceExpiry: string;
  equipment: string[];
}

export interface EmergencyCall {
  id: string;
  callerName: string;
  callerPhone: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  priority: EmergencyPriority;
  status: CallStatus;
  description: string;
  assignedAmbulanceId?: string;
  dispatcherId?: string;
  createdAt: string;
  responseTime?: number;
  patientId?: string;
  requestSource: RequestSource;
  requesterType: RequesterType;
  requesterDetails?: {
    organizationName?: string;
    departmentName?: string;
    contactPerson?: string;
    referenceNumber?: string;
  };
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  medicalCondition: string;
  allergies: string[];
  medications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
    hospitalName: string;
  };
}

export interface Trip {
  id: string;
  callId: string;
  ambulanceId: string;
  patientId: string;
  startTime: string;
  endTime?: string;
  distance: number;
  cost: number;
  status: 'active' | 'completed';
}

export interface MedicalEquipmentItem {
  name: string;
  category: 'life_support' | 'monitoring' | 'medication' | 'surgical' | 'diagnostic' | 'safety';
  isWorking: boolean;
  needsReplacement: boolean;
  expiryDate?: string;
  notes?: string;
}

export interface VehicleInspectionItem {
  name: string;
  category: 'engine' | 'fluids' | 'brakes' | 'tires' | 'lights' | 'safety' | 'electrical';
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  needsAttention: boolean;
  notes?: string;
}

export interface ParamedicInspection {
  id: string;
  paramedicId: string;
  ambulanceId: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  medicalEquipment: MedicalEquipmentItem[];
  overallStatus: 'ready' | 'needs_attention' | 'out_of_service';
  additionalNotes?: string;
  submittedAt: string;
}

export interface DriverInspection {
  id: string;
  driverId: string;
  ambulanceId: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  vehicleInspection: VehicleInspectionItem[];
  mileage: number;
  fuelLevel: number;
  overallStatus: 'ready' | 'needs_attention' | 'out_of_service';
  additionalNotes?: string;
  submittedAt: string;
}