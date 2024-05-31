package gui;

import java.io.IOException;

import domain.DomainController;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Label;
import javafx.scene.layout.GridPane;

public class WelcomeScreenController extends GridPane{
	private DomainController dc;
	
	@FXML
	private Label welcomeLabel;
	
	public WelcomeScreenController(DomainController dc) {
		this.dc = dc;
		buildGui();
	}

	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("WelcomeScreen.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Welcome");
			System.out.println(e.getMessage());
		}
		
		this.welcomeLabel.setText(
				"Welcome to the B2B Portal of " + dc.getCurrentCompanyName() + "!\n" +
						"Please use the buttons on the menu\non the left to navigate");
	}

}
