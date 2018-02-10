class GaussianRational {

	constructor( num, den, shouldNormalize = false, shouldReduce = false ) {
		this.num = num;
		this.den = den;

		if ( shouldReduce ) {
			let res = this.reduceToLowestTerms( shouldNormalize );
			this.num = res.getNumerator();
			this.den = res.getDenominator();
		}

		if ( shouldNormalize ) {
			let res = this.normalize();
			this.num = res.getNumerator();
			this.den = res.getDenominator();
		}
	}

	// Getter for numerator GaussianInt
	getNumerator() {
		return this.num;
	}

	// Getter for denominator GaussianInt
	getDenominator() {
		return this.den;
	}

	// Returns a clone of the current object
	clone() {
		return new GaussianRational( this.getNumerator().clone(), this.getDenominator().clone() );
	}

	getNorm() {
		return this.getNumerator().getNorm() + this.getDenominator().getNorm();
	}

	// Returns true if numerator and denominator are both norm 1
	isUnit() {
		return this.getNumerator().isUnit() && this.getDenominator().isUnit();
	}

	// Returns true if fraction is -1/1
	isNegativeOne() {
		return this.isUnit() && this.getNumerator().getRealPart() === -1 && this.getDenominator().getRealPart() === 1;
	}

	// Returns true if fraction is 1/1
	isPositiveOne() {
		return this.isUnit() && this.getNumerator().getRealPart() === 1 && this.getDenominator().getRealPart() === 1;
	}

	// Returns true if fraction is i/1
	isPositiveI() {
		return this.isUnit() && this.getNumerator().getImaginaryPart() === 1 && this.getDenominator().getRealPart() === 1;
	}

	// Returns true if fraction is -i/1
	isNegativeI() {
		return this.isUnit() && this.getNumerator().getImaginaryPart() === -1 && this.getDenominator().getRealPart() === 1;
	}

	// Is the fraction equal to the input fraction
	equals( frac ) {
		return this.getNumerator().equals( frac.getNumerator() ) && this.getDenominator().equals( frac.getDenominator() );
	}

	// Negates the numerator
	negate() {
		return new GaussianRational( this.getNumerator().negate(), this.getDenominator(), true );
	}

	// Flips numerator and denominator
	invert() {
		return new GaussianRational( this.getDenominator(), this.getNumerator(), true );
	}

	// Outputs latex code for printing fraction
	printLatex() {

		if ( this.isPositiveOne() ) {
			return "1";
		}
		else if ( this.isNegativeOne() ) {
			return "-1";
		}
		else if ( this.isPositiveI() ) {
			return "i";
		}
		else if ( this.isNegativeI() ) {
			return "-i";
		}

		return "\\cfrac{" + this.getNumerator().print() + "}{" + this.getDenominator().print() + "}";
	}

	add( frac, shouldNormalize = true, shouldReduce = true ) {
		let numA = this.getNumerator().multiply( frac.getDenominator() );
		let numB = frac.getNumerator().multiply( this.getDenominator() );

		let num = numA.add( numB );
		let den = this.getDenominator().multiply( frac.getDenominator() );

		return new GaussianRational( num, den, shouldNormalize, shouldReduce );
	}

	subtract( frac, shouldNormalize = true, shouldReduce = true ) {
		// Subtraction is the same as adding a negative
		return this.add( frac.negate(), shouldNormalize, shouldReduce );
	}

	normalize() {

		let normalized = this.clone();

		// If the denominator is pure imaginary, turn into pure real by multiplying by -i/-i
		if ( normalized.getDenominator().getRealPart() === 0 ) {
			const num = normalized.getNumerator().multiply( GaussianConsts.negativeI() );
			const den = normalized.getDenominator().multiply( GaussianConsts.negativeI() );

			normalized = new GaussianRational( num, den );
		}
	  
		// If the denominator is real and negative, flip signs
		if ( normalized.getDenominator().getRealPart() < 0 ) {
			let num = normalized.getNumerator().negate();
			let den = normalized.getDenominator().negate();

			normalized = new GaussianRational( num, den );
		}

		// If the numerator and denominator are the same, replace with 1
		if ( normalized.getNumerator().equals( normalized.getDenominator() ) ) {
			normalized = new GaussianRational( GaussianConsts.positiveOne(), GaussianConsts.positiveOne() );
		}

		return normalized;
	}

	reduceToLowestTerms( shouldNormalize = true ) {

		// Calculate the GCD of the two guassian ints
		const gcd = GaussianInt.getGCD( this.getNumerator(), this.getDenominator() );

		// Divide the numerator by the GCD
		const num = this.getNumerator().divide( gcd ); 

		// Divide the denominator by the GCD
		const den = this.getDenominator().divide( gcd );

		// Return object for chaining
		return new GaussianRational( num, den, shouldNormalize );
	}
}
