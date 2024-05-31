package domain;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Packaging")
public class Packaging implements Serializable, PackagingInterface{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	private String packageId;
	private String name;
	private String type;
	private float price;
	private float width;
	private float height;
	private float length;
	private boolean activeForDelivery;
	
	public Packaging(String packageId, String name, float price, float width, float height, float length,
			boolean activeForDelivery, String type) {
		super();
		this.packageId = packageId;
		this.name = name;
		this.price = price;
		this.width = width;
		this.height = height;
		this.length = length;
		this.activeForDelivery = activeForDelivery;
		this.type = type;
	}
	
	protected Packaging() {
		
	}
	
	// GETTERS AND SETTERS
	public boolean isActiveForDelivery() {
		return activeForDelivery;
	}
	
	public void setActiveForDelivery() {
		this.activeForDelivery = !activeForDelivery;
	}
	
	public String getPackageId() {
		return packageId;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name= name;
	}
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	public float getWidth() {
		return width;
	}

	public void setWidth(float width) {
		this.width = width;
	}

	public float getHeight() {
		return height;
	}

	public void setHeight(float height) {
		this.height = height;
	}

	public float getLength() {
		return length;
	}

	public void setLength(float length) {
		this.length = length;
	}
	
}
