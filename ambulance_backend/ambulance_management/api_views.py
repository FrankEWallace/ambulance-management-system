from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    API Root - Shows available endpoints
    """
    return Response({
        'message': 'Ambulance Management System API',
        'version': '1.0',
        'endpoints': {
            'authentication': {
                'login': '/api/auth/token/',
                'description': 'POST username/password to get token'
            },
            'users': {
                'list': '/api/users/',
                'detail': '/api/users/{id}/',
                'profile': '/api/profile/',
                'description': 'User management endpoints'
            },
            'ambulances': {
                'list': '/api/ambulances/',
                'detail': '/api/ambulances/{id}/',
                'description': 'Ambulance fleet management'
            },
            'patients': {
                'list': '/api/patients/',
                'detail': '/api/patients/{id}/',
                'description': 'Patient management'
            },
            'admin': {
                'url': '/admin/',
                'description': 'Django admin interface'
            }
        },
        'authentication': {
            'type': 'Token',
            'header': 'Authorization: Token <your-token-here>'
        }
    })
