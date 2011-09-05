function generateRaphaelObject(paper, defObj){
  var plr = paper.set();

  plr.push( 
    paper.circle(
      defObj.locX, 
      defObj.locY, 
      defObj.width
    ).attr({
      fill: defObj.colorWithoutBallCircle,
      stroke: defObj.colorWithoutBallStroke,
      "stroke-width": 2
    }),
    paper.text(
      defObj.locX, 
      defObj.locY, 
      defObj.id
    ).attr({
      fill: defObj.colorText,
      'font-size': defObj.fontSize,
      'font-weight': 'bold'
    })
  );

  return plr;
}

function enablePassingAndShooting(raphObj){
  //The raphaelObj is a set.  You add the click event to both objects.
  var that = this;
  
  var circleNode = raphObj[0].node;
  circleNode.ondblclick = function(){
    console.log("You DOUBLE CLICKED on the player CIRCLE");
    raphObj[0].attr({fill: 'orange'});
    that.set({hasBall: true});
  };
  
  var textNode = raphObj[1].node;
  textNode.ondblclick = function(){
    console.log("You DOUBLE CLICKED on the player TEXT");
    raphObj[0].attr({fill: 'orange'});
    that.set({hasBall: true});
  };
}

function trackMovement(paper, raphObj, defObj){
  //This process was greatly helped by these StackOverflow posts:
  //http://stackoverflow.com/questions/4224359/making-paths-and-images-dragable-in-raphael-js
  //http://stackoverflow.com/questions/3675519/raphaeljs-drag-n-drop

  //It's crucial to remember the following:
  //  raphObj[0] = cicrle
  //  raphObj[1] = text
  var that, start, move, up, dragArray, vcrumbs;
  that = this;

  start = function() {
    var inner_that = this;
    /*var fill_color = (defObj.hasBall) ? defObj.colorWithBallCircleAlt : defObj.colorWithoutBallCircleAlt;*/
    /*var strok_color = (defObj.hasBall) ? defObj.colorWithBallStrokeAlt : defObj.colorWithoutBallStrokeAlt;*/

    /*this.attr({*/
    /*fill: fill_color,*/
    /*stoke: strok_color*/
    /*});*/

    console.log(raphObj);

    raphObj.items.forEach(function(itm,idx,arr){
      itm.ox = ( inner_that.type === "circle" ) ? inner_that.attr('cx') : inner_that.attr('x');
      itm.oy = ( inner_that.type === "circle" ) ? inner_that.attr('cy') : inner_that.attr('y');
    });

    switch(this.type){
      case "circle":
        console.log("Grabbed the CIRCLE, the companion is TEXT");
      break;
      case "text":
        console.log("Grabbed the TEXT, the companion is CIRCLE");
      break;
    }
    
    dragArray = [{x:this.ox, y:this.oy}];
    vcrumbs = paper.set(); 
    console.log(dragArray.length);
    return null;
  };

  move = function(dx, dy) {
    //Here we grab the delta between our drag actions
    var svgpath, inner_that;
    inner_that = this;
    console.log("WE'RE IN THE MOVE FUNCTION NOW");
    
    raphObj.items.forEach(function(itm,idx,arr){
      switch(itm.type){
        case "circle":
          itm.attr({
            cx: inner_that.ox + dx,
            cy: inner_that.oy + dy
          });
        break;
        case "text":
          itm.attr({
            x: inner_that.ox + dx,
            y: inner_that.oy + dy
          });
        break;
      }
    });

    console.log("DX: " + dx);
    console.log("DY: " + dy);

    if(this.type === "circle"){
      dragArray.push({x:this.attr('cx'), y:this.attr('cy')});
    }
    else{
      dragArray.push({x:this.attr('x'), y:this.attr('y')});
    }

    svgpath = "M".concat(
      dragArray[dragArray.length-2].x, 
      " ",
      dragArray[dragArray.length-2].y, 
      " L ",
      dragArray[dragArray.length-1].x, 
      " ",
      dragArray[dragArray.length-1].y 
    ); 

    vcrumbs.push( paper.path(svgpath).attr({stroke:"#F00", "stroke-linecap":"butt", "stroke-width": 3}) );
    vcrumbs.toBack();
    console.log(dragArray.length);
    return null;
  };

  up = function() {
    //Return the colors to their rightful states
    var inner_that = this;
    /*var fill_color = (defObj.hasBall) ? defObj.colorWithBallCircle : defObj.colorWithoutBallCircle;*/
    /*var strok_color = (defObj.hasBall) ? defObj.colorWithBallStroke : defObj.colorWithoutBallStroke;*/

    /*raphObj.items.forEach(function(itm,idx,arr){*/
    /*itm.attr({*/
    /*fill: fill_color,*/
    /*stoke: strok_color*/
    /*});*/
    /*});*/

    console.log("DONE!");
    return null;
  };

  //Finall, we apply the functions that we just defined 
  //as params in the drag function
  raphObj.drag(move, start, up);
}

(function(){
  var paper, defaultObj;

  paper = Raphael('Stage', '100%', '100%');

  defaultObj = {
    hasBall: false,
    locY: 100,
    locX: 100, 
    colorWithoutBallCircle: "#44F", //Blue-ish
    colorWithoutBallCircleAlt: "#8AF", //Blue-ish
    colorWithBallCircle: "#FF7B0D", //Orange
    colorWithBallCircleAlt: "#FFA84C", //Orange
    colorText: "#000",
    colorWithoutBallStroke: "#000",
    colorWithoutBallStrokeAlt: "#44F",
    colorWithBallStroke: "#000",
    colorWithBallStrokeAlt: "#FF7B0D",
    fontSize: 20,
    width: 20,
    id: 0
  };

  console.log('works');

  window.circ = generateRaphaelObject(paper, defaultObj);
  trackMovement(paper, circ, defaultObj);
}());
