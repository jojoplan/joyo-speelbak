from django.test import TestCase
from parameterized import parameterized

from speels import models


##@isolate_apps('speels')
#class YourTestClass(TestCase):
    #def setUp(self):
        ## Setup run before every test method.
        #pass

    #def tearDown(self):
        ## Clean up run after every test method.
        #pass


class QuestAnswerMT( TestCase ):
  
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        sect = models.Section.objects.create(name='Geography', type='q')
        models.Genre.objects.create(name='General')
        models.Game.objects.create(title='QandA', section=sect).genre.set([1])
        models.Game.objects.create(title='QA2', section=sect).genre.set([1])
  
    def test_name_label(self):
        section = models.Section.objects.get( id=1 )
        field_label = section._meta.get_field('name').help_text
        self.assertEquals( field_label, 'Enter a section to contain games' )

    def test_type_value(self):
        section = models.Section.objects.get( id=1 )
        self.assertEquals( section.type, 'q' )

    def test_name_max_length(self):
        section = models.Section.objects.get( id=1 )
        max_length = section._meta.get_field('name').max_length
        self.assertEquals(max_length, 200)

    def test_object_name_is_name(self):
        section = models.Section.objects.get( id=1 )
        expected_object_name = f'{section.name}'
        self.assertEquals( str(section), expected_object_name )
    
    @parameterized.expand([
        ('absurl title 1', 1, '/speels/game/1', 'QandA'),
        ('absurl_title 2', 2, '/speels/game/2', 'QA2'),
    ])
    def test_qa_serie(self, name, a, b, c):
        game = models.Game.objects.get( id=a )
        self.assertEquals( game.get_absolute_url(), b)
        self.assertEquals( game.title, c )

