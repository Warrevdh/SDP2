package tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import domain.Company;
import domain.CompanyOrder;
import domain.User;
import domain.UserController;
import dto.UserDTO;
import persistence.CompanyDAO;
import persistence.CompanyDAOJpa;

class OrderTest {

	private CompanyOrder order;
	private Company company;
	private CompanyDAO dao;
	private User testUser1;
	private UserController dc;

	@BeforeEach
	public void setUp() {
		dao = new CompanyDAOJpa();
		company = new Company(dao);
		company.setCompanyId("123");
		company.setName("Test Company");
		UserDTO dto1 = new UserDTO("fn", "ln", "mail1", "04", "04", "co", "ci", "9000", "s", 1, "admin");
		testUser1 = new User(dto1, company);
		dc = new UserController();
	}

	@Test
	public void getOrderId_Correct() {
		// Arrange
		String expectedId = "12345";
		CompanyOrder order = new CompanyOrder(null, null, null, null, null, null, null, null, null, null, null, expectedId);

		// Act
		String actualId = order.getOrderId();

		// Assert
		assertEquals(expectedId, actualId, "The order ID does match the expected ID");
	}

	@Test
	public void getOrderId_FailNonmatchingOrderID() {
		// Arrange
		String expectedId = "12345";
		CompanyOrder order = new CompanyOrder(null, null, null, null, null, null, null, null, null, null, null,
				expectedId);

		// Act
		String actualId = order.getOrderId();

		// Assert
		assertNotEquals(expectedId, actualId, "The order ID should not match the expected ID");
	}

	@Test
	public void getOrderDate_Correct() {
		// Arrange
		Date expectedDate = new Date();
		CompanyOrder order = new CompanyOrder(expectedDate, null, null, null, null, null, null, null, null, null, null,
				null);

		// Act
		Date actualDate = order.getOrderDate();

		// Assert
		assertEquals(expectedDate, actualDate, "The order date does match the expected date");
	}

	@Test
	public void getOrderDate_FailNonMatchingDates() {
		// Arrange
		Date expectedDate = new Date();

		Date failDate = new Date();
		failDate.setYear(2000);

		CompanyOrder order = new CompanyOrder(failDate, null, null, null, null, null, null, null, null, null, null,
				null);

		// Act
		Date actualDate = order.getOrderDate();

		// Assert
		assertNotEquals(expectedDate, actualDate, "The order date does match the expected date");
	}

	@Test
	public void getOrderStatus_Correct() {
		// Arrange
		String expectedStatus = "pending";
		CompanyOrder order = new CompanyOrder(null, expectedStatus, null, null, null, null, null, null, null, null,
				null, expectedStatus);

		// Act
		String actualStatus = order.getStatus();

		// Assert
		assertEquals(expectedStatus, actualStatus, "The order status does match the expected status");
	}

//	@Test
//	public void updateOrder_SuccessfullyUpdated() {
//		CompanyOrder order = new CompanyOrder(new Date(), "pending", "st", "nr", "ci", "9000", null, null, null, null,
//				"123", null, "co");
//
//		dc.updateOrder(new OrderDTO("5", "postcode", null, "pending"), "123");
//	}
}