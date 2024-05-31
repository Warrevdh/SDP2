package domain;

import java.util.List;

import dto.CarrierDTO;
import dto.UserDTO;
import persistence.CarrierDAO;

public class AdminController extends DomainController{
	public AdminController(User currentUser, Company userCompany) {
		super(currentUser, userCompany);
	}
	
	public List<UserInterface> getAllEmployees(){
		return (List<UserInterface>) (Object) getCurrentCompany().getUsers();
	}
	
	public UserInterface getUser(String id) {
		List<UserInterface> users = getAllEmployees();
		for (UserInterface user : users) {
			if (user.getUserId().equals(id)) {
				return user;
			}
		}
		return null;
	}
	
	public void createUser(UserDTO user) {
		User newUser = new User(user, getCurrentCompany());
		
		// ONLY CurrentUser (Admin) has a DAO to interact with
		// This prevents non-admin to change their own data
		getCurrentUser().createUser(newUser);
	}
	
	public void updateUser(UserDTO user, String userId) {
		User updatedUser = (User) getUser(userId);
		
		updatedUser.setEmail(user.email());
		updatedUser.setPhoneNumber(user.phoneNumber());
		updatedUser.setTelNumber(user.telNumber());
		updatedUser.setCountry(user.country());
		updatedUser.setCity(user.city());
		updatedUser.setPostalCode(user.postalCode());
		updatedUser.setStreet(user.street());
		updatedUser.setAddressNumber(user.addressNumber());
		
		updatedUser.setRole(user.role());

		// ONLY CurrentUser (Admin) has a DAO to interact with
		// This prevents non-admin to change their own data
		getCurrentUser().updateUser(updatedUser, updatedUser.getUserId());
	}
	
	public void deleteUser(String userId) {
		this.getCurrentUser().removeUser(userId);
	}

	public void createCarrier(CarrierDTO carrier) {
		Carrier newCarrier = new Carrier(
				carrier.name(),
				carrier.email(),
				carrier.phoneNumber(),
				carrier.activeForDelivery(),
				carrier.trackLength(),
				carrier.trackOnlyNumbers(),
				carrier.trackPrefix());
		
		CarrierDAO dao = getCarrierDAO();
		dao.createCarrier(newCarrier);
	}

	public void deleteCarrier(String carrierId) {
		CarrierDAO dao = getCarrierDAO();
		dao.deleteCarrier(carrierId);
	}

	public void updateCarrier(CarrierDTO carrier, String carrierId) {
		CarrierDAO dao = getCarrierDAO();
		dao.updateCarrier(carrier, carrierId);
	}
}
