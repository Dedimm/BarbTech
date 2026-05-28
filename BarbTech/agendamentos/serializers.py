from rest_framework import serializers
from .models import Usuario, Servico, HorarioTrabalho, Agendamento
from django.utils import timezone
from django.db.models import Q

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'password', 'first_name', 'last_name', 
            'email', 'cpf', 'is_barbeiro', 'telefone', 
            'bio', 'nome_barbearia', 'foto_url', 'banner_url',
            'endereco_rua', 'endereco_numero', 'endereco_cep', 'endereco_bairro', 'endereco_cidade',
            'requer_acessibilidade', 'detalhes_acessibilidade', 'possui_alergia', 'descricao_alergia',
            'atende_domicilio', 'dias_domicilio'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},      
            'first_name': {'required': True}, 
            'last_name': {'required': True}   
        }

    def create(self, validated_data):
        user = Usuario.objects.create_user(**validated_data)
        return user

class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = '__all__'

class HorarioTrabalhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorarioTrabalho
        fields = '__all__'

class AgendamentoSerializer(serializers.ModelSerializer):
    cliente_nome = serializers.ReadOnlyField(source='cliente.get_full_name')
    barbeiro_nome = serializers.ReadOnlyField(source='barbeiro.get_full_name')
    servico_nome = serializers.ReadOnlyField(source='servico.nome')
    data_hora_fim = serializers.ReadOnlyField()

    class Meta:
        model = Agendamento
        fields = [
            'id', 'cliente', 'cliente_nome', 'barbeiro', 'barbeiro_nome', 
            'servico', 'servico_nome', 'data_hora', 'data_hora_fim', 'local', 'status'
        ]

    def validate(self, data):
        """
        Lógica Avançada: Checa sobreposição de horários baseada na duração do serviço.
        """
        barbeiro = data.get('barbeiro')
        inicio_novo = data.get('data_hora')
        servico = data.get('servico')
        
        from datetime import timedelta
        fim_novo = inicio_novo + timedelta(minutes=servico.duracao_minutos)

        # aqui é para nn ter como agendar se ja passou a data
        if inicio_novo < timezone.now():
            raise serializers.ValidationError(
                {"data_hora": "Não é possível agendar um horário que já passou."}
            )

        # para ver se o barbeiro ja ta ocupado no horario
        conflitos = Agendamento.objects.filter(
            barbeiro=barbeiro,
            status='AGENDADO'
        ).filter(
            Q(data_hora__lt=fim_novo) & Q(data_hora_fim__gt=inicio_novo)
        )

        if self.instance:
            conflitos = conflitos.exclude(pk=self.instance.pk)

        if conflitos.exists():
            raise serializers.ValidationError(
                {"data_hora": "Este barbeiro já tem um serviço agendado que termina após esse horário ou começa antes do fim deste."}
            )

        return data