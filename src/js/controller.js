const Model = require('./model')
const View = require('./view')
const config = require('./config')

module.exports = {
  init() {
    Model.vkInit(config.key)
    Model.vkAuth()
    Model.vkCallApi('friends.get', { fields: 'name,lastname,photo_100,country,city' })


    this.objectListener(document, 'click')
    this.objectListener(document, 'keyup')
  },

  objectListener(object, type) {
    if (type == 'click') object.addEventListener(type, () => this.delegateClick(event))
    if (type == 'keyup') object.addEventListener(type, () => this.delegateKeyUp(event))
  },

  delegateClick() {

    if (event.target.dataset.state) Model.changeState(event.target.dataset.state)

    if (event.target.className == 'user-plus' || 'user-minus') {
      View.changeItemIcon(event)
      Model.renderList(document.querySelectorAll('.your-friends__list-item .full-name'), document.querySelector('.search-one_input'))
    }

    if (event.target.className == 'footer__button-save') this.saveList()
  },

  delegateKeyUp() {
    if (event.target.className == 'search-one_input') Model.renderList(document.querySelectorAll('.your-friends__list-item .full-name'), document.querySelector('.search-one_input'))
  },

  saveList() {
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
    Model.renderPlacemarks(Model.insertFromStorage())
  }
}

