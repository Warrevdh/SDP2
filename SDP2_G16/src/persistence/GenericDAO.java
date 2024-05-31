package persistence;

import java.util.List;

public interface GenericDAO<T> {
	public List<T> findAll();
	
	public T get(String id);
	
	public T update(T object);
	
	public void insert(T object);
	
	public void delete(T object);
	
	public boolean exists(String id);	
}
