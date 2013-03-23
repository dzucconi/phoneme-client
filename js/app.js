(function() {
  "use strict";

  var Loader = {
    initialize: function() {
      this.el = $("#loader");
    },

    show: function() {
      this.el.show().spin(Loader.template);
    },

    hide: function() {
      this.el.hide().spin(false)
    },

    template: {
      lines: 11,
      length: 3,
      width: 2,
      radius: 5,
      corners: 1.0,
      rotate: 0,
      trail: 60,
      speed: 2.0,
      color: "#fff"
    }
  };

  var Phonemes = {
    start: function() {
      var periodicUpdate = _.debounce(this.update, 150);

      this.$editor.on("keyup", periodicUpdate);
    },

    wrap: function(words) {
      return _.map(words, function(word){ return "<span class='word'>" + word.trim() + "</span>"; });
    },

    update: function() {
      var context = Phonemes;

      Loader.show();

      $.ajax({
        url: context.apiRoot,
        method: "POST",
        data: { text: context.$editor.val() }
      }).done(function(response) {
        var fragment = context.wrap(response.text.split("|"));
        context.$output.html(fragment.join(context.wordSeparator));
      }).error(function(response){
        context.$output.html("ERROR");
      }).complete(function(){
        Loader.hide();
      });
    },

    initialize: function() {
      this.apiRoot = "http://api.corrasable.com/phonemes";
      this.$editor = $("#editor");
      this.$output = $("#output");
      this.wordSeparator = " ";

      Loader.initialize();
      Phonemes.start();
    }
  };

  $(function() { Phonemes.initialize(); });
}());
