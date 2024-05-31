package persistence;

import java.util.List;

import domain.User;

public interface UserDAO extends GenericDAO<User>{
	
	User getUserWithEmail(String email);
	
	User findById(String id);
	
	void updateById(String id, User user);
	
	List<User> getAllAdminAndEmployeesFromCompany(String companyId);
	
	void createUser(User user);
	
	void deleteUser(String userId);
}
