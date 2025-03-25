from django.urls import path
from .views import UserList, GroupList, UserDetails


urlpatterns = [
    path('users/', UserList.as_view()),
    path('users/<pk>/', UserDetails.as_view()),
    path('groups/', GroupList.as_view()),
    # ...
]
