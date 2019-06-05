$(document).ready(function() {

  var s,
  animationsModule = {

    settings: {
      
    },

    init: function() {

      s = this.settings;
      this.bindUIActions();

    },

    bindUIActions: function() {

      animationsModule.initAnimCircles();
      animationsModule.initPopups();
      animationsModule.initSidePopups();
      animationsModule.initSideBlocks();
      animationsModule.initAnimSection();
      animationsModule.initAnimSectionSlider();

    },

    // Init animated circles.
    initAnimCircles: function() {
      jQuery('.anim-circles-section').each(function() {
        var animSection = jQuery(this);
        ResponsiveHelper.addRange({
          '768..': {
            on: function() {
              animSection.animCircles({
                fixedClass: 'fixed-state',
                scrollClass: 'scroll-state',
                svgItem: '.bg-circle',
                svgWrapper: '.img-holder',
                animSpeed: 300
              });
            },
            off: function() {
              animSection.animCircles('destroy');
            }
          }
        });
      });
    },

    // Init popups.
    initPopups: function() {
      jQuery('[class*="hotspot"]:has(> .spot-holder)').contentPopup({
        mode: 'hover',
        btnOpen: '.spot-opener'
      });

      jQuery('.wrap:has(.call-out)').contentPopup({
        mode: 'hover',
        btnOpen: '> a'
      });
    },

    // Init side popups.
    initSidePopups: function() {
      var $doc = jQuery(document);
      var $win = jQuery(window);
      var $body = jQuery('body');
      var activeClass = 'opener-active';
      var navOpener = jQuery('#header .nav-opener');
      var cropSize = '320';

      $doc.on('click', '.foot-note, .emblem-note', function(e) {
        e.preventDefault();
        var opener = jQuery(this);

        if (opener.hasClass(activeClass)) return;
        opener.addClass(activeClass);
        var template;

        if (opener.hasClass('foot-note')) {
          template = 
              '<div class="side-popup footnote">' +
              '<div class="holder">' +
              '<span class="label">' + opener.text() + '</span>' +
              '<p>' + opener.data('textContent') + '</p>' +
              '<a href="javascript:;" class="close"><span class="icon-cancel"></span></a>' +
              '</div>' +
              '</div>';
        }

        if (opener.hasClass('emblem-note')) {
          template = 
              '<div class="side-popup emblem">' +
              '<div class="holder">' +
              '<figure class="figure">' +
              '<img src="/images/emblems/' + cropSize + '/emblem' + ('0' + opener.data('emblemId')).slice(-2) + '.' + cropSize + '.jpg" alt="' + opener.text() + '">' +
              '<figcaption>' +
              '<span class="title">Emblem ' + opener.data('emblemId') + '</span>' +
              '<a href="/templates/modals/modal-add.html" data-link="add" data-type="ajax" class="lightbox add">' +
              '<img src="/images/icon-add.png" alt="add" width="26" height="25" class="default">' +
              '<img src="/images/icon-add02.png" alt="add" width="26" height="25" class="hover">' +
              '<span class="call-out">Add to Collection</span>' +
              '</a>' +
              '</figcaption>' +
              '</figure>' +
              '<a href="javascript:;" class="close"><span class="icon-cancel"></span></a>' +
              '</div>' +
              '</div>';
        }

        var $template = jQuery(template);
        $template.data('opener', opener);


        if (navOpener.length && navOpener.css('display') === 'none') {
          $template.css({
            'top': opener.offset().top,
            'left': jQuery('.content').eq(0).offset().left + jQuery('.content').outerWidth(),
            'right': 0
          });
        } else {
          $template.css({
            'top': opener.offset().top - $template.outerHeight() / 2,
            'left': '50%',
            'right': ''
          });
        }

        $template.find('.close').on('click', function(e) {
          e.preventDefault();
          var closeLink = jQuery(this);
          var popup = closeLink.closest('.side-popup');

          $template.data('opener').removeClass(activeClass);
          $template.remove();
        });

        if ($template.find('[data-link="add"]').length) {
          $template.find('[data-link="add"]').attr('data-add-id', opener.data('emblemId'));
        }

        if ($body.hasClass('cookies-disabled') && $template.find('[data-link]').length) {
          $template.find('[data-link]').css({
            'display': 'none'
          });
        }

        $body.append($template);
        initFancybox();
      });

      function resizeHandler() {
        var activePopups = jQuery('.side-popup');

        if (activePopups.length) {
          activePopups.each(function() {
            var curPopup = jQuery(this);

            if (navOpener.length && navOpener.css('display') === 'none') {
              curPopup.css({
                'top': curPopup.data('opener').offset().top,
                'left': jQuery('.content').eq(0).offset().left + jQuery('.content').outerWidth(),
                'right': 0
              });
            } else {
              curPopup.css({
                'top': curPopup.data('opener').offset().top - curPopup.outerHeight() / 2,
                'left': '50%',
                'right': ''
              });
            }
          });
        }
      }

      $win.on('resize orientationchange', resizeHandler);
    },

    // Init side blocks.
    initSideBlocks: function() {
      var $win = jQuery(window);

      jQuery('.side-block').each(function() {
        var bottomClass = 'bottom-block';
        var sideBlock = jQuery(this);
        var blockHolder = sideBlock.prev();
        var content = sideBlock.closest('.content');
        var contentRight = parseFloat(content.css('paddingRight'));

        function setPosition() {
          if (sideBlock.hasClass(bottomClass)) {
            sideBlock.css({
              'bottom': content.outerHeight() - (blockHolder.position().top + blockHolder.outerHeight()),
              'left': content.position().left + content.outerWidth()
            });
          } else {
            var extraTop = 0;
            var blockBottom = blockHolder.position().top + sideBlock.outerHeight();
            var contentBottom = content.position().top + content.outerHeight();

            if (blockBottom > contentBottom) {
              extraTop = blockBottom - contentBottom + 50;
            }

            sideBlock.css({
              'top': blockHolder.position().top - extraTop,
              'left': content.position().left + content.outerWidth()
            });
          }
        }

        ResponsiveHelper.addRange({
          '768..': {
            on: function() {
              setPosition();
              $win.on('resize orientationchange', setPosition);
            }
          },
          '..767': {
            on: function() {
              $win.off('resize orientationchange', setPosition);

              sideBlock.css({
                'top': '',
                'bottom': '',
                'left': ''
              });
            }
          }
        });
      });
    },

    // Slider for animated section.
    initAnimSectionSlider: function() {
      var sections = jQuery('.properties-section:has(.board-slider)');
      
      sections.each(function() {
        var section = jQuery(this);

        ResponsiveHelper.addRange({
          '768..': {
            on: function() {
              section.animSectionSlider({
                fixedClass: 'fixed-state',
                scrollClass: 'scroll-state',
                innerSections: '.mask',
                innerSlider: '.board-slider'
              });
            },
            off: function() {
              section.animSectionSlider('destroy');
            }
          }
        });
      });
    },

    // Init animated section.
    initAnimSection: function() {
      jQuery('.anim-section').each(function() {
        var section = jQuery(this);
        ResponsiveHelper.addRange({
          '768..': {
            on: function() {
              section.animSection({
                fixedClass: 'fixed-state',
                scrollClass: 'scroll-state',
                stepClass: 'content-active'
              });
            },
            off: function() {
              section.animSection('destroy');
            }
          }
        });
      });
    }

  }

  animationsModule.init();

});
