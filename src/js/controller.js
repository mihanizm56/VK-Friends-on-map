const Model = require('./model')
const View = require('./view')
const config = require('./config')

module.exports = {
  init() {
    Model.login(config.key, 2)
      .then(() => Model.getFriends({ fields: 'name,lastname,photo_100,country,city' }))
      .then((result) => View.insertFriends(result))
      .then(()=>{
        Model.insertFromStorage
      })


    this.objectListener(document, 'click')
    this.objectListener(document, 'keyup')
  },

  objectListener(object, type) {
    if (type == 'click') object.addEventListener(type, () => this.delegateClick(event))
    //if (type == 'keyup') object.addEventListener(type, () => this.delegateKeyUp(event))
  },

  delegateClick() {

    if (event.target.dataset.state) {
      return this.changeState(event.target.dataset.state)
    }

    if (event.target.className == 'footer__button-save') {
      return this.saveListOfFriends()
    }

    if (event.target.className == 'user-plus' || 'user-minus') {
      console.log('delegateClick user')
      const firstZone = document.querySelector('.your-friends__list-item')
      const secondZone = document.querySelector('.list-friends__list-item')
      return this.changeItemPlace(event.target, event.target.className, [firstZone,secondZone])
      //this.renderList(document.querySelectorAll('.your-friends__list-item .full-name'), document.querySelector('.search-one_input'))
    }
  },

  changeState(state){
    Model.appState = state;
    console.log(`appState = ${Model.appState}`)
    View.showAppState(Model.appState)
  },

  saveListOfFriends() {
    console.log('saveListOfFriends')
    const selectedItems = document.querySelector('.list-friends__list-item').children;
    const reestablish = [];

    for (let i = 0; i < selectedItems.length; i++) {
      const obj = {
        name : selectedItems[i].dataset.name,
        id : selectedItems[i].id,
        place : selectedItems[i].dataset.place,
        photo : selectedItems[i].dataset.photo
      }

      reestablish.push(obj)
    }

    Model.saveToLocalStorage(reestablish)
    //Model.renderPlacemarks(Model.insertFromStorage())
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




  // delegateKeyUp() {
  //   if (event.target.className == 'search-one_input') Model.renderList(document.querySelectorAll('.your-friends__list-item .full-name'), document.querySelector('.search-one_input'))
  // },

}

