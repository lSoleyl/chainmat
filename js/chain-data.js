/** This module generates the number chains and provides access to the currently generated chain list
 *  The module is accessible through window.chainData
 */
(function() {
  const chainTypes = chain.classes;
  const chainLimit = 25;

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


  window.chainData = module;
})();
