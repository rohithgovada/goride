import React, { useState } from 'react';
import { TripOption, UserProfile } from '../types/transit';
import { 
  X, 
  CheckCircle2, 
  Wallet, 
  CreditCard, 
  Banknote, 
  Star, 
  ArrowRight,
  Smartphone
} from 'lucide-react';

interface TripPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripOption | null;
  driverName?: string;
  user: UserProfile;
  walletBalance: number;
  onCompletePayment: (method: string, amount: number, tip: number) => void;
}

export const TripPaymentModal: React.FC<TripPaymentModalProps> = ({
  isOpen,
  onClose,
  trip,
  driverName = 'Rajesh Kumar',
  user,
  walletBalance,
  onCompletePayment,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'wallet' | 'cash' | 'card'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen || !trip) return null;

  const baseFare = trip.price;
  const totalAmount = baseFare + tipAmount;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      onCompletePayment(selectedMethod, totalAmount, tipAmount);
    }, 1200);
  };

  const handleCloseAndFinish = () => {
    setPaymentSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {paymentSuccess ? 'Trip Receipt & Invoice' : 'Destination Reached • Fare Payment'}
            </h3>
          </div>
          <button
            onClick={handleCloseAndFinish}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {paymentSuccess ? (
            /* Payment Successful View */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">Payment Completed!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  ₹{totalAmount} paid successfully via {selectedMethod.toUpperCase()}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Receipt sent to {user.email || 'your registered email'}
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-700/60">
                  <span>Transaction ID</span>
                  <span className="font-mono text-white">TXN-GORIDE-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Trip: {trip.title}</span>
                  <span className="text-white font-medium">₹{baseFare}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Driver Tip for Captain {driverName}</span>
                    <span className="text-amber-400 font-medium">+₹{tipAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-400 font-bold text-sm pt-2 border-t border-slate-700/60">
                  <span>Total Paid</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {/* Thank you feedback */}
              <div className="flex items-center justify-center space-x-1 text-xs text-amber-400">
                <span>Rated Captain {driverName}</span>
                <span className="font-bold flex items-center">
                  {rating} <Star className="h-3 w-3 fill-amber-400 inline ml-0.5" />
                </span>
              </div>

              <button
                onClick={handleCloseAndFinish}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Done & Return to Map
              </button>
            </div>
          ) : (
            /* Fare Settlement & Payment Methods View */
            <div className="space-y-5">
              
              {/* Fare Total Header */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Total Fare to Pay
                  </div>
                  <div className="text-2xl font-black text-white mt-0.5 font-mono">
                    ₹{totalAmount}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {trip.distanceKm} km ride with Captain {driverName}
                  </div>
                </div>

                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Banknote className="h-6 w-6" />
                </div>
              </div>

              {/* Select Payment Method */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select How You Want to Pay
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition ${
                      selectedMethod === 'upi'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500/40'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Smartphone className={`h-5 w-5 shrink-0 ${selectedMethod === 'upi' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-bold text-white">UPI / QR Code</div>
                      <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
                    </div>
                  </button>

                  {/* Wallet */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('wallet')}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition ${
                      selectedMethod === 'wallet'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500/40'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Wallet className={`h-5 w-5 shrink-0 ${selectedMethod === 'wallet' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-bold text-white">GoRide Wallet</div>
                      <div className="text-[10px] text-emerald-400 font-mono">₹{walletBalance} Avail</div>
                    </div>
                  </button>

                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cash')}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition ${
                      selectedMethod === 'cash'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500/40'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Banknote className={`h-5 w-5 shrink-0 ${selectedMethod === 'cash' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-bold text-white">Cash to Driver</div>
                      <div className="text-[10px] text-slate-400">Exact change</div>
                    </div>
                  </button>

                  {/* Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition ${
                      selectedMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500/40'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className={`h-5 w-5 shrink-0 ${selectedMethod === 'card' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-bold text-white">Card / NetBanking</div>
                      <div className="text-[10px] text-slate-400">Debit / Credit</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Method Details */}
              {selectedMethod === 'upi' && (
                <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3.5 space-y-3">
                  <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Pay with your preferred UPI App:</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Instant 0% Fee</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('gpay')}
                      className={`p-2 rounded-xl border text-center text-xs font-bold transition ${
                        selectedUpiApp === 'gpay'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      Google Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('phonepe')}
                      className={`p-2 rounded-xl border text-center text-xs font-bold transition ${
                        selectedUpiApp === 'phonepe'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('paytm')}
                      className={`p-2 rounded-xl border text-center text-xs font-bold transition ${
                        selectedUpiApp === 'paytm'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      Paytm
                    </button>
                  </div>
                </div>
              )}

              {selectedMethod === 'cash' && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-300 flex items-center space-x-2">
                  <Banknote className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>Please hand over exactly <b>₹{totalAmount}</b> in cash to Captain {driverName}.</span>
                </div>
              )}

              {selectedMethod === 'wallet' && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-300 flex items-center justify-between">
                  <span>GoRide Balance available: <b>₹{walletBalance}</b></span>
                  <span className="font-bold">Auto-Deduct ₹{totalAmount}</span>
                </div>
              )}

              {/* Optional Tip */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Add Tip for Captain {driverName} (Optional)
                </label>
                <div className="flex items-center space-x-2">
                  {[0, 10, 20, 50].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTipAmount(amt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                        tipAmount === amt
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {amt === 0 ? 'No Tip' : `+₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rate Captain */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Rate your Captain</div>
                  <div className="text-[10px] text-slate-400">How was the ride experience?</div>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(rating)}
                      onClick={() => setRating(star)}
                      className="p-1 transition hover:scale-110"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= (hoverRating || rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <>
                    <span>Pay ₹{totalAmount} & Complete Trip</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
