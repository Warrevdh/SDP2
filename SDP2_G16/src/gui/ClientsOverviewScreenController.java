package gui;

import java.io.IOException;

import domain.UserController;
import javafx.fxml.FXMLLoader;

import javafx.scene.layout.GridPane;

public class ClientsOverviewScreenController extends GridPane {
	
	private UserController dc;
	
	private ClientsScreenController clients;
	
	private UserDetailsScreenController clientDetails;
	
	public ClientsOverviewScreenController(UserController dc) {
		this.dc = dc;

		
		this.clients = new ClientsScreenController(dc);
//		this.clientDetails = new UserDetailsScreenController(dc);
		
		buildGui();
	}
	
	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("ClientsOverview.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Clients Screen");
			System.out.println(e.getMessage());
		}
		
		this.add(clients, 0, 1);
		//this.add(clientDetails, 1, 1);
	}
}