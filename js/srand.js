// random module for seeded random values.
// accessible through window.srand(options)
(function() {
  var helper = { //Helper object
    seed:0, //Initial seed
    // in order to work 'Math.seed' must NOT be undefined,
    // so in any case, you HAVE to provide a Math.seed
    seededRandom: function(max,min) {
      max = max || 1;
      min = min || 0;

      this.seed = (this.seed * 9301 + 49297) % 233280;
      var rnd = this.seed / 233280;

      return min + rnd * (max - min);
    }
  }

  /** The actual srand() function
   */
  window.srand = function(options) {
    options = options || {}
    if (options.seed !== undefined) {
      helper.seed = options.seed
      return
    }

    var min = options.min || 0
    var max = options.max || 1
    var step = options.step || 1

    if (Array.isArray(options)) { //Select random element from array
      min = 0
      max = options.length - 1
      step = 1
    }
    
    var delta = (max - min) / step
    
    var result
    if (delta < 1)
      result = min
    else 
      result = parseInt(helper.seededRandom(delta+1, 0)) * step + min
    if (Array.isArray(options))
      return options[result]
    else
      return result
  }
})();