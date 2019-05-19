/** Main entry point for this application
 */
(function(data, seed) {
  //TODO: Remove this as soon as data flow is completely managed by vue
  var seed = function() { return seedStorage().seed; };

  const CHAIN_LENGTH = 6;

  //Recalculate the excercise data and redisplay it
  function reloadVariables() {
    //TODO: this must be removed...
    data.reload(parseInt(seed()));


    //TODO: remove this
    //$('.tasks').empty();
    $('.solutions').empty();

    _.each(data.get(), function(chain, chainIndex) {

      //TODO: remove this
      // Task

      //var chainString  = chainNumbers.join(', ');
      //$('.tasks').append($('<div class="task"><span class="taskNr">' + (chainIndex+1) + '</span><span class="chain">' + chainString + '</span></div>'));




      // Solution

      // Append operations to numbers
      var numberOps = _.map(chain.getAll(), function(number, index) { 
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


  Vue.component('chain-tasks', {
    props:['chains'],
    template: '<div class="tasks">' +
                '<div class="task" v-for="(chain,index) in chains">' +
                  '<span class="taskNr">{{index+1}}</span>' +
                  '<span class="chain">{{chain.getAll().join(", ")}}</span>'+
                '</div>' + 
              '</div>'

  });

  //Wait for document to be ready
  $(function() {
    
    let vm = new Vue({
      el: '#content',
      data: window.seedStorage(),
      computed: {
        chains: function() {
          return chainData.generate(parseInt(this.seed), CHAIN_LENGTH);
        }
      }
    });


    //Set recalc button handler
    $('#recalc').click(function() { 
      //TODO: this shouldn't be necessary once we have the templates
      reloadVariables()
    })

    //Set button handler for new seed
    $('#new-seed').click(function() {
      //TODO: this should happen automatically as soon as the current seed value changes
      reloadVariables()
    })


    //Initial variable calculation and display
    reloadVariables()

    //Make content visible now, since scripts are done loading
    $('#content').removeClass('hidden')
    $('#loading').addClass('hidden')
  });
})(window.chainData, window.seedStorage);
