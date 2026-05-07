package com.project.SpringClean.serviceinterface;

import com.project.SpringClean.dto.CleanerRegistration;
import com.project.SpringClean.model.Cleaner;
import com.project.SpringClean.model.CompanyCleaner;

public interface CleanerServiceInt {
    Cleaner registerCleaner(CleanerRegistration dto);
    Cleaner getCleanerById(Long id);
}
