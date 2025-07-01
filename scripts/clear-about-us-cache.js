// Script to clear any cached About Us data that might have wrong image paths
console.log('🧹 Clearing About Us cache...');

// This script is meant to be run in the browser console
// to clear any localStorage data that might be causing issues

const clearCacheScript = `
// Clear localStorage data
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('aboutUsContent');
  console.log('✅ Cleared aboutUsContent from localStorage');
}

// Clear sessionStorage data
if (typeof sessionStorage !== 'undefined') {
  sessionStorage.removeItem('aboutUsContent');
  console.log('✅ Cleared aboutUsContent from sessionStorage');
}

// Force reload the page
window.location.reload();
`;

console.log('📋 Copy and paste this script in your browser console on the about-us page:');
console.log('');
console.log(clearCacheScript);
console.log('');
console.log('Or simply open the browser developer tools and run:');
console.log('localStorage.removeItem("aboutUsContent"); window.location.reload();');
