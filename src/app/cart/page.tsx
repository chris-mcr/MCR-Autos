"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

interface CartItem {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "payment" | "confirmation">("cart");
  const [orderProcessing, setOrderProcessing] = useState(false);
  const isLoadingCartRef = useRef(false);
  
  // Shipping form state
  const [shippingData, setShippingData] = useState({
    name: "",
    address: "",
    city: "",
    postcode: "",
  });
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkAuth = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }
      setUser(JSON.parse(userData));
      await loadCart();
    };

    checkAuth();
  }, [router]);

  const loadCart = async () => {
    // Skip if a request is already in progress
    if (isLoadingCartRef.current) {
      return;
    }

    try {
      isLoadingCartRef.current = true;
      const userData = localStorage.getItem("user");
      if (!userData) {
        setLoading(false);
        return;
      }

      const { id: userId } = JSON.parse(userData);
      const response = await fetch("/api/cart", {
        headers: { "x-user-id": userId },
      });
      if (response.ok) {
        const items = await response.json();
        setCartItems(items);
        // Notify CartButton to update count with cart data (avoids duplicate request)
        window.dispatchEvent(new CustomEvent("cartUpdated", {
          bubbles: true,
          detail: { cart: items }
        }));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
      isLoadingCartRef.current = false;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const { id: userId } = JSON.parse(userData);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ action: "removeItem", data: { id: itemId }, userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart);
        // Notify CartButton to update count with cart data
        window.dispatchEvent(new CustomEvent("cartUpdated", {
          bubbles: true,
          detail: { cart: data.cart }
        }));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }

    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const { id: userId } = JSON.parse(userData);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          action: "updateQuantity",
          data: { id: itemId, quantity },
          userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart);
        // Notify CartButton to update count with cart data
        window.dispatchEvent(new CustomEvent("cartUpdated", {
          bubbles: true,
          detail: { cart: data.cart }
        }));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    router.push("/");
  };

  // Validation functions
  const validateShippingForm = () => {
    const errors: Record<string, string> = {};

    if (!shippingData.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!shippingData.address.trim()) {
      errors.address = "Street address is required";
    }

    if (!shippingData.city.trim()) {
      errors.city = "City is required";
    }

    if (!shippingData.postcode.trim()) {
      errors.postcode = "Post code is required";
    } else if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(shippingData.postcode)) {
      errors.postcode = "Invalid post code format (e.g., SW1A 1AA)";
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = () => {
    const errors: Record<string, string> = {};

    if (!paymentData.cardNumber.trim()) {
      errors.cardNumber = "Card number is required";
    } else {
      const cardNumber = paymentData.cardNumber.replace(/\s/g, "");
      if (!/^\d{13,19}$/.test(cardNumber)) {
        errors.cardNumber = "Card number must be 13-19 digits";
      } else if (!luhnCheck(cardNumber)) {
        errors.cardNumber = "Invalid card number (failed Luhn check)";
      }
    }

    if (!paymentData.cardName.trim()) {
      errors.cardName = "Cardholder name is required";
    } else if (!/^[a-zA-Z\s'-]+$/.test(paymentData.cardName)) {
      errors.cardName = "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    if (!paymentData.expiryDate.trim()) {
      errors.expiryDate = "Expiry date is required";
    } else {
      const expiryError = validateExpiryDate(paymentData.expiryDate);
      if (expiryError) {
        errors.expiryDate = expiryError;
      }
    }

    if (!paymentData.cvv.trim()) {
      errors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      errors.cvv = "CVV must be 3-4 digits";
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Luhn algorithm for card validation
  const luhnCheck = (num: string): boolean => {
    let sum = 0;
    let isEven = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  // Validate expiry date format and check if not in past
  const validateExpiryDate = (date: string): string | null => {
    if (!/^\d{2}\/\d{2}$/.test(date)) {
      return "Format must be MM/YY";
    }

    const [month, year] = date.split("/");
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) {
      return "Month must be between 01 and 12";
    }

    const expiryYear = 2000 + yearNum;
    const expiryDate = new Date(expiryYear, monthNum - 1, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expiryDate < today) {
      return "Card has expired";
    }

    return null;
  };

  const handleProceedToPayment = () => {
    if (validateShippingForm()) {
      setCheckoutStep("payment");
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    setOrderProcessing(true);

    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        console.error("No user data found");
        return;
      }

      const { id: userId } = JSON.parse(userData);
      const subtotal = parseFloat(calculateTotal());
      const shippingCost = 5.00;
      const total = subtotal + shippingCost;
      const orderDate = new Date().toISOString().split("T")[0];

      // Create unique order ID using timestamp + random string
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Create new pending order
      const newOrder = {
        id: `order-${uniqueSuffix}`,
        items: cartItems,
        total,
        date: orderDate,
        status: "pending",
        shippingInfo: shippingData,
      };

      // Add order to Firebase
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ action: "addOrder", data: newOrder, userId }),
      });

      if (response.ok) {
        // Clear cart
        const clearResponse = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
          body: JSON.stringify({ action: "clearCart", userId }),
        });

        if (clearResponse.ok) {
          const clearData = await clearResponse.json();
          setCartItems([]);
          // Notify CartButton to update count with empty cart
          window.dispatchEvent(new CustomEvent("cartUpdated", {
            bubbles: true,
            detail: { cart: clearData.cart || [] }
          }));
        }
        setCheckoutStep("confirmation");
      }
    } catch (error) {
      console.error("Error completing checkout:", error);
    } finally {
      setOrderProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stepOrder = ["cart", "shipping", "payment", "confirmation"] as const;
  const currentStepIdx = stepOrder.indexOf(checkoutStep as typeof stepOrder[number]);
  const stepLabels = ["Cart", "Shipping", "Payment", "Confirm"];

  const fieldLabel = (text: string) => (
    <span className="block text-xs font-code uppercase tracking-wide mb-2" style={{ color: 'var(--text-2)' }}>
      {text}
    </span>
  );

  const fieldError = (id: string, msg: string) => (
    <p id={id} className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>{msg}</p>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }} role="application" aria-label="Shopping cart page">
      <Navigation currentPage="cart" showCart={true} user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {checkoutStep === "confirmation" ? (
          <div className="max-w-lg mx-auto card p-12 text-center anim-fade-up">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              ✓
            </div>
            <h2 className="font-display text-3xl mb-3" style={{ color: 'var(--text-1)' }}>
              Order placed.
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
              Your order has been placed and is now pending processing.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/shop" data-testid="confirmation-continue-shopping-button" className="btn-amber">
                Continue Shopping
              </Link>
              <Link href="/dashboard" data-testid="confirmation-view-orders-button" className="btn-ghost">
                View Orders
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">

              {/* Step indicator */}
              <div className="mb-8 flex items-start" role="tablist" aria-label="Checkout progress">
                {stepLabels.map((label, i) => {
                  const isActive = currentStepIdx === i;
                  const isDone   = currentStepIdx > i;
                  return (
                    <div key={label} className="flex items-start flex-1">
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-code transition-all"
                          style={{
                            background: isActive || isDone ? 'var(--accent)' : 'var(--bg-overlay)',
                            color:      isActive || isDone ? '#ffffff'        : 'var(--text-3)',
                            border:    `2px solid ${isActive || isDone ? 'var(--accent)' : 'var(--edge-mid)'}`,
                          }}
                          role="tab"
                          aria-selected={isActive}
                          aria-label={`${label} step`}
                        >
                          {isDone ? "✓" : i + 1}
                        </div>
                        <span className="text-xs font-code hidden sm:block" style={{ color: isActive ? 'var(--accent)' : 'var(--text-3)' }}>
                          {label}
                        </span>
                      </div>
                      {i < 3 && (
                        <div
                          className="flex-1 h-px mx-2 mt-3.5"
                          style={{ background: isDone ? 'var(--accent)' : 'var(--edge-mid)' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cart step */}
              {checkoutStep === "cart" && (
                <div className="card p-6" data-testid="cart-summary">
                  <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text-1)' }}>Shopping Cart</h2>

                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          data-testid={`cart-item-${item.id}`}
                          className="flex gap-4 pb-4 last:pb-0"
                          style={{ borderBottom: '1px solid var(--edge)' }}
                        >
                          <Image src={item.image} alt={item.title} width={56} height={56} className="w-14 h-14 flex-shrink-0 rounded object-cover" style={{ background: 'var(--bg-overlay)' }} />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>{item.title}</h3>
                            <p className="text-xs mt-0.5 font-code" style={{ color: 'var(--text-3)' }}>{item.category}</p>
                            <p className="font-display text-base font-semibold mt-1" style={{ color: 'var(--accent)' }}>
                              £{item.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              data-testid={`decrease-qty-${item.id}`}
                              aria-label={`Decrease quantity of ${item.title}`}
                              className="w-7 h-7 rounded flex items-center justify-center text-sm transition-colors"
                              style={{ background: 'var(--bg-overlay)', color: 'var(--text-2)', border: '1px solid var(--edge-mid)' }}
                            >
                              −
                            </button>
                            <span
                              data-testid={`qty-${item.id}`}
                              className="w-10 text-center text-sm font-code"
                              style={{ color: 'var(--text-1)' }}
                              aria-label={`Quantity: ${item.quantity} ${item.title}`}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              data-testid={`increase-qty-${item.id}`}
                              aria-label={`Increase quantity of ${item.title}`}
                              className="w-7 h-7 rounded flex items-center justify-center text-sm transition-colors"
                              style={{ background: 'var(--bg-overlay)', color: 'var(--text-2)', border: '1px solid var(--edge-mid)' }}
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              data-testid={`remove-item-${item.id}`}
                              aria-label={`Remove ${item.title} from cart`}
                              className="ml-2 px-3 py-1 rounded text-xs font-medium transition-colors"
                              style={{ color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'transparent' }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm py-8 text-center" style={{ color: 'var(--text-3)' }}>Your cart is empty</p>
                  )}

                  <div className="mt-6 flex gap-3 pt-6" style={{ borderTop: '1px solid var(--edge)' }}>
                    <Link href="/shop" data-testid="continue-shopping-button" className="btn-ghost flex-1 text-center">
                      Continue Shopping
                    </Link>
                    <button
                      onClick={() => setCheckoutStep("shipping")}
                      disabled={cartItems.length === 0}
                      data-testid="proceed-checkout"
                      aria-label="Proceed to shipping information"
                      className="btn-amber flex-1"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}

              {/* Shipping step */}
              {checkoutStep === "shipping" && (
                <div className="card p-6">
                  <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text-1)' }}>Shipping Information</h2>
                  <form className="space-y-4" aria-label="Shipping form">
                    <div>
                      <label htmlFor="shipping-name">{fieldLabel("Full Name *")}</label>
                      <input
                        id="shipping-name"
                        type="text"
                        data-testid="shipping-name"
                        placeholder="Joe Bloggs"
                        value={shippingData.name}
                        onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                        className={`field ${shippingErrors.name ? 'field-error' : ''}`}
                        aria-label="Full name for shipping"
                        aria-describedby={shippingErrors.name ? "shipping-name-error" : undefined}
                      />
                      {shippingErrors.name && fieldError("shipping-name-error", shippingErrors.name)}
                    </div>

                    <div>
                      <label htmlFor="shipping-address">{fieldLabel("Street Address *")}</label>
                      <input
                        id="shipping-address"
                        type="text"
                        data-testid="shipping-address"
                        placeholder="123 Test St"
                        value={shippingData.address}
                        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                        className={`field ${shippingErrors.address ? 'field-error' : ''}`}
                        aria-label="Street address for shipping"
                        aria-describedby={shippingErrors.address ? "shipping-address-error" : undefined}
                      />
                      {shippingErrors.address && fieldError("shipping-address-error", shippingErrors.address)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="shipping-city">{fieldLabel("City *")}</label>
                        <input
                          id="shipping-city"
                          type="text"
                          data-testid="shipping-city"
                          placeholder="London"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                          className={`field ${shippingErrors.city ? 'field-error' : ''}`}
                          aria-label="City for shipping"
                          aria-describedby={shippingErrors.city ? "shipping-city-error" : undefined}
                        />
                        {shippingErrors.city && fieldError("shipping-city-error", shippingErrors.city)}
                      </div>
                      <div>
                        <label htmlFor="shipping-postcode">{fieldLabel("Post Code *")}</label>
                        <input
                          id="shipping-postcode"
                          type="text"
                          data-testid="shipping-postcode"
                          placeholder="AA1 AAA"
                          value={shippingData.postcode}
                          onChange={(e) => setShippingData({ ...shippingData, postcode: e.target.value })}
                          className={`field ${shippingErrors.postcode ? 'field-error' : ''}`}
                          aria-label="Postal code for shipping"
                          aria-describedby={shippingErrors.postcode ? "shipping-postcode-error" : undefined}
                        />
                        {shippingErrors.postcode && fieldError("shipping-postcode-error", shippingErrors.postcode)}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6 pt-6" style={{ borderTop: '1px solid var(--edge)' }}>
                      <button type="button" onClick={() => setCheckoutStep("cart")} data-testid="back-to-cart-button" aria-label="Go back to shopping cart" className="btn-ghost flex-1">
                        Back
                      </button>
                      <button type="button" onClick={handleProceedToPayment} data-testid="proceed-payment-button" aria-label="Proceed to payment information" className="btn-amber flex-1">
                        Proceed to Payment
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Payment step */}
              {checkoutStep === "payment" && (
                <div className="card p-6">
                  <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text-1)' }}>Payment Information</h2>
                  <form className="space-y-4" aria-label="Payment form">
                    <div>
                      <label htmlFor="card-number">{fieldLabel("Card Number *")}</label>
                      <input
                        id="card-number"
                        type="text"
                        data-testid="card-number"
                        placeholder="4532 1234 5678 9010"
                        value={paymentData.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, "");
                          const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
                          setPaymentData({ ...paymentData, cardNumber: formatted });
                        }}
                        maxLength={19}
                        className={`field font-code ${paymentErrors.cardNumber ? 'field-error' : ''}`}
                        aria-label="Credit card number"
                        aria-describedby={paymentErrors.cardNumber ? "card-number-error" : undefined}
                      />
                      {paymentErrors.cardNumber && fieldError("card-number-error", paymentErrors.cardNumber)}
                    </div>

                    <div>
                      <label htmlFor="card-name">{fieldLabel("Cardholder Name *")}</label>
                      <input
                        id="card-name"
                        type="text"
                        data-testid="card-name"
                        placeholder="Joe Bloggs"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                        className={`field ${paymentErrors.cardName ? 'field-error' : ''}`}
                        aria-label="Cardholder name"
                        aria-describedby={paymentErrors.cardName ? "card-name-error" : undefined}
                      />
                      {paymentErrors.cardName && fieldError("card-name-error", paymentErrors.cardName)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry-date">{fieldLabel("Expiry (MM/YY) *")}</label>
                        <input
                          id="expiry-date"
                          type="text"
                          data-testid="expiry-date"
                          placeholder="12/25"
                          value={paymentData.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2, 4);
                            setPaymentData({ ...paymentData, expiryDate: value });
                          }}
                          maxLength={5}
                          className={`field font-code ${paymentErrors.expiryDate ? 'field-error' : ''}`}
                          aria-label="Card expiry date in MM/YY format"
                          aria-describedby={paymentErrors.expiryDate ? "expiry-date-error" : undefined}
                        />
                        {paymentErrors.expiryDate && fieldError("expiry-date-error", paymentErrors.expiryDate)}
                      </div>
                      <div>
                        <label htmlFor="cvv">{fieldLabel("CVV *")}</label>
                        <input
                          id="cvv"
                          type="text"
                          data-testid="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setPaymentData({ ...paymentData, cvv: value });
                          }}
                          maxLength={4}
                          className={`field font-code ${paymentErrors.cvv ? 'field-error' : ''}`}
                          aria-label="Card security code (CVV)"
                          aria-describedby={paymentErrors.cvv ? "cvv-error" : undefined}
                        />
                        {paymentErrors.cvv && fieldError("cvv-error", paymentErrors.cvv)}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6 pt-6" style={{ borderTop: '1px solid var(--edge)' }}>
                      <button type="button" onClick={() => setCheckoutStep("shipping")} data-testid="back-to-shipping-button" aria-label="Go back to shipping information" className="btn-ghost flex-1">
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={orderProcessing}
                        data-testid="place-order-button"
                        aria-label={orderProcessing ? "Processing order" : "Place order"}
                        aria-busy={orderProcessing}
                        className="btn-amber flex-1"
                        style={{ background: orderProcessing ? 'var(--bg-overlay)' : undefined, color: orderProcessing ? 'var(--text-3)' : undefined }}
                      >
                        {orderProcessing ? "Processing…" : "Place Order"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24" role="region" aria-label="Order summary">
                <h3 className="font-display text-xl mb-5" style={{ color: 'var(--text-1)' }}>Order Summary</h3>

                <div className="space-y-2 pb-4 mb-4" style={{ borderBottom: '1px solid var(--edge)' }}>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs" style={{ color: 'var(--text-2)' }}>
                      <span className="truncate mr-3">{item.title} ×{item.quantity}</span>
                      <span data-testid={`item-total-${item.id}`} className="font-code flex-shrink-0">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between" style={{ color: 'var(--text-2)' }}>
                    <span>Subtotal</span>
                    <span data-testid="subtotal" className="font-code">£{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'var(--text-2)' }}>
                    <span>Shipping</span>
                    <span data-testid="shipping-cost" className="font-code">£5.00</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-3" style={{ borderTop: '1px solid var(--edge)', color: 'var(--text-1)' }}>
                    <span>Total</span>
                    <span data-testid="total-price" className="font-code" style={{ color: 'var(--accent)' }}>
                      £{(parseFloat(calculateTotal()) + 5).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
