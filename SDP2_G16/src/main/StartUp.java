package main;

import java.io.IOException;

import domain.DomainController;
import domain.UserController;
import gui.LoginScreenController;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class StartUp extends Application {

	public static void main(String[] args) throws Exception {
		launch(args);
	}
	
	@Override
	public void start(Stage stage) throws IOException {
		DomainController dc = new UserController();
		
		LoginScreenController root = new LoginScreenController(dc);
		Scene scene = new Scene(root);
		stage.setScene(scene);
		stage.setTitle("SDP2_G16");
		stage.show();
	}
}
