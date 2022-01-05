const FRACION_ENTITY_TO_ASCII = new Map([
  ["½", "1/2"],
  ["⅓", "1/3"],
  ["⅔", "2/3"],
  ["¼", "1/4"],
  ["¾", "3/4"],
  ["⅕", "1/5"],
  ["⅖", "2/5"],
  ["⅗", "3/5"],
  ["⅘", "4/5"],
  ["⅙", "1/6"],
  ["⅚", "5/6"],
  ["⅐", "1/7"],
  ["⅛", "1/8"],
  ["⅜", "3/8"],
  ["⅝", "5/8"],
  ["⅞", "7/8"],
  ["⅑", "1/9"],
  ["⅒", "1/10"],
]);

function sanitiseFractions(str: string): string {
  let newStr = str.slice(0);
  // ½ cup => 1/2 cup
  for (const [entity, ascii] of FRACION_ENTITY_TO_ASCII.entries()) {
    newStr = newStr.replace(new RegExp(`\\s*${entity}`, "g"), ` ${ascii}`);
  }
  return newStr;
}

function sanitiseWhitespace(str: string): string {
  let newStr = str.slice(0);

  // 1½ cup => 1 ½ cup
  newStr = newStr.replace(/([\d]+)([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒])/g, "$1 $2");

  // 1/4 cup/10 grams => 1/4 cup / 10 grams
  newStr = newStr.replace(/([a-z]+)\/([\d])/gi, "$1 / $2");

  // a word(with badly spaced)parentheses
  newStr = newStr.replace(/([\w])\(([\w])/gi, "$1 ($2");
  newStr = newStr.replace(/([\w])\)([\w])/gi, "$1) $2");

  return newStr;
}

const MEASUREMENT_ABBR = new Map([
  ["teaspoons", "teaspoon"],
  ["tsp.", "teaspoon"],
  ["tsp", "teaspoon"],

  ["tablespoons", "tablespoon"],
  ["tbsp.", "tablespoon"],
  ["tbsp", "tablespoon"],

  ["pounds", "pound"],
  ["lb.", "pound"],
  ["lb", "pound"],

  ["cups", "cup"],
  ["c.", "cup"],
  ["c", "cup"],

  ["ounces", "ounce"],
  ["oz.", "ounce"],
  ["oz", "ounce"],

  ["grams", "gram"],
  ["g.", "gram"],
  ["g", "gram"],

  ["pints", "pint"],
  ["pt.", "pint"],
  ["pt", "pint"],
]);

function sanitiseMeasurements(str: string): string {
  let newStr = str.slice(0);

  let re;
  for (const [find, replace] of MEASUREMENT_ABBR.entries()) {
    re = new RegExp(`([\\d]+)(\\s*${find})([^\\w])`, "gi");
    newStr = newStr.replace(re, `$1 ${replace} $3`);
  }

  // Remove duplicate \s
  newStr = newStr.replace(/\s+/, " ");

  return newStr;
}

function sanitise(str: string): string {
  let newStr = str.slice(0);
  newStr = sanitiseWhitespace(newStr);
  newStr = sanitiseFractions(newStr);
  newStr = sanitiseMeasurements(newStr);
  return newStr.trim();
}

export { sanitise, sanitiseFractions, sanitiseWhitespace };
