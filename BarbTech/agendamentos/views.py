from rest_framework import viewsets, serializers
from django.db.models import Q
from datetime import timedelta
from .models import Usuario, Servico, HorarioTrabalho, Agendamento
from .serializers import *

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer

    def get_queryset(self):
        queryset = Servico.objects.all()
        barbeiro_id = self.request.query_params.get('barbeiro')
        if barbeiro_id:
            queryset = queryset.filter(barbeiro_id=barbeiro_id)
        return queryset


class HorarioTrabalhoViewSet(viewsets.ModelViewSet):
    queryset = HorarioTrabalho.objects.all()
    serializer_class = HorarioTrabalhoSerializer

    def get_queryset(self):
        queryset = HorarioTrabalho.objects.all()
        barbeiro_id = self.request.query_params.get('barbeiro')
        if barbeiro_id:
            queryset = queryset.filter(barbeiro_id=barbeiro_id)
        return queryset


class AgendamentoViewSet(viewsets.ModelViewSet):
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer

    def get_queryset(self):
        queryset = Agendamento.objects.all()
        barbeiro_id = self.request.query_params.get('barbeiro')
        if barbeiro_id:
            queryset = queryset.filter(barbeiro_id=barbeiro_id)
            
        cliente_id = self.request.query_params.get('cliente')
        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)
            
        return queryset

    def perform_create(self, serializer):
        barbeiro = serializer.validated_data.get('barbeiro')
        servico = serializer.validated_data.get('servico')
        data_hora_inicio = serializer.validated_data.get('data_hora')
        data_hora_fim = data_hora_inicio + timedelta(minutes=servico.duracao_minutos)

        conflito = Agendamento.objects.filter(
            barbeiro=barbeiro,
            status='AGENDADO'
        ).filter(
            Q(data_hora__lt=data_hora_fim, data_hora_fim__gt=data_hora_inicio)
        ).exists()

        if conflito:
            raise serializers.ValidationError(
                {"erro": "Slot indisponível."}
            )

        serializer.save()