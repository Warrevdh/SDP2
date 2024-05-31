package gui;

import java.io.IOException;

import domain.AdminController;
import domain.Observer;
import domain.UserInterface;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

public class UsersScreenController extends TableView<UserInterface> implements Observer{

	private AdminController dc;
	
	@FXML
	private TableColumn<UserInterface, String> firstNameCol;
	@FXML
	private TableColumn<UserInterface, String> lastNameCol;
	@FXML
	private TableColumn<UserInterface, String> functionCol;
	
	public UsersScreenController( AdminController dc) {
		this.dc = dc;
		this.dc.addObserver(this);
		buildGui();
		loadUsers();
	}

	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("UsersScreen.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Employees Table");
			System.out.println(e.getMessage());
		}
	}
	
	private void loadUsers() {
		firstNameCol.setCellValueFactory(new PropertyValueFactory<>("firstname"));
		lastNameCol.setCellValueFactory(new PropertyValueFactory<>("lastname"));
		functionCol.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getRoleName()));
		
		ObservableList<UserInterface> allUsers = FXCollections.observableArrayList();
		for (UserInterface u : dc.getAllEmployees()) {
			allUsers.add(u);
		}
		this.setItems(allUsers);
		
		this.setOnMouseClicked(event -> {
            if (event.getClickCount() == 1) {
                UserInterface selectedEmployee = this.getSelectionModel().getSelectedItem();
                if (selectedEmployee != null) {
                    dc.setCurrentProcess(selectedEmployee.getUserId(), false);
                }
            }
        });
	}
	
	@Override
	public void update(String id, boolean changed) {
		if (changed) {
			this.getItems().clear();
			
			ObservableList<UserInterface> allUsers = FXCollections.observableArrayList();
			for (UserInterface u : dc.getAllEmployees()) {
				allUsers.add(u);
			}
			this.setItems(allUsers);
		}
	}
}
