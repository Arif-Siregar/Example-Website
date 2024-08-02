import type { Item } from "../pages/api/item";
import type { communityType } from "../pages/api/communityType";
import type { itemCommunity } from "../pages/api/itemCommunity";

export type CachedItems = Array<Item>;
export type CachedItem = Item;
export type CachedCommunityTypes = Array<communityType>;
export type CachedCommunityItems = Array<itemCommunity>;
const CACHE_KEY = "cachedItems";

export const fetchItemsFromAPI = async () => {
  try {
    const response = await fetch("/api/item");
    if (!response.ok) {
      alert("Error fetching items from API");
      return [];
    }
    const s = await response.text();
    sessionStorage.setItem(CACHE_KEY, s);
    return JSON.parse(s) as CachedItems;
  } catch (error) {
    alert("Error fetching items from API");
    return [];
  }
};

export const fetchItemsforCommunity = async () =>{
  try {
    const response = await fetch("/api/itemCommunity/");
    if (!response.ok) {
      alert("Error fetching items from API");
      return [];
    }
    const s = await response.text();
    return JSON.parse(s);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchCommunityTypeAPI = async()=>{
  try{
    const response = await fetch("/api/communityType");
    console.log(response)
    if (!response.ok){
      alert("Error fetching Community Types")
      return [];
    }
    const s =  await response.text();
    return JSON.parse(s) as CachedCommunityTypes;
  } catch(error){
    alert("Error fetching Community Types some error occured");
    return [];
  }
}


export const getItemsFromCache = () => {
  const cachedData = sessionStorage.getItem(CACHE_KEY);
  if (!cachedData) {
    return fetchItemsFromAPI();
  } else {
    return JSON.parse(cachedData) as CachedItems;
  }
};
