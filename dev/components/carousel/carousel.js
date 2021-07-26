
$(function () {

  $('.slider').slick({
    infinite: true,
    speed: 300,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true, 
    mobileFirst: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        }
      },
    ]
  });

});