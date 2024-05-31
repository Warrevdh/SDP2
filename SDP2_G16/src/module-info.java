open module SDP2G16 {
	//FX
	requires javafx.base;
	requires javafx.controls;
	requires javafx.graphics;
	requires javafx.fxml;
	//Persistence
	requires java.sql;
	requires java.instrument;
	requires java.persistence;
	//Unit tests
	requires org.junit.jupiter.api;
	
	requires jbcrypt;
	
//	requires org.mockito.junit.jupiter;
//	requires org.mockito;
}