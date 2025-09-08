from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from accounts.models import User
from ambulances.models import Ambulance
from patients.models import Patient

class Command(BaseCommand):
    help = 'Populate database with sample data based on mockData.ts'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create users (based on mockUsers)
        users_data = [
            {
                'username': 'admin',
                'first_name': 'John',
                'last_name': 'Admin',
                'email': 'admin@ams.com',
                'role': 'admin',
                'phone': '+1234567890',
                'password': 'admin123'
            },
            {
                'username': 'dispatcher',
                'first_name': 'Sarah',
                'last_name': 'Dispatcher',
                'email': 'dispatcher@ams.com',
                'role': 'dispatcher',
                'phone': '+1234567891',
                'password': 'dispatcher123'
            },
            {
                'username': 'driver',
                'first_name': 'Mike',
                'last_name': 'Driver',
                'email': 'driver@ams.com',
                'role': 'driver',
                'phone': '+1234567892',
                'password': 'driver123'
            },
            {
                'username': 'paramedic',
                'first_name': 'Dr. Lisa',
                'last_name': 'Paramedic',
                'email': 'paramedic@ams.com',
                'role': 'paramedic',
                'phone': '+1234567893',
                'password': 'paramedic123'
            }
        ]
        
        created_users = {}
        for user_data in users_data:
            password = user_data.pop('password')
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            if created:
                user.set_password(password)
                user.save()
                self.stdout.write(f'Created user: {user.username}')
            created_users[user_data['role']] = user
        
        # Create ambulances (based on mockAmbulances)
        ambulances_data = [
            {
                'vehicle_number': 'AMB-001',
                'license_number': 'ABC123',
                'model': 'Mercedes Sprinter',
                'year': 2022,
                'status': 'available',
                'latitude': 40.7128,
                'longitude': -74.0060,
                'last_maintenance': date(2024, 7, 15),
                'next_maintenance': date(2024, 10, 15),
                'insurance_expiry': date(2025, 3, 20),
                'equipment': ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit']
            },
            {
                'vehicle_number': 'AMB-002',
                'license_number': 'DEF456',
                'model': 'Ford Transit',
                'year': 2021,
                'status': 'en_route',
                'latitude': 40.7589,
                'longitude': -73.9851,
                'last_maintenance': date(2024, 6, 20),
                'next_maintenance': date(2024, 9, 20),
                'insurance_expiry': date(2025, 1, 15),
                'equipment': ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit', 'Ventilator']
            },
            {
                'vehicle_number': 'AMB-003',
                'license_number': 'GHI789',
                'model': 'Chevrolet Express',
                'year': 2020,
                'status': 'maintenance',
                'latitude': 40.7282,
                'longitude': -73.7949,
                'last_maintenance': date(2024, 8, 1),
                'next_maintenance': date(2024, 11, 1),
                'insurance_expiry': date(2024, 12, 30),
                'equipment': ['Defibrillator', 'Oxygen Tank', 'Stretcher', 'First Aid Kit']
            }
        ]
        
        created_ambulances = []
        for amb_data in ambulances_data:
            ambulance, created = Ambulance.objects.get_or_create(
                vehicle_number=amb_data['vehicle_number'],
                defaults=amb_data
            )
            if created:
                self.stdout.write(f'Created ambulance: {ambulance.vehicle_number}')
            created_ambulances.append(ambulance)
        
        # Assign staff to ambulances
        if 'driver' in created_users and 'paramedic' in created_users:
            created_ambulances[0].assigned_driver = created_users['driver']
            created_ambulances[0].assigned_paramedic = created_users['paramedic']
            created_ambulances[0].save()
            
            created_ambulances[1].assigned_driver = created_users['driver']
            created_ambulances[1].save()
        
        # Create patients (based on mockPatients)
        patients_data = [
            {
                'name': 'Robert Johnson',
                'age': 65,
                'gender': 'male',
                'phone': '+1555111222',
                'medical_condition': 'Cardiac arrest',
                'allergies': ['Penicillin'],
                'medications': ['Aspirin', 'Metoprolol'],
                'emergency_contact_name': 'Mary Johnson',
                'emergency_contact_phone': '+1555333444',
                'emergency_contact_relation': 'Wife',
                'pickup_latitude': 40.7505,
                'pickup_longitude': -73.9934,
                'pickup_address': '123 Main St, New York, NY 10001',
                'destination_latitude': 40.7794,
                'destination_longitude': -73.9632,
                'destination_address': '1234 Hospital Dr, New York, NY 10021',
                'hospital_name': 'NYC General Hospital'
            },
            {
                'name': 'Alice Brown',
                'age': 45,
                'gender': 'female',
                'phone': '+1555555666',
                'medical_condition': 'Post-surgery transfer',
                'allergies': [],
                'medications': ['Ibuprofen'],
                'emergency_contact_name': 'Tom Brown',
                'emergency_contact_phone': '+1555777888',
                'emergency_contact_relation': 'Husband',
                'pickup_latitude': 40.7614,
                'pickup_longitude': -73.9776,
                'pickup_address': '789 Hospital Ave, New York, NY 10019',
                'destination_latitude': 40.7282,
                'destination_longitude': -73.7949,
                'destination_address': '456 Recovery Center, Queens, NY 11368',
                'hospital_name': 'Queens Recovery Center'
            }
        ]
        
        for patient_data in patients_data:
            patient, created = Patient.objects.get_or_create(
                name=patient_data['name'],
                defaults=patient_data
            )
            if created:
                self.stdout.write(f'Created patient: {patient.name}')
        
        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data!'))
