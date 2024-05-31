package domain;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "Product")
public class Product implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String productId;
	private String name;

	@ManyToOne
	@JoinColumn(name = "fromCompany", referencedColumnName = "name")
	private Company company;

	@Transient
	private double price;

	public Product(String name) {
	}

	protected Product() {
	}

	@Override
	public String toString() {
		return "Product [productId=" + productId + ", name=" + name + ", price=" + price + "]";
	}

	public String getName() {
		return name;
	}
}
