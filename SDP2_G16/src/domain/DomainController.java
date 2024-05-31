package domain;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;

import org.mindrot.jbcrypt.BCrypt;

import persistence.CarrierDAO;
import persistence.CarrierDAOJpa;
import persistence.CompanyDAOJpa;
import persistence.UserDAO;
import persistence.UserDAOJpa;
import util.JPAUtil;

public abstract class DomainController {
	private User currentUser = null;
	private Company userCompany = null;
	
	// This a ID which can be used for all current processing (orders, users, ...)
	private String currentID;
	// This is changed to true when a save transaction with the database occurs,
	// and back to false when finished
	private boolean isTransaction = false;
	
	private Set<Observer> observers;

	private CarrierDAO carrierDao;

	public DomainController() {
		this.observers = new HashSet<>();
	}
	
	public DomainController(User currentUser, Company userCompany) {
		this.currentUser = currentUser;
		this.userCompany = userCompany;
		this.observers = new HashSet<>();
	}

	public void logIn(String email, String password) {
		User user = null;

		if (email.isBlank()) {
			throw new IllegalArgumentException("Email should not be empty");
		}
		if (password.isBlank()) {
			throw new IllegalArgumentException("Password should not be empty");
		}

		try {
			TypedQuery<User> query = JPAUtil.getEntityManagerFactory().createEntityManager()
					.createNamedQuery("User.findUserWithEmail", User.class).setParameter("userEmail", email);
			user = query.getSingleResult();
		} catch (NoResultException e) {
			// Handle the case where the query returns no results
			throw new IllegalArgumentException("No user with this email exists");
		} catch (Exception e) {
			throw new IllegalArgumentException("Something went wrong trying to log in");
		}

		if (user != null) {
			if (!user.isAdmin() && !user.isEmployee()) {
				user = null;
				throw new IllegalArgumentException("Access is prohibited for this user");

			} else if (!BCrypt.checkpw(password, user.getPassword())) {
				throw new IllegalArgumentException("Email and/or password is incorrect");

			} else {
				this.currentUser = user;
				this.currentUser.setDao(new UserDAOJpa());
				this.userCompany = this.currentUser.getCompany();

				List<User> colleagues = this.currentUser.getColleagues();
				this.userCompany.setUsers(colleagues);

				// Setting DAO for company
				this.userCompany.setDao(new CompanyDAOJpa());

				// Correctly setting up the orders (this is necessary because of how the
				// database is structured
				// and can't be easily fixed with just annotations)
				this.userCompany.setOrders();
			}
		}
	}

	public void logOut() {
		this.currentUser = null;
		this.userCompany = null;
	}

	public boolean isLoggedIn() {
		if (this.currentUser == null) {
			return false;
		}
		return true;
	}
	
	public boolean isAdmin() {
		return this.currentUser.isAdmin();
	}
	
	public boolean isEmployee() {
		return this.currentUser.isEmployee();
	}
	
	public User getCurrentUser() {
		return this.currentUser;
	}
	
	public String getCurrentUserId() {
		return this.currentUser.getUserId();
	}
	
	public UserDAO getCurrentUserDao() {
		return this.currentUser.getDao();
	}
	
	public Company getCurrentCompany() {
		return this.userCompany;
	}
	
	public String getCurrentCompanyName() {
		return this.userCompany.getName();
	}
	
	public void addObserver(Observer obs) {
		observers.add(obs);
	}

	public void removeObserver(Observer obs) {
		observers.remove(obs);
	}
	
	public void clearObservers() {
		observers.clear();
	}
	
    private void notifyObservers() {
		observers.forEach(obs -> obs.update(this.currentID, this.isTransaction));
	}
    
    //Method which is used for a current order/employee/...    (used for Observer)
    public void setCurrentProcess(String id, boolean changed) {
    	this.currentID = id;
    	this.isTransaction = changed;
    	
    	notifyObservers();
    	
    	// Transaction is finished
    	this.isTransaction = false;
    }
    
    public List<CarrierInterface> getAllCarriers() {
    	if (this.carrierDao == null) {
    		this.carrierDao = new CarrierDAOJpa();
    	}
		return (List<CarrierInterface>) (Object) carrierDao.findAll();
	}
    
    public Carrier getCarrierWithId(String carrierId) {
    	return this.carrierDao.get(carrierId);
    }
    
    public CarrierDAO getCarrierDAO() {
    	return this.carrierDao;
    }
}
