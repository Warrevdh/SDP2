package gui;

import java.io.IOException;
import java.util.Random;

import domain.CarrierInterface;
import domain.Observer;
import domain.Order;
import domain.OrderItemInterface;
import domain.UserController;
import dto.OrderDTO;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.AnchorPane;

public class OrderDetailsScreenController extends AnchorPane implements Observer{
	
	@FXML
	private TextField textField_OrderId;
	@FXML
	private TextField textField_Client;
	@FXML
	private TextField textField_OrderDate;
	@FXML
	private TextField textField_Status;
	@FXML
	private TextField textField_Packaging;
	@FXML
	private TextField textField_Price;
	@FXML
	private TextField textField_Country;
	@FXML
	private TextField textField_City;
	@FXML
	private TextField textField_PostalCode;
	@FXML
	private TextField textField_Street;
	@FXML
	private TextField textField_Number;
	@FXML
	private ComboBox<String> comboBox_Transporter;
	@FXML
	private TextField textField_TrackTrace;
	@FXML
	private Button button_Generate;
	@FXML
	private Button saveButton;
	@FXML
	private ComboBox<String> comboBox_Verification;
	@FXML
	private TableView<OrderItemInterface> tableView_ProductList;
	@FXML
	private TableColumn<OrderItemInterface, String> prodNameCol;
	@FXML
	private TableColumn<OrderItemInterface, String> quantityCol;
	@FXML
	private TableColumn<OrderItemInterface, String> priceCol;

	private UserController dc;

	private String currentOrderId = "";

	public OrderDetailsScreenController(UserController dc) {
		this.dc = dc;
		this.dc.addObserver(this);
		
		buildGui();
		initialize();
	}

	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("OrderDetailsScreen.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Orderdetail Screen");
			System.out.println(e.getMessage());
		}
	}
	
	private void initialize() {
		button_Generate.setOnMouseClicked(event -> {
			generateTrackAndTrace();
		});

		saveButton.setOnMouseClicked(event -> {
			saveOrder();
		});
	}

	public void loadOrder(String orderId) {
		Order currentOrder = dc.getOrder(orderId);
		
		this.currentOrderId = currentOrder.getOrderId();
		
		ObservableList<String> carrierList = FXCollections.observableArrayList();
		for (CarrierInterface c : dc.getAllCarriers())
			if (c.isActiveForDelivery())
				carrierList.add(c.getName());
		
		
		ObservableList<String> verificationOptions = FXCollections.observableArrayList();
		verificationOptions.add("orderid");
		verificationOptions.add("postcode");
		
		
		ObservableList<OrderItemInterface> orderItemList = FXCollections.observableArrayList();
		for (OrderItemInterface o : currentOrder.getOrderItems()) {
			orderItemList.add(o);
		}
		
		this.textField_OrderId.setText(currentOrder.getOrderId());
		this.textField_Client.setText("client");
		this.textField_OrderDate.setText(currentOrder.getOrderDate().toString());
		this.textField_Status.setText(currentOrder.getStatus());
		this.textField_Packaging.setText(currentOrder.getPackagingName());
		this.textField_Price.setText("price");
		this.textField_Country.setText(currentOrder.getDeliveryCountry());
		this.textField_City.setText(currentOrder.getDeliveryCity());
		this.textField_PostalCode.setText(currentOrder.getDeliveryPostalCode());
		this.textField_Street.setText(currentOrder.getDeliveryStreet());
		this.textField_Number.setText(currentOrder.getDeliveryAddressNumber());
		this.comboBox_Transporter.setItems(carrierList);
		this.comboBox_Verification.setItems(verificationOptions);
		
		this.comboBox_Transporter.setDisable(false);
		this.textField_TrackTrace.setDisable(false);
		this.comboBox_Verification.setDisable(false);
		this.button_Generate.setDisable(false);
		this.textField_TrackTrace.setText("");

		if (currentOrder.hasCarrier() && currentOrder.getCarrierName() != null) {
			this.comboBox_Transporter.setValue(currentOrder.getCarrierName());
			this.comboBox_Transporter.setDisable(true);
		}

		if (currentOrder.hasTrackAndTrace()) {
			this.textField_TrackTrace.setText(currentOrder.getTrackTraceCode());
			this.comboBox_Verification.setValue(currentOrder.getVerificationCode());
			this.textField_TrackTrace.setDisable(true);
			this.comboBox_Verification.setDisable(true);
			this.button_Generate.setDisable(true);
		}
		
		loadProducts();
	}
	
	private void loadProducts() {
		this.tableView_ProductList.getItems().clear();
		
		prodNameCol.setCellValueFactory(cellData -> new SimpleStringProperty(cellData.getValue().getProductName()));
		quantityCol.setCellValueFactory(new PropertyValueFactory<>("Quantity"));
		priceCol.setCellValueFactory(cellData -> new SimpleStringProperty("\u20ac" + cellData.getValue().getPrice()));

		ObservableList<OrderItemInterface> orderItems = FXCollections.observableArrayList();
		for (OrderItemInterface oi : dc.getOrderItems(currentOrderId)) {
			orderItems.add(oi);
		}
		this.tableView_ProductList.setItems(orderItems);
	}

	private void generateTrackAndTrace() {
		if (comboBox_Transporter.getValue() == null)
			return;
		
		for (CarrierInterface c : dc.getAllCarriers()) {
			if (c.isActiveForDelivery() && comboBox_Transporter.getValue().equals(c.getName())) {
				int randomTrackLength = c.getTrackLenght() - c.getTrackPrefix().length();

				String chars;
				if (c.isTrackOnlyNumbers())
					chars = "0123456789";
				else
					chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				
				
				// MISSCHIEN DIT LATEN GENEREREN IN DOMEIN ZELF???????
				// create a random object
				Random random = new Random();

				// generate a random string
				StringBuilder sb = new StringBuilder(randomTrackLength);
				sb.append(c.getTrackPrefix());
				for (int i = 0; i < randomTrackLength; i++) {
					int index = random.nextInt(chars.length());
					char randomChar = chars.charAt(index);
					sb.append(randomChar);
				}
				String randomString = sb.toString();
				textField_TrackTrace.setText(randomString);
			}
		}
	}

	private void saveOrder() {
		
		if (comboBox_Transporter.getValue() == null || comboBox_Verification.getValue() == null
				|| textField_TrackTrace.getText() == null) {
			showErrorAlert("Please fill in all fields!");
			return;
		}
		for (CarrierInterface c : dc.getAllCarriers()) {
			if (comboBox_Transporter.getValue().equals(c.getName())) {
				OrderDTO updatedOrder = new OrderDTO(
						this.textField_TrackTrace.getText(),
						this.comboBox_Verification.getValue(),
						c.getTransportServiceId(),
						"Processed");
						
				dc.updateOrder(updatedOrder, currentOrderId);
				
				Alert alert = new Alert(AlertType.INFORMATION);
				alert.setTitle("Order updated");
				alert.setHeaderText(null);
				alert.setContentText("Order information was succesfully updated!");
				alert.showAndWait();
				
				dc.setCurrentProcess(this.currentOrderId, true);
			}
		}
	}

	@Override
	public void update(String id, boolean changed) {
		if (!id.isEmpty() && !this.currentOrderId.equals(id)) {
			loadOrder(id);
		}
	}
	
	private void showErrorAlert(String message) {
	    Alert alert = new Alert(AlertType.ERROR);
	    alert.setTitle("Error");
	    alert.setHeaderText(null);
	    alert.setContentText(message);
	    alert.showAndWait();
	}
}
