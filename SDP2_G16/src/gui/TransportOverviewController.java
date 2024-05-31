package gui;

import java.io.IOException;

import domain.AdminController;
import javafx.fxml.FXMLLoader;
import javafx.scene.layout.GridPane;

public class TransportOverviewController extends GridPane{
	
	private AdminController dc;
	
	private TransportScreenController carriers;
	
	private TransportDetailsScreenController carrierDetails;
	
	public TransportOverviewController(AdminController dc) {
		this.dc = dc;
		
		this.carriers = new TransportScreenController(dc);
		this.carrierDetails = new TransportDetailsScreenController(dc);
		
		buildGui();
	}
	
	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("TransportOverview.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Transport Services Overview Screen");
			System.out.println(e.getMessage());
		}
		
		this.add(carriers, 0, 1);
		this.add(carrierDetails, 1, 1);
	}
}
