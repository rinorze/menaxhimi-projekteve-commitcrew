from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def health(request):
    """Is the API up, and which database is it talking to (sqlite or postgresql)?"""
    return Response({'ok': True, 'database': connection.vendor})
