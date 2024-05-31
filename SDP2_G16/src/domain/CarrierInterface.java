package domain;

public interface CarrierInterface {
	public boolean isActiveForDelivery();
	
	public String isActiveForDeliveryText();

	public String getName();
	
	public String getEmailContactPerson();
	
	public String getPhoneNumberContactPerson();

	public int getTrackLenght();

	public boolean isTrackOnlyNumbers();
	
	public String isTrackOnlyNumbersText();

	public String getTrackPrefix();

	public String getTransportServiceId();
}
