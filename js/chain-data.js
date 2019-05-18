/** This module generates the number chains and provides access to the currently generated chain list
 *  The module is accessible through window.chainData
 */
(function() {
  const chainTypes = chain.classes;
  const chainLimit = 25;


  var chains = [];

  var module = {};

  /** This function will generate a new list of chains after initializing srand with the given seed
   */
  module.reload = function(seed) {
    srand({seed:seed});

    chains = [];
    while(chains.length < chainLimit) { 
      var chainType = srand(chainTypes);
      var newChain = new chainType();
      
      // Only enter new chain if the same chain isn't already included in this list
      if (!_.some(chains, function(chain) { return chain.id === newChain.id; }))
        chains.push(newChain);
    }
  };

  /** Returns the currently calculated chains
   */
  module.get = function() {
    return chains;
  };



  window.chainData = module;
})();