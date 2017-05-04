# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import datetime

from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout

from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from musiccollection.pagination import CustomPagination
from forms import UserCreationForm


#User Login
class UserLoginView(CustomPagination):
    """
    Create/ login users
    """

    authentication_classes = (BasicAuthentication, SessionAuthentication,)
    # Check permissions for read-only request

    def post(self, request):
        if 'signup' in request.data:
            #Signup
            form = UserCreationForm(request.data)
            if form.is_valid():
                new_user = form.save()
                new_user = authenticate(
                	username=request.data['username'],
                    password=request.data['password'],
                )
                login(request, new_user)
                return Response({'id': new_user.id, 
                                 'username': new_user.username,
                                 'token': new_user.auth_token.key})
            else:
                return Response({'errors': form.errors, "status": status.HTTP_400_BAD_REQUEST})
        else:
            #SingIn
            username = request.data['username']
            password = request.data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return Response({'id': user.id, 
                                     'username': user.username,
                                     'token': user.auth_token.key})
                else:
                    # Return a 'disabled account' error message
                    return Response({'errors': form.errors})
            else:

            	return Response({'errors': "Incorrect username or password","status" :status.HTTP_400_BAD_REQUEST})

