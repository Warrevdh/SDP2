package tests;

import org.junit.jupiter.api.BeforeEach;

import domain.AdminController;
import domain.Company;
import domain.User;
import dto.UserDTO;
import persistence.CompanyDAO;
import persistence.CompanyDAOJpa;
import persistence.UserDAOJpa;

class UserTest {
	private AdminController dc;
	private Company company;
	private CompanyDAO dao;
	private User testUser1;
	private String id1 = "";
	private String id2 = "";

	@BeforeEach
	public void setUp() {
		dao = new CompanyDAOJpa();
		company = new Company(dao);
		company.setCompanyId("123");
		company.setName("Test Company");
		UserDTO dto1 = new UserDTO("fn", "ln", "mail1", "04", "04", "co", "ci", "9000", "s", 1, "admin");
		testUser1 = new User(dto1, company);
		dc = new AdminController(testUser1, company);
		testUser1.setDao(new UserDAOJpa());
	}

//	@Test
//	public void createNewUser() {
//		UserDTO dto1 = new UserDTO("fn", "ln", "mail2", "04", "04", "co", "ci", "9000", "s", 1, "employee");
//		UserDTO dto2 = new UserDTO("fn", "ln", "mail3", "04", "04", "co", "ci", "9000", "s", 1, "employee");
//
//		dc.createUser(dto1);
//		dc.createUser(dto2);
//
//		for (UserInterface user : dc.getAllEmployees()) {
//			if (user.getEmail().equals(dto1.email()))
//				id1 = user.getUserId();
//			if (user.getEmail().equals(dto2.email()))
//				id2 = user.getUserId();
//		}
//
//		User createdUser1 = (User) dc.getUser(id1);
//		User createdUser2 = (User) dc.getUser(id2);
//
//		assertNotNull(createdUser1);
//		assertNotNull(createdUser2);
//		assertEquals("fn", createdUser1.getFirstname());
//		assertEquals("fn", createdUser2.getFirstname());
//
//		List<User> users = company.getUsers();
//		assertEquals(2, users.size());
//		assertTrue(users.contains(createdUser1));
//		assertTrue(users.contains(createdUser2));
//	}
}
