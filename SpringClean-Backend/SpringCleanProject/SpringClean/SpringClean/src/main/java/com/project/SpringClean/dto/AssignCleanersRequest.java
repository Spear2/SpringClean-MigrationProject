package com.project.SpringClean.dto;

import java.util.List;

public class AssignCleanersRequest {
    private List<Long> cleanerIds;

    public List<Long> getCleanerIds() {
        return cleanerIds;
    }

    public void setCleanerIds(List<Long> cleanerIds) {
        this.cleanerIds = cleanerIds;
    }
    
}
