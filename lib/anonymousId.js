// lib/anonymousId.js
'use client'

// A simple function to generate a unique ID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// This function gets the anonymous ID from localStorage or creates a new one
export function getAnonymousId() {
  // localStorage is only available in the browser
  if (typeof window === 'undefined') {
    return null;
  }

  let anonId = localStorage.getItem('studySphereAnonId');
  
  if (!anonId) {
    anonId = generateUUID();
    localStorage.setItem('studySphereAnonId', anonId);
  }
  
  return anonId;
}