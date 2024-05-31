package gui;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import domain.AdminController;
import domain.DomainController;
import domain.UserController;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;

import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class DesktopScreenController extends BorderPane{
	
	private DomainController dc;

	
	@FXML
	private Label headerTitle;
	@FXML
	private VBox navbar;
	@FXML
	private AnchorPane mainScreen;
	@FXML
	private Pane header;
	@FXML
	private Pane footer;
	@FXML
	private Label usernameLabel;
	@FXML
	private List<Button> navbarButtons;
	
	@FXML
	private Button logOutButton;

	
	public DesktopScreenController(DomainController dc) {
		this.dc = dc;
		this.navbarButtons = new ArrayList<>();
		buildGui();
		
		WelcomeScreenController welcome = new WelcomeScreenController(dc);
		this.mainScreen.getChildren().clear();
		this.mainScreen.getChildren().add(welcome);
	}


	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("DesktopScreen.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Application Screen");
			System.out.println(e.getMessage());
		}
		
		this.headerTitle.setText(this.dc.getCurrentCompanyName() + " B2B PORTAL");
		this.usernameLabel.setText(this.dc.getCurrentUser().getFirstname() + " " + this.dc.getCurrentUser().getLastname());
		this.logOutButton.setOnMouseClicked(e -> logOut());
		
		if(dc.isAdmin()) {
			buildNavbarAdmin();
		} else if (dc.isEmployee()) {
			buildNavbarEmployee();
		}
		
		navbar.getChildren().addAll(navbarButtons);
	}
	
	private void buildNavbarAdmin() {
		Button employeesButton = new Button("Employees");
		employeesButton.getStyleClass().add("navbar-button");
		employeesButton.setOnMouseClicked(e -> {
			this.dc.clearObservers();
			UsersOverviewScreenController employeeScreen = new UsersOverviewScreenController((AdminController) dc);
			this.mainScreen.getChildren().clear();
			this.mainScreen.getChildren().add(employeeScreen);
		});
		this.navbarButtons.add(employeesButton);
		
		Button carriersButton = new Button("Transport Services");
		carriersButton.getStyleClass().add("navbar-button");
		carriersButton.setOnMouseClicked(e -> {
			this.dc.clearObservers();
			TransportOverviewController carriersScreen = new TransportOverviewController((AdminController) dc);
			this.mainScreen.getChildren().clear();
			this.mainScreen.getChildren().add(carriersScreen);
		});
		this.navbarButtons.add(carriersButton);
		
		Button packages = new Button("Packages");
		packages.getStyleClass().add("navbar-button");
		this.navbarButtons.add(packages);
	}
	
	private void buildNavbarEmployee() {
		Button clientsButton = new Button("Clients");
		clientsButton.getStyleClass().add("navbar-button");
		clientsButton.setOnMouseClicked(e -> {
			this.dc.clearObservers();
			ClientsOverviewScreenController client = new ClientsOverviewScreenController((UserController) dc);
			this.mainScreen.getChildren().clear();
			this.mainScreen.getChildren().add(client);
		});
		this.navbarButtons.add(clientsButton);
		
		Button ordersButton = new Button("Orders");
		ordersButton.getStyleClass().add("navbar-button");
		ordersButton.setOnMouseClicked(e -> {
			this.dc.clearObservers();
			OrdersOverviewController ordersScreen = new OrdersOverviewController((UserController) dc);
			this.mainScreen.getChildren().clear();
			this.mainScreen.getChildren().add(ordersScreen);
		});
		this.navbarButtons.add(ordersButton);
	}
	
	private void logOut() {
		this.dc.logOut();
		this.dc = new UserController();
		
		LoginScreenController login = new LoginScreenController(dc);
		Stage stage = new Stage();
		stage.setScene(new Scene(login));
		stage.setFullScreen(false);			
		stage.show();
		getScene().getWindow().hide();
	}
}
