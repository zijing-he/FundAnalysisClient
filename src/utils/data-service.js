import axios from 'axios'

let DataService = {
  // DATA_SERVER_URL: 'http://10.76.0.165:5001',
  DATA_SERVER_URL: 'http://kuoluo1995.natapp1.cc',

  // HTTP GET request
  get(callback){
    axios.get(`${this.DATA_SERVER_URL}/get`)
      .then(response => {
        callback(response.data)
      }, errResponse => {
        console.log(errResponse)
      })
  },

  // HTTP POST request
  post(path, param, callback){
    axios.post(`${this.DATA_SERVER_URL}/${path}`, param)
      .then(response => {
        callback(response.data)
      }, errResponse => {
        console.log(errResponse)
      })
  },
}

export default DataService;
