package persistence;

import domain.Carrier;
import dto.CarrierDTO;

public interface CarrierDAO extends GenericDAO<Carrier> {

	void createCarrier(Carrier newCarrier);

	void deleteCarrier(String carrierId);

	void updateCarrier(CarrierDTO carrier, String carrierId);
}
