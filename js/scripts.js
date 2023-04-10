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
for (let i = 0; i < pokemonList.length; i++) {
  const { name, height } = pokemonList[i]
  document.write(`${name}: ${height} <br>`)
}