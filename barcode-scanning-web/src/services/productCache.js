const PRODUCT_CACHE_PREFIX = "product_cache_";
const CACHE_TTL = 1000*60*10;

export function getProductCache(branchName){
    try{
        const raw = localStorage.getItem(PRODUCT_CACHE_PREFIX + branchName);
        if(!raw){
            return null;
        }
        const cache = JSON.parse(raw);
        const isExpired = Date.now() - cache.createdAt > CACHE_TTL;
        if(isExpired){
            localStorage.removeItem(PRODUCT_CACHE_PREFIX+branchName);
            return null;
        }
        return cache.data;
    }
    catch(e){
        return null;
    }
}

export function setProductCache(branchName,data){
    localStorage.setItem(PRODUCT_CACHE_PREFIX + branchName,
        JSON.stringify({
            data,
            createdAt:Date.now()
        })
    )
}

export function hasFreshProductCache(branchName){
    return Boolean(getProductCache(branchName));
}

export function clearProductCache(branchName){
    localStorage.removeItem(PRODUCT_CACHE_PREFIX+branchName)
}