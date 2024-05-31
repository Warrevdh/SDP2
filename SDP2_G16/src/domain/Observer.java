package domain;

public interface Observer {
	void update(String id, boolean changed);
}
