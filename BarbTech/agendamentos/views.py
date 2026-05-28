from rest_framework import viewsets, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from datetime import timedelta
from .models import Usuario, Servico, HorarioTrabalho, Agendamento
from .serializers import *

import uuid
import requests
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.decorators import action
from rest_framework.response import Response

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # Permite cadastro sem token

    def get_queryset(self):
        queryset = Usuario.objects.all()
        is_barbeiro = self.request.query_params.get('is_barbeiro')
        if is_barbeiro is not None:
            queryset = queryset.filter(is_barbeiro=is_barbeiro.lower() == 'true')
        return queryset

    @action(detail=True, methods=['post'], url_path='upload-foto')
    def upload_foto(self, request, pk=None):
        usuario = self.get_object()
        file_obj = request.FILES.get('foto')
        if not file_obj:
            return Response({'erro': 'Nenhum arquivo enviado.'}, status=400)
        
        url = self._upload_to_supabase_or_local(file_obj, 'avatar')
        usuario.foto_url = url
        usuario.save()
        return Response({'foto_url': url})

    @action(detail=True, methods=['post'], url_path='upload-banner')
    def upload_banner(self, request, pk=None):
        usuario = self.get_object()
        file_obj = request.FILES.get('banner')
        if not file_obj:
            return Response({'erro': 'Nenhum arquivo enviado.'}, status=400)
        
        url = self._upload_to_supabase_or_local(file_obj, 'banner')
        usuario.banner_url = url
        usuario.save()
        return Response({'banner_url': url})

    def _upload_to_supabase_or_local(self, file_obj, prefix):
        ext = file_obj.name.split('.')[-1]
        filename = f"{prefix}_{uuid.uuid4()}.{ext}"
        
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {settings.SUPABASE_KEY}",
                    "apikey": settings.SUPABASE_KEY,
                    "Content-Type": file_obj.content_type or "image/jpeg"
                }
                # Faz o POST para criar o objeto no bucket do Supabase Storage
                response = requests.post(
                    f"{settings.SUPABASE_URL}/storage/v1/object/{settings.SUPABASE_BUCKET}/{filename}",
                    headers=headers,
                    data=file_obj.read()
                )
                if response.status_code == 200:
                    return f"{settings.SUPABASE_URL}/storage/v1/object/public/{settings.SUPABASE_BUCKET}/{filename}"
                else:
                    print(f"Erro Supabase: {response.text}")
            except Exception as e:
                print(f"Erro ao enviar para Supabase: {e}")
        
        path = default_storage.save(f"uploads/{filename}", file_obj)
        request = self.request
        return request.build_absolute_uri(f"/media/{path}")


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


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.CharField(required=False)
        self.fields['email'] = serializers.CharField(required=False)

    def validate(self, attrs):
        email = attrs.get('email')
        username = attrs.get('username')

        if email and not username:
            attrs['username'] = email

        data = super().validate(attrs)
        data['user_id'] = self.user.id
        data['username'] = self.user.username
        data['is_barbeiro'] = self.user.is_barbeiro
        data['email'] = self.user.email
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer