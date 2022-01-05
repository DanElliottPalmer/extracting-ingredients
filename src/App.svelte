<script lang="ts">
	import Nav from './Nav.svelte';
	import Body from './Body.svelte';
	import IngredientsForm from './IngredientsForm.svelte';
	import IngredientsTable from './IngredientsTable.svelte';

	let ingredients: Array<Ingredient> = [];

	function onFormSubmit(e){
		ingredients = e.detail.ingredients;
	}
</script>

<main>
	<Nav />
	<h1>Extracting Ingredients</h1>
	<p><strong>Just take me to the <a href="#demo">demo</a>.</strong></p>
	<Body />
	<hr />
	<IngredientsForm onSubmit={onFormSubmit} />
	<hr />
	<IngredientsTable ingredients={ingredients} />
	<hr />
	<h2>TODO / TOFIX</h2>
	<ul>
		<li>Trim crap in parenthesis</li>
		<li>Handle multiple ingredients in one line</li>
	</ul>
</main>

<style global>
	html {
		background-color: #2a363b;
		background: linear-gradient(180deg, rgba(55,69,75,1) 0%, rgba(42,54,59,1) 100%) fixed;
		color: #fecea8;
	}

	a, a:visited {
		color: #ff847c;
		font-weight: bold;
		text-decoration: underline;
	}
	a:hover {
		color: #e84a5f;
		text-decoration-style: wavy;
	}

	hr {
		border-color: #fecea8;
		border-style: dashed;
	}
	
	main {
		font-family: arial, sans-serif;
		margin: 0 auto;
		max-width: 540px;
		padding: 1em;
	}
</style>