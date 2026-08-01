namespace Budgetha.Application.Features.Orders.DTOs;

public class CustomerOrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public List<CustomerOrderItemDto> Items { get; set; } = new();
    public CustomerShippingAddressDto? ShippingAddress { get; set; }
    public string? PaymentProvider { get; set; }
    public string? PaymentStatus { get; set; }
    public bool CanConfirmReceipt { get; set; }
    public bool CanReportNotReceived { get; set; }
    public List<CustomerFulfillmentDto> Fulfillments { get; set; } = new();
    public List<CustomerDeliveryReportDto> DeliveryReports { get; set; } = new();
}

public class CustomerOrderItemDto
{
    public Guid ProductId { get; set; }
    public Guid? VariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductImage { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateOnly? RentalStartDate { get; set; }
    public DateOnly? RentalEndDate { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public Guid? FulfillmentId { get; set; }
    public string SellerName { get; set; } = string.Empty;
}

public class CustomerFulfillmentDto
{
    public Guid Id { get; set; }
    public string SellerId { get; set; } = string.Empty;
    public string SellerName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Carrier { get; set; }
    public string? TrackingNumber { get; set; }
    public DateTimeOffset? ShippedAt { get; set; }
    public DateTimeOffset? DeliveredAt { get; set; }
    public DateTimeOffset? RejectedAt { get; set; }
    public string? RejectionReason { get; set; }
}

public class CustomerDeliveryReportDto
{
    public Guid Id { get; set; }
    public Guid? FulfillmentId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Reason { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string? AdminNote { get; set; }
}

public class CustomerShippingAddressDto
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Line1 { get; set; } = string.Empty;
    public string? Line2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
}
