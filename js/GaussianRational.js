class GaussianRational {

	constructor( num, den ) {
		this.num = num;
		this.den = den;
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
	isImaginaryOne() {
		return this.isUnit() && this.getNumerator().getImaginaryPart() === 1 && this.getDenominator().getRealPart() === 1;
	}

	// Returns true if fraction is -i/1
	isNegImaginaryOne() {
		return this.isUnit() && this.getNumerator().getImaginaryPart() === -1 && this.getDenominator().getRealPart() === 1;
	}

	// Is the fraction equal to the input fraction
	equals( frac ) {
		return this.getNumerator().equals( frac.getNumerator() ) && this.getDenominator().equals( frac.getDenominator() );
	}

	// Negates the numerator and denominator
	negate() {
		return new GaussianRational( this.getNumerator().negate(), this.getDenominator().negate() );
	}

	// Outputs latex code for printing fraction
	print() {
		return "\\cfrac{" + this.getNumerator().print() + "}{" + this.getDenominator().print() + "}";
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
			normalized = normalized.negate();
		}

		// If the numerator and denominator are the same, replace with 1
		if ( normalized.getNumerator().equals( normalized.getDenominator() ) ) {
			normalized = new GaussianRational( GaussianConsts.one(), GaussianConsts.one() );
		}

		// Return the normalized object
		return normalized;
	}

	reduce( gcd ) {

		// Divide the numerator by the GCD
		const num = this.getNumerator().divide( gcd ); 

		// Divide the denominator by the GCD
		const den = this.getDenominator().divide( gcd );

		// Return object for chaining
		return new GaussianRational( num, den );
	}

	reduceToLowestTerms() {

		// Calculate the GCD of the two guassian ints
		const gcd = GaussianInt.getGCD( this.getNumerator(), this.getDenominator() );

		// Reduce the numerator and denominator by GCD, normalize and return
		return this.reduce( gcd ).normalize();
	}

	iterate() {

		const num = this.getNumerator();
		const den = this.getDenominator();

		const nums = [

			// 1/(x-i)
			den.add( num.multiply( GaussianConsts.i() ) ),

			// 1/(i+x)
			den.subtract( num.multiply( GaussianConsts.i() ) ),

			// 1/(1+x)
			den.subtract( num ),

			// 1/(x-1)
			den.add( num )
		];

		// Get the norm of each numerator
		const norms = nums.map( x => x.getNorm() );

		// Figure out which operation resulted in the smallest norm (greater than zero)
		const minNorm = Math.min.apply( null, norms.filter( Boolean ) );
		const op = norms.indexOf( minNorm );

		// Create a new rational after inversion
		const frac = new GaussianRational( nums[ op ], num );

		// Return the operation number and the resulting value
		return { op : op, val: frac.normalize() };
	}

	getTailOps() {
		
		// Handle 1
		if ( this.isPositiveOne() ) {
			return { ops: [], val: GaussianConsts.one(), inverted: false };
		}

		// Handle -1
		if ( this.isNegativeOne() ) {
			return { ops: [ 2, 3, 2 ], val: GaussianConsts.one(), inverted: false };
		}

		// Handle i
		if ( this.isImaginaryOne() ) {
			return { ops: [], val: GaussianConsts.i(), inverted: false };
		}

		// Handle -i
		if ( this.isNegImaginaryOne() ) {
			return { ops: [], val: GaussianConsts.i(), inverted: true };
		}
	}

	decompose() {

		// Reduce the fraction to lowest terms
		let frac = this.reduceToLowestTerms();

		// This will be our sequence of operations
		let ops = [];

		// Continue iterating until we're left with a unit
		while ( !frac.isUnit() ) {

			// Iterate the fraction
			const res = frac.iterate();

			// Add the operation code to our list
			ops.push( res.op );

			// Normalize the resulting fraction
			frac = res.val.normalize();
		}

		// Append the tail for this seed
		const tail = frac.getTailOps();
		ops = ops.concat( tail.ops );

		// Return our operations, the final seed and the inversion flag
		return { ops: ops, seed: tail.val, inverted: tail.inverted };
	}
}
