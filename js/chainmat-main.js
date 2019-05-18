/** Main entry point for this application
 */
(function(data, seed) {
  //Recalculate the excercise data and redisplay it
  function reloadVariables() {
    data.reload(parseInt($("#seed").val()));


    const CHAIN_LENGTH = 6;

    $('.tasks').empty();
    $('.solutions').empty();

    _.each(data.get(), function(chain, chainIndex) {

      // Task
      var chainNumbers = _.map(_.range(CHAIN_LENGTH-1), function(i) { return chain.get(i); });
      var chainString  = chainNumbers.join(', ');
      $('.tasks').append($('<div class="task"><span class="taskNr">' + (chainIndex+1) + '</span><span class="chain">' + chainString + '</span></div>'));




      // Solution

      // Append operations to numbers
      var numberOps = _.map(chainNumbers, function(number, index) { 
        return number + '<span class="op">' + chain.getOp(index) + '</span><span class="op2"></span>';
      });

      // Get the missing chain number 
      numberOps.push(chain.get(CHAIN_LENGTH-1));

      $('.solutions').append($('<div class="solution">' +
                                 '<span class="taskNr">' + (chainIndex+1) + '</span>' +
                                 '<span class="chain">' + numberOps.join('') + '</span>' +
                                 '<span class="hint">' + chain.hint() + '</span>' +
                                '</div>'));

    });
  }

  //Wait for document to be ready
  $(function() {
    //Synchronize both seed values
    $('#seed').change(function() {
      $('#seed-copy').text($('#seed').val());
    });

    //Synchronize seed storage with input field
    $('#seed').val(seed() || (new Date()).getTime())
    $('#seed').change();
    seed($('#seed').val())

    //Set recalc button handler
    $('#recalc').click(function() {
      seed($('#seed').val())
      reloadVariables()
    })

    //Set button handler for new seed
    $('#new-seed').click(function() {
      $('#seed').val((new Date()).getTime())
      $('#seed').change();
      seed($('#seed').val())
      reloadVariables()
    })



    //Initial variable calculation and display
    reloadVariables()

    //Make content visible now, since scripts are done loading
    $('#content').removeClass('hidden')
    $('#loading').addClass('hidden')
  });
})(window.chainData, window.seedStorage);
