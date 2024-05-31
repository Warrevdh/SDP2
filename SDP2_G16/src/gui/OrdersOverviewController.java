package gui;

import java.io.IOException;

import domain.UserController;
import javafx.fxml.FXMLLoader;
import javafx.scene.layout.GridPane;

public class OrdersOverviewController extends GridPane{
	
	private UserController dc;
	
	private OrdersScreenController orders;
	
	private OrderDetailsScreenController orderDetails;
	
	public OrdersOverviewController(UserController dc) {
		this.dc = dc;
		
		this.orders = new OrdersScreenController(dc);
		this.orderDetails = new OrderDetailsScreenController(dc);
		
		buildGui();
	}

	private void buildGui() {
		FXMLLoader loader = new FXMLLoader(this.getClass().getResource("OrdersOverview.fxml"));
		loader.setRoot(this);
		loader.setController(this);
		try {
			loader.load();
		} catch (IOException e) {
			System.out.println("Couldn't load Orders Screen");
			System.out.println(e.getMessage());
		}
		
		this.add(orders, 0, 1);
		this.add(orderDetails, 1, 1);
	}
}
