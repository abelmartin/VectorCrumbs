# Vector Crumbs
Vector Crumbs is an easy way to do 2 things:  
1. drag & drop with a Raphael set  
2. draw shapes behind your dragged object.  

## The problem I'm trying to solve
While I love Raphael's drag & drop, I don't like having to write the same boilerplate code everytime I want to drag something.

I also wanted something that triggered events as the dragging occured.

## Usage  

Add the plugin script **after** you add the Raphael.js

```html

<script src="/javascripts/raphael-min.js"></script>
<script src="/javascripts/vectorcrumbs.js"></script>
```

You can use Vector Crumbs on like this: 

```javascript

// Create your standard Raphael drawing space
paper = Raphael(0, 0, 300, 300);

// Create a set
mySet = paper.set();

// Add objects to the set
mySet.push(
  paper.circle(10, 10, 5).stroke({stroke: '#F00'}),
  paper.circle(30, 10, 5).stroke({stroke: '#0F0'})
);

// Add Vector Crumb funtionality
mySet.vectorcrumbs();

// THAT'S IT! :)
```

If can also pass in a param object with the following attributes:

```javascript

mySet.vectorcrumbs({
  stroke: '#F00',  // Defaults to '#F00', but you can use any color you want
  "stoke-linecap": 'butt',  // You can use “butt”, “square”, or “round”
  "stroke-width": 3, // Any interger wll do.  Defaults to 3
  "leave_crumbs": true, // You can disable the crumbs if you only want to drag an object.  Defaults to true
  "debug_mode": false // You can see some extra debug data if you set this to 'true'
});
```

Vector Crumbs is also a good 'JavaScript citizen'.  It returns the object it's bound to so you can chain off it if you want

```javascript

mySet.vectorcrumbs().dblclick(function(event){
  ...
});
```

## Current Hacks & Admissions  
At the moment, I'm wrapping my plugin around the standard Raphael.drag() method.  In the future, I'll need to roll my own drag method, but for now, this works :)

This has NOT been tested across multiple browsers yet

I believe (though I haven't tested this yet) if you have multiple items in a set, this will center them all as you drag the items

## Here's a tentative roadmap ##
* post drag smoothing
    * at the moment, the dragged lines are a bit jagged
* bind the 'crumbs' to the dragged object to give additional functionality on the crumbs such as...
    * hiding the crumbs
    * adjusting crumb color & width after the crumbs have been drawn
* add dashed crumb type
* add ability to leave static Raphael objects as crumbs insted of simple dashes
* add Raphael objects that have animations as crumbs
