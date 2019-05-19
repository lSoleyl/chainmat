// Function module to store and retrive the current seed
(function() {
  let storage = {
    seed: null,

    update: function(value) {
      document.cookie = 'seed=' + value
      this.seed = value;
    },

    /** Sets a new Seed
     */
    newSeed: function() {
      this.update((new Date()).getTime().toString());
    }
  };

  // Initialize the storage from a possibly set cookie
  let seedStr = _.find(document.cookie.split(';'), function(x) { return x.search("seed=") != -1 })
  if (seedStr) {
    storage.seed = seedStr.substr("seed=".length);
  } else {
    storage.newSeed();
  }

  window.seedStorage = function() {
    return storage;
  };
  
  
  // The seed display and change controls
  Vue.component('seed-storage', {
    data: function() { return storage; },
    template: '<div class="form-group form-inline">' +
                '<label>Seed</label> ' +
                '<div class="input-group">' +
                  '<div class="input-group-addon hoverGrey no-select dont-print" id="new-seed" v-on:click="newSeed()">Neu</div>' +
                  '<input type="text" v-bind:value="seed" v-on:input="update($event.target.value)" class="form-control" id="seed">' +
                '</div>' +
              '</div>',
  });


  // Used to repeat the seed on the print version of the solutions page
  Vue.component('seed-value', {
    data: function() { return storage; },
    template: '<div class="only-print">' +
                '<label>Seed</label>' +
                '<div id="seed-copy">{{seed}}</div>' +
              '</div>'
  });

})();
