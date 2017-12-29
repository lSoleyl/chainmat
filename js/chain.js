/** This module defines the chain classes
 */
define(['lodash', 'srand'], function(_, srand) {

  //needed by some chains
  var primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53];


  /** Each chain holds a list of already calculated values and an id, which has to be defined by the algorithm used
   *  Each chain must provide a getOp() and calc() method to calculate the values of the chain and 
   *  to display the calculation scheme in the solution section
   *
   *  The constructor of each concrete chain class should initialize the chain with random values from srand.
   */
  class Chain {
    constructor() {
      this.id = new Error("Undefined id")
      this.values = [];
    }

    /** This abstract function needs to be implemented for get() to work correctly
     * 
     * @param index the index of the number to compute
     * @param prev the previous value of the chain
     */
    calc(index, prev) {
      throw new Error("calc() not implemented!");
    }

    /** Retrieves the number for the given index and calculates it if necessary
     */
    get(index) {
      if (this.values[index] === undefined)
        this.values[index] = this.calc(index, this.get(index-1));

      return this.values[index];
    }

    /** Retrieves the stringified operation, which will be applied to the number with the given index
     *  The default implementation simply calculates the difference between i and i+1
     */
    getOp(index) {
      var delta = this.get(index+1) - this.get(index);
      return (delta < 0) ? ('-' + (delta*-1)) : ('+' + delta);
    }

    /** A solution hint as to how this chain works
     */
    hint() {
      return "";
    }
  }

  /** Constructs a fibonacci chain from two random starting values
   */
  class FibonacciChain extends Chain {  
    constructor() {
      super();
      this.values = [srand({min:1, max:10})];
      this.values.push(srand({min:this.values[0], max:10}));
      this.id = "fib," + this.values[0] + "," + this.values[1];
    }

    calc(index) {
      return this.get(index-2) + this.get(index-1);
    }

    getOp(index) {
      if (index === 0)
        return "?"; //first two numbers are predetermined

      return "+" + this.get(index-1);
    }

    hint() {
      return "Die zwei vorhergehenden Zahlen ergeben die nächste.";
    }
  }

  /** This chain gets generated by adding a constant or incrementing value to the previous value of the chain
   */
  class AddChain extends Chain {
    constructor() {
      super();
      this.values = [srand({min:-100, max:100})]; //random starting number
      this.dv = srand({min:-20, max:20}); //initial value for number increment
      this.ddv = (srand()) ? srand({min:-5, max:5}) : 0; //value by which the increment changes each index (only used in 50% of all cases)
      this.alternate = (srand() === 1); //alternate signs each second index


      if ((this.dv < 0) ^ (this.ddv < 0)) {
        // only allow alternation if the sign switch of dv won't be within the first 6 transtions
        if (Math.abs(this.dv / this.ddv) < 6) {
          // a sign switch makes the alternation very hard to figure out
          this.alternate = false;  
        }        
      }

      this.id = "add," + this.values[0] + "," + this.dv + "," + this.ddv + "," + this.alternate;
    }

    calc(index, prev) {
      var sign = 1;
      if (this.alternate && (index % 2) == 0)
        sign = -1;
      return prev + (this.dv + (this.ddv * (index-1)))*sign;
    }

    hint() {
      var hint = "d=" + this.dv + " wird auf die vorherige Zahl addiert.";
      if (this.ddv !== 0)
        hint += " in jedem Schritt wird " + this.ddv + " zu d addiert.";
      if (this.alternate)
        hint += " Vorzeichen wechselt.";

      return hint;
    }
  }

  class AddPrimesChain extends Chain {
    constructor() {
      super();

      this.values = [srand({min:-10, max:10})]; //start value for prime number addition
      this.alternate = (srand() === 1); //do we alternate signs after each number
      this.sign = (srand()) ? -1 : 1;   //add or subtract prime numbers (alternate will swap the sign)
      this.startIndex = srand({max:3}); //the prime number, we start with

      this.id = "primes," + this.values[0] + "," + this.alternate + "," + this.sign + "," + this.startIndex;
    }

    calc(index, prev) {
      var prime = primes[this.startIndex+index-1]; //the prime, we have to add

      var sign = this.sign;
      if (this.alternate && (index % 2) == 0)
        sign *= -1;

      return prev + (prime*sign);
    }

    hint() {
      var hint = "Primzahlen ab " + primes[this.startIndex] + " werden zur vorherigen Zahl " + (this.sign === 1 ? "addiert" : "subtrahiert");
      if (this.alternate)
        hint += " (Vorzeichen wechselt)";
      hint += ".";
      return hint;
    }
  }

  /** Alternates between two numbers, which are added to the current number of the chain
   */
  class AddPairChain extends Chain {
    constructor() {
      super();
      this.numbers = _.range(-10, 11); //This will define the pair of numbers to add
      while(this.numbers.length > 2) {
         _.pull(this.numbers, srand(this.numbers));
      }

      this.values = [srand({min:-100, max:100})]; //start value
      this.id = "addtuple," + JSON.stringify(this.numbers) + "," + this.values[0];
    }

    calc(index, prev) {
      return prev + this.numbers[(index-1)%this.numbers.length];
    }

    hint() {
      return "Die Zahlen " + this.numbers.join(', ') + " werden abwechselnd auf die vorherige Zahl addiert";
    }
  }

  /** Will multiply the initial number with a small given number (2 or 3)
   */
  class MultiplyChain extends Chain {
    constructor() {
      super();

      this.factor = srand({min:2,max:3});
      this.values = [srand({min:1, max:5})];
      this.alternate = (srand() === 1);
      this.id = "multiply," + this.values[0] + "," + this.factor + "," + this.alternate;
    }

    calc(index, prev) {
      var f = this.factor;
      if (this.alternate && (index % 2 == 0))
        f *= -1;

      return prev * f;
    }

    getOp(index) {
      var f = this.get(index+1) / this.get(index);
      return (f < 0) ? ('&middot; (' + (f) + ')') : ('&middot;' + f);
    }

    hint() {
      var hint = "Vorherige Zahl wird mit " + this.factor + " multipliziert.";
      if (this.alternate)
        hint += " Vorzeichen wechselt.";

      return hint;
    }
  }

  /** This chain will add a base value to the previous value, which rises on each step by multiplying it with a constant
   */
  class AddMulChain extends Chain {
    constructor() {
      super(); 
      this.values = [srand({min:-100, max:10})];
      this.f = srand({min:1, max:5});
      this.ff = srand({min:2,max:3});
      this.alternate = (srand() === 1);

      this.id = "addmul," + this.values[0] + "," + this.f + "," + this.ff + "," + this.alternate;
    }

    calc(index, prev) {
      var f = this.f * Math.pow(this.ff, index-1)
      if (this.alternate && index%2 === 0)
        f *= -1;

      return prev + f;
    }

    hint() {
      var hint = "f = " + this.f + " wird auf den vorherigen Wert addiert.";
      hint += " f wird in jedem Schritt mit " + this.ff + " multipliziert. ";
      if (this.alternate)
        hint += " Vorzeichen wechselt.";

      return hint;
    }
  }

  /** Alternates between two factors, which get applied to the number
   */
  class MulPairChain extends Chain {
    constructor() {
      super();

      this.values = [srand({min:1,max:3})]; //We need a small starting number
      this.factors = _.range(-5, 5);
      _.pull(this.factors, 0); //0 as factor would destroy the chain
      while(this.factors.length > 2)
        _.pull(this.factors, srand(this.factors));

      this.id = "mulpair," + JSON.stringify(this.factors) +"," + this.values[0];
    }

    calc(index, prev) {
      var f = this.factors[(index-1)%this.factors.length];
      return prev * f;
    }

    getOp(index) {
      var f = this.get(index+1) / this.get(index);
      return (f < 0) ? ('&middot; (' + (f) + ')') : ('&middot;' + f);
    }

    hint() {
      return "Die Zahlen " + this.factors.join(', ') + " werden abwechselnd mit der vorherigen Zahl multipliziert.";
    }
  }

  /** Implements an operation chain *x :x +x  or *x :x -x
   */
  class MulDivAddChain extends Chain {
    constructor() {
      super();

      this.f = srand([2,5,10,20]);
      this.values = [srand({min:1,max:10})*this.f];
      this.subtract = (srand() === 1); //subtract instead of add

      this.id = "muldivadd," + this.f + "," + this.values[0] + "," + this.subtract;
    }

    calc(index, prev) {
      var ops = [_.divide, (this.subtract ? _.subtract : _.add), _.multiply];
      return ops[(index-1)%ops.length](prev, this.f);
    }

    getOp(index) {
      var ops = [':', (this.subtract ? '-' : '+'), '&middot;'];
      return ops[index%ops.length] + this.f;
    }

    hint() {
      var self = this;
      return "Die Operationen " + _.map([0,1,2], function(i) { return self.getOp(i); }).join(', ') + " werden in der Reihenfolge immer wieder wiederholt";
    }
  }

  /** This chain multiplies with a small number and then subtracts a large number
   */
  class MulSubChain extends Chain {
    constructor() {
      super();

      this.f = srand({min:2, max:5});
      this.sub = srand({min:6, max:20});
      var minValue = ~~(this.sub/this.f);
      this.values = [ srand({min:minValue, max: minValue+10}) ];

      this.id = "mulsub," + this.f + "," + this.sub + "," + this.values[0];
    }

    calc(index, prev) {
      if ((index)%2 == 1) { //multiply
        return prev * this.f;
      } else {
        return prev - this.sub;
      }
    }

    getOp(index) {
      var ops = ['&middot;' + this.f, '-' + this.sub];
      return ops[index%2];
    }

    hint() {
      return "Die Operationen " + this.getOp(0) +  ", " + this.getOp(1) + " werden abwechselnd angewendet.";
    }
  }

  /** Implements a difficult -a, *b, +c chain
   */
  class MulAddSubChain extends Chain {
    constructor() {
      super();

      this.add = srand({min:1, max:10});
      this.sub = srand({min:1, max:10});
      this.f = srand({min:2, max:3});

      this.values = [ srand({min:5, max: 10}) ];

      this.id = "muladdsub," + this.add + "," + this.sub + "," + this.f + "," + this.values[0];
    }

    calc(index, prev) {
      var ops = [_.curryRight(_.subtract)(this.sub), _.curry(_.multiply)(this.f), _.curry(_.add)(this.add)];
      return ops[(index-1)%3](prev);
    }

    getOp(index) {
      var ops = ['-' + this.sub, '&middot;' + this.f, '+' + this.add];
      return ops[index%3];
    }

    hint() {
      var self = this;
      return "Die Operationen " + _.map([0,1,2], function(i) { return self.getOp(i); }).join(', ') + " werden in der Reihenfolge immer wieder wiederholt";
    }
  }

  /** This class implements a multiplication with prime numbers... there is only one such chain
   */
  class PrimeFactorChain extends Chain {
    constructor() {
      super();
      this.values = [1]; //we start with 1
      this.id = 'mulprimes';
    }

    calc(index, prev) {
      return prev*primes[index-1];
    }

    getOp(index) {
      return '&middot;' + primes[index];
    }

    hint() {
      return "Es werden nacheinander alle Primzahlen multipliziert."
    }
  }

  /** This class implements another special chain (1*2*3*4*5*...)
   */
  class FactorialChain extends Chain {
    constructor() {
      super();
      this.values = [1]; //we start with 1
      this.id = "factorial";
    }

    calc(index, prev) {
      return prev*(index+1);
    }

    getOp(index) {
      return '&middot;' + (index+2);
    }

    hint() {
      return "Es werden alle Zahlen aufsteigend multipliziert (Fakultät).";
    }
  }

  class SquareNumberChain extends Chain {
    constructor() {
      super();
      this.startValue = srand({min:2, max:15});
      this.values = [ this.calc(0) ];
      this.id = "squares," + this.startValue;
    }

    calc(index, prev) {
      return Math.pow(this.startValue+index, 2);
    }

    getOp(index) {
      return "= " + (this.startValue+index+1) + "<sup>2</sup>";
    }

    hint() {
      return "Quadratzahlen aufsteigend ab " + this.startValue;
    }
  }





  var module = {};
  module.classes = [ //A list of all implemented chain classes
    FibonacciChain,
    AddChain,
    AddPrimesChain,
    AddPairChain,
    MultiplyChain,
    AddMulChain,
    MulPairChain,
    MulDivAddChain,
    MulSubChain,
    MulAddSubChain,
    PrimeFactorChain,
    FactorialChain,
    SquareNumberChain,
  ];

  return module;
});