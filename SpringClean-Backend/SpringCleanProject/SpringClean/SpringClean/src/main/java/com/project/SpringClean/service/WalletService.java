package com.project.SpringClean.service;

import com.project.SpringClean.model.Customer;
import com.project.SpringClean.model.Wallet;
import com.project.SpringClean.repository.CustomerRepository;
import com.project.SpringClean.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepo;
    @Autowired
    private CustomerRepository customerRepo;

    private Wallet getOrCreateWallet(Long customerId) {
        Optional<Wallet> existing = walletRepo.findByCustomer_CustomerId(customerId);
        if (existing.isPresent()) {
            return existing.get();
        }

        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Wallet wallet = new Wallet();
        wallet.setBalance(1000000);
        wallet.setCustomer(customer);
        return walletRepo.save(wallet);
    }

    public double checkBalance(Long customerId) {
        Wallet wallet = getOrCreateWallet(customerId);
        return wallet.getBalance();
    }

    public void deductBalance(Long customerId, double amount) {
        Wallet wallet = getOrCreateWallet(customerId);

        if (wallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        wallet.setBalance(wallet.getBalance() - amount);
        walletRepo.save(wallet);
    }

    public void addBalance(Long customerId, double amount){
        Wallet wallet = getOrCreateWallet(customerId);
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepo.save(wallet);
    }
}


