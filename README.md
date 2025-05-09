# A simple 4x4 Slide Puzzle 

This is a recreation of a slide puzzle that used to exist here: https://puzzles.getbackup.tv/

It was implemented in a strange way that I've recreated here.

### Original features include:
* A set scramble that is the same each time
* Tile objects that hold value
* Tile List (TL) where tiles are listed in order after scrambling
  * TL[0] references that top tile after scrambling, this tile can be refered to with TL[0] even after the position changes
* Movement of a tile uses a Tile object reference 
