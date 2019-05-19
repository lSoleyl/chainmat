/** This module generates the number chains and provides access to the currently generated chain list
 *  The module is accessible through window.chainData
 */
(function() {
  const chainTypes = chain.classes;
  const chainLimit = 25;


  let chains = []; //TODO: remove this 

  let module = {};

  /** This function will generate a new list of chains after initializing srand with the given seed
   */
  module.generate = function(seed, chainLength) {
    srand({seed:seed});

    var chains = [];
    while(chains.length < chainLimit) { 
      let chainType = srand(chainTypes);
      let newChain = new chainType();
      
      // Only enter new chain if the same chain isn't already included in this list
      if (!_.some(chains, function(chain) { return chain.id === newChain.id; })) {
        if (chainLength !== undefined) {
          newChain.setLength(chainLength);
        }
        chains.push(newChain);
      }
    }

    return chains;
  };

  //TODO: remove this
  module.reload = function(seed) {
    chains = module.generate(seed);
  }

  //TODO: remove this
  /** Returns the currently calculated chains
   */
  module.get = function() {
    return chains;
  };



  window.chainData = module;
})();