package persistence;

import java.util.List;

import javax.persistence.EntityNotFoundException;
import javax.persistence.NoResultException;

import domain.Company;
import domain.CompanyOrder;

public class CompanyDAOJpa extends GenericDAOJPA<Company> implements CompanyDAO{

	public CompanyDAOJpa() {
		super(Company.class);
	}

	@Override
	public List<CompanyOrder> findOrdersForCompany(String companyName) {
		try {
			return em.createNamedQuery("CompanyOrder.findOrdersForCompany", CompanyOrder.class)
					.setParameter("companyName", companyName)
					.getResultList();
        } catch (NoResultException ex) {
            throw new EntityNotFoundException();
        } 
	}
}
