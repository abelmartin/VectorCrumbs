# Vector Crumbs
Vector Crumbs is an easy way to do 2 things:  
1. drag & drop with a Raphael set  
2. draw shapes behind your dragged object.  

## The problem I'm trying to solve
While I love Raphael's drag & drop, I don't like having to write the same boilerplate code everytime I want to drag something.

I also wanted something that triggered events as the dragging occured.

## Current Hacks & Admissions  
At the moment, I'm wrapping my plugin around the standard Raphael.drag() method.  In the future, I'll need to roll my own drag method, but for now, this works :)

## Here's a tentative roadmap ##
* add variable width 
* post drag smoothing
* add solid/dashed crumb type
* add ability to crumb static Raphael objects insted of simple dashes
* add Raphael objects that have animations
