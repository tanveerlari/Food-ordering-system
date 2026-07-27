// src/userStore.js

const USERS_KEY = "registeredUsers";

export function getRegisteredUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

export function isUserRegistered(email) {
  const users = getRegisteredUsers();
  return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function registerUser(name, email, password) {
  const users = getRegisteredUsers();
  users.push({ name, email, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function validateLogin(email, password) {
  const users = getRegisteredUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user || null;
}   