package persistence;

import javax.persistence.EntityNotFoundException;
import javax.persistence.EntityTransaction;
import javax.persistence.NoResultException;

import domain.CompanyOrder;

public class OrderDAOJpa extends GenericDAOJPA<CompanyOrder> implements OrderDAO {

	public OrderDAOJpa() {
		super(CompanyOrder.class);
	}

	public OrderDAOJpa(Class<CompanyOrder> type) {
		super(type);
	}

	@Override
	public CompanyOrder getOrderWithId(String id) {
		try {
			return em.createNamedQuery("Order.findOrderWithId", CompanyOrder.class).setParameter("orderId", id)
					.getSingleResult();
		} catch (NoResultException e) {
			throw new EntityNotFoundException();
		}
	}

	@Override
	public void updateById(String orderId, CompanyOrder order) {
		EntityTransaction tx = em.getTransaction();
		try {
			tx.begin();
			
			CompanyOrder updatedOrder = em.find(CompanyOrder.class, orderId);
			
			updatedOrder.setStatus(order.getStatus());
			
			updatedOrder.setCarrier(order.getCarrier());
			
			if (order.getTrackAndTrace() == null) {
				em.persist(order.getTrackAndTrace());
				updatedOrder.setTrackAndTrace(order.getTrackAndTrace());
			}
			
			em.merge(updatedOrder);
			tx.commit();
		} catch (Exception e) {
			if (tx != null && tx.isActive())
				tx.rollback();
			throw e;
		}
	}
}
