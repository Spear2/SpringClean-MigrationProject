package com.project.SpringClean.serviceinterface;

import com.project.SpringClean.model.Customer;

public interface CustomerServiceInt {
    Customer getCustomerById(Long id);
    Customer registerCustomer(Customer Customer);
    Customer login(String email, String password);
}
