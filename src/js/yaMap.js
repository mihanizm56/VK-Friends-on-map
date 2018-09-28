
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