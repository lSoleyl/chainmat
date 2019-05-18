// Function module to store and retrive the current seed
window.seedStorage = function(value) {
  if (value === undefined) { // Read access
    var seedStr = _.find(document.cookie.split(';'), function(x) { return x.search("seed=") != -1 })

    if (!seedStr)
      return null
    else 
      return seedStr.substr("seed=".length)
  } else {
    document.cookie = 'seed=' + value
  }
};
