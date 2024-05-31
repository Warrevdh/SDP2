package gui;

import java.io.IOException;

import domain.AdminController;
import domain.CarrierInterface;
import domain.Observer;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

public class TransportScreenController extends TableView<CarrierInterface> implements Observer{

	private AdminController dc;
	
	@FXML
	private TableColumn<CarrierInterface, String> transportServiceIdCol;
	@FXML
	private TableColumn<CarrierInterface, String> transportNameCol;
	@FXML
	private TableColumn<CarrierInterface, String> activeForDeliveryCol;
	
	public TransportScreenController( AdminController dc) {
		this.dc = dc;
		this.dc.addObserver(this);
		buildGui();
		loadCarriers();
	}

	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("TransportScreen.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Transport Services Table");
			System.out.println(e.getMessage());
		}
	}
	
	private void loadCarriers() {
		this.transportServiceIdCol.setCellValueFactory(new PropertyValueFactory<>("transportServiceId"));
		this.transportNameCol.setCellValueFactory(new PropertyValueFactory<>("name"));
		this.activeForDeliveryCol.setCellValueFactory(
				cellData -> new SimpleStringProperty(cellData.getValue().isActiveForDeliveryText()));
		
		
		ObservableList<CarrierInterface> allCarriers = FXCollections.observableArrayList();
		for (CarrierInterface c : dc.getAllCarriers()) {
			allCarriers.add(c);
		}
		this.setItems(allCarriers);
		
		this.setOnMouseClicked(event -> {
            if (event.getClickCount() == 1) {
                CarrierInterface selectedCarrier = this.getSelectionModel().getSelectedItem();
                if (selectedCarrier != null) {
                    dc.setCurrentProcess(selectedCarrier.getTransportServiceId(), false);
                }
            }
        });
	}
	
	@Override
	public void update(String id, boolean changed) {
		if (changed) {
			this.getItems().clear();
			
			ObservableList<CarrierInterface> allCarriers = FXCollections.observableArrayList();
			for (CarrierInterface c : dc.getAllCarriers()) {
				allCarriers.add(c);
			}
			this.setItems(allCarriers);
		}
	}
}
