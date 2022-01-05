import compromise from "compromise";
import { sanitise } from "./sanitise";

interface ExtractedValues {
  endIndex: number;
  terms: Terms;
}

const isAdjectiveTag = (tag: Tag): boolean => tag === "Adjective";
const isAdverbTag = (tag: Tag): boolean => tag === "Adverb";
const isNounTag = (tag: Tag): boolean => tag === "Noun";
const isNumericValueTag = (tag: Tag): boolean => tag === "NumericValue";
const isPrepositionTag = (tag: Tag): boolean => tag === "Preposition";
const isTextValueTag = (tag: Tag): boolean => tag === "TextValue";
const isUnitTag = (tag: Tag): boolean => tag === "Unit";
const isVerbTag = (tag: Tag): boolean => tag === "Verb";

const isIngredientTag = (tag: Tag): boolean =>
  isNounTag(tag) ||
  isAdjectiveTag(tag) ||
  isAdverbTag(tag) ||
  isVerbTag(tag) ||
  isTextValueTag(tag) ||
  isPrepositionTag(tag);

function getDocumentTerms(line: string): Terms {
  const sanitisedLine = sanitise(line);
  const doc = compromise(sanitisedLine);
  const terms = doc.terms().json();

  // console.group("Terms");
  // console.log("Line", line);
  // console.log("Sanitised", sanitisedLine);
  // console.log("Terms", terms);
  // console.groupEnd();

  return terms;
}

function extractUnitValue(
  terms: Terms,
  startIndex: number = 0,
  endIndex: number = terms.length - 1
): ExtractedValues {
  let term: Term;
  let tags: Array<Tag>;
  let hasNumericTag: boolean = false;
  let sliceStartIndex: number = -1;
  let sliceEndIndex: number = startIndex;
  let unitValueTerms: Terms = [];

  for (let i = startIndex; i <= endIndex; i++) {
    term = terms[i];
    tags = term.terms[0].tags;
    hasNumericTag = tags.some((tag) => isNumericValueTag(tag));

    if (hasNumericTag && sliceStartIndex === -1) {
      sliceStartIndex = i;
      continue;
    } else if (!hasNumericTag && sliceStartIndex > -1) {
      sliceEndIndex = i;
      unitValueTerms = terms.slice(sliceStartIndex, sliceEndIndex);
      break;
    }
  }

  return {
    endIndex: sliceEndIndex,
    terms: unitValueTerms,
  };
}

function extractUnit(
  terms: Terms,
  startIndex: number = 0,
  endIndex: number = terms.length - 1
): ExtractedValues {
  let term: Term;
  let tags: Array<Tag>;
  let hasUnitTag: boolean = false;
  let sliceStartIndex: number = -1;
  let sliceEndIndex: number = startIndex;
  let unitTerms: Terms = [];

  for (let i = startIndex; i <= endIndex; i++) {
    term = terms[i];
    tags = term.terms[0].tags;
    hasUnitTag = tags.some((tag) => isUnitTag(tag));

    if (hasUnitTag && sliceStartIndex === -1) {
      sliceStartIndex = i;
      continue;
    } else if (!hasUnitTag && sliceStartIndex > -1) {
      sliceEndIndex = i;
      unitTerms = terms.slice(sliceStartIndex, sliceEndIndex);
      break;
    }
  }

  return {
    endIndex: sliceEndIndex,
    terms: unitTerms,
  };
}

function extractIngredient(
  terms: Terms,
  startIndex: number = 0,
  endIndex: number = terms.length - 1
): ExtractedValues {
  // We iterate twice through the terms. First loop we are trying to find the
  // last noun we care about. The second loop we work backwards from that noun
  // including other nouns or adjectives (and other types) as they might be
  // describing the noun.

  let term: Term;
  let tags: Array<Tag>;
  let sliceStartIndex: number = -1;
  let sliceEndIndex: number = -1;
  let ingredientsTerms: Terms = [];

  for (let i = startIndex; i <= endIndex; i++) {
    term = terms[i];
    tags = term.terms[0].tags;

    // Ignore slashes or words that are prepositions
    if (term.text === "/" || tags.some((tag) => isPrepositionTag(tag))) {
      continue;
    }

    // Find a noun tag but not a unit tag
    if (
      tags.some((tag) => isNounTag(tag)) &&
      !tags.some((tag) => isUnitTag(tag))
    ) {
      sliceStartIndex = i;
      sliceEndIndex = i;
      continue;
    }

    if (sliceEndIndex > -1) break;
  }

  // If we found a noun, extract it out with all descriptions before
  if (sliceEndIndex > -1) {
    for (let i = sliceEndIndex - 1; i >= startIndex; i--) {
      term = terms[i];
      tags = term.terms[0].tags;

      if (
        !tags.some((tag) => isUnitTag(tag)) &&
        tags.some((tag) => isIngredientTag(tag))
      ) {
        sliceStartIndex = i;
        continue;
      }
      break;
    }

    // If the first term is a preposition, trim it
    if (
      terms[sliceStartIndex].terms[0].tags.some((tag) => isPrepositionTag(tag))
    ) {
      sliceStartIndex++;
    }

    ingredientsTerms = terms.slice(sliceStartIndex, sliceEndIndex + 1);
  }

  return {
    endIndex: sliceEndIndex,
    terms: ingredientsTerms,
  };
}

function parseStringValueToNumber(str: string): number {
  if (!str) return NaN;

  const valueParts: Array<string> = str.split(" ");
  const values: Array<number> = valueParts.map((value: string): number => {
    if (value.includes("/")) {
      const [numerator, denominator] = value.split("/");
      return parseInt(numerator, 10) / parseInt(denominator, 10);
    } else {
      return parseFloat(value);
    }
  });
  return values.reduce((acc: number, value: number) => acc + value, 0);
}

function flattenTerms(terms: Terms): string {
  const flattenedValue = terms
    .flatMap((term: Term): string => {
      const termToken = term.terms[0];
      return `${termToken.pre}${termToken.text}${termToken.post}`;
    })
    .join("");
  return flattenedValue.trim();
}

function createIngredient(
  unitValue: Terms,
  unit: Terms,
  ingredient: Terms
): Ingredient {
  // Trim whitespace and remove any garbage off the start or end of the
  // ingredient
  const ingredientName = flattenTerms(ingredient)
    .replace(/^[^\w]/i, "")
    .replace(/[^\w]$/i, "")
    .trim();

  let value: number = parseStringValueToNumber(flattenTerms(unitValue));
  if (isNaN(value)) value = undefined;

  return {
    name: ingredientName,
    unit: flattenTerms(unit),
    value,
  };
}

function extract(line: string): Array<Ingredient> {
  const terms: Terms = getDocumentTerms(line);

  let unitValueTerms: Terms;
  let unitTerms: Terms;
  let ingredientsTerms: Terms;
  let startIndex: number = 0;
  let endIndex: number = 0;

  ({ endIndex: startIndex, terms: unitValueTerms } = extractUnitValue(
    terms,
    0
  ));
  ({ endIndex, terms: ingredientsTerms } = extractIngredient(
    terms,
    startIndex
  ));
  ({ terms: unitTerms } = extractUnit(terms, startIndex, endIndex));

  // console.log(unitValueTerms);
  // console.log(unitTerms);
  // console.log(ingredientsTerms);

  // TODO: multiple ingredients in one line
  return [createIngredient(unitValueTerms, unitTerms, ingredientsTerms)];
}

export { extract };
