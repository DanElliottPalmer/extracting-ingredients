/// <reference types="svelte" />

interface Ingredient {
  name: string;
  unit: string;
  value: number;
}

// Modelled after Compromise's Term
type Tag = string;
interface Term {
  terms: Array<{
    post: string;
    pre: string;
    tags: Array<Tag>;
    text: string;
  }>;
  text: string;
}

type Terms = Array<Term>;
