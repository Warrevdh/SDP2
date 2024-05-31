package gui;

import java.io.IOException;

import domain.AdminController;
import javafx.fxml.FXMLLoader;

import javafx.scene.layout.GridPane;

public class UsersOverviewScreenController extends GridPane {
	
	private AdminController dc;
	
	private UsersScreenController employees;
	
	private UserDetailsScreenController employeeDetails;
	
	public UsersOverviewScreenController(AdminController dc) {
		this.dc = dc;
		
		this.employees = new UsersScreenController(dc);
		this.employeeDetails = new UserDetailsScreenController(dc);
		
		buildGui();
	}
	
	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("UsersOverview.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Employees Screen");
			System.out.println(e.getMessage());
		}
		
		this.add(employees, 0, 1);
		this.add(employeeDetails, 1, 1);
	}
}