class ExpansionApp {
	
	constructor( numeratorElem, denominatorElem, outputElem, errorElem ) {
		this.numeratorElem = numeratorElem;
		this.denominatorElem = denominatorElem;
		this.outputElem = outputElem;
		this.errorElem = errorElem;
	}

	getNumeratorElem() {
		return this.numeratorElem;
	}

	getDenominatorElem() {
		return this.denominatorElem;
	}

	getOutputElem() {
		return this.outputElem;
	}

	getErrorElem() {
		return this.errorElem;
	}

	resetOutput() {

		// Hide any visible error messages
		this.getNumeratorElem().removeClass( "is-invalid" );
		this.getDenominatorElem().removeClass( "is-invalid" );
			
		// Hide the output elem
		this.getOutputElem().hide();
		this.getErrorElem().hide();
	}

	showOutput( latex ) {

		// Grab the output DOM element
		let output = this.getOutputElem();

		// Update output DOM element
		output.html( "$$" + latex + "$$" );

		// Render Mathjax and show it
		MathJax.Hub.Queue( [ "Typeset", MathJax.Hub, output.attr( "id" ) ] );
		MathJax.Hub.Queue( function() { output.show() } );
	}

	showError( msg ) {

		this.getNumeratorElem().addClass( "is-invalid" );
		this.getDenominatorElem().addClass( "is-invalid" );
		this.getErrorElem().html( msg ).show();
		this.getOutputElem().html( "" );
	}

	parseInput( numStr, denStr ) {

		// Parse numerator
		let num = GaussianParser.parse( numStr );

		// Parse denominator
		let den = GaussianParser.parse( denStr );

		// Construct new GaussianRational from numerator and denominator
		return new GaussianRational( num, den );
	}

	expand( expander ) {

		// Reset the output fields while we recompute
		this.resetOutput();

		// Grab the user input numerator and denominator
		let numStr = this.getNumeratorElem().val();
		let denStr = this.getDenominatorElem().val();

		try {

			// Parse the input into a Gaussian rational
			let frac = this.parseInput( numStr, denStr );

			// Expand the rational
			let expansion = new Expansion( frac, expander );

			// Print latex to output
			this.showOutput( expansion.printLatex() );
		}
		catch( e ) {
			// Print the error message to the user
			this.showError( e );
		}
	}

	expandUnit() {
		this.expand( new UnitExpander() );
	}

	expandOptimal() {
		this.expand( new OptimalExpander() );
	}
}
