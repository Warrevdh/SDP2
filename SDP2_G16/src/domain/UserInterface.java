package domain;

public interface UserInterface {
	
	public String getUserId();
    
	public String getFirstname();

	public String getLastname();

	public String getEmail();

	public String getPassword();

	public String getPhoneNumber();
	
	public String getTelNumber();
	
	public String getCountry();
	
	public String getCity();

	public String getPostalCode();

	public String getStreet();

	public int getAddressNumber();
	
	
	public Company getCompany();
	
	public String getCompanyIdOfUser();
	
	public String getRoleName();

	public boolean isAdmin();

    public boolean isEmployee();
}
