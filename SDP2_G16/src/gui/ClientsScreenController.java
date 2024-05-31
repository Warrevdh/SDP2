package gui;

import java.io.IOException;
import java.util.*;

import domain.CompanyInterface;
import domain.UserController;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;

public class ClientsScreenController extends TableView<CompanyInterface>{

	private UserController dc;
	
	@FXML
	private TableColumn<CompanyInterface, String> companyCol;
	@FXML
	private TableColumn<CompanyInterface, String> ordersCol;
	@FXML
	private TableView<CompanyInterface> tableviewClients;
	
	public ClientsScreenController(UserController dc) {
		this.dc = dc;
		buildGui();
		loadClients();
	}

	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("ClientsScreen.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Clients Table");
			System.out.println(e.getMessage());
		}
	}
	
	private void loadClients() {
		tableviewClients.getItems().clear();
        
        Set<CompanyInterface> customers = dc.getAllCustomers();
        ObservableList<CompanyInterface> clientList = FXCollections.observableArrayList();
        
        clientList.addAll(customers);
        
        tableviewClients.setItems(clientList);
        companyCol.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getCompanyName()));
        ordersCol.setCellValueFactory(cellData ->
        		new SimpleStringProperty(String.valueOf(
        				dc.getTotalAmountOfOrdersFromCustomer(cellData.getValue().getCompanyId()))));
        		
		this.setOnMouseClicked(event -> {
            if (event.getClickCount() == 1) {
                CompanyInterface selectedClient = this.getSelectionModel().getSelectedItem();
                if (selectedClient != null) {
                    dc.setCurrentProcess(selectedClient.getCompanyId(), false);
                }
            }
        });
	}
}
