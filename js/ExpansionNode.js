class ExpansionNode {
	
	constructor( ...children ) {
		this.children = [].concat( ...children );
	}

	getChildren() {
		return this.children;
	}

	printLatex() {

		let children = this.getChildren();

		// Recusively print the expansion of the two smaller pieces
		let expansion = children.map( node => node.printLatex() );

		let latex = "\\cfrac1{" + expansion.join( "+" ) + "}";

		return latex.replace( /\+\-/g, "-" );
	}
}

class TerminalNode {

	constructor( frac ) {
		this.frac = frac;
	}

	getFraction() {
		return this.frac;
	}

	printLatex() {
		return this.getFraction().printLatex();
	}

	static positiveOne() {
		return new this( GaussianRationalConsts.positiveOne() );
	}

	static negativeOne() {
		return new this( GaussianRationalConsts.negativeOne() );
	}

	static positiveI() {
		return new this( GaussianRationalConsts.positiveI() );
	}

	static negativeI() {
		return new this( GaussianRationalConsts.negativeI() );
	}
}
