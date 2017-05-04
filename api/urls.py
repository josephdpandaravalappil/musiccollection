from django.conf.urls import url
from api.views import UserLoginView


urlpatterns = [
   url(r'^users/login$', UserLoginView.as_view(), name='api_login'),
]
