class Expander {

	constructor() {}

	getExpansion( frac ) {
		return this.buildExpansion( frac, false );
	}

	buildTail( frac ) {
		
		let termNode = new TerminalNode( frac.negate() );
		let expNode1 = new ExpansionNode( termNode, TerminalNode.positiveOne() );
		let expNode2 = new ExpansionNode( expNode1, TerminalNode.negativeOne() );

		return new ExpansionNode( expNode2, TerminalNode.positiveOne() );
	}

	buildExpansion( frac, allowNegative = true ) {

		// If we have +1, we are done expanding
		if ( frac.isPositiveOne() ) {
			return TerminalNode.positiveOne();
		}

		// If we have +i, we are done expanding
		if ( frac.isPositiveI() ) {
			return TerminalNode.positiveI();
		}

		// If we have -1 and we allow negatives, we are done expanding
		if ( frac.isNegativeOne() && allowNegative ) {
			return TerminalNode.negativeOne();
		}

		// If we have -i and we allow negatives, we are done expanding
		if ( frac.isNegativeI() && allowNegative ) {
			return TerminalNode.negativeI();
		}

		// Just need to flip the sign and we're done
		if ( frac.isNegativeOne() || frac.isNegativeI() ) {
			return this.buildTail( frac );
		}

		// Expand the current fraction into two or more children
		let children = this.expand( frac.invert() );

		// Expand the first node but don't allow negatives
		let firstNode = this.buildExpansion( children.shift(), false );

		// Expand the rest of the nodes
		let childNodes = children.map( child => this.buildExpansion( child ) );

		// Add the first node back to our list of children
		childNodes.unshift( firstNode );

		// We're done and can build our expansion node
		return new ExpansionNode( childNodes );
	}
}

class UnitExpander extends Expander {

	expand( frac ) {

		// These are the four possible units we will add to our fraction
		const units = [
			GaussianRationalConsts.positiveI(),
			GaussianRationalConsts.negativeI(),
			GaussianRationalConsts.positiveOne(),
			GaussianRationalConsts.negativeOne()
		];

		// Calculate the four resulting fractions
		const vals = units.map( x => frac.subtract( x ) );

		// Calculate the norm of each fraction
		const norms = vals.map( x => x.getNorm() );

		// Figure out which operation resulted in the smallest norm (greater than zero)
		const minNorm = Math.min.apply( null, norms.filter( norm => norm > 1 ) );
		const op = norms.indexOf( minNorm );

		return [ vals[ op ], units[ op ] ];
	}
}

class OptimalExpander extends Expander {

	expand( input ) {

		// Get the components of the numerator
		let num = input.getNumerator();
		let numRe = num.getRealPart();
		let numIm = num.getImaginaryPart();

		// Get the components of the denominator
		let den = input.getDenominator();
		let denRe = den.getRealPart();
		let denIm = den.getImaginaryPart();

		// Figure out which is the largetst denominator component
		let larger = [ Math.abs( denRe ), Math.abs( denIm ) ].sort().pop();

		// This will hold our candidates
		let res = [];

		// Iterate through possible real parts
		for ( let re = numRe - larger; re <= numRe + larger; re++ ) {

			// Iterate through possible imaginary parts
			for ( let im = numIm - larger; im <= numIm + larger; im++ ) {

				// Build the first numerator
				let num1 = new GaussianInt( re, im );

				// Build the second numerator
				let num2 = num.subtract( num1 );

				// Skip if either numerator is equal to our staring numerator
				if ( num1.equals( num ) || num2.equals( num ) ) {
					continue;
				}

				// Build Gaussian Rationals for our two new fractions
				let frac1 = new GaussianRational( num1, den, true, true );
				let frac2 = new GaussianRational( num2, den, true, true );

				// Sort our fractions by norm, descending
				let fracs = [ frac1, frac2 ].sort( ( a, b ) => a.getNorm() - b.getNorm() ).reverse();

				// Add this pair of fractions to our set of candidates
				res.push( { fracs: fracs, norm: frac1.getNorm() + frac2.getNorm() } );
			}
		}

		// Find the pair of fractions with minimal norm
		let minimal = res.sort( (a,b) => a.norm - b.norm ).shift();

		return minimal.fracs;
	}
}