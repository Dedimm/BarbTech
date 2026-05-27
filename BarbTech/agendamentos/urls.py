from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'servicos', ServicoViewSet)
router.register(r'horarios-trabalho', HorarioTrabalhoViewSet)
router.register(r'agendamentos', AgendamentoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]