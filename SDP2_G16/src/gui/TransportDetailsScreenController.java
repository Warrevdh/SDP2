package gui;

import java.io.IOException;

import domain.AdminController;
import domain.CarrierInterface;
import domain.Observer;
import dto.CarrierDTO;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;

public class TransportDetailsScreenController extends AnchorPane implements Observer{
	
	@FXML
	private TextField carrierNameField;
	@FXML
	private TextField contactPersonField;
	@FXML
	private TextField phoneNumberField;
	@FXML
	private TextField trackLengthField;
	@FXML
	private ChoiceBox<String> trackOnlyNumbersBox;
	@FXML
	private TextField trackPrefixField;
	@FXML
	private ChoiceBox<String> activeForDeliveryBox;
	
	@FXML
	private Button createCarrierBtn;
	@FXML
	private Button cancelBtn;
	@FXML
	private Button saveButton;
	@FXML
	private Button deleteCarrierBtn;
	@FXML
	private HBox buttonBox;
	
	private AdminController dc;
	
	private String currentCarrierId = "";
	
	public TransportDetailsScreenController(AdminController dc) {
		this.dc = dc;
		this.dc.addObserver(this);
		
		buildGui();
		initialize();
	}

	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("TransportDetailsScreen.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Transport Service details Screen");
			System.out.println(e.getMessage());
		}
	}
	
	private void initialize() {
		ObservableList<String> yesOrNoList = FXCollections.observableArrayList("Yes", "No");
		this.trackOnlyNumbersBox.setItems(yesOrNoList);
		this.activeForDeliveryBox.setItems(yesOrNoList);
        
        // Re-order the buttons
        buttonBox.getChildren().setAll(createCarrierBtn, cancelBtn);
		
        
    	createCarrierBtn.setOnAction(event -> {
			if (validateInput()) {
				boolean onlyNumbers = false;
				boolean active = false;
				
				if (this.trackOnlyNumbersBox.getSelectionModel().getSelectedItem().equals("Yes")) {
					System.out.println("test1");
					onlyNumbers = true;
				}
				if (this.activeForDeliveryBox.getSelectionModel().getSelectedItem().equals("Yes")) {
					System.out.println("test2");
					active = true;
				}
				
				CarrierDTO newCarrier = new CarrierDTO(
						carrierNameField.getText(),
						contactPersonField.getText(),
						phoneNumberField.getText(),
						Integer.parseInt(trackLengthField.getText()),
						onlyNumbers,
						trackPrefixField.getText(),
						active);
				
				dc.createCarrier(newCarrier);
				showInfoAlert("Carrier created successfully!", "Carrier created");
				
				clearAllFields();
				dc.setCurrentProcess(this.currentCarrierId, true);
			}
		});
    	
    	deleteCarrierBtn.setOnAction(event ->	{
    		dc.deleteCarrier(this.currentCarrierId);
			showInfoAlert("Transport service deleted successfully!", "Transport Service deleted");
			
			clearAllFields();

			dc.setCurrentProcess("", true);
		});
		
	    saveButton.setOnAction(event -> {
	        // Validate the user input before updating the user's details
	        if (validateInput()) {
	        	boolean onlyNumbers = false;
				boolean active = false;
				
				if (this.trackOnlyNumbersBox.getSelectionModel().getSelectedItem().equals("Yes")) {
					onlyNumbers = true;
				}
				if (this.activeForDeliveryBox.getSelectionModel().getSelectedItem().equals("Yes")) {
					active = true;
				}
				
				CarrierDTO updatedCarrier = new CarrierDTO(
						carrierNameField.getText(),
						contactPersonField.getText(),
						phoneNumberField.getText(),
						Integer.parseInt(trackLengthField.getText()),
						onlyNumbers,
						trackPrefixField.getText(),
						active);
	        	
	        	// Save the changes to the user's details in the database
				dc.updateCarrier(updatedCarrier, currentCarrierId);
	            
	            showInfoAlert("Carrier information succesfully updated!", "Carrier updated");
	            dc.setCurrentProcess(this.currentCarrierId, true);
	        }
	    });
    	
    	cancelBtn.setOnAction(event -> {
			clearAllFields();
		});
    	
	}
	
	public void loadCarrier(String carrierId) {
		CarrierInterface carrier = dc.getCarrierWithId(carrierId);
		
		this.currentCarrierId = carrier.getTransportServiceId();
		
		this.carrierNameField.setText(carrier.getName());
		this.contactPersonField.setText(carrier.getEmailContactPerson());
		this.phoneNumberField.setText(carrier.getPhoneNumberContactPerson());
		this.trackLengthField.setText(Integer.toString(carrier.getTrackLenght()));
		this.trackOnlyNumbersBox.getSelectionModel().select(carrier.isTrackOnlyNumbersText());
		this.trackPrefixField.setText(carrier.getTrackPrefix());
		this.activeForDeliveryBox.getSelectionModel().select(carrier.isActiveForDeliveryText());
		
    	
    	buttonBox.getChildren().clear();
    	buttonBox.getChildren().setAll(saveButton, deleteCarrierBtn, cancelBtn);
	}
	
	@Override
	public void update(String id, boolean changed) {
		if (!id.isEmpty() && !this.currentCarrierId.equals(id)) {
			loadCarrier(id);
		}
	}
	
	private void clearAllFields() {
		this.currentCarrierId = "";
		
		this.carrierNameField.clear();
		this.contactPersonField.clear();
		this.phoneNumberField.clear();
		this.trackLengthField.clear();
		this.trackOnlyNumbersBox.getSelectionModel().clearSelection();
		this.trackPrefixField.clear();
		this.activeForDeliveryBox.getSelectionModel().clearSelection();
		
		buttonBox.getChildren().clear();
		buttonBox.getChildren().setAll(createCarrierBtn, cancelBtn);
	}	
	
	private boolean validateInput() {
		if (carrierNameField.getText().isEmpty() || contactPersonField.getText().isEmpty() || phoneNumberField.getText().isEmpty() ||
				trackLengthField.getText().isEmpty() || trackPrefixField.getText().isEmpty()) {
	        showErrorAlert("Please enter information for all fields.");
	        return false;
	    }
	 
		// Validate email format
		String emailRegex = "^[\\w\\d._%+-]+@[\\w\\d.-]+\\.[a-zA-Z]{2,}$";
		if (!contactPersonField.getText().matches(emailRegex)) {
		    showErrorAlert("Please enter a valid email address.");
		    return false;
		}
		
		// Validate phone number format
		String phoneNumberRegex = "^\\d{9,10}$";
		if (!phoneNumberField.getText().matches(phoneNumberRegex)) {
		    showErrorAlert("Please enter a valid phone number.");
		    return false;
		}
		
		// If all validations pass, return true
		return true;
	
	}
	
	private void showErrorAlert(String message) {
	    Alert alert = new Alert(AlertType.ERROR);
	    alert.setTitle("Error");
	    alert.setHeaderText(null);
	    alert.setContentText(message);
	    alert.showAndWait();
	}
	
	private void showInfoAlert(String message, String title) {
	    Alert alert = new Alert(AlertType.INFORMATION);
	    alert.setTitle(title);
	    alert.setHeaderText(null);
	    alert.setContentText(message);
	    alert.showAndWait();
	}
}

