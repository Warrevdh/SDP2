package persistence;

import java.util.List;

import javax.persistence.EntityNotFoundException;
import javax.persistence.EntityTransaction;
import javax.persistence.NoResultException;

import domain.User;

public class UserDAOJpa extends GenericDAOJPA<User> implements UserDAO{

	public UserDAOJpa() {
		super(User.class);
	}
	
	@Override
	public void deleteUser(String userId) {
		EntityTransaction et = em.getTransaction();
		
		User user = em.find(User.class, userId);
		try {
            et.begin();
            em.remove(user);
            et.commit();
        } catch (Exception e) {
            if (et != null && et.isActive()) {
                et.rollback();
            }
            throw new RuntimeException("Failed to delete user: " + e.getMessage(), e);
        }
	}
	
	@Override
	public void createUser(User user) {
		EntityTransaction et = em.getTransaction();
		
		try {
            et.begin();
            em.persist(user);
            et.commit();
        } catch (Exception e) {
            if (et != null && et.isActive()) {
                et.rollback();
            }
            throw e;
        }
	}
	
	@Override
	public User getUserWithEmail(String email) {
		try {
			return em.createNamedQuery("User.findUserWithEmail", User.class)
					.setParameter("userEmail", email)
					.getSingleResult();
        } catch (NoResultException ex) {
            throw new EntityNotFoundException();
        } 
	}
	
	public User findById(String id) {
        User user = null;
        try {
            user = em.find(User.class, id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return user;
    }
	
	@Override
	public void updateById(String id, User user) {
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            
            User updatedUser = em.find(User.class, id);
            
            updatedUser.setCity(user.getCity());
            updatedUser.setCountry(user.getCountry());
            updatedUser.setEmail(user.getEmail());
            updatedUser.setTelNumber(user.getTelNumber());
            updatedUser.setPhoneNumber(user.getPhoneNumber());
            updatedUser.setPostalCode(user.getPostalCode());
            updatedUser.setStreet(user.getStreet());
            updatedUser.setAddressNumber(user.getAddressNumber());
            updatedUser.setRole(user.getRole());
            
            em.merge(updatedUser);
            tx.commit();
            
            System.out.println("User updated: " + updatedUser);
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            e.printStackTrace();
        }
    }

	@Override
	public List<User> getAllAdminAndEmployeesFromCompany(String companyId) {
		try {
			return em.createNamedQuery("User.findAllAdminAndEmployeesFromCompany", User.class)
					.setParameter("companyID", companyId)
					.getResultList();
        } catch (NoResultException ex) {
            throw new EntityNotFoundException();
        } 
	}
}
