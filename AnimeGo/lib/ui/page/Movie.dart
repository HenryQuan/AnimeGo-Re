import 'package:AnimeGo/ui/widget/AnimeGrid.dart';
import 'package:flutter/material.dart';

/// Movie class
class Movie extends StatelessWidget {
  Movie({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Movie')
      ),
      body: AnimeGrid(url: '/anime-movies.html'),
    );
  }
}
