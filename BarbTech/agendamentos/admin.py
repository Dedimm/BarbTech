from django.contrib import admin
from .models import Usuario, Servico, HorarioTrabalho, Agendamento

admin.site.register(Usuario)
admin.site.register(Servico)
admin.site.register(HorarioTrabalho)
admin.site.register(Agendamento)