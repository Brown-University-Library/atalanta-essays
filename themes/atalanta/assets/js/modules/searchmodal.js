$(document).ready(function() {

  var s,
  searchModule = {

    settings: {
      animationMenuSlideIn: 'topnav--slide-in',
      animationMenuSlideOut: 'topnav--slide-out',
      topnavSearchBtn: '.topnav__search button',
      searchModalOpened: 'topnav__search--open',
      searchModalClosed: 'topnav__search--closed',
      searchModal: 'div.search__modal',
      animationSearchSlideIn: 'search__modal--slide-in',
      animationSearchSlideOut: 'search__modal--slide-out',
      xCloseBtn: 'button.x-close',
      xCloseBtnSVG: 'button.x-close > svg',
      searchURL: '../search/search.html?q=',
      searchQueryInput: 'input#search__bar__field',
      submitSearchBtn: '.search__modal button.submit',
      searchForm: '#ataSearch',
      $documentElement: $('html, body')
    },

    init: function() {

      s = this.settings;
      this.bindUIActions();

    },

    bindUIActions: function() {
      searchModule.initSearch();
    },

    initSearch: function() {

      /* search topnav button */
      $(s.topnavSearchBtn).click(function(event) {
        if( $(s.topnavSearchBtn).hasClass(s.searchModalClosed) ) {
          searchModule.searchTextClear();
          searchModule.searchModalOpen();
        }
        else if( $(s.topnavSearchBtn).hasClass(s.searchModalOpened) ) {
          searchModule.searchModalClose();
        }
        else {
          console.log("THE SEARCH BUTTON HAS NO STATE");
        }
        event.preventDefault();
      });

      /* X button to close search modal */
      $(s.xCloseBtnSVG).click(function(event) {
        event.stopPropagation();
        event.preventDefault();
      });
      $(s.xCloseBtn).click(function() {
        searchModule.searchModalClose();
      });

      /* submit on enter key */
      $(s.searchForm).submit(function(event){
        searchModule.searchModalClose();
        event.preventDefault();
      });

    },

    searchTextClear: function() {
      $(s.searchQueryInput).val('');
    },
    
    searchModalClose: function() {
      $(s.topnavSearchBtn).removeClass(s.searchModalOpened);
      $(s.topnavSearchBtn).addClass(s.searchModalClosed);
      $(s.searchModal).attr('aria-hidden', 'true');
      $(s.searchModal).addClass(s.animationSearchSlideOut);
      $(s.searchModal).removeClass(s.animationSearchSlideIn);
      // $('body').removeClass('no-scroll');
    },

    searchModalOpen: function() {
      $(s.topnavSearchBtn).removeClass(s.searchModalClosed);
      $(s.topnavSearchBtn).addClass(s.searchModalOpened);
      $(s.searchModal).attr('aria-hidden', 'false');
      $(s.searchModal).addClass(s.animationSearchSlideIn);
      $(s.searchModal).removeClass(s.animationSearchSlideOut);
      $(s.searchQueryInput).focus();
      // $('body').addClass('no-scroll');
    }

  }

  searchModule.init();

  $(document).on('click', '[data-lightbox]', lity);

  $('.btn--doi').click(function(e) {
    var text = $(this).attr('data-copy');
    var el = $(this);
    copyToClipboard(text, el);
  });

  function copyToClipboard(text, el) {
      var copyTest = document.queryCommandSupported('copy');

    if (copyTest === true) {
        var copyTextArea = document.createElement("textarea");
        copyTextArea.value = text;
        document.body.appendChild(copyTextArea);
        copyTextArea.select();
        document.execCommand('copy');
    } else {
    // Fallback if browser doesn't support .execCommand('copy')
      window.prompt("Copy to clipboard: Ctrl+C or Command+C, Enter", text);
    }
  }

});
