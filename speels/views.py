from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse
#from django.utils.translation import activate

from speels.models import Genre, Game, Section, Item, Person


def index(request):
    """View for home page of this site."""
    
    #activate('de')
    
    #- Generate counts.
    num_sections = Section.objects.all().count()
    num_games    = Game.objects.all().count()
    num_genres   = Genre.objects.all().count()
   
    context = {
        'num_sections': num_sections,
        'num_games': num_games,
        'num_genres': num_genres,
    }
   
    #- Render template index.html with the data in context.
    return render(request, 'speels/index.html', context=context)


def game_check_results(request, pk):
    if request.is_ajax():
        rcv = request.GET.getlist('results[]')
        pos = Game.objects.get(id=pk).get_positions()
        rv =[]
        if (len(rcv) == len(pos)):
            for i in range(len(pos)):
                if (int(rcv[i]) + 1 == pos[i]):
                    rv.append(1)
                else:
                    rv.append(0)
        else:
            rv.append(-1)
        return HttpResponse(rv)
    else:
        html = '<p>This is not ajax.</p>'
        return HttpResponse(html)


class GameListView(generic.ListView):
    """Overview of question-answer games."""
    model = Game
    template_name = 'speels/game_list.html'

    def get_queryset(self):
        """Return only the question-answer games."""
        return Game.objects.filter(section__type__exact='q' )

class GameDetailView(generic.DetailView):
    """Details about one question-answer game."""
    model = Game
    template_name = 'speels/game_board.html'


class LabyListView(generic.ListView):
    """Overview of labyrint games."""
    model = Game
    template_name = 'speels/laby_list.html'

    def get_queryset(self):
        """Return only the labyrint games."""
        return Game.objects.filter(section__type__exact='l' )

class LabyDetailView(generic.DetailView):
    """Details about one labyrint game."""
    model = Game
    template_name = 'speels/laby_board.html'


class ShapeListView(generic.ListView):
    """Overview of Shape games."""
    model = Game
    template_name = 'speels/shape_list.html'

    def get_queryset(self):
        """Return only the shape games."""
        return Game.objects.filter(section__type__exact='s' )

class ShapeDetailView(generic.DetailView):
    model = Game
    template_name = 'speels/shape_board.html'


