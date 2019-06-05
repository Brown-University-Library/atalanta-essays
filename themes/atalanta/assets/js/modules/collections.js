$(document).ready(function() {

  var s,
  openCloseModule = {

    settings: {
      varName: $(".selector")
    },

    init: function() {

      s = this.settings;
      this.bindUIActions();

    },

    bindUIActions: function() {

      s.varName.click(function() {
        nameModule.functionName();
      });

    },

    // Function description
    functionName: function(e) {

    }

  }

  openCloseModule.init();

});
