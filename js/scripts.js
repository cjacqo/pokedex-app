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

    // Create Text Container
    function createTextContainer(containerClassNames, element, str) {
      const container = createContainer(...containerClassNames)
      const textElement = document.createElement(element ? element : 'p')
      textElement.innerText = str
      container.appendChild(textElement)
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

      // Function to create evolution container
      function createEvolutionContainer(currEvolution, nextEvolution) {
        const evolutionContainer = createContainer('evolution-container')
        const imagesWrapper = createContainer('evolution-imgs-wrapper', 'flex', 'jc-c', 'ai-c')

        const currEvolutionImage = createImageElement(currEvolution.species.imageUrl)
        const arrowImage = createImageElement('./svg/arrow.svg')
        const nextEvolutionImage = createImageElement(nextEvolution.species.imageUrl)
        const evolutionDetail = createTextContainer([ 'evolution-details' ], 'p', `${StrHelpers.capitalize(currEvolution.species.name)} evolves into ${StrHelpers.capitalize(nextEvolution.species.name)} at level ${nextEvolution.details.minLevel}`)

        imagesWrapper.appendChild(currEvolutionImage)
        imagesWrapper.appendChild(arrowImage)
        imagesWrapper.appendChild(nextEvolutionImage)
        evolutionContainer.appendChild(imagesWrapper)
        evolutionContainer.appendChild(evolutionDetail)
        return evolutionContainer
      }
      
      evolutions.forEach((currEvolution, i) => {
        if (i < evolutions.length - 1) {
          let nextEvolution = evolutions[i + 1]
          container.appendChild(createEvolutionContainer(currEvolution, nextEvolution))
        }
      })
      return container
    }

    // Pokemon Moves
    function createMovesContent(moves) {

      function createMovesGroup(moves, group) {
        const container = createContainer('moves-group', `${group}-moves-group`)
        const subHeader = createSubHeader(`${StrHelpers.capitalize(group)} Moves`)
        const movesWrapper = createContainer('moves-wrapper')
        moves.forEach(move => {
          const { name, level, accuracy, power, effect, pp, type } = move.details
          const moveContentContainer = createContainer('move-content-container')
          const moveRow = createContainer('move-row', 'flex', 'jc-se')
          const dropDownRow = createContainer('drop-down-row', 'flex', 'col', 'hidden')
          if (level > 0) {
            const levelElement = document.createElement('p')
            levelElement.classList.add('move-detail', 'move-level-element')
            levelElement.innerText = level
            moveRow.appendChild(levelElement)
          }
          const titleElement = document.createElement('p')
          titleElement.innerText = StrHelpers.capitalize(name)
          titleElement.classList.add('move-detail', 'move-title-element')

          const typeElement = document.createElement('p')
          typeElement.classList.add(type,'move-detail', 'move-type-element', 'white-font')
          typeElement.innerText = type.toUpperCase()

          const buttonElement = document.createElement('button')
          buttonElement.classList.add('btn-dropdown', 'move-button')
          buttonElement.innerText = '>'

          buttonElement.addEventListener('click', (e) => {
            e.preventDefault()
            dropDownRow.classList.toggle('hidden')
          })

          const moveStatsContainer = createContainer('move-stats-container', 'flex', 'jc-sb')
          const powerTitle = document.createElement('p')
          powerTitle.innerText = `Power: ${power ? power : 'N/A'}`
          const accuracyTitle = document.createElement('p')
          accuracyTitle.innerText = `Power: ${accuracy ? accuracy : 'N/A'}`
          const ppTitle = document.createElement('p')
          ppTitle.innerText = `Power: ${pp ? pp : 'N/A'}`
          moveStatsContainer.appendChild(powerTitle)
          moveStatsContainer.appendChild(accuracyTitle)
          moveStatsContainer.appendChild(ppTitle)

          const moveEffectContainer = createContainer('move-effect-container')
          const moveEffectContent = document.createElement('p')
          moveEffectContainer.innerText = effect
          moveEffectContainer.appendChild(moveEffectContent)

          dropDownRow.appendChild(moveStatsContainer)
          dropDownRow.appendChild(moveEffectContainer)

          moveRow.appendChild(titleElement)
          moveRow.appendChild(typeElement)
          moveRow.appendChild(buttonElement)
          moveContentContainer.appendChild(moveRow)
          moveContentContainer.appendChild(dropDownRow)
          movesWrapper.appendChild(moveContentContainer)
        })
        container.appendChild(subHeader)
        container.appendChild(movesWrapper)
        return container
      }
      
      const container = createContainer('content-container', 'moves-content-container')
      const naturalMovesGroup = createMovesGroup(moves.sortNatural(), 'natural')
      const machineMovesGroup = createMovesGroup(moves.sortAlphabetical().machine, 'machine')
      const tutorMovesGroup = createMovesGroup(moves.sortAlphabetical().tutor, 'tutor')
      const eggMovesGroup = createMovesGroup(moves.sortAlphabetical().egg, 'egg')

      container.appendChild(naturalMovesGroup)
      container.appendChild(machineMovesGroup)
      container.appendChild(tutorMovesGroup)
      container.appendChild(eggMovesGroup)
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
      evolutionsContent: createEvolutionsContent,
      movesContent: createMovesContent
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

      // Moves
      function createMoves(moves) {
        const movesSection = DOMBuilder.container('section', 'moves-section')
        const subHeader = DOMBuilder.subHeader('Moves', types[0])
        const movesContent = DOMBuilder.movesContent(moves)
        movesSection.appendChild(subHeader)
        movesSection.appendChild(movesContent)
        return movesSection
      }
      
      function createContentSections() {
        const sectionsArr = []

        PokemonRespository.getDetails.card(pokemon).then(() => {
          const { stats, profile, evolutions, moves } = pokemon
          sectionsArr.push(createNameImageTypeStats(stats))
          sectionsArr.push(createProfileDetails(profile))
          sectionsArr.push(createEvolutions(evolutions))
          sectionsArr.push(createMoves(moves))
        }).finally(() => {
          sectionsArr.forEach(section => contentContainer.appendChild(section))
        })
        
      }

      createContentSections()

      return contentContainer
    }

    // Function to show modal
    function showModal(pokemon) {
      // Clear existing modal content
      modalContainer.innerHTML = ''

      // Create a modal element
      let modal = document.createElement('div')
      modal.classList.add('modal-box')

      // Close button for modal
      let closeBtnElement = document.createElement('button')
      closeBtnElement.classList.add('modal-close')
      closeBtnElement.innerText = 'Close'

      closeBtnElement.addEventListener('click', (e) => {
        e.preventDefault()
        modalContainer.classList.remove('is-visible')
      })

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
      pokemonCard.classList.add('pokemon-card', 'list-group-item')
      // pokemonCard.classList.add('pokemon-card', 'flex', 'col', 'jc-c')
      pokemonCard.setAttribute('data-pokemon', name)
      const nameTypesBar = DOMBuilder.cardHeader(name, types)
      const imgElement = DOMBuilder.image(imageUrl)

      pokemonCard.addEventListener('click', function() {
        ModalBuilder.show(pokemon)
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
      pokemon.types = details.types
    }).catch(function(e) {
      console.error(e)
    })
  }

  // Function to get the id of the species at the end of the url: found at https://stackoverflow.com/questions/39160539/regex-pattern-to-get-number-between-forward-slashes-at-the-end-of-a-url
  function getId(s) {
    let m = s.match(/\/(\d+)\//)
    return m[1]
  }

  // Function constructor to create a evolution object
  function Evolution(details, species, evolvesTo) {
    this.details = details.length === 0 ? false : {
      get minLevel() { return details[0].min_level }
    }
    this.species = {
      get name() { return species.name },
      get url() { return species.url },
      get imageUrl() { return `https:///raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getId(this.url)}.png` }
    },
    this.evolvesTo = evolvesTo.length === 0 ? false : {
      get evolution() { return evolvesTo[0] }
    }
  }
  // Object literal for a moves library
  const MovesObj = {
    pokemon: '',
    _moves: {
      natural: [],
      machine: [],
      tutor: [],
      egg: []
    },
    set move(move) {
      const moveGroup = move.details.group
      this._moves[moveGroup].push(move)
      return this
    },
    get moves() {
      return {
        natural: this._moves.natural,
        machine: this._moves.machine,
        tutor: this._moves.tutor,
        egg: this._moves.egg
      }
    },
    sortNatural: function() {
      return this.moves.natural.sort((a, b) => a.details.level > b.details.level)
    },
    sortAlphabetical: function() {
      return {
        machine: this.moves.machine.sort((a, b) => a.details.name > b.details.name),
        tutor: this.moves.tutor.sort((a, b) => a.details.name > b.details.name),
        egg: this.moves.egg.sort((a, b) => a.details.name > b.details.name)
      }
    }
  }
  // Function constructor for a move
  function Move(name, groupDetails, accuracy, power, pp, type, effect) {
    const groupName = groupDetails[0].move_learn_method.name
    const group = groupName === 'level-up' ? 'natural' : groupName
    const level = group === 'natural' ? groupDetails[0].level_learned_at : false

    this.details = {
      get name() { return name },
      get group() { return group },
      get level() { return level },
      get accuracy() { return accuracy !== null ? accuracy + '%' : 'N/A' },
      get power() { return power !== null ? power : 'N/A' },
      get pp() { return pp !== null ? pp : 'N/A' },
      get type() { return type.name },
      get effect() { return effect.length > 0 ? effect[0].effect : 'N/A' }
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

  function fetchData(url) {
    return new Promise((resolve, reject) => {
      fetch(url).then(res => resolve(res))
    })
  }

  function retrieveMoves(data) {
    return data.moves
  }

  function parseMoves(moves) {
    return Promise.all(moves.map(_move => {
      const { move, version_group_details } = _move
      const { name, url } = move
      return fetch(url).then(res => res.json()).then(res => {
        const { accuracy, power, pp, type, effect_entries } = res
        return new Move(name, version_group_details, accuracy, power, pp, type, effect_entries)
      })
    })).catch(e => console.error(e))
  }

  function getMovesLibrary(moves) {
    const movesLibrary = Object.assign(Object.create(MovesObj))
    moves.forEach(move => {
      movesLibrary.move = move
    })
    return movesLibrary
  }

  async function loadCard(pokemon) {
    let detailsUrl = pokemon.detailsUrl
    let speciesUrl = apiUrlBuilder('pokemon-species', pokemon.id)
    let movesUrl = apiUrlBuilder('pokemon', pokemon.id)

    pokemon.stats = await fetch(detailsUrl).then(res => res.json().then(res => { return res.stats }))
    
    pokemon.profile = await fetch(speciesUrl).then(res => res.json().then(res => {
      const profile = {
        captureRate: res.capture_rate,
        eggGroups: res.egg_groups,
        genderRate: res.gender_rate,
        hatchSteps: res.hatch_counter * 255,
        baseHappiness: res.base_happiness
      }
      return fetch(detailsUrl).then(res => res.json().then(res => {
        profile.abilities = res.abilities
        profile.height = res.height
        profile.weight = res.weight
        return profile
      }))
    }))

    pokemon.evolutions = await fetch(speciesUrl).then(res => res.json().then(res => {
      return fetch(res.evolution_chain.url).then(res => res.json().then(res => {
        return parseEvolutions(res.chain)
      }))
    }))

    pokemon.moves = await fetchData(movesUrl)
                            .then(res => res.json())
                            .then(retrieveMoves)
                            .then(parseMoves)
                            .then(getMovesLibrary)
  }



  function add(pokemon) { pokemonList.push(pokemon) }

  return {
    init: loadList,
    getDetails: {
      basic: loadBasicDetails,
      card: loadCard
    },
    get pokemon() { return pokemonList }
  }
})()

PokemonRespository.init().then(function() {
  PokemonRespository.pokemon.forEach(function(pokemon) {
    PokemonDOMFactory.createPokemon(pokemon)
  })
})