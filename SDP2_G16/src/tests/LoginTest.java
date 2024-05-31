package tests;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import domain.DomainController;
import domain.UserController;

class LoginTest {
	private DomainController dc;

	@BeforeEach
	public void setUp() {
		dc = new UserController();
	}

	@Test
	public void testAuthenticateWithValidCredentials() {
		// Test case 1: Valid credentials should return true
		String username = "joe.doe@gmail.com";
		String password = "JoeDoe123";
		dc.logIn(username, password);
		assertTrue(dc.isLoggedIn());
	}

	@Test
	public void testAuthenticateWithInvalidCredentials() {
		// Test case 2: Invalid credentials should return false when email not filled in
		Assertions.assertThrows(IllegalArgumentException.class, () -> dc.logIn("", "password"));
		assertFalse(dc.isLoggedIn());

		// Test case 3: Invalid credentials should return false when password not filled
		// in
		Assertions.assertThrows(IllegalArgumentException.class, () -> dc.logIn("email", ""));
		assertFalse(dc.isLoggedIn());

		// Test case 4: Invalid credentials should return false when both email and
		// password is not filled in
		Assertions.assertThrows(IllegalArgumentException.class, () -> dc.logIn("", ""));
		assertFalse(dc.isLoggedIn());
	}

	@Test
	public void testSignInWithWrongEmail() {
		Assertions.assertThrows(IllegalArgumentException.class, () -> dc.logIn("abc", "JoeDoe123"));
		assertFalse(dc.isLoggedIn());
	}

	@Test
	public void testSignInWithWrongPassword() {
		Assertions.assertThrows(IllegalArgumentException.class, () -> dc.logIn("joe.doe@gmail.com", "abc"));
		assertFalse(dc.isLoggedIn());
	}

	@Test
	public void testSignInWithNoAccessToDesktopApp() {
		Assertions.assertThrows(IllegalArgumentException.class, () -> dc.logIn("john.doe@gmail.com", "JohnDoe123"));
		assertFalse(dc.isLoggedIn());
	}

}