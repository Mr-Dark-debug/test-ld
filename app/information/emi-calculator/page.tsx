"use client";

import { useState, useEffect } from "react";

export default function EmiCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTenure, setLoanTenure] = useState<number>(20);
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    calculateEmi();
  }, [loanAmount, interestRate, loanTenure]);

  const calculateEmi = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100; // Monthly interest rate
    const time = loanTenure * 12; // Tenure in months

    // EMI calculation formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emiValue = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
    const totalPayment = emiValue * time;
    const totalInterestPayment = totalPayment - principal;

    setEmi(emiValue);
    setTotalInterest(totalInterestPayment);
    setTotalAmount(totalPayment);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90 text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display mb-6 text-center">EMI Calculator</h1>
          <p className="text-xl text-center max-w-3xl mx-auto mb-8">
            Calculate your monthly EMI payments for your dream home or investment property.
          </p>
        </div>
      </section>

      {/* EMI Calculator */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-display mb-6 text-gray-800">Loan Details</h2>
                
                {/* Loan Amount */}
                <div className="mb-6">
                  <label htmlFor="loanAmount" className="block text-sm font-medium mb-2 text-gray-700">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="range"
                    id="loanAmount"
                    min="500000"
                    max="50000000"
                    step="100000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">₹5 Lacs</span>
                    <span className="text-base font-medium text-[#be9e67]">{formatCurrency(loanAmount)}</span>
                    <span className="text-sm text-gray-600">₹5 Cr</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="mb-6">
                  <label htmlFor="interestRate" className="block text-sm font-medium mb-2 text-gray-700">
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    type="range"
                    id="interestRate"
                    min="5"
                    max="15"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">5%</span>
                    <span className="text-base font-medium text-[#be9e67]">{interestRate}%</span>
                    <span className="text-sm text-gray-600">15%</span>
                  </div>
                </div>

                {/* Loan Tenure */}
                <div className="mb-6">
                  <label htmlFor="loanTenure" className="block text-sm font-medium mb-2 text-gray-700">
                    Loan Tenure (Years)
                  </label>
                  <input
                    type="range"
                    id="loanTenure"
                    min="1"
                    max="30"
                    step="1"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">1 Year</span>
                    <span className="text-base font-medium text-[#be9e67]">{loanTenure} Years</span>
                    <span className="text-sm text-gray-600">30 Years</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-display mb-6 text-gray-800">Loan Summary</h2>
                
                <div className="space-y-6">
                  {/* Monthly EMI */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="text-sm text-gray-600 mb-1">Monthly EMI</div>
                    <div className="text-2xl font-semibold text-[#be9e67]">{formatCurrency(emi)}</div>
                  </div>
                  
                  {/* Principal Amount */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="text-sm text-gray-600 mb-1">Principal Amount</div>
                    <div className="text-lg font-medium text-gray-800">{formatCurrency(loanAmount)}</div>
                  </div>
                  
                  {/* Total Interest */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="text-sm text-gray-600 mb-1">Total Interest Payable</div>
                    <div className="text-lg font-medium text-gray-800">{formatCurrency(totalInterest)}</div>
                  </div>
                  
                  {/* Total Amount */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="text-sm text-gray-600 mb-1">Total Amount Payable</div>
                    <div className="text-lg font-medium text-gray-800">{formatCurrency(totalAmount)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-amber-100">
              <p className="text-sm text-gray-600">
                <strong>Disclaimer:</strong> This calculator provides an estimate of your EMI based on the information provided. 
                Actual EMI and other charges may vary depending on the lender's policies, processing fees, and other factors. 
                Please contact our sales team for detailed information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display mb-6">Need Assistance?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Our financial advisors are ready to help you understand your home loan options and guide you through the process.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#be9e67] hover:bg-[#b39058] transition-colors"
            >
              Contact Us
            </a>
            <a 
              href="tel:+919978600222" 
              className="inline-flex items-center justify-center px-6 py-3 border border-[#be9e67] text-base font-medium rounded-md text-[#be9e67] bg-transparent hover:bg-[#be9e67]/10 transition-colors"
            >
              Call Now: +91 9978600222
            </a>
          </div>
        </div>
      </section>
    </main>
  );
} 