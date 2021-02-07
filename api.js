import axios from 'axios'
var import_HE = () => import('he')

class Api{

  async get(endpoint, body){

    var new_url = endpoint
    
    //convert request body to url parameters
    const qs = !body ? '' : Object.keys(body)
        .map(key => `${key}=${body[key]}`)
        .join('&');
    new_url = new_url.includes("?") ? new_url + qs : new_url + '?' + qs
    
    return new Promise((resolve, reject)=>{
      axios.get(new_url)
      .then(async response=>{
        var data = await this.decodeHtmlEntities(response.data)
        resolve({
          data:data,
          headers:response.headers
        })
      })
      .catch(e=>{
        return reject(e.response ? e.response.data : e)
      })
    })
  }

  async post(endpoint, body){

    return new Promise((resolve, reject)=>{
      axios.post(endpoint, body)
      .then(async response=>{
        var data = await this.decodeHtmlEntities(response.data)
        resolve({
          data:data,
          headers:response.headers
        })
      })
      .catch(e=>{
        return reject(e.response ? e.response.data : e)
      })
    })
  }

  async put(endpoint, body){

    return new Promise((resolve, reject)=>{
      axios.put(endpoint, body)
      .then(async response=>{
        var data = await this.decodeHtmlEntities(response.data)
        resolve({
          data:data,
          headers:response.headers
        })
      })
      .catch(e=>{
        return reject(e.response ? e.response.data : e)
      })
    })
  }

  async delete(endpoint, body){

    var new_url = endpoint
    const qs = !body ? '' : Object.keys(body)
        .map(key => `${key}=${body[key]}`)
        .join('&');

    new_url = new_url.includes("?") ? new_url + qs : new_url + '?' + qs
    return new Promise((resolve, reject)=>{
      axios.delete(new_url)
      .then(async response=>{
        var data = await this.decodeHtmlEntities(response.data)
        resolve({
          data:data,
          headers:response.headers
        })
      })
      .catch(e=>{
        return reject(e.response ? e.response.data : e)
      })
    })
  }

  async decodeHtmlEntities(response){
    //we used a dynamic import in order to improve loading speed, altough this doesn' really have the desired impact, so you are free to import it in the     standard way as well.
    
    var he = await import_HE()
    var string = JSON.stringify(response)
    var handle_double_quotes = string.replace(/&quot;/g, '\\"')
    var escaped_string = he.unescape(handle_double_quotes)
    var json = JSON.parse(escaped_string)

    return json
  }

}
