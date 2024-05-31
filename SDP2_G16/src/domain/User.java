package domain;

import persistence.UserDAO;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import dto.UserDTO;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

import javax.persistence.*;

@Entity
@Table(name = "User")
@NamedQueries({
	@NamedQuery(name = "User.findUserWithEmail", query = "SELECT u FROM User u WHERE u.email = :userEmail"),
	@NamedQuery(name = "User.findAllAdminAndEmployeesFromCompany",
		query = "SELECT u FROM User u WHERE u.company.companyId = :companyID")

})
public class User implements UserInterface, Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	private String userId;
	private String firstname;
	private String lastname;
	private String email;
	private String password;
	private String phoneNumber;
	private String telNumber;
	private String country;
	private String city;
	private String postalCode;
	private String street;
	private int addressNumber;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
	@ManyToOne
	@JoinColumn(name = "companyId")
	private Company company;
	
	@Transient
	private UserDAO dao;

	public User(String id, String firstname, String lastname, String country, String street, String city,
			int addressNumber, String postalCode, String phoneNumber, String telNumber, String email) {
		this.userId = id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.phoneNumber = phoneNumber;
		this.telNumber = telNumber;
		this.email = email;
		this.country = country;
		this.street = street;
		this.city = city;
		this.addressNumber = addressNumber;
	}
	
	public User(UserDTO userDTO, Company company) {
		setUserId();
		this.firstname = userDTO.firstname();
		this.lastname = userDTO.lastname();
		this.email = userDTO.email();
		this.password = userDTO.password();
		this.phoneNumber = userDTO.phoneNumber();
		this.telNumber = userDTO.telNumber();
		this.country = userDTO.country();
		this.city = userDTO.city();
		this.postalCode = userDTO.postalCode();
		this.street = userDTO.street();
		this.addressNumber = userDTO.addressNumber();
		
		setRole(userDTO.role());
		
		this.company = company;
	}

	protected User() {
	}
	
	@Override
	public String getUserId() {
		return userId;
	}
	
	public void setUserId() {
		this.userId = UUID.randomUUID().toString();
	}
	
	@Override
	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	@Override
	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	@Override
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	@Override
	public String getTelNumber() {
		return telNumber;
	}

	public void setTelNumber(String telNumber) {
		this.telNumber = telNumber;
	}

	@Override
	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	@Override
	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	@Override
	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	@Override
	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	@Override
	public int getAddressNumber() {
		return addressNumber;
	}

	public void setAddressNumber(int addressNumber) {
		this.addressNumber = addressNumber;
	}
	
	@Override
	public String getCompanyIdOfUser() {
		return this.company.getCompanyId();
	}
	
	@Override
	public Company getCompany() {
		return company;
	}

	public void setCompany(Company company) {
		this.company = company;
	}
	
	public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    
    public void setRole(String role) {
    	switch (role) {
	        case "Employee":
	            this.setRole(Role.employee);
	            break;
	        case "Admin":
	            this.setRole(Role.admin);
	            break;
	        case "Customer":
	            this.setRole(Role.customer);
	            break;
	        default:
	            break;
	    }
    }
	
    @Override
    public boolean isAdmin() {
        return role == Role.admin;
    }

    @Override
    public boolean isEmployee() {
        return role == Role.employee;
    }
    
    public List<User> getColleagues() {
		String companyId = getCompanyIdOfUser();
		List<User> colleagues = dao.getAllAdminAndEmployeesFromCompany(companyId);
		return colleagues;
	}

    
    public void createUser(User user) {
    	dao.createUser(user);
    	this.company.addUser(user);
    }
    
    public void updateUser(User user, String userId) {		
    	dao.updateById(userId, user);
    	this.company.updateUser(this);
    }
    
    public void removeUser(String userId) {
    	dao.deleteUser(userId);
    	this.company.removeUser(userId);
    }

	public UserDAO getDao() {
		return dao;
	}

	public void setDao(UserDAO dao) {
		this.dao = dao;
	}

	@Override
	public String toString() {
		return "User [userId=" + userId + ", firstname=" + firstname + ", lastname=" + lastname + ", email=" + email
				+ ", password=" + password + ", phoneNumber=" + phoneNumber + ", telNumber=" + telNumber + ", country="
				+ country + ", city=" + city + ", postalCode=" + postalCode + ", street=" + street + ", addressNumber="
				+ addressNumber + ", role=" + role + "]";
	}

	@Override
	public String getRoleName() {
		switch (this.getRole()) {
        	case admin:
        		return "Admin";
        case employee:
            	return "Employee";
        case customer:
            	return "Customer";
        default:
            	return "";
		}
	}
}
