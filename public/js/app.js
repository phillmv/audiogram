// Note for anyone reading this IN THE FUTURE
// I clearly don't know how to write idiomatic js.
// I am moderately ashamed about this, don't worry.

// I CAN TELL this is lame code, but I didn't have time
// to finish reading 'The Good Parts' before the party date.

$images = [];
$loaded_img = []
$container = $('#pics');

$PAUSED = false;

$WIDTH = 8;
$MAX_SIZE = 12;
$BUFFER = 24;

$counter = 0;

function draw(callback){

  if ($PAUSED)
  {
    setTimeout("draw()", 1000);
    return;

  }
  var html = ""


  if($images.length < $BUFFER)
  {
    load_items();
  }

  len = ($images.length < $WIDTH ? $images.length : $WIDTH)
  for(var i = 0; i < len; i++) {
    img = $images.shift();
    html = html + "<div class='item' id='" + img[1] +"'><img src='" + img[0] + "' /></div>";
  }

  var new_items = $("<span id='container" + $counter + "'>" + html + "</span");

  $loaded_img = $loaded_img.concat($counter)
  $counter++;
  new_items.imagesLoaded(function() {

      $container.prepend(new_items).isotope( 'reloadItems').isotope({ sortBy: 'original-order', gutterWidth: 10 });
      if ($loaded_img.length > $MAX_SIZE)
      {
	  $("#container" + $loaded_img.shift()).remove();
      }

      setTimeout("draw()", 1000);

    });

}

function load_items(callback)
{
  $.getJSON("/moar", function(data) {

      $images = $images.concat(data);
      if(callback !== undefined)
      {
	callback();
      }
    });

}

$(function() {
    $('#jmpress').jmpress();
});


$(window).load(function(){

    load_items(draw);

    $container.isotope(
      {
	itemSelector: '.item',
	gutterWidth: 10,
	animationEngine: 'css'
      }
    );



    $("#moar").click(function(event) {	
	event.preventDefault();
	event.stopPropagation();

	add_moar();
      });


  });
