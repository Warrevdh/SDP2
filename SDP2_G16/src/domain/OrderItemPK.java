package domain;

import java.io.Serializable;

public class OrderItemPK implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String orderId;
	
	private String productId;

	public String getOrderId() {
		return orderId;
	}

	public String getProductId() {
		return productId;
	}
	
	public OrderItemPK(String orderId) {
		this.orderId =orderId;
	}
	
	protected OrderItemPK() {
	}
}
