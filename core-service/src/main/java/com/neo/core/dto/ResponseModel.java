package com.neo.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseModel {

	protected String requestIdentifier;
	protected String errorMessages;
	protected String code;
	protected String statusCode;
	protected String messages;
	protected Integer currentPage;
	protected Integer totalRecord;
	protected Integer totalPage;
//	@JsonProperty("data")
	protected Object content;
}
