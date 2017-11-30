function GaussianInt( re, im ) {
	this.re = re;
	this.im = im;
}

GaussianInt.prototype.getRealPart = function() {
	return this.re;
};

GaussianInt.prototype.getImaginaryPart = function() {
	return this.im;
};

GaussianInt.prototype.negate = function() {
	this.re = -this.re;
	this.im = -this.im;
};

// Returns a cloned GaussianInt
GaussianInt.prototype.clone = function() {
	return new GaussianInt( this.re, this.im );
};

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

GaussianInt.prototype.isZero = function() {
  return this.getNorm() === 0;
};

GaussianInt.prototype.print = function() {
	if ( this.getImaginaryPart() === 0 ) {
		return this.getRealPart();
	}

	if ( this.getRealPart() === 0 ) {
		return this.getImaginaryPart() + "i";
	}

	return this.getRealPart() + ( this.getImaginaryPart() < 0 ? "-" : "+" ) + Math.abs( this.getImaginaryPart() ) + "i";
};

GaussianInt.prototype.divide = function( divisor ) {

	// Calculate the real part after division by the GCD
	let re = ( this.getRealPart() * divisor.getRealPart() + this.getImaginaryPart() * divisor.getImaginaryPart() ) / divisor.getNorm();

	// Calculate the imaginary part after division by the GCD
	let im = ( this.getImaginaryPart() * divisor.getRealPart() - this.getRealPart() * divisor.getImaginaryPart() ) / divisor.getNorm();

	// Construct the reduced value
	return new GaussianInt( re, im );
};

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

GaussianRational.prototype.isUnit = function() {
	return this.getNumerator().isUnit() && this.getDenominator().isUnit();
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
};

GaussianRational.prototype.print = function() {
	return "\\cfrac{" + this.getNumerator().print() + "}{" + this.getDenominator().print() + "}";
};

GaussianRational.prototype.getNearestGaussianInt = function() {

	let num = this.getNumerator();
	let den = this.getDenominator();
  
	// Compute the real part of the quotient
	let newRe = ( num.getRealPart() * den.getRealPart() + num.getImaginaryPart() * den.getImaginaryPart() ) / den.getNorm();
  
	// Compute the imaginary part of the quotient
	let newIm = ( num.getImaginaryPart() * den.getRealPart() - num.getRealPart() * den.getImaginaryPart() ) / den.getNorm();
  
	// Round the real part to nearest integer
	let roundRe = Math.round( newRe );

	// Round the imaginary part to nearest integer
	let roundIm = Math.round( newIm );
  
	// Return the rounded value
	return new GaussianInt( roundRe, roundIm );
};

GaussianRational.prototype.getRemainder = function() {

	// Divide numerator by denominator and get nearest integer
	let near = this.getNearestGaussianInt();

	let num = this.getNumerator();
	let den = this.getDenominator();

	let r1 = num.getRealPart() - ( den.getRealPart() * near.getRealPart() - den.getImaginaryPart() * near.getImaginaryPart() );
	let r2 = num.getImaginaryPart() - ( den.getRealPart() * near.getImaginaryPart() + den.getImaginaryPart() * near.getRealPart() );

	return new GaussianInt( r1, r2 );
};

GaussianRational.prototype.normalize = function() {

	// If the denominator is pure imaginary, turn into pure real
	if ( this.getDenominator().getRealPart() === 0 ) {
		this.num = new GaussianInt( this.getNumerator().getImaginaryPart(), -this.getNumerator().getRealPart() );
		this.den = new GaussianInt( this.getDenominator().getImaginaryPart(), 0 );
	}
  
	// If the denominator is real and negative, flip signs
	if ( this.getDenominator().getRealPart() < 0 ) {
		this.negate();
	}

	// If the numerator and denominator are the same, replace with 1
	if ( this.getNumerator().equals( this.getDenominator() ) ) {
		this.num = new GaussianInt( 1, 0 );
		this.den = new GaussianInt( 1, 0 );
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

	// To start, we'll assume the denominator is the GCD
	let gcd = frac.getDenominator();
	let i = 0;
  
	do {
		gcd = remainder;
		frac = new GaussianRational( frac.getDenominator(), remainder )
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
		new GaussianInt( den.getRealPart() - num.getImaginaryPart(), num.getRealPart() + den.getImaginaryPart() ),

		// 1/(i+x)
		new GaussianInt( num.getImaginaryPart() + den.getRealPart(), den.getImaginaryPart() - num.getRealPart() ),

		// 1/(1+x)
		new GaussianInt( den.getRealPart() - num.getRealPart(), den.getImaginaryPart() - num.getImaginaryPart() ),

		// 1/(1-x)
		new GaussianInt( num.getRealPart() - den.getRealPart(), num.getImaginaryPart() - den.getImaginaryPart() ),

		// 1/(x-1)
		new GaussianInt( num.getRealPart() + den.getRealPart(), num.getImaginaryPart() + den.getImaginaryPart() ),

		// 1/(i-x)
		new GaussianInt( -num.getImaginaryPart() - den.getRealPart(), num.getRealPart() - den.getImaginaryPart() )
	];

	// Get the norm of each numerator
	let norms = $.map( nums, function( n ) {
		return n.getNorm();
	} );

	// Figure out which operation resulted in the smallest norm
	let minNorm = Math.min.apply( null, norms );
	let op = norms.indexOf( minNorm );

	// Create a new rational after inversion
	let frac = new GaussianRational( nums[ op ], num );

	// Normalize the new rational
	frac.normalize();

	// Return the operation number and the resulting value
	return { op : op, val: frac };
};

GaussianRational.prototype.decompose = function() {

	// Reduce the fraction to lowest terms
	let frac = this.reduceToLowestTerms();

	let ops = [];

	while ( !frac.isUnit() ) {
		let res = frac.iterate();
		ops.push( res.op );
		frac = res.val.normalize();
	}

	return { ops: ops, seed: frac };
};

//===========================================//

function GaussianReducer( inputNum, inputDen ) {

	let num = this.parse( inputNum );
	let den = this.parse( inputDen );

	let frac = new GaussianRational( num, den );
	let reduced = frac.reduceToLowestTerms();

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

	// Look for digits, a slash and more digits
	var found = str.match( /^\s*(\-?\d+)([\+\-])(\d+)i\s*$/ );
	
	// If the input string cannot be parsed, throw error
	if ( found === null ) {
		throw "Invalid IFraction: " + str;
	}
	
	// Convert matched tokens to ints
	let re = parseInt( found[ 1 ] );
	let sign = ( found[ 2 ] === "-" ? -1 : 1 );
	let im = sign * parseInt( found[ 3 ] );
	
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
			// 1/(1-x)
			case 3:
				str1.push( "\\cfrac1{1-" );
				str2.unshift( "}" );
				break;
			// 1/(x-1)
			case 4:
				str1.push( "\\cfrac1{" );
				str2.unshift( "-1}" );
				break;
			// 1/(i-x)
			case 5:
				str1.push( "\\cfrac1{i-" );
				str2.unshift( "}" );
				break;
		}
	} );
	
	// Build final latex string
	return str1.join( "" ) + seed.print() + str2.join( "" );
};

