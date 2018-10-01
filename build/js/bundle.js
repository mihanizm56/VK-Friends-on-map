(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

const Controller = require('./controller.js')
const moduleMap = require('./yaMap')

Controller.init()
moduleMap.init()

},{"./controller.js":3,"./yaMap":6}],2:[function(require,module,exports){

module.exports = {
  key:'6669747',
  mapContainer: 'map'
}
},{}],3:[function(require,module,exports){
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


},{"./config":2,"./model":4,"./view":5,"./yaMap":6}],4:[function(require,module,exports){

module.exports = {
  appState: 0,

  login(appId, perms){
    return new Promise((resolve,reject)=>{
      VK.init({
        apiId: appId
      });

      VK.Auth.login(response => {
        if(response.session) resolve(response)
        else reject(new Error('Не удалось авторизоваться'))
      },perms)
    })
  },
  callApi(method,params){
    params.v = params.v || '5.78';
    return new Promise((resolve,reject)=>{
      VK.api(method,params, response => {
        if (response.error) reject(new Error(response.error.error_msg))
        else resolve(response.response)
      })
    })
  },
  getFriends(params={}){
    return this.callApi('friends.get',params)
  },

  insertFromStorage() {
    if (localStorage.data) {
      return JSON.parse(localStorage.data)
    }
  },

  cleanLocalStorage(){
    console.log('storage is cleared')
    localStorage.data = ''
  },//вспомогательная функция

  saveToLocalStorage(object) {
    console.log('saved to storage')
    localStorage.data = JSON.stringify(object);
  },

  isMatching(full, chunk) {
    return full.toUpperCase().indexOf(chunk.toUpperCase()) > -1;
  }
}

},{}],5:[function(require,module,exports){


module.exports = {
  showAppState(state) {
    const layout = document.querySelector('.layout');
    const app = document.querySelector('.main-wrapper__container');
    const mapWrapper = document.getElementById('mapWrapper');
    const btnCloseMap = document.querySelector('.map-wrapper__button-close');
    const btnOpenMap = document.querySelector('.map-wrapper__button-open');
    const mapContainer = document.getElementById('map');

    if (state == 1) {
      layout.style.display = 'block';
      app.style.display = 'block';
      mapWrapper.className = 'container__map-wrapper';
      mapContainer.style.display = 'none';
      btnCloseMap.style.display = 'none';
      btnOpenMap.style.display = 'block';
      return
    } 
    if (state == 2) {
      layout.style.display = 'block';
      app.style.display = 'block';
      mapWrapper.className = 'container__map-active-wrapper';
      mapContainer.style.display = 'flex';
      btnCloseMap.style.display = 'block';
      btnOpenMap.style.display = 'none';
      return
    }

    layout.style.display = 'none';
    app.style.display = 'none';
  },

  insertFriends(friends) {
    const template = document.querySelector('#user-template').textContent;
    const render = Handlebars.compile(template);
    const renderFriends = render(friends);
    const results = document.querySelector('.your-friends__list-item');
    results.innerHTML = renderFriends;
  },

  showElem(element, prop) {
    if (prop == 'show') { element.style.display = 'flex' }
    if (prop == 'hide') { element.style.display = 'none' }
  },

  insertElement(whatToInsert,whereToInsert){
    whereToInsert.appendChild(whatToInsert);
  }
}

},{}],6:[function(require,module,exports){

const config = require('./config')

module.exports = {
  init(){
    new Promise(resolve => ymaps.ready(resolve))
      .then(() => {
        this.createMap(config.mapContainer)
      })
  },

  createMap(container){
    let myMap;
    
    myMap = new ymaps.Map(container, {
      center: [55.76, 37.64], // Москва
      controls: [],
      zoom: 5
    },
    {
      searchControlProvider: 'yandex#search'
    });

    clusterer = new ymaps.Clusterer({
      preset: 'islands#invertedVioletClusterIcons',
      clusterDisableClickZoom: true,
      openBalloonOnClick: true,
      geoObjectOpenBalloonOnClick: true
    });

    myMap.geoObjects.add(clusterer);
    console.log(`map is initialized`)
  },

  insertPlaceMark(name,place,photo) {
    
    return ymaps.geocode(place)
      .then(result => {
        const points = result.geoObjects.toArray();
        if (points.length) {
          const coors = points[0].geometry.getCoordinates();
          const placemark = new ymaps.Placemark(
            [coors[0], coors[1]], 
            {
              balloonContentHeader: `${name}`,
              balloonContentBody: `<div class='baloon__div'><h4>город ${place}</h4><img src='${photo}'/></div>`,
              clusterCaption: `${name}`
            }, 
            { preset: 'islands#invertedVioletClusterIcons' })
          
          clusterer.add(placemark)
        }
      })
  },

  deleteAllPlaceMarks(){
    clusterer.removeAll();
  }
}
},{"./config":2}]},{},[1]);
