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
    //load_items();
  }

  if($images.length > 0)
  {

    len = ($images.length < $WIDTH ? $images.length : $WIDTH)
    for(var i = 0; i < len; i++) {
      img = $images.shift();
      html = html + "<div class='item'><img src='" + img + "' /></div>";
    }

    var new_items = $("<span id='container" + $counter + "'>" + html + "</span");

    $loaded_img = $loaded_img.concat($counter)
    $counter++;
    new_items.imagesLoaded(function() {

	$container.prepend(new_items).isotope( 'reloadItems').isotope({ sortBy: 'original-order', gutterWidth: 10 });
	if ($loaded_img.length > $MAX_SIZE)
	{
	  alert(($loaded_img.length));
	  $("#container" + $loaded_img.shift()).remove();
	}

	setTimeout("draw()", 1000);

      });
  }
  else
  {
    // refactoring would be smart. This is silly
    setTimeout("draw()", 1000);

  }

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



$(window).load(function(){

    $("#tag").submit(function(e) {
	e.preventDefault();
	var tags = $("#tag_input").attr("value").split(" ");
	$.post("/", { tags: tags });

	$("#question").remove();

	$(".step").each(function(i, elem) {
	    $(elem).removeClass("hidden");
	  });
	
	$('#jmpress').jmpress();


	load_items(draw);

	$container.isotope(
	  {
	    itemSelector: '.item',
	    gutterWidth: 10,
	    animationEngine: 'css'
	  }
	);
      });
    

    $("#moar").click(function(event) {	
	event.preventDefault();
	event.stopPropagation();

	add_moar();
      });


  });
