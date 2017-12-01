// Constructor for new GaussianInt objects
function GaussianInt( re, im ) {
	this.re = Math.round( re );
	this.im = Math.round( im );
}

// Getter for real component
GaussianInt.prototype.getRealPart = function() {
	return this.re;
};

// Getter for imaginary component
GaussianInt.prototype.getImaginaryPart = function() {
	return this.im;
};

// Flips sign on both real and imaginary components
GaussianInt.prototype.negate = function() {
	this.re = -this.re;
	this.im = -this.im;
};

// Returns a cloned GaussianInt
GaussianInt.prototype.clone = function() {
	return new GaussianInt( this.re, this.im );
};

// Returns true if real and imaginary components match the given input
GaussianInt.prototype.equals = function( val ) {
	return this.getRealPart() === val.getRealPart() && this.getImaginaryPart() === val.getImaginaryPart();
};

// Returns the norm: a^2 + b^2
GaussianInt.prototype.getNorm = function() {
	return this.getRealPart() * this.getRealPart() + this.getImaginaryPart() * this.getImaginaryPart();
};

// Returns true if value is +/- 1 or +/- i
GaussianInt.prototype.isUnit = function() {
	return this.getNorm() === 1;
};

// Returns true if both real and imaginary parts are zero
GaussianInt.prototype.isZero = function() {
  return this.getNorm() === 0;
};

GaussianInt.prototype.print = function() {

	let re = this.getRealPart();
	let im = this.getImaginaryPart();

	// Handle zero
	if ( re === 0 && im === 0 ) {
		return "0";
	}

	// Handle pure real
	if ( im === 0 ) {
		return re;
	}

	// Handle pure imaginary
	if ( re === 0 ) {
		switch ( im ) {
			case 1:
				return "i";
			case -1:
				return "-i";
			default:
				return im + "i";
		}
	}

	// Handle mixed case with -1i
	if ( im === -1 ) {
		return re + "-i";
	}

	// Handle mixed case with +1i
	if ( im === 1 ) {
		return re + "+i";
	}

	// Handle mixed case with positive imaginary part
	if ( im > 1 ) {
		return re + "+" + im + "i";
	}

	// Handle mixed case with negative imaginary part
	if ( im < 1 ) {
		return re + "-" + Math.abs( im ) + "i";
	}

	return "?";
};

// Subtracts the given gaussian int from the gaussian int to produce a new gaussian int
GaussianInt.prototype.add = function( toAdd ) {

	// Calculate the real part
	let re = this.getRealPart() + toAdd.getRealPart();

	// Calcualte the imaginary part
	let im = this.getImaginaryPart() + toAdd.getImaginaryPart();

	// Construct the subtracted value
	return new GaussianInt( re, im );
};

// Subtracts the given gaussian int from the gaussian int to produce a new gaussian int
GaussianInt.prototype.subtract = function( sub ) {

	// Calculate the real part
	let re = this.getRealPart() - sub.getRealPart();

	// Calcualte the imaginary part
	let im = this.getImaginaryPart() - sub.getImaginaryPart();

	// Construct the subtracted value
	return new GaussianInt( re, im );
};

// Divides the gaussian int by the given gaussian int to produce a new gaussian int
GaussianInt.prototype.divide = function( divisor ) {

	// Calculate the real part after division by the GCD
	let re = ( this.getRealPart() * divisor.getRealPart() + this.getImaginaryPart() * divisor.getImaginaryPart() ) / divisor.getNorm();

	// Calculate the imaginary part after division by the GCD
	let im = ( this.getImaginaryPart() * divisor.getRealPart() - this.getRealPart() * divisor.getImaginaryPart() ) / divisor.getNorm();

	// Construct the reduced value
	return new GaussianInt( re, im );
};

// Multiplies the gaussian int by the given gaussian int to produce a new gaussian int
GaussianInt.prototype.multiply = function( mult ) {

	// Calculate the real part of the product
	let re = this.getRealPart() * mult.getRealPart() - this.getImaginaryPart() * mult.getImaginaryPart();

	// Calculate the imaginary part of the product
	let im = this.getRealPart() * mult.getImaginaryPart() + this.getImaginaryPart() * mult.getRealPart();

	// Construct the product
	return new GaussianInt( re, im );
};

//===========================================//

class GaussianConsts {
	static one() {
		return new GaussianInt( 1, 0 );
	}

	static negativeOne() {
		return new GaussianInt( -1, 0 );
	}

	static i() {
		return new GaussianInt( 0, 1 );
	}

	static negativeI() {
		return new GaussianInt( 0, -1 );
	}
}

//===========================================//

function GaussianRational( num, den ) {
	this.num = num;
	this.den = den;
}

// Getter for numerator GaussianInt
GaussianRational.prototype.getNumerator = function() {
	return this.num;
};

// Getter for denominator GaussianInt
GaussianRational.prototype.getDenominator = function() {
	return this.den;
};

// Returns a clone of the current object
GaussianRational.prototype.clone = function() {
	return new GaussianRational( this.getNumerator().clone(), this.getDenominator().clone() );
};

// Returns true if numerator and denominator are both norm 1
GaussianRational.prototype.isUnit = function() {
	return this.getNumerator().isUnit() && this.getDenominator().isUnit();
};

// Returns true if fraction is -1/1
GaussianRational.prototype.isNegativeOne = function() {
	return this.isUnit() && this.getNumerator().getRealPart() === -1 && this.getDenominator().getRealPart() === 1;
};

// Returns true if fraction is 1/1
GaussianRational.prototype.isPositiveOne = function() {
	return this.isUnit() && this.getNumerator().getRealPart() === 1 && this.getDenominator().getRealPart() === 1;
};

// Returns true if fraction is i/1
GaussianRational.prototype.isImaginaryOne = function() {
	return this.isUnit() && this.getNumerator().getImaginaryPart() === 1 && this.getDenominator().getRealPart() === 1;
};

// Returns true if fraction is -i/1
GaussianRational.prototype.isNegImaginaryOne = function() {
	return this.isUnit() && this.getNumerator().getImaginaryPart() === -1 && this.getDenominator().getRealPart() === 1;
};

// Is the fraction equal to the input fraction
GaussianRational.prototype.equals = function( frac ) {
	return this.getNumerator().equals( frac.getNumerator() ) && this.getDenominator().equals( frac.getDenominator() );
};

// Negates the numerator and denominator
GaussianRational.prototype.negate = function() {
	this.getNumerator().negate();
	this.getDenominator().negate();
};

// Flips the numerator and denominator
GaussianRational.prototype.invert = function() {
	let temp = this.getNumerator();
	this.num = this.getDenominator();
	this.den = temp;

	// Return object for chaining
	return this;
};

// Outputs latex code for printing fraction
GaussianRational.prototype.print = function() {
	return "\\cfrac{" + this.getNumerator().print() + "}{" + this.getDenominator().print() + "}";
};

GaussianRational.prototype.getRemainder = function() {

	// Divide numerator by denominator and get nearest integer
	let near = this.getNumerator().divide( this.getDenominator() );

	// Compute the product of the nearest integer and the denominator
	let prod = this.getDenominator().multiply( near );

	// Subtract the product from the numerator to get the remainder
	return this.getNumerator().subtract( prod );
};

GaussianRational.prototype.normalize = function() {

	// If the denominator is pure imaginary, turn into pure real by multiplying by -i/-i
	if ( this.getDenominator().getRealPart() === 0 ) {
		this.num = this.getNumerator().multiply( GaussianConsts.negativeI() );
		this.den = this.getDenominator().multiply( GaussianConsts.negativeI() );
	}
  
	// If the denominator is real and negative, flip signs
	if ( this.getDenominator().getRealPart() < 0 ) {
		this.negate();
	}

	// If the numerator and denominator are the same, replace with 1
	if ( this.getNumerator().equals( this.getDenominator() ) ) {
		this.num = GaussianConsts.one();
		this.den = GaussianConsts.one();
	}

	// Return the object for chaining
	return this;
};

GaussianRational.prototype.getGCD = function() {

	// Make a copy of the fraction, since we'll be modifying it
	let frac = this.clone();

	// Make sure the larger number is the numerator
	if ( this.getDenominator().getNorm() > this.getNumerator().getNorm() ) {
		frac.invert();
	}

	// Calculate the remainder upon division
	let remainder = frac.getRemainder();

	// If we have zero remainder, then our denominator is our GCD
	if ( remainder.isZero() ) {
		return frac.getDenominator();
	}

	// To start, we'll assume the denominator is the GCD
	let gcd = frac.getDenominator();
	let i = 0;
  
  	// Keep reducing until we have zero remainder
	do {
		// Our GCD is our remainder prior to updating
		gcd = remainder;

		// Build a new fraction using the prior denominator and prior remainder
		frac = new GaussianRational( frac.getDenominator(), remainder );

		// Compute our new remainder
		remainder = frac.getRemainder();

		if ( i++ > 50 ) {
			throw "Unable to calculate GCD";
		}
	}
	while ( !remainder.isZero() );

	// Return the greatest common divisor
	return gcd;
};

GaussianRational.prototype.reduce = function( gcd ) {

	// Divide the numerator by the GCD
	this.num = this.getNumerator().divide( gcd ); 

	// Divide the denominator by the GCD
	this.den = this.getDenominator().divide( gcd );

	// Return object for chaining
	return this;
};

GaussianRational.prototype.reduceToLowestTerms = function() {

	// Calculate the GCD of the two guassian ints
	let gcd = this.getGCD();

	// Reduce the numerator and denominator by GCD, normalize and return
	return this.reduce( gcd ).normalize();
};

GaussianRational.prototype.iterate = function() {

	let num = this.getNumerator();
	let den = this.getDenominator();
  
	var nums = [

		// 1/(x-i)
		den.add( num.multiply( GaussianConsts.i() ) ),

		// 1/(i+x)
		den.subtract( num.multiply( GaussianConsts.i() ) ),

		// 1/(1+x)
		den.subtract( num ),

		// 1/(x-1)
		den.add( num )
	];

	// Get the norm of each numerator
	let norms = $.map( nums, function( n ) {
		return n.getNorm();
	} );

	// Figure out which operation resulted in the smallest norm (greater than zero)
	let minNorm = Math.min.apply( null, norms.filter( Boolean ) );
	let op = norms.indexOf( minNorm );

	// Create a new rational after inversion
	let frac = new GaussianRational( nums[ op ], num );

	// Normalize the new rational
	frac.normalize();

	// Return the operation number and the resulting value
	return { op : op, val: frac };
};

GaussianRational.prototype.getTailOps = function() {
	
	// Handle 1
	if ( this.isPositiveOne() ) {
		return { ops: [], val: GaussianConsts.one(), inverted: false };
	}

	// Handle -1
	if ( this.isNegativeOne() ) {
		return { ops: [ 2, 3, 2 ], val: GaussianConsts.one(), inverted: false };
	}

	// Handle i
	if ( this.isImaginaryOne() ) {
		return { ops: [], val: GaussianConsts.i(), inverted: false };
	}

	// Handle -i
	if ( this.isNegImaginaryOne() ) {
		return { ops: [], val: GaussianConsts.i(), inverted: true };
	}
};

GaussianRational.prototype.decompose = function() {

	// Reduce the fraction to lowest terms
	let frac = this.reduceToLowestTerms();

	// This will be our sequence of operations
	let ops = [];

	// Continue iterating until we're left with a unit
	while ( !frac.isUnit() ) {

		// Iterate the fraction
		let res = frac.iterate();

		// Add the operation code to our list
		ops.push( res.op );

		// Normalize the resulting fraction
		frac = res.val.normalize();
	}

	// Append the tail for this seed
	let tail = frac.getTailOps();
	ops = ops.concat( tail.ops );

	// Return our operations, the final seed and the inversion flag
	return { ops: ops, seed: tail.val, inverted: tail.inverted };
};

//===========================================//

function GaussianReducer( inputNum, inputDen ) {

	let num = this.parse( inputNum );
	let den = this.parse( inputDen );

	let frac = new GaussianRational( num, den );
	let reduced = frac.clone().reduceToLowestTerms();

	// Save the raw fraction
	this.rawFrac = frac;
	this.frac = reduced;

	this.wasReduced = !frac.equals( reduced );
}

GaussianReducer.prototype.getFraction = function() {
	return this.frac;
};

GaussianReducer.prototype.getMaxLenth = function() {
	return 50;
};

GaussianReducer.prototype.parse = function( str ) {

	// Match mixed case
	let found = str.match( /^\s*(\-?\d+)([\+\-])(\d*)i\s*$/ );

	if ( found ) {
		return this.buildInt( found[ 1 ], found[ 2 ], found[ 3 ] );
	}

	// Match pure real
	let found2 = str.match( /^\s*(\-?\d+)\s*$/ );

	if ( found2 ) {
		return this.buildInt( found2[ 1 ], "+", "0" );
	}

	// Match pure imaginary
	let found3 = str.match( /^\s*(\-?)(\d*)i\s*$/ );

	if ( found3 ) {
		return this.buildInt( "0", found3[ 1 ], found3[ 2 ] );
	}
	
	// We couldn't parse any of the formats
	throw "Invalid Gaussian Fraction: " + str;
	
};

GaussianReducer.prototype.buildInt = function( reStr, signStr, imStr ) {

	if ( reStr === "" ) {
		reStr = "1";
	}
	if ( signStr === "" ) {
		signStr = "+";
	}
	if ( imStr === "" ) {
		imStr = "1";
	}

	// Convert matched tokens to ints
	let re = parseInt( reStr );
	let sign = ( signStr === "-" ? -1 : 1 );
	let im = sign * parseInt( imStr );
	
	// Return components of IFraction
	return new GaussianInt( re, im );
};

GaussianReducer.prototype.getStr = function() {
	if ( this.wasReduced ) {
		return this.rawFrac.print() + "=" + this.frac.print();
	}
	else {
		return this.frac.print();
	}
};

GaussianReducer.prototype.getMathjax = function() {
	return "$$" + this.getStr() + "=" + this.getLatex() + "$$";
};

GaussianReducer.prototype.getLatex = function() {

	// This will hold our "cfrac" tokens
	let str1 = [], str2 = [];

	// Get the sequence of operations
	let decomp = this.frac.decompose();

	// Pull out the list of operations and the final seed
	let ops = decomp.ops;
	let seed = decomp.seed;
	let inverted = decomp.inverted;

	// If our expansion is longer than the max lenth, throw error
	if ( ops.length > this.getMaxLenth() ) {
		throw "Expansion too large";
	}

	// Build each token as we descend down the expansion
	$.each( ops, function( idx, val ) {

		switch ( val ) {
			// 1/(x-i)
			case 0:
				str1.push( "\\cfrac1{" );
				str2.unshift( "-i}" );
				break;
			// 1/(i+x)
			case 1:
				str1.push( "\\cfrac1{" );
				str2.unshift( "+i}" );
				break;
			// 1/(1+x)
			case 2:
				str1.push( "\\cfrac1{" );
				str2.unshift( "+1}" );
				break;
			// 1/(x-1)
			case 3:
				str1.push( "\\cfrac1{" );
				str2.unshift( "-1}" );
				break;
		}
	} );
	
	let seedStr = ( inverted ? "\\cfrac1{" + seed.print() + "}" : seed.print() );

	// Build final latex string
	return str1.join( "" ) + seedStr + str2.join( "" );
};

