from django.urls import path, re_path
from speels import views

"""
Some nice text about the urls.
------------------------------
And more.
"""
urlpatterns = [
    path('', views.index, name='index'),
    path('games/', views.GameListView.as_view(), name='games'),
    path('labys/', views.LabyListView.as_view(), name='labys'),
    path('shapes/', views.ShapeListView.as_view(), name='shapes'),
]

urlpatterns += [
    path('game/<int:pk>/checkresults/', views.game_check_results, name='checkresults'),
    re_path(r'^game/(?P<pk>\d+)$', views.GameDetailView.as_view(), name='game-board'),
    path('laby/<int:pk>', views.LabyDetailView.as_view(), name='laby-board'),
    path('shape/<int:pk>', views.ShapeDetailView.as_view(), name='shape-board'),
]
