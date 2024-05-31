package domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "Order_Item")
@IdClass(OrderItemPK.class)
public class OrderItem implements Serializable, OrderItemInterface {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "order_Item_orderId")
	private String orderId;

	@Id
	@Column(name = "order_Item_productId", insertable = false, updatable = false)
	private String productId;

	@ManyToOne
	@JoinColumn(name = "order_Item_productId", referencedColumnName = "productId")
	private Product product;

	private int quantity;
	private double price;

	public OrderItem(String iets) {
	}

	protected OrderItem() {
	}

	@Override
	public String toString() {
		return "productId=" + product + "]";
	}

	public Product getProduct() {
		return product;
	}

	public int getQuantity() {
		return quantity;
	}

	public double getPrice() {
		return price;
	}
	
	public String getProductName() {
		return this.product.getName();
	}
}
