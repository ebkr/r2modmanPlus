# Adding a game

If the game uses a mod loader that is already supported, adding a game is easy:

1. Follow the [documentation](https://github.com/thunderstore-io/ecosystem-schema/blob/master/games/ADD_GAME.md) to get the game added to Thunderstore ecosystem.
2. Update the local schema from Thunderstore API by running `yarn run sync`.
3. Add game image to `src/assets/images/game_selection/`.
  - webp format
  - 360x480px
  - filename should match the one defined in `ecosystem.json`
4. Test manually that the app starts and the game can be launched via mod manager.

Adding support for a new mod loader requires more effort and should be discussed in advance. A good place for this discussion is the game addition request on Thunderstore's Discord (see the documentation linked above).
