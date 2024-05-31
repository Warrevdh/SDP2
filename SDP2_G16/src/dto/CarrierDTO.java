package dto;

public record CarrierDTO(String name, String email, String phoneNumber, int trackLength,
		boolean trackOnlyNumbers, String trackPrefix, boolean activeForDelivery) {
}
