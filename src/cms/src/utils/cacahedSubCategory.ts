import type { Item } from "../pages/api/item";

export type CachedItems = Array<Item>;
export type CachedItem = Item;
const CACHE_KEY = "cachedItems";

export const fetchItemsFromAPI = async () => {
  try {
    const response = await fetch("/api/item");
    if (!response.ok) {
      alert("Error fetching items from API");
      return [];
    }
    const s = await response.text();
    localStorage.setItem(CACHE_KEY, s);
    return JSON.parse(s) as CachedItems;
  } catch (error) {
    alert("Error fetching items from API");
    return [];
  }
};

export const getItemsFromCache = () => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (!cachedData) {
    return fetchItemsFromAPI();
  } else {
    return JSON.parse(cachedData) as CachedItems;
  }
};
