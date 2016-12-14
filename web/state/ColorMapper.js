import util from 'src/util';

const ColorMapper = {
  fandomMap: {},
  characterMap: {},

  getColorForFandom(fandom) {
    if (!this.fandomMap.hasOwnProperty(fandom)) {
      this.fandomMap[fandom] = util.randomColor();
    }
    return this.fandomMap[fandom];
  },

  getColorForCharacter(character) {
    if (!this.characterMap.hasOwnProperty(character)) {
      this.characterMap[character] = util.randomColor();
    }
    return this.characterMap[character];
  }
}

export default ColorMapper;
