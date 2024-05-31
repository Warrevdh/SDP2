package domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "`Order`")
@NamedQueries({
	@NamedQuery(name = "CompanyOrder.findOrderWithId", query = "SELECT o FROM CompanyOrder o WHERE o.orderId = :orderId"),
	@NamedQuery(name = "CompanyOrder.findOrdersForCompany", 
		query = "SELECT DISTINCT o FROM CompanyOrder o JOIN o.orderItems oi JOIN oi.product p "
				+ "JOIN p.company c WHERE c.name = :companyName")
})
public class CompanyOrder implements Serializable, Order {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	private String orderId;
	@Column(name = "orderCountry")
	private String deliveryCountry;
	@Column(name = "orderCity")
	private String deliveryCity;
	@Column(name = "orderPostalCode")
	private String deliveryPostalCode;
	@Column(name = "orderStreet")
	private String deliveryStreet;
	@Column(name = "orderAddressNumber")
	private String deliveryAddressNumber;
	private Date orderDate;
	private String status;
	@JoinColumn(name = "companyId")
	private Company customer;

	@OneToOne
	@JoinColumn(name = "transportId")
	private Carrier carrier;

	@OneToOne
	@JoinColumn(name = "packagingId")
	private Packaging packaging;

	@OneToOne
	@JoinColumn(referencedColumnName = "trackTraceCode", name = "trackTraceCode")
	private Track_Trace trackAndTrace;

	@OneToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "Order_Item",
		joinColumns = @JoinColumn(name = "order_Item_orderId"))
	private List<OrderItem> orderItems;

	public CompanyOrder(Date date, String status, String deliveryStreet, String deliveryAddressNumber,
			String deliveryCity, String deliveryPostalCode, Carrier carrier, Packaging packaging,
			List<OrderItem> orderItems, String id, Track_Trace trackAndTrace, String deliveryCountry) {
		this.orderDate = date;
		this.status = status;
		this.carrier = carrier;
		this.deliveryAddressNumber = deliveryAddressNumber;
		this.deliveryCity = deliveryCity;
		this.deliveryCountry = deliveryCountry;
		this.deliveryPostalCode = deliveryPostalCode;
		this.packaging = packaging;
		this.orderItems = orderItems;
		this.orderId = id;
		this.trackAndTrace = trackAndTrace;
	}

	protected CompanyOrder() {
	}
	
	@Override
	public String getCompanyName() {
		return customer.getName();
	}
	
	public Company getCustomer() {
		return customer;
	}
	
	@Override
	public String getCustomerName() {
		return customer.getName();
	}
	
	@Override
	public String getAmountOfOrders() {
		return customer.getName();
	}

	@Override
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Carrier getCarrier() {
		return carrier;
	}

	public void setCarrier(Carrier carrier) {
		this.carrier = carrier;
	}

	public Track_Trace getTrackAndTrace() {
		return trackAndTrace;
	}

	public void setTrackAndTrace(Track_Trace trackAndTrace) {
		this.trackAndTrace = trackAndTrace;
	}

	@Override
	public String getOrderId() {
		return orderId;
	}

	@Override
	public String getDeliveryCountry() {
		return deliveryCountry;
	}

	@Override
	public String getDeliveryCity() {
		return deliveryCity;
	}

	@Override
	public String getDeliveryPostalCode() {
		return deliveryPostalCode;
	}

	@Override
	public String getDeliveryStreet() {
		return deliveryStreet;
	}

	@Override
	public String getDeliveryAddressNumber() {
		return deliveryAddressNumber;
	}

	@Override
	public Date getOrderDate() {
		return orderDate;
	}

	public Packaging getPackaging() {
		return packaging;
	}

	@Override
	public List<OrderItemInterface> getOrderItems() {
		return (List<OrderItemInterface>) (Object) this.orderItems;
	}

	@Override
	public String getPackagingName() {
		return this.packaging.getName();
	}

	@Override
	public boolean hasCarrier() {
		return this.carrier != null;
	}

	@Override
	public String getCarrierName() {
		return this.carrier.getName();
	}

	@Override
	public boolean hasTrackAndTrace() {
		return this.trackAndTrace != null;
	}

	@Override
	public String getTrackTraceCode() {
		return this.trackAndTrace.getTrackTraceCode();
	}

	@Override
	public String getVerificationCode() {
		return this.trackAndTrace.getVerificationCode();
	}
	
}
