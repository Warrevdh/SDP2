package persistence;

import domain.CompanyOrder;

public interface OrderDAO extends GenericDAO<CompanyOrder> {
	CompanyOrder getOrderWithId(String id);
	
	void updateById(String orderId, CompanyOrder updatedOrder);
}
