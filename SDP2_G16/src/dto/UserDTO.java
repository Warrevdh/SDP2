package dto;

public record UserDTO(String firstname, String lastname, String email, String password,
		String phoneNumber, String telNumber, String country, String city, String postalCode,
		String street, int addressNumber, String role) {
	
	public UserDTO(String firstname, String lastname, String email,
			String phoneNumber, String telNumber, String country, String city, String postalCode,
			String street, int addressNumber, String role) {
		this(firstname, lastname, email, null,
				phoneNumber, telNumber, country, city, postalCode,
				street, addressNumber, role);
	}
}
