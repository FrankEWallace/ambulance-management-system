import { apiClient } from './api';
import { User, Ambulance, Patient, EmergencyCall, Trip } from '../types';

// Authentication API
export const authApi = {
  // Login and get token
  login: async (username: string, password: string): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>('/auth/token/', {
      username,
      password,
    });
    apiClient.setToken(response.token);
    return response;
  },

  // Logout
  logout: () => {
    apiClient.clearToken();
  },

  // Get current user profile
  getProfile: (): Promise<User> => {
    return apiClient.get<User>('/profile/');
  },
};

// Users API
export const usersApi = {
  // Get all users
  getUsers: (): Promise<{ count: number; results: User[] }> => {
    return apiClient.get<{ count: number; results: User[] }>('/users/');
  },

  // Get user by ID
  getUser: (id: string): Promise<User> => {
    return apiClient.get<User>(`/users/${id}/`);
  },

  // Create new user
  createUser: (userData: Partial<User>): Promise<User> => {
    return apiClient.post<User>('/users/', userData);
  },

  // Update user
  updateUser: (id: string, userData: Partial<User>): Promise<User> => {
    return apiClient.put<User>(`/users/${id}/`, userData);
  },

  // Delete user
  deleteUser: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/users/${id}/`);
  },
};

// Ambulances API
export const ambulancesApi = {
  // Get all ambulances
  getAmbulances: (): Promise<{ count: number; results: Ambulance[] }> => {
    return apiClient.get<{ count: number; results: Ambulance[] }>('/ambulances/');
  },

  // Get ambulance by ID
  getAmbulance: (id: string): Promise<Ambulance> => {
    return apiClient.get<Ambulance>(`/ambulances/${id}/`);
  },

  // Create new ambulance
  createAmbulance: (ambulanceData: Partial<Ambulance>): Promise<Ambulance> => {
    return apiClient.post<Ambulance>('/ambulances/', ambulanceData);
  },

  // Update ambulance
  updateAmbulance: (id: string, ambulanceData: Partial<Ambulance>): Promise<Ambulance> => {
    return apiClient.put<Ambulance>(`/ambulances/${id}/`, ambulanceData);
  },

  // Update ambulance location
  updateLocation: (id: string, location: { lat: number; lng: number }): Promise<void> => {
    return apiClient.patch<void>(`/ambulances/${id}/location/`, {
      latitude: location.lat,
      longitude: location.lng,
    });
  },

  // Get available ambulances
  getAvailableAmbulances: (): Promise<Ambulance[]> => {
    return apiClient.get<Ambulance[]>('/ambulances/available/');
  },

  // Delete ambulance
  deleteAmbulance: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/ambulances/${id}/`);
  },
};

// Patients API
export const patientsApi = {
  // Get all patients
  getPatients: (): Promise<{ count: number; results: Patient[] }> => {
    return apiClient.get<{ count: number; results: Patient[] }>('/patients/');
  },

  // Get patient by ID
  getPatient: (id: string): Promise<Patient> => {
    return apiClient.get<Patient>(`/patients/${id}/`);
  },

  // Create new patient
  createPatient: (patientData: Partial<Patient>): Promise<Patient> => {
    return apiClient.post<Patient>('/patients/', patientData);
  },

  // Update patient
  updatePatient: (id: string, patientData: Partial<Patient>): Promise<Patient> => {
    return apiClient.put<Patient>(`/patients/${id}/`, patientData);
  },

  // Delete patient
  deletePatient: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/patients/${id}/`);
  },
};

// Emergency Calls API (placeholder for when we implement dispatch endpoints)
export const emergencyCallsApi = {
  // Get all emergency calls
  getCalls: (): Promise<{ count: number; results: EmergencyCall[] }> => {
    return apiClient.get<{ count: number; results: EmergencyCall[] }>('/emergency-calls/');
  },

  // Get call by ID
  getCall: (id: string): Promise<EmergencyCall> => {
    return apiClient.get<EmergencyCall>(`/emergency-calls/${id}/`);
  },

  // Create new emergency call
  createCall: (callData: Partial<EmergencyCall>): Promise<EmergencyCall> => {
    return apiClient.post<EmergencyCall>('/emergency-calls/', callData);
  },

  // Update call
  updateCall: (id: string, callData: Partial<EmergencyCall>): Promise<EmergencyCall> => {
    return apiClient.put<EmergencyCall>(`/emergency-calls/${id}/`, callData);
  },

  // Assign ambulance to call
  assignAmbulance: (callId: string, ambulanceId: string): Promise<EmergencyCall> => {
    return apiClient.patch<EmergencyCall>(`/emergency-calls/${callId}/assign/`, {
      ambulanceId,
    });
  },
};

// Trips API (placeholder for when we implement dispatch endpoints)
export const tripsApi = {
  // Get all trips
  getTrips: (): Promise<{ count: number; results: Trip[] }> => {
    return apiClient.get<{ count: number; results: Trip[] }>('/trips/');
  },

  // Get trip by ID
  getTrip: (id: string): Promise<Trip> => {
    return apiClient.get<Trip>(`/trips/${id}/`);
  },

  // Create new trip
  createTrip: (tripData: Partial<Trip>): Promise<Trip> => {
    return apiClient.post<Trip>('/trips/', tripData);
  },

  // Update trip
  updateTrip: (id: string, tripData: Partial<Trip>): Promise<Trip> => {
    return apiClient.put<Trip>(`/trips/${id}/`, tripData);
  },

  // Complete trip
  completeTrip: (id: string): Promise<Trip> => {
    return apiClient.patch<Trip>(`/trips/${id}/complete/`, {});
  },
};
