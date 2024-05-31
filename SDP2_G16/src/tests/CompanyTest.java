package tests;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import domain.Company;
import domain.User;
import dto.UserDTO;
import persistence.CompanyDAO;
import persistence.CompanyDAOJpa;

public class CompanyTest {

	private Company company;
	private CompanyDAO dao;
	private User testUser1;
	private User testUser2;

	@BeforeEach
	public void setUp() {
		dao = new CompanyDAOJpa();
		company = new Company(dao);
		company.setCompanyId("123");
		company.setName("Test Company");
		UserDTO dto1 = new UserDTO("fn", "ln", "mail1", "04", "04", "co", "ci", "9000", "s", 1, "admin");
		UserDTO dto2 = new UserDTO("fn", "ln", "mail2", "04", "04", "co", "ci", "9000", "s", 1, "admin");
		testUser1 = new User(dto1, company);
		testUser2 = new User(dto2, company);
	}

	@Test
	public void testAddUser_Success() {
		company.addUser(testUser1);

		List<User> users = company.getUsers();
		assertEquals(1, users.size());
		assertEquals(testUser1, users.get(0));
	}

//	@Test
//	public void testUpdateUser() {
//		company.addUser(testUser1);
//
//		UserDTO dto = new UserDTO("updatedFn", "updatedLn", "mail3", "04", "04", "co", "ci", "9000", "s", 1, "admin");
//		User updatedUser = new User(dto, company);
//		company.updateUser(updatedUser);
//
//		List<User> users = company.getUsers();
//		assertEquals(1, users.size());
//		assertEquals(updatedUser, users.get(0));
//		assertNotEquals(testUser1, users.get(0));
//	}

	@Test
	public void testRemoveUser_Success() {
		company.addUser(testUser1);
		company.addUser(testUser2);

		company.removeUser(testUser1.getUserId());

		List<User> users = company.getUsers();
		assertEquals(1, users.size());
		assertEquals(testUser2, users.get(0));
	}
}