# Connect WordPress API

This is a short documentation how to fetch data from `WordPress` sites of our clients into `Nuxt.js` or `Vue.js` projects.

## Required Tasks

1. Please fill all pages with the dynamic content from the server
2. Please fill all posts and single posts with dynamic content from the server
3. Only for `Nuxt.js` projects: Please add meta data from the server to the head of each page and every post. You can find a short info [below](#meta-data).

## Making Requests

When fetching data from the `WordPress REST API`, we need to convert HTML entities like Ä, Ö, Ü and other special charakters. 
So, we are using [axios](https://www.npmjs.com/package/axios) to fetch the data and [HE](https://www.npmjs.com/package/he) to convert HTML entities in the response. It's not the most beautiful solution, but we haven't found a better one yet.

In order to prevent you from re-enventing the wheel, we wrote a little [`api` nuxt plugin](https://github.com/Webhikers/wp-api-doc/blob/main/api.js), that enables you to make api calls without having to bother about HTML entities. Simply make the request and use the data.

You can find the nuxt plugin [here](https://github.com/Webhikers/wp-api-doc/blob/main/api.js) and then you can then make requests like this:

The Plugin code has been refactored recently and is **not tested yet**. If it doesn't work correctly, please let us know and we'll add a fix immediately.

1. Install nuxt axios
```bash
npm install @nuxtjs/axios
```

2. Set the base_url
```javascript
export default{
  axios:{
    baseURL:'https://admin.forrestbottle.com/wp-json',
  },
}
```

3. Install our nuxt api plugin
In `nuxt.config.js`
```javascript
export default{
  plugins: [
    '@/plugins/api',
  ],
}
```

4. Use the plugin (always fetch api data in the `asyncData`) hook.

In a `Nuxt.js` **Page**
```vue
<script>
  export default{
    asyncData({$apiService}){
      var page = $apiService.get('/pages/:page_id')
    }
  }
</script>
```

In a `Nuxt.js` **Component**
```vue
<script>
  export default{
    methods:{
      do_somehting:function(){
        var page = this.$apiService.get('/pages/:page_id')      
      }
    },
  }
</script>
```

## Endpoints

#### 1. GET `Normal Page` (all pages, excluding impressum, privacy, cookies, terms)

Content data will be found in `response.data.acf`

```javascript

import api from 'path/to/api/helper-script.js'

// Make a request for a page with a given ID
// The dynamic content comes sorted in page sections, like the following

api.get('https://domain.com/wp-json/wp/v2/pages/:page_id')
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

// Make a request for a page with a given ID
// Here the pages only have title and content, so the results will be like the following

$apiService.get('https://domain.com/wp-json/wp/v2/pages/:page_id')
  .then(function (response) {
    console.log(response.data.title.rendered);
    console.log(response.data.content.rendered);
  })
```

#### 3. GET posts

Content data will be found in `response.data.title` and `response.data.content`

```javascript

// Make a request for all posts of a certain post_type
$apiService.get('https://domain.com/wp-json/wp/v2/:post_type_name')
  .then(function (response) {
      var posts = response.data
  })
```

#### 3. GET post

Content data will be found in `response.data.title` and `response.data.content`

```javascript

// Make a request for a post with a given ID
// The posts only have title and content, so the results will be like the following

$apiService.get('https://domain.com/wp-json/wp/v2/:post_type_name/:post_id')
  .then(function (response) {
    console.log(response.data.title.rendered);
    console.log(response.data.content.rendered);
  })
```

<a name="meta-data"/>

#### 4. Add meta data to the head of each page and post. 

```vue
<template>
  <section>
    <h1>This is a pge</h1>
  </section>
</template>

<script lang="js">

  export default{
    asyncData:async function({$apiService}){      
      var page = $apiService.get('https://domain.com/wp-json/wp/v2/pages/:page_id')      
      return {page}      
    },
    head() {
      return {
        title: this.page.yoast_title,
        meta: this.page.yoast_meta
      }
    }

  }
</script>

```

#### 5. POST form submission

You can find a tutorial how to post form submissions for our prjojects [here](https://github.com/Webhikers/bootstrap-vue-cf7)
