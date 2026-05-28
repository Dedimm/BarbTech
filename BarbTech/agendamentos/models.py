from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta

# parte de usuario carlos
class Usuario(AbstractUser):
    is_barbeiro = models.BooleanField(default=False)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    cpf = models.CharField(max_length=14, unique=True, blank=True, null=True)
    
    # perfil
    bio = models.TextField(max_length=500, blank=True, null=True)
    nome_barbearia = models.CharField(max_length=100, blank=True, null=True)
    foto_url = models.URLField(max_length=500, blank=True, null=True) 
    banner_url = models.URLField(max_length=500, blank=True, null=True)

    # endereço
    endereco_rua = models.CharField(max_length=255, blank=True, null=True)
    endereco_numero = models.CharField(max_length=20, blank=True, null=True)
    endereco_cep = models.CharField(max_length=20, blank=True, null=True)
    endereco_bairro = models.CharField(max_length=100, blank=True, null=True)
    endereco_cidade = models.CharField(max_length=100, blank=True, null=True)

    # condições especiais (cliente)
    requer_acessibilidade = models.BooleanField(default=False)
    detalhes_acessibilidade = models.TextField(blank=True, null=True)
    possui_alergia = models.BooleanField(default=False)
    descricao_alergia = models.TextField(blank=True, null=True)

    # atendimento domiciliar (profissional)
    atende_domicilio = models.BooleanField(default=False)
    dias_domicilio = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        nome = f"{self.first_name} {self.last_name}".strip()
        return nome if nome else self.username

# aqui faz com que cada barbeiro tenha serviços proprios
class Servico(models.Model):
    barbeiro = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='meus_servicos', null=True)
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=8, decimal_places=2)
    duracao_minutos = models.IntegerField(default=30) 

    def __str__(self):
        return f"{self.nome} ({self.barbeiro.first_name if self.barbeiro else 'Geral'})"

# horario de trabalho
class HorarioTrabalho(models.Model):
    DIAS = [
        (0, 'Segunda'), (1, 'Terça'), (2, 'Quarta'),
        (3, 'Quinta'), (4, 'Sexta'), (5, 'Sábado'), (6, 'Domingo')
    ]
    barbeiro = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='horarios_trabalho')
    dia_semana = models.IntegerField(choices=DIAS)
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()

    def __str__(self):
        return f"{self.barbeiro.get_full_name()} - {self.get_dia_semana_display()}"

# agendamento
class Agendamento(models.Model):
    LOCAIS = [('BARBEARIA', 'Na Barbearia'), ('DOMICILIO', 'A Domicílio')]
    
    STATUS_CHOICES = [
        ('AGENDADO', 'Agendado'),
        ('CANCELADO', 'Cancelado'),
        ('CONCLUIDO', 'Concluído'),
    ]
    
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='meus_agendamentos')
    barbeiro = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='agendamentos_recebidos')
    servico = models.ForeignKey(Servico, on_delete=models.CASCADE)
    
    data_hora = models.DateTimeField() 
    data_hora_fim = models.DateTimeField(blank=True, null=True) 
    
    local = models.CharField(max_length=10, choices=LOCAIS, default='BARBEARIA')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='AGENDADO')

    def save(self, *args, **kwargs):
        # deixei definido o tempo de alguns serviços isso faz a conta direto
        if self.data_hora and self.servico:
            self.data_hora_fim = self.data_hora + timedelta(minutes=self.servico.duracao_minutos)
        super().save(*args, **kwargs)

    class Meta:
        pass

    def __str__(self):
        return f"{self.data_hora.strftime('%d/%m %H:%M')} - {self.cliente.first_name} (Barbeiro: {self.barbeiro.first_name})"