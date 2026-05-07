package com.project.SpringClean.service;

import com.project.SpringClean.dto.BookingRequest;
import com.project.SpringClean.dto.BookingResponse;
import com.project.SpringClean.dto.BookingUpdateRequest;
import com.project.SpringClean.model.*;
import com.project.SpringClean.repository.*;
import com.project.SpringClean.serviceinterface.BookingServiceInt;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;        // ✅ MISSING IMPORT FIXED
import java.util.Collections;   // ✅ MISSING IMPORT FIXED
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
public class BookingService implements BookingServiceInt {

    @Autowired
    private BookingRepository bookingRepo;
    @Autowired
    private CustomerRepository customerRepo;
    @Autowired
    private CleanerRepository cleanerRepo;
    @Autowired
    private CompanyCleanerRepository companyCleanerRepo;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private WalletService walletService;

    @Override
    @Transactional
    public Booking createBooking(BookingRequest request, Long customerId) {

    Customer customer = customerRepo.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));

    CompanyCleaner companyCleaner = companyCleanerRepo.findById(request.getCompanyCleanerId())
            .orElseThrow(() -> new RuntimeException("Company not found"));

    // ✔ Determine required cleaners but do NOT auto-check availability
    int requiredCleaners = switch (request.getServiceType().toLowerCase()) {
        case "basic" -> 1;
        case "standard" -> 2;
        case "premium" -> 3;
        default -> throw new RuntimeException("Invalid service type");
    };

    // ✔ Parse booking date and time
    LocalDate bookingDate = LocalDate.parse(request.getDate());
    LocalTime startTime = LocalTime.parse(request.getTime());

    // ❌ NO auto availability filtering
    // ❌ NO auto selecting cleaners
    // ❌ NO requiredCleaners check
    // ✔ Booking is created empty and company will assign cleaners

    Booking booking = new Booking();
    booking.setCustomer(customer);
    booking.setCompanyCleaner(companyCleaner);
    booking.setAssignedCleaners(new HashSet<>());
    booking.setServiceType(request.getServiceType());
    booking.setAddress(request.getAddress());
    booking.setBookingDate(bookingDate);
    booking.setBookingTime(startTime);
    booking.setHours(request.getHours());
    booking.setMinutes(request.getMinutes());
    booking.setStatus("Pending");
    booking.setTotalPrice(request.getTotalPrice());


    return bookingRepo.save(booking);
}


    private int getRequiredCleaners(String serviceType) {
        return switch (serviceType.toLowerCase()) {
            case "basic" -> 1;
            case "standard" -> 2;
            case "premium" -> 3;
            default -> throw new RuntimeException("Invalid service type: " + serviceType);
        };
    }

    public BookingResponse toDTO(Booking booking) {
        BookingResponse dto = new BookingResponse();

        dto.setBookingId(booking.getBookingId());
        dto.setCustomerId(booking.getCustomer().getCustomerId());
        dto.setCompanyCleanerId(booking.getCompanyCleaner().getCompanyCleanerId());
        dto.setCompanyName(booking.getCompanyCleaner().getCompanyName());
        dto.setDate(booking.getBookingDate());
        dto.setCustomerFirstName(booking.getCustomer().getFirstName());
        dto.setCustomerLastName(booking.getCustomer().getLastName());
        dto.setTime(booking.getBookingTime());
        dto.setHours(booking.getHours());
        dto.setMinutes(booking.getMinutes());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setAddress(booking.getAddress());
        dto.setServiceType(booking.getServiceType());
        dto.setStatus(booking.getStatus());

        if (booking.getAssignedCleaners() != null) {
            dto.setAssignedCleanerIds(
                    booking.getAssignedCleaners().stream()
                            .map(Cleaner::getCleanerId)
                            .collect(Collectors.toList())
            );
            dto.setAssignedCleanerNames(
                    booking.getAssignedCleaners().stream()
                            .map(Cleaner::getCleanerName)
                            .collect(Collectors.toList())
            );
        } else {
            dto.setAssignedCleanerIds(Collections.emptyList());
            dto.setAssignedCleanerNames(Collections.emptyList());
        }

        return dto;
    }

    @Transactional
    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepo.findByCustomerWithDetails(customerId);
    }

    public List<Booking> getBookingsByCompany(Long companyCleanerId) {
    return bookingRepo.findByCompanyCleanerWithCleaners(companyCleanerId);
    }

    public Booking updateBooking(Long bookingId, BookingUpdateRequest request) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        LocalDate date = LocalDate.parse(request.getBookingDate());
        LocalTime time = LocalTime.parse(request.getBookingTime());

        booking.setBookingDate(date);
        booking.setBookingTime(time);

        return bookingRepo.save(booking);
    }

    public void cancelBooking(Long bookingId, Long customerId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("Unauthorized cancellation attempt");
        }

        // ---- REFUND LOGIC ----
        if (booking.getStatus().equals("Paid")) {

            Payment refund = new Payment();
            refund.setBooking(booking);     // 🔥 REQUIRED
            refund.setAmount(booking.getTotalPrice());
            refund.setMethod("Refund");     // optional
            refund.setStatus("Refunded");
            refund.setPaidAt(LocalDateTime.now());

            paymentRepository.save(refund);

            // Return money to wallet
            walletService.addBalance(customerId, booking.getTotalPrice());
        }

        booking.setStatus("Cancelled");

        bookingRepo.save(booking);
    }

    private boolean timesOverlap(LocalTime start1, LocalTime end1,
                                 LocalTime start2, LocalTime end2) {
        return !start1.isAfter(end2) && !end1.isBefore(start2);
    }

    public List<BookingResponse> getBookingsForCompany(Long companyId) {
        List<Booking> bookings =
                bookingRepo.findByCompanyCleaner_CompanyCleanerId(companyId);

        return bookings.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse acceptAndAssignCleaners(Long bookingId,
                                                   List<Long> cleanerIds) {

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"Paid".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Only paid bookings can be accepted.");
        }

        int required = getRequiredCleaners(booking.getServiceType());

        if (cleanerIds == null || cleanerIds.size() != required) {
            throw new RuntimeException(
                    "You must assign exactly " + required + " cleaner(s).");
        }

        CompanyCleaner company = booking.getCompanyCleaner();
        LocalDate bookingDate = booking.getBookingDate();
        LocalTime start = booking.getBookingTime();
        double durationHours =
                booking.getHours() + booking.getMinutes() / 60.0;
        LocalTime end =
                start.plusMinutes((long) (durationHours * 60));

        List<Cleaner> selectedCleaners = new ArrayList<>();

        for (Long id : cleanerIds) {
            Cleaner c = cleanerRepo.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Cleaner with id " + id + " not found"));

            if (c.getCompanyCleaner() == null ||
                    !Objects.equals(
                            c.getCompanyCleaner().getCompanyCleanerId(),
                            company.getCompanyCleanerId())) {

                throw new RuntimeException(
                        "Cleaner " + c.getCleanerName() + " does not belong to the booking's company.");
            }

            selectedCleaners.add(c);
        }

        for (Cleaner c : selectedCleaners) {
            List<Booking> bookingsOnDate =
                    bookingRepo.findByCompanyCleanerAndBookingDate(company, bookingDate);

            boolean conflict = bookingsOnDate.stream()
                    .filter(b -> "Accepted".equalsIgnoreCase(b.getStatus()))
                    .filter(b -> b.getAssignedCleaners() != null &&
                            b.getAssignedCleaners().contains(c))
                    .anyMatch(b -> {
                        LocalTime bStart = b.getBookingTime();
                        double bDur =
                                b.getHours() + b.getMinutes() / 60.0;
                        LocalTime bEnd =
                                bStart.plusMinutes((long) (bDur * 60));
                        return timesOverlap(start, end, bStart, bEnd);
                    });

            if (conflict) {
                throw new RuntimeException(
                        "Cleaner " + c.getCleanerName() + " is not available for the chosen time.");
            }
        }

        booking.setAssignedCleaners(new HashSet<>(selectedCleaners));
        booking.setStatus("Accepted");

        Booking saved = bookingRepo.save(booking);
        return toDTO(saved);
    }

    @Transactional
    public BookingResponse rejectBooking(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("Rejected");
        Booking saved = bookingRepo.save(booking);
        return toDTO(saved);
    }

    // Assign cleaners without changing status
        @Transactional
        public BookingResponse assignCleanersOnly(Long bookingId, List<Long> cleanerIds) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        int required = getRequiredCleaners(booking.getServiceType());
        if (cleanerIds.size() != required) {
                throw new RuntimeException("You must assign exactly " + required + " cleaner(s).");
        }

        List<Cleaner> selectedCleaners = cleanerIds.stream()
                .map(id -> cleanerRepo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Cleaner not found: " + id)))
                .toList();

        booking.setAssignedCleaners(new HashSet<>(selectedCleaners));


        bookingRepo.save(booking); // ✅ persist to DB

        return toDTO(booking); // returns assigned cleaners to frontend
        }

        // Accept booking only if cleaners are assigned
       @Transactional
        public BookingResponse acceptBookingOnly(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"Pending".equalsIgnoreCase(booking.getStatus()) && !"Paid".equalsIgnoreCase(booking.getStatus())) {
                throw new RuntimeException("Only pending or paid bookings can be accepted.");
        }

        booking.setStatus("Accepted");
        bookingRepo.save(booking);
        return toDTO(booking);
        }

        public List<Booking> getCleanerBookings(Long cleanerId){
                return bookingRepo.findBookingsByCleanerId(cleanerId);
        }

        @Transactional
        public BookingResponse markInProgress(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"Accepted".equalsIgnoreCase(booking.getStatus())) {
                throw new RuntimeException("Only accepted bookings can go In Progress.");
        }

        booking.setStatus("In Progress");
        return toDTO(bookingRepo.save(booking));
        }

        @Transactional
        public BookingResponse markCompleted(Long bookingId) {
            Booking booking = bookingRepo.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            if (!"In Progress".equalsIgnoreCase(booking.getStatus())
                    && !"Accepted".equalsIgnoreCase(booking.getStatus())) {
                    throw new RuntimeException("Booking must be in progress to complete.");
            }

            booking.setStatus("Completed");

            return toDTO(bookingRepo.save(booking));
        }

        public String computeCurrentStatus(Booking booking) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = LocalDateTime.of(booking.getBookingDate(), booking.getBookingTime());
        double durationHours = booking.getHours() + booking.getMinutes() / 60.0;
        LocalDateTime end = start.plusMinutes((long)(durationHours * 60));

        String status = booking.getStatus();

        switch (status.toLowerCase()) {
                case "pending":
                case "paid":
                case "accepted":
                if (now.isBefore(start)) return status; // still pending/accepted
                else if (now.isAfter(start) && now.isBefore(end)) return "In Progress";
                else if (now.isAfter(end)) return "Completed";
                break;
                case "in progress":
                if (now.isAfter(end)) return "Completed";
                break;
                default:
                return status; // cancelled, rejected, completed
        }

        return status;
        }

        @Transactional
        public List<BookingResponse> getCompanyBookingsForCalendar(Long companyId) {
        List<Booking> bookings = bookingRepo.findByCompanyCleaner_CompanyCleanerId(companyId);

        return bookings.stream()
                .map(booking -> {
                        BookingResponse dto = toDTO(booking);
                        dto.setStatus(computeCurrentStatus(booking)); // real-time status
                        return dto;
                })
                .collect(Collectors.toList());
        }

}
