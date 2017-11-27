
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
