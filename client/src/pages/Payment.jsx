import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { useAppContext } from "../context/AppContext";

const Payment = () => {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const upi = params.get("upi");

  const { token, axios } = useAppContext();

  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(
          `/api/payment/status?orderId=${orderId}`,
          {
            headers: { Authorization: token }
          }
        );

        console.log("Payment status:", data);

        if (data.success && data.isPaid) {
          setStatus("success");

          setTimeout(() => {
            window.location.href = "/credits";
          }, 1500);

          clearInterval(interval);
        }
      } catch (err) {
        console.log("Status check error:", err.message);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, token]); // <-- REQUIRED dependencies

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>

      <p className="text-lg mb-2">Order ID: {orderId}</p>

      <div className="p-4 bg-white rounded shadow">
        <QRCode value={upi} size={200} />
      </div>

      <p className="mt-4 text-gray-700 text-center">
        Scan this QR using any UPI app (Google Pay, PhonePe, Paytm)
      </p>

      <p className="mt-6 text-xl font-bold">
        {status === "pending" && "Waiting for payment..."}
        {status === "success" && "Payment complete! Credits added 🎉"}
      </p>
    </div>
  );
};

export default Payment;
