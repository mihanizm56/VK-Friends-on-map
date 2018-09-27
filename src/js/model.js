
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
