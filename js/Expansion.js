class Expansion {

	constructor( rawFrac, expander ) {

		// Hang onto our raw input
		this.rawFrac = rawFrac;

		// Reduce input fraction to lowest terms
		this.frac = rawFrac.reduceToLowestTerms();

		// Perform the expansion
		this.expansion = expander.getExpansion( this.frac );
	}

	// Get the fraction being expanded (in lowest terms)
	getFraction() {
		return this.frac;
	}

	// Get the raw fraction being expanded (which may not be in lowest terms)
	getRawFraction() {
		return this.rawFrac;
	}

	// Returns true if the input fraction was not in lowest terms and was therefore reduced
	wasReduced() {
		return !this.getFraction().equals( this.getRawFraction() );
	}

	// Gets the expansion produced by the expander
	getExpansion() {
		return this.expansion;
	}

	// Builds our complete mathjax string
	printLatex() {

		// This will hold our output tokens, joined by "="
		let tokens = [];

		// Add the raw input fraction
		tokens.push( this.getRawFraction().printLatex() );

		// Add the reduced fraction (if necessary)
		if ( this.wasReduced() ) {
			tokens.push( this.getFraction().printLatex() );
		}

		// Add the expansion
		tokens.push( this.getExpansion().printLatex() );

		// Join our tokens with equal sign
		return tokens.join( "=" );
	}
}
