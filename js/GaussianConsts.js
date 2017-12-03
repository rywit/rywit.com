class GaussianConsts {
	// Returns GaussianInt representing +1
	static one() {
		return new GaussianInt( 1, 0 );
	}

	// Returns GaussianInt representing -1
	static negativeOne() {
		return new GaussianInt( -1, 0 );
	}

	// Returns GaussianInt representing +i
	static i() {
		return new GaussianInt( 0, 1 );
	}

	// Returns GaussianInt representing -i
	static negativeI() {
		return new GaussianInt( 0, -1 );
	}
}
