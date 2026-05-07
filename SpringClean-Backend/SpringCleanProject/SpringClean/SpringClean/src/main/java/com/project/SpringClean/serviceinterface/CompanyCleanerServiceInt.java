package com.project.SpringClean.serviceinterface;



import com.project.SpringClean.model.CompanyCleaner;

public interface CompanyCleanerServiceInt {
    CompanyCleaner getCompanyCleanerById(Long id);
    CompanyCleaner registerCompanyCleaner(CompanyCleaner cleaner);
    CompanyCleaner login(String email, String password);

}
