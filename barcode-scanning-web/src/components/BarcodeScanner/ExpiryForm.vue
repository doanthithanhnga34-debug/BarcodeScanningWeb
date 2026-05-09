# Scanner Expiry Modal (Vue + Tailwind + PrimeVue) ```vue
<template>
  <div
    class="fixed inset-0 z-[999] flex items-end bg-black/40 backdrop-blur-sm"
    @click.self="closeModal"
  >
    <div
      class="sm:max-w-md sm:rounded-[32px] sm:p-6 max-h-[90dvh] w-full rounded-t-[32px] bg-white p-5 animate-slideUp"
    >
      <div class="mb-4 flex justify-center">
        <div class="h-1.5 w-16 rounded-full bg-gray-300"></div>
      </div>
      <!-- title -->
      <h2 class="text-center text-xl font-bold sm:text-2xl">Product Info</h2>
      <div class="mt-6 flex flex-col gap-2">
        <p
          class="mb-2 text-left text-xs font-bold tracking-wide text-gray-400 text-ellipsis"
        >
          Product Name
        </p>

        <div
          class="sm:text-base text-sm rounded-2xl bg-violet-50 p-4 text-color font-bold"
        >
          {{ productName }}
        </div>
      </div>
      <div class="mt-6 flex flex-col gap-2">
        <p class="mb-2 text-left tracking-wide text-xs font-bold text-gray-400">
          Barcode
        </p>

        <div
          class="sm:text-base break-all rounded-2xl text-sm bg-violet-50 p-4 text-color font-bold"
        >
          {{ barcode }}
        </div>
      </div>
      <!-- expiry -->
      <div class="mt-6 flex flex-col gap-2">
        <p class="mb-2 text-left text-xs font-bold tracking-wide text-gray-400">
          Expiry Date
        </p>

        <InputMask
          v-model="expiryDate"
          mask="99/99/9999"
          placeholder="DD/MM/YYYY"
          inputmode="numeric"
          class="expiry-input w-full"
          required
        />
        <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-500">
          {{ errorMessage }}
        </p>
      </div>
      <!-- save -->
      <button
        class="flex items-center justify-center gap-2 mt-8 w-full rounded-2xl py-4 font-bold text-white button border-color transition active:scale-[0.98]"
        @click="handleSave"
        :disabled="isSaving"
      >
        {{ isSaving ? "Saving..." : "Save" }}
        <i v-if="isSaving" class="pi pi-spin pi-spinner"></i>
      </button>

      <!-- scan again -->
      <button
        @click="scanAgainBarcode"
        class="mt-4 w-full rounded-2xl border border-gray-200 py-4 font-bold text-color transition active:scale-[0.98]"
      >
        Scan Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import InputMask from "primevue/inputmask";
import { saveExpiryToSheet } from "../../services/appScriptService";
import { useToast } from "primevue/usetoast";
import { addOfflineExpiryQueue } from "../../services/offlineExpiryQueue";
import { syncOfflineExpiryQueue } from "../../services/offlineExpirySync";

const toast = useToast();
const props = defineProps({
  barcode: String,
  productName: String,
});
const emit = defineEmits(["close", "save", "scan-again"]);

const expiryDate = ref("");
const isSaving = ref(false);
const errorMessage = ref("");
const isLoading = ref(false);

function validateDate(value) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(value)) {
    return "Invalid format";
  }
  const [, dayStr, monthStr, yearStr] = value.match(regex);

  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (month < 1 || month > 12) {
    return "Invalid month";
  }

  const daysInMonth = new Date(year, month, 0).getDate();

  if (day < 1 || day > daysInMonth) {
    return "Invalid day";
  }

  return "";
}
const selectedBranch = computed(() => {
  const branchName = sessionStorage.getItem("selectedBranch");
  return branchName;
});

async function handleSave() {
  const error = validateDate(expiryDate.value);
  if (error) {
    errorMessage.value = error;
    return;
  }

  errorMessage.value = "";
  if (!expiryDate.value) {
    errorMessage.value = "Enter expiry date please";
    return;
  }

  if (!selectedBranch.value) {
    errorMessage.value = "The selected branch was not found.";
    return;
  }
  isSaving.value = true;
  errorMessage.value = "";
  const payload = {
    branchName: selectedBranch.value,
    barcode: props.barcode,
    productName: props.productName,
    expiryDate: expiryDate.value,
  };
  try {
    if (!navigator.onLine) {
      addOfflineExpiryQueue(payload);
      toast.add({
        severity: "warn",
        summary: "Saved temporarily",
        detail:
          "Internet connection lost. Data will sync when the internet is restored.",
        life: 3000,
      });
      emit("save", payload);

      setTimeout(() => {
        emit("close");
      }, 500);
      return;
    }

    const result = await saveExpiryToSheet(payload);

    toast.add({
      severity: "success",
      summary: "Success!",
      detail:
        result.action === "updated"
          ? "Updated expiry date successfully."
          : "Added successfully",
      life: 2500,
    });

    emit("save", result.data);
    setTimeout(() => {
      emit("close");
    }, 500);
    emit("scan-again");
  } catch (error) {
    console.error(error);

    addOfflineExpiryQueue(payload);

    toast.add({
      severity: "warn",
      summary: "Saved temporarily",
      detail:
        "Unable to connect to the server. Data will resynchronize automatically later.",
      life: 3500,
    });
    emit("save", payload);
    setTimeout(() => {
      emit("close");
    }, 500);

    errorMessage.value = error.message || " Save Failed";
    toast.add({
      severity: "error",
      summary: "Lưu thất bại",
      detail: error.message || "Save failed ",
      life: 3000,
    });
  } finally {
    isSaving.value = false;
  }
}

async function scanAgainBarcode() {
  emit("scan-again");
  emit("close");
}
function closeModal() {
  emit("close");
}
</script>
