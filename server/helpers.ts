import * as fs from 'fs';

const words = fs
  .readFileSync('./words.txt', 'utf8')
  .replace(/(\r\n|\n|\r)/gm, ' ')
  .split(' ');
function generateUsername(): string {
  const getWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    return word.charAt(0).toUpperCase() + word.substring(1, word.length);
  };

  return getWord() + getWord() + Math.floor(Math.random() * 10);
}

export { generateUsername };
