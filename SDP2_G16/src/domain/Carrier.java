package domain;

import java.io.Serializable;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "TransportService")
public class Carrier implements Serializable, CarrierInterface {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String transportServiceId;
	private String name;
	private String email;
	private String phoneNumber;
	
	private int trackLenght;
	private boolean trackOnlyNumbers;
	private String trackPrefix;
	
	private boolean activeForDelivery;

	public Carrier(String name, String email, String phoneNumber,
			boolean activeForDelivery, int trackLenght,
			boolean trackOnlyNumber, String trackPrefix) {
		this.transportServiceId = UUID.randomUUID().toString();
		this.name = name;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.activeForDelivery = activeForDelivery;
		this.trackLenght = trackLenght;
		this.trackOnlyNumbers = trackOnlyNumber;
		setTrackPrefix(trackPrefix);
	}

	protected Carrier() {
	}
	
	@Override
	public String getTransportServiceId() {
		return transportServiceId;
	}
	
	public void setTransportServiceId(String id) {
		this.transportServiceId = id;
	}
	
	@Override
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	@Override
	public String getEmailContactPerson() {
		return this.email;
	}
	
	public void setEmailContactPerson(String email) {
		this.email = email;
	}
	
	@Override
	public String getPhoneNumberContactPerson() {
		return this.phoneNumber;
	}
	
	public void setPhoneNumberContactPerson(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	
	@Override
	public int getTrackLenght() {
		return trackLenght;
	}
	
	public void setTrackLength(int length) {
		this.trackLenght = length;
	}

	@Override
	public boolean isTrackOnlyNumbers() {
		return trackOnlyNumbers;
	}
	
	@Override
	public String isTrackOnlyNumbersText() {
		if (this.trackOnlyNumbers) {
			return "Yes";
		}
		return "No";
	}
	
	public void setTrackOnlyNumbers(boolean isOnlyNumbers) {
		this.trackOnlyNumbers = isOnlyNumbers;
	}

	@Override
	public String getTrackPrefix() {
		return trackPrefix;
	}
	
	public void setTrackPrefix(String prefix) {
		this.trackPrefix = prefix + "_";
	}
	
	@Override
	public boolean isActiveForDelivery() {
		return activeForDelivery;
	}
	
	@Override
	public String isActiveForDeliveryText() {
		if (this.activeForDelivery) {
			return "Yes";
		}
		return "No";
	}

	public void setActiveForDelivery(boolean activeForDelivery) {
		this.activeForDelivery = activeForDelivery;
	}

	@Override
	public String toString() {
		return "Carrier [transportServiceId=" + transportServiceId + ", name=" + name + ", email=" + email
				+ ", phoneNumber=" + phoneNumber + ", trackLenght=" + trackLenght + ", trackOnlyNumbers="
				+ trackOnlyNumbers + ", trackPrefix=" + trackPrefix + ", activeForDelivery=" + activeForDelivery + "]";
	}
}
