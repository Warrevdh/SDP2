package persistence;

import javax.persistence.EntityTransaction;

import domain.Carrier;
import dto.CarrierDTO;

public class CarrierDAOJpa extends GenericDAOJPA<Carrier> implements CarrierDAO {

	public CarrierDAOJpa(Class<Carrier> type) {
		super(Carrier.class);
	}

	public CarrierDAOJpa() {
		super(Carrier.class);
	}
	

	@Override
	public void createCarrier(Carrier newCarrier) {
		EntityTransaction et = em.getTransaction();
		
		try {
            et.begin();
            em.persist(newCarrier);
            et.commit();
        } catch (Exception e) {
            if (et != null && et.isActive()) {
                et.rollback();
            }
            throw e;
        }
	}

	@Override
	public void deleteCarrier(String carrierId) {
		EntityTransaction et = em.getTransaction();
		
		Carrier carrier = em.find(Carrier.class, carrierId);
		try {
            et.begin();
            em.remove(carrier);
            et.commit();
        } catch (Exception e) {
            if (et != null && et.isActive()) {
                et.rollback();
            }
            throw new RuntimeException("Failed to delete carrier: " + e.getMessage(), e);
        }
	}

	@Override
	public void updateCarrier(CarrierDTO updatedCarrier, String carrierId) {
		EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            
            Carrier carrier = em.find(Carrier.class, carrierId);
            
            carrier.setName(updatedCarrier.name());
            carrier.setEmailContactPerson(updatedCarrier.email());
            carrier.setPhoneNumberContactPerson(updatedCarrier.phoneNumber());
            carrier.setTrackLength(updatedCarrier.trackLength());
            carrier.setTrackOnlyNumbers(updatedCarrier.trackOnlyNumbers());
            carrier.setTrackPrefix(updatedCarrier.trackPrefix());
            carrier.setActiveForDelivery(updatedCarrier.activeForDelivery());
            
            em.merge(carrier);
            tx.commit();
            
            System.out.println("Carrier updated: " + carrier);
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            e.printStackTrace();
        }
	}
}