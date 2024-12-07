export function decodeJWT(token: string) {
	let expirationTime = "";
	try {
		const tokenParts = token.split(".");
		if (tokenParts.length !== 3) {
			throw new Error("Invalid JWT token format");
		}

		const payload = JSON.parse(atob(tokenParts[1]));
		const exp = payload.exp;

		// Convert Unix timestamp to a human-readable date
		const expirationDate = new Date(exp * 1000);
		expirationTime = expirationDate.toLocaleString(); // Format the date as a string
	} catch (error: any) {
		console.error("Error decoding JWT:", error.message);
		expirationTime = "Invalid token";
	}

	return new Date(expirationTime);
}
