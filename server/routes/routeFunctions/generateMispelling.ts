const ipaToLatinMap = {
  // Consonants
  p: ['p', 'pp', 'pe', 'gh'],
  b: ['b', 'bb', 'be'],
  t: ['t', 'tt', 'ed', 'th', 'bt'],
  d: ['d', 'dd', 'ed'],
  k: ['k', 'c', 'ck', 'ch', 'qu', 'q', 'cc'],
  ɡ: ['g', 'gg', 'gh', 'gu', 'gue'],
  m: ['m', 'mm', 'mb', 'mn', 'me'],
  n: ['n', 'nn', 'kn', 'gn', 'pn'],
  ŋ: ['ng', 'n', 'nc', 'ngue'],
  f: ['f', 'ff', 'ph', 'gh', 'fe'],
  v: ['v', 'vv', 've', 'f'],
  θ: ['th'],
  ð: ['th', 'the'],
  s: ['s', 'ss', 'c', 'sc', 'ps', 'st', 'ce'],
  z: ['z', 'zz', 's', 'ss', 'x', 'ze'],
  ʃ: ['sh', 'ch', 'ti', 'ci', 's', 'ssi', 'sci'],
  ʒ: ['s', 'si', 'z', 'ge', 'g'],
  h: ['h', 'wh'],
  tʃ: ['ch', 'tch', 't', 'ti', 'tu'],
  dʒ: ['j', 'g', 'ge', 'dge', 'dj', 'di'],
  l: ['l', 'll', 'le'],
  ɹ: ['r', 'rr', 'wr', 'rh'],
  j: ['y', 'i', 'j'],
  w: ['w', 'wh', 'u'],

  // Vowels & Diphthongs
  iː: ['ee', 'ea', 'e', 'ie', 'ei', 'ey', 'i'],
  ɪ: ['i', 'y', 'ui', 'e', 'o'],
  ɛ: ['e', 'ea', 'a', 'ai', 'ie'],
  æ: ['a', 'ai'],
  ɑː: ['a', 'au', 'aw', 'o', 'ear'],
  ɒ: ['o', 'a', 'au', 'ough'],
  ɔː: ['or', 'aw', 'au', 'ore', 'oor', 'al'],
  ʊ: ['u', 'oo', 'ou', 'ould'],
  uː: ['oo', 'u', 'o', 'ew', 'ue', 'ui', 'ou'],
  ʌ: ['u', 'o', 'ou', 'oo'],
  ɜː: ['er', 'ir', 'ur', 'ear', 'or'],
  ə: ['a', 'e', 'i', 'o', 'u', 'er', 'ar'],
  eɪ: ['a', 'ai', 'ay', 'ei', 'ey', 'a_e'],
  aɪ: ['i', 'y', 'igh', 'ie', 'i_e'],
  ɔɪ: ['oi', 'oy'],
  əʊ: ['o', 'oa', 'ow', 'oe', 'o_e'],
  aʊ: ['ou', 'ow', 'ough'],
  ɪə: ['eer', 'ear', 'ere', 'ier'],
  eə: ['air', 'are', 'ear', 'ere'],
  ʊə: ['oor', 'tour', 'ure'],
}

const words = ['hello', 'world', 'typescript', 'javascript']

export function generateMisspelling(word: string): string {
  const wordArray = word.split('')
  const misspelledArray = wordArray.map((letter) => {
    if (!ipaToLatinMap[letter]) {
      return letter
    }
    return ipaToLatinMap[letter][
      Math.floor(Math.random() * ipaToLatinMap[letter].length)
    ]
  })
  return misspelledArray.join('')
}
for (let i = 0; i < 5; i++) {
  console.log(generateMisspelling('sɛks')) // Example usage
}
