$(document).ready(function() {

  var s,
  globalModule = {

    settings: {
      
    },

    init: function() {

      s = this.settings;
      this.bindUIActions();

    },

    bindUIActions: function() {

      globalModule.initMagnify();
      globalModule.initMobileNav();
      globalModule.initTabs();
      globalModule.initStickyBlock();
      globalModule.initAnchors();
      globalModule.initOwlCarousel();
      globalModule.initAudioPlayer();

    },

    initMagnify: function() {
      $('.zoom').magnify();
    },

    initMobileNav: function() {
      jQuery('body').mobileNav({
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener'
      });
    },

    // Init content tabs.
    initTabs: function() {
      jQuery('.tabset').tabset({
        tabLinks: 'a',
        activeClass: 'tab-active',
        defaultTab: true
      });
    },

    // Init sticky block.
    initStickyBlock: function() {
      var $win = jQuery(window);
      var $body = jQuery('body');
      var fixedClass = 'fixed-header';
      var holder = jQuery('#header');
      var fakeHeader = jQuery('<div class="fake-header"></div>');

      if (!$body.find('.fake-header').length) {
        fakeHeader.insertBefore(holder);
      }

      function setHeight() {
        fakeHeader.css({
          'height': holder.outerHeight()
        });
      }

      function scrollHandler() {
        if ($win.scrollTop() > fakeHeader.offset().top + fakeHeader.outerHeight()) {
          $body.addClass(fixedClass);
        } else {
          $body.removeClass(fixedClass);
        }
      }

      function resizeHandler() {
        $body.removeClass(fixedClass);
        setHeight();
        scrollHandler();
      }

      resizeHandler();

      $win.on('resize orientationchange', resizeHandler);
      $win.on('scroll', scrollHandler);
    },

    // Init smooth anchor links.
    initAnchors: function() {
      new SmoothScroll({
        anchorLinks: '.anchor',
        extraOffset: function() {
          var totalHeight = 0;
          jQuery('#header').each(function() {
            var $box = jQuery(this);
            var stickyInstance = $box.data('StickyScrollBlock');
            if (stickyInstance) {
              stickyInstance.stickyFlag = false;
              stickyInstance.stickyOn();
              totalHeight += $box.outerHeight();
              stickyInstance.onResize();
            } else {
              totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
            }
          });
          return totalHeight;
        },
        activeClasses: 'parent',
        wheelBehavior: 'none'
      });
    },

    // Init owl carousel.
    initOwlCarousel: function() {
      jQuery('.waies-carousel').owlCarousel({
        loop:false,
        margin:21,
        nav:true,
        navText: ["<span class='icon-left'></span>","<span class='icon-left'></span>"],
        navClass: ['owl-prev','owl-next'],
        responsive:{
          0:{
            items:1 
          },
          650:{
            items:2 
          },
          960:{
            items:3
          },
          1365:{
            items:4,
            autoWidth:true
          }
        }
      });

      jQuery('.square-carousel').owlCarousel({
        items:1,
        loop:true,
        nav:false,
        animateOut: 'fadeOut',
        autoplay:true,
        autoplayTimeout:5000,
        autoplayHoverPause:true
      });

      var boardOwl = jQuery('.board-slider');

      boardOwl.on('initialized.owl.carousel', function(event) {
        setTimeout(function() {
          boardOwl.trigger('refresh.owl.carousel');
        }, 50);
      });

      boardOwl.owlCarousel({
        items: 1,
        loop: false,
        nav: false,
        animateOut: 'fadeOut',
        autoplay: false
      });
    },

    initAudioPlayer: function() {

      let audio = document.getElementById('audio-source'),
          playButton = document.getElementById('play-button'),
          volumeSlider = document.getElementById('volume-slider');
      
      if (playButton) {
        playButton.onclick = function() {
          if (audio.paused) {
            audio.play();
            playButton.innerHTML = '❚❚';
          } else {
            audio.pause();
            playButton.innerHTML = '▶';
          }
        }
      }
    
    }

  }

  globalModule.init();

});
