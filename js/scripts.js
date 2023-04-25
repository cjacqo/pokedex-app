// IIFE of modal display and events
let Modals = (function() {
  let modalContainer = document.querySelector('#modal-container')

  function showModal(pokemon) {
    // Clear existing modal content
    modalContainer.innerHTML = ''

    let modal = document.createElement('div')
    modal.classList.add('modal')

    // Add the new modal content
    let closeBtnElement = document.createElement('button')
    closeBtnElement.classList.add('modal-close')
    closeBtnElement.innerText = 'Close'

    let titleElement = document.createElement('h1')
    titleElement.innerText = 'Modal Title'

    let contentElement = document.createElement('p')
    contentElement.innerText = 'Modal text...'

    modal.appendChild(closeBtnElement)
    modal.appendChild(titleElement)
    modal.appendChild(contentElement)
    modalContainer.appendChild(modal)

    modalContainer.classList.add('is-visible')
  }

  return {
    show: showModal
  }
})()

// IIFE for creating pokemon cards
let PokemonDOMFactory = (function() {

})()

// IIFE of pokemon data and functions to access/edit pokemon data
let PokemonRespository = (function() {
  // Empty array of pokemon
  const pokemonList = []
  // API URL
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'

  // DOM Element: UL of pokemon
  const pokemonUL = document.getElementById('pokemonList')

  // Load list of pokemon from API
  function loadList() {
    return fetch(apiUrl).then(function(response) {
      return response.json()
    }).then(function(json) {
      json.results.forEach(function(item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        }
        addPokemon(pokemon)
      })
    }).catch(function(e) {
      console.error(e)
    })
  }

  // Load details of pokemon
  function loadDetails(item) {
    let url = item.detailsUrl
    return fetch(url).then(function(response) {
      return response.json()
    }).then(function(details) {
      // Now add the details to the item
      item.imageUrl = details.sprites.front_default
      item.height = details.height
      item.types = details.types
    }).catch(function(e) {
      console.log(e)
    })
  }

  // Show details of pokemon
  function showDetails(obj) {
    loadDetails(obj).then(function() {
      Modals.show(obj)
    })
  }

  // Add list item to DOM
  function addListItem(obj) {
    // Deconstruct the pokemon object being passed
    const { name } = obj

    // Create a li element and a button element
    const listItem = document.createElement('li')
    const button = document.createElement('button')
    button.innerText = name
    button.classList.add('pokemon-button')
    button.setAttribute('data-pokemon', name)

    // Add event listener to button element
    button.addEventListener('click', function() {
      showDetails(obj)
    })
    
    // Append the button to the li element
    listItem.appendChild(button)
    
    // Append the li element and it's child element (button) to the ul
    pokemonUL.appendChild(listItem)
  }

  // New add pokemon function; no chaining; simply push pokemon object to array
  function addPokemon(obj) {
    pokemonList.push(obj)
  }

  // Return pokemon object based on name passed in parameter
  function findByName(name) {
    console.log(pokemonList)
    // Filter the pokemonList array and find pokemon object with same name as parameter; desctructure (unwrap from array) the object if found
    let [obj] = pokemonList.filter(p => {
      return p.name == name
    })
    // Check if a pokemon with that name exists; if FALSE, return string that says it does not exist
    if (obj === null || obj === undefined) return `Pokemon with name '${name}' does not exist`
    // If it does exist, return the object
    else return obj
  }

  // Return pokemonList array
  function getAll() {
    return pokemonList
  }

  return {
    // Add pokemon to list
    addPokemon,
    // Add list item to DOM
    addListItem,
    // Return pokemon object based on name passed in parameter
    findByName,
    // Return pokemonList array
    getAll,
    // Load list of pokemon
    loadList
  }
})()

PokemonRespository.loadList().then(function() {
  // Now the data is loaded!
  PokemonRespository.getAll().forEach(function(pokemon) {
    PokemonRespository.addListItem(pokemon)
  })
})

// TEST: testing the findByName method
setTimeout(function() {
  console.log(PokemonRespository.findByName('bulbasaur'))
}, 200)

// Loop over list of pokemon to display data of each pokemon
// PokemonRespository.getAll().forEach(function(pokemon) {
//   PokemonRespository.addListItem(pokemon)
// })