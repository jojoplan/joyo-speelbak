from django.db import models
from django.urls import reverse


class Genre(models.Model):
    """Model/Table for a game genre."""
    
    ## Fields ##
    name = models.CharField(max_length=100, help_text='Enter a game genre')
    
    ## Methods ##
    def __str__(self):
        return self.name


class Section(models.Model):
    """Model/Table for a section that has many games."""
    
    ## Fields ##
    name = models.CharField(max_length=200, help_text='Enter a section to contain games')
    
    SECTION_TYPE = (
        ('q', 'Question-Answer'),
        ('l', 'Labyrint'),
        ('s', 'Shape'),
    )

    type = models.CharField(
        max_length=1,
        choices=SECTION_TYPE,
        blank=False,
        default='q',
        help_text='Game type',
    )
    
    ## Methods ##
    def __str__(self):
        return self.name


class Person(models.Model):
    """Model/Table for a person playing games."""
    
    ## Fields ##
    pseudoniem = models.CharField(max_length=60)
    
    ## Methods ##
    def __str__(self):
        return self.pseudoniem



class Game(models.Model):
    """Model/Table for a game."""
    
    ## Fields ##
    title   = models.CharField(max_length=200)
    genre   = models.ManyToManyField(Genre, help_text='Select a genre for this game.', blank=True)
    section = models.ForeignKey(Section, on_delete=models.SET_NULL, null=True)
    
    ## Methods ##
    def get_questions(self):
        """@param Get the questions."""
        return ', '.join(g.question for g in self.item_set.all())

    def get_answers(self):
        return ', '.join(g.answer for g in self.item_set.all().order_by('position'))

    def get_positions(self):
        return [g.position for g in self.item_set.all()]

    def display_genre(self):
        return ', '.join(g.name for g in self.genre.all()[:3])
    display_genre.short_description = 'Genre'
    
    def get_absolute_url(self):
        return reverse('game-board', args=[str(self.id)])
    
    def get_walls_horz(self):
        return '; '.join(f'{w.x},{w.y},{w.distance}' for w in self.wall_set.all().filter(direction__exact='h' ))
    
    def get_walls_vert(self):
        return '; '.join(f'{w.x},{w.y},{w.distance}' for w in self.wall_set.all().filter(direction__exact='v' ))

    def get_laby_url(self):
        return reverse('laby-board', args=[str(self.id)])
    
    def get_pins(self):
        return '; '.join(f'{p.x},{p.y},{p.restart}' for p in self.pin_set.all())
    
    def get_shape_url(self):
        return reverse('shape-board', args=[str(self.id)])
    
    def __str__(self):
        return self.title


class Item(models.Model):
    """Model/Table for items in a question-answer game."""
    
    ## Fields ##
    question = models.CharField(max_length=200)
    answer   = models.CharField(max_length=100)
    position = models.IntegerField()
    game     = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True)
    
    ## Methods ##
    def __str__(self):
        return f'{self.question} {self.answer}'


class Wall(models.Model):
    """Model/Table for walls in a labyrint game."""
    
    ## Fields ##
    x        = models.IntegerField()
    y        = models.IntegerField()
    distance = models.IntegerField(help_text='Length.')
    
    WALL_DIRECTION = (
        ('h', 'Horizontal'),
        ('v', 'Vertical'),
    )

    direction = models.CharField(
        max_length=1,
        choices=WALL_DIRECTION,
        blank=False,
        default='h',
        help_text='horzontal or vertical',
    )

    game     = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True)
    
    ## Methods ##
    def __str__(self):
        return f'{self.x} {self.y}'


class Pin(models.Model):
    """Model/Table for pins of a shape game."""
    
    ## Fields ##
    x        = models.IntegerField()
    y        = models.IntegerField()
    restart  = models.IntegerField(default= 0)

    game     = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True)
    
    ## Methods ##
    def __str__(self):
        return f'{self.x} {self.y}'
