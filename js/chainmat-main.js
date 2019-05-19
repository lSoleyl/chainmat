/** Main entry point for this application
 */
(function() {
  // The amount of numbers in each chain (solution) to generate
  const CHAIN_LENGTH = 6;

  /** This component is used to generate the task list and displays the numbers for each generated chain
   */
  Vue.component('chain-tasks', {
    props:['chains'],
    data: function() { return { chainLength: CHAIN_LENGTH-1 }; }, // The task chain length is one element shorter (the last one is to be guessed)
    template: '<div class="tasks">' +
                '<div class="task" v-for="(chain,taskIndex) in chains">' +
                  '<span class="taskNr">{{taskIndex+1}}</span>' +
                  '<span class="chain">{{chain.getN(chainLength).join(", ")}}</span>'+
                '</div>' + 
              '</div>'

  });

  /** This component is used to print the solutions to each chain
   */
  Vue.component('chain-solutions', {
    props:['chains'],
    template: '<div class="solutions">' +
                '<div class="solution" v-for="(chain,taskIndex) in chains">' +
                  '<span class="taskNr">{{taskIndex+1}}</span>' +
                  '<chain-steps v-bind:chain="chain"></chain-steps>' +
                  '<span class="hint" v-html="chain.hint()"></span>' +
                '</div>' +
              '</div>'
  });

  /** This component is used to print a chain with it's solution steps
   */
  Vue.component('chain-steps', {
    props: ['chain'],
    computed: {
      numbers: function() { 
        return this.chain.getN(CHAIN_LENGTH);  // The solution has one step more then the task
      }
    },
    template: '<span class="chain">' +
                '<span v-for="(number,index) in numbers">'+
                  '{{number}}<span class="op" v-if="index < numbers.length-1" v-html="chain.getOp(index)"></span><span class="op2" v-if="index < numbers.length-1"></span>' +
                '</span>' +
              '</span>'
  });

  

  //Wait for document to be ready
  $(function() {
    
    let vm = new Vue({
      el: '#content',
      data: window.seedStorage(), // The seed is the only real state of the application all other values are derived from this seed
      computed: {
        chains: function() {
          return chainData.generate(parseInt(this.seed) || 0, CHAIN_LENGTH);
        }
      }
    });

    //Make content visible now, since scripts are done loading
    $('#content').removeClass('hidden')
    $('#loading').addClass('hidden')
  });
})();
