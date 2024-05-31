package domain;

import java.util.List;
import java.util.Set;

import dto.OrderDTO;
import persistence.GenericDAO;
import persistence.GenericDAOJPA;
import persistence.OrderDAO;
import persistence.OrderDAOJpa;

public class UserController extends DomainController{
	private OrderDAO orderDAO;
	
//	private GenericDAO<Track_Trace> trackTraceDAO;
	
	// Constructor for start application
	public UserController() {
		super();
	}
	
	public List<Order> getAllOrders() {
		return (List<Order>) (Object) getCurrentCompany().getOrders();
	}
	
	public Order getOrder(String id) {
		return getCurrentCompany().getOrder(id);
	}
	
	public String getTotalAmountOrdersForCompany(String companyName) {
		int totalOrders = 0;
		for (Order o : getAllOrders()) {
			if (o.getCompanyName() == companyName) totalOrders++;
		}
		return String.valueOf(totalOrders);
	}
	
	public void updateOrder(OrderDTO orderDTO, String orderId) {
		if (this.orderDAO == null) {
			this.orderDAO = new OrderDAOJpa();
		}
		
		CompanyOrder updatedOrder = (CompanyOrder) getOrder(orderId);
		
		Track_Trace trackTrace = new Track_Trace(
				orderDTO.trackAndTrace(),
				orderDTO.verification(),
				orderDTO.carrierId());
		
//		try {
//			GenericDAOJPA.startTransaction();
//			trackTraceDAO.insert(trackTrace);
//			GenericDAOJPA.commitTransaction();
//		} catch (Exception e) {
//			e.printStackTrace();
//		} finally {
//			System.out.println("SUCCESFULL");
//		}
		
		updatedOrder.setStatus(orderDTO.status());
		updatedOrder.setTrackAndTrace(trackTrace);
		updatedOrder.setCarrier(getCarrierWithId(orderDTO.carrierId()));
		
		orderDAO.updateById(orderId, updatedOrder);
	}
	
	public List<OrderItemInterface> getOrderItems(String orderId){
		Order order = this.getOrder(orderId);
		return order.getOrderItems();
	}

	public void reloadOrders() {
		List<CompanyOrder> orders = this.orderDAO.findAll();
		getCurrentCompany().setOrders(orders);
	}
	
	public Set<CompanyInterface> getAllCustomers() {
        Company comp = getCurrentCompany();
        
        return (Set<CompanyInterface>) (Object) comp.getAllCustomers();
    }
    
    public int getTotalAmountOfOrdersFromCustomer(String id) {
        Company comp = getCurrentCompany();
        
        return comp.getAmountOfOrdersFromCustomer(id);
    }
}
