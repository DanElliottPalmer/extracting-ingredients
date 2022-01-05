<script lang="ts">
  export let ingredients: Array<Ingredient> = [];
</script>

<section>
  <h2>Parsed Ingredients</h2>
  <table class="ingredients-table__table">
    <thead>
      <tr>
        <th>Value</th>
        <th>Unit</th>
        <th>Ingredient</th>
      </tr>
    </thead>
    <tbody>
      {#each ingredients as ingredient (ingredient)}
      <tr>
        <td>{#if ingredient.value}{ingredient.value}{/if}</td>
        <td>{ingredient.unit}</td>
        <td>{ingredient.name}</td>
      </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
  .ingredients-table__table {
    border-collapse: collapse;
    text-align: left;
    width: 100%;
  }

  .ingredients-table__table th,
  .ingredients-table__table td {
    border: 1px solid #ccc;
    padding: .5em;
  }
</style>