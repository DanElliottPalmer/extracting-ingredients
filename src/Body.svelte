<section>
  <h2>Introduction</h2>
  <p>Over the last two years (2020 - 2021), I have become more interested with baking and cooking, but more on the baking side. However I've noticed that I've become mildly infuriated with having to constantly convert ingredient measurements to something sensible (CUPS IS NOT SENSIBLE!).</p>
  <p>I would like to create a single page application that allows me to paste in my list of ingredients and then very easily convert it to other measurements, merge items and cross them off as I shop. If I can at least get 80% accuracy, I will be happy.</p>
  <p>Step one of this problem is the ability to extract out a value, unit and ingredient. <strong>This is step one.</strong></p>
  <hr />
  <h2>Method</h2>
  <p>Recipe ingredients in English typically follow these patterns:</p>
  <ul>
    <li>Ingredient</li>
    <li>Value ingredient</li>
    <li>Value unit ingredient</li>
  </ul>
  <p>However there are a lot of variations based on each of these values. The ingredient could include adjectives (fresh basil). The value might be a decimal or contain fraction symbols. And units might be written as an abbreviations (tsp for teaspoons, c. for cups).</p>
  <p>The first problem we attempt to solve is sanitisation of the input content. This replaces fraction entities with written slashes, and tidies up units and whitespace.</p>
  <pre><code>
2½ c. sugar -> 2 1/2 cup sugar
  </code></pre>
  <p>The second problem attempts to use <a href="https://en.wikipedia.org/wiki/Natural_language_processing">natural language processing</a> to identify the type of words in an ingredient line.</p>
  <p>To help us, we can use <a href="https://compromise.cool">compromise</a>. This attaches <a href="https://observablehq.com/@spencermountain/compromise-tags">different tags</a> to each word, that we can then use to identify what part is a value, unit and ingredient.</p>
  <pre><code>
{`
[
  {
    text: "2",
    terms: [
      {
        text: "2",
        tags: ["Cardinal", "Value", "NumericValue"],
        pre: "",
        post: " ",
      },
    ],
  },
  {
    text: "1/2",
    terms: [
      {
        text: "1/2",
        tags: ["Fraction", "Value", "NumericValue"],
        pre: "",
        post: " ",
      },
    ],
  },
  {
    text: "cup",
    terms: [
      {
        text: "cup",
        tags: ["Abbreviation", "Unit", "Noun", "Singular"],
        pre: "",
        post: "  ",
      },
    ],
  },
  {
    text: "sugar",
    terms: [
      {
        text: "sugar",
        tags: ["Uncountable", "Noun"],
        pre: "",
        post: ""
      },
    ],
  },
]
`}
  </code></pre>
</section>