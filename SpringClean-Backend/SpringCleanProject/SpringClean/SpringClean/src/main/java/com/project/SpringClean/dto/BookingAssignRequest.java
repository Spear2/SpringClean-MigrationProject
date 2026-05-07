package com.project.SpringClean.dto;


import lombok.Data;
import java.util.List;

@Data
public class BookingAssignRequest {
    private List<Long> cleanerIds;
}
