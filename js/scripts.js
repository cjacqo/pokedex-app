// IIFE of pokemon data and functions to access/edit pokemon data
let pokemonRespository = (function() {
  // Empty array of pokemon
  const pokemonList = []

  // DOM Element: UL of pokemon
  const pokemonUL = document.getElementById('pokemonList')

  // Show details of pokemon
  function showDetails(obj) {
    console.log(obj)
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

  return {
    // Add function and related methods to create and insert a pokemon object into the pokemonList array
    add: function() {
      // Empty object for pokemon
      const obj = {}

      // Function to throw error if the object's value exists already; checks only DURING creation; does NOT check if the pokemon being inserted into the pokemonList array already exists based on name
      function valueExists(valueType) {
        throw new Error(`${valueType} of Pokemon already exists`)
      }

      // Function to throw error if the parameter passed does not match the required type
      function typeOfError(valueType, requiredType) {
        throw new Error(`${valueType} of Pokemon must be a ${requiredType}`)
      }

      // Check if keys exist in object before insertion into pokemonList array
      function pokemonObjHasKeys() {
        // Empty array of errors
        const errors = []

        // Check for 'name', 'height', and 'types' keys on object
        if (!obj.hasOwnProperty('name')) errors.push('no name')
        if (!obj.hasOwnProperty('height')) errors.push('no height')
        if (!obj.hasOwnProperty('types')) errors.push('no types')
        
        // Check errors array length; if length is 0, return
        if (errors.length === 0) return
        else {
          // Empty error str
          let str = ''
          // Loop over the errors array and append each error to the str variable
          errors.forEach(function(err) {
            str += ' ' + err + '\n'
          })
          // Throw error
          throw new Error(`The pokemon object is missing the following keys:\n${str}`)
        }
      }

      return {
        // Method to insert a name value to the object key of 'name'
        name: function(name) {
          // Check if a name already is set on the object
          if (obj.name != null) valueExists('Name')
          // Check if the parameter passed is a string
          if (typeof name !== 'string') typeOfError('Name', 'string')
          // Assign the 'name' key to the passed value if previous checks passed
          obj.name = name
          // Return this keyword to access local methods within parent function
          return this
        },
        // Method to insert a height value to the object key of 'height'
        height: function(height) {
          // Check if a height already is set on the object
          if (obj.height != null) valueExists('Height')
          // Check if the parameter passed is a number
          if (typeof height !== 'number') typeOfError('Height', 'number')
          // Assign the 'height' key to the passed value if previous checks passed
          obj.height = height
          // Return this keyword to access local methods within parent function
          return this
        },
        // Method to insert multiple types to an array that will be assigned to the object's key of 'type'
        types: function() {
          // Empty array
          const types = []

          // Function to filter the types array to only return unique type values
          function findDuplicates() {
            let uniqueTypes = types.filter((t, i) => {
              return types.indexOf(t) === i
            })
            return uniqueTypes
          }
          
          return {
            bug: function() {
              types.push('bug')
              return this
            },
            dark: function() {
              types.push('dark')
              return this
            },
            dragon: function() {
              types.push('dragon')
              return this
            },
            electric: function() {
              types.push('electric')
              return this
            },
            fairy: function() {
              types.push('fairy')
              return this
            },
            fighting: function() {
              types.push('fighting')
              return this
            },
            fire: function() {
              types.push('fire')
              return this
            },
            flying: function() {
              types.push('flying')
              return this
            },
            ghost: function() {
              types.push('ghost')
              return this
            },
            grass: function() {
              types.push('grass')
              return this
            },
            ground: function() {
              types.push('ground')
              return this
            },
            ice: function() {
              types.push('ice')
              return this
            },
            normal: function() {
              types.push('normal')
              return this
            },
            poison: function() {
              types.push('poison')
              return this
            },
            psychic: function() {
              types.push('psychic')
              return this
            },
            rock: function() {
              types.push('rock')
              return this
            },
            steel: function() {
              types.push('steel')
              return this
            },
            water: function() {
              types.push('water')
              return this
            },
            attachTypes: () => {
              // Handle error if length of types is 0
              if (types.length === 0) throw new Error('Types cannot be empty')
              // Set the object's key of types to a unique array of types value(s)
              obj.types = findDuplicates()
              return this
            }
          }
        },
        // Method to insert the pokemon object into the pokemonList array
        insert: () => {
          // Check if keys exist in object before insertion into pokemonList array
          pokemonObjHasKeys()
          pokemonList.push(obj)
          return
        }
      }
    },
    // Add list item to DOM
    addListItem,
    // Return pokemon object based on name passed in parameter
    findByName: function(name) {
      // Filter the pokemonList array and find pokemon object with same name as parameter; desctructure (unwrap from array) the object if found
      let [obj] = pokemonList.filter(p => {
        return p.name == name
      })
      // Check if a pokemon with that name exists; if FALSE, return string that says it does not exist
      if (obj === null || obj === undefined) return `Pokemon with name '${name}' does not exist`
      // If it does exist, return the object
      else return obj
    },
    // Return pokemonList array
    getAll: function() {
      return pokemonList
    }
  }
})()

// Add: Bulbasaur
pokemonRespository.add()
  .name('Bulbasaur')
  .height(0.7)
  .types().grass().poison().attachTypes()
  .insert()

// Add: Charmander
pokemonRespository.add()
  .name('Charmander')
  .height(0.6)
  .types().fire().attachTypes()
  .insert()

// Add: Machamp
pokemonRespository.add()
  .name('Machamp')
  .height(1.6)
  .types().fighting().attachTypes()
  .insert()

// TEST: testing the findByName method
console.log(pokemonRespository.findByName('Bulbasaur'))

// Loop over list of pokemon to display data of each pokemon
pokemonRespository.getAll().forEach(function(pokemon) {
  pokemonRespository.addListItem(pokemon)
})