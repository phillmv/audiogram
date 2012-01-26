// Note for anyone reading this IN THE FUTURE
// I clearly don't know how to write idiomatic js.
// I am moderately ashamed about this, don't worry.

// I CAN TELL this is lame code, but I didn't have time
// to finish reading 'The Good Parts' before the party date.
// If this were ruby, maybe I would have a class or a module
// but I don't entirely grok the js inheritance model as of yet

// VARIABLES I (DISGUSTINGLY) STORE GLOBALLY:

// store images to be loaded on to the main waterfall
$images = [];

// store the integer count of the span containing 
// a row of images that have been loaded, but should now
// be garbage collected.
$loaded_img = []

// counter used to keep track of the number of rows injected
// into the waterfall so we can then GC them later.
// HINT: refactor
$counter = 0;

// waterfall container
$container = $('#pics');


// hash containing the pagination ids necessary for traversing
// the instagram tag feed
$next_id = {}

// array containing the tags we are using for waterfall
$tags = []

// pause waterfall and the auto slide transitions
$PAUSED = false;

// number of images per row
$WIDTH = 8;

// number of rows in the DOM, before garbage collection gets triggered
$MAX_SIZE = 12;

// number of images remaining in the $images array before we'll trigger
// a new request for more images.
$BUFFER = 24;



function draw(callback){

  if ($PAUSED)
  {
    setTimeout("draw()", 1000);
    return;

  }


  if($images.length < $BUFFER)
  {
    load_items();
  }

  if($images.length > 0)
  {

    var html = ""
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
	  $("#container" + $loaded_img.shift()).remove();
	}

	setTimeout("draw()", 1000);

      });
  }
  else
  {
    // refactoring would be smart. Such spaghetti!
    setTimeout("draw()", 1000);

  }

}

function load_items(callback)
{
  $.post("/moar", { next_id: $next_id, tags: $tags }, function(data) {
      $next_id = data[0]

      $images = $images.concat(data[1]);
      if(callback !== undefined)
      {
	callback();
      }
    }, 'json');

}

function poll_tag()
{
  $.get("/tagged", function(data) {
      if(data != ""){
	$("#dyn_img").html("<img src=" + data + " />");
      }

    });

  setTimeout("poll_tag()", 5000);
}



$(window).load(function(){

    $("#tag").submit(function(e) {
	e.preventDefault();
	$tags = $("#tag_input").attr("value").split(" ");

	$("#question").remove();

	$(".step").each(function(i, elem) {
	    $(elem).removeClass("hidden");
	  });
	
	$('#jmpress').jmpress();


	load_items(draw);

	$("#jmpress").jmpress('select', '#step-1')
	setTimeout("next_slide(1)", 10000);

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

function next_slide(count){

  if(!$PAUSED)
  {
    $('#jmpress').jmpress("next");
  }
  
  next_count = (count++ % 5) + 1;
  if(next_count === 1)
  {
    timeout = 10000;
  }
  else
  {
    timeout = 2000;
  }
  setTimeout("next_slide(" + next_count + ")", timeout);
    

}
