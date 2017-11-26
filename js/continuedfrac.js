
var gcd = function( a, b ) { return (!b) ? a : gcd( b, a % b ); };

function Fraction( str ) {

	// Parse the string into numerator and denominator
	let parsed = this.parse( str );
	this.num = parsed[ 0 ];
	this.den = parsed[ 1 ];

	// Save raw input string
	this.raw = this.num + "/" + this.den;

	this.isNeg = this.num < 0;
	this.num = Math.abs( this.num );	

	// Calculate the GCD of numerator and denominator
	this.gcd = gcd( this.num, this.den );

	// Reduce numerator and denominator by gcd
	this.num /= this.gcd;
	this.den /= this.gcd;

	// Save reduced string
	this.str = ( this.isNeg ? "-" : "" ) + this.num + "/" + this.den;
}

// Largest supported expansion length
Fraction.prototype.getMaxLenth = function() {
	return 50;
};

Fraction.prototype.getStr = function() {
	return ( this.gcd > 1 ? this.raw + "=" + this.str : this.str );
}

Fraction.prototype.parse = function( str ) {

	// Look for digits, a slash and more digits
	var found = str.match( /^\s*(\-?\d+)\/(\d+)\s*$/ );
	
	// If the input string cannot be parsed, throw error
	if ( found === null ) {
		throw "Invalid fraction: " + str;
	}
	
	// Convert matched tokens to ints
	let num = parseInt( found[ 1 ] );
	let den = parseInt( found[ 2 ] );
	
	// Return components of fraction
	return [ num, den ];
}

Fraction.prototype.getSigns = function() {

	let num = this.num;
	let den = this.den;

	let signs = [];
	
	// Negative fractions start with -, -, +
	if ( this.isNeg ) {
		signs.push( -1, -1, 1 );
	}

	while ( num > 1 || den > 1 ) {
		let sign = ( num > den ? -1 : 1 );
		let temp = num;
		num = sign * ( den - num );
		den = temp;
		signs.push( sign );
	}

	return signs;
}

Fraction.prototype.getLatex = function() {

	// This will hold our "cfrac" tokens
	let str1 = [];
	
	// This will hold our trailing brackets
	let str2 = [];

	// Get the sequence of signs in the continued fraction representation
	let signs = this.getSigns();
	
	// If our expansion is longer than the max lenth, throw error
	if ( signs.length > this.getMaxLenth() ) {
		throw "Expansion too large";
	}

	// Build each token as we descend down the expansion
	$.each( signs, function( idx, val ) {
		let addend = ( val === 1 ? "1+" : "1-" );
		str1.push( "\\cfrac1{", addend );
		str2.push( "}" );
	} );
	
	return str1.join( "" ) + "\\cfrac1{1}" + str2.join( "" );
}

Fraction.prototype.getMathjax = function() {
	return "$$" + this.getStr() + "=" + this.getLatex() + "$$";
}
