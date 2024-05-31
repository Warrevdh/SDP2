package domain;

import java.util.Date;
import java.util.List;

public interface Order {
	
	public String getOrderId();
	
	public List<OrderItemInterface> getOrderItems();
	
	public Date getOrderDate();
	
	public String getDeliveryCountry();
	
	public String getDeliveryCity();
	
	public String getDeliveryPostalCode();
	
	public String getDeliveryStreet();
	
	public String getDeliveryAddressNumber();
	
	public String getPackagingName();
	
	public String getStatus();

	public boolean hasCarrier();
	
	public String getCarrierName();
	
	public boolean hasTrackAndTrace();

	public String getTrackTraceCode();

	public String getVerificationCode();
	
	public String getCompanyName();
	
	public String getAmountOfOrders();

	public String getCustomerName();
}
