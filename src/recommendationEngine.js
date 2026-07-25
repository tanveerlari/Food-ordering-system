// src/recommendationEngine.js
import { ITEMS, COMBO_PAIRS } from "./data";

// Liked + ordered items ke basis pe top categories nikalo
export function getPreferredCategories(likedIds, orderedIds) {
  const scoreMap = {};

  [...likedIds, ...orderedIds, ...orderedIds].forEach((id) => {
    // orderedIds ko double weight diya kyunki actual order zyada strong signal hai
    const item = ITEMS.find((i) => i.id === id);
    if (item) {
      scoreMap[item.category] = (scoreMap[item.category] || 0) + 1;
    }
  });

  return Object.entries(scoreMap)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);
}

// "Recommended for you" items nikalo
export function getRecommendedItems(likedIds, orderedIds, limit = 4) {
  const preferredCategories = getPreferredCategories(likedIds, orderedIds);
  const excludeIds = new Set([...likedIds, ...orderedIds]);

  if (preferredCategories.length === 0) {
    // Naya user hai, koi preference nahi — popular items dikhao
    return ITEMS.filter((i) => i.category === "popular").slice(0, limit);
  }

  // Preferred categories ke items pehle, phir baaki
  const sorted = [...ITEMS].sort((a, b) => {
    const aRank = preferredCategories.indexOf(a.category);
    const bRank = preferredCategories.indexOf(b.category);
    const aScore = aRank === -1 ? 999 : aRank;
    const bScore = bRank === -1 ? 999 : bRank;
    return aScore - bScore;
  });

  return sorted.filter((i) => !excludeIds.has(i.id)).slice(0, limit);
}

// Cart mein jo items hain, unke basis pe combo suggest karo
export function getComboSuggestions(cartItemIds, limit = 3) {
  const suggestedIds = new Set();

  cartItemIds.forEach((id) => {
    const pairs = COMBO_PAIRS[id] || [];
    pairs.forEach((pairId) => {
      if (!cartItemIds.includes(pairId)) {
        suggestedIds.add(pairId);
      }
    });
  });

  return ITEMS.filter((i) => suggestedIds.has(i.id)).slice(0, limit);
}