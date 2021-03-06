class GaussianInt {

	// Constructor for new GaussianInt objects
	constructor( re, im ) {
		this.re = Math.round( re );
		this.im = Math.round( im );
	}

	// Getter for real component
	getRealPart() {
		return this.re;
	}

	// Getter for imaginary component
	getImaginaryPart() {
		return this.im;
	}

	// Flips sign on both real and imaginary components
	negate() {
		return new GaussianInt( -this.getRealPart(), -this.getImaginaryPart() );
	}

	// Returns a cloned GaussianInt
	clone() {
		return new GaussianInt( this.getRealPart(), this.getImaginaryPart() );
	}

	// Returns true if real and imaginary components match the given input
	equals( val ) {
		return this.getRealPart() === val.getRealPart() && this.getImaginaryPart() === val.getImaginaryPart();
	}

	// Returns the norm: a^2 + b^2
	getNorm() {
		return this.getRealPart() * this.getRealPart() + this.getImaginaryPart() * this.getImaginaryPart();
	}

	// Returns true if value is +/- 1 or +/- i
	isUnit() {
		return this.getNorm() === 1;
	}

	// Returns true if both real and imaginary parts are zero
	isZero() {
	  return this.getNorm() === 0;
	}

	// Subtracts the given gaussian int from the gaussian int to produce a new gaussian int
	add( toAdd ) {

		// Calculate the real part
		const re = this.getRealPart() + toAdd.getRealPart();

		// Calcualte the imaginary part
		const im = this.getImaginaryPart() + toAdd.getImaginaryPart();

		// Construct the subtracted value
		return new GaussianInt( re, im );
	}

	// Subtraction is simply addition by the negative of the given input
	subtract( sub ) {
		return this.add( sub.negate() );
	}

	// Multiplies the gaussian int by the given gaussian int to produce a new gaussian int
	multiply( mult ) {

		// Calculate the real part of the product
		const re = this.getRealPart() * mult.getRealPart() - this.getImaginaryPart() * mult.getImaginaryPart();

		// Calculate the imaginary part of the product
		const im = this.getRealPart() * mult.getImaginaryPart() + this.getImaginaryPart() * mult.getRealPart();

		// Construct the product
		return new GaussianInt( re, im );
	}

	// Divides the gaussian int by the given gaussian int to produce a new gaussian int
	divide( div ) {

		// Calculate the real part after division by the GCD
		const re = ( this.getRealPart() * div.getRealPart() + this.getImaginaryPart() * div.getImaginaryPart() ) / div.getNorm();

		// Calculate the imaginary part after division by the GCD
		const im = ( this.getImaginaryPart() * div.getRealPart() - this.getRealPart() * div.getImaginaryPart() ) / div.getNorm();

		// Construct the reduced value
		return new GaussianInt( re, im );
	}

	// Calculates the remainder upon division by the given input
	getRemainder( toDivide ) {

		// Divide numerator by denominator and get nearest integer
		const near = this.divide( toDivide );

		// Compute the product of the nearest integer and the denominator
		const prod = toDivide.multiply( near );

		// Subtract the product from the numerator to get the remainder
		return this.subtract( prod );
	}

	print() {

		const re = this.getRealPart();
		const im = this.getImaginaryPart();

		// Handle zero
		if ( re === 0 && im === 0 ) {
			return "0";
		}

		// Handle pure real
		if ( im === 0 ) {
			return re;
		}

		// Handle pure imaginary
		if ( re === 0 ) {
			if ( im === 1 ) {
				return "i";
			}
			else if ( im === -1 ) {
				return "-i";
			}
			else {
				return im + "i";
			}
		}

		// Handle mixed case with -1i
		if ( im === -1 ) {
			return re + "-i";
		}

		// Handle mixed case with +1i
		if ( im === 1 ) {
			return re + "+i";
		}

		// Handle mixed case with positive imaginary part
		if ( im > 1 ) {
			return re + "+" + im + "i";
		}

		// Handle mixed case with negative imaginary part
		if ( im < 1 ) {
			return re + "-" + Math.abs( im ) + "i";
		}

		throw "Unable to print Gaussian integer: (" + re + ", " + im + ")";
	}

	static getGCD( intA, intB ) {

		// If either input is zero, then define the GCD to be 1
		if ( intA.isZero() || intB.isZero() ) {
			return GaussianConsts.positiveOne();
		}

		// Determine which of our two inputs is larger
		let [ larger, smaller ] = ( intA.getNorm() > intB.getNorm() ? [ intA, intB ] : [ intB, intA ] );

		// Calculate the remainder upon division
		let remainder = larger.getRemainder( smaller );

		// If we have zero remainder, then our denominator is our GCD
		if ( remainder.isZero() ) {
			return smaller.clone();
		}

		// To start, we'll assume the denominator is the GCD
		let gcd = smaller;
		let i = 0;
	  
	  	// Keep reducing until we have zero remainder
		do {
			// Our GCD is our remainder prior to updating
			gcd = remainder;

			// Calculate remainder when smaller is divided by remainder
			larger = smaller;
			smaller = remainder;

			// Compute our new remainder
			remainder = larger.getRemainder( smaller );

			if ( i++ > 50 ) {
				throw "Unable to calculate GCD";
			}
		}
		while ( !remainder.isZero() );

		// If the GCD is 1 or -1 or i or -i, just return 1
		if ( gcd.isUnit() ) {
			return GaussianConsts.positiveOne();
		}

		// Return the greatest common divisor
		return gcd;
	}
}
