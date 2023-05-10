// IIFE for creating pokemon cards
let PokemonDOMFactory = (function() {

  // DOM Element: Container of Pokemon
  const pokemonCardsContainer = document.getElementById('pokemonCardsContainer')
  const row = document.createElement('div')
  row.classList.add('row', 'justify-content-center', 'scroll-y')
  pokemonCardsContainer.appendChild(row)
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
      return [
        percentageOfMale,
        percentageOfFemale
      ]
    }

    // Get Strs from Array
    const getStrsFromArray = (key, arr, separator) => {
      const tempArr = arr.map(obj => capitalizeWord(obj[key]))
      if (separator) return tempArr.join(separator)
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

  const DOMHelper = (function() {
    let getSiblings = function(e) {
      let siblings = []
      if (!e.parentNode) return siblings

      let sibling = e.parentNode.firstChild

      while (sibling) {
        if (sibling.nodeType === 1 && sibling !== e) {
          siblings.push(sibling)
        }
        sibling = sibling.nextSibling
      }
      return siblings
    }

    return {
      getSiblings
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
      if (mainType) subHeaderElement.classList.add(mainType)
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

    // Navigation
    function createNavigation() {
      const navbar = document.getElementById('navContainer')

      let navList, togglerButton, collapseBar, searchForm, sortByDropDownContainer, filterByTypeDropDownContainer

      function makeNavList() {
        navList = document.createElement('ul')
        navList.classList.add('navbar-nav', 'mr-auto')
      }

      function makeCollapseBar() {
        collapseBar = document.createElement('div')
        collapseBar.classList.add('collapse', 'navbar-collapse')
        collapseBar.setAttribute('id', 'navbarContainer')
      }

      function makeDropDownListItem(text, classNames, createCircle, eventListener) {
        let listItem = document.createElement('li')
        listItem.classList.add('dropdown-item', 'white-font')
        classNames.forEach(className => listItem.classList.add(className))
        listItem.setAttribute('id', text)
        listItem.innerText = StrHelpers.capitalize(text)
        if (createCircle) {
          let listItemCircle = document.createElement('span')
          listItemCircle.classList.add('circle')
          listItem.appendChild(listItemCircle)
        }
        listItem.addEventListener('click', (e) => eventListener(e, text === 'all'))
        return listItem
      }

      function makeFilterByTypeList() {
        filterByTypeDropDownContainer = document.createElement('div')
        filterByTypeDropDownContainer.classList.add('dropdown')
        filterByTypeDropDownContainer.setAttribute('id', 'filterDropDownContainer')

        // Callback Function Event Listener
        function handleFilterSelection(e, isAll) {
          e.preventDefault()
          const { target } = e
          let filterAll = isAll
          if (filterAll) {
            let listItemTypes = Array.from(document.querySelectorAll('.type-selection'))
            if (!target.classList.contains('selected')) target.classList.add('selected')
            listItemTypes.forEach(listItem => {
              if (listItem.classList.contains('selected')) listItem.classList.remove('selected')
            })
          } else {
            target.classList.toggle('selected')
          }
          PokemonRepository.filter(filterAll)
          e.stopPropagation()
        }
        
        // Filter By Type Drop Down Menu Button
        function makeFilterByTypeDropDownButton() {
          let filterByTypeButton = document.createElement('button')
          filterByTypeButton.classList.add('dropdown-btn')
          filterByTypeButton.setAttribute('id', 'filterByTypeBtn')
          filterByTypeButton.setAttribute('type', 'button')
          filterByTypeButton.dataset.toggle = 'dropdown'
          filterByTypeButton.ariaHasPopup = true
          filterByTypeButton.ariaExpanded = true
          filterByTypeButton.innerText = 'Type'
          let filterIcon = document.createElement('i')
          filterIcon.classList.add('fa-solid', 'fa-filter')
          filterByTypeButton.appendChild(filterIcon)
          filterByTypeDropDownContainer.appendChild(filterByTypeButton)
        }
        
        // Make List Items for Drop Down Menu
        function makeFilterByTypeListItems() {
          let filterByTypeList = document.createElement('div')
          filterByTypeList.classList.add('dropdown-menu')
          filterByTypeList.ariaLabel = 'filterByTypeBtn'

          // Create a 'All' filter list item
          let filterByAllListItem = makeDropDownListItem('all', ['type-filter'], true, handleFilterSelection)
          filterByAllListItem.classList.add('selected')
          filterByTypeList.appendChild(filterByAllListItem)

          let types = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
          types = types.sort((a, b) => a > b)

          // Loop over pokemon types to create dropdown menu list items
          types.forEach(type => {
            filterByTypeList.appendChild(makeDropDownListItem(type, ['type-filter', 'type-selection'], true, handleFilterSelection))
          })

          filterByTypeDropDownContainer.appendChild(filterByTypeList)
        }

        makeFilterByTypeDropDownButton()
        makeFilterByTypeListItems()
        navList.appendChild(filterByTypeDropDownContainer)
      }

      function makeSearchBar() {
        searchForm = document.createElement('form')
        searchForm.classList.add('form-inline', 'my-2', 'my-lg-0')
        let searchBar = document.createElement('input')
        searchBar.classList.add('form-control')
        searchBar.setAttribute('type', 'search')
        searchBar.placeholder = 'Search'
        searchBar.ariaLabel = 'Search'
        searchBar.addEventListener('keyup', (e) => {
          PokemonRepository.search(e)
        })
        searchForm.appendChild(searchBar)
      }

      function makeSort() {
        sortByDropDownContainer = document.createElement('div')
        sortByDropDownContainer.classList.add('dropdown')
        sortByDropDownContainer.setAttribute('id', 'sortDropDownContainer')

        function handleSortSelection(e) {
          e.preventDefault()
          const { target } = e
          target.classList.toggle('selected')
          DOMHelper.getSiblings(target).forEach(sibling => {
            if (sibling.classList.contains('selected')) sibling.classList.remove('selected')
          })
          let btn = document.getElementById('sortByBtn')
          if (target.classList.contains('selected')) {
            btn.innerText = `Sort By: ${target.id}`
          } else {
            btn.innerText = 'Sort By'
          }
          PokemonRepository.sort(target.id, target.classList.contains('selected'))
          e.stopPropagation()
        }

        function makeSortByDropDownButton() {
          let sortByButton = document.createElement('button')
          sortByButton.classList.add('dropdown-btn')
          sortByButton.setAttribute('id', 'sortByBtn')
          sortByButton.setAttribute('type', 'button')
          sortByButton.dataset.toggle = 'dropdown'
          sortByButton.ariaHasPopup = true
          sortByButton.ariaExpanded = true
          sortByButton.innerText = 'Sort By'
          sortByDropDownContainer.appendChild(sortByButton)
        }

        function makeSoryByListItems() {
          let sortByList = document.createElement('div')
          sortByList.classList.add('dropdown-menu')
          sortByList.ariaLabel = 'sortByBtn'

          let types = ['A-Z', 'Z-A']

          types.forEach(type => {
            sortByList.appendChild(makeDropDownListItem(type, ['sort-filter'], false, handleSortSelection))
          })

          sortByDropDownContainer.appendChild(sortByList)
        }

        makeSortByDropDownButton()
        makeSoryByListItems()
        navList.appendChild(sortByDropDownContainer)
      }

      function makeToggler() {
        togglerButton = document.createElement('button')
        togglerButton.classList.add('navbar-toggler')
        togglerButton.setAttribute('type', 'button')
        togglerButton.dataset.toggle = 'collapse'
        togglerButton.dataset.target = '#navbarContainer'
        togglerButton.setAttribute('aria-controls', 'navbarContainer')
        togglerButton.ariaExpanded = false
        togglerButton.ariaLabel = 'Toggle navigation'
        let togglerIcon = document.createElement('span')
        togglerIcon.classList.add('navbar-toggler-icon')
        togglerButton.appendChild(togglerIcon)
      }

      function appendToNavBar() {
        collapseBar.appendChild(searchForm)
        collapseBar.appendChild(navList)
        navbar.appendChild(togglerButton)
        navbar.appendChild(collapseBar)
      }

      makeCollapseBar()
      makeToggler()
      makeSearchBar()
      makeNavList()
      makeSort()
      makeFilterByTypeList()
      appendToNavBar()
    }

    // Empty Message
    function createEmptyMessage() {
      const element = createTextContainer(['nothing-found-container'], 'h5', 'No pokemon')
      document.body.appendChild(element)
    }

    // Pokemon Card
    function createPokemonCard(pokemon) {
      const { name, imageUrl, types } = pokemon.data
      const cardContainer = document.createElement('div')
      cardContainer.classList.add('border-dark', 'pokemon-card', 'text-white', 'bg-dark')
      cardContainer.setAttribute('data-pokemon', name)
      cardContainer.setAttribute('data-pokemon-id', pokemon.data.id)
      cardContainer.setAttribute('data-toggle', 'modal')
      cardContainer.setAttribute('data-target', '#myModal')

      const imgContainer = document.createElement('div')
      imgContainer.classList.add('img-container')
      const imgElement = document.createElement('img')
      imgElement.classList.add('card-img-top')
      imgElement.setAttribute('src', imageUrl)
      imgContainer.appendChild(imgElement)

      const cardBody = document.createElement('div')
      cardBody.classList.add('card-body')

      const cardTitle = document.createElement('h5')
      cardTitle.classList.add('card-title')
      cardTitle.innerText = StrHelpers.capitalize(name)

      const cardText = document.createElement('p')
      cardText.classList.add('card-text')
      types.forEach(type => {
        let typeElement = document.createElement('span')
        typeElement.classList.add('type-circle', type.type.name)
        cardText.appendChild(typeElement)
      })

      cardBody.appendChild(cardTitle)
      cardBody.appendChild(cardText)

      cardContainer.appendChild(imgContainer)
      cardContainer.appendChild(cardBody)
      return cardContainer
    }

    // Create Menu Item
    function createMenuItem(text, classNames, createCircle, eventListener) {
      let listItem = document.createElement('li')
      listItem.classList.add('dropdown-item', 'text-light', 'd-flex', 'justify-content-between')
      classNames.forEach(className => listItem.classList.add(className))
      listItem.dataset.pokemonType = text
      listItem.innerText = StrHelpers.capitalize(text)
      if (createCircle) {
        let listItemCircle = document.createElement('span')
        listItemCircle.classList.add('circle', text)
        if (text === 'all') listItem.classList.add('selected')
        listItem.appendChild(listItemCircle)
      }
      return listItem
    }
    
    // Type Filter Drop Down Menu
    function createTypeFilterMenu() {
      const desktopContainer = document.getElementById('filterTypesContainer-Desktop')
      const mobileContainer = document.getElementById('filterTypesContainer-Mobile')

      mobileContainer.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopImmediatePropagation()
      }, false)

      let types = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
      types = types.sort((a, b) => a > b)

      // Callback Function Event Listener
      function handleFilterSelection(e, isAll) {
        let target = e.target
        let selectedType = target.dataset.pokemonType
        if (!selectedType) {
          target = target.parentNode
          selectedType = target.dataset.pokemonType
        }
        let listItemTypes = Array.from(document.querySelectorAll('.type-filter'))

        if (isAll) {
          // Set selected class on both the target, and the clone
          let allItems = Array.from(document.querySelectorAll(`[data-pokemon-type=${selectedType}]`))
          if (!target.classList.contains('selected') && !allItems[0].classList.contains('selected')) {
            allItems.forEach(item => item.classList.add('selected'))
          }
          // Remove selected class from all other elements
          listItemTypes.forEach(listItem => {
            if (listItem.dataset.pokemonType !== selectedType && listItem.classList.contains('selected')) listItem.classList.remove('selected')
          })
        } else {
          // Toggle selected class on both the target, and the clone
          const selectedFilters = Array.from(document.querySelectorAll(`[data-pokemon-type=${selectedType}]`))
          selectedFilters.forEach(listItem => listItem.classList.toggle('selected'))
        }
        PokemonRepository.filter(isAll)
      }

      // All List Item
      const allListItemD = createMenuItem('all', ['type-filter'], true)
      const allListItemM = createMenuItem('all', ['type-filter'], true)
      
      desktopContainer.appendChild(allListItemD)
      mobileContainer.appendChild(allListItemM)
      types.forEach(type => {
        const listItemD = createMenuItem(type, ['type-filter', 'type-selection'], true)
        const listItemM = createMenuItem(type, ['type-filter', 'type-selection'], true)
        desktopContainer.appendChild(listItemD)
        mobileContainer.appendChild(listItemM)
      })

      // Add Event Listeners
      Array.from(document.querySelectorAll('.type-filter')).forEach(function(i) {
        i.addEventListener('click', function(e) {
          e.preventDefault()
          handleFilterSelection(e, i.dataset.pokemonType === 'all')
        })
      })
    }
    // Sort Filter Drop Down Menu
    function createSortFilterMenu() {
      const desktopContainer = document.getElementById('sortPokemonContainer-Desktop')
      const mobileContainer = document.getElementById('sortPokemonContainer-Mobile')
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
      movesContent: createMovesContent,
      navigation: createNavigation,
      emptyMessage: createEmptyMessage,
      pokemonCard: createPokemonCard,
      dropDownMenu: {
        typeFilter: createTypeFilterMenu,
        sortFilter: createSortFilterMenu
      }
    }
  })()

  // IIFE for modal
  const ModalBuilder = (function() {

    // Function to create modal content
    function createModalContent(pokemon) {
      const { name, types, imageUrl } = pokemon.data

      const mainType = types[0].type.name
      
      // Content Parent Container
      const container = document.createElement('div')
      container.classList.add('modal-body-wrapper')

      // Name, Image, Stats Container and Elements
      function createNameImageTypeStats(stats) {
        // Parent Container
        const sectionContainer = document.createElement('div')
        sectionContainer.classList.add('d-flex', 'border-bottom', 'pb-3')
        sectionContainer.setAttribute('id', 'imageTypeStatsSection')

        // Image Figure
        function createImageFigure() {
          const figureContainer = document.createElement('figure')
          figureContainer.classList.add('figure')
          const imgElement = document.createElement('img')
          imgElement.classList.add('figure-img', 'img-fluid', 'rounded')
          imgElement.setAttribute('alt', `Image of ${StrHelpers.capitalize(name)}`)
          imgElement.setAttribute('src', imageUrl)
          figureContainer.appendChild(imgElement)
          return figureContainer
        }

        // Type(s) Badges
        function createTypeBadges() {
          const typesContainer = document.createElement('div')
          typesContainer.classList.add('container', 'types-stats-container', 'd-flex', 'justify-content-center')
          types.forEach(typeObj => {
            const { name } = typeObj.type
            let badgeElement = document.createElement('span')
            badgeElement.classList.add('badge', 'text-light')
            badgeElement.setAttribute('data-type', name)
            badgeElement.innerText = name.toUpperCase()
            typesContainer.appendChild(badgeElement)
          })
          return typesContainer
        }

        // Stats
        function createStats() {
          const statsContainer = document.createElement('div')
          statsContainer.classList.add('stats-container', 'd-flex', 'flex-column')
          const maxStats = {
            hp: 255,
            attack: 145,
            defense: 250,
            spAttk: 194,
            spDef: 230,
            speed: 180
          }
          stats.forEach(s => {
            const { base_stat, stat } = s
            const statWrapper = document.createElement('div')
            statWrapper.classList.add('stat-wrapper')
            const statTitle = document.createElement('span')
            statTitle.classList.add('stat-title', 'small')
            statTitle.innerText = stat.name.length <= 2 ? stat.name.toUpperCase()
              : stat.name === 'special-attack' ? 'SP Attk'
              : stat.name === 'special-defense' ? 'SP Def'
              : StrHelpers.capitalize(stat.name)
            const statBarContainer = document.createElement('div')
            statBarContainer.classList.add('progress')

            let statKey = stat.name === 'special-attack' ? 'spAttk'
              : stat.name === 'special-defense' ? 'spDef'
              : stat.name

            // Calculate percentage
            let percentage = (base_stat * 100) / maxStats[statKey]
            const statBar = document.createElement('div')
            statBar.classList.add('progress-bar')
            statBar.setAttribute('role', 'progressbar')
            statBar.setAttribute('aria-value-now', percentage)
            statBar.setAttribute('aria-value-min', 0)
            statBar.setAttribute('aria-value-max', 100)
            statBar.setAttribute('data-main-type-bg', mainType)
            statBar.style.width = `${percentage}%`
            statBar.innerText = base_stat
            statBarContainer.appendChild(statBar)
            statWrapper.appendChild(statTitle)
            statWrapper.appendChild(statBarContainer)
            statsContainer.appendChild(statWrapper)
          })
          return statsContainer
        }

        // Return Section
        sectionContainer.appendChild(createImageFigure())
        sectionContainer.appendChild(createTypeBadges())
        sectionContainer.appendChild(createStats())
        return sectionContainer
      }

      // Profile Details
      function createProfileDetails(profile) {
        const sectionContainer = document.createElement('div')
        sectionContainer.classList.add('d-flex', 'border-bottom', 'flex-wrap', 'pb-2')
        sectionContainer.setAttribute('id', 'profileDetailsSection')

        const titleContainer = document.createElement('div')
        titleContainer.classList.add('flex-grow-1', 'mt-2')
        const titleElement = document.createElement('h6')
        titleElement.innerText = 'Profile'
        titleContainer.appendChild(titleElement)
        sectionContainer.appendChild(titleContainer)

        const numOfKeys = Object.keys(profile).length

        // Table
        const container = document.createElement('div')
        container.classList.add('container')
        Object.entries(profile).forEach((entry, i) => {
          const [key, value] = entry

          let row = document.createElement('div')
          row.classList.add('row', 'align-items-center', 'justify-content-around', 'pt-2', 'pb-2', 'pl-3')
          if (i !== numOfKeys - 1) row.classList.add('border-bottom')

          let colTitle = document.createElement('div')
          let colValue = document.createElement('div')
          colTitle.classList.add('col-5', 'p-0')
          colValue.classList.add('col', 'p-0')
          
          let titleElement = document.createElement('p')
          let textElement = document.createElement('p')
          titleElement.classList.add('small', 'bold')
          textElement.classList.add('profile-data', 'small', 'd-flex', 'align-items-center')

          let title, text
          if (key === 'height' || key === 'weight' || key === 'abilities') {
            title = StrHelpers.capitalize(key)
            text = key === 'height' ? StrHelpers.meterStr(value)
                  : key === 'weight' ? StrHelpers.kgStr(value)
                  : false
            if (!text) {
              const abilitiesArr = value.map(ability => {
                return {
                  name: ability.ability.name
                }
              })
              text = StrHelpers.strsFromArr('name', abilitiesArr, ' / ')
            }
          } else if (key === 'captureRate') {
            title = 'Capture Rate'
            text = StrHelpers.percentageStr(value, 255)
          } else if (key === 'genderRate') {
            title = 'Gender Rate'
            text = StrHelpers.genderRateStr(value)
          } else if (key === 'eggGroups') {
            title = 'Egg Groups'
            text = StrHelpers.strsFromArr('name', value, ' - ')
          } else if (key === 'hatchSteps' || key === 'baseHappiness') {
            title = key === 'hatchSteps' ? 'Hatch Steps'
                    : 'Base Happiness'
            text = value
          }

          titleElement.innerText = title

          if (key === 'genderRate' && Array.isArray(text)) {
            const [male, female] = text
            const spanElement1 = document.createElement('span')
            const spanElement2 = document.createElement('span')
            const maleIcon = document.createElement('i')
            const femaleIcon = document.createElement('i')
            maleIcon.classList.add('fa-solid', 'fa-mars')
            femaleIcon.classList.add('fa-solid', 'fa-venus')
            textElement.appendChild(maleIcon)
            spanElement1.innerText = male + '%'
            textElement.appendChild(spanElement1)
            textElement.appendChild(femaleIcon)
            spanElement2.innerText = female + '%'
            textElement.appendChild(spanElement2)
          } else {
            textElement.innerText = text
          }
          
          if (key === 'captureRate') {
            let badge = document.createElement('span')
            let badgeType = value < 45 ? { className: 'badge-danger', text: 'rare' }
                          : value >= 45 && value < 105 ? { className: 'badge-warning', text: 'low' }
                          : value >= 105 && value < 175 ? { className: 'badge-info', text: 'fair' }
                          : { className: 'badge-success', text: 'good' }
            badge.classList.add('badge', badgeType.className)
            badge.innerText = StrHelpers.capitalize(badgeType.text)
            textElement.appendChild(badge)
          }
          
          colTitle.appendChild(titleElement)
          colValue.appendChild(textElement)
          row.appendChild(colTitle)
          row.appendChild(colValue)
          container.appendChild(row)
        })
        sectionContainer.appendChild(container)
        return sectionContainer
      }

      // Damage Relations
      function createEvolutions(evolutions) {
        const sectionContainer = document.createElement('div')
        sectionContainer.classList.add('d-flex', 'border-bottom', 'flex-column')
        sectionContainer.setAttribute('id', 'evolutionsSection')

        const titleContainer = document.createElement('div')
        titleContainer.classList.add('flex-grow-1', 'mt-2')
        const titleElement = document.createElement('h6')
        titleElement.innerText = 'Evolutions'
        titleContainer.appendChild(titleElement)
        sectionContainer.appendChild(titleContainer)

        // Evolution Card
        function createEvolutionCard(currEvolution, nextEvolution, isLast) {
          const rowContainer = document.createElement('div')
          rowContainer.classList.add('row', 'pb-3', 'position-relative')

          if (!isLast) rowContainer.classList.add('border-bottom')
          
          const currEvolutionColumnContainer = document.createElement('div')
          const nextEvolutionColumnContainer = document.createElement('div')
          currEvolutionColumnContainer.classList.add('col')
          nextEvolutionColumnContainer.classList.add('col')
          const currEvolutionCardContainer = document.createElement('div')
          const nextEvolutionCardContainer = document.createElement('div')
          currEvolutionCardContainer.classList.add('card', 'align-items-center', 'justify-content-center', 'border-0')
          nextEvolutionCardContainer.classList.add('card', 'align-items-center', 'justify-content-center', 'border-0')
          const currEvolutionImg = document.createElement('img')
          const nextEvolutionImg = document.createElement('img')
          currEvolutionImg.classList.add('card-img-top', 'small-card-img')
          nextEvolutionImg.classList.add('card-img-top', 'small-card-img')

          currEvolutionImg.setAttribute('src', currEvolution.species.imageUrl)
          nextEvolutionImg.setAttribute('src', nextEvolution.species.imageUrl)

          currEvolutionCardContainer.appendChild(currEvolutionImg)
          nextEvolutionCardContainer.appendChild(nextEvolutionImg)

          currEvolutionColumnContainer.appendChild(currEvolutionCardContainer)
          nextEvolutionColumnContainer.appendChild(nextEvolutionCardContainer)
          
          rowContainer.appendChild(currEvolutionColumnContainer)
          rowContainer.appendChild(nextEvolutionColumnContainer)

          const fullWidthDivider = document.createElement('div')
          fullWidthDivider.classList.add('w-100')
          const textElement = document.createElement('p')
          textElement.classList.add('small', 'text-center')
          textElement.innerText = `${StrHelpers.capitalize(currEvolution.species.name)} evolves into ${StrHelpers.capitalize(nextEvolution.species.name)} at level ${nextEvolution.details.minLevel}`
          fullWidthDivider.appendChild(textElement)

          const arrowContainer = document.createElement('div')
          arrowContainer.classList.add('position-absolute', 'evolution-arrow')
          const arrowIcon = document.createElement('i')
          arrowIcon.classList.add('fa-solid', 'fa-arrow-right')
          arrowContainer.appendChild(arrowIcon)
          
          rowContainer.appendChild(arrowContainer)
          rowContainer.appendChild(fullWidthDivider)
          return rowContainer
        }

        evolutions.forEach((currEvolution, i) => {
          if (i < evolutions.length - 1) {
            let nextEvolution = evolutions[i + 1]
            sectionContainer.appendChild(createEvolutionCard(currEvolution, nextEvolution, i + 1 === evolutions.length - 1))
          }
        })

        return sectionContainer
      }

      // Moves
      function createMoves(moves) {
        const movesSection = DOMBuilder.container('section', 'moves-section')
        const subHeader = DOMBuilder.subHeader('Moves', mainType)
        const movesContent = DOMBuilder.movesContent(moves)
        movesSection.appendChild(subHeader)
        movesSection.appendChild(movesContent)
        return movesSection
      }
      
      function createContentSections() {
        const sectionsArr = []
        const { stats, profile, evolutions, moves } = pokemon
        sectionsArr.push(createNameImageTypeStats(stats))
        sectionsArr.push(createProfileDetails(profile))
        sectionsArr.push(createEvolutions(evolutions))
        sectionsArr.push(createMoves(moves))
        sectionsArr.forEach(section => container.appendChild(section))
      }

      createContentSections()
      return container
    }

    // Function to show modal
    function showModal(pokemon) {
      return createModalContent(pokemon)
    }

    return {
      show: showModal
    }
  })()

  // Function to set listener and clear value of search bar
  function initSearchBar() {
    const searchBar = document.getElementById('searchBar')
    searchBar.value = ''
    searchBar.addEventListener('keyup', e => PokemonRepository.search(e))
  }

  // Function to create filter and sort drop down menus
  function initFilterAndSort() {
    DOMBuilder.dropDownMenu.typeFilter()
  } 

  // Init
  function initDOMElements() {
    initSearchBar()
    initFilterAndSort()
  }

  $('#myModal').on('show.bs.modal', function(e) {
    let pokemonCard = $(e.relatedTarget)[0]
    // Get pokemon from repository
    let pokemon = PokemonRepository.getPokemon(pokemonCard.getAttribute('data-pokemon-id'))
    PokemonRepository.getDetails(pokemon).then(() => {
      $('#myModal').find('.modal-title').text(StrHelpers.capitalize(pokemon.data.name))
      console.log(pokemon)
      $('#myModal').find('.modal-body').html(ModalBuilder.show(pokemon))
    }).catch(e => console.error(e))
    
  })
  
  // Create Element: Pokemon Card Item
  function createPokemonCard(pokemon) {
    const card = DOMBuilder.pokemonCard(pokemon)
    row.appendChild(card)
  }

  return {
    init: initDOMElements,
    createPokemon: createPokemonCard,
    createNavigation: DOMBuilder.navigation,
    createEmptyMessage: DOMBuilder.emptyMessage
  }

})()

let PokemonRepository = (function() {
  // Empty array of pokemon
  const pokemonMap = new Map()
  // API URL
  const apiUrlBuilder = (endpoint, idName) => `https://pokeapi.co/api/v2/${endpoint}/${idName}`
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'

  const fetchPokemon = function() {
    return new Promise((resolve, reject) => {
      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          return data.results.map(p => {
            return {
              name: p.name,
              detailsUrl: p.url
            }
          })
        })
        .then(res => {
          return res.map(p => {
            let pokemon = fetch(p.detailsUrl)
                            .then(res => res.json())
                            .then(res => {
                              p.id = res.id
                              p.imageUrl = res.sprites.front_default
                              p.types = res.types
                              return p
                            })
            return pokemon
          })
          
        })
        .then(res => Promise.all(res).then(pokemon => {
          resolve(makePokemonObj(pokemon))
        }))
        .catch(e => reject(e))
    })
  }

  const makePokemonObj = function(data) {
    function PokemonObj(name, detailsUrl, id, imageUrl, types) {
      this.data = {
        get name() { return name },
        get detailsUrl() { return detailsUrl },
        get id() { return id },
        get imageUrl() { return imageUrl },
        get types() { return types }
      }
    }

    Object.defineProperties(PokemonObj.prototype, {
      name: {
        get: function() { return this._name }
      },
      detailsUrl: {
        get: function() { return this._detailsUrl }
      }
    })

    data.forEach(item => {
      const { name, detailsUrl, id, imageUrl, types } = item
      let pokemon = new PokemonObj(name, detailsUrl, id, imageUrl, types)
      pokemonMap.set(pokemon.data.id, pokemon)
      PokemonDOMFactory.createPokemon(pokemon)
    })
  }

  const fetchRestOfPokemonDetails = async function(pokemon) {
    try {
      pokemon.stats = await fetchPokemonStats(pokemon)
      pokemon.profile = await fetchPokemonProfile(pokemon)
      pokemon.evolutions = await fetchPokemonEvolutions(pokemon)
      pokemon.moves = await fetchPokemonMoves(pokemon)
    } catch(e) {
      console.error(e)
    }
  }
  const fetchPokemonStats = async function(pokemon) {
    let detailsUrl = pokemon.data.detailsUrl
    let promise = new Promise((resolve, reject) => {
      fetch(detailsUrl)
        .then(res => res.json())
        .then(res => resolve(res.stats))
        .catch(e => reject(e))
    })
    let result = await promise
    return result
  }
  const fetchPokemonProfile = async function(pokemon) {
    let speciesUrl = apiUrlBuilder('pokemon-species', pokemon.data.id)
    let promise = new Promise((resolve, reject) => {
      fetch(speciesUrl)
        .then(res => res.json())
        .then(res => {
          const profile = {
            captureRate: res.capture_rate,
            eggGroups: res.egg_groups,
            genderRate: res.gender_rate,
            hatchSteps: res.hatch_counter * 255,
            baseHappiness: res.base_happiness
          }
          return fetch(pokemon.data.detailsUrl)
                  .then(res => res.json())
                  .then(res => {
                    profile.abilities = res.abilities
                    profile.height = res.height
                    profile.weight = res.weight
                    return profile
                  })
        })
        .then(res => resolve(res))
        .catch(e => reject(e))
    })
    let result = await promise
    return result
  }
  const fetchPokemonEvolutions = async function(pokemon) {
    let speciesUrl = apiUrlBuilder('pokemon-species', pokemon.data.id)
    let promise = new Promise((resolve, reject) => {
      fetch(speciesUrl)
        .then(res => res.json())
        .then(res => {
          return fetch(res.evolution_chain.url)
                  .then(res => res.json())
                  .then(res => {
                    return parseEvolutions(res.chain)
                  })
        })
        .then(res => resolve(res))
        .catch(e => reject(e))
    })
    let result = await promise
    return result
  }
  const fetchPokemonMoves = async function(pokemon) {
    let movesUrl = apiUrlBuilder('pokemon', pokemon.data.id)
    let promise = new Promise((resolve, reject) => {
      fetch(movesUrl)
        .then(res => res.json())
        .then(res => {
          return res.moves.map(m => {
            const { move, version_group_details } = m
            const { name, url } = move
            return fetch(url)
                    .then(res => res.json())
                    .then(res => {
                      const { accuracy, power, pp, type, effect_entries } = res
                      return new Move(name, version_group_details, accuracy, power, pp, type, effect_entries)
                    })
                    .catch(e => console.error(e))
          })
        })
        .then(res => {
          Promise.all(res).then(values => {
            return resolve(makeMovesLibrary(values))
          })
        })
        .catch(e => reject(e))
    })
    let result = await promise
    return result
  }  

  // Function to get the id of the species at the end of the url: found at https://stackoverflow.com/questions/39160539/regex-pattern-to-get-number-between-forward-slashes-at-the-end-of-a-url
  function getId(s) {
    let m = s.match(/\/(\d+)\//)
    return m[1]
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

  function MovesLibrary(moveArrs) {
    this.data = {
      get natural() { return moveArrs.natural },
      get machine() { return moveArrs.machine },
      get tutor() { return moveArrs.tutor },
      get egg() { return moveArrs.egg }
    }
    this.sortNatural = function() {
      return this.data.natural.sort((a, b) => a.details.level > b.details.level)
    }
    this.sortAlphabetical = function() {
      return {
        machine: this.data.machine.sort((a, b) => a.details.name > b.details.name),
        tutor: this.data.tutor.sort((a, b) => a.details.name > b.details.name),
        egg: this.data.egg.sort((a, b) => a.details.name > b.details.name)
      }
    }
  }

  function makeMovesLibrary(moves) {
    const moveTypes = {
      natural: [],
      machine: [],
      tutor: [],
      egg: []
    }
    moves.forEach(move => {
      const moveGroup = move.details.group
      if (moveTypes[moveGroup]) moveTypes[moveGroup].push(move)
    })
    return new MovesLibrary(moveTypes)
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

  function filterPokemon(displayAll) {
    let allCards = Array.from(document.querySelectorAll('[data-pokemon]'))
    let typeFilters = Array.from(document.querySelectorAll('.type-filter'))
    const listItemsTypeAll = Array.from(document.querySelectorAll('[data-pokemon-type = all]'))

    function displayAllCards() {
      allCards.forEach(card => {
        if (card.classList.contains('hidden')) card.classList.remove('hidden')
        if (card.classList.contains('filtered')) card.classList.remove('filtered')
      })
      listItemsTypeAll.forEach(listItem => listItem.classList.add('selected'))
    }

    function displayCards(arr, isVisible) {
      function toggleClasses(card) {
        let classNameAdded = isVisible ? 'filtered' : 'hidden'
        let classNameRemoved = isVisible ? 'hidden' : 'filtered'
        if (card.classList.contains(classNameRemoved)) card.classList.remove(classNameRemoved)
        if (!card.classList.contains(classNameAdded)) card.classList.add(classNameAdded)
      }
      arr.forEach(card => toggleClasses(card))
    }

    function containsType(arr1, arr2) {
      for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i] === arr2[j]) return true
        }
      }
      return false
    }

    if (displayAll) {
      return displayAllCards()
    } else {
      listItemsTypeAll.forEach(listItem => {
        if (listItem.classList.contains('selected')) listItem.classList.remove('selected')
      })
      // if (allListItem.classList.contains('selected')) allListItem.classList.remove('selected')
      let visibleCards = []
      let hiddenCards = []

      let isSelected = typeFilters.filter(typeFilter => typeFilter.classList.contains('selected'))
      
      if (isSelected.length === 0) return displayAllCards()

      const selectedTypes = isSelected.map(selection => selection.innerText.toLowerCase())

      for (let [key, value] of pokemonMap) {
        const { name, types } = value.data
        const pokemonCard = document.querySelector(`[data-pokemon = ${name}]`)

        const typesArr = types.map(typeObj => {
          return typeObj.type.name
        })

        if (containsType(selectedTypes, typesArr)) visibleCards.push(pokemonCard)
        else hiddenCards.push(pokemonCard)
      }
      displayCards(visibleCards, true)
      displayCards(hiddenCards)
    }
  }

  function searchPokemon(e) {
    const { value } = e.target

    function resetFilters() {
      // Reset the type filters
      filterPokemon(true)
      // Loop over each filter list item and remove selected class
      const selectedFilters = Array.from(document.querySelectorAll('.selected'))
      selectedFilters.forEach(filter => filter.classList.remove('selected'))
      // Set the selected filter to 'All'
      Array.from(document.querySelectorAll('[data-pokemon-type=all]')).forEach(item => item.classList.add('selected'))
    }
    resetFilters()
    
    const pokemonCards = Array.from(document.querySelectorAll(`[data-pokemon]`))
    let hiddenCount = 0
    pokemonCards.forEach(card => {
      const cardName = card.dataset.pokemon
      if (cardName.toUpperCase().indexOf(value.toUpperCase()) > -1) {
        card.style.display = ''
      } else {
        card.style.display = 'none'
        hiddenCount++
      }
    })
    if (hiddenCount === pokemonCards.length) {
      PokemonDOMFactory.createEmptyMessage()
    } else {
      const emptyMessage = document.querySelector('.nothing-found-container')
      if (emptyMessage) emptyMessage.remove()
    }
  }

  function clearPokemonCardsContainer() {
    const pokemonCardsContainer = document.getElementById('pokemonCardsContainer').children[0]
    while (pokemonCardsContainer.children.length > 0) {
      pokemonCardsContainer.children[0].remove()
    }
  }

  function populatePokemonCardsContainer(cards) {
    const pokemonCardsContainer = document.getElementById('pokemonCardsContainer').children[0]
    cards.forEach(card => pokemonCardsContainer.appendChild(card))
  }

  function sortPokemon(sortBy, isSelected) {
    let allCards = Array.from(document.querySelectorAll('[data-pokemon]'))
    let newSort
    if (isSelected) {
      newSort = allCards.sort((cardA, cardB) => {
        if (sortBy === 'A-Z') return cardA.dataset.pokemon > cardB.dataset.pokemon
        else if (sortBy === 'Z-A') return cardA.dataset.pokemon < cardB.dataset.pokemon
      })
    } else {
      newSort = allCards.sort((cardA, cardB) => {
        return parseInt(cardA.dataset.pokemonId) > parseInt(cardB.dataset.pokemonId)
      })
    }
    clearPokemonCardsContainer()
    populatePokemonCardsContainer(newSort)
  }

  function getPokemonById(id) {
    return pokemonMap.get(parseInt(id))
  }

  return {
    init: fetchPokemon,
    getDetails: fetchRestOfPokemonDetails,
    filter: filterPokemon,
    search: searchPokemon,
    sort: sortPokemon,
    getPokemon: getPokemonById,
    get pokemon() { return pokemonMap }
  }
})()

PokemonRepository.init()
PokemonDOMFactory.init()
// PokemonDOMFactory.createNavigation()