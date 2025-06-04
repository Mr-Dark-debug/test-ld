// Test script for contact form API
const testContactForm = async () => {
  const testData = {
    name: "Test User",
    email: "test@example.com", 
    phone: "+91 9876543210",
    projectInterest: "Millennium Park",
    message: "This is a test message to verify the contact form API is working properly."
  };

  try {
    console.log('Testing contact form API...');
    console.log('Test data:', testData);

    const response = await fetch('http://localhost:3000/api/leads/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', result);

    if (response.ok && result.success) {
      console.log('✅ Contact form API test PASSED');
      console.log('Lead ID:', result.data?.id);
    } else {
      console.log('❌ Contact form API test FAILED');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Contact form API test FAILED with exception');
    console.error('Error:', error.message);
  }
};

// Run the test
testContactForm();
