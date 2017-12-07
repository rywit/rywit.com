class GaussianReducer {

	constructor( inputNum, inputDen ) {

		const num = GaussianReducer.parse( inputNum );
		const den = GaussianReducer.parse( inputDen );

		this.rawFrac = new GaussianRational( num, den );
		this.frac = this.rawFrac.reduceToLowestTerms();
	}

	getFraction() {
		return this.frac;
	}

	getRawFraction() {
		return this.rawFrac;
	}

	wasReduced() {
		return !this.getFraction().equals( this.getRawFraction() );
	}

	static getMaxLenth() {
		return 50;
	}

	static parse( str ) {

		const check = function( str ) {
			return str || undefined;
		};

		// Match mixed case
		const found = str.match( /^\s*(\-?\d+)([\+\-])(\d*)i\s*$/ );

		if ( found ) {
			return GaussianReducer.buildInt( found[ 1 ], found[ 2 ], check( found[ 3 ] ) );
		}

		// Match pure real
		const found2 = str.match( /^\s*(\-?\d+)\s*$/ );

		if ( found2 ) {
			return GaussianReducer.buildInt( found2[ 1 ], "+", "0" );
		}

		// Match pure imaginary
		const found3 = str.match( /^\s*(\-?)(\d*)i\s*$/ );

		if ( found3 ) {
			return GaussianReducer.buildInt( "0", check( found3[ 1 ] ), check( found3[ 2 ] ) );
		}
		
		// We couldn't parse any of the formats
		throw "Invalid Gaussian Fraction: " + str;
	}

	static buildInt( reStr = "0", signStr = "+", imStr = "1" ) {

		// Parse real part as integer
		const re = parseInt( reStr );

		// Check sign on imaginary part
		const sign = ( signStr === "-" ? -1 : 1 );

		// Parse imaginary part as integer
		const im = sign * parseInt( imStr );
		
		// Return new Gaussian int with these parts
		return new GaussianInt( re, im );
	}

	getStr() {

		// If raw fraction was reduced, print both raw and reduced
		if ( this.wasReduced() ) {
			return this.getRawFraction().print() + "=" + this.getFraction().print();
		}

		// Return just the (unreduced) input fraction
		return this.getFraction().print();
	}

	// Builds our complete mathjax string
	getMathjax() {
		return "$$" + this.getStr() + "=" + this.getLatex() + "$$";
	}

	static getAddend( op ) {
		switch ( op ) {
			// 1/(x-i)
			case 0:
				return "-i}";
			// 1/(i+x)
			case 1:
				return "+i}";
			// 1/(1+x)
			case 2:
				return "+1}";
			// 1/(x-1)
			case 3:
				return "-1}";
		}
	}

	getLatex() {

		// Get the sequence of operations
		const decomp = this.getFraction().decompose();

		// If our expansion is longer than the max lenth, throw error
		if ( decomp.ops.length > GaussianReducer.getMaxLenth() ) {
			throw "Expansion too large";
		}

		// Build each token as we descend down the expansion
		const str1 = decomp.ops.map( x => "\\cfrac1{" );
		const str2 = decomp.ops.map( GaussianReducer.getAddend ).reverse();

		// Build the string represntation of our initial seed (1, i, 1/i)		
		const seedStr = ( decomp.inverted ? "\\cfrac1{" + decomp.seed.print() + "}" : decomp.seed.print() );

		// Build final latex string
		return str1.join( "" ) + seedStr + str2.join( "" );
	}
}
