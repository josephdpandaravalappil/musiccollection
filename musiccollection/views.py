from django.views.generic import View
from django.shortcuts import render


class HomeView(View):
    template_name = 'musiccollection/home.html'

    def get(self, request):
        return render(request, self.template_name)