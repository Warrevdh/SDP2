package gui;

import java.io.IOException;

import domain.AdminController;
import domain.DomainController;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;
import javafx.stage.Stage;

public class LoginScreenController extends GridPane{
	
	private DomainController dc;
	
	@FXML
	private TextField email;
	@FXML
	private Label login_email_error;
	@FXML
	private TextField password;
	@FXML
	private Label login_ww_error;
	
	@FXML
	private Button signInButton;
	@FXML
	private Label errorLabel;


	public LoginScreenController(DomainController dc) {
		this.dc = dc;
		buildGui();
	}

	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("LoginScreen.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Login Screen");
			System.out.println(e.getMessage());
		}
	}

	
	@FXML
	private void signIn() {
		String email_input = email.getText();
		String password_input = password.getText();
		
		login_email_error.setVisible(false);
		login_ww_error.setVisible(false);
		if (email_input.isEmpty()) {
			login_email_error.setText("Email is required!");
			login_email_error.setVisible(true);
		}
		if (password_input.isEmpty()) {
			login_ww_error.setText("Password is required!");
			login_ww_error.setVisible(true);
		} 
		
		if (!email_input.isEmpty() && !password_input.isEmpty()) {
			try {
				dc.logIn(email_input, password_input);
			} catch (Exception e) {
				errorLabel.setText(e.getMessage());
		        errorLabel.setVisible(true);
			}
		}
		
		if (dc.isLoggedIn()) {
			if (dc.isAdmin()) {
				this.dc = new AdminController(dc.getCurrentUser(), dc.getCurrentCompany());
			}
			
			DesktopScreenController mainApp = new DesktopScreenController(this.dc);
			Stage stage = new Stage();
			stage.setScene(new Scene(mainApp));
			stage.setFullScreen(true);			
			stage.show();
			getScene().getWindow().hide();
		}
	}
}
