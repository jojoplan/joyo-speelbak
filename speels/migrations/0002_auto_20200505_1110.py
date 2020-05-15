# Generated by Django 3.0.5 on 2020-05-05 09:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('speels', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='section',
            name='type',
            field=models.CharField(choices=[('q', 'Question-Answer'), ('l', 'Labyrint')], default='q', help_text='Game type', max_length=1),
        ),
        migrations.CreateModel(
            name='Wall',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x', models.IntegerField()),
                ('y', models.IntegerField()),
                ('distance', models.IntegerField(help_text='Length.')),
                ('direction', models.CharField(choices=[('h', 'Horizontal'), ('v', 'Vertical')], default='h', help_text='horzontal or vertical', max_length=1)),
                ('game', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='speels.Game')),
            ],
        ),
    ]
