const Model = require('./model')
const View = require('./view')
const config = require('./config')
const moduleMap = require('./yaMap')

module.exports = {
  init() {
    Model.login(config.key, 2)
      .then(() => Model.getFriends({ fields: 'name,lastname,photo_100,country,city' }))

      .then((result) => View.insertFriends(result))

      .then(() => Model.insertFromStorage())

      .then(result => {
        console.log('insertedFromStorage') 
        this.insertChoosenFriends(result)
      })
      
      .then(() => this.renderPlacemarks())

    document.addEventListener('click', () => this.delegateClick(event))
    document.addEventListener('keyup', () => this.delegateKeyUp(event))
  },

  delegateClick() {

    if (event.target.dataset.state) {
      return this.changeState(event.target.dataset.state)
    }

    if (event.target.className == 'footer__button-save') {
      return this.saveListOfFriends()
    }

    if (event.target.className == 'user-plus' || 'user-minus') {
      const firstZone = document.querySelector('.your-friends__list-item')
      const secondZone = document.querySelector('.list-friends__list-item')
      
      this.changeItemPlace(event.target, event.target.className, [firstZone, secondZone])
      this.renderList(document.querySelector('.search-one_input').value, document.querySelectorAll('.your-friends__list-item .full-name'))
      return
    }
  },

  delegateKeyUp() {
    if (event.target.className == 'search-one_input') this.renderList(document.querySelector('.search-one_input').value, document.querySelectorAll('.your-friends__list-item .full-name'))
  },

  changeState(state){
    Model.appState = state;
    console.log(`appState = ${Model.appState}`)
    View.showAppState(Model.appState)
  },

  saveListOfFriends() {
    console.log('save List Of Friends')
    const selectedFriends = document.querySelector('.list-friends__list-item').children;
    const reestablish = [];

    for (friend of selectedFriends){
      const obj = {}
      obj.name = friend.firstElementChild.lastElementChild.innerText,
      obj.id = friend.id,
      obj.place = friend.dataset.place,
      obj.photo = friend.firstElementChild.firstElementChild.src
      
      reestablish.push(obj)
    }

    Model.saveToLocalStorage(reestablish)

    this.renderPlacemarks()
  },
  

  changeItemPlace(element,className,places) {
    if (className == 'user-plus') {
      element.className = 'user-minus'
      places[1].appendChild(element.parentNode)
    }

    if (className == 'user-minus') {
      element.className = 'user-plus'
      places[0].insertBefore(element.parentNode, places[0].firstChild);
    }
  },


  insertChoosenFriends(choosenFriends) {
    console.log('choosen friends are inserting')
    if (!choosenFriends) return
    
    for (obj of choosenFriends){
      document.getElementById(obj.id).lastElementChild.className = 'user-minus';
      View.insertElement(document.getElementById(obj.id), document.querySelector('.list-friends__list-item'))
    }
  },


  renderPlacemarks(){
    console.log('placemarks have been rendered')

    const arrayOfFriends = Model.insertFromStorage()
    
    moduleMap.deleteAllPlaceMarks()

    arrayOfFriends.filter(friend => friend.place && friend.name && friend.photo)
      .map(friend => {

        const arrayData = [friend.name, friend.place, friend.photo]
        return arrayData
      })
      .map(array => moduleMap.insertPlaceMark(...array))
  },


  renderList(string, array) {
    for(element of array){
      if (!Model.isMatching(element.textContent, string)) {
        View.showElem(element.parentNode.parentNode, 'hide')
      }
      else {
        View.showElem(element.parentNode.parentNode, 'show')
      }
    }
  },

}

