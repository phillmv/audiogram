$images = [];
$container = $('#pics');
$pause = false;

function draw(callback){

  if ($pause)
  {
    return;
  }
  var html = ""


  if($images.length < 24)
  {
    load_items();
  }

  len = ($images.length < 8 ? $images.length : 8)
  for(var i = 0; i < len; i++) {
    html = html + "<div class='item'><img src='" + $images.shift() + "' /></div>";
  }

  var new_items = $(html);
  new_items.imagesLoaded(function() {

      $container.prepend(new_items).isotope( 'reloadItems').isotope({ sortBy: 'original-order', gutterWidth: 10 });
      setTimeout("draw()", 500);

    });

}

function foo()
{
  alert('feh');
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

    load_items(draw);

    $container.isotope(
      {
	itemSelector: '.item',
	gutterWidth: 10
      }
    );


    $("#moar").click(function(event) {	
	event.preventDefault();
	event.stopPropagation();

	add_moar();
      });


  });
