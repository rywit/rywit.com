class GaussianConsts {
	// Returns GaussianInt representing +1
	static positiveOne() {
		return new GaussianInt( 1, 0 );
	}

	// Returns GaussianInt representing -1
	static negativeOne() {
		return new GaussianInt( -1, 0 );
	}

	// Returns GaussianInt representing +i
	static positiveI() {
		return new GaussianInt( 0, 1 );
	}

	// Returns GaussianInt representing -i
	static negativeI() {
		return new GaussianInt( 0, -1 );
	}
}

class GaussianRationalConsts {
	// Returns GaussianInt representing +1
	static positiveOne() {
		return new GaussianRational( GaussianConsts.positiveOne(), GaussianConsts.positiveOne() );
	}

	// Returns GaussianInt representing -1
	static negativeOne() {
		return new GaussianRational( GaussianConsts.negativeOne(), GaussianConsts.positiveOne() );
	}

	// Returns GaussianInt representing +i
	static positiveI() {
		return new GaussianRational( GaussianConsts.positiveI(), GaussianConsts.positiveOne() );
	}

	// Returns GaussianInt representing -i
	static negativeI() {
		return new GaussianRational( GaussianConsts.negativeI(), GaussianConsts.positiveOne() );
	}
}
