

module.exports = {
  showState(state) {
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

  changeItemIcon(event, zone = '', elem = '') {
    const element = event.target;

    if (element.className == 'user-plus') {
      element.className = 'user-minus'
      return this.changePlaceItem(element)
    }

    if (element.className == 'user-minus') {
      element.className = 'user-plus'
      return this.changePlaceItem(element)
    }
//для драг-н-дропа
    if (zone && elem) {
      if (zone == 'list-friends__list-item') {
        return elem.lastElementChild.className = 'user-plus'
      }
      elem.lastElementChild.className = 'user-minus'
    }
  },

  showElem(element, prop) {
    if (prop == 'show') { element.style.display = 'flex' }
    if (prop == 'hide') { element.style.display = 'none' }
  },

  changePlaceItem(element) {
    
    if (element.className == 'user-minus') {
      return document.querySelector('.list-friends__list-item').appendChild(element.parentNode)
    }

    if (element.className == 'user-plus') {
      const yourFriends = document.querySelector('.your-friends__list-item');

      if (yourFriends.childNodes) {
        return yourFriends.insertBefore(element.parentNode, yourFriends.firstChild);
      }

      yourFriends.appendChild(parent);
    }
  },

  insertChoosenFriends(choosenFriends) {
    console.log('insertChoosenFriends')

    for (obj of choosenFriends){
      document.getElementById(obj.id).lastElementChild.classList = 'user-minus';
      document.querySelector('.list-friends__list-item').appendChild(document.getElementById(obj.id));
    }
  }
}
