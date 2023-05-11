// IIFE for creating pokemon cards
let PokemonDOMFactory = (function() {

  // DOM Element: Container of Pokemon
  const pokemonCardsContainer = document.getElementById('pokemonCardsContainer')
  const row = document.createElement('div')
  row.classList.add('row', 'justify-content-center', 'scroll-y', 'larger-mobile')
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
      if (document.querySelector('.nothing-found-container')) return
      const element = createTextContainer(['nothing-found-container'], 'h5', 'No pokemon')
      console.log(element)
      document.body.appendChild(element)
    }

    // Pokemon Card
    function createPokemonCard(pokemon) {
      const { name, imageUrl, types } = pokemon.data
      const cardContainer = document.createElement('div')
      cardContainer.classList.add('border-dark', 'pokemon-card', 'text-white', 'bg-dark', 'rounded', 'p-5', 'position-relative')
      cardContainer.setAttribute('data-pokemon', name)
      cardContainer.setAttribute('data-pokemon-id', pokemon.data.id)
      cardContainer.setAttribute('data-toggle', 'modal')
      cardContainer.setAttribute('data-target', '#myModal')

      const imgContainer = document.createElement('div')
      imgContainer.classList.add('img-container', 'flex-2')
      const imgElement = document.createElement('img')
      imgElement.classList.add('card-img-top', 'pokemon-card-image')
      imgElement.setAttribute('src', imageUrl)
      imgContainer.appendChild(imgElement)

      const cardBody = document.createElement('div')
      cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'align-items-start', 'justify-content-start', 'p-0')

      const cardTitle = document.createElement('h6')
      cardTitle.classList.add('card-title', 'mb-0', 'pokemon-card-title', 'text-light')
      cardTitle.innerText = StrHelpers.capitalize(name)

      const typesContainer = document.createElement('span')
      typesContainer.classList.add('d-flex', 'justify-content-between', 'pokemon-card-types-element')
      types.forEach(type => {
        let typeElement = document.createElement('span')
        typeElement.classList.add('badge')
        typeElement.dataset.pokemonType = type.type.name
        typeElement.innerText = StrHelpers.capitalize(type.type.name)
        typesContainer.appendChild(typeElement)
      })

      cardBody.appendChild(cardTitle)
      cardBody.appendChild(typesContainer)

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
        titleElement.classList.add('lead')
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
        titleElement.classList.add('lead')
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
        const sectionContainer = document.createElement('div')
        sectionContainer.classList.add('d-flex', 'border-bottom', 'flex-column')
        sectionContainer.setAttribute('id', 'movesSection')

        const titleContainer = document.createElement('div')
        titleContainer.classList.add('flex-grow-1', 'mt-2')
        const titleElement = document.createElement('h6')
        titleElement.classList.add('lead')
        titleElement.innerText = 'Moves'
        titleContainer.appendChild(titleElement)
        sectionContainer.appendChild(titleContainer)

        const accordionContainer = document.createElement('div')
        accordionContainer.setAttribute('id', 'accordion')
        
        function createAccordionCard(moves, groupName) {
          const cardContainer = document.createElement('div')
          cardContainer.classList.add('card')
          
          // Card Header & Collapse Button
          const cardHeader = document.createElement('div')
          cardHeader.classList.add('card-header', 'bg-secondary', 'text-light')
          cardHeader.setAttribute('id', `${groupName}Heading`)
          const headerWrapper = document.createElement('h5')
          headerWrapper.classList.add('mb-0')
          headerWrapper.innerText = StrHelpers.capitalize(groupName) + ' Moves'
          const collapseButton = document.createElement('button')
          collapseButton.classList.add('btn', 'w-100')
          collapseButton.dataset.toggle = 'collapse'
          collapseButton.dataset.target = `#${groupName}Collapse`
          collapseButton.setAttribute('aria-expanded', 'true')
          collapseButton.setAttribute('aria-controls', `${groupName}Collapse`)
          collapseButton.appendChild(headerWrapper)
          cardHeader.appendChild(collapseButton)
          cardContainer.appendChild(cardHeader)

          // Collapse Content
          const collapseContainer = document.createElement('div')
          collapseContainer.classList.add('collapse')
          collapseContainer.setAttribute('id', `${groupName}Collapse`)
          collapseContainer.setAttribute('aria-labelledby', `${groupName}Heading`)
          collapseContainer.dataset.parent = '#accordion'
          const cardBody = document.createElement('div')
          cardBody.classList.add('card-body', 'p-0')

          // Loop through moves to create elements to then append to the cardBody
          moves.forEach(move => {
            const { name, level, accuracy, power, effect, pp, type } = move.details

            const moveContainer = document.createElement('div')
            moveContainer.classList.add('card', 'border-bottom', 'border-left-0', 'border-right-0', 'border-top-0')

            const moveCardBody = document.createElement('div')
            moveCardBody.classList.add('card-body', 'd-flex', 'justify-content-evenly', 'align-items-center')

            if (level > 0) {
              const levelElement = document.createElement('p')
              levelElement.classList.add('small')
              levelElement.innerText = level
              moveCardBody.appendChild(levelElement)
            }

            const moveTitleElement = document.createElement('p')
            moveTitleElement.classList.add('card-title', 'm-0', 'flex-grow-1')
            moveTitleElement.innerText = StrHelpers.capitalize(name)

            const moveTypeElement = document.createElement('span')
            moveTypeElement.classList.add('badge', 'small', 'text-light')
            moveTypeElement.dataset.pokemonType = type
            moveTypeElement.innerText = type.toUpperCase()

            
            const moveToggleButton = document.createElement('button')
            moveToggleButton.classList.add('btn')
            moveToggleButton.setAttribute('type', 'button')
            moveToggleButton.dataset.toggle = 'collapse'
            moveToggleButton.dataset.target = `#${name}Move`
            moveToggleButton.setAttribute('aria-expanded', 'false')
            moveToggleButton.setAttribute('aria-controls', `${name}Move`)
            const caretDown = document.createElement('i')
            caretDown.classList.add('fa-solid', 'fa-caret-down')
            moveToggleButton.appendChild(caretDown)

            moveCardBody.appendChild(moveTitleElement)
            moveCardBody.appendChild(moveTypeElement)
            moveCardBody.appendChild(moveToggleButton)
            moveContainer.appendChild(moveCardBody)

            const moveDetailsCollapseContainer = document.createElement('div')
            moveDetailsCollapseContainer.classList.add('collapse')
            moveDetailsCollapseContainer.setAttribute('id', `${name}Move`)
            const moveDetailsCollapseCard = document.createElement('div')
            moveDetailsCollapseCard.classList.add('card', 'card-body', 'bg-light', 'border-0', 'rounded-0')
            
            const moveStatsContainer = document.createElement('div')
            moveStatsContainer.classList.add('move-stats-container')
            const powerTitle = document.createElement('p')
            powerTitle.innerText = `Power: ${power ? power : 'N/A'}`
            const accuracyTitle = document.createElement('p')
            accuracyTitle.innerText = `Power: ${accuracy ? accuracy : 'N/A'}`
            const ppTitle = document.createElement('p')
            ppTitle.innerText = `Power: ${pp ? pp : 'N/A'}`
            moveStatsContainer.appendChild(powerTitle)
            moveStatsContainer.appendChild(accuracyTitle)
            moveStatsContainer.appendChild(ppTitle)

            const moveEffectContainer = document.createElement('div')
            moveEffectContainer.classList.add('move-effect-container')
            const moveEffectContent = document.createElement('p')
            moveEffectContainer.innerText = effect
            moveEffectContainer.appendChild(moveEffectContent)

            moveDetailsCollapseCard.appendChild(moveStatsContainer)
            moveDetailsCollapseCard.appendChild(moveEffectContainer)

            moveDetailsCollapseContainer.appendChild(moveDetailsCollapseCard)
            moveContainer.appendChild(moveDetailsCollapseContainer)
            cardBody.appendChild(moveContainer)
          })

          collapseContainer.appendChild(cardBody)
          cardContainer.appendChild(collapseContainer)
          return cardContainer
        }

        accordionContainer.appendChild(createAccordionCard(moves.sortNatural(), 'natural'))
        accordionContainer.appendChild(createAccordionCard(moves.sortAlphabetical().machine, 'machine'))
        accordionContainer.appendChild(createAccordionCard(moves.sortAlphabetical().tutor, 'tutor'))
        accordionContainer.appendChild(createAccordionCard(moves.sortAlphabetical().egg, 'egg'))
        
        sectionContainer.appendChild(accordionContainer)
        
        return sectionContainer
      }
      
      function appendSections() {
        const sectionsArr = []
        const { stats, profile, evolutions, moves } = pokemon
        sectionsArr.push(createNameImageTypeStats(stats))
        sectionsArr.push(createProfileDetails(profile))
        if (evolutions.length > 1) sectionsArr.push(createEvolutions(evolutions))
        sectionsArr.push(createMoves(moves))
        sectionsArr.forEach(section => container.appendChild(section))
      }

      appendSections()
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

  function loadPokemonCards() {
    const row = document.createElement('div')
    row.classList.add('row', 'justify-content-center', 'scroll-y', 'larger-mobile')
    pokemonCardsContainer.appendChild(row)
    for (let [key, value] of PokemonRepository.pokemon) {
      const card = DOMBuilder.pokemonCard(value)
      row.appendChild(card)
    }
  }

  return {
    init: initDOMElements,
    createPokemon: createPokemonCard,
    createNavigation: DOMBuilder.navigation,
    createEmptyMessage: DOMBuilder.emptyMessage,
    loadPokemonCards
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

      if (visibleCards.length === 0) {
        PokemonDOMFactory.createEmptyMessage()
      } else {
        const emptyMessage = document.querySelector('.nothing-found-container')
        if (emptyMessage) emptyMessage.remove()
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

let GameControl = (function() {
  // Variables to see if a game is currently happening, tracking total correct answers, and more
  let isPlaying = false
  let lives
  let pokemonUsedIds = []
  let pokemonMap = PokemonRepository.pokemon
  let correctAnswers = 0
  let wrongAnswers = 0
  
  // Start Game Listener & Functions
  const startGameButton = document.getElementById('startGameButton')
  startGameButton.addEventListener('click', function(e) {
    e.preventDefault()
    if (isPlaying) return
    this.setAttribute('disabled', 'true')
    clearPokemonList()
    isPlaying = true
    lives = 5
    playGame()
  })

  const pokemonCardsContainer = document.getElementById('pokemonCardsContainer')

  // Function to get random number
  const getRandomNumber = () => {
    // if array of pokemon used id length equals the number of pokemon, return and end game with a win
    if (pokemonUsedIds.length > 150 - 1) return null

    let output = null

    // if the randomly generated number is in the pokemon used ids array, reroll
    while (output === null || pokemonUsedIds.includes(output)) {
      output = Math.floor(Math.random() * (150 - 1) + 1)
    }
    return output
  }

  function clearPokemonList() {
    // Next, clear the pokemon cards container child element
    pokemonCardsContainer.children[0].remove()

    // Hide the filter by types containers
    document.getElementById('filterTypesContainer-Desktop').classList.toggle('hidden')
    document.getElementById('navbarToggler').setAttribute('disabled', 'true')
  }
  
  // Function to set up the game and start it
  function playGame() {
    const pokemon = pokemonMap.get(getRandomNumber())
    const { name, id, imageUrl } = pokemon.data
    pokemonUsedIds.push(id)
    pokemonCardsContainer.appendChild(createQuestionCard(imageUrl))
    
    document.getElementById('submitPokemonAnswer').onclick = function() {
      let userAnswer = document.getElementById('nameThatPokemonInput').value

      let img = document.getElementById('whoseThatPokemonImage')
      img.classList.remove('filtered-img')

      let feedbackStr

      if (userAnswer.toLowerCase().trim() == name) {
        feedbackStr = `Correct! The pokemon is ${name}`
        correctAnswers++
      } else {
        lives--
        wrongAnswers++
        if (lives === 0) feedbackStr = `Game over! You answered a total of ${correctAnswers} right out of ${correctAnswers + wrongAnswers}. Better luck next time!`
        else {
          feedbackStr = `Incorrect! You answered ${userAnswer}, but the pokemon is ${name}.`
          if (lives > 1) feedbackStr += `You have ${lives} lives left.`
          else feedbackStr += `You only have ${lives} life left!`
        }
      }

      createFeedBack(feedbackStr, lives !== 0)
    }
    
  }

  function resetGame() {
    isPlaying = true
    lives = 5
    pokemonUsedIds = []
    correctAnswers = 0
    wrongAnswers = 0
    playGame()
  }
  
  function endGame() {
    isPlaying = false
    lives = 0
    pokemonUsedIds = []
    correctAnswers = 0
    wrongAnswers = 0
    startGameButton.removeAttribute('disabled')
    document.getElementById('filterTypesContainer-Desktop').classList.toggle('hidden')
    document.getElementById('navbarToggler').removeAttribute('disabled')
    PokemonDOMFactory.loadPokemonCards()
  }

  // Function to create a card element with passed pokemon
  function createQuestionCard(imageUrl) {
    const container = document.createElement('div')
    container.classList.add('card', 'w-25', 'mx-auto')
    container.setAttribute('id', 'whoseThatPokemonCard')
    
    const imgElement = document.createElement('img')
    imgElement.classList.add('card-img-top', 'filtered-img')
    imgElement.setAttribute('id', 'whoseThatPokemonImage')
    imgElement.setAttribute('src', imageUrl)

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    const formContainer = document.createElement('form')
    const formGroupContainer = document.createElement('div')
    formGroupContainer.classList.add('form-group')
    const labelElement = document.createElement('label')
    labelElement.setAttribute('for', 'nameThatPokemon')
    labelElement.innerText = `Who's That Pokemon?`
    const input = document.createElement('input')
    input.classList.add('form-control')
    input.setAttribute('id', 'nameThatPokemonInput')
    input.setAttribute('type', 'text')
    input.placeholder = '...'
    const submitButton = document.createElement('button')
    submitButton.classList.add('btn', 'btn-primary')
    submitButton.setAttribute('id', 'submitPokemonAnswer')
    submitButton.setAttribute('type', 'submit')
    submitButton.innerText = 'Submit'

    submitButton.addEventListener('click', function(e) {
      e.preventDefault()
      this.setAttribute('disabled', 'true')
    })

    formGroupContainer.appendChild(labelElement)
    formGroupContainer.appendChild(input)
    formContainer.appendChild(formGroupContainer)
    formContainer.appendChild(submitButton)

    cardBody.appendChild(formContainer)
    container.appendChild(imgElement)
    container.appendChild(cardBody)

    return container
  }

  // Function to display feedback to user
  function createFeedBack(feedbackStr, canContiue) {
    const cardContainer = document.getElementById('whoseThatPokemonCard')
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    cardBody.setAttribute('id', 'feedback')
    const msg = document.createElement('p')
    msg.innerText = feedbackStr
    cardBody.appendChild(msg)

    if (canContiue) {
      let nextButton = document.createElement('button')
      nextButton.classList.add('btn', 'btn-secondary')
      nextButton.innerText = 'Click for Next Question'

      nextButton.addEventListener('click', (e) => {
        e.preventDefault()
        cardContainer.remove()
        playGame()
      })
      cardBody.appendChild(nextButton)
    } else {
      let playAgainButton = document.createElement('button')
      playAgainButton.classList.add('btn', 'btn-success')
      playAgainButton.innerText = 'Play Again?'
      let goBackToListButton = document.createElement('button')
      goBackToListButton.classList.add('btn', 'btn-secondary')
      goBackToListButton.innerText = 'Return to Pokedex'

      playAgainButton.addEventListener('click', (e) => {
        e.preventDefault()
        cardContainer.remove()
        resetGame()
      })

      goBackToListButton.addEventListener('click', (e) => {
        e.preventDefault()
        cardContainer.remove()
        endGame()
      })
      cardBody.appendChild(playAgainButton)
      cardBody.appendChild(goBackToListButton)
    }
    
    cardContainer.appendChild(cardBody)
  }
})()