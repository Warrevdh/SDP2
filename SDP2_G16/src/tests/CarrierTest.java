package tests;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import domain.Carrier;

class CarrierTest {
	
	private Carrier carrier;

	@Test
	void getOrderId_correct() {
		String expectedId = "12345";
		Carrier carrier = new Carrier(expectedId, null, expectedId, false, 0, false, expectedId);
		
		String actualId = carrier.getTransportServiceId();
		
		assertEquals(expectedId, actualId, "The carrier ID does match the expected ID");
	}
	@Test
    public void getCarrierId_FailNonmatchingCarrierID() {
        String expectedId = "12345";
        Carrier carrier = new Carrier("54321", null, expectedId, false, 0, false, expectedId);

        String actualId = carrier.getTransportServiceId();

        assertNotEquals(expectedId, actualId, "The carrier ID should not match the expected ID");
    }
	
	@Test
    public void isActiveForDelivery_True() {
        Carrier carrier = new Carrier(null, null, null, true, 0, false, null);

        boolean isActive = carrier.isActiveForDelivery();

        assertTrue(isActive, "Carrier should be active for delivery");
    }
	
	@Test
    public void isActiveForDelivery_False() {
        Carrier carrier = new Carrier(null, null, null, false, 0, false, null);

        boolean isActive = carrier.isActiveForDelivery();

        assertFalse(isActive, "Carrier should not be active for delivery");
    }
	
	@Test
	void getName_correct() {
	    String expectedName = "John";
	    Carrier carrier = new Carrier(null, expectedName, expectedName, false, 0, false, expectedName);

	    String actualName = carrier.getName();

	    assertEquals(expectedName, actualName, "The carrier name does match the expected name");
	}

	@Test
	void getName_failNonmatchingName() {
	    String expectedName = "John";
	    Carrier carrier = new Carrier(null, "Jane", expectedName, false, 0, false, expectedName);

	    String actualName = carrier.getName();

	    assertNotEquals(expectedName, actualName, "The carrier name should not match the expected name");
	}


}
