# Ambulance Management System (Community)

This is a full-stack ambulance management system with a React frontend and Django backend. The original design is available at https://www.figma.com/design/17OSMiZ4wyo9PZWJAJAQuQ/Ambulance-Management-System--Community-.

## Project Structure

- **Frontend**: React + TypeScript + Vite
- **Backend**: Django + Django REST Framework

## Frontend Setup

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ambulance_backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000/`

## Database Models

The system includes the following models:

- **User** (accounts app): Admin, Dispatcher, Driver, Paramedic roles
- **Ambulance** (ambulances app): Fleet management with location tracking
- **Patient** (patients app): Patient information and medical details
- **EmergencyCall** (dispatch app): Emergency call management and dispatching
- **Trip** (dispatch app): Trip tracking and billing
- **DriverInspection** (reports app): Vehicle inspection reports
- **ParamedicInspection** (reports app): Medical equipment inspection reports
- **MaintenanceRecord** (reports app): Vehicle maintenance tracking
