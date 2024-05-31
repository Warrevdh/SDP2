package domain;

import java.io.Serializable;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "Track_Trace")
@NamedQueries({
		@NamedQuery(name = "Track_Trace.findTrackTraceWithId", query = "SELECT t FROM Track_Trace t WHERE t.trackTraceId = :trackTraceId") })
public class Track_Trace implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	private String trackTraceId;
	private String transportServiceId;
	private String verificationCode;
	private String trackTraceCode;

	protected Track_Trace() {
	}

	public Track_Trace(String trackTraceCode, String verificationCode, String transportServiceId) {
		this.trackTraceId = UUID.randomUUID().toString();
		this.trackTraceCode = trackTraceCode;
		this.transportServiceId = transportServiceId;
		this.verificationCode = verificationCode;
	}

	public String getTrackTraceId() {
		return trackTraceId;
	}

	public String getTransportServiceId() {
		return transportServiceId;
	}

	public String getVerificationCode() {
		return verificationCode;
	}

	public void setTrackTraceId(String trackTraceId) {
		this.trackTraceId = trackTraceId;
	}

	private void setTransportServiceId(String transportServiceId) {
		this.transportServiceId = transportServiceId;
	}

	public String getTrackTraceCode() {
		return trackTraceCode;
	}
}
