class GaussianParser {

	static parse( str ) {

		const check = function( str ) {
			return str || undefined;
		};

		// Match mixed case
		const found = str.match( /^\s*(\-?\d+)([\+\-])(\d*)i\s*$/ );

		if ( found ) {
			return GaussianParser.buildInt( found[ 1 ], found[ 2 ], check( found[ 3 ] ) );
		}

		// Match pure real
		const found2 = str.match( /^\s*(\-?\d+)\s*$/ );

		if ( found2 ) {
			return GaussianParser.buildInt( found2[ 1 ], "+", "0" );
		}

		// Match pure imaginary
		const found3 = str.match( /^\s*(\-?)(\d*)i\s*$/ );

		if ( found3 ) {
			return GaussianParser.buildInt( "0", check( found3[ 1 ] ), check( found3[ 2 ] ) );
		}
		
		// We couldn't parse any of the formats
		throw "Unable to Parse Gaussian Integer: " + str;
	}

	static buildInt( reStr = "0", signStr = "+", imStr = "1" ) {

		// Parse real part as integer
		const re = parseInt( reStr, 10 );

		// Check sign on imaginary part
		const sign = ( signStr === "-" ? -1 : 1 );

		// Parse imaginary part as integer
		const im = sign * parseInt( imStr, 10 );
		
		// Return new Gaussian int with these parts
		return new GaussianInt( re, im );
	}
}
