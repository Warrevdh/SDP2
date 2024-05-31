package persistence;

import java.util.List;

import domain.Company;
import domain.CompanyOrder;

public interface CompanyDAO extends GenericDAO<Company> {
	List<CompanyOrder> findOrdersForCompany(String companyName);
}
