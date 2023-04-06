# Node.JS - cooper's basic webserver template

This template provides a simple Node.JS webserver with an user authentication system. The auth is realized by a JWT. JWT stands for "JSON Web Token", which is a standard format for representing and transmitting data as a JSON object. In the context of authentication, a JWT is a token that is issued by a server to a client after the client has successfully authenticated with the server. 

With this template there comes no frontend register option but there is an node script to register and create new users.

### What can this template do?

This template provides a webserver with easy to hook up server routes, a template engine and default middleware to indicate or auth the user. 
Theres also a pre configured `public` folder with sample `.css`, `.js` and `image` files that show how to use it in a template.
More information about the routes and templates can be found in the chapters below.

---

## What is this template used for?

I created this template for my local homeserver projects. I often write small utilities that I want to be able to access from anywhere in the world. Well, sometimes it's enough to reach them when I'm just not at home. With this template I can create a simple and fast webpage with an auth requirement so that not every asshole can access the webapps I'am running on my homeserver.


## Getting started

```
git clone https://github.com/me-cooper/node-basic-webserver-template.git
```

```
npm install
```

Now you can go to the server settings to adjust the parameters to your needs. Server settings are stored in `./settings.js`.

```javascript
module.exports = {
    server: {
        port: 3000
    },
    auth: {
        secret: 'mySuperSecretServerwideTokenHere',

        // How long should the login session be valid?
                                // Minutes    // Hours     // Days
        valid:  (1000 * 60)  		* 5           * 24         * 1         
    }
}
```

`port` : 	 Port on which the web server will be running
`secret`:   The secret is for the creation of the JWT token and can be chosen at will.
`valid`: 	This parameter determines how long a login session is valid. You can enter values as described in the file.

Once this is done, the first user can be created. To do this, execute the following command in the terminal:
```terminal
cooper@homeserver$ node utils/create_user.js
```

```terminal
cooper@homeserver$ node utils/create_user.js 
prompt: Username:  me-cooper
prompt: Password:  
Please add new user > me-cooper < manually to './database/userlist.js'
{
  id: 1,
  username: 'me-cooper',
  password: '$2a$10$LCaqsQMGEVEX4PxpJUVF8OhW6lqZ6wQfTW.Gt3MR3MhqBGHtZWjGK',
  additionalData: 'sample'
}
cooper@homeserver$
```

Copy the user object and paste it into `./database/userlist.js`.

```javascript
module.exports = [
  {
    id: 1,
    username: 'me-cooper',
    password: '$2a$10$iJ8NNBFveS2KnyJCzLxmc.aWxeYW.v5l6Do5nbowM0xBCZrWYbIT.',
    additionalData: 'sample'
  }
]
```

`additionalData` is just a example. You don't need this field. But if you add more fields to the user object, you have access to it in your routes via `req.user.field` - in this case: `req.user.additionalData`. You can use this for simple roles or other things like user-based settings. The fields are attached automatically on login.

```html
<% if(it.user.additionalData){ %>
    <p>This is a custom field: <%= it.user.additionalData %></p>    
<% } %>
```



### Run the server

```terminal
cooper@homeserver$ node server.js 
Server is running on port:  3000
```

![](./git_assets/main_page_webserver.png)

There is already a proteted route accessable under `localhost:3000/private` so if you're logged in it will be visitable. Otherwise you will be redirected to `localhost:3000/login` to login with your account. You can use this route as sample as well but there are two extra sample files which demnstrate both a public and a proctected route.

## Add new routes

To add a new route to your webserver you simply have to copy either `sample_public_route.js` or `sample_private_route.js`.
New route will be registered with the name of the file automatically. If you rename it to `list.js` it will available under `localhost:3000/list`. If you name it `doorlock.js` it will be accessable under `localhost:3000/doorlock` - very easy.

Following code is from the `sample_public_route.js`:

```javascript
route.get('/', [ middleware.user.get ], (req, res, next) => {

    var templateData = {
      user: req.user
    };

    // OWN LOGIC
    templateData.test = "Sample string";

    console.log(templateData);
    
    eta.renderFile(path.join(viewsPath, 'sample_view'), templateData)
    .then(html => {
      res.status(200).send(html);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
    
})
```

`sample_view` is the template to be rendered with the route. It is stored under `./views/sample_view.eta`.

You can add custom data to the `templateData` object. This object is accessable wihtin the template. If a user is logged in, it will be automatically added to `templateData` via `req.middlewareData`. So if you log `templateData` to the console it will be look like this.

**Not logged in:**

```terminal
{ 
	user: undefined, 
	test: 'Sample string' 
}
```

**Logged in:**

```terminal
{ 
	user: { 
		id: 1, 
		username: 'me-cooper', 
		additionalData: 'sample' 
	}, 
	test: 'Sample string' 
}
```



### Middleware

There are two types of middleware functions:

1. `middleware.auth.isValid` - turn the route into an auth required route
2. `middleware.user.get` - stores user data in `req.user`

`middleware.user.get` can always be used if you need to work with user-specific data inside a template. 
If you want to turn a public route into an protected route, just add the `middleware.auth.isValid` middleware to the middleware array.

```javascript
app.get('/customRoute', [middleware.auth.isValid, middleware.user.get], function (req, res) {

	console.log(req.user);
	res.send('For this route a authentication is required!');
	
});
```

Of course you can add own middleware functions. For that you simply can take a look at `./src/middleware`.

## Templates

ETA is used as the template engine. You can pass a `templateData` object to your template like this:

```javascript
route.get('/', [ middleware.user.get ], (req, res, next) => {

    var templateData = {
      user: req.user
    };

	templateData.blabla = "Blublub";
	templateData.entries = [
		"entry1",
		"entry2",
		"entry3"
	];

    eta.renderFile(path.join(viewsPath, 'sample_view'), templateData)
    .then(html => {
      res.status(200).send(html);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
    
})
```

Now you can access the `templateData` object witin the template trough the object `it`.


```text
<h1 class="colorChange">
	<% if(it.user){ %>
		<%= it.user.username %>
	<% }else{ %>
		lass mich in ruhe
	<% } %>
</h1>

<p><%= it.blabla %></p>

<% it.entries.forEach(function(entry){ %>
  <%= entry %>
<% }) %>
```

You can import other templates like showed in the `sample_view` file. If you need to get access to the templateData object in your imported files as well, you need to pass the templateData object with the include function.

```text
<%~ includeFile('partials/header', { it }) %>

Sample View

<%~ includeFile('partials/footer', { it }) %>
```

You also can pass a single array or single key to the imported template.

```text
<%~ includeFile('partials/list', { it.entries }) %>
```

For more information about the rendering engine visit [https://eta.js.org/](https://eta.js.org/) or open up the [https://eta.js.org/docs/syntax/cheatsheet](ETA-Cheatsheet)

### Public files

To access files located in the `./public` folder, just use as follows:

```html
<link rel="stylesheet" href="css/main.css" />
<img src="images/me-cooper.png" width="128" height="128"/>
<script type="text/javascript" src="js/main.js"></script>
```

You can add new folders / files in `./public` as you want and access them the same way.
Attention! Every file in `./public` can be accessed from the frontend.

---


## Summary

This tmemplate is an comfortable way to setup a secure and modular webserver with Node.JS.

- Fast deployment of a Node.JS webserver
- Basic but secure authentication for your projects.
- Client assets ready to use from public folder
- Add ne routes to your site with a bare simple `copy`, `paste` & `rename` procedure 
- Fast and easy to use template engine for dynamic displays on frontend

Overall, it is a simple Node.JS Express web server template where you can use your logic as usual. The syntax is also as usual, except that all the overhead to get started is gone. You can get started right away.

