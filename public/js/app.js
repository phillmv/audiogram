$(window).load(function(){

		var $container = $('#pics');

		$container.isotope(
			{
				itemSelector: '.item',
			}, 
			function () {
			}
		);

		setTimeout("add_moar('')",1000);


		$("#moar").click(function(event) {	
				event.preventDefault();
				event.stopPropagation();

				add_moar();
			});


	});


function add_moar(items){

	$.getJSON("/moar", function(data) {
			new_html = "";
			counter = 0
			$.each(data, function(i, val) { 
					if(counter < 8) {
					new_html = new_html + "<div class='item'><img src='" + val + "' /></div>";
				}
					counter = 1 + counter
				});

		var $container = $('#pics');

		var newItems = $(new_html);
		newItems.imagesLoaded(function() {
				$container.prepend(newItems).isotope( 'reloadItems' ).isotope({ sortBy: 'original-order' });
			});



		setTimeout("add_moar('')",500);
	});
		
}


		//new_items =	'<div class="item"> <img src="http://distilleryimage3.instagram.com/b4de61fe3bc511e19e4a12313813ffc0_5.jpg" /> </div> <div class="item"> <img src="http://distilleryimage4.instagram.com/8e34be4c3bc811e180c9123138016265_5.jpg" /> </div> <div class="item"> <img src="http://distilleryimage3.instagram.com/27100f123bc511e180c9123138016265_5.jpg" /> </div> <div class="item"> <img src="http://distilleryimage6.instagram.com/4739a0203bc811e180c9123138016265_5.jpg" /> </div> <div class="item"> <img src="http://distilleryimage2.instagram.com/fa09f1323bbe11e180c9123138016265_5.jpg" /> </div> <div class="item"> <img src="http://distilleryimage4.instagram.com/e4f425083bc111e1abb01231381b65e3_5.jpg" /> </div> <div class="item"> <img src="http://distilleryimage6.instagram.com/fc4c8bea3bc711e19e4a12313813ffc0_5.jpg" /> </div> <div class="item"> <img src="http://distilleryimage11.instagram.com/d6c4780a3bc311e1a87612313804ec91_5.jpg" /> </div> <div class="item"> <img src="http://distilleryimage0.instagram.com/ca63c5223bc111e19e4a12313813ffc0_5.jpg" /> </div> <div class="item"> <img src="http://distilleryimage5.instagram.com/86912ccc3bc111e180c9123138016265_5.jpg" /> </div> <div class="item"> <img src="http://distilleryimage7.instagram.com/5f16a8bc3bc011e1a87612313804ec91_5.jpg" /> </div>';
