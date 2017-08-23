import util from 'src/util';

import randomColor from 'randomcolor';

const ColorMapper = {
  fandomMap: {},
  characterMap: {},

  getColorForFandom(fandom) {
    if (!this.fandomMap.hasOwnProperty(fandom)) {
      this.fandomMap[fandom] = util.randomColor();
    }
    return this.fandomMap[fandom];
  },

  initializeCharacterColors(character) {
    this.characterMap[character] = {
      rgbArray: randomColor({ format: 'rgbArray', hue: 'cool' }),
      color: util.randomColor()
    };
  },

  getColorForCharacter(character) {
    if (!this.characterMap.hasOwnProperty(character)) {
      this.initializeCharacterColors(character);
    }
    return this.characterMap[character].color;
  },

  getRgbArrayForCharacter(character) {
    if (!this.characterMap.hasOwnProperty(character)) {
      this.initializeCharacterColors(character);
    }
    return this.characterMap[character].rgbArray;
  },

  getColor(category, value) {
    switch (category) {
      case 'characters':
        return this.getColorForCharacter(value);
      case 'fandoms':
        return this.getColorForCharacter(value);
    }
  }
}

export default ColorMapper;
