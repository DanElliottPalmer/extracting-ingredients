<script lang="ts">
  import { extract } from './extract';

  export let onSubmit = () => {};

  function onFormSubmit(){
    let rawIngredients = document.getElementById('txtIngredients').value;
    const lines = rawIngredients.split("\n").map(line => line.trim()).filter((line) => line);

    const ingredients: Array<Ingredient> = lines.map((line) => extract(line)).flat();
    const e = new CustomEvent('submit', {
      detail: { ingredients }
    });
    onSubmit(e);
  }
</script>

<section id="demo">
  <h2>Input</h2>
  <p>Paste in a block of text containing ingredients on each line.</p>
  <p>
    <label for="txtIngredients"><strong>Ingredients:</strong></label>
  </p>
  <textarea class="ingredients-form__textarea" rows="15" id="txtIngredients">2 tsp. sugar, 6 g. and 3 oz for dusting
1 large red onion, chopped into bite-sized pieces
3 mixed peppers, chopped into bite-sized pieces
1 large aubergine, chopped into bite-sized pieces
1 tbsp extra virgin olive oil, plus extra for drizzling
250g/9oz halloumi cheese, sliced
250g / 9oz halloumi cheese, sliced
250g or 9oz halloumi cheese, sliced
small handful fresh basil
freshly ground sea salt and black pepper
1 large butternut squash (about 3 1/2 pounds/1 1/2 kilograms), halved lengthwise and deseeded (stem, base, and skin intact, and one half reserved for later use)
5 large shallots (10 1/2 ounces/300 grams), peeled and halved lengthways
2½ tablespoons olive oil
2 1/2 tablespoons olive oil
1 teaspoon five-spice powder
½ teaspoon ground cinnamon
1/2 teaspoon ground cinnamon
1/2 teaspoon of ground cinnamon
Kosher salt (Diamond Crystal) and black pepper
¾ cup plus 2 tablespoons/200 milliliters chicken stock (or vegetable stock)
¾ cup plus 1 tablespoon/200 milliliters heavy cream (double cream)
3½ ounces/100 grams Gruyère, finely grated
4 to 5 egg yolks (80 grams)
2 garlic cloves, minced
2 teaspoons cornstarch (cornflour)
2 teaspoons white miso
1½ tablespoons white sesame seeds
¾ teaspoon Aleppo pepper
½ teaspoon sweet paprika
⅛ teaspoon five-spice powder
2 tablespoons olive oil
¼ cup/10 grams chives cut in 1/3-inch/1-centimeter pieces
1½ tablespoons lime juice (from 1 lime)
1 large head of iceberg lettuce
¼ cup sliced pickled jalapeños
½ cup basil and/or mint leaves, plus more for serving
8 oz. thinly sliced mortadella, torn into large pieces
Kosher salt, freshly ground pepper
1 lemon
½ cup buttermilk
¼ cup sour cream
¼ cup extra-virgin olive oil
1 garlic clove
1 Tbsp. paprika
2 tsp. kosher salt
½ tsp. freshly ground black pepper
½ tsp. cayenne pepper
2 lb. bone-in beef short ribs or shanks
1 lb. beef stew meat, cut into 1" chunks
2 bay leaves
2 Tbsp. bacon drippings
1 lb. fresh okra, trimmed, cut into ¼" slices
1 cup chopped onion
⅔ cup chopped green bell pepper
⅓ cup chopped celery
1½ cups diced canned tomatoes, undrained
3 garlic cloves, finely chopped
1½ tsp. finely chopped Scotch bonnet pepper
½ tsp. dried thyme
½ lb. crabmeat, picked over (optional)
1 lb. shrimp, peeled, deveined, tails on (optional)
Cooked rice (for serving)
2 firm tart apples (1 pound or 2 454 grams)
1 1/2 cups (6.75 ounces or 195 grams) all-purpose flour
1/4 cup sugar plus 1 1/2 tablespoons for sprinkling (total of 2.2 ounces or 63 grams)
1/2 tablespoon (7 grams) baking powder
1/2 teaspoon salt (3 grams) plus additional for egg wash
6 tablespoons (3 ounces or 85 grams)unsalted butter, chilled and cut into 1/2-inch cubes plus additional for baking sheet if not lining it with parchment
1/2 cup (2.25 ounces or 65 grams) sharp cheddar, shredded (white is recommended, I assume for aesthetics)
1/4 cup (2 ounces) heavy cream
2 large eggs
8 large eggs
3 radishes, trimmed, thinly sliced (optional)
1 cup coarsely chopped tender herbs (such as parsley, chives, and/or dill)
1 tsp. Diamond Crystal or ½ tsp. Morton kosher salt, divided
Juice of 1 lemon
3 scallions
3 Tbsp. extra-virgin olive oil, divided
4 thick slices country-style bread (such as ciabatta or sourdough)
1½ tsp. curry powder (preferably Madras)
½ cup Kewpie mayonnaise
1 Tbsp. Dijon mustard
Flaky sea salt
Aleppo-style pepper (for serving)</textarea>
  <button on:click={onFormSubmit}>Parse</button>
</section>

<style>
  .ingredients-form__textarea {
    display: block;
    font-family: monospace;
    margin: 1em 0;
    width:  100%;
  }
</style>