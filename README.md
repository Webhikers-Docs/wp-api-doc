# Connect WordPress API

This is a short documentation how to fetch data from the `WordPress` sites of our clients into `Nuxt.js` or `Vue.js` projects.

## Endpoints

#### 1. GET `Normal Page` (all pages, excluding impressum, privacy, cookies, terms)

Content data will be found in `response.data.acf`

```javascript

const axios = require('axios');

// Make a request for a page with a given ID
// The dynamic content comes sorted in page sections, like the following

axios.get('https://domain.com/wp-json/wp/v2/pages/:page_id')
  .then(function (response) {
    console.log(response.data.acf.section_head.title);
    console.log(response.data.acf.section_head.description);
    console.log(response.data.acf.section_head.background_image);
    console.log(response.data.acf.section_benefits.title); 
    console.log(response.data.acf.section_benefits.description); 
  })
```

#### 2. GET `Legal Page` (legal pages like impressum, privacy, cookies, terms, excluding all other pages)

Content data will be found in `response.data.title` and `response.data.content`

```javascript

const axios = require('axios');

// Make a request for a page with a given ID
// Here the pages only have title and content, so the results will be like the following

axios.get('https://domain.com/wp-json/wp/v2/pages/:page_id')
  .then(function (response) {
    console.log(response.data.title.rendered);
    console.log(response.data.content.rendered);
  })
```

#### 3. GET posts

Content data will be found in `response.data.title` and `response.data.content`

```javascript

const axios = require('axios');

// Make a request for all posts of a certain post_type
axios.get('https://domain.com/wp-json/wp/v2/:post_type_name')
  .then(function (response) {
      var posts = response.data
  })
```

#### 3. GET post

Content data will be found in `response.data.title` and `response.data.content`

```javascript

const axios = require('axios');

// Make a request for a post with a given ID
// The posts only have title and content, so the results will be like the following

axios.get('https://domain.com/wp-json/wp/v2/:post_type_name/:post_id')
  .then(function (response) {
    console.log(response.data.title.rendered);
    console.log(response.data.content.rendered);
  })
```

#### 4. POST form submission

You can find a tutorial how to post form submissions for our prjojects [here](https://github.com/Webhikers/bootstrap-vue-cf7)

## Making Requests

We are using [axios](https://www.npmjs.com/package/axios) to fetch data from WordPress Sites. In order to effectively make ```GET```, ```POST```, ```PUT```, ```DELETE``` requests, we wrote a very little helper that also converts ```GET``` request objets in form of a javascript object to a ```GET``` request with URL parameters. 

We also need to convert HTML entities like Ä, Ö, Ü and other special charakters. Therefore we use [HE](https://www.npmjs.com/package/he) NPM library. It's not the most beautiful solution, but we haven't found a better one yet.

You can use this Snippet as a `Nuxt.js` or `Vue.js` Plugin, if you want. If you have a better alternative, you're weclome to let us know and deliver a better solution to make WordPress API Requests.

```javascript
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

export default new Api()


```

You can then make requests like this:

```javascript

import api from 'path/to/api/helper-snippet.js'

var response = api.get('https://domain.com/wp-json/wp/v2/pages/:page_id')

```
