package gui;

import java.io.IOException;
import java.util.Date;

import domain.Observer;
import domain.Order;
import domain.UserController;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

public class OrdersScreenController extends TableView<Order> implements Observer{

	private UserController dc;
	
	@FXML
	private TableColumn<Order, String> orderIdCol;
	@FXML
	private TableColumn<Order, String> customerNameCol;
	@FXML
	private TableColumn<Order, Date> orderDateCol;
	@FXML
	private TableColumn<Order, String> statusCol;	
	
	public OrdersScreenController(UserController dc) {
		this.dc = dc;
		this.dc.addObserver(this);
		buildGui();
		loadOrders();
	}

	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("OrdersScreen.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Orders Screen");
			System.out.println(e.getMessage());
		}
	}
	
	private void loadOrders() {
		// set cell value factories for each column
		orderIdCol.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getOrderId()));
		customerNameCol.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getCustomerName()));
		customerNameCol.setCellValueFactory(cellData -> new SimpleStringProperty("customer"));
		orderDateCol.setCellValueFactory(new PropertyValueFactory<>("orderDate"));
		statusCol.setCellValueFactory(new PropertyValueFactory<>("status"));

        // load all orders and add them to the table view
		ObservableList<Order> allOrders = FXCollections.observableArrayList();
		for (Order o : dc.getAllOrders()) {
			allOrders.add(o);
		}
		this.setItems(allOrders);
        
        this.setOnMouseClicked(event -> {
            if (event.getClickCount() == 1) {
                Order selectedOrder = this.getSelectionModel().getSelectedItem();
                if (selectedOrder != null) {
                    dc.setCurrentProcess(selectedOrder.getOrderId(), false);
                }
            }
        });
	}

	@Override
	public void update(String id, boolean changed) {
		if (changed) {
			this.getItems().clear();
			
			ObservableList<Order> allOrders = FXCollections.observableArrayList();
			for (Order o : dc.getAllOrders()) {
				allOrders.add(o);
			}
			this.setItems(allOrders);
		}
	}
}
