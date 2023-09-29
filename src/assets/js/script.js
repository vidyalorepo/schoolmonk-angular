//parallaxbg//

$(document).ready(function () {
    $(window).scroll(function() {    
        var scroll = $(window).scrollTop();
        if (scroll >= 50) {
         $(".headersection").addClass("header-top");
        } else {
      $(".headersection").removeClass("header-top");
     }
    });
    });	
    
//parallaxbg//

   /*Grid-view-and-List-view*/
// $(document).ready(function () {

//     $(".grid_vw").click(function () {
//         $(".packbox ").addClass('grid-width');
//         $(".schoolinfobox_img").addClass('left');
//         $(".schoolinfobox_tex").addClass('right');
//     });
    
//     $(".list_vw").click(function () {
//         $(".packbox").removeClass('grid-width');
//         $(".schoolinfobox_img").removeClass('left');
//         $(".schoolinfobox_tex").removeClass('right');
//     });
//     });
    
    /*Grid-view-and-List-view*/