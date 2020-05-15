from django.contrib import admin
from speels.models import  Section, Genre, Person, Game, Item, Pin, Wall

admin.site.register(Section)
admin.site.register(Genre)
admin.site.register(Person)

class ItemInline(admin.TabularInline):
   model = Item
   extra = 0
   
class PinInline(admin.TabularInline):
   model = Pin
   extra = 0

class WallInline(admin.TabularInline):
   model = Wall
   extra = 0

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
   list_display = ('title', 'section', 'display_genre')
   inlines = [ItemInline, PinInline, WallInline,]
