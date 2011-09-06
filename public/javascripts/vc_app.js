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
      "@"
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
  circ.vectorCrumbs({'stroke-width':3, stroke:"green", crumbs:true});
}());
