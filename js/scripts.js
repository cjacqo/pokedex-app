// IIFE for creating pokemon cards
let PokemonDOMFactory = (function() {

  // DOM Element: Container of Pokemon
  const pokemonCardsContainer = document.getElementById('pokemonCardsContainer')

  // IIFE for string helpers
  const StrHelpers = (function() {
    // Capitalize String Helper
    const capitalizeWord = str => str.charAt(0).toUpperCase() + str.slice(1)

    // Get KG Str
    const getKGStr = num => {
      const numArr = num.toString().split('')
      if (numArr.length === 1) return `0.${numArr[0]} kg`
      let kgStr = numArr.shift() + '.'
      numArr.forEach(num => kgStr += num)
      return kgStr + ' kg'
    }

    // Get Meter Str
    const getMeterStr = num => {
      const numArr = num.toString().split('')
      if (numArr.length === 1) return `0.${numArr[0]} m`
      let meterStr = numArr.shift() + '.'
      numArr.forEach(num => meterStr += num)
      return meterStr + ' m'
    }

    // Get Percentage Str
    const getPercentageStr = (num, div) => Number(num / (div ? div : 100)).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 })

    // Get Gender Rate Str
    const getGenderRateStr = num => {
      if (num === -1) return 'Genderless'
      const eighthPercentage = 100 / 8
      const percentageOfFemale = num * eighthPercentage
      const percentageOfMale = 100 - (percentageOfFemale)
      return `M - ${percentageOfMale}% | F - ${percentageOfFemale}%`
    }

    // Get Strs from Array
    const getStrsFromArray = (key, arr, separator) => {
      const tempArr = arr.map(obj => capitalizeWord(obj[key]))
      if (separator) return tempArr.join(' - ')
      else return tempArr.join(' ').trim()
    }
    
    return {
      capitalize: capitalizeWord,
      kgStr: getKGStr,
      meterStr: getMeterStr,
      percentageStr: getPercentageStr,
      genderRateStr: getGenderRateStr,
      strsFromArr: getStrsFromArray
    }
  })()
  
  // IIFE for common elements
  const DOMBuilder = (function() {

    // Create Types Container & Elements
    function createTypesElement(types) {
      const container = document.createElement('div')
      container.classList.add('types-container', 'flex')
      types.forEach(t => {
        const typeElement = document.createElement('span')
        typeElement.classList.add('type', t.type.name, 'white-font')
        typeElement.innerText = t.type.name.toUpperCase()
        container.appendChild(typeElement)
      })
      return container
    }

    // Create Stats Container & Elements
    function createStatsElement(stats, mainType) {
      const container = document.createElement('div')
      container.classList.add('stats-container', 'flex', 'col')
      stats.forEach(s => {
        const { base_stat, stat } = s
        const statWrapper = document.createElement('div')
        statWrapper.classList.add('stat-wrapper', 'flex')
        const statTitle = document.createElement('span')
        statTitle.classList.add('stat-title')
        statTitle.innerText = stat.name.length <= 2 ? stat.name.toUpperCase()
          : stat.name === 'special-attack' ? 'SP Attk'
          : stat.name === 'special-defense' ? 'SP Def'
          : StrHelpers.capitalize(stat.name)
        const statBarContainer = document.createElement('span')
        statBarContainer.classList.add('stat-bar', 'flex')
        const statBarStatBg = document.createElement('div')
        statBarStatBg.classList.add('stat-bar-bg', mainType.type.name)
        statBarStatBg.style.transform = `scaleX(${base_stat / 100})`
        const statBarStatFg = document.createElement('div')
        statBarStatFg.classList.add('stat-bar-fg', 'white-font')
        const baseStatElement = document.createElement('span')
        baseStatElement.classList.add('base-stat')
        baseStatElement.innerText = base_stat
        statBarStatFg.appendChild(baseStatElement)
        statBarContainer.appendChild(statBarStatBg)
        statBarContainer.appendChild(statBarStatFg)
        statWrapper.appendChild(statTitle)
        statWrapper.appendChild(statBarContainer)
        container.appendChild(statWrapper)
      })
      return container
    }

    // Create Container
    function createContainer(...classNames) {
      const container = document.createElement('div')
      classNames.forEach(cn => container.classList.add(cn))
      return container
    }

    // Create Table Row
    function createTableRow(rowTitle, rowData, rowParent) {
      const container = createContainer('table-row', rowParent, 'flex', 'jc-sb')
      const rowTitleContainer = createContainer('row-item-container')
      const rowTitleElement = document.createElement('p')
      rowTitleElement.classList.add('table-row-title', 'bold')
      rowTitleElement.innerText = rowTitle + ':'
      rowTitleContainer.appendChild(rowTitleElement)
      const rowDataContainer = createContainer('row-item-container')
      const rowDataElement = document.createElement('p')
      rowDataElement.classList.add('table-row-data')
      rowDataElement.innerText = rowData
      rowDataContainer.appendChild(rowDataElement)
      container.appendChild(rowTitleContainer)
      container.appendChild(rowDataContainer)
      return container
    }

    // Create Image Container & Element
    function createImageElement(url) {
      const container = document.createElement('div')
      container.classList.add('img-container')
      const img = document.createElement('img')
      img.setAttribute('src', url)
      container.appendChild(img)
      return container
    }

    // Create Name Types Bar
    function createNameTypesBar(name, types) {
      const container = document.createElement('div')
      container.classList.add('name-types-container', 'flex', 'ai-c', 'jc-sa')
      const nameContainer = document.createElement('div')
      nameContainer.classList.add('name-container')
      const nameElement = document.createElement('h6')
      nameElement.innerText = StrHelpers.capitalize(name)
      nameContainer.appendChild(nameElement)
      const typesContainer = document.createElement('div')
      typesContainer.classList.add('types-container', 'flex')
      types.forEach(t => {
        let typeElement = document.createElement('div')
        typeElement.classList.add('type-circle', t.type.name)
        typesContainer.appendChild(typeElement)
      })
      container.appendChild(nameContainer)
      container.appendChild(typesContainer)
      return container
    }

    // Create Sub Header
    function createSubHeader(title, mainType) {
      const container = document.createElement('div')
      container.classList.add('sub-header-container')
      const subHeaderElement = document.createElement('h2')
      subHeaderElement.classList.add('sub-header')
      if (mainType) subHeaderElement.classList.add(mainType.type.name, 'white-font')
      subHeaderElement.innerText = title
      container.appendChild(subHeaderElement)
      return container
    }
    
    // Create Name Bar
    function createNameBar(name, mainType) {
      const container = document.createElement('div')
      container.classList.add('name-bar-container')
      if (mainType) container.classList.add(mainType.type.name, 'white-font')
      const textElement = document.createElement('h1')
      textElement.innerText = StrHelpers.capitalize(name)
      container.appendChild(textElement)
      return container
    }

    // Image, Type and Stats
    function createImageTypeStats(url, types, stats) {
      const container = document.createElement('div')
      container.classList.add('content-container', 'img-types-stats-container', 'flex')

      const imgElement = createImageElement(url)

      const typeStatsContainer = document.createElement('div')
      typeStatsContainer.classList.add('types-stats-container', 'flex', 'col')

      const typesElement = createTypesElement(types)
      const statsElement = createStatsElement(stats, types[0])

      typeStatsContainer.appendChild(typesElement)
      typeStatsContainer.appendChild(statsElement)

      container.appendChild(imgElement)
      container.appendChild(typeStatsContainer)

      return container
    }

    // Profile Content Table
    function createProfileContentTable(profile) {
      const abilitiesArr = profile.abilities.map(ability => {
        return {
          name: ability.ability.name
        }
      })
      const container = createContainer('content-container', 'profile-content-container', 'grid')
      const heightRow = createTableRow('Height', StrHelpers.meterStr(profile.height), 'profile-content')
      const weightRow = createTableRow('Weight', StrHelpers.kgStr(profile.weight), 'profile-content')
      const captureRateRow = createTableRow('Catch Rate', StrHelpers.percentageStr(profile.captureRate, 255), 'profile-content')
      const genderRateRow = createTableRow('Gender Rate', StrHelpers.genderRateStr(profile.genderRate), 'profile-content')
      const eggGroupsRow = createTableRow('Egg Groups', StrHelpers.strsFromArr('name', profile.eggGroups, ' - '), 'profile-content')
      const hatchStepsRow = createTableRow('Hatch Steps', profile.hatchSteps, 'profile-content')
      const abilitiesRow = createTableRow('Abilities', StrHelpers.strsFromArr('name', abilitiesArr, ' - '), 'profile-content')
      const happinessRow = createTableRow('Base Happiness', profile.baseHappiness, 'profile-content')
      container.appendChild(heightRow)
      container.appendChild(weightRow)
      container.appendChild(captureRateRow)
      container.appendChild(genderRateRow)
      container.appendChild(eggGroupsRow)
      container.appendChild(hatchStepsRow)
      container.appendChild(abilitiesRow)
      container.appendChild(happinessRow)
      return container
    }

    // Pokemon Evolutions
    function createEvolutionsContent(evolutions) {
      const container = createContainer('content-container', 'evolutions-content-container')
      console.log(evolutions)
      return container
    }
    
    return {
      container: createContainer,
      image: createImageElement,
      cardHeader: createNameTypesBar,
      nameBar: createNameBar,
      subHeader: createSubHeader,
      imageTypeStats: createImageTypeStats,
      profileContent: createProfileContentTable,
      evolutionsContent: createEvolutionsContent
    }
  })()

  // IIFE for modal
  const ModalBuilder = (function() {

    // DOM Element: Container of Modal
    const modalContainer = document.querySelector('#modal-container')

    // Function to create modal content
    function createModalContent(pokemon) {
      const { name, types, imageUrl } = pokemon
      
      // Content Parent Container
      const contentContainer = document.createElement('div')

      // Name, Image, Stats Container and Elements
      function createNameImageTypeStats(stats) {
        const nameImageTypeStatsSection = DOMBuilder.container('section', 'name-img-types-stats')
        const nameBar = DOMBuilder.nameBar(name, types[0])
        const imgTypeStats = DOMBuilder.imageTypeStats(imageUrl, types, stats)
        nameImageTypeStatsSection.appendChild(nameBar)
        nameImageTypeStatsSection.appendChild(imgTypeStats)
        return nameImageTypeStatsSection
      }

      // Profile Details
      function createProfileDetails(profile) {
        const profileDetailsSection = DOMBuilder.container('section', 'profile-details-section')
        const subHeader = DOMBuilder.subHeader('Profile', types[0])
        const profileDetailsContent = DOMBuilder.profileContent(profile)
        profileDetailsSection.appendChild(subHeader)
        profileDetailsSection.appendChild(profileDetailsContent)
        return profileDetailsSection
      }

      // Damage Relations
      function createEvolutions(evolutions) {
        const evolutionsSection = DOMBuilder.container('section', 'evolutions-section')
        const subHeader = DOMBuilder.subHeader('Evolutions', types[0])
        const evolutionsContent = DOMBuilder.evolutionsContent(evolutions)
        evolutionsSection.appendChild(subHeader)
        evolutionsSection.appendChild(evolutionsContent)
        return evolutionsSection
      }
      
      // function createNameImageTypeStats() {
      //   const nameBar = DOMBuilder.nameBar(name, types[0])
      //   contentContainer.appendChild(nameBar)
        
      //   PokemonRespository.getDetails.stats(pokemon).then(function() {
      //     const { stats } = pokemon
      //     const imgTypeStats = DOMBuilder.imageTypeStats(imageUrl, types, stats)
      //     contentContainer.appendChild(imgTypeStats)
      //   })
      // }

      // // Profile Details
      // function createProfileDetails() {
      //   const profileDetailsContainer = document.createElement('div')
      //   profileDetailsContainer.classList.add('profile-details-container')
      //   const subHeader = DOMBuilder.subHeader('Profile', types[0])
        
      //   PokemonRespository.getDetails.stats(pokemon).then(function() {
      //     profileDetailsContainer.appendChild(subHeader)
      //     contentContainer.appendChild(profileDetailsContainer)
      //   })
      // }

      // TEST
      
      function createContentSections() {
        const sectionsArr = []
        // Name, Image, Type and Stats Section
        PokemonRespository.getDetails.stats(pokemon).then(function() {
          const { stats } = pokemon
          sectionsArr.push(createNameImageTypeStats(stats))
        }).then(function() {
          // Profile Details Section
          PokemonRespository.getDetails.profile(pokemon).then(function() {
            const { profile } = pokemon
            sectionsArr.push(createProfileDetails(profile))
          }).then(function() {
            // Evolutions Section
            PokemonRespository.getDetails.evolutions(pokemon).then(function() {
              const { evolutions } = pokemon
              // evolutions.forEach(evolution => console.log(evolution.species.imageUrl))
              sectionsArr.push(createEvolutions(evolutions))
            }).finally(function() {
              sectionsArr.forEach(section => contentContainer.appendChild(section))
            })
          })
        })
      }

      createContentSections()

      // const imageElement = DOMBuilder.image(pokemon.imageUrl)
      return contentContainer
    }

    // Function to show modal
    function showModal(pokemon) {
      // Clear existing modal content
      modalContainer.innerHTML = ''

      // Create a modal element
      let modal = document.createElement('div')
      modal.classList.add('modal')

      // Close button for modal
      let closeBtnElement = document.createElement('button')
      closeBtnElement.classList.add('modal-close')
      closeBtnElement.innerText = 'Close'

      // Content element
      let modalContent = createModalContent(pokemon)

      modal.appendChild(closeBtnElement)
      modal.appendChild(modalContent)
      modalContainer.appendChild(modal)

      modalContainer.classList.add('is-visible')
    }
    
    return {
      show: showModal
    }
  })()
  
  // Create Element: Pokemon Card Item
  function createPokemonCard(pokemon) {
    // Deconstruct the pokemon object being passed
    PokemonRespository.getDetails.basic(pokemon).then(function() {
      const { name, imageUrl, types } = pokemon

      const pokemonCard = document.createElement('div')
      pokemonCard.classList.add('pokemon-card', 'flex', 'col', 'jc-c')
      pokemonCard.setAttribute('data-pokemon', name)
      const nameTypesBar = DOMBuilder.cardHeader(name, types)
      const imgElement = DOMBuilder.image(imageUrl)

      pokemonCard.addEventListener('click', function() {
        ModalBuilder.show(pokemon)
        // PokemonRespository.getDetails.all(pokemon).then(function() {
        //   console.log(pokemon)
        // })
      })

      pokemonCard.appendChild(nameTypesBar)
      pokemonCard.appendChild(imgElement)
      pokemonCardsContainer.appendChild(pokemonCard)
    })
  }

  return {
    createPokemon: createPokemonCard
  }

})()

// IIFE of pokemon data and functions to access/edit pokemon data
// let PokemonRespository = (function() {
//   // Empty array of pokemon
//   const pokemonList = []
//   // API URL
//   const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'

//   // Load list of pokemon from API
//   function loadList() {
//     return fetch(apiUrl).then(function(response) {
//       return response.json()
//     }).then(function(json) {
//       json.results.forEach(function(item) {
//         let pokemon = {
//           name: item.name,
//           detailsUrl: item.url
//         }
//         return fetch(pokemon.detailsUrl).then(function(response) {
//           return response.json()
//         }).then(function(details) {
//           pokemon.details = {
//             imageUrl: details.sprites.front_default,
//             height: details.height,
//             types: details.types
//           }
//           addPokemon(pokemon)
//         }).catch(function(e) {
//           console.error(e)
//         })
//       })
//     }).catch(function(e) {
//       console.error(e)
//     })
//   }

//   // Load details of pokemon
//   function loadDetails(item) {
//     let url = item.detailsUrl
//     return fetch(url).then(function(response) {
//       return response.json()
//     }).then(function(details) {
//       // Now add the details to the item
//       item.imageUrl = details.sprites.front_default
//       item.height = details.height
//       item.types = details.types
//       PokemonDOMFactory.createPokemon(item)
//       // return item
//     }).catch(function(e) {
//       console.log(e)
//     })
//   }

//   // Show details of pokemon
//   function showDetails(obj) {
//     loadDetails(obj).then(function() {
//       Modals.show(obj)
//     })
//   }

//   // Get details of pokemon
//   function getDetails(obj) {
//     return loadDetails(obj)
//   }

//   // New add pokemon function; no chaining; simply push pokemon object to array
//   function addPokemon(obj) {
//     pokemonList.push(obj)
//   }

//   // Return pokemon object based on name passed in parameter
//   function findByName(name) {
//     // Filter the pokemonList array and find pokemon object with same name as parameter; desctructure (unwrap from array) the object if found
//     let [obj] = pokemonList.filter(p => {
//       return p.name == name
//     })
//     // Check if a pokemon with that name exists; if FALSE, return string that says it does not exist
//     if (obj === null || obj === undefined) return `Pokemon with name '${name}' does not exist`
//     // If it does exist, return the object
//     else return obj
//   }

//   // Return pokemonList array
//   function getAll() {
//     return pokemonList
//   }

//   return {
//     // Add pokemon to list
//     addPokemon,
//     // Load details of pokemon
//     loadDetails,
//     // Show details of pokemon
//     showDetails,
//     // Get details of pokemon
//     getDetails,
//     // Return pokemon object based on name passed in parameter
//     findByName,
//     // Return pokemonList array
//     getAll,
//     // Load list of pokemon
//     loadList
//   }
// })()

let PokemonRespository = (function() {
  // Empty array of pokemon
  const pokemonList = []
  // API URL
  const apiUrlBuilder = (endpoint, idName) => `https://pokeapi.co/api/v2/${endpoint}/${idName}`
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'

  function loadList() {
    return fetch(apiUrl).then(function(response) {
      return response.json()
    }).then(function(json) {
      json.results.forEach(function(item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        }
        add(pokemon)
      })
    }).catch(function(e) {
      console.error(e)
    })
  }

  function loadBasicDetails(pokemon) {
    let url = pokemon.detailsUrl
    return fetch(url).then(function(response) {
      return response.json()
    }).then(function(details) {
      pokemon.id = details.id
      pokemon.imageUrl = details.sprites.front_default
      pokemon.height = details.height
      pokemon.types = details.types
    }).catch(function(e) {
      console.error(e)
    })
  }

  function loadStats(pokemon) {
    let url = pokemon.detailsUrl
    return fetch(url).then(function(response) {
      return response.json()
    }).then(function(details) {
      pokemon.stats = details.stats
    }).catch(function(e) {
      console.error(e)
    })
  }

  function loadProfileDetails(pokemon) {
    let speciesUrl = apiUrlBuilder('pokemon-species', pokemon.id)
    return fetch(speciesUrl).then(function(response) {
      return response.json()
    }).then(function(details) {
      pokemon.profile = {
        captureRate: details.capture_rate,
        eggGroups: details.egg_groups,
        genderRate: details.gender_rate,
        hatchSteps: details.hatch_counter * 255,
        baseHappiness: details.base_happiness
      }
      return fetch(pokemon.detailsUrl).then(function(response) {
        return response.json()
      }).then(function(details) {
        pokemon.profile.abilities = details.abilities
        pokemon.profile.height = details.height,
        pokemon.profile.weight = details.weight
      })
    }).catch(function(e) {
      console.error(e)
    })
  }

  function loadEvolutions(pokemon) {

    // Function to get the id of the species at the end of the url: found at https://stackoverflow.com/questions/39160539/regex-pattern-to-get-number-between-forward-slashes-at-the-end-of-a-url
    function getSpeciesId(s) {
      let m = s.match(/\/(\d+)\//)
      return m[1]
    }

    // Function to create a evolution object
    function Evolution(details, species, evolvesTo) {
      this.details = details.length === 0 ? false : {
        get minLevel() { return details[0].min_level }
      }
      this.species = {
        get name() { return species.name },
        get url() { return species.url },
        get imageUrl() { return `https:///raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getSpeciesId(this.url)}.png` }
      },
      this.evolvesTo = evolvesTo.length === 0 ? false : {
        get evolution() { return evolvesTo[0] }
      }
    }

    // Function to create a evolution from/to object
    function recurseEvolutionDetails(request, response) {
      if (!request.evolvesTo) return
      const { evolution_details, species, evolves_to } = request.evolvesTo.evolution
      const evolution = new Evolution(evolution_details, species, evolves_to)
      response.push(evolution)
      recurseEvolutionDetails(evolution, response)
    }

    // Function to parse the evolution chain
    function parseEvolutions(chain) {
      let response = []
      const { evolution_details, species, evolves_to } = chain
      const evolution = new Evolution(evolution_details, species, evolves_to)
      response.push(evolution)
      recurseEvolutionDetails(evolution, response)
      return response
    }
    
    // 1: Load the species
    let speciesUrl = apiUrlBuilder('pokemon-species', pokemon.name)
    return fetch(speciesUrl).then(function(response) {
      return response.json()
    }).then(function(speciesResponse) {
      // 2: Load the evolution chain
      return fetch(speciesResponse.evolution_chain.url).then(function(response) {
        return response.json()
      }).then(function(evolutionsResponse) {
        const { chain } = evolutionsResponse
        pokemon.evolutions = parseEvolutions(chain)
      }).catch(function(e) {
        console.error(e)
      })
    }).catch(function(e) {
      console.error(e)
    })
  }

  function add(pokemon) { pokemonList.push(pokemon) }

  return {
    init: loadList,
    getDetails: {
      basic: loadBasicDetails,
      stats: loadStats,
      profile: loadProfileDetails,
      evolutions: loadEvolutions
    },
    get pokemon() { return pokemonList }
  }
})()

PokemonRespository.init().then(function() {
  PokemonRespository.pokemon.forEach(function(pokemon) {
    PokemonDOMFactory.createPokemon(pokemon)
  })
})