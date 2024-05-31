package gui;

import java.io.IOException;
import java.util.UUID;

import org.mindrot.jbcrypt.BCrypt;

import domain.AdminController;
import domain.Observer;
import domain.UserInterface;
import dto.UserDTO;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;

public class UserDetailsScreenController extends AnchorPane implements Observer{
	
	@FXML
	private ComboBox<String> functionField;
	@FXML
	private Button saveButton;
	@FXML
	private Button cancelBtn;
	@FXML
	private Button createUserBtn;
	@FXML
	private Button deleteUserBtn;
	@FXML
	private HBox buttonBox;
	@FXML
	private TextField userIdField;
	@FXML
	private TextField firstnameField;
	@FXML
	private TextField lastnameField;
	@FXML
	private TextField emailField;
	@FXML
	private TextField phoneNumberField;
	@FXML
	private TextField mobileNumberField;
	@FXML
	private TextField countryField;
	@FXML
	private TextField cityField;
	@FXML
	private TextField postalcodeField;
	@FXML
	private TextField streetField;
	@FXML
	private TextField addressNrField;
	
	private AdminController dc;
	
	private String currentUserId = "";
	
	public UserDetailsScreenController(AdminController dc) {
		this.dc = dc;
		this.dc.addObserver(this);
		
		buildGui();
		initialize();
	}

	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("UserDetailsScreen.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Employee details Screen");
			System.out.println(e.getMessage());
		}
	}
	
	private void initialize() {
		// Populate the function field with the available roles
		functionField.getItems().addAll("Admin", "Employee", "Customer");
		
		this.userIdField.setDisable(true);
        
        // Re-order the buttons
        buttonBox.getChildren().setAll(createUserBtn, cancelBtn);
		
        
    	createUserBtn.setOnAction(event -> {
			String password = UUID.randomUUID().toString().substring(0,8);
			if (validateInput()) {
				UserDTO newUser = new UserDTO(
						firstnameField.getText(),
						lastnameField.getText(),
						emailField.getText().toLowerCase(),
						hashPassword(password),
						phoneNumberField.getText(),
						mobileNumberField.getText(),
						countryField.getText(),
						cityField.getText(),
						postalcodeField.getText(),
						streetField.getText(),
						Integer.parseInt(addressNrField.getText()),
						this.functionField.getValue());
						
				dc.createUser(newUser);
	            showInfoAlert("User created successfully! Password: " + password, "User created");
	            
	            clearAllFields();
	            
	            dc.setCurrentProcess(this.currentUserId, true);
			}
		});
    	
    	deleteUserBtn.setOnAction(event ->	{
			dc.deleteUser(this.currentUserId);
			showInfoAlert("User deleted successfully!", "User deleted");
			
			clearAllFields();

			dc.setCurrentProcess("", true);
		});
		
	    // Add a button to save the changes to the user's details
	    saveButton.setOnAction(event -> {
	        // Validate the user input before updating the user's details
	        if (validateInput()) {
	            // Update the user's details with the new values
	        	UserDTO updatedUser = new UserDTO(
						firstnameField.getText(),
						lastnameField.getText(),
						emailField.getText().toLowerCase(),
						phoneNumberField.getText(),
						mobileNumberField.getText(),
						countryField.getText(),
						cityField.getText(),
						postalcodeField.getText(),
						streetField.getText(),
						Integer.parseInt(addressNrField.getText()),
						this.functionField.getValue());
	        	
	            
	            // Save the changes to the user's details in the database
	            dc.updateUser(updatedUser, currentUserId);
	            
	            showInfoAlert("User information succesfully updated!", "User updated");
	            dc.setCurrentProcess(this.currentUserId, true);
	        }
	    });
    	
    	cancelBtn.setOnAction(event -> {
			clearAllFields();
		});
    	
	}
	
	public void loadUser(String userId) {
		UserInterface user = dc.getUser(userId);
		
		this.currentUserId = user.getUserId();
		
		this.userIdField.setText(user.getUserId());
		this.userIdField.setDisable(true);
		this.firstnameField.setText(user.getFirstname());
		this.firstnameField.setDisable(true);
		this.lastnameField.setText(user.getLastname());
		this.lastnameField.setDisable(true);
		this.cityField.setText(user.getCity());
		this.countryField.setText(user.getCountry());
		this.emailField.setText(user.getEmail());
		this.mobileNumberField.setText(user.getTelNumber());
		this.phoneNumberField.setText(user.getPhoneNumber());
		this.postalcodeField.setText(user.getPostalCode());
		this.streetField.setText(user.getStreet());
		this.addressNrField.setText(Integer.toString(user.getAddressNumber()));
	    
		this.functionField.setValue(user.getRoleName());
    	
    	if (this.currentUserId.equals(dc.getCurrentUserId())) {
    		buttonBox.getChildren().clear();
    		buttonBox.getChildren().setAll(saveButton, cancelBtn);
    	} else {
    		buttonBox.getChildren().clear();
    		buttonBox.getChildren().setAll(saveButton, deleteUserBtn, cancelBtn);
    	}
	}
	
	@Override
	public void update(String id, boolean changed) {
		if (!id.isEmpty() && !this.currentUserId.equals(id)) {
			loadUser(id);
		}
	}
	
	private void clearAllFields() {
		this.currentUserId = "";
		
		this.userIdField.clear();
		this.userIdField.setDisable(true);
		this.firstnameField.clear();
		this.firstnameField.setDisable(false);
		this.lastnameField.clear();
		this.lastnameField.setDisable(false);
		this.cityField.clear();
		this.countryField.clear();
		this.emailField.clear();
		this.mobileNumberField.clear();
		this.phoneNumberField.clear();
		this.postalcodeField.clear();
		this.streetField.clear();
		this.addressNrField.clear();
		this.functionField.getSelectionModel().clearSelection();
		
		buttonBox.getChildren().clear();
		buttonBox.getChildren().setAll(createUserBtn, cancelBtn);
	}
	
	private String hashPassword(String password) {
		String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(10));
		return hashedPassword;
	}

	
	
	private boolean validateInput() {
		if (cityField.getText().isEmpty() || countryField.getText().isEmpty() || emailField.getText().isEmpty() || mobileNumberField.getText().isEmpty()
	            || phoneNumberField.getText().isEmpty() || postalcodeField.getText().isEmpty() || streetField.getText().isEmpty() || addressNrField.getText().isEmpty()) {
	        showErrorAlert("Please enter information for all fields.");
	        return false;
	    }
	 
		// Validate email format
		String emailRegex = "^[\\w\\d._%+-]+@[\\w\\d.-]+\\.[a-zA-Z]{2,}$";
		if (!emailField.getText().matches(emailRegex)) {
		    showErrorAlert("Please enter a valid email address.");
		    return false;
		}
		
		// Validate mobile number format
		String mobileNumberRegex = "^\\d{10}$";
		if (!mobileNumberField.getText().matches(mobileNumberRegex)) {
		    showErrorAlert("Please enter a valid mobile number.");
		    return false;
		}
		
		// Validate phone number format
		String phoneNumberRegex = "^\\d{9,10}$";
		if (!phoneNumberField.getText().matches(phoneNumberRegex)) {
		    showErrorAlert("Please enter a valid phone number.");
		    return false;
		}
		
		// Validate postal code format
		try {
		    int postalCode = Integer.parseInt(postalcodeField.getText());
		    if (postalCode < 1000 || postalCode > 9999) {
		    	showErrorAlert("Postal code should be between 1000 and 9999.");
	            return false;
		    }
		} catch (NumberFormatException e) {
		    showErrorAlert("Please enter a valid integer for the postal code number.");
		    return false;
		}
		
		try {
		    int addressNumber = Integer.parseInt(addressNrField.getText());
		    if (addressNumber <= 0 || addressNumber >= 1000) {
		        showErrorAlert("Please enter a valid address number between 1 and 999.");
		        return false;
		    }
		} catch (NumberFormatException e) {
		    showErrorAlert("Please enter a valid integer for the address number.");
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

