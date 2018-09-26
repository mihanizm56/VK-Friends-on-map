
const View = require('./view')
const moduleMap = require('./yaMap')

module.exports = {
  stateOfApp: 0,

  changeState(state) {
    this.stateOfApp = state
    View.showState(this.stateOfApp)
  },

  insertFromStorage() {
    // Вывести из хранилища если есть там что то
    if (localStorage.data) {
      return JSON.parse(localStorage.data)
    }
  },

  vkInit(key) {
    console.log('app started')
    VK.init({
      apiId: key
    })
  },
  
  vkAuth() {
    VK.Auth.login(data => {
      if (!data.session) {
        throw new Error('Не удалось авторизоваться!')
      }
    }, 2)
  },

  vkCallApi(method, params) {
    console.log('vkCallApi')
    params.v = '5.76';
    VK.api(method, params, (data) => {
      if (data.error) {
        throw new Error(data.error)
      }

      View.insertFriends(data.response)
      View.insertChoosenFriends(this.insertFromStorage())

      this.renderPlacemarks(this.insertFromStorage())
    })
  },

  renderPlacemarks(arrayOfFriends){
    console.log('renderPlacemarks')
    moduleMap.deleteAllPlaceMarks()
    
    arrayOfFriends.filter(friend => friend.place && friend.name && friend.photo)
      .map(friend => {

        const arrayData = [friend.name, friend.place, friend.photo]

        return arrayData
      })
      .map(array => moduleMap.insertPlaceMark(array[0], array[1], array[2]))
  },

  cleanLocalStorage(){
    localStorage.data = ''
  },

  saveToLocalStorage(object) {
    console.log('saved to storage')

    localStorage.data = JSON.stringify(object);
  },

  renderList(arr = [], element) {
    for (let i = 0; i < arr.length; i++) {
      if (!this.isMatching(arr[i].textContent, element.value)) {
        View.showElem(arr[i].parentNode.parentNode, 'hide')
      }
      else {
        View.showElem(arr[i].parentNode.parentNode, 'show')
      }
    }
  },

  isMatching(full, chunk) {
    return full.toUpperCase().indexOf(chunk.toUpperCase()) > -1;
  }
}
