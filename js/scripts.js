// List of Pokemon
const pokemonList = [
  {
    name: 'Bulbasaur',
    height: 0.7,
    types: [ 'grass', 'poison' ]
  },
  {
    name: 'Charmander',
    height: 0.6,
    types: [ 'fire' ]
  },
  {
    name: 'Machamp',
    height: 1.6,
    types: [ 'fighting' ]
  }
]

// Loop over list of pokemon to display data of each pokemon
pokemonList.forEach(printPokemon)

// Function used to print data of pokemon object
function printPokemon(pokemon) {
  // Deconstruct the pokemon object being passed
  const { name, height } = pokemon
  
  // Create a string variable of the pokemon's name and height
  let str = `${name}: ${height}`

  // Check if pokemon height is greater than 1: if TRUE, append text to string variable
  if (height > 1) str += ' - Wow, that\'s big!'

  // Print string to page
  document.write(`${str}<br>`)
}