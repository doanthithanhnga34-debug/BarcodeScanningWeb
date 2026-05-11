<template>
  <Nav/>
  <div class="screen-bg">
    <div class="mb-5 flex justify-start">
      <div
        class="inline-flex items-center gap-2 h-[28px] mt-5 ml-3 p-4 glass-card rounded-lg mb-3 shadow-2xs"
      >
        <i class="pi pi-shop text-color"></i>
        <span>Chi nhánh {{ selectedBranch }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-5 items-center">
      <div @click="click" class="relative bg-[#827aeb] w-90 rounded-2xl card_box-shadow transition-all duration-200 ease-out
    active:scale-95">
        <div class="flex flex-col items-center px-4 py-9 gap-4">
          <div class="p-4 glass-card rounded-xl">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADRUlEQVR4nO2cXVLUQBSFG7QGFyAuxsJNWLggRGFAXZrgFvwBLJ/48U3hs7oyD1OYnvRNbieTyfle51Tn9D2TTE9y0yEIIYQQQgghhBBCCCGEEMMDvADeAefAb+xcAHNgFkYCMANOgMsW8401OgMOY+26GnkD3OLDPIwEqi+MB7F2+12K/4AfF2EkUJ21XjyYQ1hcdry++VMPIHID7FoMxGu+N8dhepegZd5aDHzBj7H+CM+dz4Qzi4HU5edl0ZlvAMBeona3lkFqKep8g+hcPwXQDQUwMApgYBTAVAJ4dM+kcbnZQv8M+AhcLfRHDfod4MPS+MfOfrL0fQYwt9zzaaH/VKM/XKGPYT3mvaOfLH1u/ZLkDpC4W3i1Ylyr/leN/usK/c8a/TdHP1n63PolyR3AeiCLHniakP9J6LcT+nsPPyXr0tuBLHoUgP+BLHoUgP+BLHomHkDdXcAffU1gAwLIql8wLreO+5pABHiSkP8NNQBbCf1Dnb6k/9z65d4Pd/vDMaEAZjn164wCqAhDQQIPPQqgGQVQEYaCBIUDuDcG4FZQq37sAWxbAijtp42+OAqgIgwFCTz0KIBmFEBFGAoSeOhRAIMHsLVuy0oF0BxAqpt7q2//vVByAiiAZhRARRgKEnjoUQBrGwArxlcAnhOgvg0k+WQpfmZsM1EADfq6J0tHK/Sxc87SaFWLl744pSfA/0+WmloTZ4t2xIvM1kQFEOnXdXs/Vn1xxj4BRu5/9BNg5P7N/S/rNgHW1b+hD97U/2KdAFW//2nBfv8i/q0+uvTBm/pfWgRwalyGWvv9i/i3+ujcN28Y1xrAVY38e9++rf47+7AWqsS49PBAppT/zj4UQD0KoEIBlJ5ARAGUCcC67r40vnTXrS/fyf86B2Bdd586vHbqtk9Rqfcm+gzAuu7eWfyhyb27WbQvv9R7E70FMBVQAMOiAAZGAQyMAtiAAFKb9u0Vdb4BAK8StbuxDBL3iZ76tpUnLfeOdtm2Mm487c0U945e5sBiQFsX+3INPLea2Nfm3S7EGr5ua2R/sfG0B1PcO/q6dfGXzOzGjaeBz8DdhH6E5y3PhLtFrQ7Mlx0hhBBCCCGEEEIIIYQQIhThH7enMVyIeb/aAAAAAElFTkSuQmCC"
              alt="external-barcode-library-tanah-basah-basic-outline-tanah-basah"
            />
          </div>

          <h2 class="!text-white">Quét Barcode</h2>
          <p class="text-white w-50">Quét mã sản phẩm để nhập nè</p>
        </div>
        <button class="absolute bottom-4 right-4">
          <i
            class="pi pi-arrow-right text-white glass-card p-3 rounded-full border-none"
          ></i>
        </button>
      </div>
      <div class="relative bg-white card_box-shadow w-90 rounded-2xl transition-all duration-200 ease-out
    active:scale-95">
        <div class="flex flex-col items-center px-4 py-9 gap-4">
          <div class="p-5 rounded-xl bg-[#e7e7f1]">
            <img
              src="../assets/image/product_svg_96.svg"
              alt="external-barcode-library-tanah-basah-basic-outline-tanah-basah"
            />
          </div>

          <h2>List Products</h2>
          <p class="w-50">Duyệt qua danh mục kho hàng để thực hiện tác vụ</p>
        </div>
        <button class="absolute bottom-4 right-4 bg-[#e7e7f1] rounded-full">
          <i class="pi pi-arrow-right text-color p-3 border-none"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Nav from '../components/Common/Nav.vue';
const selectedBranch = computed(() => { 
  const branch = sessionStorage.getItem("selectedBranch");

  return branch || null;
});
function click(){
    console.log("clicked")
}
</script>
