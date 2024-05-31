package domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import persistence.CompanyDAO;
import persistence.GenericDAO;

@Entity
@Table(name = "Company")
public class Company implements Serializable, CompanyInterface {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String companyId;
	private String name;

	@Transient
	private List<CompanyOrder> ordersForCompany = new ArrayList<>();

	@OneToMany(mappedBy = "company")
	private List<User> users;

	@Transient
	private CompanyDAO dao;

	@OneToMany(mappedBy = "company", fetch = FetchType.EAGER)
	private List<Product> products;

	public Company(CompanyDAO dao) {
		this.dao = dao;
		users = new ArrayList<>();
	}

	protected Company() {
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public void addUser(User user) {
		this.users.add(user);
	}

	public void updateUser(User user) {
		for (User userOld : this.users) {
			if (userOld.getUserId().equals(user.getUserId())) {
				userOld = user;
				break;
			}
		}
	}

	public void removeUser(String userId) {
		int index = 0;
		for (User userOld : this.users) {
			if (userOld.getUserId().equals(userId)) {
				this.users.remove(index);
				break;
			} else {
				index++;
			}
		}
	}

	public GenericDAO<Company> getDao() {
		return dao;
	}

	public void setDao(CompanyDAO dao) {
		this.dao = dao;
	}

	public List<CompanyOrder> getOrders() {
		return this.ordersForCompany;
	}

	public void setOrders(List<CompanyOrder> orders) {
		this.ordersForCompany = orders;
	}

	@Override
	public String getCompanyId() {
		return companyId;
	}

	public String getName() {
		return name;
	}

	public CompanyOrder getOrder(String id) {
		for (CompanyOrder order : this.ordersForCompany) {
			if (order.getOrderId().equals(id)) {
				return order;
			}
		}
		return null;
	}

	public List<Product> getCompanyProducts() {
		return products;
	}

	public void setOrders() {
		List<CompanyOrder> orders = dao.findOrdersForCompany(this.name);
		this.ordersForCompany = orders;
	}

	@Override
	public String toString() {
		return "Company [companyId=" + companyId + ", name=" + name + ", ordersForCompany=" + ordersForCompany + "]";
	}

	public void setCompanyId(String id) {
		this.companyId = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String getCompanyName() {
		return name;
	}
	
	public Set<Company> getAllCustomers() {
        Set<Company> customers = new HashSet<>();
        
        for (CompanyOrder o : this.ordersForCompany) {
            customers.add(o.getCustomer());            
        }
        return customers;
    }
	
	public int getAmountOfOrdersFromCustomer(String customerId) {
        int total = 0;
        for (CompanyOrder o : this.ordersForCompany) {
            if (o.getCustomer().getCompanyId().equalsIgnoreCase(customerId)) {
                total++;
            }
        }
        return total;
    }
}
