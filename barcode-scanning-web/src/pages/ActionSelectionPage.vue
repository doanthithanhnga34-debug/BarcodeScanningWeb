<template>
  <Nav/>
  <div class="min-h-screen px-4 pb-8 pt-6 screen-bg ">
    <div class="mb-5 flex justify-start">
      <div
        class="inline-flex items-center gap-2 h-[28px] mt-5 ml-3 p-4 glass-card rounded-lg mb-3 shadow-2xs"
      >
        <i class="pi pi-shop text-color"></i>
        <span>Chi nhánh {{ selectedBranch }}</span>
      </div>
    </div>

    <div class="mx-auto flex w-full max-w-md flex-col gap-5 items-center">
      <div @click="navigateToScanner" class="relative bg-[#827aeb] w-full max-w-[360px] rounded-2xl card_box-shadow transition-all duration-200 ease-out
    active:scale-95">
        <div class="flex flex-col items-center px-4 py-9 gap-4">
          <div class="p-4 glass-card rounded-xl">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADRUlEQVR4nO2cXVLUQBSFG7QGFyAuxsJNWLggRGFAXZrgFvwBLJ/48U3hs7oyD1OYnvRNbieTyfle51Tn9D2TTE9y0yEIIYQQQgghhBBCCCGEEMMDvADeAefAb+xcAHNgFkYCMANOgMsW8401OgMOY+26GnkD3OLDPIwEqi+MB7F2+12K/4AfF2EkUJ21XjyYQ1hcdry++VMPIHID7FoMxGu+N8dhepegZd5aDHzBj7H+CM+dz4Qzi4HU5edl0ZlvAMBeona3lkFqKep8g+hcPwXQDQUwMApgYBTAVAJ4dM+kcbnZQv8M+AhcLfRHDfod4MPS+MfOfrL0fQYwt9zzaaH/VKM/XKGPYT3mvaOfLH1u/ZLkDpC4W3i1Ylyr/leN/usK/c8a/TdHP1n63PolyR3AeiCLHniakP9J6LcT+nsPPyXr0tuBLHoUgP+BLHoUgP+BLHomHkDdXcAffU1gAwLIql8wLreO+5pABHiSkP8NNQBbCf1Dnb6k/9z65d4Pd/vDMaEAZjn164wCqAhDQQIPPQqgGQVQEYaCBIUDuDcG4FZQq37sAWxbAijtp42+OAqgIgwFCTz0KIBmFEBFGAoSeOhRAIMHsLVuy0oF0BxAqpt7q2//vVByAiiAZhRARRgKEnjoUQBrGwArxlcAnhOgvg0k+WQpfmZsM1EADfq6J0tHK/Sxc87SaFWLl744pSfA/0+WmloTZ4t2xIvM1kQFEOnXdXs/Vn1xxj4BRu5/9BNg5P7N/S/rNgHW1b+hD97U/2KdAFW//2nBfv8i/q0+uvTBm/pfWgRwalyGWvv9i/i3+ujcN28Y1xrAVY38e9++rf47+7AWqsS49PBAppT/zj4UQD0KoEIBlJ5ARAGUCcC67r40vnTXrS/fyf86B2Bdd586vHbqtk9Rqfcm+gzAuu7eWfyhyb27WbQvv9R7E70FMBVQAMOiAAZGAQyMAtiAAFKb9u0Vdb4BAK8StbuxDBL3iZ76tpUnLfeOdtm2Mm487c0U945e5sBiQFsX+3INPLea2Nfm3S7EGr5ua2R/sfG0B1PcO/q6dfGXzOzGjaeBz8DdhH6E5y3PhLtFrQ7Mlx0hhBBCCCGEEEIIIYQQIhThH7enMVyIeb/aAAAAAElFTkSuQmCC"
              alt="external-barcode-library-tanah-basah-basic-outline-tanah-basah"
            />
          </div>

          <h2 class="!text-white">Quét Barcode</h2>
          <p class="text-white max-w-[220px]">Quét mã sản phẩm để nhập nè</p>
        </div>
        <button class="absolute bottom-4 right-4">
          <i
            class="pi pi-arrow-right text-white glass-card p-3 rounded-full border-none"
          ></i>
        </button>
      </div>
      <div class="relative bg-white card_box-shadow w-full max-w-[360px] rounded-2xl transition-all duration-200 ease-out
    active:scale-95">
        <div class="flex flex-col items-center px-4 py-9 gap-4">
          <div class="p-5 rounded-xl bg-[#e7e7f1]">
            <img
              src="../assets/image/product_svg_96.svg"
              alt="external-barcode-library-tanah-basah-basic-outline-tanah-basah"
            />
          </div>

          <h2>List Products</h2>
          <p class="max-w-[220px]">Duyệt qua danh mục kho hàng để thực hiện tác vụ</p>
        </div>
        <button class="absolute bottom-4 right-4 bg-[#e7e7f1] rounded-full">
          <i class="pi pi-arrow-right text-color p-3 border-none"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import Nav from '../components/Common/Nav.vue';
import { useRouter } from 'vue-router';
import { getProductCache, setProductCache } from '../services/productCache';
import { getAllProducts } from '../services/appScriptService';

const router = useRouter();
const preLoadDone = ref(false);
const isPreloadingProducts = ref(false);
const preLoadError = ref("")

const selectedBranch = computed(() => { 
  const branch = sessionStorage.getItem("selectedBranch");

  return branch || null;
});
function navigateToScanner(){
   router.push({
    path:"/scanner",
    query:{
      autoStart:"1"
    }
   })

}
function navigateProductList(){
  router.push("/product");
}


onMounted(()=>{
  preloadProductsInBackGround();
})

async function  preloadProductsInBackGround(){
if (!selectedBranch.value) {
    router.push("/");
    return;
  }
  const cached = getProductCache(selectedBranch.value);
  console.log("cached:",Object.keys(cached).length);

  if(cached){
    preLoadDone.value= true;
    return;
  }
  isPreloadingProducts.value = true;
  preLoadError.value= "";
  try{
    const products = await getAllProducts(selectedBranch.value);
    setProductCache(selectedBranch.value,products);
    preLoadDone.value=true;
    console.log("products action:", products);
  }catch(e){
    console.log("Preload err:", e);
    preLoadError.value = "Can't preload data";
  }finally{
    isPreloadingProducts.value=false;
  }
}


</script>
