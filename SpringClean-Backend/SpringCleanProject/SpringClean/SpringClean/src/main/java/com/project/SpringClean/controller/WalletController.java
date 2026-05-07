package com.project.SpringClean.controller;

import com.project.SpringClean.model.Wallet;
import com.project.SpringClean.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping("/{customerId}/balance")
    public Map<String, Object> getBalance(@PathVariable Long customerId) {
        double balance = walletService.checkBalance(customerId);

        Map<String, Object> response = new HashMap<>();
        response.put("walletBalance", balance);

        return response;
    }

    @PostMapping("{customerId}/deduct")
    public void deductFromWallet(@PathVariable Long customerId, @RequestParam double amount) {
        walletService.deductBalance(customerId, amount);
    }
}
