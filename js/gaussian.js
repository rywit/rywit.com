function GuassianInt( re, im ) {
	this.re = re;
	this.im = im;
}

GaussianInt.prototype.getRealPart = function() {
	return this.re;
};

GaussianInt.prototype.getImaginaryPart = function() {
	return this.im;
};

// Returns a cloned GaussianInt
GuassianInt.prototype.clone = function() {
	return new GuassianInt( this.re, this.im );
};

// Returns the norm: a^2 + b^2
GuassianInt.prototype.getNorm = function() {
	return this.getRealPart() * this.getRealPart() + this.getImaginaryPart() * this.getImaginaryPart();
};

// Returns true if value is +/- 1 or +/- i
GuassianInt.prototype.isUnit = function() {
	return this.getNorm() === 1;
};

GaussianInt.prototype.isZero = function() {
  return this.getNorm() === 0;
};

GaussianInt.prototype.divide = function( divisor ) {

	// Calculate the real part after division by the GCD
	let re = ( this.getRealPart() * divisor.getRealPart() + this.getImaginaryPart() * divisor.getImaginaryPart() ) / divisor.getNorm();

	// Calculate the imaginary part after division by the GCD
	let im = ( this.getImaginaryPart() * divisor.getRealPart() - this.getRealPart() * divisor.getImaginaryPart() ) / divisor.getNorm();

	// Construct the reduced value
	return new GaussianInt( re, im );
};

GaussianInt.prototype.getRemainder = function( divisor ) {

	let rat = new GaussianRational( this, divisor );
	let near = rat.getNearestGaussianInt();

	let num = rat.getNumerator();
	let den = rat.getDenominator();

	let r1 = num.getRealPart() - ( den.getRealPart() * near.getRealPart() - den.getImaginaryPart() * near.getImaginaryPart() );
	let r2 = num.getImaginaryPart() - ( den.getRealPart() * near.getImaginaryPart() - den.getImaginaryPart() * near.getRealPart() );

	return new GaussianInt( r1, r2 );
};





function GaussianRational( num, den ) {
	this.num = num;
	this.den = den;
}

GaussianRational.prototype.getNumerator = function() {
	return this.num;
};

GaussianRational.prototype.getDenominator = function() {
	return this.den;
};

GaussianRational.prototype.clone = function() {
	return new GaussianRational( this.getNumerator().clone(), this.getDenominator().clone() );
};

GaussianRational.prototype.getNearestGaussianInt = function() {

	let num = this.getNumerator();
	let den = this.getDenominator();
  
	// Compute the real part of the quotient
	let newRe = ( num.getRealPart() * den.getRealPart() + num.getImaginaryPart() * den.getImaginaryPart() ) / den.getNorm();
  
	// Compute the imaginary part of the quotient
	let newIm = ( num.getImaginaryPart() * den.getRealPart() - num.getRealPart() * den.getImaginaryPart() ) / get.getNorm();
  
	// Round the real part to nearest integer
	let roundRe = Math.round( newRe );

	// Round the imaginary part to nearest integer
	let roundIm = Math.round( newIm );
  
	// Return the rounded value
	return new GaussianInt( roundRe, roundIm );
};

GaussianRational.prototype.getNormalized = function() {

	let num = this.getNumerator();
	let den = this.getDenominator();

	let numRe = num.getRealPart();
	let numIm = num.getImaginaryPart();
	let denRe = den.getRealPart();
	let denIm = den.getImaginaryPart();

	// If the denominator is pure imaginary, turn into pure real
	if ( den.Re === 0 ) {
		denRe = denIm;
		denIm = 0;

		let tempRe = numRe;
		numRe = numIm;
		numRm = -tempRe;
	}
  
	// If the denominator is real and negative, flip signs
	if ( denRe < 0 ) {
		numRe = -numRe;
		numIm = -numIm;
		denRe = -denRe;
		denIm = -denIm;
	}

	// If the numerator and denominator are the same, replace with 1
	if ( numRe === denRe && numIm === denIm ) {
		numRe = 1;
		numIm = 0;
		denRe = 1;
		denIm = 0;
	}
    
	let newNum = new GaussianInt( numRe, numIm );
	let newDen = new GaussianInt( denRe, denIm );

	return new GaussianRational( newNum, newDen );
};

GaussianRational.prototype.getGCD = function() {

	// Get norm of numerator and denominator
	let normNum = this.getNumerator().getNorm();
	let normDen = this.getDenominator().getNorm();

	// Make sure our 
	let val1 = ( normDen > normNum ? den : num );
	let val2 = ( normDen > normNum ? num : den );

	let remainder = val1.getRemainder( val2 );
	let gcd;
  
	do {
		gcd = remainder.clone();
		val1 = val2.clone();
		val2 = remainder.clone();
		remainder = val1.remainder( val2 );
	}
	while ( !remainder.isZero() );

	return gcd;
};

GaussianRational.prototype.getLowestTerms = function() {

	// Calculate the GCD of the two guassian ints
	let gcd = this.getGCD();

	// Divide the numerator by the GCD
	let num = this.getNumerator().divide( gcd );

	// Divide the denominator by the GCD
	let den = this.getDenominator().divide( gcd );

	// Create new gaussian rational from numerator and denominator
	let frac = new GaussianRational( num, den );

	// Normalize the fraction and return it
	return frac.getNormalized();
};

GaussianRational.prototype.invert = function() {

	let num = this.getNumerator();
	let den = this.getDenominator();
  
	// 1/(x-i)
	let num1 = new GaussianInt( den.getRealPart() - num.getImaginaryPart(), num.getRealPart() + den.getImaginaryPart() );

	// 1/(i+x)
	let num2 = new GaussianInt( num.getImaginaryPart() + den.getRealPart(), den.getImaginaryPart() - num.getRealPart() );

	// 1/(1+x)
	let num3 = new GaussianInt( den.getRealPart() - num.getRealPart(), den.getImaginaryPart() - num.getImaginaryPart() );

	// 1/(1-x)
	let num4 = new GaussianInt( num.getRealPart() - den.getRealPart(), num.getImaginaryPart() - den.getImaginaryPart() );

	// 1/(x-1)
	let num5 = new GaussianInt( num.getRealPart() + den.getRealPart(), num.getImaginaryPart() + den.getImaginaryPart() );

	// 1/(i-x)
	let num6 = new GaussianInt( -num.getImaginaryPart() - den.getRealPart(), num.getRealPart() - den.getImaginaryPart() );


	let cases = [ num1, num2, num3, num4, num5, num6 ];
	let norms = [ num1.getNorm(), num2.getNorm(), num3.getNorm(), num4.getNorm(), num5.getNorm(), num6.getNorm() ];

	let idx = arr.indexOf( Math.min( norms ) );

	let op = 

	let smallest = Math.min(  );

	// Return the operation number and the resulting value
	list( op = smallest, val = list( num = cases[ smallest ], den = num ) )


};

GaussianRational.prototype.decompose = function() {

	// Reduce the fraction to lowest terms
	let frac = this.getLowestTerms();

	let ops = [];

	while ( !frac.isUnit() ) {
		let reduced = this.invert();
		ops.push( reduced.op );
		frac = reduced.val.getNormalized();
	}

	return { ops: ops, seed: frac };
};






var gcd = function( a, b ) { return (!b) ? a : gcd( b, a % b ); };

function IFraction( str ) {

	// Parse the string into numerator and denominator
	let parsed = this.parse( str );
	this.num = parsed[ 0 ];
	this.den = parsed[ 1 ];

	// Save raw input string
	this.raw = ( this.num === 1 ? "" : this.num ) + "i" + ( this.den === 1 ? "" : "/" + this.den );

	this.isNeg = this.num < 0;
	this.num = Math.abs( this.num );	

	// Calculate the GCD of numerator and denominator
	this.gcd = gcd( this.num, this.den );

	// Reduce numerator and denominator by gcd
	this.num /= this.gcd;
	this.den /= this.gcd;

	// Save reduced string
	this.str = ( this.isNeg ? "-" : "" ) + ( this.num === 1 ? "" : this.num ) + "i" + ( this.den === 1 ? "" : "/" + this.den );
}

// Largest supported expansion length
IFraction.prototype.getMaxLenth = function() {
	return 50;
};

IFraction.prototype.getStr = function() {
	return ( this.gcd > 1 ? this.raw + "=" + this.str : this.str );
}

IFraction.prototype.parse = function( str ) {

	// Look for digits, a slash and more digits
	var found = str.match( /^\s*(\d+)i\/(\d+)\s*$/ );
	
	// If the input string cannot be parsed, throw error
	if ( found === null ) {
		throw "Invalid IFraction: " + str;
	}
	
	// Convert matched tokens to ints
	let num = parseInt( found[ 1 ] );
	let den = parseInt( found[ 2 ] );
	
	// Return components of IFraction
	return [ num, den ];
}

IFraction.prototype.getSigns = function() {

	let num = this.num;
	let den = this.den;

	let signs = [];

	while ( true ) {

		let val = num / den;

		// Terminal case: 1/1
		if ( num === 1 && den === 1 ) {
			signs.push( 1, 1 );
			break;
		}
		// Terminal case: 2/1
		else if ( num === 2 && den === 1 ) {
			signs.push( -1, -1 );
			break;
		}
		// Terminal case: 1/2
		else if ( num === 1 && den === 2 ) {
			signs.push( -1 );
			break;
		}
		// Non-terminal case: 0 < a/b < 1/2
		else if ( val > 0 && val < 0.5 ) {
			signs.push( -1, 1, 1 );
			den -= 2 * num;
		}
		// Non-terminal case: 1/2 < a/b < 1
		else if ( val > 0.5 && val < 1.0 ) {
			signs.push( -1, -1 );
			let temp = num;
			num = den;
			den -= temp;
		}
		// Non-terminal case: 1 < a/b < 2
		else if ( val > 1.0 && val < 2.0 ) {
			signs.push( -1 );
			let temp = num;
			num -= den;
			den = temp;
		}
		// Non-terminal case: 2 < a/b
		else if ( val > 2.0 ) {
			signs.push( -1, -1, 1 );
			num -= 2 * den;
		}
	}

	return signs;
}

IFraction.prototype.getLatex = function() {

	// This will hold our "cfrac" tokens
	let str1 = [];
	
	// This will hold our trailing brackets
	let str2 = [];

	// Get the sequence of signs in the continued IFraction representation
	let signs = this.getSigns();
	
	// If our expansion is longer than the max lenth, throw error
	if ( signs.length > this.getMaxLenth() ) {
		throw "Expansion too large";
	}

	// Build each token as we descend down the expansion
	$.each( signs, function( idx, val ) {
		let addend = ( val === 1 ? "+i" : "-i" );
		str1.push( "\\cfrac1{" );
		str2.push( addend, "}" );
	} );
	
	// If the last two signs are 1, then our terminal value is i+i, otherwise simply i
	let last = signs.slice( -2 );
	let base = ( last[ 0 ] === 1 && last[ 1 ] === 1 ? "\\cfrac1{i+i}" : "\\cfrac1{i}" );

	// Build final latex string
	return str1.join( "" ) + base + str2.join( "" );
}

IFraction.prototype.getMathjax = function() {
	return "$$" + this.getStr() + "=" + this.getLatex() + "$$";
}
